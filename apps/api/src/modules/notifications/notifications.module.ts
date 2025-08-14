import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}


