import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TextModerationService } from '../moderation/text.service.js';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService, private readonly textMod: TextModerationService) {}

  async send(senderId: string, conversationId: string, text: string) {
    const mod = this.textMod.check(text);
    if (mod.flagged) {
      await this.prisma.report.create({ data: { reporterId: senderId, subjectType: 'message', subjectId: conversationId, reason: mod.reason ?? 'flagged', status: 'OPEN' } });
    }
    return await this.prisma.message.create({ data: { senderId, conversationId, text } });
  }
}


