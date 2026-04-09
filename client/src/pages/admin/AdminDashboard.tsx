import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Mail, Users, FileText, Briefcase, TrendingUp, Eye } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.stats.useQuery();

  const statCards = [
    { label: "Kapcsolatfelvételek", value: stats?.totalContacts || 0, sub: `${stats?.unreadContacts || 0} olvasatlan`, icon: <Mail size={20} />, href: "/admin/contacts", color: "var(--g2a-amber)" },
    { label: "Hírlevél feliratkozók", value: stats?.totalSubscribers || 0, sub: "aktív feliratkozó", icon: <Users size={20} />, href: "/admin/newsletter", color: "#3b82f6" },
    { label: "Blog cikkek", value: stats?.totalPosts || 0, sub: `${stats?.publishedPosts || 0} közzétett`, icon: <FileText size={20} />, href: "/admin/posts", color: "#10b981" },
    { label: "Partnerek", value: stats?.totalPartners || 0, sub: "aktív partner", icon: <Briefcase size={20} />, href: "/admin/partners", color: "#f59e0b" },
  ];

  const quickLinks = [
    { href: "/admin/posts/new", label: "Új cikk írása", icon: <FileText size={16} /> },
    { href: "/admin/hero-slides", label: "Hero slideshow", icon: <Eye size={16} /> },
    { href: "/admin/seo", label: "SEO beállítások", icon: <TrendingUp size={16} /> },
    { href: "/admin/settings", label: "Weboldal beállítások", icon: <Briefcase size={16} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Irányítópult
        </h1>
        <p style={{ color: "#888", fontSize: "0.875rem" }}>
          Üdvözöljük a G2A Marketing admin felületén.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {statCards.map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: "none" }}>
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: `${card.color}20`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", lineHeight: 1, marginBottom: "0.25rem" }}>
                {card.value}
              </div>
              <div style={{ color: "#ffffff", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>{card.label}</div>
              <div style={{ color: "#666", fontSize: "0.75rem" }}>{card.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
        <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
          Gyors műveletek
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.625rem 1rem", color: "#b0b0b0", fontSize: "0.875rem", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(233,17,48,0.4)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#b0b0b0"; }}>
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
