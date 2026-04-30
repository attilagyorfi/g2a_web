/**
 * GET endpoint for one-click unsubscribe from a newsletter campaign email.
 *
 * Why a plain HTML page (not the SPA): the unsubscribe link must work even if
 * the recipient's email client opens it in a stripped-down preview pane (no
 * JavaScript). A 12-line server-rendered HTML response works everywhere.
 *
 * URL: GET /api/newsletter/unsubscribe?token=<32-char-hex>
 */
import type { Express, Request, Response } from "express";
import { unsubscribeByToken } from "../db";

function renderHtml(opts: { ok: boolean; email?: string | null }): string {
  const title = opts.ok ? "Sikeres leiratkozás" : "Hibás link";
  const body = opts.ok
    ? `<p>${escapeHtml(opts.email || "")} <strong>leiratkozott</strong> a G2A Marketing hírleveléről.</p>
       <p style="color:#64748b;font-size:14px">Több emailt nem küldünk neked. Ha mégis maradnál, írj nekünk: <a href="mailto:info@g2amarketing.hu">info@g2amarketing.hu</a>.</p>`
    : `<p>Ez a leiratkozási link érvénytelen vagy lejárt.</p>
       <p style="color:#64748b;font-size:14px">Ha továbbra is kapsz emailt tőlünk, írj az <a href="mailto:info@g2amarketing.hu">info@g2amarketing.hu</a> címre és kézzel törölünk a listából.</p>`;

  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title} – G2A Marketing</title>
<style>
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f8fafc; color: #0f172a; }
  .card { max-width: 520px; margin: 80px auto; padding: 40px 32px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px -10px rgba(15,23,42,0.1); border-top: 4px solid #14B8A6; }
  h1 { margin: 0 0 16px; font-size: 22px; }
  p { line-height: 1.6; font-size: 15px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #94a3b8; text-align: center; }
  a { color: #0d9488; }
</style>
</head>
<body>
<div class="card">
  <h1>${title}</h1>
  ${body}
  <div class="footer">G2A Marketing Bt. · Pécs · <a href="https://g2amarketing.hu">g2amarketing.hu</a></div>
</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function registerNewsletterRoutes(app: Express) {
  // RFC 8058 compliant one-click unsubscribe (GET = preview, POST = confirm)
  // Most email clients now use POST per RFC 8058, but we accept both.
  const handler = async (req: Request, res: Response) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token || token.length < 8) {
      res.status(400).type("html").send(renderHtml({ ok: false }));
      return;
    }
    try {
      const email = await unsubscribeByToken(token);
      res.status(200).type("html").send(renderHtml({ ok: Boolean(email), email }));
    } catch (err) {
      console.error("[newsletter] unsubscribe error:", err);
      res.status(500).type("html").send(renderHtml({ ok: false }));
    }
  };

  app.get("/api/newsletter/unsubscribe", handler);
  app.post("/api/newsletter/unsubscribe", handler);
}
