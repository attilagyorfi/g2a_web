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
 * Feature-flag behaviour: if `TURNSTILE_SECRET_KEY` is unset, the server
 * skips verification entirely and the existing honeypot + rate-limit
 * stack remains the only defence. That way we can deploy the code path
 * before Attila has the Cloudflare account wired up, and the forms keep
 * working in local dev where Cloudflare keys aren't available.
 */

const VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
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
