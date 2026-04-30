/**
 * Vercel serverless function entry — handles everything under `/api/*`.
 *
 * Vercel routes any unmatched request through this catch-all, and Express's
 * internal router handles the actual path matching. Static files (the SPA
 * build) are served directly from Vercel's CDN — see `vercel.json` rewrites.
 *
 * Limits to be aware of (Hobby tier, 2026-04):
 *   - 10s function timeout — bulk Resend campaigns to >15 subscribers will hit it.
 *     Production should use a queue/worker for that. For staging tests it's fine.
 *   - Stateless: the in-memory rate limiter resets every cold start. OK for
 *     a preview environment, not OK as a real anti-spam guarantee.
 *   - 4.5 MB body limit on serverless function payloads. Our admin uploads
 *     send base64 — 5MB image ≈ 6.6MB base64 → too big. Use Cloudinary direct
 *     upload via the AI image button instead, which works fine.
 */
import "dotenv/config";
import { createApp } from "../server/_core/app";

// Build the Express app once per cold start. Subsequent invocations within
// the same instance reuse this — Vercel caches module state across warm calls.
const app = createApp();

// Vercel passes (req, res) into the default export; Express is signature-
// compatible with Node's http RequestListener.
export default app;
