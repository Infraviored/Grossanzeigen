import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PaymentsIntegrationController } from './payments-integration.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsIntegrationController],
})
export class PaymentsIntegrationModule {}



