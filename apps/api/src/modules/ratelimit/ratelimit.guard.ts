import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';

type BucketKey = string;

interface RateLimitConfig {
  burst: number; // max tokens in window
  windowMs: number; // window duration
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private buckets: Map<BucketKey, { count: number; windowStart: number }> = new Map();
  private sustained: Map<BucketKey, { count: number; windowStart: number }> = new Map();
  private readonly config: RateLimitConfig = { burst: 30, windowMs: 60_000 };
  private readonly sustainedConfig: RateLimitConfig = { burst: 300, windowMs: 60 * 60_000 };

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<any>();
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const userId: string | undefined = req.user?.userId;
    const path = req.route?.path || req.url;
    const key = `${userId ?? 'ip:' + ip}|${path}`;

    const now = Date.now();
    // Burst window
    const bucket = this.buckets.get(key);
    if (!bucket || now - bucket.windowStart > this.config.windowMs) {
      this.buckets.set(key, { count: 1, windowStart: now });
    } else if (bucket.count >= this.config.burst) {
      throw new HttpException({ error: { code: 'RATE_LIMITED', message: 'Too many requests (burst)' } }, HttpStatus.TOO_MANY_REQUESTS);
    } else {
      bucket.count += 1;
    }

    // Sustained window
    const sustained = this.sustained.get(key);
    if (!sustained || now - sustained.windowStart > this.sustainedConfig.windowMs) {
      this.sustained.set(key, { count: 1, windowStart: now });
    } else if (sustained.count >= this.sustainedConfig.burst) {
      throw new HttpException({ error: { code: 'RATE_LIMITED', message: 'Too many requests (sustained)' } }, HttpStatus.TOO_MANY_REQUESTS);
    } else {
      sustained.count += 1;
    }
    return true;
  }
}


