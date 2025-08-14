import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from '../routes/health.controller';
import { StripeModule } from './stripe.module';
import { PaymentIntentsController } from '../routes/payment-intents.controller';
import { FeesController } from '../routes/fees.controller';
import { WebhooksController } from '../routes/webhooks.controller';
import { RefundsController } from '../routes/refunds.controller';
import { RefundsService } from '../services/refunds.service';
import { PayoutsController } from '../routes/payouts.controller';
import { ReceiptsController } from '../routes/receipts.controller';
import { ReceiptsService } from '../services/receipts.service';
import { IdempotencyService } from '../services/idempotency.service';
import { WebhookForwarderService } from '../services/webhook-forwarder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule,
  ],
  controllers: [HealthController, PaymentIntentsController, FeesController, WebhooksController, RefundsController, PayoutsController, ReceiptsController],
  providers: [RefundsService, ReceiptsService, IdempotencyService, WebhookForwarderService],
})
export class AppModule {}


