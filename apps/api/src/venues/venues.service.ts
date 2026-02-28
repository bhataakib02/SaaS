import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VenuesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.venue.create({
            data,
        });
    }

    async findAll(companyId: string) {
        return this.prisma.venue.findMany({
            where: { companyId },
        });
    }

    async findOne(id: string) {
        return this.prisma.venue.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.venue.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.venue.delete({
            where: { id },
        });
    }
}
