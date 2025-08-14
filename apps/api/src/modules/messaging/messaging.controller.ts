import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class SendMessageDto { @IsString() @IsNotEmpty() text!: string }

@UseGuards(SessionAuthGuard)
@Controller('conversations')
export class MessagingController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createConversation(req: any) {
    const userId = req.user.userId as string;
    const conv = await this.prisma.conversation.create({ data: { participants: { create: [{ userId }] } } });
    return { conversation: conv };
  }

  @Get(':id/messages')
  async listMessages(@Param('id') id: string) {
    const messages = await this.prisma.message.findMany({ where: { conversationId: id }, orderBy: { createdAt: 'asc' } });
    return { messages };
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, req: any) {
    const userId = req.user.userId as string;
    const msg = await this.prisma.message.create({ data: { conversationId: id, senderId: userId, text: dto.text } });
    return { message: msg };
  }
}


