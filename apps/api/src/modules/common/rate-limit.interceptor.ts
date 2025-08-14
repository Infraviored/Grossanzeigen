import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

type Key = string;

interface Counter {
  count: number;
  resetAt: number;
}

const buckets = new Map<Key, Counter>();

function keyFor(req: any, windowMs: number): Key {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const path = req.route?.path || req.url;
  const method = req.method;
  const slot = Math.floor(Date.now() / windowMs);
  return `${ip}|${method}|${path}|${slot}`;
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly limit: number = 20, private readonly windowMs: number = 60_000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const k = keyFor(req, this.windowMs);
    const now = Date.now();
    const entry = buckets.get(k) ?? { count: 0, resetAt: now + this.windowMs };
    entry.count += 1;
    if (entry.resetAt < now) {
      entry.count = 1;
      entry.resetAt = now + this.windowMs;
    }
    buckets.set(k, entry);
    if (entry.count > this.limit) {
      throw new HttpException({ error: { code: 'RATE_LIMITED', message: 'Too many requests', retryAfterMs: entry.resetAt - now } }, HttpStatus.TOO_MANY_REQUESTS);
    }
    return next.handle();
  }
}


