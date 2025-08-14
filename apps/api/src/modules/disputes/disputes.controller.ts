import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service.js';
import { SessionAuthGuard } from '../auth/session.guard.js';

class DisputeDto { orderId!: string; reason!: string }

@UseGuards(SessionAuthGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputes: DisputesService) {}

  @Post()
  async create(@Body() dto: DisputeDto, req: any) {
    const userId: string = req.user.userId;
    return await this.disputes.create(dto.orderId, userId, dto.reason);
  }

  @Get()
  async list(req: any) {
    const userId: string = req.user.userId;
    return await this.disputes.listForUser(userId);
  }
}


