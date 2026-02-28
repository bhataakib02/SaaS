import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.supplier.create({
            data,
        });
    }

    async findAll(companyId: string) {
        return this.prisma.supplier.findMany({
            where: { companyId },
        });
    }

    async findOne(id: string) {
        return this.prisma.supplier.findUnique({
            where: { id },
            include: { products: true },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.supplier.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.supplier.delete({
            where: { id },
        });
    }
}
