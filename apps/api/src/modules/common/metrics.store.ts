type Entry = { ts: number; ms: number };

class MetricsStore {
  private requests: Entry[] = [];

  record(durationMs: number): void {
    const now = Date.now();
    this.requests.push({ ts: now, ms: durationMs });
    if (this.requests.length > 5000) this.requests.splice(0, this.requests.length - 5000);
  }

  summarize(windowMs = 5 * 60_000) {
    const cutoff = Date.now() - windowMs;
    const arr = this.requests.filter((e) => e.ts >= cutoff).map((e) => e.ms).sort((a, b) => a - b);
    const p = (q: number) => (arr.length ? arr[Math.min(arr.length - 1, Math.floor(q * arr.length))] : null);
    return {
      windowMs,
      count: arr.length,
      p50: p(0.5),
      p95: p(0.95),
      p99: p(0.99),
    };
  }
}

export const metricsStore = new MetricsStore();


