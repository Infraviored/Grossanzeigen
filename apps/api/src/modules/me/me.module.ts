import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MeController } from './me.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [MeController],
})
export class MeModule {}


