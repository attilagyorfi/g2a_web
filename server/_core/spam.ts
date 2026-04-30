/**
 * Honeypot field check.
 *
 * Add a hidden input named `website` (or whatever HONEYPOT_FIELD is) to every
 * public form. Real users never see/touch it; bots that auto-fill all fields
 * will fill it with a URL.
 *
 * Pattern: silently accept the submission (return `true`) but DON'T persist it
 * — bots think they succeeded and don't retry, while real submissions go
 * through.
 */

export const HONEYPOT_FIELD = "website";

/**
 * Returns true if the submission looks like a bot (honeypot was filled).
 * Caller should silently no-op (still return success to the client) when true.
 */
export function isHoneypotTriggered(input: { website?: string | undefined | null }): boolean {
  return Boolean(input.website && input.website.trim().length > 0);
}
