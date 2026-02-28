import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerformanceService {
    constructor(private prisma: PrismaService) { }

    async getSupplierPerformance(supplierId: string) {
        const pos = await this.prisma.purchaseOrder.findMany({
            where: { supplierId, status: 'DELIVERED' },
            include: { items: true },
        });

        if (pos.length === 0) {
            return { rating: 0, grade: 'N/A', insights: 'No delivery history available yet.' };
        }

        // Lead Time Analysis (Order date vs Completion date)
        const leadTimes = pos.map(po => {
            const start = po.createdAt.getTime();
            const end = po.updatedAt.getTime();
            return (end - start) / (1000 * 60 * 60 * 24); // Days
        });

        const avgLeadTime = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;

        // Price Volatility (Standard Deviation of Item Prices)
        const prices: number[] = [];
        pos.forEach(po => po.items.forEach(item => prices.push(Number(item.price))));
        const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

        // Scoring logic (simplified AI heuristic)
        let score = 100;
        if (avgLeadTime > 7) score -= 20; // Late deliveries
        if (avgLeadTime > 14) score -= 30; // Very late

        // Grade mapping
        let grade = 'A';
        if (score < 90) grade = 'B';
        if (score < 70) grade = 'C';
        if (score < 50) grade = 'D';

        return {
            supplierId,
            rating: score / 20, // 0-5 stars
            grade,
            avgLeadTime: `${avgLeadTime.toFixed(1)} days`,
            reliability: score >= 80 ? 'HIGH' : 'MEDIUM',
            insights: score >= 90
                ? 'Excellent on-time delivery record.'
                : score >= 70
                    ? 'Reliable, but lead times vary.'
                    : 'Consider alternative suppliers for time-sensitive orders.'
        };
    }

    async getAllPerformances(companyId: string) {
        const suppliers = await this.prisma.supplier.findMany({
            where: { companyId }
        });

        const perfData = await Promise.all(
            suppliers.map(s => this.getSupplierPerformance(s.id))
        );

        return suppliers.map((s, i) => ({
            ...s,
            performance: perfData[i]
        }));
    }
}
