/**
 * Email service helper using Brevo (formerly Sendinblue) API.
 * The Brevo API key is stored in site_settings with key "brevo_api_key".
 * If not configured, email sending is silently skipped.
 */

import { getAllSiteSettings } from "./db";

interface SendEmailOptions {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  textContent?: string;
  senderName?: string;
  senderEmail?: string;
}

async function getBrevoApiKey(): Promise<string | null> {
  try {
    const settings = await getAllSiteSettings();
    const setting = settings.find((s: { key: string; value: string | null }) => s.key === "brevo_api_key");
    return setting?.value?.trim() || null;
  } catch {
    return null;
  }
}

async function getSenderInfo(): Promise<{ name: string; email: string }> {
  try {
    const settings = await getAllSiteSettings();
    const emailSetting = settings.find((s: { key: string; value: string | null }) => s.key === "contact_email");
    const nameSetting = settings.find((s: { key: string; value: string | null }) => s.key === "site_name");
    return {
      name: nameSetting?.value || "G2A Marketing",
      email: emailSetting?.value || "info@g2amarketing.hu",
    };
  } catch {
    return { name: "G2A Marketing", email: "info@g2amarketing.hu" };
  }
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = await getBrevoApiKey();
  if (!apiKey) {
    console.log("[EmailService] Brevo API key not configured – skipping email send");
    return false;
  }

  const sender = await getSenderInfo();

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: options.senderName || sender.name,
          email: options.senderEmail || sender.email,
        },
        to: [{ email: options.to.email, name: options.to.name || "" }],
        subject: options.subject,
        htmlContent: options.htmlContent,
        textContent: options.textContent || "",
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(`[EmailService] Brevo API error (${response.status}): ${detail}`);
      return false;
    }

    console.log(`[EmailService] Email sent successfully to ${options.to.email}`);
    return true;
  } catch (error) {
    console.warn("[EmailService] Error sending email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  const displayName = name || "Kedves Feliratkozó";

  const htmlContent = `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Üdvözöljük a G2A Marketing hírlevelén!</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Outfit',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%);padding:40px 40px 30px;border-bottom:2px solid #d97706;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#d97706;letter-spacing:0.15em;text-transform:uppercase;">G2A MARKETING</span>
                    <h1 style="margin:8px 0 0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">Üdvözöljük a csapatban!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#e0e0e0;line-height:1.6;">
                Kedves <strong style="color:#d97706;">${displayName}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:16px;color:#a0a0a0;line-height:1.6;">
                Köszönjük, hogy feliratkozott a <strong style="color:#ffffff;">G2A Marketing</strong> hírlevelére! 
                Hamarosan megkapja a legfrissebb marketing trendeket, esettanulmányokat és exkluzív tippeket közvetlenül a postaládájába.
              </p>
              
              <!-- Value props -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="padding:16px;background:rgba(217,119,6,0.08);border-left:3px solid #d97706;border-radius:0 8px 8px 0;margin-bottom:12px;">
                    <p style="margin:0;font-size:14px;color:#d97706;font-weight:600;">📊 Adatvezérelt tartalmak</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#a0a0a0;">Valós kampány adatok és ROI elemzések</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;">
                <tr>
                  <td style="padding:16px;background:rgba(217,119,6,0.08);border-left:3px solid #d97706;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:14px;color:#d97706;font-weight:600;">🚀 Exkluzív stratégiák</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#a0a0a0;">Bevált módszerek, amelyeket ügyfeleinkkel tesztelünk</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 30px;">
                <tr>
                  <td style="padding:16px;background:rgba(217,119,6,0.08);border-left:3px solid #d97706;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:14px;color:#d97706;font-weight:600;">🎯 Iparág-specifikus tippek</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#a0a0a0;">Testreszabott megoldások az Ön szektorára</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:10px 0 30px;">
                    <a href="https://g2amarketing.hu/ingyenes-audit" 
                       style="display:inline-block;background:#d97706;color:#000000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:6px;text-decoration:none;letter-spacing:0.02em;">
                      Kérjen ingyenes marketing auditot →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#606060;line-height:1.6;">
                Ha bármilyen kérdése van, keressen minket a 
                <a href="mailto:info@g2amarketing.hu" style="color:#d97706;text-decoration:none;">info@g2amarketing.hu</a> 
                címen vagy hívjon minket a <a href="tel:+36301902575" style="color:#d97706;text-decoration:none;">+36 30 190 2575</a> számon.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#111111;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:#404040;text-align:center;line-height:1.6;">
                © 2025 G2A Marketing Kft. · Budapest, Magyarország<br>
                <a href="https://g2amarketing.hu/adatvedelmi-iranyelvek" style="color:#606060;text-decoration:none;">Adatvédelmi irányelvek</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
Kedves ${displayName},

Köszönjük, hogy feliratkozott a G2A Marketing hírlevelére!

Hamarosan megkapja a legfrissebb marketing trendeket, esettanulmányokat és exkluzív tippeket.

Kérjen ingyenes marketing auditot: https://g2amarketing.hu/ingyenes-audit

Üdvözlettel,
G2A Marketing csapata
info@g2amarketing.hu | +36 30 190 2575
  `;

  return sendEmail({
    to: { email, name: displayName },
    subject: "Üdvözöljük a G2A Marketing hírlevelén! 🚀",
    htmlContent,
    textContent,
  });
}

export async function syncToBrevoList(email: string, name?: string): Promise<boolean> {
  const apiKey = await getBrevoApiKey();
  if (!apiKey) return false;

  try {
    const settings = await getAllSiteSettings();
    const listIdSetting = settings.find((s: { key: string; value: string | null }) => s.key === "brevo_list_id");
    const listId = listIdSetting?.value ? parseInt(listIdSetting.value) : null;

    const body: Record<string, unknown> = {
      email,
      attributes: { FIRSTNAME: name || "" },
      updateEnabled: true,
    };

    if (listId) {
      body.listIds = [listId];
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok && response.status !== 204) {
      const detail = await response.text().catch(() => "");
      console.warn(`[EmailService] Brevo contact sync error (${response.status}): ${detail}`);
      return false;
    }

    console.log(`[EmailService] Contact synced to Brevo: ${email}`);
    return true;
  } catch (error) {
    console.warn("[EmailService] Error syncing to Brevo:", error);
    return false;
  }
}
