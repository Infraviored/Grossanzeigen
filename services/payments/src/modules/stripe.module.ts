import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from '../routes/stripe.controller';
import { StripeService } from '../services/stripe.service';

@Module({
  imports: [ConfigModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}


