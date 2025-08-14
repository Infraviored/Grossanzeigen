import { Controller, Get, Query } from '@nestjs/common';
import { FeesService } from '../services/fees.service';

@Controller('payments/fees')
export class FeesController {
  constructor(private readonly fees: FeesService) {}

  @Get('quote')
  quote(@Query('amountMinor') amountMinor: string) {
    const amount = Number(amountMinor);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: { code: 'VALIDATION_ERROR', message: 'amountMinor must be a positive integer' } };
    }
    return this.fees.quote(amount);
  }
}


