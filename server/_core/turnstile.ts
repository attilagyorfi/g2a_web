/**
 * Cloudflare Turnstile verification helper.
 *
 * Turnstile is Cloudflare's CAPTCHA-replacement. The client renders a
 * widget with the public site key; on submit the widget hands back a
 * one-time token that we POST to Cloudflare's verify endpoint with our
 * secret key. Cloudflare confirms whether the token is genuine, fresh,
 * and bound to the current site.
 *
 * Env vars:
 *   - TURNSTILE_SITE_KEY:    public, sent to the browser
 *   - TURNSTILE_SECRET_KEY:  private, never leaves the server
 *
 * Feature-flag behaviour: Turnstile is only enforced when BOTH the secret
 * key and a public site key are configured. Either one alone means the
 * feature is effectively off — and enforcing with a secret but no site key
 * is worse than off: the browser has no key to render the widget, so it can
 * never produce a token, and every submission is rejected with
 * `missing-token`. Requiring both makes "remove either key = Turnstile off"
 * true, so a half-removed config can't silently lock every public form.
 * With the feature off, the honeypot + rate-limit stack remains the defence.
 */

const VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * The public site key as seen by the server. The client reads it from
 * `VITE_TURNSTILE_SITE_KEY` (baked into the build); the plain
 * `TURNSTILE_SITE_KEY` is accepted too so either naming works on Vercel.
 */
function siteKey(): string {
  return (
    process.env.VITE_TURNSTILE_SITE_KEY?.trim() ||
    process.env.TURNSTILE_SITE_KEY?.trim() ||
    ""
  );
}

export function isTurnstileConfigured(): boolean {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const site = siteKey();
  // A secret with no site key would reject every submission — warn instead
  // of silently enforcing an unusable config.
  if (secret && !site) {
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY is set but no site key is configured — " +
        "the browser can't produce a token, so verification is disabled. " +
        "Set VITE_TURNSTILE_SITE_KEY (and redeploy) to enable, or remove the " +
        "secret to silence this warning.",
    );
  }
  return Boolean(secret && site);
}

export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Verify a token from the Turnstile widget against Cloudflare's API.
 * Soft-passes (returns ok:true) when Turnstile isn't configured so the
 * form keeps working pre-rollout.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true }; // feature-flag off

  if (!token || !token.trim()) {
    return { ok: false, reason: "missing-token" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // 8s ceiling — Cloudflare normally answers in ≤500ms; this is
      // a safety net to ensure form submission isn't held hostage by a
      // network glitch on their end.
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      return { ok: false, reason: `cloudflare-${res.status}` };
    }
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (json.success) return { ok: true };
    const code = (json["error-codes"] || []).join(",") || "unknown";
    return { ok: false, reason: `cloudflare:${code}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `network:${msg}` };
  }
}
