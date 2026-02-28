import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('spend-summary')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    getSpendSummary(@Request() req: any) {
        return this.analyticsService.getSpendSummary(req.user.companyId);
    }

    @Get('spend-trend')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    getSpendTrend(@Request() req: any, @Query('days') days?: string) {
        return this.analyticsService.getDailySpendTrend(
            req.user.companyId,
            days ? parseInt(days, 10) : 30
        );
    }
}
