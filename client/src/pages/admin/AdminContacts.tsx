import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Mail, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminContacts() {
  const { data: contacts, refetch } = trpc.admin.contacts.list.useQuery();
  const markReadMutation = trpc.admin.contacts.markRead.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.admin.contacts.delete.useMutation({ onSuccess: () => { refetch(); setSelected(null); toast.success("Üzenet törölve"); } });
  const [selected, setSelected] = useState<number | null>(null);
  const selectedContact = contacts?.find(c => c.id === selected);

  return (
    <div>
      <h1 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Kapcsolatfelvételek</h1>
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
        {/* List */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
          {(contacts || []).length === 0 && <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Nincsenek üzenetek.</div>}
          {(contacts || []).map(c => (
            <div key={c.id} onClick={() => { setSelected(c.id); if (!c.isRead) markReadMutation.mutate({ id: c.id }); }} style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", backgroundColor: selected === c.id ? "rgba(233,17,48,0.08)" : "transparent", transition: "background 0.15s" }} onMouseEnter={e => { if (selected !== c.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { if (selected !== c.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {!c.isRead && <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#e91130", flexShrink: 0 }} />}
                {c.isRead && <span style={{ width: "8px", height: "8px", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: c.isRead ? "#aaa" : "#fff", fontWeight: c.isRead ? 400 : 700, fontSize: "0.875rem", fontFamily: "Roboto Mono, monospace", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                  <p style={{ color: "#666", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email} · {c.subject || "Általános"}</p>
                </div>
                <span style={{ color: "#555", fontSize: "0.7rem", flexShrink: 0 }}>{new Date(c.createdAt).toLocaleDateString("hu-HU")}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Detail */}
        {selectedContact && (
          <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "1.125rem", fontWeight: 700 }}>{selectedContact.name}</h2>
                <p style={{ color: "#888", fontSize: "0.875rem" }}>{selectedContact.email}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {!selectedContact.isRead && <button onClick={() => markReadMutation.mutate({ id: selectedContact.id })} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "#888", cursor: "pointer", padding: "0.375rem 0.75rem", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem" }}><Check size={14} /> Olvasott</button>}
                <button onClick={() => { if (confirm("Biztosan törli?")) deleteMutation.mutate({ id: selectedContact.id }); }} style={{ background: "none", border: "1px solid rgba(233,17,48,0.3)", borderRadius: "4px", color: "#e91130", cursor: "pointer", padding: "0.375rem 0.75rem", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem" }}><Trash2 size={14} /> Törlés</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[["Telefon", selectedContact.phone], ["Tárgy", selectedContact.subject], ["Szolgáltatás", selectedContact.serviceInterest], ["Dátum", new Date(selectedContact.createdAt).toLocaleString("hu-HU")]].map(([k, v]) => v ? (
                <div key={k as string}><p style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{k}</p><p style={{ color: "#ccc", fontSize: "0.875rem" }}>{v as string}</p></div>
              ) : null)}
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Üzenet</p>
              <div style={{ backgroundColor: "#111", borderRadius: "6px", padding: "1rem", color: "#ccc", fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedContact.message}</div>
            </div>
            <a href={`mailto:${selectedContact.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1.25rem", color: "#e91130", textDecoration: "none", fontSize: "0.875rem" }}><Mail size={15} /> Válasz küldése</a>
          </div>
        )}
      </div>
    </div>
  );
}
