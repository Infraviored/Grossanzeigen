import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type DependencyStatus = {
  name: string;
  status: 'up' | 'down' | 'unknown';
  details?: Record<string, unknown>;
};

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthStatus() {
    const version = process.env.APP_VERSION ?? '0.1.0';
    const dependencies: DependencyStatus[] = [{ name: 'api', status: 'up' }];
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dependencies.push({ name: 'db', status: 'up' });
    } catch {
      dependencies.push({ name: 'db', status: 'down' });
    }

    return {
      version,
      status: dependencies.every((d) => d.status === 'up') ? 'up' : 'degraded',
      dependencies,
      timestamp: new Date().toISOString(),
    } as const;
  }
}


