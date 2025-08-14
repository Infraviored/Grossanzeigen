import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookForwarderService {
  async forwardUpdate(apiBaseUrl: string, payload: any) {
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/internal/payments/update`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  }
}


