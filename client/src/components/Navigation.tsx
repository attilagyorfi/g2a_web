import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Sun, Moon, Phone, Mail, Clock, ArrowRight, Facebook, Youtube, Linkedin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [industriesHovered, setIndustriesHovered] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme, switchable } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const servicesRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const servicesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const industriesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLight = theme === "light";

  const services = [
    { title: lang === "en" ? "Localization" : "Lokalizáció", slug: "lokalizacio", desc: lang === "en" ? "Multilingual marketing" : "Többnyelvű marketing" },
    { title: lang === "en" ? "Brand Design" : "Arculattervezés", slug: "arculattervezes", desc: lang === "en" ? "Brand identity" : "Brand identitás" },
    { title: lang === "en" ? "Ad Management" : "Hirdetéskezelés", slug: "hirdeteskezeles", desc: lang === "en" ? "PPC & Meta Ads" : "PPC & Meta Ads" },
    { title: lang === "en" ? "Social Media" : "Közösségi Média", slug: "kozossegi-media", desc: lang === "en" ? "Social media management" : "Social media menedzsment" },
    { title: lang === "en" ? "Strategic Marketing" : "Stratégiai Marketing", slug: "strategiai-marketing", desc: lang === "en" ? "Full marketing strategy" : "Teljes marketing stratégia" },
    { title: lang === "en" ? "SEO" : "Keresőoptimalizálás", slug: "seo", desc: lang === "en" ? "SEO & content marketing" : "SEO & tartalommarketing" },
    { title: lang === "en" ? "Web Development" : "Webfejlesztés", slug: "webfejlesztes", desc: lang === "en" ? "Modern websites" : "Modern weboldalak" },
    { title: lang === "en" ? "AI Marketing" : "AI Marketing", slug: "ai-marketing", desc: lang === "en" ? "AI-powered solutions" : "AI-alapú megoldások" },
    { title: lang === "en" ? "Marketing Automation" : "Marketing Automatizáció", slug: "marketing-automatizacio", desc: lang === "en" ? "Workflow automation" : "Workflow automatizálás" },
    { title: lang === "en" ? "ESG Communication" : "ESG Kommunikáció", slug: "esg-kommunikacio", desc: lang === "en" ? "Sustainability marketing" : "Fenntarthatósági marketing" },
    { title: lang === "en" ? "Employer Branding" : "Employer Branding", slug: "employer-branding", desc: lang === "en" ? "Employer brand building" : "Munkáltatói márkaépítés" },
    { title: lang === "en" ? "International Marketing" : "Nemzetközi Marketing", slug: "nemzetkozi-marketing", desc: lang === "en" ? "Global presence" : "Globális jelenlét" },
  ];

  const industries = [
    { label: lang === "en" ? "Healthcare" : "Egészségügy", slug: "marketing-egeszsegugyi-cegeknek" },
    { label: lang === "en" ? "Beauty Industry" : "Szépségipar", slug: "marketing-szepsegipari-cegeknek" },
    { label: lang === "en" ? "Engineering Firms" : "Mérnöki irodák", slug: "marketing-mernoki-irodaknak" },
    { label: lang === "en" ? "Automotive" : "Autóipar", slug: "marketing-autoipari-cegeknek" },
    { label: lang === "en" ? "Law Firms" : "Ügyvédi irodák", slug: "marketing-ugyvedii-irodaknak" },
    { label: lang === "en" ? "Technology" : "Technológia", slug: "marketing-technologiai-cegeknek" },
    { label: lang === "en" ? "Municipality" : "Önkormányzat", slug: "marketing-onkormanyzati-projekteknek" },
    { label: lang === "en" ? "B2B Companies" : "B2B cégek", slug: "marketing-b2b-cegeknek" },
    { label: lang === "en" ? "Hairdressers" : "Fodrászat", slug: "marketing-fodrasszatnak" },
    { label: lang === "en" ? "Fitness" : "Fitness", slug: "marketing-fitness-cegeknek" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesHovered(false);
    setIndustriesHovered(false);
  }, [location]);

  const handleServicesEnter = () => {
    if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
    setServicesHovered(true);
    setIndustriesHovered(false);
  };
  const handleServicesLeave = () => {
    servicesTimeout.current = setTimeout(() => setServicesHovered(false), 120);
  };
  const handleIndustriesEnter = () => {
    if (industriesTimeout.current) clearTimeout(industriesTimeout.current);
    setIndustriesHovered(true);
    setServicesHovered(false);
  };
  const handleIndustriesLeave = () => {
    industriesTimeout.current = setTimeout(() => setIndustriesHovered(false), 120);
  };

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
            <NavLink href="/" label={lang === "en" ? "Home" : "Főoldal"} current={location} isLight={isLight} />

            {/* Services mega dropdown – hover triggered */}
            <div
              ref={servicesRef}
              style={{ position: "relative" }}
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.5rem 0.875rem", borderRadius: "6px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                  color: servicesHovered ? "#e91130" : "var(--g2a-text-secondary)",
                  background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                }}>
                {lang === "en" ? "Services" : "Szolgáltatások"}
                <ChevronDown size={13} style={{ transform: servicesHovered ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {servicesHovered && (
                <div style={{
                  position: "absolute", top: "calc(100% + 2px)", left: "50%", transform: "translateX(-40%)",
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
                      {lang === "en" ? "View all services" : "Összes szolgáltatás megtekintése"} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Industries dropdown – hover triggered */}
            <div
              ref={industriesRef}
              style={{ position: "relative" }}
              onMouseEnter={handleIndustriesEnter}
              onMouseLeave={handleIndustriesLeave}
            >
              <button
                style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.5rem 0.875rem", borderRadius: "6px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                  color: industriesHovered ? "#e91130" : "var(--g2a-text-secondary)",
                  background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                }}>
                {lang === "en" ? "Industries" : "Iparágak"}
                <ChevronDown size={13} style={{ transform: industriesHovered ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {industriesHovered && (
                <div style={{
                  position: "absolute", top: "calc(100% + 2px)", left: "50%", transform: "translateX(-50%)",
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
                        fontFamily: "Inter, sans-serif", fontSize: "0.875rem",
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

            <NavLink href="/rolunk" label={lang === "en" ? "About Us" : "Rólunk"} current={location} isLight={isLight} />
            <NavLink href="/referenciak" label={lang === "en" ? "References" : "Referenciák"} current={location} isLight={isLight} />
            <NavLink href="/hirek" label={lang === "en" ? "Blog" : "Blog"} current={location} isLight={isLight} />
            <NavLink href="/kapcsolat" label={lang === "en" ? "Contact" : "Kapcsolat"} current={location} isLight={isLight} />
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
                {lang === "en" ? "Free Audit" : "Ingyenes Audit"}
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
              <MobileNavLink href="/" label={lang === "en" ? "Home" : "Főoldal"} isLight={isLight} />
              <button onClick={() => setMobileServicesOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.625rem 0.75rem", borderRadius: "8px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 500,
                  color: "var(--g2a-text-secondary)", background: "none", border: "none", cursor: "pointer",
                }}>
                {lang === "en" ? "Services" : "Szolgáltatások"}
                <ChevronDown size={14} style={{ transform: mobileServicesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {mobileServicesOpen && (
                <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  {services.map(s => <MobileNavLink key={s.slug} href={`/szolgaltatasok/${s.slug}`} label={s.title} isLight={isLight} />)}
                </div>
              )}
              <button onClick={() => setMobileIndustriesOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.625rem 0.75rem", borderRadius: "8px",
                  fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 500,
                  color: "var(--g2a-text-secondary)", background: "none", border: "none", cursor: "pointer",
                }}>
                {lang === "en" ? "Industries" : "Iparágak"}
                <ChevronDown size={14} style={{ transform: mobileIndustriesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {mobileIndustriesOpen && (
                <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  {industries.map(ind => <MobileNavLink key={ind.slug} href={`/iparagi/${ind.slug}`} label={ind.label} isLight={isLight} />)}
                </div>
              )}
              <div style={{ height: "1px", backgroundColor: "var(--g2a-border)", margin: "0.75rem 0" }} />
              <MobileNavLink href="/rolunk" label={lang === "en" ? "About Us" : "Rólunk"} isLight={isLight} />
              <MobileNavLink href="/referenciak" label={lang === "en" ? "References" : "Referenciák"} isLight={isLight} />
              <MobileNavLink href="/hirek" label={lang === "en" ? "Blog" : "Blog"} isLight={isLight} />
              <MobileNavLink href="/kapcsolat" label={lang === "en" ? "Contact" : "Kapcsolat"} isLight={isLight} />
              <div style={{ marginTop: "1rem" }}>
                <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                  <span className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                    {lang === "en" ? "Free Marketing Audit" : "Ingyenes Marketing Audit"}
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
