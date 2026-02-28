import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post('checkout')
    @Roles(Role.COMPANY_ADMIN)
    async createCheckout(@Request() req: any, @Body('priceId') priceId: string) {
        return this.billingService.createCheckoutSession(req.user.companyId, priceId);
    }


    @Get('status')
    @Roles(Role.COMPANY_ADMIN)
    async getStatus(@Request() req: any) {
        return this.billingService.getSubscriptionStatus(req.user.companyId);
    }
}
