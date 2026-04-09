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
  pending: { ...BADGE_BASE, background: "#fef9c3",           color: "#854d0e",            border: "1px solid #fde047" }, // ← amber/yellow for pending
  blocked: { ...BADGE_BASE, background: "var(--blocked-bg)", color: "var(--blocked-fg)", border: "1px solid var(--border)" },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_BADGE[status] ?? STATUS_BADGE.active;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={style}>{label}</span>;
}