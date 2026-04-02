// ============================================================
// FILE: StatusPill.tsx
// PATH: src/Dashboard/Drivers & Vehicles/vehicles/components/StatusPill.tsx
// ============================================================

import type { Vehicle } from "../types";

export const STATUS_CFG: Record<Vehicle["status"], { label: string; bg: string; fg: string }> = {
  Pending:     { label: "Pending",     bg: "#fef3c7", fg: "#92400e" },
  Available:   { label: "Available",   bg: "#d1fae5", fg: "#065f46" },
  On_Trip:     { label: "On Trip",     bg: "#dbeafe", fg: "#1e40af" },
  Maintenance: { label: "Maintenance", bg: "#fee2e2", fg: "#991b1b" },
};

export default function StatusPill({ status }: { status: Vehicle["status"] }) {
  const c = STATUS_CFG[status] ?? { label: status, bg: "#f3f4f6", fg: "#6b7280" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: ".22rem .75rem", borderRadius: "9999px",
      background: c.bg, color: c.fg,
      fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}