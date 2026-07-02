import type { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  message: string;
  keyPrefix: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function requestKey(request: Request, keyPrefix: string) {
  return `${keyPrefix}:${request.ip}`;
}

function cleanupExpiredBuckets(now: number) {
  if (buckets.size < 5000) return;

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function createRateLimit(options: RateLimitOptions) {
  return (request: Request, response: Response, next: NextFunction) => {
    const now = Date.now();
    const key = requestKey(request, options.keyPrefix);
    const current = buckets.get(key);

    cleanupExpiredBuckets(now);

    if (!current || current.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      next();
      return;
    }

    current.count += 1;

    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    response.setHeader("Retry-After", String(retryAfterSeconds));
    response.setHeader("X-RateLimit-Limit", String(options.maxRequests));
    response.setHeader(
      "X-RateLimit-Remaining",
      String(Math.max(options.maxRequests - current.count, 0)),
    );

    if (current.count > options.maxRequests) {
      response.status(429).json({
        ok: false,
        message: options.message,
      });
      return;
    }

    next();
  };
}

export const apiRateLimit = createRateLimit({
  keyPrefix: "api",
  windowMs: 60 * 1000,
  maxRequests: 600,
  message: "Too many API requests. Please retry shortly.",
});

export const loginRateLimit = createRateLimit({
  keyPrefix: "auth-login",
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: "Too many login attempts. Please retry later.",
});
