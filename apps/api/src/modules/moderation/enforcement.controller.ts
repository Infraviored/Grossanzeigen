import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { EnforcementService } from './enforcement.service.js';

class EnforceDto { userId!: string; type!: 'soft-ban' | 'hard-ban' | 'shadow-ban'; durationHours?: number; reason?: string }

// Placeholder admin-only; later gate with admin RBAC
@UseGuards(SessionAuthGuard, AdminGuard)
@Controller('enforcement')
export class EnforcementController {
  constructor(private readonly prisma: PrismaService, private readonly enforcement: EnforcementService) {}

  @Post()
  async enforce(@Body() dto: EnforceDto, req: any) {
    const actorId: string = req.user.userId;
    await this.prisma.auditLog.create({ data: { actorId, action: `enforce:${dto.type}`, details: { target: dto.userId, durationHours: dto.durationHours, reason: dto.reason } as any } });
    await this.enforcement.enforce(dto.userId, dto.type.toUpperCase() as any, dto.reason, dto.durationHours);
    return { success: true } as const;
  }
}


