import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DisputesService } from './disputes.service.js';
import { DisputesController } from './disputes.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [DisputesService],
  controllers: [DisputesController],
})
export class DisputesModule {}


