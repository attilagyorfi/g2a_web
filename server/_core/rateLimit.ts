/**
 * Tiny in-memory sliding-window rate limiter — no external deps.
 *
 * Suitable for single-process servers. If we ever scale horizontally, swap this
 * for Redis-backed limiter (e.g. `@upstash/ratelimit`).
 *
 * Usage:
 *   const limit = checkRateLimit("contact:" + ip, { max: 3, windowMs: 15 * 60 * 1000 });
 *   if (!limit.allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: ... });
 */

import type { Request } from "express";

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

// Periodic cleanup so old IPs don't pile up forever.
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 5 * 60 * 1000; // 5 min

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  buckets.forEach((bucket, key) => {
    // Keep only buckets that have any hit within the past hour
    bucket.hits = bucket.hits.filter((t: number) => now - t < 60 * 60 * 1000);
    if (bucket.hits.length === 0) buckets.delete(key);
  });
}

export type RateLimitResult = {
  allowed: boolean;
  /** When the next request would be allowed (epoch ms). Only set when blocked. */
  retryAt?: number;
  /** Remaining capacity in the current window. */
  remaining: number;
};

export function checkRateLimit(
  key: string,
  opts: { max: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }

  // Drop hits outside the window
  const cutoff = now - opts.windowMs;
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= opts.max) {
    const oldestInWindow = bucket.hits[0];
    return {
      allowed: false,
      retryAt: oldestInWindow + opts.windowMs,
      remaining: 0,
    };
  }

  bucket.hits.push(now);
  return { allowed: true, remaining: opts.max - bucket.hits.length };
}

/** Best-effort client IP. Honours X-Forwarded-For when behind a proxy. */
export function getClientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    // First entry is the original client; subsequent are proxies
    return xff.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}
