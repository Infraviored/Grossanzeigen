import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@UseGuards(SessionAuthGuard, AdminGuard)
@Controller('admin/alerts')
export class AlertsController {
  constructor(private readonly alerts: AlertsService) {}

  @Get('report-spike')
  async reportSpike(@Query('threshold') threshold = '10', @Query('window') window = '60') {
    return await this.alerts.checkReportSpike(Number(threshold), Number(window));
  }
}


