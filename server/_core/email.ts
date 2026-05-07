/**
 * Email bridge — Resend.
 *
 * Env:
 *   RESEND_API_KEY        Resend API key (re_...)
 *   RESEND_FROM_EMAIL     Sender (default: onboarding@resend.dev for sandbox)
 *   RESEND_NOTIFY_EMAIL   Inbox for owner notifications (e.g. info@g2amarketing.hu)
 *
 * Returns true on success, false on missing config / upstream failure
 * (callers should never throw — email is best-effort, never blocks form submission).
 */
import { ENV } from "./env";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(ENV.resendApiKey && ENV.resendNotifyEmail);
}

export type EmailPayload = {
  /** Recipient — defaults to RESEND_NOTIFY_EMAIL for owner notifications. */
  to?: string | string[];
  subject: string;
  /** HTML body — rendered in mail client. */
  html: string;
  /** Plain-text fallback (recommended for deliverability). */
  text?: string;
  /** Reply-To header — set to the visitor's address so admin can reply directly. */
  replyTo?: string;
  /**
   * Resend tags. Used to attribute webhook events back to a specific
   * campaign — pass `[{ name: "campaign_id", value: String(campaignId) }]`.
   * Tag names must be lowercase ASCII, alphanumeric + underscore (Resend
   * rejects others with 422).
   */
  tags?: Array<{ name: string; value: string }>;
};

/**
 * The legacy boolean return is preserved for callers that don't care about
 * the message ID (transactional notifications, welcome emails). New callers
 * needing event-level attribution should use `sendEmailWithId` instead.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const result = await sendEmailWithId(payload);
  return result.ok;
}

/**
 * Send an email and return the Resend message ID for downstream event
 * attribution (open / click webhook → campaign).
 */
export async function sendEmailWithId(
  payload: EmailPayload,
): Promise<{ ok: boolean; messageId?: string }> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email send");
    return { ok: false };
  }
  const to = payload.to ?? ENV.resendNotifyEmail;
  if (!to || (Array.isArray(to) && to.length === 0)) {
    console.warn("[Email] No recipient (set RESEND_NOTIFY_EMAIL or pass `to`) — skipping");
    return { ok: false };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: ENV.resendFromEmail,
        to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
        tags: payload.tags,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[Email] Resend ${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
      return { ok: false };
    }
    // Resend returns `{ id: "..." }` on success — capture it for event correlation.
    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, messageId: data?.id };
  } catch (err) {
    console.warn("[Email] Resend request failed:", err);
    return { ok: false };
  }
}

/**
 * Renders a markdown-ish notification body to minimal HTML.
 * Converts **bold** to <strong>, line breaks to <br>, blank lines to <p>.
 * Keeps it intentionally tiny — no full markdown, just enough for the existing
 * notifyOwner() payload format.
 */
export function renderNotificationHtml(content: string): string {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Split on blank lines → paragraphs, single \n → <br>
  const paragraphs = withBold
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 12px 0;line-height:1.55;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  return `<div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff">
  <div style="border-left:3px solid #14B8A6;padding-left:16px;margin-bottom:20px">
    <span style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:12px;color:#6b7280;letter-spacing:0.06em;text-transform:uppercase">G2A Marketing — automatikus értesítés</span>
  </div>
  ${paragraphs}
  <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:11px;color:#9ca3af">Ezt az emailt a g2amarketing.hu admin rendszere küldte automatikusan.</p>
</div>`;
}
