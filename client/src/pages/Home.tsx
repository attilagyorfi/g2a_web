import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft, ArrowRight, Plus, Minus, Quote, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import SeoHead from "@/components/SeoHead";

const HERO_BG = "https://g2amarketing.hu/wp-content/uploads/2024/08/Away.webp";
const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

const serviceIcons: Record<string, string> = {
  lokalizacio: "🌐",
  arculattervezes: "🎨",
  hirdeteskezeles: "📈",
  "kozossegi-media": "📱",
  "strategiai-marketing": "🎯",
  "keresőoptimalizalas": "🔍",
  webfejlesztes: "💻",
};

export default function Home() {
  const { data: slides } = trpc.content.heroSlides.useQuery();
  const { data: services } = trpc.content.services.useQuery();
  const { data: testimonials } = trpc.content.testimonials.useQuery();
  const { data: partners } = trpc.content.partners.useQuery();
  const { data: industries } = trpc.content.industries.useQuery();
  const { data: values } = trpc.content.values.useQuery();
  const { data: settings } = trpc.content.siteSettings.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/" });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openValue, setOpenValue] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const settingsMap = Object.fromEntries((settings || []).map(s => [s.key, s.value]));
  const heroSlides = slides && slides.length > 0 ? slides : [{
    id: 0, title: "G2A MARKETING ÜGYNÖKSÉG", subtitle: "Kreatív online marketing ügynökség",
    backgroundImage: HERO_BG, backgroundImageAlt: "G2A Marketing háttér",
    ctaPrimaryText: "Ingyenes Marketing Felmérés", ctaPrimaryUrl: "/kapcsolat",
    ctaSecondaryText: "Brosúra", ctaSecondaryUrl: "#",
    sortOrder: 0, isActive: true, createdAt: new Date(),
  }];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterStatus("loading");
    try {
      await subscribeMutation.mutateAsync({ email });
      setNewsletterStatus("success");
      setEmail("");
    } catch {
      setNewsletterStatus("error");
    }
  };

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MarketingAgency",
    "name": "G2A Marketing",
    "url": "https://g2amarketing.hu",
    "logo": LOGO_URL,
    "telephone": "+36301902575",
    "email": "info@g2amarketing.hu",
    "address": { "@type": "PostalAddress", "addressLocality": "Pécs", "addressCountry": "HU" },
    "openingHours": "Mo-Fr 08:00-17:00",
    "description": "Adatvezérelt, kreatív online marketing ügynökség Pécsről.",
    "sameAs": ["https://facebook.com/g2amarketing", "https://linkedin.com/company/g2amarketing"],
  });

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || "G2A Marketing Pécs – Adatvezérelt Online Marketing Ügynökség"}
        description={pageSeo?.metaDescription || "A G2A Marketing adatvezérelt, kreatív online marketing ügynökség Pécsről."}
        ogTitle={pageSeo?.ogTitle || undefined}
        ogDescription={pageSeo?.ogDescription || undefined}
        ogImage={pageSeo?.ogImage || undefined}
        schemaJson={schemaJson}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* ─── Hero Slider ─────────────────────────────────────────────────── */}
        <section style={{ position: "relative", height: "calc(100vh - 100px)", minHeight: "500px", overflow: "hidden", backgroundColor: "#111" }}>
          {heroSlides.map((slide, i) => (
            <div key={slide.id} style={{
              position: "absolute", inset: 0,
              opacity: i === currentSlide ? 1 : 0,
              transition: "opacity 0.8s ease",
              zIndex: i === currentSlide ? 1 : 0,
            }}>
              {slide.backgroundImage && (
                <img src={slide.backgroundImage} alt={slide.backgroundImageAlt || slide.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)" }} />
              <div className="g2a-container" style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center" }}>
                <div style={{ maxWidth: "640px" }}>
                  {slide.subtitle && (
                    <div className="g2a-section-label" style={{ marginBottom: "1rem" }}>{slide.subtitle}</div>
                  )}
                  <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "2rem", fontFamily: "Roboto Mono, monospace" }}>
                    {slide.title}
                  </h1>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {slide.ctaPrimaryText && (
                      <Link href={slide.ctaPrimaryUrl || "/kapcsolat"} className="g2a-btn-primary">
                        {slide.ctaPrimaryText}
                        <ArrowRight size={16} />
                      </Link>
                    )}
                    {slide.ctaSecondaryText && (
                      <a href={slide.ctaSecondaryUrl || "#"} className="g2a-btn-secondary">
                        {slide.ctaSecondaryText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Slider Controls */}
          {heroSlides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}
                style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 3, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                aria-label="Előző dia">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}
                style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", zIndex: 3, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                aria-label="Következő dia">
                <ChevronRight size={20} />
              </button>
              <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", gap: "0.5rem" }}>
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)}
                    style={{ width: i === currentSlide ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === currentSlide ? "#e91130" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s" }}
                    aria-label={`${i + 1}. dia`} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ─── Quote Section ────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "#e91130", padding: "3rem 0" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <Quote size={32} style={{ color: "rgba(255,255,255,0.4)", margin: "0 auto 1rem" }} />
            <blockquote style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)", fontWeight: 500, color: "#ffffff", fontStyle: "italic", fontFamily: "Roboto, sans-serif", maxWidth: "800px", margin: "0 auto", lineHeight: 1.6 }}>
              {settingsMap.homepage_quote || '"A marketing az, amikor a józan paraszti gondolkodást egy csipetnyi kreativitással fűszerezed."'}
            </blockquote>
          </div>
        </section>

        {/* ─── About Section ────────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label">Rólunk</div>
                <h2 className="g2a-section-title" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
                  {settingsMap.homepage_about_title || "Adatvezérelt marketing, amivel a márkád nem csak látható, hanem kiemelkedő lesz."}
                </h2>
                <p style={{ color: "#b0b0b0", lineHeight: 1.8, marginBottom: "2rem" }}>
                  {settingsMap.homepage_about_text || "A G2A Marketing egy adatvezérelt, kreatív online marketing ügynökség, akik segítik a márkák fejlődését."}
                </p>
                <Link href="/kapcsolat" className="g2a-btn-primary">
                  Ingyenes Marketing Felmérés
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { num: "150+", label: "Elégedett ügyfél" },
                  { num: "8+", label: "Év tapasztalat" },
                  { num: "500+", label: "Sikeres kampány" },
                  { num: "23+", label: "Aktív partner" },
                ].map(stat => (
                  <div key={stat.label} style={{ backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e91130", fontFamily: "Roboto Mono, monospace", marginBottom: "0.25rem" }}>{stat.num}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Services Section ─────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "#161616" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label">Amit kínálunk</div>
              <h2 className="g2a-section-title">Szolgáltatásaink</h2>
              <p style={{ color: "#888", maxWidth: "560px", margin: "0 auto" }}>
                Teljes körű digitális marketing megoldások, amelyek valódi eredményeket hoznak vállalkozásodnak.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {(services || []).map(service => (
                <Link key={service.id} href={`/szolgaltatasok/${service.slug}`} style={{ textDecoration: "none" }}>
                  <div className="g2a-card" style={{ height: "100%", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "2rem" }}>{serviceIcons[service.slug] || "⚡"}</span>
                      <span style={{ fontFamily: "Roboto Mono, monospace", fontSize: "2.5rem", fontWeight: 700, color: "rgba(233,17,48,0.12)", lineHeight: 1 }}>
                        {service.number || "01"}
                      </span>
                    </div>
                    <h3 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                      {service.title}
                    </h3>
                    <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                      {service.shortDescription}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#e91130", fontSize: "0.8125rem", fontWeight: 500 }}>
                      Részletek <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Industries Section ───────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div className="g2a-section-label">Szakterületek</div>
                <h2 className="g2a-section-title">Iparágak, ahol otthon vagyunk</h2>
                <p style={{ color: "#888", lineHeight: 1.8, marginBottom: "2rem" }}>
                  Tapasztalatunk számos iparágra kiterjed, így pontosan értjük az adott piac kihívásait.
                </p>
                <Link href="/szakertelem" className="g2a-btn-primary">
                  Szakértelmeink <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                {(industries || []).map(ind => (
                  <div key={ind.id} style={{ backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(233,17,48,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#e91130", flexShrink: 0 }} />
                    <span style={{ color: "#d0d0d0", fontSize: "0.875rem", fontWeight: 500 }}>{ind.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Values Accordion ─────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "#161616" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div className="g2a-section-label">Értékeink</div>
                <h2 className="g2a-section-title">Amiben hiszünk és ahogy dolgozunk</h2>
                <p style={{ color: "#888", lineHeight: 1.8 }}>
                  Minden projektünkben ezek az alapelvek vezérelnek minket. Nem csak szavak – ezek a mindennapi munkánk alapjai.
                </p>
              </div>
              <div>
                {(values || []).map((val, i) => (
                  <div key={val.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <button
                      onClick={() => setOpenValue(openValue === i ? null : i)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 0", cursor: "pointer", background: "none", border: "none", color: openValue === i ? "#e91130" : "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1rem", fontWeight: 500, transition: "color 0.2s", textAlign: "left" }}>
                      {val.title}
                      {openValue === i ? <Minus size={16} style={{ flexShrink: 0 }} /> : <Plus size={16} style={{ flexShrink: 0 }} />}
                    </button>
                    {openValue === i && (
                      <div style={{ paddingBottom: "1.25rem", color: "#888", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        {val.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─────────────────────────────────────────────────── */}
        {testimonials && testimonials.length > 0 && (
          <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="g2a-container">
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div className="g2a-section-label">Vélemények</div>
                <h2 className="g2a-section-title">Mit mondanak ügyfeleink</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {testimonials.map(t => (
                  <div key={t.id} className="g2a-card">
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: "#e91130", fill: "#e91130" }} />)}
                    </div>
                    <blockquote style={{ color: "#d0d0d0", fontSize: "0.9375rem", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1.5rem" }}>
                      "{t.quote}"
                    </blockquote>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e91130", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem", flexShrink: 0 }}>
                        {t.authorName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.9rem" }}>{t.authorName}</div>
                        <div style={{ color: "#888", fontSize: "0.8125rem" }}>{t.authorTitle}{t.authorCompany ? `, ${t.authorCompany}` : ""}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Partners Slider ──────────────────────────────────────────────── */}
        {partners && partners.length > 0 && (
          <section className="g2a-section-sm" style={{ backgroundColor: "#161616", overflow: "hidden" }}>
            <div className="g2a-container" style={{ marginBottom: "2rem", textAlign: "center" }}>
              <div className="g2a-section-label">Partnereink</div>
              <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>
                Akikkel együtt dolgozunk
              </h2>
            </div>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <div style={{ display: "flex", gap: "2rem", animation: "marquee 25s linear infinite", width: "max-content" }}>
                {[...partners, ...partners].map((p, i) => (
                  <div key={`${p.id}-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: "160px", height: "60px", backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0 1.5rem", flexShrink: 0 }}>
                    {p.logo ? (
                      <img src={p.logo} alt={p.logoAlt || `${p.name} logó`} style={{ maxHeight: "32px", maxWidth: "120px", objectFit: "contain", filter: "brightness(0.8) grayscale(0.3)" }} />
                    ) : (
                      <span style={{ color: "#666", fontSize: "0.875rem", fontWeight: 500, fontFamily: "Roboto Mono, monospace", whiteSpace: "nowrap" }}>{p.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Newsletter Section ───────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div style={{ backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "3rem", textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
              <div className="g2a-section-label">Hírlevél</div>
              <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
                Maradj naprakész
              </h2>
              <p style={{ color: "#888", marginBottom: "2rem", lineHeight: 1.7 }}>
                Iratkozz fel hírlevelünkre és elsőként értesülj a legfrissebb marketing trendekről és tippekről.
              </p>
              {newsletterStatus === "success" ? (
                <div style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "6px", padding: "1rem", color: "#4ade80" }}>
                  ✓ Sikeresen feliratkoztál! Köszönjük.
                </div>
              ) : (
                <form onSubmit={handleNewsletter} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email cím" required className="g2a-input"
                    style={{ flex: 1, minWidth: "200px" }} />
                  <button type="submit" className="g2a-btn-primary" disabled={newsletterStatus === "loading"}>
                    {newsletterStatus === "loading" ? "Feliratkozás..." : "Feliratkozom"}
                  </button>
                </form>
              )}
              {newsletterStatus === "error" && (
                <p style={{ color: "#e91130", fontSize: "0.875rem", marginTop: "0.75rem" }}>
                  Hiba történt. Kérjük próbáld újra.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ─── CTA Section ──────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "#e91130", padding: "4rem 0" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, marginBottom: "1rem" }}>
              Készen állsz a növekedésre?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.0625rem", marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
              Kérj ingyenes marketing felmérést és derítsd ki, hogyan segíthetünk vállalkozásodnak.
            </p>
            <Link href="/kapcsolat" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#ffffff", color: "#e91130", padding: "0.875rem 2rem", borderRadius: "5px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f5f5f5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff"; }}>
              Ingyenes Marketing Felmérés
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
