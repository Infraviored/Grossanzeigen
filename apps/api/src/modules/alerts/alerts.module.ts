import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AlertsService } from './alerts.service.js';
import { AlertsController } from './alerts.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}


