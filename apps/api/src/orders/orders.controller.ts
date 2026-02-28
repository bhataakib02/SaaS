import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER, Role.STAFF)
    create(@Request() req: any, @Body() createOrderDto: any) {
        return this.ordersService.create({
            ...createOrderDto,
            companyId: req.user.companyId,
        });
    }

    @Get()
    findAll(@Request() req: any, @Query('venueId') venueId?: string) {
        return this.ordersService.findAll(req.user.companyId, venueId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    updateStatus(@Param('id') id: string, @Body('status') status: any) {
        return this.ordersService.updateStatus(id, status);
    }
}
