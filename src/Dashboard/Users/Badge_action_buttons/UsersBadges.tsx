// ── Shared badge base style ───────────────────────────────────────────────────
const BADGE_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: ".72rem",
  fontWeight: 700,
  whiteSpace: "nowrap",
  lineHeight: 1,
};

const STATUS_BADGE: Record<string, React.CSSProperties> = {
  active:  { ...BADGE_BASE, background: "var(--active-bg)",  color: "var(--active-fg)",  border: "1px solid var(--border)" },
  pending: { ...BADGE_BASE, background: "#fef9c3",           color: "#854d0e",            border: "1px solid #fde047" },
  blocked: { ...BADGE_BASE, background: "var(--blocked-bg)", color: "var(--blocked-fg)", border: "1px solid var(--border)" },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_BADGE[status] ?? STATUS_BADGE.active;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={style}>{label}</span>;
}

export function EmailVerifiedBadge({ verified }: { verified: boolean }) {
  const style: React.CSSProperties = verified
    ? { ...BADGE_BASE, background: "rgba(34,197,94,0.12)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.3)" }
    : { ...BADGE_BASE, background: "rgba(239,68,68,0.10)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.25)" };
  return <span style={style}>{verified ? " Verified" : "❌ Not Verified"}</span>;
}

const PROVIDER_STYLE: Record<string, React.CSSProperties> = {
  manual:   { ...BADGE_BASE, background: "var(--bg-inner)", color: "var(--text-muted)", border: "1px solid var(--border)" },
  google:   { ...BADGE_BASE, background: "rgba(234,67,53,0.10)",  color: "#ea4335", border: "1px solid rgba(234,67,53,0.25)" },
  apple:    { ...BADGE_BASE, background: "rgba(0,0,0,0.07)",      color: "var(--text-h)", border: "1px solid var(--border)" },
  facebook: { ...BADGE_BASE, background: "rgba(24,119,242,0.10)", color: "#1877f2", border: "1px solid rgba(24,119,242,0.25)" },
};

const PROVIDER_LABEL: Record<string, string> = {
  manual:   "Manual",
  google:   "🔴 Google",
  apple:    "🍎 Apple",
  facebook: "🔵 Facebook",
};

export function ProviderBadge({ provider }: { provider: string }) {
  const key = (provider ?? "manual").toLowerCase();
  const style = PROVIDER_STYLE[key] ?? PROVIDER_STYLE.manual;
  const label = PROVIDER_LABEL[key] ?? provider;
  return <span style={style}>{label}</span>;
}