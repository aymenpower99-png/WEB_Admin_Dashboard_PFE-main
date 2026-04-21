import type { RideStatus } from "../../../api/rides";
import { statusLabel } from "../../../api/rides";

// "SCHEDULED" is a display-only variant (PENDING + confirmedAt set)
export type DisplayStatus = RideStatus | "SCHEDULED";

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

const CFG: Record<string, React.CSSProperties> = {
  SCHEDULED: {
    ...BADGE_BASE,
    background: "rgba(20,184,166,0.12)",
    color: "#0d9488",
    borderColor: "rgba(20,184,166,0.35)",
  },
  PENDING: {
    ...BADGE_BASE,
    background: "#fef9c3",
    color: "#854d0e",
    borderColor: "#fde047",
  },
  SEARCHING_DRIVER: {
    ...BADGE_BASE,
    background: "rgba(37,99,235,0.12)",
    color: "#2563eb",
    borderColor: "rgba(37,99,235,0.35)",
  },
  ASSIGNED: {
    ...BADGE_BASE,
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.4)",
  },
  EN_ROUTE_TO_PICKUP: {
    ...BADGE_BASE,
    background: "rgba(59,130,246,0.12)",
    color: "#3b82f6",
    borderColor: "rgba(59,130,246,0.35)",
  },
  ARRIVED: {
    ...BADGE_BASE,
    background: "rgba(234,88,12,0.12)",
    color: "#c2410c",
    borderColor: "rgba(234,88,12,0.35)",
  },
  IN_TRIP: {
    ...BADGE_BASE,
    background: "rgba(99,102,241,0.12)",
    color: "#6366f1",
    borderColor: "rgba(99,102,241,0.35)",
  },
  COMPLETED: {
    ...BADGE_BASE,
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.4)",
  },
  CANCELLED: {
    ...BADGE_BASE,
    background: "rgba(220,38,38,0.12)",
    color: "#dc2626",
    borderColor: "rgba(220,38,38,0.35)",
  },
};

export function RideStatusBadge({ status }: { status: DisplayStatus | string }) {
  const style = CFG[status] ?? CFG.PENDING;
  const label = status === "SCHEDULED" ? "Scheduled" : statusLabel(status as RideStatus);
  return <span style={style}>{label}</span>;
}
