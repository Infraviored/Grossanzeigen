import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async flagText(subjectType: string, subjectId: string, reason: string) {
    return await this.prisma.moderationFlag.create({ data: { subjectType, subjectId, reason, status: 'OPEN' } });
  }

  async createReport(reporterId: string, subjectType: string, subjectId: string, reason: string) {
    return await this.prisma.report.create({ data: { reporterId, subjectType, subjectId, reason, status: 'OPEN' } });
  }

  async resolveReport(reportId: string, action: 'remove' | 'warn' | 'ban', actorId?: string) {
    await this.prisma.report.update({ where: { id: reportId }, data: { status: 'RESOLVED' } });
    await this.prisma.auditLog.create({ data: { actorId, action: `moderation:${action}`, details: { reportId } as any } });
    return { success: true } as const;
  }
}


