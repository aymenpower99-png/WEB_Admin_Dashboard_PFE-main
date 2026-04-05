// ── Shared badge base ────────────────────────────────────────────────────────
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

// ── Availability status badge styles ─────────────────────────────────────────
const AVAILABILITY_BADGE: Record<string, React.CSSProperties> = {
  online:  { ...BADGE_BASE, background: "#d1fae5", color: "#065f46", borderWidth: "1px", borderStyle: "solid", borderColor: "#6ee7b7" },
  offline: { ...BADGE_BASE, background: "#f3f4f6", color: "#6b7280", borderWidth: "1px", borderStyle: "solid", borderColor: "#d1d5db" },
  busy:    { ...BADGE_BASE, background: "#fef3c7", color: "#92400e", borderWidth: "1px", borderStyle: "solid", borderColor: "#fcd34d" },
};

// ── DriverStatusBadge ─────────────────────────────────────────────────────────
export function DriverStatusBadge({ status }: { status: string }) {
  const style = AVAILABILITY_BADGE[status] ?? AVAILABILITY_BADGE.offline;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={style}>{label}</span>;
}