/**
 * Set / reset an admin password from an emailed link.
 *
 * Reached as `/admin/reset-password?token=…` — deliberately OUTSIDE the admin
 * auth gate, since the whole point is that the visitor can't sign in yet. The
 * token is single-use and expires after an hour; the server re-validates it, so
 * this screen only needs to collect and post the new password.
 *
 * Serves both flows: a colleague setting their first password from an invite,
 * and anyone (including the owner) recovering a forgotten one.
 */
import { useState } from "react";
import { Shield, Check } from "lucide-react";
import { MIN_PASSWORD_LENGTH } from "@shared/passwordPolicy";

export default function AdminResetPassword() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const shell: React.CSSProperties = {
    minHeight: "100vh", backgroundColor: "#0f0f0f", display: "flex",
    alignItems: "center", justifyContent: "center", padding: "1.5rem",
  };
  const card: React.CSSProperties = {
    width: "100%", maxWidth: 380, backgroundColor: "#161616",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "2rem",
  };
  const lbl: React.CSSProperties = {
    display: "block", color: "#cfcfcf", fontSize: "0.78rem", marginBottom: "0.4rem",
    fontFamily: "Geist Mono, monospace", letterSpacing: "0.04em",
  };
  const inp: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.75rem", marginBottom: "1rem",
    backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6, color: "#fff", fontSize: "0.9rem",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("A két jelszó nem egyezik.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || `Hiba (${res.status}). Próbáld újra.`);
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Hálózati hiba történt. Próbáld újra.");
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div style={shell}>
        <div style={card}>
          <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.15rem", textAlign: "center", marginBottom: "0.8rem" }}>
            Hiányzó link
          </h1>
          <p style={{ color: "#888", fontSize: "0.85rem", textAlign: "center", lineHeight: 1.6 }}>
            Ez az oldal csak a kiküldött jelszó-beállító linkről érhető el. Kérj újat a belépő oldalon.
          </p>
          <a href="/admin" className="g2a-btn-primary" style={{ marginTop: "1.4rem", width: "100%", justifyContent: "center", display: "flex" }}>
            Belépés
          </a>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={shell}>
        <div style={{ ...card, textAlign: "center" }}>
          <Check size={40} style={{ color: "var(--g2a-brand-teal)", margin: "0 auto 1rem", display: "block" }} />
          <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.15rem", marginBottom: "0.6rem" }}>
            Jelszó beállítva
          </h1>
          <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.4rem" }}>
            Mostantól ezzel a jelszóval tudsz belépni az admin felületre.
          </p>
          <a href="/admin" className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            Belépés
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={shell}>
      <form onSubmit={handleSubmit} style={card}>
        <Shield size={40} style={{ color: "var(--g2a-brand-teal)", margin: "0 auto 1rem", display: "block" }} />
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.2rem", marginBottom: "0.4rem", textAlign: "center" }}>
          Jelszó beállítása
        </h1>
        <p style={{ color: "#888", fontSize: "0.82rem", textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Legalább {MIN_PASSWORD_LENGTH} karakter, betűvel és számmal.
        </p>

        <label style={lbl}>Új jelszó</label>
        <input type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH}
          value={password} onChange={(e) => setPassword(e.target.value)} disabled={submitting} style={inp} />

        <label style={lbl}>Jelszó megerősítése</label>
        <input type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH}
          value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={submitting} style={inp} />

        {error && (
          <div style={{ padding: "0.6rem 0.8rem", marginBottom: "1rem", backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 6, color: "#f87171", fontSize: "0.82rem" }}>
            {error}
          </div>
        )}

        <button type="submit" className="g2a-btn-primary" disabled={submitting}
          style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.6 : 1 }}>
          {submitting ? "Mentés…" : "Jelszó mentése"}
        </button>
      </form>
    </div>
  );
}
