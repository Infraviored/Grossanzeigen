import { Module } from '@nestjs/common';
import { MeController } from './me.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MeController],
})
export class MeModule {}


