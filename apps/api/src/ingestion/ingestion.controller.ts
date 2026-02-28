import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException, Request, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) { }

    @Post('analyze')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    @UseInterceptors(FileInterceptor('file'))
    async analyzeFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            return await this.ingestionService.analyzeFile(file.buffer);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('ingest')
    @Roles(Role.COMPANY_ADMIN, Role.PROCUREMENT_MANAGER)
    async ingestData(@Request() req: any, @Body() body: any) {
        const { supplierId, mapping, data } = body;
        if (!supplierId || !mapping || !data) {
            throw new BadRequestException('Missing required fields for ingestion');
        }

        try {
            return await this.ingestionService.ingestData(
                req.user.companyId,
                supplierId,
                mapping,
                data
            );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

