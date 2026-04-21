import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Trash2, Phone, Mail, Globe, Building2 } from "lucide-react";

export default function AdminAuditLeads() {
  const utils = trpc.useUtils();
  const { data: leads = [], isLoading } = trpc.admin.auditLeads.list.useQuery();

  const markContactedMutation = trpc.admin.auditLeads.markContacted.useMutation({
    onSuccess: () => { toast.success("Megjelölve kapcsolatba lépettként!"); utils.admin.auditLeads.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.auditLeads.delete.useMutation({
    onSuccess: () => { toast.success("Audit kérés törölve!"); utils.admin.auditLeads.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <AdminLayout>
      <div style={{ padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--g2a-text)" }}>Ingyenes Audit Kérések</h1>
          <p style={{ color: "var(--g2a-text-muted)", marginTop: "0.5rem" }}>
            {leads.length} kérés összesen · {leads.filter((l: any) => !l.isContacted).length} megválaszolatlan
          </p>
        </div>

        {isLoading ? (
          <p style={{ color: "var(--g2a-text-muted)" }}>Betöltés...</p>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--g2a-text-muted)" }}>
            <p>Még nincsenek audit kérések.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {leads.map((lead: any) => (
              <div key={lead.id} style={{
                background: "var(--g2a-surface)", border: `1px solid ${lead.isContacted ? "var(--g2a-border)" : "#e91130"}`,
                borderRadius: "0.75rem", padding: "1.5rem",
                opacity: lead.isContacted ? 0.7 : 1,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <h3 style={{ fontWeight: 600, color: "var(--g2a-text)", fontSize: "1.1rem" }}>{lead.name}</h3>
                      {lead.isContacted ? (
                        <span style={{ fontSize: "0.7rem", background: "#22c55e20", color: "#22c55e", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>Kapcsolatba léptek</span>
                      ) : (
                        <span style={{ fontSize: "0.7rem", background: "#e9113020", color: "#e91130", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>Új kérés</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", marginTop: "0.25rem" }}>
                      {new Date(lead.createdAt).toLocaleString("hu-HU")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {!lead.isContacted && (
                      <button onClick={() => markContactedMutation.mutate({ id: lead.id })} style={{ background: "#22c55e20", border: "1px solid #22c55e", borderRadius: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer", color: "#22c55e", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem" }}>
                        <CheckCircle size={14} /> Kapcsolatba léptek
                      </button>
                    )}
                    <button onClick={() => { if (confirm("Biztosan törlöd?")) deleteMutation.mutate({ id: lead.id }); }} style={{ background: "none", border: "1px solid #e91130", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "#e91130" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--g2a-text)" }}>
                    <Mail size={14} style={{ color: "#e91130" }} />
                    <a href={`mailto:${lead.email}`} style={{ color: "#e91130" }}>{lead.email}</a>
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
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: "#e91130" }}>{lead.website}</a>
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
        )}
      </div>
    </AdminLayout>
  );
}
