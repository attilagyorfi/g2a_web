import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { useBulkSelection } from "@/components/admin/useBulkSelection";
import BulkActionBar, { BulkSelectAllCheckbox, BulkSelectCheckbox } from "@/components/admin/BulkActionBar";
import ImageUploader from "@/components/ImageUploader";
import LocalizedField from "@/components/LocalizedField";

type Form = {
  name: string;
  slug: string;
  logo: string;
  logoAlt: string;
  website: string;
  description: string; descriptionEn: string; descriptionZh: string;
  sortOrder: number;
};

const EMPTY: Form = {
  name: "", slug: "", logo: "", logoAlt: "", website: "",
  description: "", descriptionEn: "", descriptionZh: "",
  sortOrder: 0,
};

export default function AdminPartners() {
  const confirm = useConfirm();
  const { data: items, refetch } = trpc.admin.partners.list.useQuery();
  const createMutation = trpc.admin.partners.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Partner létrehozva"); } });
  const updateMutation = trpc.admin.partners.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Partner frissítve"); } });
  const deleteMutation = trpc.admin.partners.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Partner törölve"); } });
  const deleteManyMutation = trpc.admin.partners.deleteMany.useMutation({
    onSuccess: (n) => { refetch(); toast.success(`${n} partner törölve`); selection.clear(); },
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const selection = useBulkSelection<number>((items || []).map((i: any) => i.id));
  const handleBulkDelete = async () => {
    const ok = await confirm({ title: "Tömeges törlés", message: `Biztosan törlöd a kiválasztott ${selection.count} partnert?` });
    if (ok) deleteManyMutation.mutate({ ids: selection.ids });
  };
  const is = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const ls = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Geist Mono, monospace" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Partnerek</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Új partner</button>
      </div>
      {showForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1rem" }}>{editing ? "Szerkesztés" : "Új partner"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={ls}>Név * (nem fordítjuk — tulajdonnév)</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={is} /></div>
              <div><label style={ls}>Slug</label><input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={is} /></div>
            </div>
            <ImageUploader
              value={form.logo}
              altValue={form.logoAlt}
              onChange={(url) => setForm(p => ({ ...p, logo: url }))}
              onAltChange={(alt) => setForm(p => ({ ...p, logoAlt: alt }))}
              label="Logo kép"
              placeholder="Logo URL vagy feltöltés"
            />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div><label style={ls}>Weboldal</label><input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} style={is} placeholder="https://..." /></div>
              <div><label style={ls}>Sorrend</label><input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} style={is} /></div>
            </div>
            <LocalizedField label="Leírás" field="description" form={form} setForm={setForm} type="textarea" rows={2} />
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}><Check size={16} /> Mentés</button>
          </form>
        </div>
      )}
      <BulkActionBar count={selection.count} itemLabel="kiválasztott partner" onClear={selection.clear} onDelete={handleBulkDelete} deleting={deleteManyMutation.isPending} />
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <th style={{ padding: "0.875rem 0 0.875rem 1rem", width: 36 }}>
              <BulkSelectAllCheckbox allSelected={selection.allSelected} someSelected={selection.someSelected} onToggle={selection.toggleAll} />
            </th>
            {["Logo", "Név", "Weboldal", "Sorrend", "Leírás fordítva", "Műveletek"].map(h => <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Geist Mono, monospace" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {(items || []).map(item => {
              const hasEn = !!(item.descriptionEn && item.descriptionEn.trim());
              const hasZh = !!(item.descriptionZh && item.descriptionZh.trim());
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: selection.isSelected(item.id) ? "rgba(20,184,166,0.06)" : undefined }}>
                  <td style={{ padding: "0.875rem 0 0.875rem 1rem" }}>
                    <BulkSelectCheckbox checked={selection.isSelected(item.id)} onToggle={() => selection.toggle(item.id)} />
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>{item.logo && <img src={item.logo} alt={item.logoAlt || item.name} style={{ height: "32px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>{item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--g2a-brand-teal)", fontSize: "0.8rem", textDecoration: "none" }}>{item.website}</a>}</td>
                  <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.875rem" }}>{item.sortOrder}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "inline-flex", gap: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: item.description ? "#14B8A620" : "#33333360", color: item.description ? "#14B8A6" : "#555" }}>HU</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasEn ? "#14B8A620" : "#33333360", color: hasEn ? "#14B8A6" : "#555" }}>EN</span>
                      <span style={{ padding: "2px 6px", borderRadius: 3, background: hasZh ? "#14B8A620" : "#33333360", color: hasZh ? "#14B8A6" : "#555" }}>中文</span>
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => {
                        setEditing(item.id);
                        setForm({
                          name: item.name,
                          slug: item.slug || "",
                          logo: item.logo || "",
                          logoAlt: item.logoAlt || "",
                          website: item.website || "",
                          description: item.description || "",
                          descriptionEn: item.descriptionEn || "",
                          descriptionZh: item.descriptionZh || "",
                          sortOrder: item.sortOrder || 0,
                        });
                        setShowForm(true);
                      }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Edit size={15} /></button>
                      <button onClick={() => { (async () => { const ok = await confirm({ title: "Törlés megerősítése", message: "Biztosan törli ezt a partnert?" }); if (ok) deleteMutation.mutate({ id: item.id }); })(); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!items || items.length === 0) && <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek partnerek.</div>}
      </div>
    </div>
  );
}
