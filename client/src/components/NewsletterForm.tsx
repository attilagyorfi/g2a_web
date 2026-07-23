/**
 * Reusable newsletter signup form.
 *
 * Two layouts:
 *   - "compact" — horizontal row: name + email + submit (footer band)
 *   - "full"    — stacked: name, email, topic chooser, consent (popup, /hirlevel)
 *
 * Contract:
 *   - Honeypot (hidden `website` input) — bots fill it, humans don't.
 *   - First name is REQUIRED on every variant (server-side enforced too).
 *   - Compact: implicit privacy notice line below the row, no checkbox.
 *   - Full: explicit GDPR consent checkbox + topic multi-select. Topics
 *     get serialised into the `tags` column on the server for filtering.
 *   - Disabled while in-flight; success/error shown inline.
 *
 * The server (newsletter.subscribe tRPC) handles deduplication, welcome
 * email with one-click unsubscribe, and rate limiting.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Mail, Loader2, Check } from "lucide-react";
import TurnstileWidget, { useTurnstileGate } from "@/components/TurnstileWidget";

type Variant = "compact" | "full";

// Topic codes are stable strings — they end up in the DB tags column and the
// admin uses them to filter/segment. Don't rename without a data migration.
export const NEWSLETTER_TOPICS = ["strategy", "ai", "paid", "case_studies"] as const;
export type NewsletterTopic = (typeof NEWSLETTER_TOPICS)[number];

type Props = {
  variant?: Variant;
  /** Override CTA label (e.g. popup might use "Igen, feliratkozom"). */
  ctaLabel?: string;
  /** Show the small benefits checklist next to the form (full only). */
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
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  // Default to all topics — better conversion than starting empty. The user
  // can untick the ones they don't want before submitting.
  const [topics, setTopics] = useState<Set<NewsletterTopic>>(
    () => new Set(NEWSLETTER_TOPICS),
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  // Cloudflare Turnstile — feature-flagged. Token is populated by the
  // widget callback; submit is gated on it when the flag is on.
  const [turnstileToken, setTurnstileToken] = useState("");
  // Bot check gating — see useTurnstileGate. Stops the form from silently
  // dying when the widget can't issue a token.
  const turnstile = useTurnstileGate(turnstileToken);

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
    if (!email || !name) return;
    if (variant === "full" && !consent) return;
    if (variant === "full" && topics.size === 0) return;
    // Only hold back while the check is still expected to deliver a token.
    // If it failed outright we submit anyway and let the server answer.
    if (turnstile.waiting) return;
    setStatus("loading");
    subscribe.mutate({
      email,
      name,
      website,
      topics:
        variant === "full" ? Array.from(topics) : Array.from(NEWSLETTER_TOPICS),
      lang,
      turnstileToken: turnstileToken || undefined,
    });
  };

  const toggleTopic = (key: NewsletterTopic) => {
    setTopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allChecked = topics.size === NEWSLETTER_TOPICS.length;
  const toggleAll = () => {
    if (allChecked) setTopics(new Set());
    else setTopics(new Set(NEWSLETTER_TOPICS));
  };

  // ─── Compact (single-row name + email + submit) ────────────────────────
  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
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
            gridTemplateColumns: "minmax(140px, 1fr) minmax(220px, 2fr) auto",
            gap: "0.625rem",
          }}
          className="g2a-newsletter-compact-grid"
        >
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("newsletter.namePlaceholderRequired")}
            className="g2a-input"
            aria-label={t("newsletter.nameLabel")}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.emailPlaceholder")}
            className="g2a-input"
            aria-label={t("newsletter.emailLabel")}
          />
          <button
            type="submit"
            className="g2a-btn-primary"
            disabled={status === "loading"}
            style={{ flexShrink: 0, whiteSpace: "nowrap" }}
          >
            {status === "loading" ? (
              <Loader2
                size={14}
                style={{ marginRight: 6, animation: "spin 0.8s linear infinite" }}
              />
            ) : null}
            {ctaLabel ??
              (status === "loading"
                ? t("newsletter.submitting")
                : t("newsletter.submit"))}
          </button>
        </div>
        {/* Turnstile also runs on the compact band. It renders
            interaction-only (invisible), so it costs no layout — and without
            it this variant could never obtain a token, which left the footer
            signup permanently dead whenever the feature flag was on. */}
        <TurnstileWidget
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          onError={turnstile.markFailed}
        />
        <StatusLine status={status} />
        <style>{`
          @media (max-width: 600px) {
            .g2a-newsletter-compact-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </form>
    );
  }

  // ─── Full layout: name + email + topics + consent ──────────────────────
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
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
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
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
          className="g2a-newsletter-full-fields"
        >
          <FieldGroup label={t("newsletter.nameLabel")} required>
            <input
              type="text"
              required
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

        {/* Topic multi-select — at least one required */}
        <fieldset
          style={{
            border: "1px solid var(--g2a-border)",
            borderRadius: 10,
            padding: "1rem 1.1rem 1.1rem",
            margin: "0 0 1rem",
          }}
        >
          <legend
            style={{
              padding: "0 0.5rem",
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--g2a-text-muted)",
            }}
          >
            {t("newsletter.topics.legend")} *
          </legend>
          <p
            style={{
              color: "var(--g2a-text-secondary)",
              fontSize: "0.78rem",
              margin: "0 0 0.625rem",
              lineHeight: 1.5,
            }}
          >
            {t("newsletter.topics.help")}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.4rem",
            }}
          >
            {NEWSLETTER_TOPICS.map((key) => (
              <TopicCheckbox
                key={key}
                checked={topics.has(key)}
                onToggle={() => toggleTopic(key)}
                label={t(`newsletter.topics.${key}.label`)}
                desc={t(`newsletter.topics.${key}.desc`)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={toggleAll}
            style={{
              marginTop: "0.625rem",
              background: "none",
              border: "none",
              color: "var(--g2a-brand-teal)",
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.75rem",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {allChecked
              ? t("newsletter.topics.deselectAll")
              : t("newsletter.topics.selectAll")}
          </button>
        </fieldset>

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
            style={{
              marginTop: "0.18rem",
              accentColor: "var(--g2a-brand-teal)",
              flexShrink: 0,
            }}
          />
          <span>
            {t("newsletter.consent.before")}{" "}
            <Link
              href="/adatvedelmi-iranyelvek"
              style={{
                color: "var(--g2a-brand-teal)",
                textDecoration: "underline",
              }}
            >
              {t("newsletter.consent.linkText")}
            </Link>{" "}
            {t("newsletter.consent.after")}
          </span>
        </label>

        {/* Cloudflare Turnstile — full variant only (compact footer
            band doesn't have room and uses the existing honeypot +
            rate-limit defence alone). Renders nothing when the
            feature flag is off. */}
        <TurnstileWidget
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          onError={turnstile.markFailed}
        />
        {turnstile.failed && (
          <p role="status" style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.5, color: "#fbbf24" }}>
            {t("contact.turnstileUnavailable")}
          </p>
        )}

        <button
          type="submit"
          className="g2a-btn-primary"
          disabled={status === "loading" || !consent || topics.size === 0 || turnstile.waiting}
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
                style={{
                  color: "var(--g2a-brand-teal)",
                  flexShrink: 0,
                  marginTop: "0.2rem",
                }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      <style>{`
        @media (max-width: 480px) {
          .g2a-newsletter-full-fields {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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

function TopicCheckbox({
  checked,
  onToggle,
  label,
  desc,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  desc: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "flex-start",
        cursor: "pointer",
        padding: "0.5rem 0.625rem",
        borderRadius: 8,
        border: `1px solid ${checked ? "var(--g2a-brand-teal)" : "var(--g2a-border)"}`,
        background: checked ? "rgba(20,184,166,0.08)" : "transparent",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        style={{
          marginTop: "0.18rem",
          accentColor: "var(--g2a-brand-teal)",
          flexShrink: 0,
        }}
      />
      <span style={{ display: "block" }}>
        <span
          style={{
            display: "block",
            color: "var(--g2a-text-primary)",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.78rem",
            fontWeight: 600,
            marginBottom: "0.15rem",
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            color: "var(--g2a-text-secondary)",
            fontSize: "0.72rem",
            lineHeight: 1.45,
          }}
        >
          {desc}
        </span>
      </span>
    </label>
  );
}

function StatusLine({
  status,
}: {
  status: "idle" | "loading" | "success" | "error";
}) {
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
