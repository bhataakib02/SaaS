import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async generateInventoryCsv(companyId: string) {
        const inventory = await this.prisma.inventory.findMany({
            where: { companyId },
            include: { product: true, venue: true },
        });

        const headers = ['Product', 'SKU', 'Venue', 'Quantity', 'Min Stock', 'Updated At'];
        const rows = inventory.map(item => [
            item.product.name,
            item.product.sku || 'N/A',
            item.venue?.name || 'Main',
            item.quantity.toString(),
            (item.minStock || 0).toString(),
            item.updatedAt.toISOString(),
        ]);

        return this.convertToCsv(headers, rows);
    }

    async generateSpendCsv(companyId: string) {
        const orders = await this.prisma.purchaseOrder.findMany({
            where: { companyId, status: 'DELIVERED' },
            include: { supplier: true, items: true },
        });

        const headers = ['Order ID', 'Supplier', 'Total Amount', 'Status', 'Date'];
        const rows = orders.map(order => [
            order.id,
            order.supplier.name,
            order.total.toString(),
            order.status,
            order.createdAt.toISOString(),
        ]);

        return this.convertToCsv(headers, rows);
    }

    private convertToCsv(headers: string[], rows: string[][]) {
        const headerRow = headers.join(',');
        const contentRows = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','));
        return [headerRow, ...contentRows].join('\n');
    }
}
