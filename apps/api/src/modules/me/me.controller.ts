import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UnauthorizedException, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Request } from 'express';

function parseSessionTokenFromRequest(req: Request): string | undefined {
  const cookieHeader = req.headers['cookie'];
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('session='));
  if (!match) return undefined;
  return decodeURIComponent(match.substring('session='.length));
}

@Controller('me')
export class MeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('sessions')
  async listSessions(@Req() req: Request) {
    const token = parseSessionTokenFromRequest(req);
    if (!token) throw new UnauthorizedException('Not authenticated');
    const current = await this.prisma.session.findUnique({ where: { token } });
    if (!current) throw new UnauthorizedException('Invalid session');
    const sessions = await this.prisma.session.findMany({
      where: { userId: current.userId },
      orderBy: { createdAt: 'desc' },
      select: { token: true, userAgent: true, ipAddress: true, createdAt: true, expiresAt: true },
    });
    return { sessions };
  }

  @Delete('sessions/:token')
  @HttpCode(HttpStatus.OK)
  async revokeSession(@Param('token') tokenToDelete: string, @Req() req: Request) {
    const token = parseSessionTokenFromRequest(req);
    if (!token) throw new UnauthorizedException('Not authenticated');
    const current = await this.prisma.session.findUnique({ where: { token } });
    if (!current) throw new UnauthorizedException('Invalid session');
    const target = await this.prisma.session.findUnique({ where: { token: tokenToDelete } });
    if (!target || target.userId !== current.userId) {
      // Do not reveal whether token exists
      return { success: true } as const;
    }
    await this.prisma.session.delete({ where: { token: tokenToDelete } }).catch(() => undefined);
    return { success: true } as const;
  }
}


