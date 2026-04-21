import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Trash2, Mail, Tag, Check, X } from "lucide-react";
import { toast } from "sonner";

const SEGMENTS = ["", "lead", "customer", "vip", "inactive", "prospect"];
const SOURCES = ["", "website", "audit_form", "blog", "social", "referral", "other"];

export default function AdminNewsletter() {
  const { data: subscribers, refetch } = trpc.admin.newsletter.list.useQuery();
  const deleteMutation = trpc.admin.newsletter.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Feliratkozó törölve"); },
  });
  const updateSegmentMutation = trpc.admin.newsletter.updateSegment.useMutation({
    onSuccess: () => { refetch(); toast.success("Szegmens frissítve"); },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ segment: "", source: "", tags: "" });
  const [filterSegment, setFilterSegment] = useState("");

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setEditForm({ segment: sub.segment || "", source: sub.source || "", tags: sub.tags || "" });
  };

  const saveEdit = (id: number) => {
    updateSegmentMutation.mutate({ id, ...editForm });
    setEditingId(null);
  };

  const filteredSubs = (subscribers || []).filter((s: any) =>
    filterSegment === "" ? true : (s.segment || "") === filterSegment
  );

  const segmentCounts = (subscribers || []).reduce((acc: Record<string, number>, s: any) => {
    const seg = s.segment || "nincs";
    acc[seg] = (acc[seg] || 0) + 1;
    return acc;
  }, {});

  const is: React.CSSProperties = {
    backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px",
    padding: "0.3rem 0.5rem", color: "#fff", fontSize: "0.8rem",
    fontFamily: "JetBrains Mono, monospace", outline: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "JetBrains Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Hírlevél feliratkozók</h1>
        <div style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "6px", padding: "0.5rem 1rem", color: "var(--g2a-amber)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.875rem" }}>
          {subscribers?.length || 0} feliratkozó
        </div>
      </div>

      {Object.keys(segmentCounts).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button onClick={() => setFilterSegment("")} style={{ backgroundColor: filterSegment === "" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${filterSegment === "" ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", padding: "0.25rem 0.75rem", color: filterSegment === "" ? "var(--g2a-amber)" : "#888", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", cursor: "pointer" }}>
            Összes ({subscribers?.length || 0})
          </button>
          {Object.entries(segmentCounts).map(([seg, count]) => (
            <button key={seg} onClick={() => setFilterSegment(seg === "nincs" ? "" : seg)} style={{ backgroundColor: filterSegment === seg ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${filterSegment === seg ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", padding: "0.25rem 0.75rem", color: filterSegment === seg ? "var(--g2a-amber)" : "#888", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", cursor: "pointer" }}>
              {seg} ({count as number})
            </button>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Email", "Név", "Szegmens", "Forrás", "Tagek", "Feliratkozás", ""].map(h => (
                  <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((sub: any) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Mail size={14} color="var(--g2a-amber)" />
                      <span style={{ color: "#fff", fontSize: "0.875rem", fontFamily: "JetBrains Mono, monospace" }}>{sub.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.875rem" }}>{sub.name || "–"}</td>

                  {editingId === sub.id ? (
                    <>
                      <td style={{ padding: "0.5rem 1rem" }}>
                        <select value={editForm.segment} onChange={e => setEditForm(p => ({ ...p, segment: e.target.value }))} style={is}>
                          {SEGMENTS.map(s => <option key={s} value={s}>{s || "–"}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "0.5rem 1rem" }}>
                        <select value={editForm.source} onChange={e => setEditForm(p => ({ ...p, source: e.target.value }))} style={is}>
                          {SOURCES.map(s => <option key={s} value={s}>{s || "–"}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "0.5rem 1rem" }}>
                        <input value={editForm.tags} onChange={e => setEditForm(p => ({ ...p, tags: e.target.value }))} style={{ ...is, width: "120px" }} placeholder="tag1,tag2" />
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        {sub.segment ? (
                          <span style={{ backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "4px", padding: "0.15rem 0.5rem", color: "var(--g2a-amber)", fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace" }}>{sub.segment}</span>
                        ) : <span style={{ color: "#555", fontSize: "0.8rem" }}>–</span>}
                      </td>
                      <td style={{ padding: "0.875rem 1rem", color: "#666", fontSize: "0.8rem" }}>{sub.source || "–"}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        {sub.tags ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                            {sub.tags.split(",").map((t: string) => t.trim()).filter(Boolean).map((tag: string, i: number) => (
                              <span key={i} style={{ backgroundColor: "rgba(255,255,255,0.07)", borderRadius: "3px", padding: "0.1rem 0.4rem", color: "#888", fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace" }}>{tag}</span>
                            ))}
                          </div>
                        ) : <span style={{ color: "#555", fontSize: "0.8rem" }}>–</span>}
                      </td>
                    </>
                  )}

                  <td style={{ padding: "0.875rem 1rem", color: "#666", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {new Date(sub.createdAt).toLocaleDateString("hu-HU")}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {editingId === sub.id ? (
                        <>
                          <button onClick={() => saveEdit(sub.id)} style={{ background: "none", border: "none", color: "var(--g2a-amber)", cursor: "pointer" }}><Check size={15} /></button>
                          <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={15} /></button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(sub)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} title="Szegmens szerkesztése"><Tag size={14} /></button>
                      )}
                      <button onClick={() => { if (confirm("Biztosan törli ezt a feliratkozót?")) deleteMutation.mutate({ id: sub.id }); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} title="Törlés"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!filteredSubs || filteredSubs.length === 0) && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek feliratkozók.</div>
        )}
      </div>

      <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "6px", color: "#666", fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace" }}>
        Szegmensek: lead, customer, vip, inactive, prospect | Forrás: website, audit_form, blog, social, referral
      </div>
    </div>
  );
}
