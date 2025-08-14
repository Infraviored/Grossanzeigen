import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { metricsStore } from './metrics.store.js';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const start = Date.now();
    const correlationId = req.headers['x-request-id'] || crypto.randomUUID();
    req.correlationId = correlationId;
    res.setHeader('x-request-id', correlationId);

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - start;
        metricsStore.record(durationMs);
        // eslint-disable-next-line no-console
        console.log(
          JSON.stringify({
            level: 'info',
            msg: 'request',
            method: req.method,
            path: req.url,
            status: res.statusCode,
            durationMs,
            correlationId,
          }),
        );
      }),
    );
  }
}


