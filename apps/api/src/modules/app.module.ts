import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { PoliciesModule } from './policies/policies.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [HealthModule, PoliciesModule, PrismaModule, AuthModule],
})
export class AppModule {}


