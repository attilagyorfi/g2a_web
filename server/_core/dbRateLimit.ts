/**
 * DB-backed sliding-window rate limiter.
 *
 * Replaces the in-memory limiter for production: Vercel serverless containers
 * have ephemeral memory (cold start = state wiped) and parallel regional
 * instances each keep their own counters, so an in-process Map cannot enforce
 * a real per-IP limit across requests.
 *
 * Trade-off: each check is two SQL queries (count + insert) ≈ 20–50 ms on
 * TiDB Cloud. For form submissions (rare, user-initiated) that overhead is
 * inconsequential — and importantly, even a brute-force bot pays the same
 * latency, so the limiter actually slows them down.
 *
 * Falls back to the in-memory limiter when the DB is unreachable, so dev
 * setups without `DATABASE_URL` still get *some* protection.
 */
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { rateLimitHits } from "../../drizzle/schema";
import { getDb } from "../db";
import { checkRateLimit as checkRateLimitMemory } from "./rateLimit";

export type RateLimitResult = {
  allowed: boolean;
  /** When the next request would be allowed (epoch ms). Only set when blocked. */
  retryAt?: number;
  /** Remaining capacity in the current window. */
  remaining: number;
};

/**
 * Check + record a hit in the same call. The window slides — the count is
 * "rows where hitAt > now - windowMs".
 *
 * Cleanup: each call has a 5% chance of also running a delete for rows older
 * than 1 hour, so the table self-trims without a cron. The 5% rolls don't
 * block the response (fire-and-forget).
 */
export async function checkRateLimitDb(
  bucketKey: string,
  opts: { max: number; windowMs: number },
): Promise<RateLimitResult> {
  const db = await getDb();
  if (!db) {
    // Fallback for dev/CI without DATABASE_URL — keep some protection rather
    // than letting all submissions through.
    return checkRateLimitMemory(bucketKey, opts);
  }

  const now = Date.now();
  const windowStart = new Date(now - opts.windowMs);

  try {
    // Count hits inside the window. We use a raw COUNT(*) since drizzle's
    // count helper varies across versions.
    const rows = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(rateLimitHits)
      .where(
        and(
          eq(rateLimitHits.bucketKey, bucketKey),
          gte(rateLimitHits.hitAt, windowStart),
        ),
      );
    const hitCount = Number(rows[0]?.count ?? 0);

    if (hitCount >= opts.max) {
      // Find the oldest hit in the window to compute retryAt
      const [oldest] = await db
        .select({ hitAt: rateLimitHits.hitAt })
        .from(rateLimitHits)
        .where(
          and(
            eq(rateLimitHits.bucketKey, bucketKey),
            gte(rateLimitHits.hitAt, windowStart),
          ),
        )
        .orderBy(rateLimitHits.hitAt)
        .limit(1);
      const oldestMs = oldest ? new Date(oldest.hitAt).getTime() : now;
      return {
        allowed: false,
        retryAt: oldestMs + opts.windowMs,
        remaining: 0,
      };
    }

    // Record this hit
    await db.insert(rateLimitHits).values({ bucketKey });

    // 5% chance: trim rows older than 1 hour. Fire-and-forget; failures here
    // must never affect the request.
    if (Math.random() < 0.05) {
      const cutoff = new Date(now - 60 * 60 * 1000);
      db.delete(rateLimitHits)
        .where(lt(rateLimitHits.hitAt, cutoff))
        .catch(() => {/* ignore */});
    }

    return { allowed: true, remaining: opts.max - hitCount - 1 };
  } catch (err) {
    // If the DB query throws (transient connection issue, table missing in
    // an early-deploy state), fall back to in-memory so we don't accidentally
    // open the floodgates. Logged for visibility.
    console.warn("[dbRateLimit] DB check failed, falling back to memory:", err);
    return checkRateLimitMemory(bucketKey, opts);
  }
}
