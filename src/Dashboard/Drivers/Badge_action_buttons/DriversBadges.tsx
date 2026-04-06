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
  borderWidth: "1px",
  borderStyle: "solid",
};

// ── Availability status badge styles — semi-transparent so they work in dark mode ──
// ✅ Replaced hardcoded opaque hex backgrounds with rgba() so the pill looks
//    correct on both light (--bg-card) and dark (--bg-card dark) surfaces.
const AVAILABILITY_BADGE: Record<string, React.CSSProperties> = {
  online:  {
    ...BADGE_BASE,
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.4)",
  },
  offline: {
    ...BADGE_BASE,
    background: "rgba(107,114,128,0.15)",
    color: "var(--text-muted)",
    borderColor: "rgba(107,114,128,0.35)",
  },
  busy: {
    ...BADGE_BASE,
    background: "rgba(245,158,11,0.15)",
    color: "#d97706",
    borderColor: "rgba(245,158,11,0.4)",
  },
};

// ── DriverStatusBadge ─────────────────────────────────────────────────────────
export function DriverStatusBadge({ status }: { status: string }) {
  const style = AVAILABILITY_BADGE[status] ?? AVAILABILITY_BADGE.offline;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={style}>{label}</span>;
}