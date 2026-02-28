import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class IngestionService {
    private readonly mappingKeywords = {
        name: ['name', 'product', 'item', 'description', 'label'],
        sku: ['sku', 'code', 'part number', 'id', 'reference'],
        price: ['price', 'cost', 'rate', 'amount', 'value'],
        category: ['category', 'group', 'type', 'department', 'family'],
        unit: ['unit', 'pack', 'size', 'measure', 'qty'],
    };

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

        // Preview the first 5 rows
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

    private suggestMappings(headers: string[]) {
        const suggestions: Record<string, string> = {};

        headers.forEach((header, index) => {
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
