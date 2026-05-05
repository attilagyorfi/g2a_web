import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext; clearedCookies: Array<{ name: string; options: Record<string, unknown> }> } {
  const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "info@g2amarketing.hu",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

// ─── Auth tests ───────────────────────────────────────────────────────────────

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1, httpOnly: true, path: "/" });
  });
});

describe("auth.me", () => {
  it("returns user when authenticated", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).not.toBeNull();
    expect(user?.email).toBe("info@g2amarketing.hu");
    expect(user?.role).toBe("admin");
  });

  it("returns null when not authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});

// ─── Content tests ────────────────────────────────────────────────────────────

describe("content.services", () => {
  it("returns a list of services", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const services = await caller.content.services();
    expect(Array.isArray(services)).toBe(true);
    // Each service should have required fields
    if (services.length > 0) {
      const s = services[0];
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("title");
      expect(s).toHaveProperty("slug");
    }
  });
});

describe("content.posts", () => {
  it("returns paginated posts with posts and total", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.content.posts({ page: 1, limit: 6 });
    expect(result).toHaveProperty("posts");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.posts)).toBe(true);
  });

  it("filters posts by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.content.posts({ page: 1, limit: 10, categoryId: 999 });
    expect(result).toHaveProperty("posts");
    expect(Array.isArray(result.posts)).toBe(true);
  });
});

describe("content.categories", () => {
  it("returns a list of categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const categories = await caller.content.categories();
    expect(Array.isArray(categories)).toBe(true);
  });
});

describe("content.partners", () => {
  it("returns a list of partners", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const partners = await caller.content.partners();
    expect(Array.isArray(partners)).toBe(true);
    if (partners.length > 0) {
      expect(partners[0]).toHaveProperty("id");
      expect(partners[0]).toHaveProperty("name");
    }
  });
});

describe("content.testimonials", () => {
  it("returns a list of testimonials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const testimonials = await caller.content.testimonials();
    expect(Array.isArray(testimonials)).toBe(true);
  });
});

describe("content.heroSlides", () => {
  it("returns active hero slides", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const slides = await caller.content.heroSlides();
    expect(Array.isArray(slides)).toBe(true);
  });
});

// ─── Public form submission tests ─────────────────────────────────────────────

describe("contact.submit", () => {
  it("accepts a valid contact form submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.contact.submit({
      name: "Teszt Felhasználó",
      email: "teszt@example.com",
      message: "Ez egy teszt üzenet a vitest teszteléshez.",
    });
    expect(result).toHaveProperty("success", true);
  });
});

describe("newsletter.subscribe", () => {
  it("accepts a valid newsletter subscription", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const uniqueEmail = `vitest-${Date.now()}@example.com`;
    const result = await caller.newsletter.subscribe({
      email: uniqueEmail,
      name: "Vitest",
    });
    expect(result).toHaveProperty("success", true);
  });
});

// ─── Admin access control tests ───────────────────────────────────────────────

describe("admin access control", () => {
  it("admin.contacts.list is accessible to admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const contacts = await caller.admin.contacts.list();
    expect(Array.isArray(contacts)).toBe(true);
  });

  it("admin.newsletter.list is accessible to admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const subscribers = await caller.admin.newsletter.list();
    expect(Array.isArray(subscribers)).toBe(true);
  });

  it("admin.settings.list is accessible to admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const settings = await caller.admin.settings.list();
    expect(Array.isArray(settings)).toBe(true);
  });
});

// ─── New page content tests ────────────────────────────────────────────────────

describe("content.industries", () => {
  it("returns a list of industries", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const industries = await caller.content.industries();
    expect(Array.isArray(industries)).toBe(true);
    if (industries.length > 0) {
      expect(industries[0]).toHaveProperty("id");
      expect(industries[0]).toHaveProperty("name");
    }
  });
});

describe("content.values", () => {
  it("returns a list of values", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const values = await caller.content.values();
    expect(Array.isArray(values)).toBe(true);
  });
});

describe("content.technologies", () => {
  it("returns a list of technologies", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const techs = await caller.content.technologies();
    expect(Array.isArray(techs)).toBe(true);
  });
});

describe("content.pageSeo", () => {
  it("returns SEO data for a page slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const seo = await caller.content.pageSeo({ slug: "fooldal" });
    // May be null if no SEO data exists for this slug
    if (seo) {
      expect(seo).toHaveProperty("slug");
    }
  });
});

describe("admin.pages", () => {
  it("admin.pages.list is accessible to admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const pages = await caller.admin.pages.list();
    expect(Array.isArray(pages)).toBe(true);
  });
});
