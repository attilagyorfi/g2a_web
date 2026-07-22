import { useState } from "react";
import { Phone, Mail, Send, CheckCircle, QrCode } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ContactHeroDemo from "@/components/page-demos/ContactHeroDemo";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalizedStrict } from "@/../../shared/i18n";
import { parseFormError } from "@/lib/utils";
import CalendlyEmbed, { isCalendlyConfigured } from "@/components/CalendlyEmbed";
import TurnstileWidget, { useTurnstileGate } from "@/components/TurnstileWidget";

const MESSAGE_MIN = 10;

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/kapcsolat" });
  const submitMutation = trpc.contact.submit.useMutation();
  // `website` is a honeypot — never shown to humans, must stay empty.
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  // Turnstile token — populated by the widget callback. When the
  // feature flag is off (no site key), this stays empty and the
  // server also soft-passes.
  const [turnstileToken, setTurnstileToken] = useState("");

  const messageLen = form.message.trim().length;
  const messageTooShort = messageLen > 0 && messageLen < MESSAGE_MIN;
  // Bot check gating. If Turnstile can't run (script blocked, or the site key
  // doesn't allow this hostname) we stop blocking after a short wait and let
  // the submit through, so the visitor gets a real answer instead of a button
  // that stays greyed out forever.
  const turnstile = useTurnstileGate(turnstileToken);
  const canSubmit = !submitting && messageLen >= MESSAGE_MIN && !turnstile.waiting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side guard — friendly inline message instead of waiting for server roundtrip
    if (messageLen < MESSAGE_MIN) {
      toast.error(t("contact.errorMessageMin"));
      return;
    }
    if (turnstile.waiting) {
      toast.error(t("contact.turnstileWait"));
      return;
    }
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync({ ...form, turnstileToken: turnstileToken || undefined });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
      setTurnstileToken("");
      toast.success(t("contact.messageSentToast"));
    } catch (err: unknown) {
      toast.error(parseFormError(err, t("common.error")));
      // Token is single-use — clear it so the widget re-issues on retry.
      setTurnstileToken("");
    } finally {
      setSubmitting(false);
    }
  };

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Kapcsolat – G2A Marketing",
    "url": "https://g2amarketing.hu/kapcsolat",
    "mainEntity": {
      "@type": "Organization",
      "name": "G2A Marketing",
      "telephone": "+36301902575",
      "email": "info@g2amarketing.hu",
      "address": { "@type": "PostalAddress", "addressLocality": "Pécs", "addressCountry": "HU" },
      "openingHours": "Mo-Fr 08:00-17:00",
    },
  });

  // No working hours or street address in the contact list — the
  // office isn't visitor-facing. Phone + email + scheduling via
  // Calendly is the entire contact surface.
  const contactItems = [
    { icon: <Phone size={20} />, label: t("common.phone"), value: "+36 30 190 2575", href: "tel:+36301902575" },
    { icon: <Mail size={20} />, label: t("common.email"), value: "info@g2amarketing.hu", href: "mailto:info@g2amarketing.hu" },
  ];

  return (
    <>
      <SeoHead
        title={pickLocalizedStrict(pageSeo, "metaTitle", lang) || t("contact.seoTitle")}
        description={pickLocalizedStrict(pageSeo, "metaDescription", lang) || t("contact.seoDesc")}
        schemaJson={schemaJson}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(ellipse at 80% 30%, var(--g2a-hero-tint) 0%, transparent 55%), var(--g2a-bg)",
        }}>
          <div className="g2a-container">
            <div
              className="g2a-service-hero-grid"
              style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 460px)", gap: "3rem", alignItems: "center" }}
            >
              <div>
                <div className="g2a-section-label">{t("nav.contact")}</div>
                <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem" }}>
                  {t("contact.title")}
                </h1>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "560px" }}>
                  {t("contact.subtitle")}
                </p>
              </div>
              <div className="g2a-service-hero-demo">
                <ContactHeroDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
              {/* Contact Info */}
              <div>
                <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "2rem" }}>
                  {t("contact.contactInfo")}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {contactItems.map(item => (
                    <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(20,184,166,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--g2a-brand-teal)", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem", fontFamily: "Geist Mono, monospace" }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ color: "var(--g2a-text-primary)", fontSize: "0.9375rem", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-text-accent)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-primary)")}>
                            {item.value}
                          </a>
                        ) : (
                          <span style={{ color: "var(--g2a-text-primary)", fontSize: "0.9375rem" }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="g2a-card">
                <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {t("contact.formTitle")}
                </h2>
                <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "2rem" }}>
                  {t("contact.formHint24h")}
                </p>

                {success ? (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <CheckCircle size={48} style={{ color: "#10b981", margin: "0 auto 1.5rem", display: "block" }} />
                    <h3 style={{ color: "#4ade80", fontFamily: "Geist Mono, monospace", marginBottom: "0.5rem" }}>
                      {t("contact.successTitle")}
                    </h3>
                    <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                      {t("contact.successDesc")}
                    </p>
                    <button onClick={() => setSuccess(false)} className="g2a-btn-primary">
                      {t("contact.sendAnother")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Honeypot — hidden from real users; bots that auto-fill all inputs trigger silent reject */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                      aria-hidden="true"
                      style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                      <div>
                        <label className="g2a-label">{t("common.name")} *</label>
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="g2a-input" placeholder={t("common.name")} />
                      </div>
                      <div>
                        <label className="g2a-label">{t("common.email")} *</label>
                        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="g2a-input" placeholder="email@pelda.hu" />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                      <div>
                        <label className="g2a-label">{t("common.phone")}</label>
                        <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="g2a-input" placeholder="+36 30 123 4567" />
                      </div>
                      <div>
                        <label className="g2a-label">{t("contact.subject")}</label>
                        <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="g2a-input" placeholder={t("contact.subjectPlaceholder")} />
                      </div>
                    </div>
                    <div>
                      <label className="g2a-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                        <span>{t("common.message")} *</span>
                        <span
                          aria-live="polite"
                          style={{
                            fontFamily: "Geist Mono, monospace",
                            fontSize: "0.7rem",
                            color: messageTooShort
                              ? "#ef4444"
                              : messageLen >= MESSAGE_MIN
                              ? "var(--g2a-text-secondary)"
                              : "var(--g2a-text-muted)",
                            transition: "color 0.15s",
                          }}
                        >
                          {messageLen} / {MESSAGE_MIN}
                        </span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        required
                        minLength={MESSAGE_MIN}
                        className="g2a-input"
                        placeholder={t("contact.messagePlaceholder")}
                        rows={6}
                        style={{
                          resize: "vertical",
                          borderColor: messageTooShort ? "rgba(239,68,68,0.55)" : undefined,
                        }}
                      />
                      {messageTooShort && (
                        <p style={{ marginTop: 4, fontSize: "0.75rem", color: "#ef4444", fontFamily: "Geist Mono, monospace" }}>
                          {t("contact.errorMessageMin")}
                        </p>
                      )}
                    </div>
                    {/* Cloudflare Turnstile widget — renders nothing
                        when feature flag is off (VITE_TURNSTILE_SITE_KEY
                        unset), so this is safe for local dev. */}
                    <TurnstileWidget
                      onToken={setTurnstileToken}
                      onExpire={() => setTurnstileToken("")}
                      onError={turnstile.markFailed}
                    />
                    {turnstile.failed && (
                      <p role="status" style={{ margin: 0, fontSize: "0.78rem", lineHeight: 1.5, color: "#fbbf24" }}>
                        {t("contact.turnstileUnavailable")}
                      </p>
                    )}
                    <button type="submit" className="g2a-btn-primary" disabled={!canSubmit} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                      <Send size={16} />
                      {submitting ? t("common.loading") : t("contact.send")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Calendly booking section — only renders when VITE_CALENDLY_URL is set */}
        {isCalendlyConfigured() && (
          <section className="g2a-section" style={{ backgroundColor: "transparent", borderTop: "1px solid var(--g2a-border)" }}>
            <div className="g2a-container">
              <div style={{ maxWidth: 920, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                  <h2 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>
                    {t("contact.calendlyTitle")}
                  </h2>
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.95rem", maxWidth: 560, margin: "0 auto" }}>
                    {t("contact.calendlyDesc")}
                  </p>
                </div>
                <CalendlyEmbed height={680} />
              </div>
            </div>
          </section>
        )}

        {/* WeChat section – emphasised for ZH, still visible for HU/EN */}
        <section className="g2a-section" style={{ backgroundColor: "transparent", borderTop: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3rem",
              alignItems: "center",
              maxWidth: 960,
              margin: "0 auto",
            }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "0.35rem 0.75rem", borderRadius: 999,
                  background: "rgba(7,193,96,0.12)", border: "1px solid rgba(7,193,96,0.35)",
                  color: "#07C160", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem",
                  letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem",
                }}>
                  <QrCode size={13} /> WeChat · 微信
                </div>
                <h2 style={{
                  fontFamily: "Geist, sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--g2a-text-primary)",
                  margin: "0 0 0.75rem",
                  letterSpacing: "-0.02em",
                }}>
                  {t("contact.wechatTitle")}
                </h2>
                <p style={{
                  fontFamily: "Geist, sans-serif",
                  color: "var(--g2a-text-secondary)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  margin: "0 0 1rem",
                }}>
                  {t("contact.wechatDesc")}
                </p>
                <div style={{
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.8rem",
                  color: "var(--g2a-text-muted)",
                  letterSpacing: "0.05em",
                }}>
                  {t("contact.wechatScan")} ↓
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "1.25rem",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                }}>
                  <img
                    src="/wechat-qr.png"
                    alt="WeChat QR – Attila Gyorfi 龙志健"
                    style={{ display: "block", width: 220, height: 220, objectFit: "contain" }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      const fb = target.nextElementSibling as HTMLElement | null;
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                  <div style={{
                    display: "none",
                    width: 220, height: 220,
                    background: "#f3f4f6",
                    color: "#6b7280",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.72rem",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "1rem",
                    borderRadius: 8,
                    lineHeight: 1.5,
                  }}>
                    QR kép nincs feltöltve.<br />
                    Mentsd ide:<br />
                    <code style={{ fontSize: "0.65rem" }}>client/public/<br />wechat-qr.png</code>
                  </div>
                  <div style={{
                    marginTop: "0.5rem",
                    textAlign: "center",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.72rem",
                    color: "#888",
                  }}>
                    Attila Gyorfi 龙志健
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
