import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load env from repo root and from app-level .env (both optional)
dotenvConfig({ path: resolve(__dirname, '../../.env') });
dotenvConfig({ path: resolve(__dirname, '../.env') });
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module.js';
import { AllExceptionsFilter } from './modules/common/index.js';
import { RequestLoggingInterceptor } from './modules/common/request-logging.interceptor.js';
import { RateLimitInterceptor } from './modules/common/rate-limit.interceptor.js';
import helmet from 'helmet';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());
  app.useGlobalInterceptors(new RateLimitInterceptor(60, 60_000));
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();


