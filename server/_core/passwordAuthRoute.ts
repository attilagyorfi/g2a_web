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
import { COOKIE_NAME, SESSION_TTL_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { SignJWT } from "jose";
import { timingSafeEqual } from "node:crypto";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { checkRateLimitDb } from "./dbRateLimit";
import { getClientIp } from "./rateLimit";
import { sendEmail } from "./email";
import { generateResetToken, hashPassword, passwordPolicyError, verifyPassword } from "./password";

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

  app.get("/api/_diag/admin-env", (req: Request, res: Response) => {
    // Same gate as /api/_diag/send-test — this leaks the config shape (which
    // env vars are set, the from/notify addresses), so keep it behind ?key=.
    const provided = (req.query.key as string | undefined) || "";
    if (!ENV.cookieSecret || provided !== ENV.cookieSecret) {
      return res.status(401).json({ error: "Wrong or missing ?key=" });
    }
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

    // A session secret is always required. The ADMIN_EMAIL/ADMIN_PASSWORD pair
    // is only needed for the owner's env-based recovery login — invited staff
    // authenticate against their own hash in the DB.
    if (!ENV.cookieSecret) {
      res.status(503).json({
        error: "Password login not configured. Set JWT_SECRET in the Vercel environment.",
      });
      return;
    }

    // Rate limit on two axes so neither can be sidestepped:
    //  - per IP (5/15min): stops one host hammering many accounts.
    //  - per account (10/15min): stops a botnet spread across many IPs from
    //    brute-forcing a single account, which the per-IP limit alone misses.
    const ip = getClientIp(req);
    const acct = email.trim().toLowerCase();
    const tooMany = (retryAt: number | undefined) => {
      const minutes = Math.ceil(((retryAt ?? Date.now()) - Date.now()) / 60000);
      res.status(429).json({
        error: `Túl sok bejelentkezési kísérlet. Próbáld újra ${minutes} perc múlva.`,
      });
    };
    const ipLimit = await checkRateLimitDb(`admin-login:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 });
    if (!ipLimit.allowed) {
      tooMany(ipLimit.retryAt);
      return;
    }
    const acctLimit = await checkRateLimitDb(`admin-login-acct:${acct}`, { max: 10, windowMs: 15 * 60 * 1000 });
    if (!acctLimit.allowed) {
      tooMany(acctLimit.retryAt);
      return;
    }

    try {
      // The configured ADMIN_EMAIL is always the owner, even if their row's
      // `isOwner` flag is stale — never let the staff branch below claim it.
      const ownerEmailMatches = Boolean(ENV.adminEmail) && safeEquals(email, ENV.adminEmail);

      // 1) Invited staff account — own scrypt hash in the users table.
      const staff = await db.getUserByEmail(email);
      if (staff && staff.passwordHash && !staff.isOwner && !ownerEmailMatches) {
        const ok = await verifyPassword(password, staff.passwordHash);
        if (!ok) {
          res.status(401).json({ error: "Hibás email vagy jelszó." });
          return;
        }
        if (!staff.isActive) {
          res.status(403).json({ error: "Ez a hozzáférés fel van függesztve. Kérj hozzáférést az adminisztrátortól." });
          return;
        }
        // Remembering the password supersedes any outstanding reset request,
        // so the emailed link stops working the moment it's no longer needed.
        if (staff.resetToken) {
          await db.updateStaffUser(staff.id, { resetToken: null, resetTokenExpiresAt: null });
        }
        await issueSession(req, res, staff.openId, staff.name || "Munkatárs");
        return;
      }

      // 2) Owner. Their DB hash wins (set via forgot-password); the
      //    ADMIN_PASSWORD env var stays as a permanent recovery path so a
      //    broken mailbox can never lock the owner out of their own site.
      const ownerHashOk = (staff?.isOwner || ownerEmailMatches) && staff?.passwordHash
        ? await verifyPassword(password, staff.passwordHash)
        : false;
      const ownerEnvOk =
        ownerEmailMatches && Boolean(ENV.adminPassword) && safeEquals(password, ENV.adminPassword);

      if (!ownerHashOk && !ownerEnvOk) {
        res.status(401).json({ error: "Hibás email vagy jelszó." });
        return;
      }

      const owner = await db.ensureOwnerUser(PASSWORD_ADMIN_OPEN_ID, email);
      await db.upsertUser({
        openId: owner?.openId ?? PASSWORD_ADMIN_OPEN_ID,
        name: owner?.name || "Admin",
        email,
        role: "admin",
        loginMethod: "password",
        lastSignedIn: new Date(),
      });
      await issueSession(req, res, owner?.openId ?? PASSWORD_ADMIN_OPEN_ID, owner?.name || "Admin");
    } catch (err) {
      console.error("[password-login] Session creation failed:", err);
      res.status(500).json({ error: "Belső hiba a bejelentkezés során." });
    }
  });

  /**
   * Step 1 of forgot-password: email in, reset link out.
   *
   * Always answers `{ success: true }` regardless of whether the address
   * exists — an attacker must not be able to enumerate staff addresses here.
   * Works for the owner too: their row is created on demand so the token has
   * somewhere to live, and setting a password writes `users.passwordHash`
   * (which then takes precedence over ADMIN_PASSWORD at login).
   */
  app.post("/api/auth/request-reset", async (req: Request, res: Response) => {
    const { email } = (req.body ?? {}) as { email?: unknown };
    if (typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Érvényes email cím szükséges." });
      return;
    }
    const ip = getClientIp(req);
    const limit = await checkRateLimitDb(`pwd-reset:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 });
    if (!limit.allowed) {
      res.status(429).json({ error: "Túl sok kérés. Próbáld újra később." });
      return;
    }

    try {
      let user = await db.getUserByEmail(email);
      // Normalise the owner row whether or not it already exists. A row that
      // predates the `isOwner` column would otherwise get a password hash while
      // still flagged as plain staff — which demotes the owner to whatever
      // permissions that row happens to carry (i.e. none).
      if (ENV.adminEmail && safeEquals(email, ENV.adminEmail)) {
        user = await db.ensureOwnerUser(PASSWORD_ADMIN_OPEN_ID, email);
      }
      if (user && user.isActive) {
        const token = generateResetToken();
        await db.updateStaffUser(user.id, {
          resetToken: token,
          resetTokenExpiresAt: new Date(Date.now() + RESET_TTL_MS),
        });
        const link = `${resolveOrigin(req)}/admin/reset-password?token=${token}`;
        await sendEmail({
          to: email,
          subject: "G2A Admin — jelszó beállítása",
          html: renderResetEmail(user.name || "", link),
          text: `Jelszó beállítása: ${link}\n\nA link 1 óráig érvényes. Ha nem te kérted, hagyd figyelmen kívül ezt a levelet.`,
        });
      }
    } catch (err) {
      console.error("[request-reset] failed:", err);
    }
    // Uniform response — never leaks whether the address is registered.
    res.json({ success: true });
  });

  /** Step 2: consume the token and store the new password. */
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    const { token, password } = (req.body ?? {}) as { token?: unknown; password?: unknown };
    if (typeof token !== "string" || typeof password !== "string" || !token || !password) {
      res.status(400).json({ error: "Hiányzó token vagy jelszó." });
      return;
    }
    const policy = passwordPolicyError(password);
    if (policy) {
      res.status(400).json({ error: policy });
      return;
    }
    try {
      const user = await db.getUserByResetToken(token);
      if (!user) {
        res.status(400).json({ error: "A link érvénytelen vagy lejárt. Kérj újat." });
        return;
      }
      await db.updateStaffUser(user.id, {
        passwordHash: await hashPassword(password),
        resetToken: null,
        resetTokenExpiresAt: null,
        isActive: true,
        // Cut off every session issued before now — a reset must lock out
        // anyone who was already signed in with the old credentials.
        sessionsValidFrom: new Date(),
      });
      res.json({ success: true, email: user.email });
    } catch (err) {
      console.error("[reset-password] failed:", err);
      res.status(500).json({ error: "Belső hiba a jelszó mentésekor." });
    }
  });
}

/** Signs the session JWT and sets the cookie — shared by both login paths. */
async function issueSession(req: Request, res: Response, openId: string, name: string): Promise<void> {
  const secretKey = new TextEncoder().encode(ENV.cookieSecret);
  const expirationSeconds = Math.floor((Date.now() + SESSION_TTL_MS) / 1000);
  const sessionToken = await new SignJWT({
    openId,
    appId: ENV.appId || FALLBACK_APP_ID_TAG,
    name,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    // iat lets the server reject sessions issued before a password reset.
    .setIssuedAt()
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: SESSION_TTL_MS });
  res.json({ success: true });
}

function resolveOrigin(req: Request): string {
  const origin = req.headers.origin as string | undefined;
  if (origin) return origin.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

function renderResetEmail(name: string, link: string): string {
  const greeting = name ? `Szia ${name}!` : "Szia!";
  return `<div style="max-width:520px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1f2937">
  <h1 style="font-size:20px;color:#0f172a;border-left:4px solid #14B8A6;padding-left:14px;margin:0 0 20px">G2A Admin — jelszó beállítása</h1>
  <p style="line-height:1.6;font-size:15px">${greeting}</p>
  <p style="line-height:1.6;font-size:15px">Az alábbi gombbal tudsz új jelszót beállítani az admin felülethez. A link <strong>1 óráig</strong> érvényes.</p>
  <p style="margin:26px 0"><a href="${link}" style="display:inline-block;background:#14B8A6;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600">Jelszó beállítása</a></p>
  <p style="line-height:1.6;font-size:13px;color:#6b7280">Ha a gomb nem működik, másold be ezt a linket a böngésződbe:<br><span style="word-break:break-all;color:#0d9488">${link}</span></p>
  <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:12px;color:#9ca3af;line-height:1.5">Ha nem te kérted, hagyd figyelmen kívül ezt a levelet — a jelszavad változatlan marad.<br>G2A Marketing · g2amarketing.hu</p>
</div>`;
}

/** Invite / reset links stay valid for one hour. */
const RESET_TTL_MS = 60 * 60 * 1000;
