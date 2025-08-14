import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}

  async enqueue(subjectType: string, subjectId: string, reason: string) {
    return await this.prisma.moderationFlag.create({ data: { subjectType, subjectId, reason, status: 'OPEN' } });
  }

  async listOpen() {
    const items = await this.prisma.moderationFlag.findMany({ where: { status: 'OPEN' }, orderBy: { createdAt: 'asc' } });
    return { items };
  }

  async resolve(id: string, action: 'remove' | 'warn' | 'ban', actorId?: string) {
    await this.prisma.moderationFlag.update({ where: { id }, data: { status: 'RESOLVED' } });
    await this.prisma.auditLog.create({ data: { actorId, action: `queue:${action}`, details: { flagId: id } as any } });
    return { success: true } as const;
  }
}


