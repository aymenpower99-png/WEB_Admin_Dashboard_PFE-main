import type { AdminUser } from "../../../api/users";

// ── Shared badge base style ──────────────────────────────────────────────────
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

// ── Status badge styles ──────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, React.CSSProperties> = {
  active:  { ...BADGE_BASE, background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
  pending: { ...BADGE_BASE, background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" },
  blocked: { ...BADGE_BASE, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" },
};

// ── Profile badge styles ─────────────────────────────────────────────────────
const PROFILE_COMPLETE_STYLE: React.CSSProperties = {
  ...BADGE_BASE,
  background: "#d1fae5",
  color: "#065f46",
  border: "1px solid #6ee7b7",
};

const PROFILE_INCOMPLETE_STYLE: React.CSSProperties = {
  ...BADGE_BASE,
  background: "#fff7ed",
  color: "#ea580c",
  border: "1px solid #fed7aa",
};

// ── StatusBadge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_BADGE[status] ?? STATUS_BADGE.active;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={style}>{label}</span>;
}

// ── ProfileCell ──────────────────────────────────────────────────────────────
export function ProfileCell({ u }: { u: AdminUser }) {
  if (u.role !== "driver") {
    return <span style={PROFILE_COMPLETE_STYLE}>Complete</span>;
  }
  if (u.status === "pending") {
    return <span style={{ color: "var(--text-faint)", fontSize: ".75rem" }}>Awaiting invite</span>;
  }
  if (u.profileComplete === false) {
    return <span style={PROFILE_INCOMPLETE_STYLE}>Not set up</span>;
  }
  if (u.profileComplete === true) {
    return <span style={PROFILE_COMPLETE_STYLE}>Complete</span>;
  }
  return <span style={{ color: "var(--text-faint)", fontSize: ".8rem" }}>—</span>;
}