import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@UseGuards(SessionAuthGuard, AdminGuard)
@Controller('admin/moderation/queue')
export class QueueController {
  constructor(private readonly queue: QueueService) {}

  @Get()
  async list() {
    return await this.queue.listOpen();
  }

  @Patch(':id')
  async resolve(@Param('id') id: string, @Body() body: { action: 'remove' | 'warn' | 'ban' }) {
    return await this.queue.resolve(id, body.action);
  }
}


