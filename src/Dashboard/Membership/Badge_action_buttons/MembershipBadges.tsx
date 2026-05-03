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

const MEMBERSHIP_BADGE: Record<string, React.CSSProperties> = {
  active: {
    ...BADGE_BASE,
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.4)",
  },
  inactive: {
    ...BADGE_BASE,
    background: "rgba(107,114,128,0.15)",
    color: "var(--text-muted)",
    borderColor: "rgba(107,114,128,0.35)",
  },
};

export function MembershipStatusBadge({ isActive }: { isActive: boolean }) {
  const key   = isActive ? "active" : "inactive";
  const label = isActive ? "Active"  : "Inactive";
  return <span style={MEMBERSHIP_BADGE[key]}>{label}</span>;
}
