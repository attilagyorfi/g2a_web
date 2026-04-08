import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone, Mail, Clock, Facebook, Youtube, Linkedin } from "lucide-react";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

const services = [
  { title: "Lokalizáció", slug: "lokalizacio" },
  { title: "Arculattervezés", slug: "arculattervezes" },
  { title: "Hirdetéskezelés", slug: "hirdeteskezeles" },
  { title: "Közösségi Média", slug: "kozossegi-media" },
  { title: "Stratégiai Marketing", slug: "strategiai-marketing" },
  { title: "Keresőoptimalizálás", slug: "keresőoptimalizalas" },
  { title: "Webfejlesztés", slug: "webfejlesztes" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: "#111111", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.5rem 0" }}>
        <div className="g2a-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#b0b0b0", fontSize: "0.8125rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#b0b0b0")}>
              <Phone size={13} />
              +36301902575
            </a>
            <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#b0b0b0", fontSize: "0.8125rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#b0b0b0")}>
              <Mail size={13} />
              info@g2amarketing.hu
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#b0b0b0", fontSize: "0.8125rem" }}>
              <Clock size={13} />
              08:00 – 17:00
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <a href="https://facebook.com/g2amarketing" target="_blank" rel="noopener noreferrer" style={{ color: "#b0b0b0", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#b0b0b0")}>
              <Facebook size={15} />
            </a>
            <a href="https://youtube.com/g2amarketing" target="_blank" rel="noopener noreferrer" style={{ color: "#b0b0b0", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#b0b0b0")}>
              <Youtube size={15} />
            </a>
            <a href="https://linkedin.com/company/g2amarketing" target="_blank" rel="noopener noreferrer" style={{ color: "#b0b0b0", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
              onMouseLeave={e => (e.currentTarget.style.color = "#b0b0b0")}>
              <Linkedin size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{
        backgroundColor: scrolled ? "rgba(26,26,26,0.97)" : "#1a1a1a",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.3s ease",
        padding: "0",
      }}>
        <div className="g2a-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <img src={LOGO_URL} alt="G2A Marketing logó – adatvezérelt marketing ügynökség Pécs" style={{ height: "36px", width: "auto" }} />
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="hidden md:flex">
            <NavLink href="/" label="Főoldal" current={location} />

            {/* Services Dropdown */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}>
              <button style={{
                display: "flex", alignItems: "center", gap: "0.25rem",
                padding: "0.5rem 0.875rem", color: "#d0d0d0",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#d0d0d0")}>
                Szolgáltatások
                <ChevronDown size={14} style={{ transform: servicesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {servicesOpen && (
                <div style={{
                  position: "absolute", top: "100%", left: 0,
                  backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px", padding: "0.5rem", minWidth: "220px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}>
                  {services.map(s => (
                    <Link key={s.slug} href={`/szolgaltatasok/${s.slug}`} style={{
                      display: "block", padding: "0.5rem 0.875rem",
                      color: "#b0b0b0", fontSize: "0.875rem", borderRadius: "4px",
                      textDecoration: "none", transition: "all 0.15s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#b0b0b0"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/szakertelem" label="Szakértelem" current={location} />
            <NavLink href="/technologia" label="Technológia" current={location} />
            <NavLink href="/hirek" label="Hírek" current={location} />
            <NavLink href="/partnereink" label="Partnereink" current={location} />
            <NavLink href="/kapcsolat" label="Kapcsolat" current={location} />
          </div>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/kapcsolat" className="g2a-btn-primary hidden md:inline-flex" style={{ padding: "0.625rem 1.25rem", fontSize: "0.8125rem" }}>
              Ingyenes Felmérés
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "0.5rem" }}
              className="md:hidden"
              aria-label="Menü megnyitása">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1rem 0" }}>
            <div className="g2a-container" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <MobileNavLink href="/" label="Főoldal" />
              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0.875rem", color: "#d0d0d0", background: "none", border: "none", cursor: "pointer", fontFamily: "Roboto Mono, monospace", fontSize: "0.9rem", borderRadius: "6px" }}>
                  Szolgáltatások
                  <ChevronDown size={14} style={{ transform: servicesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {servicesOpen && (
                  <div style={{ paddingLeft: "1rem" }}>
                    {services.map(s => (
                      <MobileNavLink key={s.slug} href={`/szolgaltatasok/${s.slug}`} label={s.title} />
                    ))}
                  </div>
                )}
              </div>
              <MobileNavLink href="/szakertelem" label="Szakértelem" />
              <MobileNavLink href="/technologia" label="Technológia" />
              <MobileNavLink href="/hirek" label="Hírek" />
              <MobileNavLink href="/partnereink" label="Partnereink" />
              <MobileNavLink href="/kapcsolat" label="Kapcsolat" />
              <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <Link href="/kapcsolat" className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Ingyenes Marketing Felmérés
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, label, current }: { href: string; label: string; current: string }) {
  const isActive = current === href || (href !== "/" && current.startsWith(href));
  return (
    <Link href={href} style={{
      padding: "0.5rem 0.875rem",
      color: isActive ? "#ffffff" : "#d0d0d0",
      fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem",
      textDecoration: "none", borderRadius: "4px",
      borderBottom: isActive ? "2px solid #e91130" : "2px solid transparent",
      transition: "all 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
      onMouseLeave={e => (e.currentTarget.style.color = isActive ? "#ffffff" : "#d0d0d0")}>
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{
      display: "block", padding: "0.625rem 0.875rem",
      color: "#d0d0d0", fontFamily: "Roboto Mono, monospace", fontSize: "0.9rem",
      textDecoration: "none", borderRadius: "6px", transition: "all 0.15s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#d0d0d0"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
      {label}
    </Link>
  );
}
