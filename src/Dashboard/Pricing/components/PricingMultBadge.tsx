interface PricingMultBadgeProps {
  value: number;
}

export default function PricingMultBadge({ value }: PricingMultBadgeProps) {
  const style =
    value > 1.5
      ? { background: "rgba(239,68,68,.1)", color: "#ef4444", borderColor: "rgba(239,68,68,.25)" }
      : value > 1.1
        ? { background: "rgba(245,158,11,.1)", color: "#f59e0b", borderColor: "rgba(245,158,11,.25)" }
        : value < 1.0
          ? { background: "rgba(16,185,129,.1)", color: "#10b981", borderColor: "rgba(16,185,129,.25)" }
          : { background: "var(--bg-inner)", color: "var(--text-muted)", borderColor: "var(--border)" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: ".72rem",
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 9999,
        border: `1px solid ${style.borderColor}`,
        background: style.background,
        color: style.color,
        whiteSpace: "nowrap",
      }}
    >
      ×{value.toFixed(2)}
    </span>
  );
}
