import { useState } from "react";
import { Phone, Mail, Clock, MapPin, Send, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/kapcsolat" });
  const submitMutation = trpc.contact.submit.useMutation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMutation.mutateAsync(form);
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success(lang === "en" ? "Message sent! We'll contact you soon." : "Üzenetét megkaptuk! Hamarosan felvesszük Önnel a kapcsolatot.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("common.error");
      toast.error(msg);
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

  const contactItems = [
    { icon: <Phone size={20} />, label: lang === "en" ? "Phone" : "Telefon", value: "+36 30 190 2575", href: "tel:+36301902575" },
    { icon: <Mail size={20} />, label: "Email", value: "info@g2amarketing.hu", href: "mailto:info@g2amarketing.hu" },
    { icon: <Clock size={20} />, label: lang === "en" ? "Working Hours" : "Nyitvatartás", value: lang === "en" ? "Mon–Fri: 08:00–17:00" : "Hétfő–Péntek: 08:00–17:00", href: null },
    { icon: <MapPin size={20} />, label: lang === "en" ? "Location" : "Helyszín", value: "Pécs, Magyarország", href: null },
  ];

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || (lang === "en" ? "Contact – G2A Marketing" : "Kapcsolat – G2A Marketing Pécs")}
        description={pageSeo?.metaDescription || (lang === "en"
          ? "Contact G2A Marketing. Phone: +36301902575, Email: info@g2amarketing.hu. Working hours: Mon–Fri 08:00–17:00."
          : "Vegye fel velünk a kapcsolatot! Telefon: +36301902575, Email: info@g2amarketing.hu")}
        schemaJson={schemaJson}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{lang === "en" ? "Contact" : "Kapcsolat"}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1.25rem" }}>
              {t("contact.title")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("contact.subtitle")}
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
              {/* Contact Info */}
              <div>
                <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "2rem" }}>
                  {lang === "en" ? "Contact Information" : "Elérhetőségeink"}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {contactItems.map(item => (
                    <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(233,17,48,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--g2a-amber)", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ color: "var(--g2a-text-primary)", fontSize: "0.9375rem", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#ffffff")}>
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
                <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  {t("contact.formTitle")}
                </h2>
                <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
                  {lang === "en" ? "Fill out the form and we'll get back to you within 24 hours." : "Töltse ki az alábbi űrlapot és 24 órán belül visszajelzünk."}
                </p>

                {success ? (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <CheckCircle size={48} style={{ color: "#10b981", margin: "0 auto 1.5rem", display: "block" }} />
                    <h3 style={{ color: "#4ade80", fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.5rem" }}>
                      {lang === "en" ? "Message sent!" : "Üzenet elküldve!"}
                    </h3>
                    <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                      {lang === "en" ? "We'll contact you soon." : "Hamarosan felvesszük Önnel a kapcsolatot."}
                    </p>
                    <button onClick={() => setSuccess(false)} className="g2a-btn-primary">
                      {lang === "en" ? "Send another message" : "Új üzenet küldése"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                        <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="g2a-input" placeholder={lang === "en" ? "Subject" : "Miben segíthetünk?"} />
                      </div>
                    </div>
                    <div>
                      <label className="g2a-label">{t("common.message")} *</label>
                      <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required className="g2a-input" placeholder={lang === "en" ? "Describe how we can help..." : "Írja le részletesen, miben segíthetünk..."} rows={6} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                      <Send size={16} />
                      {submitting ? t("common.loading") : t("contact.send")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
