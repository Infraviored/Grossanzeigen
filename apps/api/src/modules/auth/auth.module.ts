import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SessionAuthGuard } from './session.guard.js';
import { VerifiedUserGuard } from './verified.guard.js';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard, VerifiedUserGuard],
  exports: [AuthService, SessionAuthGuard, VerifiedUserGuard],
})
export class AuthModule {}


