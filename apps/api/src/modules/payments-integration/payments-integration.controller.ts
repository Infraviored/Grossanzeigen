import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('internal/payments')
export class PaymentsIntegrationController {
  constructor(private readonly prisma: PrismaService) {}

  // Called by Payments service webhook consumer (future): update payment and order states
  @Post('update')
  async updateFromWebhook(@Body() body: any) {
    const { orderId, payment } = body as { orderId: string; payment: { intentId?: string; status?: string } };
    if (!orderId) return { error: { code: 'VALIDATION_ERROR', message: 'orderId required' } };
    if (payment?.intentId) {
      await this.prisma.payment.upsert({
        where: { orderId },
        update: { stripePaymentIntentId: payment.intentId, status: payment.status || 'processing' },
        create: { orderId, stripePaymentIntentId: payment.intentId, status: payment.status || 'processing' },
      });
    }
    return { ok: true };
  }
}



