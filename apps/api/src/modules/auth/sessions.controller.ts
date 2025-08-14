import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from './session.guard.js';

@UseGuards(SessionAuthGuard)
@Controller('me/sessions')
export class SessionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(req: any) {
    const userId: string = req.user.userId;
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      select: { token: true, createdAt: true, expiresAt: true, userAgent: true, ipAddress: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { sessions };
  }

  @Delete(':token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@Param('token') token: string, req: any) {
    const userId: string = req.user.userId;
    await this.prisma.session.deleteMany({ where: { token, userId } });
    return;
  }
}


