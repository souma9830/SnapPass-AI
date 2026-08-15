/**
 * rateLimitStore.service.js — In-memory sliding window rate limit counter store
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class RateLimitStoreService {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.hits = new Map();
  }

  isRateLimited(ipKey) {
    const now = Date.now();
    let timestamps = this.hits.get(ipKey) || [];
    timestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (timestamps.length >= this.maxRequests) {
      this.hits.set(ipKey, timestamps);
      return { limited: true, remaining: 0, resetMs: this.windowMs - (now - timestamps[0]) };
    }

    timestamps.push(now);
    this.hits.set(ipKey, timestamps);
    return { limited: false, remaining: this.maxRequests - timestamps.length, resetMs: this.windowMs };
  }
}

export const rateLimitStore = new RateLimitStoreService();
