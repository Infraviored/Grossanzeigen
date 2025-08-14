import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class RefundsService {
  private readonly client: Stripe;
  private readonly hasApiKey: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY');
    const apiVersion = (this.config.get<string>('STRIPE_API_VERSION') || '2024-06-20') as Stripe.LatestApiVersion | undefined;
    this.hasApiKey = Boolean(apiKey);
    this.client = new Stripe(apiKey || 'sk_test_placeholder', { apiVersion });
  }

  async createRefund(params: { paymentIntentId: string; amountMinor?: number; reason?: string }) {
    if (!this.hasApiKey) {
      throw new HttpException(
        { error: { code: 'PAYMENTS_NOT_CONFIGURED', message: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' } },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    const refund = await this.client.refunds.create({
      payment_intent: params.paymentIntentId,
      amount: params.amountMinor,
      reason: (params.reason as any) || undefined,
    });
    return refund;
  }
}


