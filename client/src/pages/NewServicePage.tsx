import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { serviceSchema, faqPageSchema, breadcrumbSchema } from "@/lib/jsonLd";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ServiceHeroDemo, { hasServiceHeroDemo } from "@/components/service-demos/ServiceHeroDemo";
import { getServiceConfig } from "@/data/serviceConfigs";
import RelatedServices from "@/components/RelatedServices";


type Props = {
  params: { slug: string };
};

export default function NewServicePage({ params }: Props) {
  const { t, lang } = useLanguage();
  const config = getServiceConfig(params.slug, lang);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // `website` is a honeypot — invisible field that must stay empty
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => { setStatus("success"); toast.success(t("contact.messageSentToast")); },
    onError: (e) => { setStatus("error"); toast.error(parseFormError(e, t("common.error"))); },
  });

  if (!config) {
    return (
      <>
        <Navigation />
        <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <h1 style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>
              {t("iparagi.notFound")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {lang === "en" ? "This service doesn't exist or was moved." : lang === "zh" ? "此服务不存在或已移动。" : "Ez a szolgáltatás nem létezik vagy átköltözött."}
            </p>
            <Link href="/szolgaltatasok" className="g2a-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
              {t("service.backToServices")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error(t("contact.errorMessageMin"));
      return;
    }
    setStatus("loading");
    contactMutation.mutate({ ...form, subject: `${t("nav.services")}: ${config.title}` });
  };

  return (
    <>
      <SeoHead
        title={config.metaTitle}
        description={config.metaDesc}
        pageSchemas={[
          breadcrumbSchema([
            { name: "G2A Marketing", url: "https://g2amarketing.hu" },
            { name: t("nav.services"), url: "https://g2amarketing.hu/szolgaltatasok" },
            {
              name: config.title,
              url: `https://g2amarketing.hu/szolgaltatasok/${config.slug}`,
            },
          ]),
          serviceSchema({
            name: config.title,
            description: config.heroDesc,
            url: `https://g2amarketing.hu/szolgaltatasok/${config.slug}`,
            serviceType: config.title,
          }),
          faqPageSchema(config.faq),
        ]}
      />
      <div style={{ minHeight: "100vh", background: "var(--g2a-bg)" }}>
        <Navigation />

        {/* Hero */}
        <section style={{ padding: "8rem 0 5rem", background: "radial-gradient(ellipse at 70% 30%, var(--g2a-hero-tint), transparent 55%), var(--g2a-bg)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${config.color}15 0%, transparent 60%)` }} />
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", position: "relative" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: hasServiceHeroDemo(params.slug) ? "1.1fr 1fr" : "1fr",
              gap: "3rem",
              alignItems: "center",
            }} className="g2a-service-hero-grid">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <Link href="/szolgaltatasok" style={{ color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.875rem", fontFamily: "Geist Mono, monospace" }}>
                    {t("nav.services")}
                  </Link>
                  <span style={{ color: "var(--g2a-text-muted)" }}>/</span>
                  <span style={{ color: config.color, fontSize: "0.875rem", fontFamily: "Geist Mono, monospace" }}>{config.title}</span>
                </div>
                <div style={{ width: "64px", height: "64px", borderRadius: "12px", background: `${config.color}18`, border: `1px solid ${config.color}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: config.color }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{config.icon.slice(0, 3).toUpperCase()}</span>
                </div>
                <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", marginBottom: "1rem", lineHeight: 1.1 }}>
                  {config.title}
                </h1>
                <p style={{ fontSize: "1.25rem", color: config.color, fontFamily: "Geist Mono, monospace", marginBottom: "1.5rem" }}>
                  {config.subtitle}
                </p>
                <p style={{ fontSize: "1.125rem", color: "var(--g2a-text-muted)", maxWidth: "600px", lineHeight: 1.7, marginBottom: "2.5rem" }}>
                  {config.heroDesc}
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/ingyenes-audit" className="g2a-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    {config.cta} <ArrowRight size={16} />
                  </Link>
                  <a href="tel:+36301902575" className="g2a-btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    <Phone size={16} /> {t("newservice.callUs")}
                  </a>
                </div>
              </div>
              {hasServiceHeroDemo(params.slug) && (
                <div className="g2a-service-hero-demo">
                  <ServiceHeroDemo slug={params.slug} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Intro */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <p style={{ fontSize: "1.2rem", color: "var(--g2a-text)", lineHeight: 1.8, maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              {config.intro}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", textAlign: "center", marginBottom: "3rem" }}>
              {t("newservice.benefitsTitle")}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {config.benefits.map((b, i) => (
                <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "1.75rem", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = config.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--g2a-border)")}>
                  <CheckCircle size={20} style={{ color: config.color, marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", marginBottom: "0.5rem", fontFamily: "Geist Mono, monospace" }}>{b.title}</h3>
                  <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", textAlign: "center", marginBottom: "3rem" }}>
              {t("newservice.processTitle")}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2rem" }}>
              {config.process.map((p, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `${config.color}20`, border: `2px solid ${config.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontFamily: "Geist Mono, monospace", fontWeight: 700, color: config.color, fontSize: "1.1rem" }}>
                    {p.step}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", marginBottom: "0.75rem", fontFamily: "Geist Mono, monospace" }}>{p.title}</h3>
                  <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", textAlign: "center", marginBottom: "3rem" }}>
              {t("home.faq.title")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {config.faq.map((f, i) => (
                <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.75rem", overflow: "hidden" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", fontWeight: 600, textAlign: "left", fontSize: "0.95rem" }}>
                    {f.q}
                    {openFaq === i ? <ChevronUp size={18} style={{ color: config.color, flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "var(--g2a-text-muted)", flexShrink: 0 }} />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 1.5rem 1.25rem", color: "var(--g2a-text-muted)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "clamp(1fr, 50%, 1fr) 1fr", gap: "4rem", alignItems: "start" }} className="g2a-layout-sidebar">
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", marginBottom: "1.5rem" }}>
                  {t("newservice.contactTitle")}
                </h2>
                <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                  {t("newservice.contactHint24h")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--g2a-text-muted)" }}>
                    <Phone size={16} style={{ color: "var(--g2a-brand-teal)" }} />
                    <a href="tel:+36301902575" style={{ color: "var(--g2a-text)", textDecoration: "none" }}>+36 30 190 2575</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--g2a-text-muted)" }}>
                    <Mail size={16} style={{ color: "var(--g2a-brand-teal)" }} />
                    <a href="mailto:info@g2amarketing.hu" style={{ color: "var(--g2a-text)", textDecoration: "none" }}>info@g2amarketing.hu</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--g2a-text-muted)" }}>
                    <Clock size={16} style={{ color: "var(--g2a-brand-teal)" }} />
                    <span style={{ color: "var(--g2a-text)" }}>{t("footer.workingHoursValue")}</span>
                  </div>
                </div>
              </div>
              <div style={{ background: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "2rem" }}>
                {status === "success" ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 1rem", display: "block" }} />
                    <h3 style={{ color: "var(--g2a-text)", fontFamily: "Geist Mono, monospace", marginBottom: "0.5rem" }}>{t("newservice.thankYou")}</h3>
                    <p style={{ color: "var(--g2a-text-muted)" }}>{t("newservice.willContact")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Honeypot — hidden from users, traps bots */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                      aria-hidden="true"
                      style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                    />
                    <div>
                      <label className="g2a-label">{t("common.name")} *</label>
                      <input className="g2a-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder={t("newservice.nameExample")} />
                    </div>
                    <div>
                      <label className="g2a-label">{t("common.email")} *</label>
                      <input className="g2a-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder={t("newservice.emailExample")} />
                    </div>
                    <div>
                      <label className="g2a-label">{t("common.phone")}</label>
                      <input className="g2a-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30 123 4567" />
                    </div>
                    <div>
                      <label className="g2a-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                        <span>{t("common.message")}</span>
                        <span aria-live="polite" style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "0.7rem",
                          color: form.message.trim().length > 0 && form.message.trim().length < 10
                            ? "#ef4444"
                            : form.message.trim().length >= 10
                            ? "var(--g2a-text-secondary)"
                            : "var(--g2a-text-muted)",
                        }}>
                          {form.message.trim().length} / 10
                        </span>
                      </label>
                      <textarea
                        className="g2a-input"
                        rows={4}
                        minLength={10}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t("newservice.messagePlaceholder").replace("{title}", config.title)}
                        style={{
                          resize: "vertical",
                          borderColor: form.message.trim().length > 0 && form.message.trim().length < 10 ? "rgba(239,68,68,0.55)" : undefined,
                        }}
                      />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ justifyContent: "center" }}>
                      {status === "loading" ? t("common.loading") : t("contact.send")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pillar/sibling cross-links — audit §3.6 hierarchy signal.
            Renders only for slugs in the RELATED_MAP (PPC/Meta cluster,
            i18n cluster). All other service pages skip it cleanly. */}
        <RelatedServices slug={params.slug} />

        <Footer />
      </div>
    </>
  );
}
