import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { CreatePaymentIntentDto } from '../dto/payment-intent.dto';

@Controller('payments')
export class PaymentIntentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('intent')
  async createIntent(@Body() body: CreatePaymentIntentDto) {
    const intent = await this.stripeService.createPaymentIntent({
      orderId: body.orderId,
      amountMinor: body.amountMinor,
      currency: body.currency,
      buyerStripeCustomerId: body.buyerStripeCustomerId,
      sellerStripeAccountId: body.sellerStripeAccountId,
      applicationFeeMinor: body.applicationFeeMinor,
      captureMethod: body.captureMethod,
      requestThreeDSecure: body.requestThreeDSecure,
    });
    return { id: intent.id, clientSecret: intent.client_secret };
  }
}


