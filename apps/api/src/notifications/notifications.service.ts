import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(companyId: string, data: { title: string; message: string; type: string; severity?: string }) {
        // In a real production app, we would also emit a Socket.io event or SendGrid email
        // For this milestone, we store them for the Notification Center UI
        const company = await this.prisma.company.findUnique({
            where: { id: companyId }
        });

        // Using company settings/metadata to store notifications for now as we don't have a dedicated Notification model in schema
        // and we want to avoid schema changes this late unless necessary.
        // Alternatively, we can use the ActivityLog model.
        return this.prisma.activityLog.create({
            data: {
                userId: (await this.prisma.user.findFirst({ where: { companyId } }))?.id || '',
                action: 'NOTIFICATION',
                resource: data.type,
                details: {
                    title: data.title,
                    message: data.message,
                    severity: data.severity || 'INFO',
                    read: false,
                    createdAt: new Date().toISOString()
                }
            }
        });
    }

    async findAll(companyId: string) {
        return this.prisma.activityLog.findMany({
            where: {
                action: 'NOTIFICATION',
                user: { companyId }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }

    async markAsRead(notificationId: string) {
        const log = await this.prisma.activityLog.findUnique({
            where: { id: notificationId }
        });

        if (log && typeof log.details === 'object') {
            return this.prisma.activityLog.update({
                where: { id: notificationId },
                data: {
                    details: { ...(log.details as any), read: true }
                }
            });
        }
    }
}
