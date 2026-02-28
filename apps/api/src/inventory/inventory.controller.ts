import { Controller, Get, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get()
    findAll(@Request() req: any, @Query('venueId') venueId?: string) {
        return this.inventoryService.findAll(req.user.companyId, venueId);
    }

    @Get('low-stock')
    getLowStock(@Request() req: any) {
        return this.inventoryService.getLowStock(req.user.companyId);
    }

    @Patch(':id/stock')
    @Roles(Role.COMPANY_ADMIN, Role.INVENTORY_MANAGER, Role.STAFF)
    updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
        return this.inventoryService.updateStock(id, quantity);
    }
}
