import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Dev-only admin bypass. Activates ONLY when both:
 *   - NODE_ENV === "development"
 *   - DEV_ADMIN_BYPASS === "true"
 * Production builds (NODE_ENV=production) can never trigger this, even if
 * the env var leaks. The fake user's email is "dev@local" so the UI can
 * render a warning banner.
 */
const DEV_BYPASS_ACTIVE =
  process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true";

const DEV_ADMIN_USER: User = {
  id: 0,
  openId: "dev-bypass-admin",
  name: "Dev Admin (Bypass)",
  email: "dev@local",
  loginMethod: "dev-bypass",
  role: "admin",
  // Full access in dev so every admin screen stays reachable behind the bypass.
  passwordHash: null,
  permissions: null,
  isActive: true,
  isOwner: true,
  resetToken: null,
  resetTokenExpiresAt: null,
  invitedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

if (DEV_BYPASS_ACTIVE) {
  // eslint-disable-next-line no-console
  console.warn("[DEV] Admin auth BYPASS is active — admin API requires no login. Never enable in production.");
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  if (DEV_BYPASS_ACTIVE) {
    return { req: opts.req, res: opts.res, user: DEV_ADMIN_USER };
  }

  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
