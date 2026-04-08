import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Sun, Moon, Phone, Mail, Clock, ArrowRight, Facebook, Youtube, Linkedin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

const services = [
  { title: "Lokalizáció", slug: "lokalizacio", desc: "Többnyelvű marketing" },
  { title: "Arculattervezés", slug: "arculattervezes", desc: "Brand identitás" },
  { title: "Hirdetéskezelés", slug: "hirdeteskezeles", desc: "PPC & Meta Ads" },
  { title: "Közösségi Média", slug: "kozossegi-media", desc: "Social media menedzsment" },
  { title: "Stratégiai Marketing", slug: "strategiai-marketing", desc: "Teljes marketing stratégia" },
  { title: "Keresőoptimalizálás", slug: "seo", desc: "SEO & tartalommarketing" },
  { title: "Webfejlesztés", slug: "webfejlesztes", desc: "Modern weboldalak" },
  { title: "AI Marketing", slug: "ai-marketing", desc: "AI-alapú megoldások" },
  { title: "Marketing Automatizáció", slug: "marketing-automatizacio", desc: "Workflow automatizálás" },
  { title: "ESG Kommunikáció", slug: "esg-kommunikacio", desc: "Fenntarthatósági marketing" },
  { title: "Employer Branding", slug: "employer-branding", desc: "Munkáltatói márkaépítés" },
  { title: "Nemzetközi Marketing", slug: "nemzetkozi-marketing", desc: "Globális jelenlét" },
];

const industries = [
  { label: "Egészségügy", slug: "marketing-egeszsegugyi-cegeknek" },
  { label: "Szépségipar", slug: "marketing-szepsegipari-cegeknek" },
  { label: "Mérnöki irodák", slug: "marketing-mernoki-irodaknak" },
  { label: "Autóipar", slug: "marketing-autoipari-cegeknek" },
  { label: "Ügyvédi irodák", slug: "marketing-ugyvedii-irodaknak" },
  { label: "Technológia", slug: "marketing-technologiai-cegeknek" },
  { label: "Önkormányzat", slug: "marketing-onkormanyzati-projekteknek" },
  { label: "B2B cégek", slug: "marketing-b2b-cegeknek" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme, switchable } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const servicesRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const isLight = theme === "light";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setIndustriesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (industriesRef.current && !industriesRef.current.contains(e.target as Node)) setIndustriesOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navBg = scrolled
    ? isLight ? "rgba(255,255,255,0.96)" : "rgba(10,10,10,0.96)"
    : isLight ? "#f8f8f8" : "#0f0f0f";

  const dropdownBg = isLight ? "#ffffff" : "#141414";
  const dropdownBorder = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";

  return (
    <>
      {/* Top bar */}
      <div style={{
        backgroundColor: isLight ? "#f0f0f0" : "#080808",
        borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
        padding: "0.4rem 0",
      }}>
        <div className="g2a-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
              <Phone size={11} /> +36 30 190 2575
            </a>
            <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
              <Mail size={11} /> info@g2amarketing.hu
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-text-muted)", fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}>
              <Clock size={11} /> 08:00 – 17:00
            </span>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {[
                { href: "https://facebook.com/g2amarketing", icon: <Facebook size={13} /> },
                { href: "https://youtube.com/g2amarketing", icon: <Youtube size={13} /> },
                { href: "https://linkedin.com/company/g2amarketing", icon: <Linkedin size={13} /> },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--g2a-text-muted)", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        backgroundColor: navBg,
        borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}>
        <div className="g2a-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={LOGO_URL} alt="G2A Marketing logó" style={{ height: "38px", width: "auto", filter: isLight ? "invert(1)" : "none" }} />
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.125rem" }} className="hidden md:flex">
            <NavLink href="/" label="Főoldal" current={location} isLight={isLight} />

            {/* Services mega dropdown */}
            <div ref={servicesRef} style={{ position: "relative" }}>
              <button onClick={() => { setServicesOpen(p => !p); setIndustriesOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.5rem 0.875rem", borderRadius: "6px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                  color: servicesOpen ? "#e91130" : "var(--g2a-text-secondary)",
                  background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                }}>
                Szolgáltatások
                <ChevronDown size={13} style={{ transform: servicesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {servicesOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-40%)",
                  width: "640px", backgroundColor: dropdownBg,
                  border: `1px solid ${dropdownBorder}`,
                  borderRadius: "14px", padding: "1.25rem",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25rem",
                  animation: "scaleIn 0.18s ease",
                }}>
                  {services.map(s => (
                    <Link key={s.slug} href={`/szolgaltatasok/${s.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "0.75rem", borderRadius: "8px", transition: "background-color 0.15s", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = isLight ? "#f5f5f5" : "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "var(--g2a-text-primary)", marginBottom: "0.2rem" }}>{s.title}</div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--g2a-text-muted)" }}>{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${dropdownBorder}`, marginTop: "0.5rem", paddingTop: "0.75rem" }}>
                    <Link href="/szolgaltatasok" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "#e91130", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 600 }}>
                      Összes szolgáltatás megtekintése <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Industries dropdown */}
            <div ref={industriesRef} style={{ position: "relative" }}>
              <button onClick={() => { setIndustriesOpen(p => !p); setServicesOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.5rem 0.875rem", borderRadius: "6px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                  color: industriesOpen ? "#e91130" : "var(--g2a-text-secondary)",
                  background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                }}>
                Iparágak
                <ChevronDown size={13} style={{ transform: industriesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {industriesOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                  width: "260px", backgroundColor: dropdownBg,
                  border: `1px solid ${dropdownBorder}`,
                  borderRadius: "12px", padding: "0.75rem",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
                  animation: "scaleIn 0.18s ease",
                }}>
                  {industries.map(ind => (
                    <Link key={ind.slug} href={`/iparagi/${ind.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        padding: "0.625rem 0.75rem", borderRadius: "6px",
                        fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                        color: "var(--g2a-text-secondary)", transition: "all 0.15s", cursor: "pointer",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = isLight ? "#f5f5f5" : "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e91130"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--g2a-text-secondary)"; }}>
                        {ind.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/rolunk" label={t("nav.about")} current={location} isLight={isLight} />
            <NavLink href="/hirek" label={t("nav.blog")} current={location} isLight={isLight} />
            <NavLink href="/kapcsolat" label={t("nav.contact")} current={location} isLight={isLight} />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {switchable && (
              <button onClick={toggleTheme}
                title={isLight ? "Sötét mód" : "Világos mód"}
                style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  backgroundColor: "var(--g2a-bg-card)", border: `1px solid var(--g2a-border)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--g2a-text-secondary)", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#e91130"; e.currentTarget.style.color = "#e91130"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--g2a-border)"; e.currentTarget.style.color = "var(--g2a-text-secondary)"; }}>
                {isLight ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            )}
            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === "hu" ? "en" : "hu")}
              title={lang === "hu" ? "Switch to English" : "Váltás magyarra"}
              style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.35rem 0.625rem", borderRadius: "6px",
                backgroundColor: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)",
                color: "var(--g2a-text-secondary)", cursor: "pointer", transition: "all 0.2s",
                fontFamily: "Roboto Mono, monospace", fontSize: "0.75rem", fontWeight: 600,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e91130"; e.currentTarget.style.color = "#e91130"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--g2a-border)"; e.currentTarget.style.color = "var(--g2a-text-secondary)"; }}
            >
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{lang === "hu" ? "🇬🇧" : "🇭🇺"}</span>
              {lang === "hu" ? "EN" : "HU"}
            </button>
            <Link href="/ingyenes-audit" style={{ textDecoration: "none" }} className="hidden md:inline-flex">
              <span className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem" }}>
                {t("nav.freeAudit")}
              </span>
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", color: "var(--g2a-text-primary)", cursor: "pointer", padding: "0.375rem", display: "flex" }}
              className="md:hidden" aria-label="Menü">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            backgroundColor: isLight ? "#ffffff" : "#0a0a0a",
            borderTop: `1px solid var(--g2a-border)`,
            padding: "1.25rem",
            maxHeight: "80vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
              <MobileNavLink href="/" label="Főoldal" isLight={isLight} />
              <button onClick={() => setMobileServicesOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.625rem 0.75rem", borderRadius: "8px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 500,
                  color: "var(--g2a-text-secondary)", background: "none", border: "none", cursor: "pointer",
                }}>
                Szolgáltatások
                <ChevronDown size={14} style={{ transform: mobileServicesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {mobileServicesOpen && (
                <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  {services.map(s => <MobileNavLink key={s.slug} href={`/szolgaltatasok/${s.slug}`} label={s.title} isLight={isLight} />)}
                </div>
              )}
              <div style={{ padding: "0.375rem 0.75rem", color: "var(--g2a-text-muted)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Roboto Mono, monospace", marginTop: "0.25rem" }}>Iparágak</div>
              <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                {industries.map(ind => <MobileNavLink key={ind.slug} href={`/iparagi/${ind.slug}`} label={ind.label} isLight={isLight} />)}
              </div>
              <div style={{ height: "1px", backgroundColor: "var(--g2a-border)", margin: "0.75rem 0" }} />
              <MobileNavLink href="/rolunk" label="Rólunk" isLight={isLight} />
              <MobileNavLink href="/hirek" label="Blog" isLight={isLight} />
              <MobileNavLink href="/kapcsolat" label="Kapcsolat" isLight={isLight} />
              <div style={{ marginTop: "1rem" }}>
                <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                  <span className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                    Ingyenes Marketing Audit
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function NavLink({ href, label, current, isLight }: { href: string; label: string; current: string; isLight: boolean }) {
  const isActive = current === href || (href !== "/" && current.startsWith(href));
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <span style={{
        display: "block", padding: "0.5rem 0.875rem", borderRadius: "6px",
        fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: isActive ? 600 : 500,
        color: isActive ? "#e91130" : "var(--g2a-text-secondary)",
        transition: "color 0.2s, background-color 0.2s",
        position: "relative",
      }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--g2a-text-primary)"; e.currentTarget.style.backgroundColor = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = isActive ? "#e91130" : "var(--g2a-text-secondary)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
        {label}
        {isActive && <span style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "18px", height: "2px", backgroundColor: "#e91130", borderRadius: "1px" }} />}
      </span>
    </Link>
  );
}

function MobileNavLink({ href, label, isLight }: { href: string; label: string; isLight: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "0.625rem 0.75rem", borderRadius: "8px",
        fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 500,
        color: "var(--g2a-text-secondary)", transition: "all 0.15s", cursor: "pointer",
      }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e91130"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--g2a-text-secondary)"; }}>
        {label}
      </div>
    </Link>
  );
}
