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

export function createApp(): Express {
  const app = express();
  // Body parser — generous limit for image uploads + AI image base64 ingest
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback — /api/oauth/callback
  registerOAuthRoutes(app);

  // Newsletter unsubscribe — GET /api/newsletter/unsubscribe?token=...
  registerNewsletterRoutes(app);

  // Resend webhook — POST /api/webhooks/resend (open/click/bounce events).
  // Registered BEFORE the JSON body parser would normally see it, but we
  // attach a route-scoped raw-body parser inside `registerResendWebhookRoute`
  // since signature verification requires the original bytes.
  registerResendWebhookRoute(app);

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
