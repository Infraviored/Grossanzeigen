import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EnforcementService {
  constructor(private readonly prisma: PrismaService) {}

  async enforce(userId: string, type: 'SOFT_BAN' | 'HARD_BAN' | 'SHADOW_BAN', reason?: string, hours?: number) {
    const until = hours ? new Date(Date.now() + hours * 3600 * 1000) : null;
    return await this.prisma.enforcement.create({ data: { userId, type, reason, until: until as any } });
  }

  async isActive(userId: string, type?: string) {
    const where: any = { userId, active: true };
    if (type) where.type = type;
    const e = await this.prisma.enforcement.findFirst({ where });
    if (!e) return false;
    if (e.until && e.until < new Date()) {
      await this.prisma.enforcement.update({ where: { id: e.id }, data: { active: false } });
      return false;
    }
    return true;
  }
}


