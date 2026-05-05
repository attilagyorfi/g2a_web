/**
 * Reusable newsletter signup form.
 *
 * Renders one of three layouts:
 *   - "compact"  → single-row email + button (footer band, popup)
 *   - "full"     → two-column name + email + GDPR consent box (dedicated page)
 *   - "stacked"  → vertically stacked, ideal for narrow popups / sidebars
 *
 * Contract:
 *   - Honeypot (hidden `website` input) — bots fill it, humans don't.
 *   - GDPR consent — required for full + stacked. Compact assumes the user is
 *     reading the privacy line shown next to the input (Grtv. 6. § (1) +
 *     GDPR Art. 6(1)(a) compliant).
 *   - Disabled while in-flight; success / error shown inline below the form.
 *   - Email is the only required field — name is optional but encouraged.
 *
 * The server (newsletter.subscribe tRPC) handles deduplication, welcome email
 * with one-click unsubscribe, and rate-limiting.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Mail, Loader2, Check } from "lucide-react";

type Variant = "compact" | "full" | "stacked";

type Props = {
  variant?: Variant;
  /** Override CTA label (e.g. popup might use "Igen, feliratkozom"). */
  ctaLabel?: string;
  /** Show the small benefits checklist next to the form (full/stacked only). */
  showBenefits?: boolean;
  /** Light-mode card surface (footer band uses dark, popup uses card). */
  surface?: "transparent" | "card";
  /** Called once a successful subscription is recorded. */
  onSuccess?: () => void;
};

export default function NewsletterForm({
  variant = "compact",
  ctaLabel,
  showBenefits = false,
  surface = "transparent",
  onSuccess,
}: Props) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setStatus("success");
      setEmail("");
      setName("");
      setConsent(false);
      onSuccess?.();
    },
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (variant !== "compact" && !consent) return;
    setStatus("loading");
    subscribe.mutate({ email, name: name || undefined, website });
  };

  const requiresConsent = variant !== "compact";
  const submitDisabled =
    status === "loading" || (requiresConsent && !consent);

  // ─── Compact (single-row email + submit) ────────────────────────────────
  if (variant === "compact") {
    return (
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.625rem",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          aria-hidden="true"
          style={honeypotStyle}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.emailPlaceholder")}
          className="g2a-input"
          style={{ flex: 1, minWidth: "220px" }}
          aria-label={t("newsletter.emailLabel")}
        />
        <button
          type="submit"
          className="g2a-btn-primary"
          disabled={status === "loading"}
          style={{ flexShrink: 0 }}
        >
          {status === "loading" ? (
            <Loader2 size={14} style={{ marginRight: 6, animation: "spin 0.8s linear infinite" }} />
          ) : null}
          {ctaLabel ??
            (status === "loading"
              ? t("newsletter.submitting")
              : t("newsletter.submit"))}
        </button>
        <StatusLine status={status} />
      </form>
    );
  }

  // ─── Full / stacked layout with consent + optional benefits ────────────
  const cardStyle: React.CSSProperties =
    surface === "card"
      ? {
          background: "var(--g2a-bg-card)",
          border: "1px solid var(--g2a-border)",
          borderRadius: 16,
          padding: "1.75rem",
        }
      : {};

  return (
    <div style={cardStyle}>
      <form
        onSubmit={handleSubmit}
        style={{ position: "relative" }}
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          aria-hidden="true"
          style={honeypotStyle}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: variant === "full" ? "1fr 1fr" : "1fr",
            gap: "0.75rem",
            marginBottom: "0.875rem",
          }}
        >
          <FieldGroup label={t("newsletter.nameLabel")}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("newsletter.namePlaceholder")}
              className="g2a-input"
              style={{ width: "100%" }}
            />
          </FieldGroup>
          <FieldGroup label={t("newsletter.emailLabel")} required>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.emailPlaceholder")}
              className="g2a-input"
              style={{ width: "100%" }}
            />
          </FieldGroup>
        </div>

        <label
          style={{
            display: "flex",
            gap: "0.625rem",
            alignItems: "flex-start",
            color: "var(--g2a-text-secondary)",
            fontSize: "0.8125rem",
            lineHeight: 1.55,
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            style={{ marginTop: "0.18rem", accentColor: "var(--g2a-brand-teal)", flexShrink: 0 }}
          />
          <span>
            {t("newsletter.consent.before")}{" "}
            <Link
              href="/adatvedelmi-iranyelvek"
              style={{ color: "var(--g2a-brand-teal)", textDecoration: "underline" }}
            >
              {t("newsletter.consent.linkText")}
            </Link>{" "}
            {t("newsletter.consent.after")}
          </span>
        </label>

        <button
          type="submit"
          className="g2a-btn-primary"
          disabled={submitDisabled}
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {status === "loading" ? (
            <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
          ) : (
            <Mail size={16} />
          )}
          {ctaLabel ??
            (status === "loading"
              ? t("newsletter.submitting")
              : t("newsletter.submit"))}
        </button>

        <StatusLine status={status} />
      </form>

      {showBenefits && (
        <ul
          style={{
            marginTop: "1.25rem",
            padding: 0,
            listStyle: "none",
            display: "grid",
            gap: "0.4rem",
          }}
        >
          {[
            t("newsletter.benefits.0"),
            t("newsletter.benefits.1"),
            t("newsletter.benefits.2"),
            t("newsletter.benefits.3"),
          ].map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                color: "var(--g2a-text-secondary)",
                fontSize: "0.8125rem",
                lineHeight: 1.55,
              }}
            >
              <Check
                size={14}
                style={{ color: "var(--g2a-brand-teal)", flexShrink: 0, marginTop: "0.2rem" }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--g2a-text-muted)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function StatusLine({ status }: { status: "idle" | "loading" | "success" | "error" }) {
  const { t } = useLanguage();
  if (status === "success") {
    return (
      <p
        role="status"
        style={{
          color: "#10b981",
          marginTop: "0.75rem",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <Check size={14} />
        {t("newsletter.success")}
      </p>
    );
  }
  if (status === "error") {
    return (
      <p
        role="alert"
        style={{
          color: "#ef4444",
          marginTop: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        {t("newsletter.error")}
      </p>
    );
  }
  return null;
}

const honeypotStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: "-9999px",
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
};
