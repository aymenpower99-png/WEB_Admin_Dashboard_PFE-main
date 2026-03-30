import { useState } from "react";
import logoLight from "../assets/light.png";
import logoDark from "../assets/dark.png";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   LoginAdmin — fully migrated to TravelSync design-system CSS.
   All dark-mode switching is handled by toggling the `.dark`
   class on the root wrapper (no more per-token ternaries).
───────────────────────────────────────────────────────────── */

export default function LoginAdmin({
  onLogin,
}: {
  onLogin: (dark: boolean) => void;
}) {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "false"
  );

  const navigate = useNavigate();

  const toggleDark = () => setDark((d) => !d);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(dark);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1800);
  };

  return (
    /* Root wrapper — add/remove `.dark` to flip every CSS variable */
    <div
      className={`ts-shell login-shell${dark ? " dark" : ""}`}
      style={{ fontFamily: "var(--font)" }}
    >
      {/* ── decorative grid overlay ── */}
      <div className="login-grid-overlay" aria-hidden />
      {/* ── glow blobs ── */}
      <div className="login-glow login-glow--tl" aria-hidden />
      <div className="login-glow login-glow--br" aria-hidden />

      {/* ════════════ LEFT PANEL ════════════ */}
      <div className="login-left">
        {/* Logo + wordmark */}
        <div className="login-brand">
          <div className="login-logo-wrap">
            <img
              src={dark ? logoDark : logoLight}
              alt="Moviroo logo"
              className="login-logo-img"
            />
          </div>
          <div>
            <div className="login-brand-name ts-h">Moviroo</div>
            <div className="login-brand-sub ts-faint">Operations Console</div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="login-hero">
          {/* Status badge */}
          <div className="login-status-badge">
            <span className="login-status-dot" aria-hidden />
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <h1 className="login-headline ts-h">
            Transport
            <span className="login-headline-accent"> Command</span> Center.
          </h1>

          <p className="login-subheadline ts-muted">
            Real-time fleet oversight, driver management, and route
            optimization — built for professionals.
          </p>

          {/* KPI strip */}
          <div className="ts-card login-kpi-strip">
            {[
              { value: "312",   label: "Active Vehicles" },
              { value: "98.2%", label: "On-Time Rate"    },
              { value: "4.8K",  label: "Trips Today"     },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`login-kpi-cell${i < 2 ? " login-kpi-cell--bordered" : ""}`}
              >
                <div className="ts-stat-value">{s.value}</div>
                <div className="ts-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="login-footer ts-faint">
          © {new Date().getFullYear()} moviroo Inc. — All rights reserved.
        </p>
      </div>

      {/* ════════════ RIGHT PANEL ════════════ */}
      <div className="ts-card login-right">
        {/* Dark-mode toggle */}
        <button
          type="button"
          onClick={toggleDark}
          className="ts-btn-ghost login-theme-toggle"
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* Heading */}
        <div className="login-form-header">
          <h2 className="login-form-title ts-h">Sign in</h2>
          <p className="ts-muted" style={{ fontSize: ".875rem" }}>
            Access restricted to authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* ── Email ── */}
          <div>
            <label className="ts-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden>
                {/* envelope */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 7 10-7"/>
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@moviroo.io"
                className="ts-input login-input-padded"
              />
            </div>
          </div>

          {/* ── Password ── */}
          <div>
            <label className="ts-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden>
                {/* lock */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="ts-input login-input-padded login-input-padded--right"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="ts-icon-btn login-pass-toggle"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  /* eye-off */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /* eye */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ── Remember + Forgot ── */}
          <div className="login-row-between">
            <label className="login-remember-label" onClick={() => setRemember((r) => !r)}>
              <div
                className="login-checkbox"
                style={{
                  borderColor: remember ? "var(--brand-from)" : "var(--border)",
                  background: remember
                    ? "linear-gradient(135deg, var(--brand-from), var(--brand-to))"
                    : "transparent",
                }}
              >
                {remember && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span className="ts-muted" style={{ fontSize: ".875rem" }}>Remember me</span>
            </label>

            <button type="button" className="ts-link">Forgot password?</button>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="ts-btn-primary login-submit-btn"
          >
            {loading ? "Authenticating…" : "Sign in to Dashboard"}
          </button>
        </form>

        {/* Security note */}
        <div className="ts-card-inner login-security-note">
          <span aria-hidden style={{ fontSize: "1rem", flexShrink: 0, marginTop: "2px" }}>🛡️</span>
          <p className="ts-muted" style={{ fontSize: ".75rem", margin: 0, lineHeight: 1.6 }}>
            This system is monitored. Unauthorized access attempts are logged and reported.
          </p>
        </div>
      </div>

    </div>
  );
}