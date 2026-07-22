/**
 * Password-based admin login form. Renders inside AdminLayout when
 * VITE_OAUTH_PORTAL_URL / VITE_APP_ID are unset — i.e. when the Manus OAuth
 * provider isn't configured yet on this deploy.
 *
 * Posts to `/api/auth/password-login`. On success the server sets the same
 * session cookie used by the OAuth flow, so a full page reload lands the user
 * in the regular admin shell with all the tRPC queries working as normal.
 *
 * The form delegates rate-limit / "wrong creds" feedback to the server: any
 * non-200 response is surfaced as an inline error message.
 */
import { useState } from "react";
import { Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminPasswordLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // "forgot" swaps the card to the reset-request form. Available right on the
  // login screen so the owner can recover their own password without help.
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const utils = trpc.useUtils();

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // The endpoint answers identically for known and unknown addresses.
      setResetSent(true);
    } catch {
      setError("Hálózati hiba történt. Próbáld újra.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          (data as { error?: string }).error ||
            `Hiba (${res.status}). Próbáld újra.`,
        );
        setSubmitting(false);
        return;
      }
      // Force a fresh fetch of the auth.me query so AdminLayout re-renders with the
      // logged-in user. A full reload is simpler and avoids races.
      await utils.auth.me.invalidate();
      window.location.href = "/admin";
    } catch (err) {
      setError("Hálózati hiba történt. Próbáld újra.");
      setSubmitting(false);
    }
  }

  const shellStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
  };
  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#161616",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "2rem",
  };
  const fieldLabel: React.CSSProperties = {
    display: "block",
    color: "#cfcfcf",
    fontSize: "0.78rem",
    marginBottom: "0.4rem",
    fontFamily: "Geist Mono, monospace",
    letterSpacing: "0.04em",
  };
  const fieldInput: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    marginBottom: "1rem",
    backgroundColor: "#0f0f0f",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    color: "#fff",
    fontSize: "0.9rem",
  };
  const linkButton: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "var(--g2a-brand-teal)",
    cursor: "pointer",
    fontFamily: "Geist Mono, monospace",
    fontSize: "0.74rem",
    padding: 0,
    textDecoration: "underline",
    textUnderlineOffset: 3,
  };

  if (mode === "forgot") {
    return (
      <div style={shellStyle}>
        <form onSubmit={handleForgot} style={cardStyle}>
          <Shield size={40} style={{ color: "var(--g2a-brand-teal)", margin: "0 auto 1rem", display: "block" }} />
          <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.2rem", marginBottom: "0.4rem", textAlign: "center" }}>
            Elfelejtett jelszó
          </h1>

          {resetSent ? (
            <>
              <p style={{ color: "#b0b0b0", fontSize: "0.85rem", textAlign: "center", lineHeight: 1.6, marginBottom: "1.4rem" }}>
                Ha ez a cím szerepel a rendszerben, elküldtük rá a jelszó-beállító linket. A link <strong style={{ color: "#fff" }}>1 óráig</strong> érvényes — nézd meg a spam mappát is.
              </p>
              <button type="button" onClick={() => { setMode("login"); setResetSent(false); }} className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Vissza a belépéshez
              </button>
            </>
          ) : (
            <>
              <p style={{ color: "#888", fontSize: "0.85rem", textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Add meg az email címed, és küldünk egy linket, amivel új jelszót állíthatsz be.
              </p>
              <label style={fieldLabel}>Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                style={fieldInput}
              />
              {error && (
                <div style={{ padding: "0.6rem 0.8rem", marginBottom: "1rem", backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 6, color: "#f87171", fontSize: "0.82rem" }}>
                  {error}
                </div>
              )}
              <button type="submit" className="g2a-btn-primary" disabled={submitting} style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.6 : 1 }}>
                {submitting ? "Küldés…" : "Jelszó-link kérése"}
              </button>
              <p style={{ marginTop: "1.25rem", textAlign: "center" }}>
                <button type="button" onClick={() => { setMode("login"); setError(null); }} style={linkButton}>
                  Vissza a belépéshez
                </button>
              </p>
            </>
          )}
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "2rem",
        }}
      >
        <Shield
          size={40}
          style={{
            color: "var(--g2a-brand-teal)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h1
          style={{
            color: "#ffffff",
            fontFamily: "Geist Mono, monospace",
            fontSize: "1.25rem",
            marginBottom: "0.4rem",
            textAlign: "center",
          }}
        >
          Admin Belépés
        </h1>
        <p
          style={{
            color: "#888",
            fontSize: "0.85rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Email és jelszó kéréshez vedd fel a kapcsolatot a rendszergazdával.
        </p>

        <label
          style={{
            display: "block",
            color: "#cfcfcf",
            fontSize: "0.78rem",
            marginBottom: "0.4rem",
            fontFamily: "Geist Mono, monospace",
            letterSpacing: "0.04em",
          }}
        >
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            marginBottom: "1rem",
            backgroundColor: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6,
            color: "#fff",
            fontSize: "0.9rem",
          }}
        />

        <label
          style={{
            display: "block",
            color: "#cfcfcf",
            fontSize: "0.78rem",
            marginBottom: "0.4rem",
            fontFamily: "Geist Mono, monospace",
            letterSpacing: "0.04em",
          }}
        >
          Jelszó
        </label>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            marginBottom: "1.25rem",
            backgroundColor: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6,
            color: "#fff",
            fontSize: "0.9rem",
          }}
        />

        {error && (
          <div
            style={{
              padding: "0.6rem 0.8rem",
              marginBottom: "1rem",
              backgroundColor: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 6,
              color: "#f87171",
              fontSize: "0.82rem",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="g2a-btn-primary"
          disabled={submitting}
          style={{
            width: "100%",
            justifyContent: "center",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Bejelentkezés…" : "Bejelentkezés"}
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <button type="button" onClick={() => { setMode("forgot"); setError(null); }} style={linkButton}>
            Elfelejtetted a jelszavad?
          </button>
        </p>

        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.7rem",
            color: "#666",
            textAlign: "center",
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Az IP-cím alapján 15 percenként max 5 próbálkozás engedélyezett.
        </p>
      </form>
    </div>
  );
}
