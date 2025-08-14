import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ModerationService } from './moderation.service.js';
import { ReportsController } from './reports.controller.js';
import { EnforcementController } from './enforcement.controller.js';
import { ModerationAdminController } from './admin.controller.js';
import { EnforcementService } from './enforcement.service.js';
import { QueueModule } from './queue.module.js';

@Module({
  imports: [PrismaModule, QueueModule],
  providers: [ModerationService, EnforcementService],
  controllers: [ReportsController, EnforcementController, ModerationAdminController],
  exports: [ModerationService],
})
export class ModerationModule {}


