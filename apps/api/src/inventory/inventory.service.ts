import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async findAll(companyId: string, venueId?: string) {
        return this.prisma.inventory.findMany({
            where: {
                companyId,
                venueId: venueId || undefined,
            },
            include: {
                product: {
                    include: { supplier: true },
                },
                venue: true,
            },
        });
    }

    async updateStock(id: string, quantity: number, userId: string, reason?: string) {
        const current = await this.prisma.inventory.findUnique({
            where: { id },
            include: { product: true }
        });

        if (!current) throw new Error('Inventory not found');

        const updated = await this.prisma.inventory.update({
            where: { id },
            data: { quantity },
        });

        await this.prisma.activityLog.create({
            data: {
                userId,
                action: 'STOCK_UPDATE',
                resource: `Inventory:${id}`,
                details: {
                    productName: current.product.name,
                    previousQuantity: current.quantity,
                    newQuantity: quantity,
                    diff: quantity - current.quantity,
                    reason: reason || 'Manual update',
                    timestamp: new Date().toISOString()
                }
            }
        });

        return updated;
    }


    async getLowStock(companyId: string) {
        const inventory = await this.prisma.inventory.findMany({
            where: {
                companyId,
            },
            include: {
                product: true,
                venue: true,
            },
        });

        return inventory.filter(item => item.quantity <= (item.minStock || 0));
    }

    async getAuditLogs(companyId: string, productId?: string) {
        return this.prisma.activityLog.findMany({
            where: {
                action: 'STOCK_UPDATE',
                user: { companyId },
                resource: productId ? { contains: productId } : undefined
            },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
}


