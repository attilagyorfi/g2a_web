import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { useBulkSelection } from "@/components/admin/useBulkSelection";
import BulkActionBar, { BulkSelectAllCheckbox, BulkSelectCheckbox } from "@/components/admin/BulkActionBar";
import LocalizedField from "@/components/LocalizedField";

type Form = {
  quote: string; quoteEn: string; quoteZh: string;
  authorName: string;
  authorTitle: string; authorTitleEn: string; authorTitleZh: string;
  authorCompany: string;
  authorImage: string;
  authorImageAlt: string;
  sortOrder: number;
};

const EMPTY: Form = {
  quote: "", quoteEn: "", quoteZh: "",
  authorName: "",
  authorTitle: "", authorTitleEn: "", authorTitleZh: "",
  authorCompany: "",
  authorImage: "",
  authorImageAlt: "",
  sortOrder: 0,
};

export default function AdminTestimonials() {
  const confirm = useConfirm();
  const { data: items, refetch } = trpc.admin.testimonials.list.useQuery();
  const createMutation = trpc.admin.testimonials.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Vélemény létrehozva"); } });
  const updateMutation = trpc.admin.testimonials.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Vélemény frissítve"); } });
  const deleteMutation = trpc.admin.testimonials.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Vélemény törölve"); } });
  const deleteManyMutation = trpc.admin.testimonials.deleteMany.useMutation({
    onSuccess: (n) => { refetch(); toast.success(`${n} vélemény törölve`); selection.clear(); },
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const selection = useBulkSelection<number>((items || []).map((i: any) => i.id));
  const handleBulkDelete = async () => {
    const ok = await confirm({ title: "Tömeges törlés", message: `Biztosan törlöd a kiválasztott ${selection.count} véleményt?` });
    if (ok) deleteManyMutation.mutate({ ids: selection.ids });
  };
  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Geist Mono, monospace" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Vélemények</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Új vélemény</button>
      </div>
      {showForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1rem" }}>{editing ? "Szerkesztés" : "Új vélemény"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <LocalizedField label="Idézet" field="quote" form={form} setForm={setForm} type="textarea" rows={4} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={ls}>Szerző neve *</label><input value={form.authorName} onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))} required style={is} /></div>
              <div><label style={ls}>Cég</label><input value={form.authorCompany} onChange={e => setForm(p => ({ ...p, authorCompany: e.target.value }))} style={is} /></div>
            </div>
            <LocalizedField label="Beosztás" field="authorTitle" form={form} setForm={setForm} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={ls}>Profilkép URL</label><input value={form.authorImage} onChange={e => setForm(p => ({ ...p, authorImage: e.target.value }))} style={is} /></div>
              <div><label style={ls}>Profilkép alt</label><input value={form.authorImageAlt} onChange={e => setForm(p => ({ ...p, authorImageAlt: e.target.value }))} style={is} /></div>
            </div>
            <div style={{ width: 200 }}><label style={ls}>Sorrend</label><input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} style={is} /></div>
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}><Check size={16} /> Mentés</button>
          </form>
        </div>
      )}
      <div style={{ display: "grid", gap: "1rem" }}>
        {(items || []).map(item => {
          const hasEn = !!(item.quoteEn && item.quoteEn.trim());
          const hasZh = !!(item.quoteZh && item.quoteZh.trim());
          return (
            <div key={item.id} style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#ccc", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", marginBottom: "0.75rem", lineHeight: 1.6, fontStyle: "italic" }}>"{item.quote}"</p>
                  <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>{item.authorName}</p>
                  {(item.authorTitle || item.authorCompany) && <p style={{ color: "#888", fontSize: "0.8rem" }}>{[item.authorTitle, item.authorCompany].filter(Boolean).join(" – ")}</p>}
                  <div style={{ display: "inline-flex", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", marginTop: 8 }}>
                    <span style={{ padding: "2px 6px", borderRadius: 3, background: "#14B8A620", color: "var(--g2a-brand-teal)" }}>HU</span>
                    <span style={{ padding: "2px 6px", borderRadius: 3, background: hasEn ? "#14B8A620" : "#33333360", color: hasEn ? "#14B8A6" : "#555" }}>EN</span>
                    <span style={{ padding: "2px 6px", borderRadius: 3, background: hasZh ? "#14B8A620" : "#33333360", color: hasZh ? "#14B8A6" : "#555" }}>中文</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                  <button onClick={() => {
                    setEditing(item.id);
                    setForm({
                      quote: item.quote,
                      quoteEn: item.quoteEn || "",
                      quoteZh: item.quoteZh || "",
                      authorName: item.authorName,
                      authorTitle: item.authorTitle || "",
                      authorTitleEn: item.authorTitleEn || "",
                      authorTitleZh: item.authorTitleZh || "",
                      authorCompany: item.authorCompany || "",
                      authorImage: item.authorImage || "",
                      authorImageAlt: item.authorImageAlt || "",
                      sortOrder: item.sortOrder || 0,
                    });
                    setShowForm(true);
                  }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Edit size={15} /></button>
                  <button onClick={() => { (async () => { const ok = await confirm({ title: "Törlés megerősítése", message: "Biztosan törli?" }); if (ok) deleteMutation.mutate({ id: item.id }); })(); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {(!items || items.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>Nincsenek vélemények.</div>}
      </div>
    </div>
  );
}
