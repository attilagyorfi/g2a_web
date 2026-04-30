import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import LocalizedField from "@/components/LocalizedField";

type Form = {
  title: string; titleEn: string; titleZh: string;
  description: string; descriptionEn: string; descriptionZh: string;
  icon: string;
  sortOrder: number;
};

const EMPTY: Form = {
  title: "", titleEn: "", titleZh: "",
  description: "", descriptionEn: "", descriptionZh: "",
  icon: "",
  sortOrder: 0,
};

export default function AdminValues() {
  const confirm = useConfirm();
  const { data: items, refetch } = trpc.admin.values.list.useQuery();
  const createMutation = trpc.admin.values.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Létrehozva"); } });
  const updateMutation = trpc.admin.values.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Frissítve"); } });
  const deleteMutation = trpc.admin.values.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Törölve"); } });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Geist Mono, monospace" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Értékek / Accordion</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Új érték</button>
      </div>
      {showForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1rem" }}>{editing ? "Szerkesztés" : "Új érték"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <LocalizedField label="Cím" field="title" form={form} setForm={setForm} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={ls}>Ikon (emoji)</label><input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={is} placeholder="💡" /></div>
              <div><label style={ls}>Sorrend</label><input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} style={is} /></div>
            </div>
            <LocalizedField label="Leírás" field="description" form={form} setForm={setForm} type="textarea" rows={4} />
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}><Check size={16} /> Mentés</button>
          </form>
        </div>
      )}
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Ikon", "Cím", "Sorrend", "Fordítások", "Műveletek"].map(h => <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Geist Mono, monospace" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {(items || []).map(item => {
              const hasEn = !!(item.titleEn && item.titleEn.trim());
              const hasZh = !!(item.titleZh && item.titleZh.trim());
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "1.25rem" }}>{item.icon}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#fff", fontSize: "0.875rem" }}>{item.title}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.875rem" }}>{item.sortOrder}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "inline-flex", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: "#14B8A620", color: "var(--g2a-brand-teal)" }}>HU</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasEn ? "#14B8A620" : "#33333360", color: hasEn ? "#14B8A6" : "#555" }}>EN</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasZh ? "#14B8A620" : "#33333360", color: hasZh ? "#14B8A6" : "#555" }}>中文</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => {
                        setEditing(item.id);
                        setForm({
                          title: item.title,
                          titleEn: item.titleEn || "",
                          titleZh: item.titleZh || "",
                          description: item.description || "",
                          descriptionEn: item.descriptionEn || "",
                          descriptionZh: item.descriptionZh || "",
                          icon: item.icon || "",
                          sortOrder: item.sortOrder || 0,
                        });
                        setShowForm(true);
                      }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Edit size={15} /></button>
                      <button onClick={() => { (async () => { const ok = await confirm({ title: "Törlés megerősítése", message: "Biztosan?" }); if (ok) deleteMutation.mutate({ id: item.id }); })(); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!items || items.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek értékek.</div>}
      </div>
    </div>
  );
}
