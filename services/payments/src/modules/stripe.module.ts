import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from '../routes/stripe.controller';
import { StripeService } from '../services/stripe.service';
import { FeesService } from '../services/fees.service';

@Module({
  imports: [ConfigModule],
  providers: [StripeService, FeesService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}


