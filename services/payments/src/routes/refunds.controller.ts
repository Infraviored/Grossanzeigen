import { Body, Controller, Post } from '@nestjs/common';
import { RefundsService } from '../services/refunds.service';

class CreateRefundDto {
  paymentIntentId!: string;
  amountMinor?: number;
  reason?: string;
}

@Controller('payments/refunds')
export class RefundsController {
  constructor(private readonly refunds: RefundsService) {}

  @Post()
  async create(@Body() body: CreateRefundDto) {
    const refund = await this.refunds.createRefund({
      paymentIntentId: body.paymentIntentId,
      amountMinor: body.amountMinor,
      reason: body.reason,
    });
    return { id: refund.id, status: refund.status, amount: refund.amount, currency: refund.currency };
  }
}


