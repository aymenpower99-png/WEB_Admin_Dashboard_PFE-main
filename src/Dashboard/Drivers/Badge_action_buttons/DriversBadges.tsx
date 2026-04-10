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

const AVAILABILITY_BADGE: Record<string, React.CSSProperties> = {
  online: {
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
  pending: {
    ...BADGE_BASE,
    background: "#fef9c3",
    color: "#854d0e",
    borderColor: "#fde047",
  },
  setup_required: {
    ...BADGE_BASE,
    background: "rgba(234,88,12,0.12)",
    color: "#c2410c",
    borderColor: "rgba(234,88,12,0.35)",
  },
  on_trip: {
    ...BADGE_BASE,
    background: "rgba(99,102,241,0.12)",
    color: "#6366f1",
    borderColor: "rgba(99,102,241,0.35)",
  },
};

const STATUS_LABEL: Record<string, string> = {
  online:         "Online",
  offline:        "Offline",
  pending:        "Pending",
  setup_required: "Setup Required",
  on_trip:        "On Trip",
};

export function DriverStatusBadge({ status }: { status: string }) {
  const style = AVAILABILITY_BADGE[status] ?? AVAILABILITY_BADGE.offline;
  const label = STATUS_LABEL[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return <span style={style}>{label}</span>;
}