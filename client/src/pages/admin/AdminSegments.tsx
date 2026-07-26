/**
 * /admin/segments — segment builder.
 *
 * Filters the newsletter list (client-side, on the already-loaded rows) by
 * source, band, checklist score, behavioural engagement score and recency, so
 * the owner can isolate a segment (e.g. hot leads, cooling subscribers,
 * checklist completers) and export it (CSV) or act on it. Reads the same
 * segmentation fields the funnel + scoring/churn layers write.
 */
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

type Sub = {
  email: string; name?: string | null; source?: string | null; band?: string | null;
  score?: number | null; engagementScore?: number | null; lastEngagedAt?: string | Date | null;
  isActive?: boolean; tags?: string | null; createdAt?: string | Date | null;
};

const daysAgo = (n: number) => Date.now() - n * 86400000;

export default function AdminSegments() {
  const { data: subs = [], isLoading } = trpc.admin.newsletter.list.useQuery();
  const { data: attr } = trpc.admin.newsletter.attribution.useQuery();
  const all = subs as Sub[];

  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [band, setBand] = useState("");
  const [minScore, setMinScore] = useState("");
  const [minEng, setMinEng] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [recency, setRecency] = useState<"" | "eng30" | "eng90" | "cold60" | "never">("");

  const sources = useMemo(() => Array.from(new Set(all.map((s) => s.source).filter(Boolean))) as string[], [all]);
  const bands = useMemo(() => Array.from(new Set(all.map((s) => s.band).filter(Boolean))) as string[], [all]);

  const filtered = useMemo(() => {
    return all.filter((s) => {
      if (activeOnly && s.isActive === false) return false;
      if (source && s.source !== source) return false;
      if (band && s.band !== band) return false;
      if (q) {
        const hay = `${s.email} ${s.name ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (minScore && (s.score ?? -1) < Number(minScore)) return false;
      if (minEng && (s.engagementScore ?? 0) < Number(minEng)) return false;
      const eng = s.lastEngagedAt ? new Date(s.lastEngagedAt).getTime() : null;
      if (recency === "eng30" && !(eng && eng >= daysAgo(30))) return false;
      if (recency === "eng90" && !(eng && eng >= daysAgo(90))) return false;
      if (recency === "cold60" && !(eng && eng < daysAgo(60))) return false;
      if (recency === "never" && eng) return false;
      return true;
    });
  }, [all, q, source, band, minScore, minEng, activeOnly, recency]);

  const preset = (p: string) => {
    setQ(""); setActiveOnly(true);
    if (p === "hot") { setSource(""); setBand(""); setMinScore(""); setMinEng("3"); setRecency("eng30"); }
    else if (p === "cooling") { setSource(""); setBand(""); setMinScore(""); setMinEng(""); setRecency("cold60"); }
    else if (p === "checklist") { setSource("marketing-teszt"); setBand(""); setMinScore(""); setMinEng(""); setRecency(""); }
    else { setSource(""); setBand(""); setMinScore(""); setMinEng(""); setRecency(""); }
  };

  const exportCsv = () => {
    const head = ["email", "name", "source", "band", "score", "engagementScore", "lastEngagedAt", "isActive"];
    const rows = filtered.map((s) => [s.email, s.name ?? "", s.source ?? "", s.band ?? "", s.score ?? "", s.engagementScore ?? 0, s.lastEngagedAt ?? "", s.isActive === false ? "0" : "1"]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `szegmens-${filtered.length}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const lbl: React.CSSProperties = { fontSize: 12, color: "var(--g2a-text-muted, #6b7280)", display: "block", marginBottom: 4 };
  const card: React.CSSProperties = { background: "var(--g2a-bg-card, #fff)", border: "1px solid var(--g2a-border, #e5e7eb)", borderRadius: 10, padding: 16 };

  return (
    <div style={{ padding: "4px 0" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Szegmensek</h1>
      <p style={{ color: "var(--g2a-text-muted, #6b7280)", fontSize: 14, marginBottom: 16 }}>
        Szűrd a feliratkozókat forrás, sáv, checklista-pontszám, engagement és aktivitás szerint. A szűrt szegmenst CSV-ben exportálhatod (pl. hirdetési egyéni közönséghez), vagy megcélozhatod egy kampánnyal.
      </p>

      {attr && attr.rows.length > 0 && (
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <strong style={{ fontSize: 15 }}>Attribúció — melyik forrás hoz leadet</strong>
            <span style={{ fontSize: 13, color: "var(--g2a-text-muted, #6b7280)" }}>Összesen: {attr.totalConverted}/{attr.totalSubs} lett lead ({attr.totalRate}%)</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ textAlign: "left", color: "var(--g2a-text-muted, #6b7280)", borderBottom: "1px solid var(--g2a-border, #e5e7eb)" }}>
                {["Forrás", "Feliratkozó", "Leaddé vált", "Arány"].map((h) => <th key={h} style={{ padding: "8px 12px", fontWeight: 600 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {attr.rows.map((r) => (
                  <tr key={r.source} style={{ borderBottom: "1px solid var(--g2a-border, #f1f5f9)" }}>
                    <td style={{ padding: "8px 12px" }}>{r.source}</td>
                    <td style={{ padding: "8px 12px" }}>{r.subscribers}</td>
                    <td style={{ padding: "8px 12px" }}>{r.converted}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: r.rate >= attr.totalRate ? "var(--g2a-brand-teal, #14B8A6)" : "inherit" }}>{r.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--g2a-text-muted, #6b7280)", marginTop: 8 }}>„Lead" = a feliratkozó később beküldött egy kapcsolati vagy audit űrlapot (email-egyezés alapján).</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {[["hot", "🔥 Forró leadek"], ["cooling", "❄️ Kihűlőben"], ["checklist", "📋 Checklista-kitöltők"], ["reset", "Alaphelyzet"]].map(([k, label]) => (
          <button key={k} onClick={() => preset(k)} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--g2a-border, #e5e7eb)", background: "var(--g2a-bg-2, #f8fafc)", cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      <div style={{ ...card, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Keresés (email/név)</label><input className="g2a-input" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%" }} /></div>
        <div><label style={lbl}>Forrás</label><select className="g2a-input" value={source} onChange={(e) => setSource(e.target.value)} style={{ width: "100%" }}><option value="">Mind</option>{sources.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
        <div><label style={lbl}>Sáv</label><select className="g2a-input" value={band} onChange={(e) => setBand(e.target.value)} style={{ width: "100%" }}><option value="">Mind</option>{bands.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
        <div><label style={lbl}>Min. checklista-pont</label><input className="g2a-input" type="number" value={minScore} onChange={(e) => setMinScore(e.target.value)} style={{ width: "100%" }} /></div>
        <div><label style={lbl}>Min. engagement</label><input className="g2a-input" type="number" value={minEng} onChange={(e) => setMinEng(e.target.value)} style={{ width: "100%" }} /></div>
        <div><label style={lbl}>Aktivitás</label><select className="g2a-input" value={recency} onChange={(e) => setRecency(e.target.value as typeof recency)} style={{ width: "100%" }}>
          <option value="">Bármikor</option>
          <option value="eng30">Megnyitott 30 napon belül</option>
          <option value="eng90">Megnyitott 90 napon belül</option>
          <option value="cold60">Inaktív 60+ napja</option>
          <option value="never">Sosem nyitott meg</option>
        </select></div>
        <div style={{ display: "flex", alignItems: "flex-end" }}><label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, cursor: "pointer" }}><input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />Csak aktív</label></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 15 }}><strong>{filtered.length}</strong> feliratkozó a szegmensben {isLoading && "· betöltés…"}</div>
        <button onClick={exportCsv} disabled={!filtered.length} style={{ fontSize: 13, padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--g2a-brand-teal, #14B8A6)", color: "#fff", fontWeight: 600, cursor: filtered.length ? "pointer" : "not-allowed", opacity: filtered.length ? 1 : 0.5 }}>CSV export ({filtered.length})</button>
      </div>

      <div style={{ ...card, padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--g2a-border, #e5e7eb)", color: "var(--g2a-text-muted, #6b7280)" }}>
              {["Email", "Név", "Forrás", "Sáv", "Pont", "Eng.", "Utolsó aktivitás", "Aktív"].map((h) => <th key={h} style={{ padding: "10px 12px", fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 500).map((s) => (
              <tr key={s.email} style={{ borderBottom: "1px solid var(--g2a-border, #f1f5f9)" }}>
                <td style={{ padding: "9px 12px" }}>{s.email}</td>
                <td style={{ padding: "9px 12px" }}>{s.name ?? "–"}</td>
                <td style={{ padding: "9px 12px" }}>{s.source ?? "–"}</td>
                <td style={{ padding: "9px 12px" }}>{s.band ?? "–"}</td>
                <td style={{ padding: "9px 12px" }}>{s.score ?? "–"}</td>
                <td style={{ padding: "9px 12px" }}>{s.engagementScore ?? 0}</td>
                <td style={{ padding: "9px 12px" }}>{s.lastEngagedAt ? new Date(s.lastEngagedAt).toLocaleDateString("hu-HU") : "–"}</td>
                <td style={{ padding: "9px 12px" }}>{s.isActive === false ? "✗" : "✓"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 500 && <div style={{ padding: "10px 12px", fontSize: 12, color: "var(--g2a-text-muted, #6b7280)" }}>Az első 500 sor látszik; a CSV a teljes szegmenst tartalmazza.</div>}
      </div>
    </div>
  );
}
