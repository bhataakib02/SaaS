import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.product.create({
            data,
        });
    }

    async findAll(companyId: string, query?: any) {
        const { search, category, supplierId } = query || {};
        return this.prisma.product.findMany({
            where: {
                companyId,
                supplierId: supplierId || undefined,
                category: category || undefined,
                OR: search ? [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                ] : undefined,
            },
            include: { supplier: true, priceHistory: true },
        });
    }

    async findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { supplier: true, priceHistory: true },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
