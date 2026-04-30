import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Mail, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { useBulkSelection } from "@/components/admin/useBulkSelection";
import BulkActionBar, { BulkSelectCheckbox } from "@/components/admin/BulkActionBar";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";
import { formatAdminDate, formatAdminDateTime } from "@/components/admin/formatDate";

export default function AdminContacts() {
  const confirm = useConfirm();
  const { data: contacts, refetch, isLoading } = trpc.admin.contacts.list.useQuery();
  const markReadMutation = trpc.admin.contacts.markRead.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.admin.contacts.delete.useMutation({ onSuccess: () => { refetch(); setSelected(null); toast.success("Üzenet törölve"); } });
  const deleteManyMutation = trpc.admin.contacts.deleteMany.useMutation({
    onSuccess: (n) => { refetch(); toast.success(`${n} üzenet törölve`); selection.clear(); setSelected(null); },
  });
  const [selected, setSelected] = useState<number | null>(null);
  const selectedContact = contacts?.find(c => c.id === selected);

  // Read filter from URL (?filter=unread sets the default tab)
  const initialFilter = (() => {
    if (typeof window === "undefined") return "all";
    const v = new URLSearchParams(window.location.search).get("filter");
    return v === "unread" || v === "read" ? v : "all";
  })();
  const [filter, setFilter] = useState<"all" | "unread" | "read">(initialFilter as never);

  const visibleContacts = (contacts || []).filter((c) => {
    if (filter === "unread") return !c.isRead;
    if (filter === "read") return c.isRead;
    return true;
  });

  const selection = useBulkSelection<number>(visibleContacts.map(c => c.id));

  const handleBulkDelete = async () => {
    const ok = await confirm({ title: "Tömeges törlés", message: `Biztosan törlöd a kiválasztott ${selection.count} üzenetet?\n\nEz nem visszavonható.` });
    if (ok) deleteManyMutation.mutate({ ids: selection.ids });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Kapcsolatfelvételek</h1>
        <div style={{ display: "inline-flex", gap: 4, background: "rgba(255,255,255,0.04)", padding: 3, borderRadius: 6 }}>
          {([
            ["all", `Összes (${(contacts || []).length})`],
            ["unread", `Olvasatlan (${(contacts || []).filter(c => !c.isRead).length})`],
            ["read", `Olvasott (${(contacts || []).filter(c => c.isRead).length})`],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              style={{
                padding: "5px 11px", borderRadius: 4, border: "none", cursor: "pointer",
                fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", fontWeight: 600,
                background: filter === k ? "var(--g2a-brand-teal)" : "transparent",
                color: filter === k ? "#fff" : "var(--g2a-text-muted)",
              }}
            >{label}</button>
          ))}
        </div>
      </div>
      <BulkActionBar
        count={selection.count}
        itemLabel="kiválasztott üzenet"
        onClear={selection.clear}
        onDelete={handleBulkDelete}
        deleting={deleteManyMutation.isPending}
      />
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
        {/* List */}
        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
          {isLoading && <div style={{ padding: "1rem" }}><AdminListSkeleton rows={4} /></div>}
          {!isLoading && visibleContacts.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
              {(contacts || []).length === 0 ? "Nincsenek üzenetek." : `Nincs ${filter === "unread" ? "olvasatlan" : "olvasott"} üzenet.`}
            </div>
          )}
          {visibleContacts.map(c => (
            <div key={c.id} onClick={() => { setSelected(c.id); if (!c.isRead) markReadMutation.mutate({ id: c.id }); }} style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", backgroundColor: selection.isSelected(c.id) ? "rgba(20,184,166,0.06)" : selected === c.id ? "rgba(20,184,166,0.08)" : "transparent", transition: "background 0.15s" }} onMouseEnter={e => { if (selected !== c.id && !selection.isSelected(c.id)) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }} onMouseLeave={e => { if (selected !== c.id && !selection.isSelected(c.id)) e.currentTarget.style.backgroundColor = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <BulkSelectCheckbox checked={selection.isSelected(c.id)} onToggle={() => selection.toggle(c.id)} />
                {!c.isRead && <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--g2a-brand-teal)", flexShrink: 0 }} />}
                {c.isRead && <span style={{ width: "8px", height: "8px", flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: c.isRead ? "#aaa" : "#fff", fontWeight: c.isRead ? 400 : 700, fontSize: "0.875rem", fontFamily: "Geist Mono, monospace", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                  <p style={{ color: "#666", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email} · {c.subject || "Általános"}</p>
                </div>
                <span style={{ color: "#555", fontSize: "0.7rem", flexShrink: 0 }}>{formatAdminDate(c.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Detail */}
        {selectedContact && (
          <div style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.125rem", fontWeight: 700 }}>{selectedContact.name}</h2>
                <p style={{ color: "#888", fontSize: "0.875rem" }}>{selectedContact.email}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {!selectedContact.isRead && <button onClick={() => markReadMutation.mutate({ id: selectedContact.id })} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "#888", cursor: "pointer", padding: "0.375rem 0.75rem", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem" }}><Check size={14} /> Olvasott</button>}
                <button onClick={async () => {
                  const ok = await confirm({ title: "Üzenet törlése", message: `Biztosan törlöd ${selectedContact.name} üzenetét?` });
                  if (ok) deleteMutation.mutate({ id: selectedContact.id });
                }} style={{ background: "none", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "4px", color: "var(--g2a-brand-teal)", cursor: "pointer", padding: "0.375rem 0.75rem", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem" }}><Trash2 size={14} /> Törlés</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[["Telefon", selectedContact.phone], ["Tárgy", selectedContact.subject], ["Szolgáltatás", selectedContact.serviceInterest], ["Dátum", formatAdminDateTime(selectedContact.createdAt)]].map(([k, v]) => v ? (
                <div key={k as string}><p style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{k}</p><p style={{ color: "#ccc", fontSize: "0.875rem" }}>{v as string}</p></div>
              ) : null)}
            </div>
            <div>
              <p style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Üzenet</p>
              <div style={{ backgroundColor: "#111", borderRadius: "6px", padding: "1rem", color: "#ccc", fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedContact.message}</div>
            </div>
            <a href={`mailto:${selectedContact.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1.25rem", color: "var(--g2a-brand-teal)", textDecoration: "none", fontSize: "0.875rem" }}><Mail size={15} /> Válasz küldése</a>
          </div>
        )}
      </div>
    </div>
  );
}
