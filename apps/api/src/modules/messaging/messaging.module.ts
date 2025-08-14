import { Module } from '@nestjs/common';
import { MessagingController } from './messaging.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MessagingGateway } from './gateway.js';

@Module({
  imports: [PrismaModule],
  controllers: [MessagingController],
  providers: [MessagingGateway],
})
export class MessagingModule {}


