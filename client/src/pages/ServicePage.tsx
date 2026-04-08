import { Link, useParams } from "wouter";
import { ArrowRight, ArrowLeft, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { toast } from "sonner";

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
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
      toast.success("Üzenetét megkaptuk! Hamarosan felvesszük Önnel a kapcsolatot.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Hiba történt. Kérjük próbálja újra.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#888" }}>Betöltés...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ color: "#ffffff" }}>Szolgáltatás nem található</h1>
          <Link href="/szolgaltatasok" className="g2a-btn-primary">Vissza a szolgáltatásokhoz</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={service.metaTitle || `${service.title} – G2A Marketing Pécs`}
        description={service.metaDescription || service.shortDescription || ""}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{ position: "relative", padding: "5rem 0", backgroundColor: "#111", overflow: "hidden" }}>
          {service.heroImage && (
            <img src={service.heroImage} alt={service.heroImageAlt || service.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.6))" }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            <Link href="/szolgaltatasok" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#888", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              <ArrowLeft size={14} /> Vissza a szolgáltatásokhoz
            </Link>
            <div className="g2a-section-label">Szolgáltatás {service.number}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
              {service.heroTitle || service.title}
            </h1>
            {service.heroSubtitle && (
              <p style={{ color: "#b0b0b0", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
                {service.heroSubtitle}
              </p>
            )}
          </div>
        </section>

        {/* Content + Form */}
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem", alignItems: "start" }}>
              {/* Content */}
              <div>
                {service.content ? (
                  <div className="g2a-prose" dangerouslySetInnerHTML={{ __html: service.content }} />
                ) : (
                  <p style={{ color: "#888" }}>Tartalom hamarosan elérhető.</p>
                )}
              </div>

              {/* Contact Form */}
              <div style={{ position: "sticky", top: "120px" }}>
                <div className="g2a-card">
                  <h3 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Érdeklődjön most!
                  </h3>
                  <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    Ingyenes konzultáció a {service.title} szolgáltatásról.
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                      <label className="g2a-label">Üzenet *</label>
                      <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required className="g2a-input" placeholder="Írja le kérdését..." rows={4} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={submitting} style={{ justifyContent: "center" }}>
                      {submitting ? "Küldés..." : "Üzenet küldése"}
                    </button>
                  </form>
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#888", fontSize: "0.8125rem", textDecoration: "none" }}>
                      <Phone size={13} style={{ color: "#e91130" }} /> +36301902575
                    </a>
                    <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#888", fontSize: "0.8125rem", textDecoration: "none" }}>
                      <Mail size={13} style={{ color: "#e91130" }} /> info@g2amarketing.hu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Services */}
        <section className="g2a-section-sm" style={{ backgroundColor: "#161616" }}>
          <div className="g2a-container">
            <h3 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Egyéb szolgáltatásaink
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {(services || []).filter(s => s.slug !== slug).map(s => (
                <Link key={s.id} href={`/szolgaltatasok/${s.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.625rem 1rem", color: "#b0b0b0", fontSize: "0.875rem", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(233,17,48,0.4)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#b0b0b0"; }}>
                  {s.title} <ArrowRight size={12} />
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
