interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

export function checkRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let entry = rateLimitStore.get(userId);

  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(userId, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldestTimestamp = Math.min(...entry.timestamps);
    const retryAfter = Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.timestamps.length,
  };
}
