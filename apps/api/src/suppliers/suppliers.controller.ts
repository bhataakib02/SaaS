import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

import { PerformanceService } from './performance.service';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
    constructor(
        private readonly suppliersService: SuppliersService,
        private readonly performanceService: PerformanceService
    ) { }

    @Get('performance')
    getPerformance(@Request() req: any) {
        return this.performanceService.getAllPerformances(req.user.companyId);
    }

    @Get(':id/performance')
    getSupplierPerformance(@Param('id') id: string) {
        return this.performanceService.getSupplierPerformance(id);
    }


    @Post()
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    create(@Request() req: any, @Body() createSupplierDto: any) {
        return this.suppliersService.create({
            ...createSupplierDto,
            companyId: req.user.companyId,
        });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.suppliersService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    update(@Param('id') id: string, @Body() updateSupplierDto: any) {
        return this.suppliersService.update(id, updateSupplierDto);
    }

    @Delete(':id')
    @Roles(Role.COMPANY_ADMIN)
    remove(@Param('id') id: string) {
        return this.suppliersService.remove(id);
    }
}
