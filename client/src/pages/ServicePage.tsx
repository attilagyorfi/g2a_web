import { Link, useParams } from "wouter";
import { ArrowRight, ArrowLeft, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized } from "@/../../shared/i18n";
import ServiceHeroDemo, { hasServiceHeroDemo } from "@/components/service-demos/ServiceHeroDemo";
import { SkeletonHeroPage } from "@/components/Skeleton";

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { t, lang } = useLanguage();
  const { data: service, isLoading } = trpc.content.serviceBySlug.useQuery({ slug });
  const { data: services } = trpc.content.services.useQuery();
  const submitMutation = trpc.contact.submit.useMutation();

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync({ ...form, serviceInterest: service?.title });
      toast.success(t("contact.messageSentToast"));
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <SkeletonHeroPage />
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ color: "var(--g2a-text-primary)" }}>{t("service.notFound")}</h1>
          <Link href="/szolgaltatasok" className="g2a-btn-primary">{t("service.backToServices")}</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Localized fields (fall back to HU when EN/ZH missing)
  const title = pickLocalized(service, "title", lang);
  const shortDesc = pickLocalized(service, "shortDescription", lang);
  const heroTitle = pickLocalized(service, "heroTitle", lang) || title;
  const heroSubtitle = pickLocalized(service, "heroSubtitle", lang);
  const content = pickLocalized(service, "content", lang);
  const metaTitle = pickLocalized(service, "metaTitle", lang);
  const metaDesc = pickLocalized(service, "metaDescription", lang);

  const formSubtitle = t("service.formSubtitle").replace("{title}", title);

  return (
    <>
      <SeoHead
        title={metaTitle || `${title} – G2A Marketing Pécs`}
        description={metaDesc || shortDesc}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          position: "relative",
          padding: "5rem 0",
          background: "radial-gradient(ellipse at 70% 30%, var(--g2a-hero-tint) 0%, transparent 55%), var(--g2a-bg)",
          overflow: "hidden",
        }}>
          {service.heroImage && (
            <>
              <img src={service.heroImage} alt={service.heroImageAlt || title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
              {/* Image readability overlay — only rendered when an image is
                  present. The base color follows the theme so the overlay
                  stays in character (dark-veil in dark mode, light-veil in
                  light mode) while keeping the text legible either way. */}
              <div className="g2a-hero-image-veil" style={{ position: "absolute", inset: 0 }} />
            </>
          )}
          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: hasServiceHeroDemo(slug) ? "1.1fr 1fr" : "1fr",
              gap: "3rem",
              alignItems: "center",
            }} className="g2a-service-hero-grid">
              <div>
                <Link href="/szolgaltatasok" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-text-accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-secondary)")}>
                  <ArrowLeft size={14} /> {t("service.backToServices")}
                </Link>
                <div className="g2a-section-label">{t("service.labelPrefix")} {service.number}</div>
                <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
                    {heroSubtitle}
                  </p>
                )}
              </div>
              {hasServiceHeroDemo(slug) && (
                <div className="g2a-service-hero-demo">
                  <ServiceHeroDemo slug={slug} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content + Form */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem", alignItems: "start" }}>
              {/* Content */}
              <div>
                {content ? (
                  <div className="g2a-prose" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <p style={{ color: "#888" }}>{t("service.contentComingSoon")}</p>
                )}
              </div>

              {/* Contact Form */}
              <div style={{ position: "sticky", top: "120px" }}>
                <div className="g2a-card">
                  <h3 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    {t("service.formTitle")}
                  </h3>
                  <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    {formSubtitle}
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="g2a-label">{t("common.name")} *</label>
                      <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="g2a-input" placeholder={t("service.fullNamePlaceholder")} />
                    </div>
                    <div>
                      <label className="g2a-label">{t("common.email")} *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="g2a-input" placeholder="email@pelda.hu" />
                    </div>
                    <div>
                      <label className="g2a-label">{t("common.phone")}</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="g2a-input" placeholder="+36 30 123 4567" />
                    </div>
                    <div>
                      <label className="g2a-label">{t("common.message")} *</label>
                      <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required className="g2a-input" placeholder={t("service.messagePlaceholder")} rows={4} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={submitting} style={{ justifyContent: "center" }}>
                      {submitting ? t("common.loading") : t("contact.send")}
                    </button>
                  </form>
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#888", fontSize: "0.8125rem", textDecoration: "none" }}>
                      <Phone size={13} style={{ color: "var(--g2a-brand-teal)" }} /> +36301902575
                    </a>
                    <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#888", fontSize: "0.8125rem", textDecoration: "none" }}>
                      <Mail size={13} style={{ color: "var(--g2a-brand-teal)" }} /> info@g2amarketing.hu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Services */}
        <section className="g2a-section-sm" style={{ backgroundColor: "var(--g2a-bg-3)" }}>
          <div className="g2a-container">
            <h3 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              {t("service.otherServices")}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {(services || []).filter(s => s.slug !== slug).map(s => (
                <Link key={s.id} href={`/szolgaltatasok/${s.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)", borderRadius: "6px", padding: "0.625rem 1rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,184,166,0.4)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#b0b0b0"; }}>
                  {pickLocalized(s, "title", lang)} <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
