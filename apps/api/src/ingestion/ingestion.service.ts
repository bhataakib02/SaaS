import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngestionService {
    private readonly mappingKeywords = {
        name: ['name', 'product', 'item', 'description', 'label'],
        sku: ['sku', 'code', 'part number', 'id', 'reference'],
        price: ['price', 'cost', 'rate', 'amount', 'value'],
        category: ['category', 'group', 'type', 'department', 'family'],
        unit: ['unit', 'pack', 'size', 'measure', 'qty'],
    };

    constructor(private prisma: PrismaService) { }

    async analyzeFile(buffer: Buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        if (!data || data.length === 0) {
            throw new Error('File is empty');
        }

        const headers = data[0].map((h: any) => h?.toString().trim());
        const suggestions = this.suggestMappings(headers);

        const preview = data.slice(1, 6).map(row => {
            const obj: any = {};
            headers.forEach((h, i) => {
                obj[h] = row[i];
            });
            return obj;
        });

        return {
            headers,
            suggestions,
            preview,
            rowCount: data.length - 1
        };
    }

    async ingestData(companyId: string, supplierId: string, mapping: any, data: any[]) {
        const results = {
            created: 0,
            updated: 0,
            skipped: 0
        };

        for (const row of data) {
            try {
                const name = row[mapping.name];
                const sku = row[mapping.sku]?.toString();
                const price = row[mapping.price] ? parseFloat(row[mapping.price]) : 0;

                if (!name || !sku) {
                    results.skipped++;
                    continue;
                }

                await this.prisma.$transaction(async (tx) => {
                    const existing = await tx.product.findUnique({
                        where: { companyId_sku: { companyId, sku } }
                    });

                    if (existing) {
                        await tx.product.update({
                            where: { id: existing.id },
                            data: {
                                name,
                                basePrice: price,
                                updatedAt: new Date(),
                            }
                        });
                        results.updated++;
                    } else {
                        await tx.product.create({
                            data: {
                                name,
                                sku,
                                basePrice: price,
                                supplierId,
                                companyId,
                                unit: 'BOTTLE' // Default for now
                            }
                        });
                        results.created++;
                    }

                    // Log the activity
                    await tx.activityLog.create({
                        data: {
                            userId: 'SYSTEM', // Better to pass real user ID
                            action: existing ? 'UPDATE_PRODUCT_INGEST' : 'CREATE_PRODUCT_INGEST',
                            resource: 'PRODUCT',
                            details: { sku, price }
                        }
                    });
                });
            } catch (err) {
                console.error(`Failed to ingest row: ${JSON.stringify(row)}`, err);
                results.skipped++;
            }
        }

        return results;
    }

    private suggestMappings(headers: string[]) {
        const suggestions: Record<string, string> = {};

        headers.forEach((header) => {
            const lowerHeader = header.toLowerCase();

            for (const [key, keywords] of Object.entries(this.mappingKeywords)) {
                if (keywords.some(kw => lowerHeader.includes(kw))) {
                    if (!suggestions[key]) {
                        suggestions[key] = header;
                    }
                }
            }
        });

        return suggestions;
    }
}

