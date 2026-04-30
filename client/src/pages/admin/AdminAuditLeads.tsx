import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import { CheckCircle, Trash2, Phone, Mail, Globe, Building2, Search, X } from "lucide-react";
import { useBulkSelection } from "@/components/admin/useBulkSelection";
import BulkActionBar, { BulkSelectCheckbox } from "@/components/admin/BulkActionBar";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";
import { formatAdminDateTime } from "@/components/admin/formatDate";

export default function AdminAuditLeads() {
  const utils = trpc.useUtils();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "contacted">("all");
  const { data: leads = [], isLoading } = trpc.admin.auditLeads.list.useQuery();

  const markContactedMutation = trpc.admin.auditLeads.markContacted.useMutation({
    onSuccess: () => { toast.success("Megjelölve kapcsolatba lépettként!"); utils.admin.auditLeads.list.invalidate(); },
    onError: (e) => toast.error(parseFormError(e)),
  });

  const deleteMutation = trpc.admin.auditLeads.delete.useMutation({
    onSuccess: () => { toast.success("Audit kérés törölve!"); utils.admin.auditLeads.list.invalidate(); },
    onError: (e) => toast.error(parseFormError(e)),
  });
  const deleteManyMutation = trpc.admin.auditLeads.deleteMany.useMutation({
    onSuccess: (n) => { toast.success(`${n} audit kérés törölve`); utils.admin.auditLeads.list.invalidate(); selection.clear(); },
    onError: (e) => toast.error(parseFormError(e)),
  });

  // Visible IDs depend on the filter+search applied below — we pass them in
  // when defining the IIFE block. To keep the hook order stable we initialize
  // with the full list and let the action handler read what's selected.
  const selection = useBulkSelection<number>(leads.map((l: any) => l.id));

  const handleBulkDelete = async () => {
    const ok = await confirm({ title: "Tömeges törlés", message: `Biztosan törlöd a kiválasztott ${selection.count} audit kérést?\n\nEz nem visszavonható.` });
    if (ok) deleteManyMutation.mutate({ ids: selection.ids });
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--g2a-text)" }}>Ingyenes Audit Kérések</h1>
          <p style={{ color: "var(--g2a-text-muted)", marginTop: "0.5rem" }}>
            {leads.length} kérés összesen · {leads.filter((l: any) => !l.isContacted).length} megválaszolatlan
          </p>
        </div>

        <BulkActionBar
          count={selection.count}
          itemLabel="kiválasztott audit kérés"
          onClear={selection.clear}
          onDelete={handleBulkDelete}
          deleting={deleteManyMutation.isPending}
        />

        {/* Filter chips + search */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "inline-flex", gap: 4, background: "rgba(255,255,255,0.04)", padding: 3, borderRadius: 6 }}>
            {([["all", `Összes (${leads.length})`], ["open", `Új (${leads.filter((l: any) => !l.isContacted).length})`], ["contacted", `Kapcsolatba léptek (${leads.filter((l: any) => l.isContacted).length})`]] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  padding: "5px 11px", borderRadius: 4, border: "none", cursor: "pointer",
                  fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", fontWeight: 600,
                  background: filter === k ? "#14B8A6" : "transparent",
                  color: filter === k ? "#fff" : "var(--g2a-text-muted)",
                }}
              >{label}</button>
            ))}
          </div>
          <div style={{ position: "relative", flex: 1, maxWidth: 360, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Keresés név, email, cég, weboldal alapján..."
              style={{ width: "100%", paddingLeft: 32, padding: "8px 12px 8px 32px", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", outline: "none" }}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Keresés törlése" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#666", cursor: "pointer", padding: 4 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {(() => {
          const q = search.trim().toLowerCase();
          const visible = leads.filter((l: any) => {
            if (filter === "open" && l.isContacted) return false;
            if (filter === "contacted" && !l.isContacted) return false;
            if (q && !(`${l.name || ""} ${l.email || ""} ${l.company || ""} ${l.website || ""}`).toLowerCase().includes(q)) return false;
            return true;
          });
          return isLoading ? (
            <AdminListSkeleton rows={4} asCards />
          ) : visible.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--g2a-text-muted)" }}>
              <p>{leads.length === 0 ? "Még nincsenek audit kérések." : "Nincs találat a keresésre."}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {visible.map((lead: any) => (
              <div key={lead.id} style={{
                background: selection.isSelected(lead.id) ? "rgba(20,184,166,0.06)" : "var(--g2a-surface)",
                border: `1px solid ${selection.isSelected(lead.id) ? "rgba(20,184,166,0.5)" : (lead.isContacted ? "var(--g2a-border)" : "var(--g2a-brand-teal)")}`,
                borderRadius: "0.75rem", padding: "1.5rem",
                opacity: lead.isContacted && !selection.isSelected(lead.id) ? 0.7 : 1,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                    <div style={{ paddingTop: 4 }}>
                      <BulkSelectCheckbox checked={selection.isSelected(lead.id)} onToggle={() => selection.toggle(lead.id)} />
                    </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <h3 style={{ fontWeight: 600, color: "var(--g2a-text)", fontSize: "1.1rem" }}>{lead.name}</h3>
                      {lead.isContacted ? (
                        <span style={{ fontSize: "0.7rem", background: "#22c55e20", color: "#22c55e", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>Kapcsolatba léptek</span>
                      ) : (
                        <span style={{ fontSize: "0.7rem", background: "#14B8A620", color: "var(--g2a-brand-teal)", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>Új kérés</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", marginTop: "0.25rem" }}>
                      {formatAdminDateTime(lead.createdAt)}
                    </p>
                  </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {!lead.isContacted && (
                      <button onClick={() => markContactedMutation.mutate({ id: lead.id })} style={{ background: "#22c55e20", border: "1px solid #22c55e", borderRadius: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer", color: "#22c55e", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem" }}>
                        <CheckCircle size={14} /> Kapcsolatba léptek
                      </button>
                    )}
                    <button onClick={async () => {
                      const ok = await confirm({ title: "Audit kérés törlése", message: `Biztosan törlöd: ${lead.name} (${lead.email})?\n\nEz nem visszavonható.` });
                      if (ok) deleteMutation.mutate({ id: lead.id });
                    }} style={{ background: "none", border: "1px solid #14B8A6", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "var(--g2a-brand-teal)" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--g2a-text)" }}>
                    <Mail size={14} style={{ color: "var(--g2a-brand-teal)" }} />
                    <a href={`mailto:${lead.email}`} style={{ color: "var(--g2a-brand-teal)" }}>{lead.email}</a>
                  </div>
                  {lead.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--g2a-text)" }}>
                      <Phone size={14} style={{ color: "var(--g2a-text-muted)" }} />
                      <a href={`tel:${lead.phone}`} style={{ color: "var(--g2a-text)" }}>{lead.phone}</a>
                    </div>
                  )}
                  {lead.company && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--g2a-text)" }}>
                      <Building2 size={14} style={{ color: "var(--g2a-text-muted)" }} />
                      {lead.company}
                    </div>
                  )}
                  {lead.website && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--g2a-text)" }}>
                      <Globe size={14} style={{ color: "var(--g2a-text-muted)" }} />
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--g2a-brand-teal)" }}>{lead.website}</a>
                    </div>
                  )}
                </div>

                {lead.monthlyBudget && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)" }}>Havi büdzsé: </span>
                    <span style={{ fontSize: "0.875rem", color: "var(--g2a-text)" }}>{lead.monthlyBudget}</span>
                  </div>
                )}

                {lead.currentChallenges && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", marginBottom: "0.25rem" }}>Kihívások:</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--g2a-text)", background: "var(--g2a-bg)", padding: "0.75rem", borderRadius: "0.5rem" }}>{lead.currentChallenges}</p>
                  </div>
                )}

                {lead.goals && (
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", marginBottom: "0.25rem" }}>Célok:</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--g2a-text)", background: "var(--g2a-bg)", padding: "0.75rem", borderRadius: "0.5rem" }}>{lead.goals}</p>
                  </div>
                )}
              </div>
              ))}
            </div>
          );
        })()}
    </div>
  );
}
