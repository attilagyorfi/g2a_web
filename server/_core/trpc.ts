import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { hasPermission, type Permission } from '@shared/permissions';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

const requireAdmin = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }
  // Suspended staff keep their row (and history) but lose access immediately.
  if (ctx.user.isActive === false) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Ez a hozzáférés fel van függesztve." });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/** Any signed-in staff member (owner or invited user). */
export const adminProcedure = t.procedure.use(requireAdmin);

/**
 * Admin procedure additionally gated on one granular permission.
 *
 * Staff accounts carry a permission list (`users.permissions`); the owner
 * bypasses it. Use this instead of `adminProcedure` on every router that maps
 * to a section of the admin sidebar, so a limited account can't reach an area
 * simply by calling the endpoint directly.
 */
export function permissionProcedure(permission: Permission) {
  return t.procedure.use(requireAdmin).use(
    t.middleware(async opts => {
      const { ctx, next } = opts;
      if (!hasPermission(ctx.user, permission)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Ehhez a részhez nincs jogosultságod. Kérj hozzáférést az adminisztrátortól.",
        });
      }
      return next({ ctx });
    }),
  );
}
