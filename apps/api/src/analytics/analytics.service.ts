import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getSpendSummary(companyId: string) {
        const pos = await this.prisma.purchaseOrder.findMany({
            where: {
                companyId,
                status: { in: ['APPROVED', 'DELIVERED'] },
            },
            include: {
                supplier: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const spendBySupplier: Record<string, number> = {};
        const spendByCategory: Record<string, number> = {};
        let totalSpend = 0;

        pos.forEach((po) => {
            const amount = Number(po.total);
            totalSpend += amount;

            // Aggregate by supplier
            const supplierName = po.supplier.name;
            spendBySupplier[supplierName] = (spendBySupplier[supplierName] || 0) + amount;

            // Aggregate by category
            po.items.forEach((item) => {
                const category = item.product.category || 'Uncategorized';
                const itemTotal = Number(item.price) * item.quantity;
                spendByCategory[category] = (spendByCategory[category] || 0) + itemTotal;
            });
        });

        return {
            totalSpend,
            spendBySupplier: Object.entries(spendBySupplier).map(([name, value]) => ({ name, value })),
            spendByCategory: Object.entries(spendByCategory).map(([name, value]) => ({ name, value })),
        };
    }

    async getDailySpendTrend(companyId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const pos = await this.prisma.purchaseOrder.findMany({
            where: {
                companyId,
                status: { in: ['APPROVED', 'DELIVERED'] },
                createdAt: { gte: startDate },
            },
            orderBy: { createdAt: 'asc' },
        });

        const dailySpend: Record<string, number> = {};

        pos.forEach((po) => {
            const dateKey = po.createdAt.toISOString().split('T')[0];
            dailySpend[dateKey] = (dailySpend[dateKey] || 0) + Number(po.total);
        });

        return Object.entries(dailySpend).map(([date, amount]) => ({
            date,
            amount,
        }));
    }
}
