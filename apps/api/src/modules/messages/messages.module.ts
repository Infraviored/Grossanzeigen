import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MessagesService } from './messages.service.js';
import { MessagesController } from './messages.controller.js';
import { TextModerationService } from '../moderation/text.service.js';

@Module({
  imports: [PrismaModule],
  providers: [MessagesService, TextModerationService],
  controllers: [MessagesController],
})
export class MessagesModule {}


