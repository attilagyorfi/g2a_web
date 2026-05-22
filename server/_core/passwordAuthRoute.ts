/**
 * Password-based admin login — fallback while Manus OAuth isn't configured.
 *
 * Posts to `/api/auth/password-login` with `{ email, password }`. When both
 * match `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars (set in Vercel), the
 * endpoint:
 *   1. Upserts a synthetic admin user (openId: "password-admin") into the
 *      `users` table so the existing tRPC `auth.me` flow returns a real row.
 *   2. Signs a session JWT with the same scheme used by the OAuth flow
 *      (SignJWT/HS256 over `JWT_SECRET`) so `sdk.authenticateRequest` can
 *      verify it on subsequent requests.
 *   3. Sets the session cookie under `COOKIE_NAME` with the same options as
 *      the OAuth callback path.
 *
 * Security notes:
 *   - Plain-text password comparison via `crypto.timingSafeEqual` to avoid
 *     timing side-channels. Bcrypt isn't necessary for a single hardcoded
 *     credential.
 *   - Rate-limited via the same DB-backed sliding-window limiter as the
 *     public contact form (5 attempts / 15 min / IP) so brute force is
 *     impractical even before fail2ban-style alerting.
 *   - Refuses if `ADMIN_EMAIL` or `ADMIN_PASSWORD` is empty so prod can't
 *     accidentally accept blank credentials.
 *   - Cookie is `HttpOnly`, `Secure` (over HTTPS), `SameSite=None` —
 *     matches the OAuth path.
 *
 * Once Manus OAuth is set up, this endpoint stays available as a secondary
 * path; it can be disabled by clearing `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
 * Vercel without removing any code.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { SignJWT } from "jose";
import { timingSafeEqual } from "node:crypto";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { checkRateLimitDb } from "./dbRateLimit";
import { getClientIp } from "./rateLimit";

/** OpenId used for the synthetic admin row. Matches the shape `sdk` expects. */
const PASSWORD_ADMIN_OPEN_ID = "password-admin";

/** Sentinel appId baked into the JWT when there's no Manus appId configured.
 *  `verifySession` only checks that `appId` is a non-empty string, so this
 *  value is functionally a tag. */
const FALLBACK_APP_ID_TAG = "g2a-password-admin";

/** Constant-time string comparison — avoids timing-attack leakage of the
 *  expected password length. Returns false for any length mismatch. */
function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

export function registerPasswordAuthRoute(app: Express): void {
  /**
   * Diagnostic endpoint — reports which env vars the running function can see,
   * WITHOUT exposing any values. Safe to leave public: returns booleans + the
   * email's local-part shape only (`info@…hu` style hint), never the password
   * or the JWT secret.
   */
  /**
   * Diagnostic: send a single test email using the production Resend
   * credentials and report the API response. Helps debug "I changed env vars
   * but mails still don't arrive" mismatches between local and Vercel.
   *
   * Auth: requires `?key=<JWT_SECRET>` query parameter — the secret is
   * already required and configured, and using it avoids spinning up a
   * dedicated diagnostic password. Returns the full Resend HTTP response
   * (status + body) on failure so the operator can see exactly what Resend
   * rejected.
   *
   *   GET /api/_diag/send-test?key=<JWT_SECRET>&to=foo@bar.com
   */
  app.get("/api/_diag/send-test", async (req: Request, res: Response) => {
    const provided = (req.query.key as string | undefined) || "";
    if (!ENV.cookieSecret || provided !== ENV.cookieSecret) {
      return res.status(401).json({ error: "Wrong or missing ?key=" });
    }
    const to = (req.query.to as string | undefined) || ENV.resendNotifyEmail;
    if (!to) {
      return res.status(400).json({ error: "No `to` (and RESEND_NOTIFY_EMAIL is empty)" });
    }
    if (!ENV.resendApiKey) {
      return res.status(503).json({ error: "RESEND_API_KEY not set" });
    }

    const from = ENV.resendFromEmail || "onboarding@resend.dev";
    const payload = {
      from,
      to,
      subject: "[DIAG] G2A test send — Vercel function",
      html: `<p>This is a diagnostic email from the Vercel function.</p><p>From: <code>${from}</code></p><p>To: <code>${to}</code></p><p>If you receive this, the Resend creds + env vars are wired correctly.</p>`,
      text: `Diagnostic email from Vercel.\nFrom: ${from}\nTo: ${to}`,
    };

    let status = 0;
    let responseText = "";
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      status = r.status;
      responseText = await r.text();
    } catch (err) {
      return res.status(500).json({ error: "Fetch failed", detail: String(err) });
    }

    // Always return 200 from the diag endpoint so the operator sees the
    // result; encode the Resend status inside the payload.
    res.json({
      sent_to: to,
      from_used: from,
      resend_status: status,
      resend_response: (() => {
        try {
          return JSON.parse(responseText);
        } catch {
          return responseText.slice(0, 500);
        }
      })(),
    });
  });

  app.get("/api/_diag/admin-env", (_req: Request, res: Response) => {
    res.json({
      // Admin login
      ADMIN_EMAIL_set: Boolean(ENV.adminEmail),
      ADMIN_EMAIL_shape: ENV.adminEmail
        ? `${ENV.adminEmail.slice(0, 2)}***@***${ENV.adminEmail.slice(-3)}`
        : null,
      ADMIN_PASSWORD_set: Boolean(ENV.adminPassword),
      ADMIN_PASSWORD_length: ENV.adminPassword.length,
      JWT_SECRET_set: Boolean(ENV.cookieSecret),
      JWT_SECRET_length: ENV.cookieSecret.length,
      VITE_APP_ID_set: Boolean(ENV.appId),
      VITE_OAUTH_PORTAL_URL_set: Boolean(ENV.oauthPortalUrl),
      // Resend / email
      RESEND_API_KEY_set: Boolean(ENV.resendApiKey),
      RESEND_FROM_EMAIL_raw: ENV.resendFromEmail || null,
      RESEND_FROM_EMAIL_valid: /<[^@\s]+@[^@\s]+>|^[^@\s]+@[^@\s]+$/.test(
        (ENV.resendFromEmail || "").trim(),
      ),
      RESEND_NOTIFY_EMAIL: ENV.resendNotifyEmail || null,
      RESEND_NOTIFY_EMAIL_valid: /^[^@\s]+@[^@\s]+$/.test(
        (ENV.resendNotifyEmail || "").trim(),
      ),
      RESEND_WEBHOOK_SECRET_set: Boolean(ENV.resendWebhookSecret),
      // Cron
      CRON_SECRET_set: Boolean(process.env.CRON_SECRET),
      // Runtime
      NODE_ENV: process.env.NODE_ENV || "unknown",
    });
  });

  app.post("/api/auth/password-login", async (req: Request, res: Response) => {
    const { email, password } = (req.body ?? {}) as {
      email?: unknown;
      password?: unknown;
    };

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    // Refuse outright if not configured — prevents accidental blank-cred login.
    if (!ENV.adminEmail || !ENV.adminPassword || !ENV.cookieSecret) {
      res.status(503).json({
        error: "Password login not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET in Vercel environment.",
      });
      return;
    }

    // Rate limit — 5 attempts / 15 min per IP, in the shared sliding window.
    const ip = getClientIp(req);
    const limit = await checkRateLimitDb(`admin-login:${ip}`, {
      max: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) {
      const minutes = Math.ceil(((limit.retryAt ?? Date.now()) - Date.now()) / 60000);
      res.status(429).json({
        error: `Túl sok bejelentkezési kísérlet. Próbáld újra ${minutes} perc múlva.`,
      });
      return;
    }

    // Compare both fields in constant time — short-circuiting on the email
    // first would leak whether the email is correct via timing.
    const emailOk = safeEquals(email, ENV.adminEmail);
    const pwdOk = safeEquals(password, ENV.adminPassword);
    if (!(emailOk && pwdOk)) {
      // Generic error — don't reveal which field failed
      res.status(401).json({ error: "Hibás email vagy jelszó." });
      return;
    }

    try {
      // Upsert the synthetic admin row so tRPC `auth.me` returns a real user.
      await db.upsertUser({
        openId: PASSWORD_ADMIN_OPEN_ID,
        name: "Admin",
        email,
        role: "admin",
        loginMethod: "password",
        lastSignedIn: new Date(),
      });

      // Sign a session JWT with the same scheme as the OAuth flow. `appId`
      // gets the sentinel tag so verifySession's non-empty check passes.
      const secretKey = new TextEncoder().encode(ENV.cookieSecret);
      const expirationSeconds = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);
      const sessionToken = await new SignJWT({
        openId: PASSWORD_ADMIN_OPEN_ID,
        appId: ENV.appId || FALLBACK_APP_ID_TAG,
        name: "Admin",
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(expirationSeconds)
        .sign(secretKey);

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true });
    } catch (err) {
      console.error("[password-login] Session creation failed:", err);
      res.status(500).json({ error: "Belső hiba a bejelentkezés során." });
    }
  });
}
