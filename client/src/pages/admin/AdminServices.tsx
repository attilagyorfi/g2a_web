import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Edit, X, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminServices() {
  const { data: services, refetch } = trpc.admin.services.list.useQuery();
  const updateMutation = trpc.admin.services.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Szolgáltatás mentve"); } });
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", shortDescription: "", heroTitle: "", heroSubtitle: "", heroImage: "", heroImageAlt: "", content: "", icon: "", metaTitle: "", metaDescription: "" });
  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };

  const startEdit = (s: NonNullable<typeof services>[0]) => {
    setEditing(s.id);
    setForm({ title: s.title || "", shortDescription: s.shortDescription || "", heroTitle: s.heroTitle || "", heroSubtitle: s.heroSubtitle || "", heroImage: s.heroImage || "", heroImageAlt: s.heroImageAlt || "", content: s.content || "", icon: s.icon || "", metaTitle: s.metaTitle || "", metaDescription: s.metaDescription || "" });
  };

  if (editing !== null) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex" }}><ArrowLeft size={20} /></button>
          <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Szolgáltatás szerkesztése</h1>
        </div>
        <form onSubmit={e => { e.preventDefault(); updateMutation.mutate({ id: editing, data: form }); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={ls}>Cím *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required style={is} /></div>
          <div><label style={ls}>Ikon (emoji)</label><input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={is} /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={ls}>Rövid leírás</label><textarea value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} style={{ ...is, resize: "vertical" }} rows={2} /></div>
          <div><label style={ls}>Hero cím</label><input value={form.heroTitle} onChange={e => setForm(p => ({ ...p, heroTitle: e.target.value }))} style={is} /></div>
          <div><label style={ls}>Hero alcím</label><input value={form.heroSubtitle} onChange={e => setForm(p => ({ ...p, heroSubtitle: e.target.value }))} style={is} /></div>
          <div><label style={ls}>Hero kép URL</label><input value={form.heroImage} onChange={e => setForm(p => ({ ...p, heroImage: e.target.value }))} style={is} /></div>
          <div><label style={ls}>Hero kép alt</label><input value={form.heroImageAlt} onChange={e => setForm(p => ({ ...p, heroImageAlt: e.target.value }))} style={is} /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={ls}>Tartalom (HTML/Markdown)</label><textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} style={{ ...is, resize: "vertical" }} rows={8} /></div>
          <div><label style={ls}>Meta cím (max 60 karakter)</label><input value={form.metaTitle} onChange={e => setForm(p => ({ ...p, metaTitle: e.target.value }))} style={is} maxLength={60} /><span style={{ color: "#666", fontSize: "0.75rem" }}>{form.metaTitle.length}/60</span></div>
          <div><label style={ls}>Meta leírás (max 160 karakter)</label><textarea value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))} style={{ ...is, resize: "vertical" }} rows={3} maxLength={160} /><span style={{ color: "#666", fontSize: "0.75rem" }}>{form.metaDescription.length}/160</span></div>
          <div style={{ gridColumn: "1/-1" }}>
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Check size={16} /> Mentés</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Szolgáltatások</h1>
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Ikon", "Cím", "Slug", "Műveletek"].map(h => <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Roboto Mono, monospace" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {(services || []).map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "0.875rem 1rem", fontSize: "1.25rem" }}>{s.icon}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#fff", fontSize: "0.875rem" }}>{s.title}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.875rem" }}>{s.slug}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <button onClick={() => startEdit(s)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Edit size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!services || services.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek szolgáltatások.</div>}
      </div>
    </div>
  );
}
