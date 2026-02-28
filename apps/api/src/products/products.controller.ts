import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    create(@Request() req: any, @Body() createProductDto: any) {
        return this.productsService.create({
            ...createProductDto,
            companyId: req.user.companyId,
        });
    }

    @Get()
    findAll(@Request() req: any, @Query() query: any) {
        return this.productsService.findAll(req.user.companyId, query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Roles(Role.COMPANY_ADMIN)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
