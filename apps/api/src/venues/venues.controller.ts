import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('venues')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VenuesController {
    constructor(private readonly venuesService: VenuesService) { }

    @Post()
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    create(@Request() req: any, @Body() createVenueDto: any) {
        return this.venuesService.create({
            ...createVenueDto,
            companyId: req.user.companyId,
        });
    }

    @Get()
    findAll(@Request() req: any) {
        return this.venuesService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.venuesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    update(@Param('id') id: string, @Body() updateVenueDto: any) {
        return this.venuesService.update(id, updateVenueDto);
    }

    @Delete(':id')
    @Roles(Role.COMPANY_ADMIN)
    remove(@Param('id') id: string) {
        return this.venuesService.remove(id);
    }
}
