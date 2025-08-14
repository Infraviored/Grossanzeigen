import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('payments/payouts')
export class PayoutsController {
  private readonly client: Stripe;
  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    const apiVersion = (this.config.get<string>('STRIPE_API_VERSION') || '2024-06-20') as Stripe.LatestApiVersion | undefined;
    this.client = new Stripe(apiKey, { apiVersion });
  }

  @Get('upcoming')
  async upcoming(@Query('accountId') accountId: string) {
    if (!accountId) return { error: { code: 'VALIDATION_ERROR', message: 'accountId is required' } };
    const balance = await this.client.balance.retrieve({ stripeAccount: accountId });
    return balance;
  }

  @Get('history')
  async history(@Query('accountId') accountId: string) {
    if (!accountId) return { error: { code: 'VALIDATION_ERROR', message: 'accountId is required' } };
    const payouts = await this.client.payouts.list({ limit: 20 }, { stripeAccount: accountId });
    return payouts;
  }
}


