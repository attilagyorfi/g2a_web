import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminTestimonials() {
  const { data: items, refetch } = trpc.admin.testimonials.list.useQuery();
  const createMutation = trpc.admin.testimonials.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Vélemény létrehozva"); } });
  const updateMutation = trpc.admin.testimonials.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Vélemény frissítve"); } });
  const deleteMutation = trpc.admin.testimonials.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Vélemény törölve"); } });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ quote: "", authorName: "", authorTitle: "", authorCompany: "", authorImage: "", authorImageAlt: "", sortOrder: 0 });
  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Vélemények</h1>
        <button onClick={() => { setForm({ quote: "", authorName: "", authorTitle: "", authorCompany: "", authorImage: "", authorImageAlt: "", sortOrder: 0 }); setEditing(null); setShowForm(true); }} className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Új vélemény</button>
      </div>
      {showForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1rem" }}>{editing ? "Szerkesztés" : "Új vélemény"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form); }}>
            <div style={{ marginBottom: "1rem" }}><label style={ls}>Idézet *</label><textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} required style={{ ...is, resize: "vertical" }} rows={4} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={ls}>Szerző neve *</label><input value={form.authorName} onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))} required style={is} /></div>
              <div><label style={ls}>Beosztás</label><input value={form.authorTitle} onChange={e => setForm(p => ({ ...p, authorTitle: e.target.value }))} style={is} /></div>
              <div><label style={ls}>Cég</label><input value={form.authorCompany} onChange={e => setForm(p => ({ ...p, authorCompany: e.target.value }))} style={is} /></div>
              <div><label style={ls}>Sorrend</label><input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} style={is} /></div>
              <div><label style={ls}>Profilkép URL</label><input value={form.authorImage} onChange={e => setForm(p => ({ ...p, authorImage: e.target.value }))} style={is} /></div>
              <div><label style={ls}>Profilkép alt</label><input value={form.authorImageAlt} onChange={e => setForm(p => ({ ...p, authorImageAlt: e.target.value }))} style={is} /></div>
            </div>
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}><Check size={16} /> Mentés</button>
          </form>
        </div>
      )}
      <div style={{ display: "grid", gap: "1rem" }}>
        {(items || []).map(item => (
          <div key={item.id} style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#ccc", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", marginBottom: "0.75rem", lineHeight: 1.6, fontStyle: "italic" }}>"{item.quote}"</p>
                <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>{item.authorName}</p>
                {(item.authorTitle || item.authorCompany) && <p style={{ color: "#888", fontSize: "0.8rem" }}>{[item.authorTitle, item.authorCompany].filter(Boolean).join(" – ")}</p>}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                <button onClick={() => { setEditing(item.id); setForm({ quote: item.quote, authorName: item.authorName, authorTitle: item.authorTitle || "", authorCompany: item.authorCompany || "", authorImage: item.authorImage || "", authorImageAlt: item.authorImageAlt || "", sortOrder: item.sortOrder || 0 }); setShowForm(true); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Edit size={15} /></button>
                <button onClick={() => { if (confirm("Biztosan törli?")) deleteMutation.mutate({ id: item.id }); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {(!items || items.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>Nincsenek vélemények.</div>}
      </div>
    </div>
  );
}
