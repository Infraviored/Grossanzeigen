import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkReportSpike(threshold: number, windowMinutes: number) {
    const since = new Date(Date.now() - windowMinutes * 60_000);
    const count = await this.prisma.report.count({ where: { createdAt: { gte: since } } });
    if (count >= threshold) {
      // eslint-disable-next-line no-console
      console.warn(`[alert] reports spike: count=${count} windowMinutes=${windowMinutes}`);
      return { alerted: true, count };
    }
    return { alerted: false, count };
  }
}


