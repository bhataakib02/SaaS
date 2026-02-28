import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getNotifications(@Request() req: any) {
        return this.notificationsService.findAll(req.user.companyId);
    }

    @Post(':id/read')
    async markRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }
}
