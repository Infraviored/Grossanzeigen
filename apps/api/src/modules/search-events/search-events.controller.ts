import { Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('search/index')
export class SearchEventsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('replay')
  async replay() {
    // Placeholder to publish outbox to OpenSearch via script
    const pending = await this.prisma.searchOutbox.findMany({ where: { processedAt: null }, take: 1000 });
    return { pending: pending.length };
  }
}


