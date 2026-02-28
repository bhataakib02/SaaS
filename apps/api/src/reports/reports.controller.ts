import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';


@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('inventory/csv')
    async exportInventory(@Request() req: any, @Res() res: Response) {
        const csv = await this.reportsService.generateInventoryCsv(req.user.companyId);
        res.set('Content-Type', 'text/csv');
        res.attachment(`inventory-report-${new Date().getTime()}.csv`);
        return res.send(csv);
    }

    @Get('spend/csv')
    async exportSpend(@Request() req: any, @Res() res: Response) {
        const csv = await this.reportsService.generateSpendCsv(req.user.companyId);
        res.set('Content-Type', 'text/csv');
        res.attachment(`spend-report-${new Date().getTime()}.csv`);
        return res.send(csv);
    }
}
