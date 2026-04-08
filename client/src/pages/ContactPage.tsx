import { useState } from "react";
import { Phone, Mail, Clock, MapPin, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { toast } from "sonner";

export default function ContactPage() {
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
      toast.success("Üzenetét megkaptuk! Hamarosan felvesszük Önnel a kapcsolatot.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hiba történt. Kérjük próbálja újra.";
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

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || "Kapcsolat – G2A Marketing Pécs"}
        description={pageSeo?.metaDescription || "Vegye fel velünk a kapcsolatot! Telefon: +36301902575, Email: info@g2amarketing.hu"}
        schemaJson={schemaJson}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">Kapcsolat</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", marginBottom: "1.25rem" }}>
              Lépjen velünk kapcsolatba
            </h1>
            <p style={{ color: "#b0b0b0", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              Kérjen ingyenes marketing felmérést vagy tegyen fel kérdést – csapatunk hamarosan válaszol.
            </p>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div className="g2a-layout-sidebar" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>
              {/* Contact Info */}
              <div>
                <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "2rem" }}>
                  Elérhetőségeink
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {[
                    { icon: <Phone size={20} />, label: "Telefon", value: "+36301902575", href: "tel:+36301902575" },
                    { icon: <Mail size={20} />, label: "Email", value: "info@g2amarketing.hu", href: "mailto:info@g2amarketing.hu" },
                    { icon: <Clock size={20} />, label: "Nyitvatartás", value: "Hétfő – Péntek: 08:00 – 17:00", href: null },
                    { icon: <MapPin size={20} />, label: "Helyszín", value: "Pécs, Magyarország", href: null },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: "44px", height: "44px", backgroundColor: "rgba(233,17,48,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#e91130", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem", fontFamily: "Roboto Mono, monospace" }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ color: "#ffffff", fontSize: "0.9375rem", textDecoration: "none", transition: "color 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#ffffff")}>
                            {item.value}
                          </a>
                        ) : (
                          <span style={{ color: "#ffffff", fontSize: "0.9375rem" }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="g2a-card">
                <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Üzenet küldése
                </h2>
                <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "2rem" }}>
                  Töltse ki az alábbi űrlapot és 24 órán belül visszajelzünk.
                </p>

                {success ? (
                  <div style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "2rem", textAlign: "center" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#4ade80", fontSize: "1.5rem", fontWeight: 700 }}>OK</div>
                    <h3 style={{ color: "#4ade80", fontFamily: "Roboto Mono, monospace", marginBottom: "0.5rem" }}>Üzenet elküldve!</h3>
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>Hamarosan felvesszük Önnel a kapcsolatot.</p>
                    <button onClick={() => setSuccess(false)} className="g2a-btn-primary" style={{ marginTop: "1.5rem" }}>
                      Új üzenet küldése
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="g2a-label">Neve *</label>
                      <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="g2a-input" placeholder="Teljes neve" />
                    </div>
                    <div>
                      <label className="g2a-label">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="g2a-input" placeholder="email@pelda.hu" />
                    </div>
                    <div>
                      <label className="g2a-label">Telefon</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="g2a-input" placeholder="+36 30 123 4567" />
                    </div>
                    <div>
                      <label className="g2a-label">Tárgy</label>
                      <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="g2a-input" placeholder="Miben segíthetünk?" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label className="g2a-label">Üzenet *</label>
                      <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required className="g2a-input" placeholder="Írja le részletesen, miben segíthetünk..." rows={6} style={{ resize: "vertical" }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <button type="submit" className="g2a-btn-primary" disabled={submitting} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Send size={16} />
                        {submitting ? "Küldés folyamatban..." : "Üzenet küldése"}
                      </button>
                    </div>
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
