import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ModerationService } from './moderation.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class ReportDto { subjectType!: string; subjectId!: string; reason!: string }

@UseGuards(SessionAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly moderation: ModerationService) {}

  @Post()
  async create(@Body() dto: ReportDto, req: any) {
    const reporterId: string = req.user.userId;
    return await this.moderation.createReport(reporterId, dto.subjectType, dto.subjectId, dto.reason);
  }
}


