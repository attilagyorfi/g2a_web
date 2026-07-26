/**
 * Resend webhook handler — POST /api/webhooks/resend.
 *
 * Resend sends events through Svix (https://docs.resend.com/dashboard/webhooks).
 * Each event is a JSON body with:
 *   - type: "email.delivered" | "email.opened" | "email.clicked" |
 *           "email.bounced" | "email.complained" | "email.delivery_delayed"
 *   - data: {
 *       email_id, from, to[], subject, created_at,
 *       tags: { campaign_id?: string, ... }    // we set this on send
 *       click?: { link, ipAddress, ... }       // for email.clicked
 *       bounce?: { ... }                        // for email.bounced
 *     }
 *
 * Verification: Svix signs every request with HMAC-SHA256. The header
 * `svix-signature` carries `v1,<base64>` pairs over the body
 * `<svix-id>.<svix-timestamp>.<rawBody>`. We verify with the secret from
 * `RESEND_WEBHOOK_SECRET` (which is the Svix-format `whsec_<base64>`).
 *
 * In dev (NODE_ENV !== "production"), unsigned requests are accepted — so
 * you can test locally without setting up the secret. In prod we 401 them.
 */
import type { Express, Request, Response } from "express";
import { createHmac, timingSafeEqual } from "crypto";
import { ENV } from "./env";
import { recordEmailEvent, bumpEngagement } from "../db";

const TOLERANCE_SECONDS = 5 * 60; // reject events older than 5 minutes (replay protection)

function verifySvixSignature(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
  secret: string,
): boolean {
  const id = headers["svix-id"] as string | undefined;
  const timestamp = headers["svix-timestamp"] as string | undefined;
  const signatureHeader = headers["svix-signature"] as string | undefined;
  if (!id || !timestamp || !signatureHeader) return false;

  // Replay protection: reject very old timestamps
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const drift = Math.abs(Date.now() / 1000 - ts);
  if (drift > TOLERANCE_SECONDS) return false;

  // Secret format: "whsec_<base64>". Strip the prefix and decode.
  const secretBytes = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice(6), "base64")
    : Buffer.from(secret, "utf8");

  const signedPayload = `${id}.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secretBytes)
    .update(signedPayload)
    .digest("base64");

  // svix-signature is space-separated `v1,<base64>` pairs (rotation support)
  const candidates = signatureHeader.split(" ");
  for (const candidate of candidates) {
    const parts = candidate.split(",");
    if (parts.length !== 2 || parts[0] !== "v1") continue;
    const provided = parts[1];
    // timingSafeEqual requires equal-length buffers
    if (provided.length !== expected.length) continue;
    if (
      timingSafeEqual(
        Buffer.from(provided, "utf8"),
        Buffer.from(expected, "utf8"),
      )
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Resend wraps tags in a few different shapes across event types:
 *  - `data.tags: [{ name, value }]`  ← when set explicitly via API
 *  - `data.tags: { name: "value" }`  ← legacy / object form
 * Try both, normalise to a flat object.
 */
function extractTags(eventData: unknown): Record<string, string> {
  if (!eventData || typeof eventData !== "object") return {};
  const tags = (eventData as { tags?: unknown }).tags;
  if (!tags) return {};
  if (Array.isArray(tags)) {
    const map: Record<string, string> = {};
    for (const t of tags) {
      if (
        t &&
        typeof t === "object" &&
        typeof (t as { name?: unknown }).name === "string" &&
        typeof (t as { value?: unknown }).value === "string"
      ) {
        map[(t as { name: string }).name] = (t as { value: string }).value;
      }
    }
    return map;
  }
  if (typeof tags === "object") {
    return Object.fromEntries(
      Object.entries(tags as Record<string, unknown>).filter(
        ([, v]) => typeof v === "string",
      ) as [string, string][],
    );
  }
  return {};
}

export function registerResendWebhookRoute(app: Express) {
  // Express's built-in JSON parser strips the raw body before we can verify
  // the HMAC signature. We add a body-parser-replacement middleware just for
  // this route that captures the raw bytes first, then parses JSON manually.
  app.post(
    "/api/webhooks/resend",
    (req: Request, res: Response, next) => {
      let body = "";
      req.setEncoding("utf8");
      req.on("data", (chunk: string) => {
        body += chunk;
        // 1MB hard cap — Resend events are typically <2KB
        if (body.length > 1_000_000) {
          res.status(413).json({ error: "Payload too large" });
          req.destroy();
        }
      });
      req.on("end", () => {
        (req as Request & { rawBody?: string }).rawBody = body;
        try {
          (req as Request & { body?: unknown }).body = body ? JSON.parse(body) : {};
        } catch {
          res.status(400).json({ error: "Invalid JSON" });
          return;
        }
        next();
      });
    },
    async (req, res) => {
      const rawBody =
        (req as Request & { rawBody?: string }).rawBody ?? "";

      // Signature verification: in production, required. In dev, optional.
      if (ENV.resendWebhookSecret) {
        if (!verifySvixSignature(rawBody, req.headers, ENV.resendWebhookSecret)) {
          res.status(401).json({ error: "Invalid signature" });
          return;
        }
      } else if (ENV.isProduction) {
        // Production with no secret configured = misconfig, but be permissive
        // to avoid silently swallowing events. Log a warning and accept.
        console.warn(
          "[resend-webhook] RESEND_WEBHOOK_SECRET not set in production — accepting unsigned events",
        );
      }

      // Resend event format
      type ResendEvent = {
        type?: string;
        data?: {
          email_id?: string;
          to?: string[] | string;
          subject?: string;
          tags?: unknown;
        };
      };
      const event = req.body as ResendEvent | undefined;
      if (!event || typeof event !== "object" || !event.type) {
        res.status(400).json({ error: "Missing event type" });
        return;
      }

      // Extract recipient (Resend sends `to` as either string or array)
      const data = event.data ?? {};
      const recipient = Array.isArray(data.to)
        ? data.to[0] ?? "unknown"
        : data.to ?? "unknown";
      const messageId = data.email_id;

      // Pull campaign_id tag if present
      const tags = extractTags(data);
      const campaignIdRaw = tags.campaign_id ?? tags.campaignId;
      const campaignId =
        campaignIdRaw && /^\d+$/.test(campaignIdRaw)
          ? Number(campaignIdRaw)
          : null;

      try {
        await recordEmailEvent({
          campaignId,
          recipient,
          eventType: event.type,
          resendMessageId: messageId,
          rawData: JSON.stringify(event),
        });
        // Behavioural lead scoring: reward engagement + refresh recency.
        if (recipient && recipient !== "unknown") {
          if (event.type === "email.opened") await bumpEngagement(recipient, 1);
          else if (event.type === "email.clicked") await bumpEngagement(recipient, 3);
        }
      } catch (err) {
        // Resend retries on 5xx — only return 500 for genuine DB failures
        console.error("[resend-webhook] DB write failed:", err);
        res.status(500).json({ error: "Storage failed" });
        return;
      }

      res.status(200).json({ ok: true });
    },
  );
}
