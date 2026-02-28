import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.purchaseOrder.create({
            data: {
                ...data,
                status: 'DRAFT',
            },
        });
    }

    async findAll(companyId: string, venueId?: string) {
        return this.prisma.purchaseOrder.findMany({
            where: {
                companyId,
                venueId: venueId || undefined,
            },
            include: {
                venue: true,
                supplier: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                venue: true,
                supplier: true,
                items: true,
            },
        });
    }

    async updateStatus(id: string, status: any) {
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status },
        });
    }
}
