import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { RateLimitGuard } from '../ratelimit/ratelimit.guard.js';
import { SoftBanGuard } from '../moderation/softban.guard.js';

class SendMessageDto { conversationId!: string; text!: string }

@UseGuards(SessionAuthGuard, RateLimitGuard, SoftBanGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Post()
  async send(@Body() dto: SendMessageDto, req: any) {
    return await this.messages.send(req.user.userId, dto.conversationId, dto.text);
  }
}


