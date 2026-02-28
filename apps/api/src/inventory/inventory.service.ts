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

    async updateStock(id: string, quantity: number) {
        return this.prisma.inventory.update({
            where: { id },
            data: { quantity },
        });
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
}
