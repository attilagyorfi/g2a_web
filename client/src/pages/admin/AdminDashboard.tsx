import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Mail, Users, FileText, Briefcase, TrendingUp, ClipboardList, BarChart3, Activity, Server, Sparkles, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import TimeSeriesChart from "@/components/admin/TimeSeriesChart";

/** Format an ISO timestamp as a friendly "5 perccel ezelőtt" / "ma 13:42" string. */
function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "—";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return "épp most";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} perce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} órája`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} napja`;
  return new Date(iso).toLocaleDateString("hu-HU", { month: "short", day: "numeric" });
}

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.stats.useQuery();
  const [chartRange, setChartRange] = useState<7 | 30 | 90>(30);
  const { data: ts } = trpc.admin.statsTimeSeries.useQuery({ days: chartRange });
  // Three new dashboard widgets — activity feed, integration health,
  // content velocity. All cheap server-side rollups.
  const { data: activity } = trpc.admin.recentActivity.useQuery({ limit: 8 });
  const { data: health } = trpc.admin.systemHealth.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const { data: contentSummary } = trpc.admin.contentSummary.useQuery();

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

      {/* Two-column row: activity feed on the left, integration health
          + content summary stacked on the right. Collapses to single
          column under 880px so it works on tablet/laptop. */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: "1.25rem", marginBottom: "2rem" }} className="g2a-admin-dashboard-grid">
        {/* ── Recent activity feed ─────────────────────────────── */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Activity size={18} style={{ color: "#888" }} />
              <h2 style={{ color: "#ffffff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                Legutóbbi események
              </h2>
            </div>
            {activity && activity.totalEvents > (activity.events.length ?? 0) && (
              <span style={{ color: "#666", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                {activity.events.length} / {activity.totalEvents}
              </span>
            )}
          </div>
          {activity ? (
            activity.events.length === 0 ? (
              <div style={{ color: "#666", fontSize: "0.85rem", padding: "1rem 0", fontFamily: "Geist Mono, monospace" }}>
                Még nincs esemény.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {activity.events.map((ev) => {
                  const palette = ev.type === "contact"
                    ? { icon: <Mail size={14} />, color: "#14B8A6", bg: "rgba(20,184,166,0.10)", label: "Kapcsolat" }
                    : ev.type === "audit"
                    ? { icon: <ClipboardList size={14} />, color: "#a855f7", bg: "rgba(168,85,247,0.10)", label: "Audit" }
                    : { icon: <Users size={14} />, color: "#3b82f6", bg: "rgba(59,130,246,0.10)", label: "Hírlevél" };
                  return (
                    <Link key={`${ev.type}-${ev.id}`} href={ev.href} style={{ textDecoration: "none" }}>
                      <div
                        style={{
                          display: "flex", alignItems: "center", gap: "0.85rem",
                          padding: "0.65rem 0.8rem", borderRadius: 6,
                          background: ev.unread ? "rgba(255,255,255,0.025)" : "transparent",
                          border: ev.unread ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                          cursor: "pointer", transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = ev.unread ? "rgba(255,255,255,0.025)" : "transparent")}
                      >
                        <span style={{ width: 30, height: 30, borderRadius: 6, background: palette.bg, color: palette.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {palette.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: "0.85rem", fontWeight: 500 }}>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{ev.title}</span>
                            {ev.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.color, flexShrink: 0 }} />}
                          </div>
                          <div style={{ color: "#777", fontSize: "0.72rem", fontFamily: "Geist Mono, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {palette.label} · {ev.subtitle || "—"}
                          </div>
                        </div>
                        <div style={{ color: "#666", fontSize: "0.7rem", fontFamily: "Geist Mono, monospace", flexShrink: 0 }}>
                          {relativeTime(ev.at)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            <div style={{ color: "#666", fontSize: "0.85rem", padding: "1rem 0", fontFamily: "Geist Mono, monospace" }}>Betöltés…</div>
          )}
        </div>

        {/* Right column: system health + content velocity stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* ── Integration health ──────────────────────────────── */}
          <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <Server size={18} style={{ color: "#888" }} />
              <h2 style={{ color: "#ffffff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                Integrációk
              </h2>
            </div>
            {health ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { key: "database", label: "Adatbázis", detail: "TiDB / MySQL" },
                  { key: "openai", label: "OpenAI", detail: health.openai.model },
                  { key: "resend", label: "Email (Resend)", detail: health.resend.notifyAddress || (health.resend.configured ? "küldés engedélyezve" : "nincs konfigurálva") },
                  { key: "cloudinary", label: "Képtárhely (Cloudinary)", detail: health.cloudinary.cloudName || (health.cloudinary.configured ? "engedélyezve" : "nincs konfigurálva") },
                  { key: "turnstile", label: "Turnstile (anti-bot)", detail: health.turnstile.configured ? "aktív" : "inaktív" },
                  { key: "deepl", label: "DeepL (fordítás)", detail: health.deepl.configured ? "engedélyezve" : "nincs konfigurálva" },
                  { key: "calendly", label: "Calendly (időpontok)", detail: health.calendly.configured ? "engedélyezve" : "nincs konfigurálva" },
                ].map((row) => {
                  const ok = (health as Record<string, { configured: boolean }>)[row.key]?.configured;
                  const isCritical = row.key === "database" || row.key === "openai" || row.key === "resend";
                  const Icon = ok ? CheckCircle2 : isCritical ? XCircle : AlertCircle;
                  const color = ok ? "#10b981" : isCritical ? "#ef4444" : "#fbbf24";
                  return (
                    <div key={row.key} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.45rem 0.55rem", borderRadius: 5 }}>
                      <Icon size={14} style={{ color, flexShrink: 0 }} />
                      <span style={{ color: "#fff", fontSize: "0.78rem", fontFamily: "Geist Mono, monospace", flex: 1 }}>{row.label}</span>
                      <span style={{ color: "#777", fontSize: "0.7rem", fontFamily: "Geist Mono, monospace", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                        {row.detail}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: "#666", fontSize: "0.85rem", fontFamily: "Geist Mono, monospace" }}>Betöltés…</div>
            )}
          </div>

          {/* ── Content velocity ─────────────────────────────────── */}
          <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <Sparkles size={18} style={{ color: "#888" }} />
              <h2 style={{ color: "#ffffff", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                Tartalom-tempó
              </h2>
            </div>
            {contentSummary ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div style={{ padding: "0.65rem 0.75rem", background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)", borderRadius: 6 }}>
                    <div style={{ color: "#c084fc", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", marginBottom: 3 }}>UTOLSÓ 7 NAP</div>
                    <div style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontWeight: 700, fontSize: "1.4rem", lineHeight: 1 }}>{contentSummary.postsLast7Days}</div>
                    <div style={{ color: "#888", fontSize: "0.68rem", marginTop: 3 }}>új cikk</div>
                  </div>
                  <div style={{ padding: "0.65rem 0.75rem", background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.18)", borderRadius: 6 }}>
                    <div style={{ color: "#5eead4", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", marginBottom: 3 }}>UTOLSÓ 30 NAP</div>
                    <div style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontWeight: 700, fontSize: "1.4rem", lineHeight: 1 }}>{contentSummary.postsLast30Days}</div>
                    <div style={{ color: "#888", fontSize: "0.68rem", marginTop: 3 }}>új cikk</div>
                  </div>
                </div>
                {contentSummary.recentPublished.length > 0 && (
                  <>
                    <div style={{ color: "#888", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Legutóbbi közzétételek
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {contentSummary.recentPublished.map((p) => (
                        <Link key={p.id} href={`/admin/posts/${p.id}`} style={{ textDecoration: "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.35rem 0.5rem", borderRadius: 4, cursor: "pointer", color: "#bbb", fontSize: "0.78rem", transition: "all 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#bbb"; }}
                          >
                            <ChevronRight size={11} style={{ color: "#666", flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ color: "#666", fontSize: "0.85rem", fontFamily: "Geist Mono, monospace" }}>Betöltés…</div>
            )}
          </div>
        </div>
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
