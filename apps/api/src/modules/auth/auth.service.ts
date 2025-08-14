import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import argon2 from 'argon2';
import crypto from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        roles: ['USER'],
      },
      select: { id: true, email: true, roles: true, createdAt: true },
    });
    // Issue verification token (24h)
    await this.createVerificationToken(user.id);
    return user;
  }

  async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        userAgent: userAgent ?? 'api',
        ipAddress: ipAddress ?? '0.0.0.0',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      select: { token: true, expiresAt: true },
    });
    // Record device and flag unusual login (placeholder)
    if (userAgent || ipAddress) {
      const deviceIdentifier = `${userAgent ?? ''}|${ipAddress ?? ''}`.slice(0, 255);
      const existingDevice = await this.prisma.device.findFirst({ where: { userId: user.id, identifier: deviceIdentifier } });
      if (!existingDevice) {
        await this.prisma.device.create({ data: { userId: user.id, identifier: deviceIdentifier } });
        // TODO: send email notification about new login/device (placeholder)
      }
    }
    return { user: { id: user.id, email: user.email, roles: user.roles }, session };
  }

  async logout(token: string) {
    await this.prisma.session.delete({ where: { token } }).catch(() => undefined);
    return { success: true } as const;
  }

  async createVerificationToken(userId: string) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await this.prisma.verificationToken.create({ data: { userId, token, expiresAt } });
    // TODO: send email with token link
    return { token, expiresAt };
  }

  async verifyEmail(token: string) {
    const row = await this.prisma.verificationToken.findUnique({ where: { token } });
    if (!row) throw new BadRequestException('Invalid token');
    if (row.expiresAt < new Date()) throw new BadRequestException('Token expired');
    await this.prisma.user.update({ where: { id: row.userId }, data: { emailVerifiedAt: new Date() } as any });
    await this.prisma.verificationToken.deleteMany({ where: { userId: row.userId } });
    return { success: true } as const;
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    await this.prisma.verificationToken.deleteMany({ where: { userId: user.id } });
    return await this.createVerificationToken(user.id);
  }

  async isVerified(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { emailVerifiedAt: true } });
    return !!user?.emailVerifiedAt;
  }
}


