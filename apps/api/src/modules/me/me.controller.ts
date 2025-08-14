import { Body, Controller, Delete, Get, Put, UseGuards, HttpCode, HttpStatus, Param, UnauthorizedException, Req } from '@nestjs/common';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class ProfileUpdateDto {
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsUrl({ require_tld: false }) avatarUrl?: string | null;
  @IsOptional() @IsString() bio?: string | null;
}

class AddressesUpdateDto {
  addresses!: unknown;
}

function parseSessionTokenFromRequest(req: Request): string | undefined {
  const cookieHeader = req.headers['cookie'];
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('session='));
  if (!match) return undefined;
  return decodeURIComponent(match.substring('session='.length));
}

@UseGuards(SessionAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getMe(req: any) {
    const userId: string = req.user.userId;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, roles: true, createdAt: true, profile: true },
    });
    return { user };
  }

  @Get('profile')
  async getProfile(req: any) {
    const userId: string = req.user.userId;
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { userId: true, displayName: true, avatarUrl: true, bio: true, addresses: true },
    });
    return { profile };
  }

  @Put('profile')
  async updateProfile(@Body() dto: ProfileUpdateDto, req: any) {
    const userId: string = req.user.userId;
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: { displayName: dto.displayName, avatarUrl: dto.avatarUrl ?? null, bio: dto.bio ?? null },
      create: { userId, displayName: dto.displayName ?? 'User', avatarUrl: dto.avatarUrl ?? null, bio: dto.bio ?? null },
      select: { userId: true, displayName: true, avatarUrl: true, bio: true },
    });
    return { profile };
  }

  @Put('addresses')
  async updateAddresses(@Body() dto: AddressesUpdateDto, req: any) {
    const userId: string = req.user.userId;
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: { addresses: dto.addresses as any },
      create: { userId, displayName: 'User', addresses: dto.addresses as any },
      select: { userId: true, addresses: true },
    });
    return { profile };
  }

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


