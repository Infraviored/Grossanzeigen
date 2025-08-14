import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from '../routes/health.controller';
import { StripeModule } from './stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}


