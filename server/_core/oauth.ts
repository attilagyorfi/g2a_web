import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  /**
   * Diagnostic endpoint — returns the current authenticated user's openId
   * (and basic info) so the operator can copy it into OWNER_OPEN_ID after
   * their first successful Manus login. Returns 401 if no valid session.
   *
   * Production-safe: never exposes secrets, only the openId of the caller.
   */
  app.get("/api/_diag/me", async (req: Request, res: Response) => {
    let user;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      // sdk.authenticateRequest throws ForbiddenError when there's no valid
      // session — that's the expected "not logged in" path here, not a 500.
      res.status(401).json({
        authenticated: false,
        hint:
          "Nincs aktív session. Lépj be: nyisd meg /admin-t, jelentkezz be " +
          "Manus-szal, majd hívd újra ezt az endpointot.",
      });
      return;
    }

    res.json({
      authenticated: true,
      openId: user.openId,
      name: user.name,
      email: user.email,
      role: user.role,
      loginMethod: user.loginMethod,
      hint:
        user.role === "admin"
          ? `Ez a user már admin. OWNER_OPEN_ID=${user.openId}`
          : `Másold ezt az openId-t az .env OWNER_OPEN_ID változóba, ` +
            `majd indítsd újra a szervert — ez a user automatikusan admin lesz.`,
    });
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Parse returnPath from state if present
      let redirectTo = "/";
      try {
        const decoded = Buffer.from(state, "base64").toString("utf-8");
        // Try JSON format first (new format with returnPath)
        if (decoded.startsWith("{")) {
          const parsed = JSON.parse(decoded);
          if (parsed.returnPath) {
            redirectTo = parsed.returnPath;
          } else if (parsed.redirectUri) {
            const url = new URL(parsed.redirectUri);
            redirectTo = url.pathname || "/";
          }
        } else {
          // Legacy format: plain redirectUri
          const url = new URL(decoded);
          redirectTo = url.pathname || "/";
        }
      } catch {
        redirectTo = "/";
      }
      res.redirect(302, redirectTo);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
