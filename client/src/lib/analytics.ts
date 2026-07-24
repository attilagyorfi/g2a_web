/**
 * Thin dataLayer event layer for GTM / GA4 / Meta Pixel.
 *
 * Why this exists: the site is a client-routed SPA whose forms submit via
 * tRPC (no page reload). That breaks GTM's built-in triggers — the "Form
 * Submission" trigger fires on the raw submit event (before validation and
 * before the async success), and GA4's page_view only fires on the initial
 * load. So we push explicit, semantic events at the exact success moments and
 * a virtual page view on every route change. GTM then maps these to GA4 events
 * / Meta Pixel / Google Ads conversions (see docs/analytics-tag-guide).
 *
 * Consent-safe: pushing to `dataLayer` is just an array push — no network, no
 * cookie. GTM itself only loads after `marketing` consent (ThirdPartyScripts),
 * then drains whatever queued here. Pre-consent pushes simply never get sent.
 */
type Params = Record<string, unknown>;

function dataLayer(): unknown[] {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  return w.dataLayer;
}

/** Push a named custom event with optional parameters. */
export function trackEvent(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    dataLayer().push({ event, ...params });
  } catch {
    /* no-op — analytics must never break the app */
  }
}

/** SPA virtual page view. GA4 (via GTM) otherwise only ever sees the landing
 *  page; fire this on route change so every screen is counted. */
export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  trackEvent("virtual_page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Semantic conversion events, centralised so names stay consistent with the
 *  GTM triggers documented in the tag guide. `value`/`currency` are optional
 *  and only matter if you assign monetary value to a lead in GA4/Ads. */
export const track = {
  lead: (source: string) => trackEvent("generate_lead", { form: "contact", lead_source: source }),
  auditRequest: (source: string) => trackEvent("audit_request", { form: "audit", lead_source: source }),
  newsletterSignup: (source: string) => trackEvent("newsletter_signup", { form: "newsletter", signup_source: source }),
  jobApplication: () => trackEvent("job_application", { form: "careers" }),
};
