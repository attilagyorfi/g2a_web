import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import { Plus, Trash2, Pencil, X, Mail, Phone, FileText, Briefcase } from "lucide-react";
import { formatAdminDateTime } from "@/components/admin/formatDate";
import { areaLabels } from "@shared/careerAreas";

type PositionForm = {
  titleHu: string; titleEn: string; titleZh: string;
  descHu: string; descEn: string; descZh: string;
  location: string; employmentType: string;
  isActive: boolean; sortOrder: number;
};

const EMPTY_POSITION: PositionForm = {
  titleHu: "", titleEn: "", titleZh: "", descHu: "", descEn: "", descZh: "",
  location: "", employmentType: "", isActive: true, sortOrder: 0,
};

const STATUS_LABELS: Record<string, string> = { new: "Új", reviewed: "Átnézve", archived: "Archív" };

export default function AdminCareers() {
  const utils = trpc.useUtils();
  const confirm = useConfirm();

  const { data: positions = [], isLoading: posLoading } = trpc.admin.careers.listPositions.useQuery();
  const { data: applications = [], isLoading: appLoading } = trpc.admin.careers.listApplications.useQuery();

  const [form, setForm] = useState<PositionForm>(EMPTY_POSITION);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const invalidatePositions = () => utils.admin.careers.listPositions.invalidate();
  const invalidateApps = () => utils.admin.careers.listApplications.invalidate();

  const createPos = trpc.admin.careers.createPosition.useMutation({
    onSuccess: () => { toast.success("Pozíció létrehozva"); invalidatePositions(); resetForm(); },
    onError: (e) => toast.error(parseFormError(e)),
  });
  const updatePos = trpc.admin.careers.updatePosition.useMutation({
    onSuccess: () => { toast.success("Pozíció frissítve"); invalidatePositions(); resetForm(); },
    onError: (e) => toast.error(parseFormError(e)),
  });
  const deletePos = trpc.admin.careers.deletePosition.useMutation({
    onSuccess: () => { toast.success("Pozíció törölve"); invalidatePositions(); },
    onError: (e) => toast.error(parseFormError(e)),
  });
  const setStatus = trpc.admin.careers.updateApplicationStatus.useMutation({
    onSuccess: () => invalidateApps(),
    onError: (e) => toast.error(parseFormError(e)),
  });
  const deleteApp = trpc.admin.careers.deleteApplication.useMutation({
    onSuccess: () => { toast.success("Jelentkezés törölve"); invalidateApps(); },
    onError: (e) => toast.error(parseFormError(e)),
  });

  function resetForm() {
    setForm(EMPTY_POSITION);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(p: any) {
    setForm({
      titleHu: p.titleHu ?? "", titleEn: p.titleEn ?? "", titleZh: p.titleZh ?? "",
      descHu: p.descHu ?? "", descEn: p.descEn ?? "", descZh: p.descZh ?? "",
      location: p.location ?? "", employmentType: p.employmentType ?? "",
      isActive: p.isActive !== false, sortOrder: p.sortOrder ?? 0,
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titleHu.trim()) { toast.error("A magyar cím kötelező"); return; }
    const data = {
      titleHu: form.titleHu.trim(),
      titleEn: form.titleEn.trim() || undefined,
      titleZh: form.titleZh.trim() || undefined,
      descHu: form.descHu.trim() || undefined,
      descEn: form.descEn.trim() || undefined,
      descZh: form.descZh.trim() || undefined,
      location: form.location.trim() || undefined,
      employmentType: form.employmentType.trim() || undefined,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    };
    if (editingId) updatePos.mutate({ id: editingId, data });
    else createPos.mutate(data);
  }

  async function removePosition(id: number) {
    const ok = await confirm({ title: "Pozíció törlése", message: "Biztosan törlöd ezt a pozíciót?" });
    if (ok) deletePos.mutate({ id });
  }
  async function removeApplication(id: number) {
    const ok = await confirm({ title: "Jelentkezés törlése", message: "Biztosan törlöd? Ez nem visszavonható." });
    if (ok) deleteApp.mutate({ id });
  }

  const input: React.CSSProperties = { width: "100%" };
  const label: React.CSSProperties = { fontSize: "0.75rem", color: "var(--g2a-text-muted)", marginBottom: "0.3rem", display: "block" };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--g2a-text)" }}>Karrier</h1>
        <p style={{ color: "var(--g2a-text-muted)", marginTop: "0.5rem" }}>
          {positions.length} pozíció · {applications.length} jelentkezés
          {applications.filter((a: any) => a.status === "new").length > 0 && ` · ${applications.filter((a: any) => a.status === "new").length} új`}
        </p>
      </div>

      {/* ── Positions ─────────────────────────────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Briefcase size={18} /> Meghirdetett pozíciók
          </h2>
          {!showForm && (
            <button className="g2a-btn-primary" onClick={() => { setForm(EMPTY_POSITION); setEditingId(null); setShowForm(true); }}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Plus size={16} /> Új pozíció
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={submitForm} style={{ background: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--g2a-text)" }}>{editingId ? "Pozíció szerkesztése" : "Új pozíció"}</h3>
              <button type="button" onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--g2a-text-muted)" }}><X size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div><label style={label}>Cím (HU) *</label><input className="g2a-input" style={input} value={form.titleHu} onChange={(e) => setForm({ ...form, titleHu: e.target.value })} required /></div>
              <div><label style={label}>Cím (EN)</label><input className="g2a-input" style={input} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></div>
              <div><label style={label}>Cím (ZH)</label><input className="g2a-input" style={input} value={form.titleZh} onChange={(e) => setForm({ ...form, titleZh: e.target.value })} /></div>
              <div><label style={label}>Helyszín</label><input className="g2a-input" style={input} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Pécs / hibrid" /></div>
              <div><label style={label}>Foglalkoztatás</label><input className="g2a-input" style={input} value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} placeholder="Teljes munkaidő" /></div>
              <div><label style={label}>Sorrend</label><input type="number" className="g2a-input" style={input} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div><label style={label}>Leírás (HU)</label><textarea className="g2a-input" style={{ ...input, resize: "vertical" }} rows={3} value={form.descHu} onChange={(e) => setForm({ ...form, descHu: e.target.value })} /></div>
              <div><label style={label}>Leírás (EN)</label><textarea className="g2a-input" style={{ ...input, resize: "vertical" }} rows={3} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} /></div>
              <div><label style={label}>Leírás (ZH)</label><textarea className="g2a-input" style={{ ...input, resize: "vertical" }} rows={3} value={form.descZh} onChange={(e) => setForm({ ...form, descZh: e.target.value })} /></div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", cursor: "pointer", color: "var(--g2a-text-secondary)", fontSize: "0.85rem" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: "var(--g2a-brand-teal)" }} />
              Aktív (megjelenik a karrier oldalon)
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" className="g2a-btn-primary" disabled={createPos.isPending || updatePos.isPending}>{editingId ? "Mentés" : "Létrehozás"}</button>
              <button type="button" className="g2a-btn-secondary" onClick={resetForm}>Mégse</button>
            </div>
          </form>
        )}

        {posLoading ? (
          <p style={{ color: "var(--g2a-text-muted)" }}>Betöltés…</p>
        ) : positions.length === 0 ? (
          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.9rem" }}>Nincs meghirdetett pozíció. A karrier oldal a „spontán jelentkezés" nézetet mutatja — a jelentkezés így is működik.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {positions.map((p: any) => (
              <div key={p.id} style={{ background: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--g2a-text)" }}>{p.titleHu}
                    {!p.isActive && <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "var(--g2a-text-muted)", border: "1px solid var(--g2a-border)", borderRadius: 4, padding: "1px 6px" }}>inaktív</span>}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", marginTop: "0.2rem" }}>
                    {[p.location, p.employmentType].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} title="Szerkesztés" style={{ background: "none", border: "1px solid var(--g2a-border)", borderRadius: 6, padding: "0.4rem", cursor: "pointer", color: "var(--g2a-text-secondary)" }}><Pencil size={15} /></button>
                  <button onClick={() => removePosition(p.id)} title="Törlés" style={{ background: "none", border: "1px solid var(--g2a-border)", borderRadius: 6, padding: "0.4rem", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Applications ──────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={18} /> Jelentkezések
        </h2>
        {appLoading ? (
          <p style={{ color: "var(--g2a-text-muted)" }}>Betöltés…</p>
        ) : applications.length === 0 ? (
          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.9rem" }}>Még nincs jelentkezés.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {applications.map((a: any) => (
              <div key={a.id} style={{ background: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)", borderRadius: 10, padding: "1.1rem 1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--g2a-text)" }}>{a.name}</div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.82rem", color: "var(--g2a-text-muted)", marginTop: "0.3rem" }}>
                      <a href={`mailto:${a.email}`} style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--g2a-text-secondary)", textDecoration: "none" }}><Mail size={13} /> {a.email}</a>
                      {a.phone && <a href={`tel:${a.phone}`} style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--g2a-text-secondary)", textDecoration: "none" }}><Phone size={13} /> {a.phone}</a>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                    <select value={a.status} onChange={(e) => setStatus.mutate({ id: a.id, status: e.target.value as "new" | "reviewed" | "archived" })}
                      className="g2a-input" style={{ padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <button onClick={() => removeApplication(a.id)} title="Törlés" style={{ background: "none", border: "1px solid var(--g2a-border)", borderRadius: 6, padding: "0.4rem", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                  </div>
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--g2a-text-secondary)", lineHeight: 1.6 }}>
                  <div><strong>Pozíció:</strong> {a.positionTitle || "Spontán jelentkezés"}</div>
                  {a.areas && <div><strong>Területek:</strong> {areaLabels(String(a.areas).split(","), "hu").join(", ")}</div>}
                  <div><strong>CV:</strong> {a.cvFilename ? `${a.cvFilename} (az info@ postafiókban, csatolmányként)` : "nincs csatolva"}</div>
                  {a.message && <div style={{ marginTop: "0.4rem", whiteSpace: "pre-wrap" }}><strong>Üzenet:</strong> {a.message}</div>}
                  <div style={{ marginTop: "0.4rem", color: "var(--g2a-text-muted)", fontSize: "0.78rem" }}>{formatAdminDateTime(a.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
