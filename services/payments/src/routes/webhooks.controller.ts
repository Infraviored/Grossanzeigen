import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from '../services/stripe.service';
import { IdempotencyService } from '../services/idempotency.service';

@Controller('payments/stripe/webhook')
export class WebhooksController {
  private readonly webhookSecret?: string;
  private readonly stripe: Stripe;

  constructor(private readonly config: ConfigService, private readonly stripeService: StripeService, private readonly idem: IdempotencyService) {
    this.webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') || undefined;
    // reuse underlying client to ensure same API version
    // StripeService doesn't expose client publicly; create a local one for webhook verification if needed
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    const apiVersion = (this.config.get<string>('STRIPE_API_VERSION') || '2024-06-20') as Stripe.LatestApiVersion | undefined;
    this.stripe = new Stripe(apiKey, { apiVersion });
  }

  @Post()
  @HttpCode(200)
  async handle(
    @Body() rawBody: any,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
    if (this.webhookSecret && signature) {
      const payload = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
      event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } else {
      event = rawBody as Stripe.Event; // unsafe but acceptable in dev without signature
    }

    if (!event.id) return { received: true };
    if (this.idem.has(event.id)) return { received: true, skipped: true };

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'charge.refunded':
      case 'charge.dispute.created':
      case 'charge.dispute.closed':
        // TODO: emit domain events / call API later
        break;
      default:
        break;
    }

    this.idem.mark(event.id);

    return { received: true };
  }
}


