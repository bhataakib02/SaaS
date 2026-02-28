import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PerformanceService } from './performance.service';

@Module({
    providers: [SuppliersService, PerformanceService],
    controllers: [SuppliersController],
    exports: [SuppliersService, PerformanceService],
})
export class SuppliersModule { }
