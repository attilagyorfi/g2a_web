/**
 * Express app factory — builds a fully-configured app instance with all
 * middleware and routes wired, but does NOT call `listen()`.
 *
 * Used by:
 *   - `index.ts` (standalone) → wraps app with Vite/static + HTTP listen
 *   - `api/[[...path]].ts` (Vercel serverless) → exports app directly
 *
 * Anything serverless-incompatible (Vite HMR setup, static file serving on
 * Vercel) lives outside this factory in the caller-specific entry points.
 */
import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerNewsletterRoutes } from "./newsletterRoutes";
import { registerResendWebhookRoute } from "./resendWebhookRoute";
import { registerSitemapRoute } from "./sitemapRoute";
import { registerRssRoute } from "./rssRoute";
import { registerPasswordAuthRoute } from "./passwordAuthRoute";
import { registerDigestCronRoute } from "./digestCronRoute";

export function createApp(): Express {
  const app = express();
  // Body parser — generous limit for image uploads + AI image base64 ingest
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback — /api/oauth/callback
  registerOAuthRoutes(app);

  // Password-based admin login (fallback while Manus OAuth isn't set up).
  // No-ops at runtime when ADMIN_EMAIL / ADMIN_PASSWORD are unset.
  registerPasswordAuthRoute(app);

  // Newsletter unsubscribe — GET /api/newsletter/unsubscribe?token=...
  registerNewsletterRoutes(app);

  // Resend webhook — POST /api/webhooks/resend (open/click/bounce events).
  // Registered BEFORE the JSON body parser would normally see it, but we
  // attach a route-scoped raw-body parser inside `registerResendWebhookRoute`
  // since signature verification requires the original bytes.
  registerResendWebhookRoute(app);

  // Dynamic sitemap — GET /sitemap.xml (DB-driven, includes posts + case studies).
  // Vercel rewrites `/sitemap.xml` → `/api`; in dev Express handles directly.
  registerSitemapRoute(app);

  // RSS 2.0 feed — GET /rss.xml — latest 20 published blog posts.
  registerRssRoute(app);

  // Weekly newsletter digest cron — GET /api/cron/weekly-digest. Triggered
  // by the schedule in vercel.json (Fridays 07:00 UTC = 09:00 CEST).
  registerDigestCronRoute(app);

  // tRPC API — /api/trpc/*
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
