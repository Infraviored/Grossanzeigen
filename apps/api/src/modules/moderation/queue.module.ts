import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { QueueService } from './queue.service.js';
import { QueueController } from './queue.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [QueueService],
  controllers: [QueueController],
  exports: [QueueService],
})
export class QueueModule {}


