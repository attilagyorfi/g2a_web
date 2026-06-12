import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone, Mail, Clock, ArrowRight, Facebook, Instagram, Youtube, Linkedin, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useSiteSettings } from "@/lib/useSiteSettings";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [industriesHovered, setIndustriesHovered] = useState(false);
  const [location] = useLocation();
  const { theme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  // Admin-configurable social URLs (Beállítások panel). Fallbacks
  // below are the production values, so the nav still works on a
  // fresh DB with no settings rows.
  const settings = useSiteSettings();
  const servicesRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const servicesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const industriesTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLight = theme === "light";

  const services = [
    { title: t("service.localization"), slug: "lokalizacio", desc: t("service.localization.desc") },
    { title: t("service.branding"), slug: "arculattervezes", desc: t("service.branding.desc") },
    { title: t("service.ads"), slug: "hirdeteskezeles", desc: t("service.ads.desc") },
    { title: t("service.social"), slug: "kozossegi-media", desc: t("service.social.desc") },
    { title: t("service.strategy"), slug: "strategiai-marketing", desc: t("service.strategy.desc") },
    { title: t("service.seo"), slug: "keresooptimalizalas", desc: t("service.seo.desc") },
    { title: t("service.webdev"), slug: "webfejlesztes", desc: t("service.webdev.desc") },
    { title: t("service.aiMarketing"), slug: "ai-marketing", desc: t("service.aiMarketing.desc") },
    { title: t("service.automation"), slug: "marketing-automatizacio", desc: t("service.automation.desc") },
    { title: t("service.esg"), slug: "esg-kommunikacio", desc: t("service.esg.desc") },
    { title: t("service.employerBranding"), slug: "employer-branding", desc: t("service.employerBranding.desc") },
    { title: t("service.international"), slug: "nemzetkozi-marketing", desc: t("service.international.desc") },
  ];

  const industries = [
    { label: t("industry.healthcare"), slug: "marketing-egeszsegugyi-cegeknek" },
    { label: t("industry.beauty"), slug: "marketing-szepsegipari-cegeknek" },
    { label: t("industry.engineering"), slug: "marketing-mernoki-irodaknak" },
    { label: t("industry.automotive"), slug: "marketing-autoipari-cegeknek" },
    { label: t("industry.legal"), slug: "marketing-ugyvedi-irodaknak" },
    { label: t("industry.technology"), slug: "marketing-technologiai-cegeknek" },
    { label: t("industry.government"), slug: "marketing-onkormanyzati-projekteknek" },
    { label: t("industry.b2b"), slug: "marketing-b2b-cegeknek" },
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
      {/* Fixed header wrapper — Lenis smooth-scroll breaks `position: sticky`
          (it transforms the body), so we use position: fixed on the whole header. */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "backdrop-filter 0.3s ease",
      }}>
      {/* Top bar */}
      <div style={{
        backgroundColor: isLight ? "#f0f0f0" : "#080808",
        borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
        padding: "0.4rem 0",
      }}>
        <div className="g2a-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "Geist, sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#14B8A6")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
              <Phone size={11} /> +36 30 190 2575
            </a>
            <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.8rem", fontFamily: "Geist, sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#14B8A6")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
              <Mail size={11} /> info@g2amarketing.hu
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-text-muted)", fontSize: "0.8rem", fontFamily: "Geist, sans-serif" }}>
              <Clock size={11} /> 08:00 – 17:00
            </span>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {[
                { href: settings.get("facebook_url", "https://facebook.com/g2amarketing"), icon: <Facebook size={13} /> },
                { href: settings.get("instagram_url", "https://www.instagram.com/g2amarketingagency/"), icon: <Instagram size={13} /> },
                { href: settings.get("youtube_url", "https://youtube.com/g2amarketing"), icon: <Youtube size={13} /> },
                { href: settings.get("linkedin_url", "https://www.linkedin.com/company/g2a-marketing/"), icon: <Linkedin size={13} /> },
              ].filter(s => s.href).map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--g2a-text-muted)", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#14B8A6")}
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
        backgroundColor: navBg,
        borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
        transition: "background-color 0.3s ease",
      }}>
        <div className="g2a-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={LOGO_URL} alt={t("nav.logoAlt")} style={{ height: "38px", width: "auto", filter: isLight ? "invert(1)" : "none" }} />
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.125rem" }} className="hidden md:flex">
            <NavLink href="/" label={t("nav.home")} current={location} isLight={isLight} />

            {/* Services mega dropdown – hover triggered */}
            <div
              ref={servicesRef}
              style={{ position: "relative" }}
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <Link href="/szolgaltatasok" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.5rem 0.875rem", borderRadius: "6px",
                    fontFamily: "Geist, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                    color: servicesHovered ? "#14B8A6" : "var(--g2a-text-secondary)",
                    background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                  }}>
                  {t("nav.services")}
                  <ChevronDown size={13} style={{ transform: servicesHovered ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
              </Link>
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
                        <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "var(--g2a-text-primary)", marginBottom: "0.2rem" }}>{s.title}</div>
                        <div style={{ fontFamily: "Geist, sans-serif", fontSize: "0.75rem", color: "var(--g2a-text-muted)" }}>{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${dropdownBorder}`, marginTop: "0.5rem", paddingTop: "0.75rem" }}>
                    <Link href="/szolgaltatasok" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-brand-teal)", fontFamily: "Geist, sans-serif", fontSize: "0.875rem", fontWeight: 600 }}>
                      {t("nav.viewAllServices")} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Industries dropdown – hover triggered. Label itself is
                a real Link to the /szakertelem industries hub (mirrors
                the Services menu pattern), so clicking takes you to
                the overview page; the hover dropdown still surfaces
                the 8 direct subpage links for quick access. */}
            <div
              ref={industriesRef}
              style={{ position: "relative" }}
              onMouseEnter={handleIndustriesEnter}
              onMouseLeave={handleIndustriesLeave}
            >
              <Link href="/szakertelem" style={{ textDecoration: "none" }}>
                <button
                  aria-label={t("nav.industries")}
                  aria-expanded={industriesHovered}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.5rem 0.875rem", borderRadius: "6px",
                    fontFamily: "Geist, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                    color: industriesHovered ? "#14B8A6" : "var(--g2a-text-secondary)",
                    background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                  }}>
                  {t("nav.industries")}
                  <ChevronDown size={13} style={{ transform: industriesHovered ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
              </Link>
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
                        fontFamily: "Geist, sans-serif", fontSize: "0.875rem",
                        color: "var(--g2a-text-secondary)", transition: "all 0.15s", cursor: "pointer",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = isLight ? "#f5f5f5" : "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#14B8A6"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--g2a-text-secondary)"; }}>
                        {ind.label}
                      </div>
                    </Link>
                  ))}
                  <div style={{ borderTop: `1px solid ${dropdownBorder}`, marginTop: "0.5rem", paddingTop: "0.625rem" }}>
                    <Link href="/szakertelem" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-brand-teal)", fontFamily: "Geist, sans-serif", fontSize: "0.8rem", fontWeight: 600, padding: "0 0.75rem" }}>
                      {lang === "hu" ? "Összes iparág" : lang === "en" ? "All industries" : "全部行业"} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="/rolunk" label={t("nav.about")} current={location} isLight={isLight} />
            <NavLink href="/referenciak" label={t("nav.references")} current={location} isLight={isLight} />
            <NavLink href="/hirek" label={t("nav.blog")} current={location} isLight={isLight} />
            <NavLink href="/kapcsolat" label={t("nav.contact")} current={location} isLight={isLight} />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("g2a:open-search"))}
              aria-label={t("search.openShortcut")}
              title={t("search.openShortcut")}
              style={{ background: "none", border: "none", color: "var(--g2a-text-secondary)", cursor: "pointer", padding: "0.5rem", display: "flex", alignItems: "center", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--g2a-brand-teal)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--g2a-text-secondary)")}
            >
              <Search size={17} />
            </button>
            <ThemeToggle />
            {/* Language switcher — HU / EN / ZH dropdown */}
            <LanguageSwitcher lang={lang} setLang={setLang} />

            {/* Desktop top-right "Ingyenes audit" pill removed — the floating
                StickyCTA on the bottom-left already drives the same conversion,
                and having one on each side felt over-pushy. The mobile menu
                still includes the button so smartphone users have a clear CTA
                inside the hamburger flyout. */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", color: "var(--g2a-text-primary)", cursor: "pointer", padding: "0.375rem" }}
              className="flex md:hidden" aria-label={t("nav.openMenu")}>
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
              <MobileNavLink href="/" label={t("nav.home")} isLight={isLight} />
              <button onClick={() => setMobileServicesOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.625rem 0.75rem", borderRadius: "8px",
                  fontFamily: "Geist, sans-serif", fontSize: "0.9rem", fontWeight: 500,
                  color: "var(--g2a-text-secondary)", background: "none", border: "none", cursor: "pointer",
                }}>
                {t("nav.services")}
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
                  fontFamily: "Geist, sans-serif", fontSize: "0.9rem", fontWeight: 500,
                  color: "var(--g2a-text-secondary)", background: "none", border: "none", cursor: "pointer",
                }}>
                {t("nav.industries")}
                <ChevronDown size={14} style={{ transform: mobileIndustriesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {mobileIndustriesOpen && (
                <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  {industries.map(ind => <MobileNavLink key={ind.slug} href={`/iparagi/${ind.slug}`} label={ind.label} isLight={isLight} />)}
                </div>
              )}
              <div style={{ height: "1px", backgroundColor: "var(--g2a-border)", margin: "0.75rem 0" }} />
              <MobileNavLink href="/rolunk" label={t("nav.about")} isLight={isLight} />
              <MobileNavLink href="/referenciak" label={t("nav.references")} isLight={isLight} />
              <MobileNavLink href="/hirek" label={t("nav.blog")} isLight={isLight} />
              <MobileNavLink href="/kapcsolat" label={t("nav.contact")} isLight={isLight} />
              <div style={{ marginTop: "1rem" }}>
                <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                  <span className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                    {t("nav.freeAuditFull")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      </div>
      {/* Spacer to compensate for fixed header (top-bar ~32px + main-nav 68px = ~100px) */}
      <div aria-hidden style={{ height: "100px" }} />
    </>
  );
}

function NavLink({ href, label, current, isLight }: { href: string; label: string; current: string; isLight: boolean }) {
  const isActive = current === href || (href !== "/" && current.startsWith(href));
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <span style={{
        display: "block", padding: "0.5rem 0.875rem", borderRadius: "6px",
        fontFamily: "Geist, sans-serif", fontSize: "0.875rem", fontWeight: isActive ? 600 : 500,
        color: isActive ? "#14B8A6" : "var(--g2a-text-secondary)",
        transition: "color 0.2s, background-color 0.2s",
        position: "relative",
      }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--g2a-text-primary)"; e.currentTarget.style.backgroundColor = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = isActive ? "#14B8A6" : "var(--g2a-text-secondary)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
        {label}
        {isActive && <span style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "18px", height: "2px", backgroundColor: "var(--g2a-brand-teal)", borderRadius: "1px" }} />}
      </span>
    </Link>
  );
}

function MobileNavLink({ href, label, isLight }: { href: string; label: string; isLight: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "0.625rem 0.75rem", borderRadius: "8px",
        fontFamily: "Geist, sans-serif", fontSize: "0.9rem", fontWeight: 500,
        color: "var(--g2a-text-secondary)", transition: "all 0.15s", cursor: "pointer",
      }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#14B8A6"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--g2a-text-secondary)"; }}>
        {label}
      </div>
    </Link>
  );
}
