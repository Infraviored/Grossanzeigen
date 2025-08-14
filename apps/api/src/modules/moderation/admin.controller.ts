import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@UseGuards(SessionAuthGuard, AdminGuard)
@Controller('admin/moderation')
export class ModerationAdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('reports')
  async listReports() {
    const reports = await this.prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
    return { reports };
  }

  @Patch('reports/:id')
  async updateReport(@Param('id') id: string, @Body() body: { status: string }) {
    const report = await this.prisma.report.update({ where: { id }, data: { status: body.status } });
    return { report };
  }
}


