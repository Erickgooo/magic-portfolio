/**
 * Fixed-window in-memory rate limiter.
 *
 * Scope caveat: state lives in the process, so limits are per serverless
 * instance and reset on redeploy. That is enough to stop casual abuse and
 * scripted brute force; for hard guarantees move this to a shared store
 * (Upstash Redis, Vercel KV) behind the same interface.
 */

type Entry = { count: number; resetAt: number };

const MAX_ENTRIES = 10_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the current window resets. */
  retryAfter: number;
};

export class RateLimiter {
  private readonly buckets = new Map<string, Entry>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Drop expired entries; bounds memory so the map cannot grow without limit. */
  private prune(now: number) {
    for (const [key, entry] of this.buckets) {
      if (entry.resetAt <= now) {
        this.buckets.delete(key);
      }
    }

    // Hard ceiling in case of a flood of distinct keys within one window.
    if (this.buckets.size > MAX_ENTRIES) {
      const excess = this.buckets.size - MAX_ENTRIES;
      let removed = 0;
      for (const key of this.buckets.keys()) {
        this.buckets.delete(key);
        if (++removed >= excess) break;
      }
    }
  }

  /** Count one request against `key` and report whether it is allowed. */
  consume(key: string): RateLimitResult {
    const now = Date.now();
    this.prune(now);

    const entry = this.buckets.get(key);

    if (!entry || entry.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: this.limit - 1, retryAfter: 0 };
    }

    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    if (entry.count >= this.limit) {
      return { allowed: false, remaining: 0, retryAfter };
    }

    entry.count += 1;
    return { allowed: true, remaining: this.limit - entry.count, retryAfter };
  }

  /** Clear a key, e.g. after a successful login. */
  reset(key: string) {
    this.buckets.delete(key);
  }
}

/**
 * Best-effort client identifier. On Vercel `x-forwarded-for` is set by the
 * platform and cannot be spoofed by the client; the leftmost entry is the
 * real client IP. Behind another proxy, verify that assumption before relying
 * on this for anything stricter than rate limiting.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
