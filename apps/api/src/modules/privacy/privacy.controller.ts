import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class ExportRequestDto { scope?: 'metadata' | 'full' }
class DeleteRequestDto { reason?: string }

@UseGuards(SessionAuthGuard)
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('export')
  async requestExport(req: any, @Body() dto: ExportRequestDto) {
    const userId: string = req.user.userId;
    // Track export request; processing happens offline
    await this.prisma.auditLog.create({ data: { actorId: userId, action: 'privacy:export_requested', details: { scope: dto.scope ?? 'metadata' } as any } });
    return { success: true } as const;
  }

  @Post('delete')
  async requestDeletion(req: any, @Body() dto: DeleteRequestDto) {
    const userId: string = req.user.userId;
    // Track deletion request; processing happens offline with grace period
    await this.prisma.auditLog.create({ data: { actorId: userId, action: 'privacy:deletion_requested', details: { reason: dto.reason } as any } });
    return { success: true } as const;
  }
}


