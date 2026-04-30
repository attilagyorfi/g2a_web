import { TRPCError } from "@trpc/server";
import { ENV } from "./env";
import { isEmailConfigured, renderNotificationHtml, sendEmail } from "./email";

export type NotificationPayload = {
  title: string;
  content: string;
  /** Optional: visitor email — set as Reply-To so admin can reply directly. */
  replyTo?: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const buildEndpointUrl = (baseUrl: string): string => {
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl
    : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required.",
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required.",
    });
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`,
    });
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`,
    });
  }

  return { title, content, replyTo: input.replyTo };
};

async function sendViaForge(title: string, content: string): Promise<boolean> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) return false;
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Forge failed (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Forge error:", error);
    return false;
  }
}

async function sendViaResend(
  title: string,
  content: string,
  replyTo?: string,
): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  return sendEmail({
    subject: title,
    html: renderNotificationHtml(content),
    text: content,
    replyTo,
  });
}

/**
 * Dispatches an owner notification using whatever transports are configured.
 *
 * Order of preference:
 *   1. Manus Forge (if BUILT_IN_FORGE_API_URL/_KEY set) — kept for compatibility
 *   2. Resend email (if RESEND_API_KEY + RESEND_NOTIFY_EMAIL set)
 *
 * If at least one transport succeeds, returns true. If all configured transports
 * fail (or none are configured), returns false — callers should NOT throw, as
 * the lead has already been persisted to the DB and admin can review there.
 *
 * Configuration is deliberately fail-soft so a misconfigured email setup never
 * blocks a contact form submission.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content, replyTo } = validatePayload(payload);

  const hasForge = Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
  const hasResend = isEmailConfigured();

  if (!hasForge && !hasResend) {
    console.warn(
      "[Notification] No transport configured (set BUILT_IN_FORGE_API_KEY or RESEND_API_KEY+RESEND_NOTIFY_EMAIL). Lead saved to DB only."
    );
    return false;
  }

  // Try Forge first if available (existing behavior), then fall back to Resend.
  if (hasForge) {
    const ok = await sendViaForge(title, content);
    if (ok) return true;
    if (hasResend) {
      console.warn("[Notification] Forge failed, retrying via Resend");
      return sendViaResend(title, content, replyTo);
    }
    return false;
  }

  return sendViaResend(title, content, replyTo);
}
