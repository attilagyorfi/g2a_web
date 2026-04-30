import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Mail, Users, FileText, Briefcase, TrendingUp, Eye, ClipboardList, BarChart3 } from "lucide-react";
import TimeSeriesChart from "@/components/admin/TimeSeriesChart";

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.stats.useQuery();
  const [chartRange, setChartRange] = useState<7 | 30 | 90>(30);
  const { data: ts } = trpc.admin.statsTimeSeries.useQuery({ days: chartRange });

  const statCards = [
    { label: "Kapcsolatfelvételek", value: stats?.totalContacts ?? 0, sub: `${stats?.unreadContacts ?? 0} olvasatlan`, icon: <Mail size={20} />, href: (stats?.unreadContacts ?? 0) > 0 ? "/admin/contacts?filter=unread" : "/admin/contacts", color: "var(--g2a-brand-teal)" },
    { label: "Audit kérések", value: stats?.totalAuditLeads ?? 0, sub: `${stats?.openAuditLeads ?? 0} megválaszolatlan`, icon: <ClipboardList size={20} />, href: "/admin/audit-leads", color: "#a855f7" },
    { label: "Hírlevél feliratkozók", value: stats?.totalSubscribers ?? 0, sub: "aktív feliratkozó", icon: <Users size={20} />, href: "/admin/newsletter", color: "#3b82f6" },
    { label: "Blog cikkek", value: stats?.totalPosts ?? 0, sub: `${stats?.publishedPosts ?? 0} közzétett`, icon: <FileText size={20} />, href: "/admin/posts", color: "#10b981" },
    { label: "Partnerek", value: stats?.totalPartners ?? 0, sub: "aktív partner", icon: <Briefcase size={20} />, href: "/admin/partners", color: "#f59e0b" },
  ];

  const quickLinks = [
    { href: "/admin/posts/new", label: "Új cikk írása", icon: <FileText size={16} /> },
    { href: "/admin/newsletter/campaigns", label: "Email kampány", icon: <Mail size={16} /> },
    { href: "/admin/seo", label: "SEO beállítások", icon: <TrendingUp size={16} /> },
    { href: "/admin/settings", label: "Weboldal beállítások", icon: <Briefcase size={16} /> },
  ];

  // Convert tRPC time-series into chart format
  const chartLabels = ts?.series.map((b) => b.date) ?? [];
  const chartSeries = ts ? [
    { name: "Kapcsolatfelvételek", color: "#14B8A6", points: ts.series.map((b) => b.contacts) },
    { name: "Audit kérések", color: "#a855f7", points: ts.series.map((b) => b.auditLeads) },
    { name: "Feliratkozók", color: "#3b82f6", points: ts.series.map((b) => b.subscribers) },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Irányítópult
        </h1>
        <p style={{ color: "#888", fontSize: "0.875rem" }}>
          Üdvözöljük a G2A Marketing admin felületén.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
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
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", fontFamily: "Geist Mono, monospace", lineHeight: 1, marginBottom: "0.25rem" }}>
                {card.value}
              </div>
              <div style={{ color: "#ffffff", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>{card.label}</div>
              <div style={{ color: "#666", fontSize: "0.75rem" }}>{card.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Time-series chart */}
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BarChart3 size={18} style={{ color: "#888" }} />
            <h2 style={{ color: "#ffffff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
              Beérkezések — utolsó {chartRange} nap
            </h2>
          </div>
          <div style={{ display: "inline-flex", gap: 4, padding: 3, background: "rgba(255,255,255,0.04)", borderRadius: 6 }}>
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setChartRange(d)}
                style={{
                  padding: "5px 12px", borderRadius: 4, border: "none", cursor: "pointer",
                  fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", fontWeight: 600,
                  background: chartRange === d ? "var(--g2a-brand-teal)" : "transparent",
                  color: chartRange === d ? "#fff" : "var(--g2a-text-muted)",
                }}
              >{d} nap</button>
            ))}
          </div>
        </div>

        {ts ? (
          <>
            {/* Legend with totals */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginBottom: "0.75rem", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem" }}>
              {chartSeries.map((s, i) => {
                const total = i === 0 ? ts.totals.contacts : i === 1 ? ts.totals.auditLeads : ts.totals.subscribers;
                return (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, color: "#aaa" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                    <span>{s.name}</span>
                    <span style={{ color: "#fff", fontWeight: 700 }}>{total}</span>
                  </div>
                );
              })}
            </div>

            <TimeSeriesChart labels={chartLabels} series={chartSeries} height={240} />

            {ts.totals.contacts === 0 && ts.totals.auditLeads === 0 && ts.totals.subscribers === 0 && (
              <div style={{ textAlign: "center", padding: "1rem 0 0", color: "#666", fontSize: "0.78rem", fontFamily: "Geist Mono, monospace" }}>
                Nincs adat ebben az időszakban — minden 0.
              </div>
            )}
          </>
        ) : (
          <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontFamily: "Geist Mono, monospace", fontSize: "0.85rem" }}>
            Adatok betöltése...
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
        <h2 style={{ color: "#ffffff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
          Gyors műveletek
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "0.625rem 1rem", color: "#b0b0b0", fontSize: "0.875rem", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,184,166,0.4)"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
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
