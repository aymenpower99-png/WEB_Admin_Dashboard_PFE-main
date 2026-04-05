import type { Vehicle } from "../types";

export const STATUS_CFG: Record<Vehicle["status"], { label: string; bg: string; fg: string }> = {
  Pending:     { label: "Pending",     bg: "var(--pending-bg)", fg: "var(--pending-fg)" },
  Available:   { label: "Available",   bg: "var(--active-bg)",  fg: "var(--active-fg)"  },
  On_Trip:     { label: "On Trip",     bg: "var(--rider-bg)",   fg: "var(--rider-fg)"   },
  Maintenance: { label: "Maintenance", bg: "var(--blocked-bg)", fg: "var(--blocked-fg)" },
};

export default function StatusPill({ status }: { status: Vehicle["status"] }) {
  const c = STATUS_CFG[status] ?? { label: status, bg: "var(--bg-inner)", fg: "var(--text-muted)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: ".22rem .75rem", borderRadius: "9999px",
      background: c.bg, color: c.fg,
      fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
      border: "1px solid var(--border)",
    }}>
      {c.label}
    </span>
  );
}