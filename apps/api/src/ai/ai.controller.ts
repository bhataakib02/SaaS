import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('forecast')
    async getForecast(@Request() req: any) {
        return this.aiService.getDemandForecast(req.user.companyId);
    }

    @Get('alerts')
    async getAlerts(@Request() req: any) {
        return this.aiService.getPredictiveAlerts(req.user.companyId);
    }

    @Get('savings')
    async getSavings(@Request() req: any) {
        return this.aiService.getPriceSuggestions(req.user.companyId);
    }
}
