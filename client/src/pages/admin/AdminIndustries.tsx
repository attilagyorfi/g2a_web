import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
export default function AdminIndustries() {
  const { data: items, refetch } = trpc.admin.industries.list.useQuery();
  const createMutation = trpc.admin.industries.create.useMutation({ onSuccess: () => { refetch(); setShowForm(false); toast.success("Létrehozva"); } });
  const updateMutation = trpc.admin.industries.update.useMutation({ onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Frissítve"); } });
  const deleteMutation = trpc.admin.industries.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Törölve"); } });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", description: "", sortOrder: 0 });
  const inputStyle = { width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", padding: "0.75rem 1rem", color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", color: "#888", fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem", fontFamily: "Roboto Mono, monospace" };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700 }}>Iparágak</h1>
        <button onClick={() => { setForm({ name: "", slug: "", icon: "", description: "", sortOrder: 0 }); setEditing(null); setShowForm(true); }} className="g2a-btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Új iparág</button>
      </div>
      {showForm && (
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1rem" }}>{editing ? "Szerkesztés" : "Új iparág"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form); }}>
            <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Név *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={inputStyle} /></div>
            <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Slug *</label><input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} required style={inputStyle} placeholder="url-slug" /></div>
            <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Ikon (emoji)</label><input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={inputStyle} placeholder="🏭" /></div>
            <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Leírás</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} rows={2} /></div>
            <div style={{ marginBottom: "1rem" }}><label style={labelStyle}>Sorrend</label><input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} style={inputStyle} /></div>
            <button type="submit" className="g2a-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Check size={16} /> Mentés</button>
          </form>
        </div>
      )}
      <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{["Ikon","Név","Sorrend","Műveletek"].map(h=><th key={h} style={{ padding:"0.875rem 1rem",textAlign:"left",color:"#666",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:"Roboto Mono, monospace" }}>{h}</th>)}</tr></thead>
          <tbody>{(items||[]).map(item=>(
            <tr key={item.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding:"0.875rem 1rem",fontSize:"1.25rem" }}>{item.icon}</td>
              <td style={{ padding:"0.875rem 1rem",color:"#fff",fontSize:"0.875rem" }}>{item.name}</td>
              <td style={{ padding:"0.875rem 1rem",color:"#888",fontSize:"0.875rem" }}>{item.sortOrder}</td>
              <td style={{ padding:"0.875rem 1rem" }}><div style={{ display:"flex",gap:"0.5rem" }}>
                <button onClick={()=>{ setEditing(item.id); setForm({name:item.name,slug:item.slug||"",icon:item.icon||"",description:item.description||"",sortOrder:item.sortOrder||0}); setShowForm(true); }} style={{ background:"none",border:"none",color:"#888",cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color="#888")}><Edit size={15}/></button>
                <button onClick={()=>{ if(confirm("Biztosan törli?")) deleteMutation.mutate({id:item.id}); }} style={{ background:"none",border:"none",color:"#888",cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget.style.color="#e91130")} onMouseLeave={e=>(e.currentTarget.style.color="#888")}><Trash2 size={15}/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
        {(!items||items.length===0)&&<div style={{ padding:"3rem",textAlign:"center",color:"#666" }}>Nincsenek iparágak.</div>}
      </div>
    </div>
  );
}
