import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { IsArray, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class MarkReadDto {
  @IsArray()
  @IsString({ each: true })
  ids!: string[];
}

@UseGuards(SessionAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(req: any) {
    const userId: string = req.user.userId;
    const notifications = await this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 });
    return { notifications };
  }

  @Post('read')
  async markRead(@Body() body: MarkReadDto, req: any) {
    const userId: string = req.user.userId;
    await this.prisma.notification.updateMany({ where: { id: { in: body.ids }, userId }, data: { readAt: new Date() } });
    return { success: true };
  }
}


