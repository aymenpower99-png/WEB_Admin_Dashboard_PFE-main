const CLASS_CFG: Record<string, { label: string; color: string }> = {
  Economy:       { label: "Economy",     color: "#6366f1" },
  Standard:      { label: "Standard",    color: "#0ea5e9" },
  Comfort:       { label: "Comfort",     color: "#10b981" },
  "First Class": { label: "First Class", color: "#f59e0b" },
  Van:           { label: "Van",         color: "#8b5cf6" },
  "Mini Bus":    { label: "Mini Bus",    color: "#ef4444" },
};

export default function ClassBadge({ vehicleClass }: { vehicleClass?: string | null }) {
  const key = vehicleClass ?? "";
  const c = CLASS_CFG[key] ?? { label: key || "—", color: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: ".2rem .65rem", borderRadius: "9999px",
      background: `${c.color}22`, color: c.color,
      fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
      border: `1px solid ${c.color}44`,
    }}>
      {c.label}
    </span>
  );
}