import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    @Roles(Role.SUPER_ADMIN)
    create(@Body() createCompanyDto: any) {
        return this.companiesService.create(createCompanyDto);
    }

    @Get()
    @Roles(Role.SUPER_ADMIN)
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.COMPANY_ADMIN)
    update(@Param('id') id: string, @Body() updateCompanyDto: any) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN)
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }
}
