/**
 * Email campaign composer + history view.
 *
 * - Compose: subject, HTML body, optional segment filter
 * - Live recipient counter via `estimateRecipients` query
 * - Test send (to admin's email) before real send
 * - Send to N recipients with confirm dialog
 * - Each campaign email auto-personalizes the {{unsubscribeUrl}} placeholder
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Send, TestTube2, Loader2, Sparkles, Mail, AlertTriangle, Users } from "lucide-react";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import { formatAdminDateTime } from "@/components/admin/formatDate";
import NewsletterVisualEditor from "@/components/admin/NewsletterVisualEditor";

const SEGMENTS = ["", "lead", "customer", "vip", "inactive", "prospect"];

const DEFAULT_HTML_TEMPLATE = `<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1f2937">
  <h1 style="font-size:22px;color:#0f172a;border-left:4px solid #14B8A6;padding-left:16px;margin-bottom:24px">Üdv!</h1>

  <p style="line-height:1.6;font-size:15px">Itt jön a hírlevél tartalma…</p>

  <p style="line-height:1.6;font-size:15px"><a href="https://g2amarketing.hu" style="color:#0d9488;text-decoration:underline">Olvasd tovább a g2amarketing.hu-n</a></p>

  <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb">
  <p style="font-size:11px;color:#9ca3af;line-height:1.5">
    G2A Marketing Bt. · Pécs · info@g2amarketing.hu<br>
    <a href="{{unsubscribeUrl}}" style="color:#9ca3af">Leiratkozás</a>
  </p>
</div>`;

export default function AdminNewsletterCampaigns() {
  const confirm = useConfirm();
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState(DEFAULT_HTML_TEMPLATE);
  const [segment, setSegment] = useState<string>("");
  const [testEmail, setTestEmail] = useState("");
  const [previewMode, setPreviewMode] = useState<"visual" | "code" | "preview">("visual");
  // Bumped whenever `html` is replaced from OUTSIDE the editor (AI rewrite,
  // post-send reset) so the visual editor remounts + re-seeds. It does NOT
  // change on normal typing, so the caret never jumps mid-edit.
  const [visualSeed, setVisualSeed] = useState(0);

  const aiStatus = trpc.admin.ai.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const recipientCountQ = trpc.admin.newsletter.estimateRecipients.useQuery({ segment: segment || null });
  const campaignList = trpc.admin.newsletter.campaignList.useQuery();

  const testMutation = trpc.admin.newsletter.sendTest.useMutation();
  const sendMutation = trpc.admin.newsletter.sendCampaign.useMutation();
  const improveMutation = trpc.admin.ai.improveText.useMutation();

  const handleTest = async () => {
    if (!testEmail.trim() || !subject.trim() || html.trim().length < 20) {
      toast.error("Tölts ki tárgyat, HTML body-t és test email címet.");
      return;
    }
    try {
      await testMutation.mutateAsync({ to: testEmail, subject, html });
      toast.success(`Teszt email kiküldve: ${testEmail}`);
    } catch (err) {
      toast.error(parseFormError(err, "Teszt küldés sikertelen"));
    }
  };

  const handleSend = async () => {
    const count = recipientCountQ.data?.count ?? 0;
    if (count === 0) { toast.error("Nincs címzett a kiválasztott szegmensben."); return; }
    if (!subject.trim() || html.trim().length < 20) { toast.error("Tölts ki tárgyat és HTML body-t."); return; }
    const ok = await confirm({
      title: "Kampány kiküldése",
      message: `Biztosan kiküldöd ennek a kampánynak: ${count} feliratkozó${segment ? ` (szegmens: ${segment})` : ""}?\n\nEz nem visszavonható.`,
      destructive: false,
      confirmLabel: "Küldés",
    });
    if (!ok) return;
    try {
      const result = await sendMutation.mutateAsync({ subject, html, segment: segment || null });
      toast.success(`Kampány kiküldve: ${result.sent} sikeres, ${result.failed} sikertelen / ${result.recipientCount} címzett`);
      campaignList.refetch();
      // Reset form
      setSubject("");
      setHtml(DEFAULT_HTML_TEMPLATE);
      setVisualSeed((s) => s + 1);
    } catch (err) {
      toast.error(parseFormError(err, "Kampány küldés sikertelen"));
    }
  };

  const handleAiImprove = async () => {
    if (html.trim().length < 50) { toast.error("Először írj egy alap szöveget."); return; }
    const ok = await confirm({ title: "Felülírás megerősítése", message: "A jelenlegi HTML body felülíródik (AI átfogalmazás). Folytatod?", destructive: false, confirmLabel: "Felülírás" });
    if (!ok) return;
    try {
      const { text } = await improveMutation.mutateAsync({ text: html, mode: "rephrase", lang: "hu" });
      setHtml(text);
      setVisualSeed((s) => s + 1);
      toast.success("AI átírás kész");
    } catch (err) {
      toast.error(parseFormError(err, "AI hiba"));
    }
  };

  const aiConfigured = aiStatus.data?.configured ?? false;

  const labelStyle: React.CSSProperties = { display: "block", color: "#888", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "Geist Mono, monospace" };
  const inputStyle: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "0.65rem 0.85rem", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>Email kampány</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 5, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.35)", color: "var(--g2a-brand-teal)", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem" }}>
            <Users size={13} />
            {recipientCountQ.data?.count ?? "…"} címzett
          </span>
        </div>
      </div>

      {/* Compose */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left: form */}
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Tárgy *</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} placeholder="pl. Új AI marketing trendek 2026 első negyedévében" maxLength={200} />
            <div style={{ marginTop: 4, fontSize: "0.65rem", color: subject.length > 60 ? "#ef4444" : "#666", fontFamily: "Geist Mono, monospace", textAlign: "right" }}>
              {subject.length} / 60 karakter (Gmail vágás)
            </div>
          </div>

          <div>
            <label style={labelStyle}>Címzett szegmens</label>
            <select value={segment} onChange={(e) => setSegment(e.target.value)} style={inputStyle}>
              <option value="">— Mindenki (aktív feliratkozók) —</option>
              {SEGMENTS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>HTML body *</label>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ display: "inline-flex", gap: 4 }}>
                  {([["visual", "Vizuális"], ["code", "Kód"], ["preview", "Előnézet"]] as const).map(([m, label]) => (
                    <button key={m} type="button" onClick={() => setPreviewMode(m)}
                      style={{ padding: "4px 10px", borderRadius: 4, background: previewMode === m ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.05)", border: `1px solid ${previewMode === m ? "rgba(20,184,166,0.5)" : "rgba(255,255,255,0.1)"}`, color: previewMode === m ? "#14B8A6" : "#aaa", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem" }}>
                      {label}
                    </button>
                  ))}
                </div>
                {aiConfigured && (
                  <button type="button" onClick={handleAiImprove} disabled={improveMutation.isPending}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 4, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", color: "#c084fc", cursor: improveMutation.isPending ? "wait" : "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem" }}>
                    {improveMutation.isPending ? <Loader2 size={11} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={11} />}
                    AI: javítás
                  </button>
                )}
              </div>
            </div>
            {previewMode === "visual" ? (
              <NewsletterVisualEditor key={visualSeed} html={html} onChange={setHtml} />
            ) : previewMode === "code" ? (
              <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={18} style={{ ...inputStyle, fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", lineHeight: 1.4, resize: "vertical" }} />
            ) : (
              <div style={{ height: 460, overflow: "auto", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, background: "#fff" }}>
                <iframe srcDoc={html.replace(/\{\{unsubscribeUrl\}\}/g, "#")} style={{ width: "100%", height: "100%", border: 0, background: "#fff" }} title="Preview" />
              </div>
            )}
            <p style={{ marginTop: 4, fontSize: "0.65rem", color: "#666", fontFamily: "Geist Mono, monospace" }}>
              Helyettesítés: <code style={{ color: "#c084fc" }}>{`{{unsubscribeUrl}}`}</code> → személyes leiratkozási URL minden címzett emailjében.
            </p>
          </div>
        </div>

        {/* Right: actions + preview meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#fbbf24" }}>
              <TestTube2 size={15} />
              <strong style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.85rem" }}>Teszt küldés</strong>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#888", marginBottom: 10, lineHeight: 1.5 }}>
              Mielőtt kiküldöd a teljes listának, küldj egy próbát saját címedre.
            </p>
            <input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} type="email" placeholder="info@g2amarketing.hu" style={{ ...inputStyle, marginBottom: 10 }} />
            <button type="button" onClick={handleTest} disabled={testMutation.isPending || !testEmail || !subject || html.length < 20}
              style={{ width: "100%", padding: "9px 14px", borderRadius: 5, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.5)", color: "#fbbf24", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {testMutation.isPending ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <TestTube2 size={13} />}
              {testMutation.isPending ? "Küldés..." : "Teszt küldése"}
            </button>
          </div>

          <div style={{ background: "#1a1a1a", border: "1px solid rgba(20,184,166,0.4)", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--g2a-brand-teal)" }}>
              <Send size={15} />
              <strong style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.85rem" }}>Élő küldés</strong>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#888", marginBottom: 10, lineHeight: 1.5 }}>
              {recipientCountQ.data?.count ?? 0} aktív feliratkozónak megy ki.
              {segment && <> Szegmens: <span style={{ color: "#fbbf24" }}>{segment}</span></>}
              <br />Időtartam: ~{Math.ceil((recipientCountQ.data?.count ?? 0) * 0.6)} mp (Resend rate limit miatt 600 ms / email).
            </p>
            <button type="button" onClick={handleSend} disabled={sendMutation.isPending || !subject || html.length < 20 || (recipientCountQ.data?.count ?? 0) === 0}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 5, background: sendMutation.isPending ? "rgba(20,184,166,0.3)" : "linear-gradient(135deg,#14B8A6,#0D9488)", border: "none", color: "#fff", cursor: sendMutation.isPending ? "wait" : "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.85rem", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {sendMutation.isPending ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Send size={14} />}
              {sendMutation.isPending ? "Küldés folyamatban..." : `Küldés ${recipientCountQ.data?.count ?? 0} címzettnek`}
            </button>
          </div>

          <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "#fca5a5", fontSize: "0.72rem", lineHeight: 1.5 }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                A küldés <strong>nem visszavonható</strong>. PROD: a <code>RESEND_FROM_EMAIL</code> mutasson hitelesített domain-re — különben Resend blokkolja a 100+ feletti küldéseket.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ marginTop: 32, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={14} style={{ color: "#888" }} />
          <h3 style={{ margin: 0, color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.85rem", fontWeight: 600 }}>
            Korábbi kampányok ({campaignList.data?.length ?? 0})
          </h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              {["Tárgy", "Szegmens", "Címzett", "Sikeres", "Hiba", "Status", "Küldve", "Stat"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Geist Mono, monospace", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(campaignList.data || []).map((c) => (
              <CampaignRow key={c.id} campaign={c} />
            ))}
            {(campaignList.data || []).length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#666", fontSize: "0.8rem" }}>Még nincs kiküldött kampány.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * One row of the campaign history table — splits into a summary line and a
 * collapsible stats panel that only fires the `campaignStats` query when
 * the user actually expands it (avoids N queries on initial render).
 */
type CampaignSummary = {
  id: number;
  subject: string;
  segment: string | null;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  sentAt: Date | string | null;
};

function CampaignRow({ campaign: c }: { campaign: CampaignSummary }) {
  const [expanded, setExpanded] = useState(false);
  const stats = trpc.admin.newsletter.campaignStats.useQuery(
    { campaignId: c.id },
    { enabled: expanded, staleTime: 30 * 1000 },
  );

  const recipientBase = c.sentCount > 0 ? c.sentCount : c.recipientCount;
  const pct = (n: number) =>
    recipientBase > 0 ? `${Math.round((n / recipientBase) * 100)}%` : "—";

  return (
    <>
      <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <td style={{ padding: "10px 14px", color: "#fff", fontSize: "0.78rem", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</td>
        <td style={{ padding: "10px 14px", color: "#888", fontSize: "0.72rem" }}>{c.segment || "—"}</td>
        <td style={{ padding: "10px 14px", color: "#aaa", fontSize: "0.78rem" }}>{c.recipientCount}</td>
        <td style={{ padding: "10px 14px", color: "var(--g2a-brand-teal)", fontSize: "0.78rem" }}>{c.sentCount}</td>
        <td style={{ padding: "10px 14px", color: c.failedCount > 0 ? "#ef4444" : "#666", fontSize: "0.78rem" }}>{c.failedCount}</td>
        <td style={{ padding: "10px 14px" }}>
          <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: "0.65rem", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em",
            background: c.status === "sent" ? "rgba(20,184,166,0.15)" : c.status === "failed" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
            color: c.status === "sent" ? "#14B8A6" : c.status === "failed" ? "#ef4444" : "#fbbf24",
          }}>{c.status}</span>
        </td>
        <td style={{ padding: "10px 14px", color: "#666", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
          {c.sentAt ? formatAdminDateTime(c.sentAt) : "—"}
        </td>
        <td style={{ padding: "10px 14px" }}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#aaa",
              padding: "3px 8px",
              borderRadius: 3,
              fontSize: "0.65rem",
              fontFamily: "Geist Mono, monospace",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {expanded ? "▲ rejt" : "▼ stat"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: "rgba(255,255,255,0.02)" }}>
          <td colSpan={8} style={{ padding: "12px 16px" }}>
            {stats.isLoading ? (
              <div style={{ color: "#888", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 8 }}>
                <Loader2 size={12} className="animate-spin" />
                Stat lekérése...
              </div>
            ) : stats.data ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                <StatBox label="Kézbesítve" value={stats.data.delivered} pct={pct(stats.data.delivered)} color="#14B8A6" />
                <StatBox label="Megnyitva" value={stats.data.opened} pct={pct(stats.data.opened)} color="#3b82f6" />
                <StatBox label="Kattintva" value={stats.data.clicked} pct={pct(stats.data.clicked)} color="#8b5cf6" />
                <StatBox label="Visszapattant" value={stats.data.bounced} pct={pct(stats.data.bounced)} color="#ef4444" />
                <StatBox label="Spam-jelölt" value={stats.data.complained} pct={pct(stats.data.complained)} color="#f59e0b" />
                <div
                  style={{
                    color: "#666",
                    fontSize: "0.7rem",
                    fontFamily: "Geist Mono, monospace",
                    alignSelf: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Az események a Resend webhook-tól érkeznek.
                  <br />
                  Ha 0 minden = a webhook nincs konfigurálva.
                </div>
              </div>
            ) : (
              <div style={{ color: "#888", fontSize: "0.78rem" }}>Stat nem elérhető.</div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function StatBox({ label, value, pct, color }: { label: string; value: number; pct: string; color: string }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 4,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div
        style={{
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#888",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, fontFamily: "Geist Mono, monospace" }}>{value}</span>
        <span style={{ color, fontSize: "0.7rem", fontFamily: "Geist Mono, monospace" }}>{pct}</span>
      </div>
    </div>
  );
}
