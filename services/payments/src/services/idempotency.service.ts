import { Injectable } from '@nestjs/common';

interface StoredEvent {
  processedAt: number;
}

@Injectable()
export class IdempotencyService {
  private readonly ttlMs = 1000 * 60 * 60; // 1 hour
  private readonly store = new Map<string, StoredEvent>();

  has(eventId: string): boolean {
    const entry = this.store.get(eventId);
    if (!entry) return false;
    if (Date.now() - entry.processedAt > this.ttlMs) {
      this.store.delete(eventId);
      return false;
    }
    return true;
  }

  mark(eventId: string) {
    this.store.set(eventId, { processedAt: Date.now() });
  }
}


