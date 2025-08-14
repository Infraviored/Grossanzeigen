import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(orderId: string, initiatorId: string, reason: string) {
    return await this.prisma.auditLog.create({ data: { actorId: initiatorId, action: 'dispute:created', details: { orderId, reason } as any } });
  }

  async listForUser(userId: string) {
    return await this.prisma.auditLog.findMany({ where: { actorId: userId, action: 'dispute:created' }, orderBy: { createdAt: 'desc' } });
  }
}


