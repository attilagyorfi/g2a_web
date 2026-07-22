/**
 * Staff access management.
 *
 * - Invite a colleague by name + email and tick exactly which areas they may
 *   reach. The same checkboxes edit an existing account later, so access can
 *   be widened or narrowed at any time.
 * - The invite/reset link is shown in the UI as well as emailed, so onboarding
 *   never depends on mail deliverability.
 * - The owner row (ADMIN_EMAIL) always has full access and can't be edited,
 *   suspended or deleted from here.
 */
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";
import { formatAdminDateTime } from "@/components/admin/formatDate";
import { PERMISSION_GROUPS, DEFAULT_PERMISSIONS, type Permission } from "@shared/permissions";
import { UserPlus, Shield, Copy, Check, Trash2, Send, Pencil, X, AlertTriangle } from "lucide-react";

const label: React.CSSProperties = {
  display: "block", color: "#888", fontSize: "0.7rem", textTransform: "uppercase",
  letterSpacing: "0.06em", marginBottom: 6, fontFamily: "Geist Mono, monospace",
};
const input: React.CSSProperties = {
  width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5,
  padding: "0.6rem 0.8rem", color: "#fff", fontFamily: "Geist Mono, monospace",
  fontSize: "0.85rem", outline: "none", boxSizing: "border-box",
};
const card: React.CSSProperties = {
  background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 20,
};

/** Grouped permission checkboxes — shared by the invite form and the editor. */
function PermissionPicker({
  value,
  onChange,
  disabled,
}: {
  value: Permission[];
  onChange: (next: Permission[]) => void;
  disabled?: boolean;
}) {
  const set = useMemo(() => new Set(value), [value]);
  const toggle = (key: Permission) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange(Array.from(next));
  };
  const toggleGroup = (keys: Permission[], on: boolean) => {
    const next = new Set(set);
    keys.forEach(k => (on ? next.add(k) : next.delete(k)));
    onChange(Array.from(next));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
      {PERMISSION_GROUPS.map(group => {
        const keys = group.items.map(i => i.key);
        const allOn = keys.every(k => set.has(k));
        return (
          <div key={group.title} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: 14, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div>
                <div style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 600, fontFamily: "Geist Mono, monospace" }}>{group.title}</div>
                {group.hint && <div style={{ color: "#f59e0b", fontSize: "0.62rem", marginTop: 2 }}>{group.hint}</div>}
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggleGroup(keys, !allOn)}
                style={{ background: "none", border: "none", color: "var(--g2a-brand-teal)", cursor: disabled ? "default" : "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.62rem" }}
              >
                {allOn ? "egyiket sem" : "mind"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {group.items.map(item => (
                <label key={item.key} style={{ display: "flex", gap: 9, alignItems: "flex-start", cursor: disabled ? "default" : "pointer" }}>
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={set.has(item.key)}
                    onChange={() => toggle(item.key)}
                    style={{ marginTop: 3, accentColor: "#14B8A6", width: 15, height: 15, flexShrink: 0 }}
                  />
                  <span>
                    <span style={{ color: "#eee", fontSize: "0.82rem" }}>{item.label}</span>
                    <span style={{ display: "block", color: "#777", fontSize: "0.68rem", lineHeight: 1.4 }}>{item.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Copyable invite/reset link — the fallback when email can't be delivered. */
function LinkBox({ link, warning }: { link: string; warning?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginTop: 14, padding: 14, borderRadius: 7, background: "rgba(20,184,166,0.07)", border: "1px solid rgba(20,184,166,0.3)" }}>
      <div style={{ color: "var(--g2a-brand-teal)", fontSize: "0.72rem", fontFamily: "Geist Mono, monospace", marginBottom: 8 }}>
        Jelszó-beállító link (1 óráig érvényes)
      </div>
      {warning && (
        <div style={{ display: "flex", gap: 7, alignItems: "flex-start", color: "#fbbf24", fontSize: "0.7rem", marginBottom: 9, lineHeight: 1.5 }}>
          <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Az email nem ment ki ({warning}). Küldd el a linket kézzel.</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <input readOnly value={link} style={{ ...input, fontSize: "0.72rem" }} onFocus={e => e.currentTarget.select()} />
        <button
          type="button"
          onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          style={{ flexShrink: 0, padding: "0 14px", borderRadius: 5, background: "rgba(20,184,166,0.18)", border: "1px solid rgba(20,184,166,0.45)", color: "var(--g2a-brand-teal)", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Másolva" : "Másolás"}
        </button>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const confirm = useConfirm();
  const listQuery = trpc.admin.users.list.useQuery();
  const utils = trpc.useUtils();
  const refresh = () => utils.admin.users.list.invalidate();

  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [perms, setPerms] = useState<Permission[]>(DEFAULT_PERMISSIONS);
  const [issued, setIssued] = useState<{ link: string; warning?: string } | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPerms, setEditPerms] = useState<Permission[]>([]);
  const [editName, setEditName] = useState("");

  const inviteMutation = trpc.admin.users.invite.useMutation();
  const updateMutation = trpc.admin.users.update.useMutation();
  const resendMutation = trpc.admin.users.resendInvite.useMutation();
  const removeMutation = trpc.admin.users.remove.useMutation();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !email.includes("@")) {
      toast.error("Adj meg egy nevet és egy érvényes email címet.");
      return;
    }
    try {
      const res = await inviteMutation.mutateAsync({ name: name.trim(), email: email.trim(), permissions: perms });
      setIssued({ link: res.link, warning: res.emailSent ? undefined : res.emailError });
      toast.success(res.emailSent ? "Meghívó elküldve" : "Felhasználó létrehozva — az emailt nem sikerült kiküldeni");
      setName(""); setEmail(""); setPerms(DEFAULT_PERMISSIONS);
      refresh();
    } catch (err) {
      toast.error(parseFormError(err, "A meghívás nem sikerült"));
    }
  };

  const startEdit = (u: { id: number; name: string; permissions: Permission[] }) => {
    setEditingId(u.id); setEditName(u.name); setEditPerms(u.permissions); setIssued(null);
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    try {
      await updateMutation.mutateAsync({ id: editingId, name: editName.trim(), permissions: editPerms });
      toast.success("Jogosultságok mentve");
      setEditingId(null);
      refresh();
    } catch (err) {
      toast.error(parseFormError(err, "Mentés sikertelen"));
    }
  };

  const users = listQuery.data ?? [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, gap: 14, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>Felhasználók</h1>
          <p style={{ color: "#888", fontSize: "0.8rem", margin: "6px 0 0", maxWidth: "60ch" }}>
            Hívj meg munkatársakat, és pipáld ki, mihez férhetnek hozzá. A jogosultságok később bármikor módosíthatók.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowInvite(v => !v); setIssued(null); }}
          className="g2a-btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
        >
          {showInvite ? <X size={15} /> : <UserPlus size={15} />}
          {showInvite ? "Mégse" : "Felhasználó hozzáadása"}
        </button>
      </div>

      {showInvite && (
        <form onSubmit={handleInvite} style={{ ...card, marginBottom: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={label}>Név *</label>
              <input value={name} onChange={e => setName(e.target.value)} style={input} placeholder="Kovács Anna" />
            </div>
            <div>
              <label style={label}>Email cím *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={input} placeholder="anna@pelda.hu" />
            </div>
          </div>
          <div>
            <label style={label}>Hozzáférések</label>
            <PermissionPicker value={perms} onChange={setPerms} />
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="submit" className="g2a-btn-primary" disabled={inviteMutation.isPending} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Send size={15} /> {inviteMutation.isPending ? "Meghívás..." : "Meghívó küldése"}
            </button>
            <span style={{ color: "#666", fontSize: "0.72rem", fontFamily: "Geist Mono, monospace" }}>
              {perms.length} hozzáférés kijelölve
            </span>
          </div>
          {issued && <LinkBox link={issued.link} warning={issued.warning} />}
        </form>
      )}

      {!showInvite && issued && <LinkBox link={issued.link} warning={issued.warning} />}

      {/* User list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {users.map(u => (
          <div key={u.id} style={{ ...card, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ minWidth: 220 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{u.name || "(névtelen)"}</span>
                  {u.isOwner && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 3, background: "rgba(20,184,166,0.15)", color: "var(--g2a-brand-teal)", fontSize: "0.62rem", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      <Shield size={10} /> Tulajdonos
                    </span>
                  )}
                  {!u.isActive && (
                    <span style={{ padding: "2px 8px", borderRadius: 3, background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: "0.62rem", fontFamily: "Geist Mono, monospace", textTransform: "uppercase" }}>Felfüggesztve</span>
                  )}
                  {!u.isOwner && !u.hasPassword && (
                    <span style={{ padding: "2px 8px", borderRadius: 3, background: "rgba(245,158,11,0.15)", color: "#fbbf24", fontSize: "0.62rem", fontFamily: "Geist Mono, monospace", textTransform: "uppercase" }}>Meghívó függőben</span>
                  )}
                </div>
                <div style={{ color: "#888", fontSize: "0.78rem", fontFamily: "Geist Mono, monospace", marginTop: 4 }}>{u.email}</div>
                <div style={{ color: "#666", fontSize: "0.68rem", fontFamily: "Geist Mono, monospace", marginTop: 6 }}>
                  {u.isOwner ? "Teljes hozzáférés" : `${u.permissions.length} hozzáférés`}
                  {u.lastSignedIn ? ` · utoljára belépve: ${formatAdminDateTime(u.lastSignedIn)}` : ""}
                </div>
              </div>

              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {!u.isOwner && (
                  <>
                    <button type="button" onClick={() => startEdit(u)} title="Jogosultságok szerkesztése"
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#ccc", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                      <Pencil size={12} /> Szerkesztés
                    </button>
                    <button type="button"
                      onClick={async () => {
                        try {
                          const r = await resendMutation.mutateAsync({ id: u.id });
                          setIssued({ link: r.link, warning: r.emailSent ? undefined : r.emailError });
                          toast.success(r.emailSent ? "Új link elküldve" : "Link elkészült — az emailt nem sikerült kiküldeni");
                        } catch (err) { toast.error(parseFormError(err)); }
                      }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#ccc", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                      <Send size={12} /> Új jelszó-link
                    </button>
                    <button type="button"
                      onClick={async () => {
                        try {
                          await updateMutation.mutateAsync({ id: u.id, isActive: !u.isActive });
                          toast.success(u.isActive ? "Hozzáférés felfüggesztve" : "Hozzáférés visszaállítva");
                          refresh();
                        } catch (err) { toast.error(parseFormError(err)); }
                      }}
                      style={{ padding: "6px 11px", borderRadius: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: u.isActive ? "#fbbf24" : "var(--g2a-brand-teal)", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                      {u.isActive ? "Felfüggesztés" : "Visszaállítás"}
                    </button>
                    <button type="button"
                      onClick={async () => {
                        const ok = await confirm({ title: "Felhasználó törlése", message: `Biztosan törlöd: ${u.name} (${u.email})?\n\nEz nem visszavonható.`, destructive: true });
                        if (!ok) return;
                        try { await removeMutation.mutateAsync({ id: u.id }); toast.success("Felhasználó törölve"); refresh(); }
                        catch (err) { toast.error(parseFormError(err)); }
                      }}
                      title="Törlés"
                      style={{ padding: "6px 10px", borderRadius: 5, background: "none", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", cursor: "pointer", display: "inline-flex" }}>
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingId === u.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ maxWidth: 320 }}>
                  <label style={label}>Név</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={input} />
                </div>
                <div>
                  <label style={label}>Hozzáférések</label>
                  <PermissionPicker value={editPerms} onChange={setEditPerms} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={saveEdit} className="g2a-btn-primary" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Mentés..." : "Mentés"}
                  </button>
                  <button type="button" onClick={() => setEditingId(null)}
                    style={{ padding: "9px 16px", borderRadius: 5, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.8rem" }}>
                    Mégse
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {users.length === 0 && !listQuery.isLoading && (
          <div style={{ ...card, textAlign: "center", color: "#666", padding: 40 }}>Még nincs felhasználó.</div>
        )}
      </div>
    </div>
  );
}
