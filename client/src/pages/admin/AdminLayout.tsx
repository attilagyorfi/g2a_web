import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard, FileText, Settings, Mail, Newspaper,
  Image, Star, Briefcase, Globe, Cpu, Heart, Tag,
  ChevronLeft, ChevronRight, LogOut, Shield, BookOpen, ClipboardList
} from "lucide-react";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Irányítópult", exact: true },
  { href: "/admin/posts", icon: Newspaper, label: "Blog cikkek" },
  { href: "/admin/categories", icon: Tag, label: "Kategóriák" },
  { href: "/admin/services", icon: Briefcase, label: "Szolgáltatások" },
  { href: "/admin/hero-slides", icon: Image, label: "Hero Slideshow" },
  { href: "/admin/partners", icon: Globe, label: "Partnerek" },
  { href: "/admin/testimonials", icon: Star, label: "Vélemények" },
  { href: "/admin/industries", icon: FileText, label: "Iparágak" },
  { href: "/admin/technologies", icon: Cpu, label: "Technológiák" },
  { href: "/admin/values", icon: Heart, label: "Értékek" },
  { href: "/admin/case-studies", icon: BookOpen, label: "Esettanulmányok" },
  { href: "/admin/audit-leads", icon: ClipboardList, label: "Audit Kérések" },
  { href: "/admin/contacts", icon: Mail, label: "Kapcsolatfelvételek" },
  { href: "/admin/newsletter", icon: FileText, label: "Hírlevél" },
  { href: "/admin/seo", icon: Globe, label: "SEO Oldalak" },
  { href: "/admin/settings", icon: Settings, label: "Beállítások" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#888" }}>Betöltés...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
          <Shield size={48} style={{ color: "#e91130", margin: "0 auto 1.5rem", display: "block" }} />
          <h1 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", marginBottom: "1rem" }}>
            Admin Belépés
          </h1>
          <p style={{ color: "#888", marginBottom: "2rem" }}>
            Az admin felület eléréséhez be kell jelentkeznie.
          </p>
          <a href={getLoginUrl()} className="g2a-btn-primary" style={{ display: "inline-flex" }}>
            Bejelentkezés
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#e91130", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", marginBottom: "1rem" }}>
            Hozzáférés megtagadva
          </h1>
          <p style={{ color: "#888", marginBottom: "1.5rem" }}>Nincs admin jogosultsága.</p>
          <Link href="/" className="g2a-btn-primary">Vissza a főoldalra</Link>
        </div>
      </div>
    );
  }

  const sidebarWidth = collapsed ? "64px" : "240px";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth, flexShrink: 0, backgroundColor: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease", overflow: "hidden",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? "1rem 0" : "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", height: "64px" }}>
          {!collapsed && (
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <img src={LOGO_URL} alt="G2A Marketing" style={{ height: "28px" }} />
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "0.25rem", display: "flex" }}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
          {navItems.map(item => {
            const isActive = item.exact ? location === item.href : (location === item.href || location.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: collapsed ? "0.75rem 0" : "0.625rem 1.25rem",
                justifyContent: collapsed ? "center" : "flex-start",
                color: isActive ? "#e91130" : "#888",
                backgroundColor: isActive ? "rgba(233,17,48,0.08)" : "transparent",
                borderRight: isActive ? "2px solid #e91130" : "2px solid transparent",
                textDecoration: "none", fontSize: "0.875rem",
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#888"; }}
                title={collapsed ? item.label : undefined}>
                <Icon size={16} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: collapsed ? "1rem 0" : "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {!collapsed && (
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ color: "#ffffff", fontSize: "0.875rem", fontWeight: 500 }}>{user?.name || "Admin"}</div>
              <div style={{ color: "#666", fontSize: "0.75rem" }}>{user?.email || ""}</div>
            </div>
          )}
          <button onClick={() => logout()}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.8125rem", padding: collapsed ? "0.25rem 0" : "0.25rem", justifyContent: collapsed ? "center" : "flex-start", width: "100%", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
            onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
            <LogOut size={15} />
            {!collapsed && "Kijelentkezés"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: sidebarWidth, transition: "margin-left 0.2s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div style={{ backgroundColor: "#111111", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", fontWeight: 500 }}>
            G2A Admin Panel
          </div>
          <Link href="/" style={{ color: "#888", fontSize: "0.8125rem", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e91130")}
            onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
            ← Weboldal megtekintése
          </Link>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "2rem" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
