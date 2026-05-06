import { STATUS_CFG } from "./TripPaymentsTypes";

export default function TripPaymentsStatusPill({ status }: { status: string }) {
  const c = (STATUS_CFG as Record<string, { label: string; bg: string; fg: string }>)[status]
    ?? { label: status, bg: "#f3f4f6", fg: "#6b7280" };

  return (
    <span
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        padding:      ".22rem .7rem",
        borderRadius: "9999px",
        background:   c.bg,
        color:        c.fg,
        fontSize:     ".75rem",
        fontWeight:   600,
        whiteSpace:   "nowrap",
      }}
    >
      {c.label}
    </span>
  );
}
