import type { Driver } from "../types";
import { STATUS_CFG } from "./DriversTypes";

export default function DriverStatusPill({
  status,
}: {
  status: Driver["status"];
}) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.offline;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".35rem",
        padding: ".22rem .7rem",
        borderRadius: "9999px",
        background: c.bg,
        color: c.fg,
        fontSize: ".78rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {c.label}
    </span>
  );
}
