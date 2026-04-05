import { useState } from "react";
import logoLight from "../assets/light.png";
import logoDark  from "../assets/dark.png";

type Step = "email" | "sent";

export default function ForgotPassword({
  onBack,
}: {
  onBack: () => void;
}) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [step,    setStep]    = useState<Step>("email");
  const [dark,    setDark]    = useState(
    () => localStorage.getItem("dark") === "true"
  );

  const toggleDark = () => setDark((d) => !d);

  // ── Send the initial reset link ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.");
        return;
      }
      setStep("sent");
    } catch {
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend the reset link ────────────────────────────────────────────────
  const handleResend = async () => {
    setError(null);
    setResending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to resend. Please try again.");
      }
      // stay on "sent" step — link was re-sent
    } catch {
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className={`ts-shell login-shell${dark ? " dark" : ""}`}
      style={{ fontFamily: "var(--font)" }}
    >
      <div className="login-grid-overlay" aria-hidden />
      <div className="login-glow login-glow--tl" aria-hidden />
      <div className="login-glow login-glow--br" aria-hidden />

      {/* ════════════ LEFT PANEL ════════════ */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo-wrap">
            <img src={dark ? logoDark : logoLight} alt="Moviroo logo" className="login-logo-img" />
          </div>
          <div>
            <div className="login-brand-name ts-h">Moviroo</div>
            <div className="login-brand-sub ts-faint">Operations Console</div>
          </div>
        </div>

        <div className="login-hero">
          <div className="login-status-badge">
            <span className="login-status-dot" aria-hidden />
            <span>ACCOUNT RECOVERY</span>
          </div>
          <h1 className="login-headline ts-h">
            Reset Your<span className="login-headline-accent"> Access</span> Securely.
          </h1>
          <p className="login-subheadline ts-muted">
            Enter your registered email and we'll send you a secure link to restore access to your operations console.
          </p>
          <div className="ts-card login-kpi-strip">
            {[
              { value: "256-bit", label: "Encryption"  },
              { value: "30 min",  label: "Link Expiry" },
              { value: "1-time",  label: "Use Only"    },
            ].map((s, i) => (
              <div key={s.label} className={`login-kpi-cell${i < 2 ? " login-kpi-cell--bordered" : ""}`}>
                <div className="ts-stat-value">{s.value}</div>
                <div className="ts-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="login-footer ts-faint">
          © {new Date().getFullYear()} moviroo Inc. — All rights reserved.
        </p>
      </div>

      {/* ════════════ RIGHT PANEL ════════════ */}
      <div className="ts-card login-right">
        <button
          type="button"
          onClick={toggleDark}
          className="ts-btn-ghost login-theme-toggle"
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {step === "email" ? (
          /* ── Step 1: Enter email ── */
          <>
            <div className="login-form-header">
              <h2 className="login-form-title ts-h">Forgot Password</h2>
              <p className="ts-muted" style={{ fontSize: ".875rem" }}>
                Enter your email address and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email */}
              <div>
                <label className="ts-label" htmlFor="forgot-email">Email Address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon" aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                    </svg>
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@moviroo.io"
                    className="ts-input login-input-padded"
                  />
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#ef4444",
                  fontSize: ".875rem",
                  textAlign: "center",
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="ts-btn-primary login-submit-btn"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              {/* Back to login */}
              <button
                type="button"
                onClick={onBack}
                className="ts-btn-ghost login-submit-btn"
                style={{ marginTop: "-.25rem" }}
              >
                ← Back to Sign In
              </button>
            </form>
          </>
        ) : (
          /* ── Step 2: Email sent confirmation ── */
          <>
            <div className="login-form-header">
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--brand-from), var(--brand-to))",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1rem",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
                </svg>
              </div>
              <h2 className="login-form-title ts-h">Check your inbox</h2>
              <p className="ts-muted" style={{ fontSize: ".875rem" }}>
                We've sent a password reset link to{" "}
                <strong style={{ color: "var(--text-h)" }}>{email}</strong>.
                The link expires in 30 minutes.
              </p>
            </div>

            {/* Error banner (shown if resend fails) */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#ef4444",
                fontSize: ".875rem",
                textAlign: "center",
                marginBottom: ".75rem",
              }}>
                {error}
              </div>
            )}

            <div className="login-form" style={{ gap: ".75rem" }}>
              {/* Resend — actually calls the API again */}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="ts-btn-primary login-submit-btn"
              >
                {resending ? "Sending…" : "Resend Email"}
              </button>

              {/* Try a different email */}
              <button
                type="button"
                onClick={() => { setStep("email"); setError(null); }}
                className="ts-btn-ghost login-submit-btn"
              >
                Try a different email
              </button>

              {/* Back to login */}
              <button
                type="button"
                onClick={onBack}
                className="ts-btn-ghost login-submit-btn"
                style={{ marginTop: "-.25rem" }}
              >
                ← Back to Sign In
              </button>
            </div>
          </>
        )}

        <div className="ts-card-inner login-security-note">
          <span aria-hidden style={{ fontSize: "1rem", flexShrink: 0, marginTop: "2px" }}>🛡️</span>
          <p className="ts-muted" style={{ fontSize: ".75rem", margin: 0, lineHeight: 1.6 }}>
            Reset links are single-use and expire after 30 minutes. If you didn't request this, you can safely ignore it.
          </p>
        </div>
      </div>
    </div>
  );
}