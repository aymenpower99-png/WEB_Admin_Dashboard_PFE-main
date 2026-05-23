import type { PricingStatus } from "../../../api/pricing";

interface PricingStatusBannerProps {
  status: PricingStatus;
  errorMsg: string;
}

export default function PricingStatusBanner({ status, errorMsg }: PricingStatusBannerProps) {
  if (status === "idle" || status === "saving") return null;

  const variants: Record<string, { outer: React.CSSProperties; dot: string; msg: string }> = {
    loading: {
      outer: { background: "rgba(59,130,246,.08)", borderColor: "rgba(59,130,246,.2)", color: "#3b82f6" },
      dot: "#3b82f6",
      msg: "Loading configuration…",
    },
    saved: {
      outer: { background: "rgba(16,185,129,.08)", borderColor: "rgba(16,185,129,.2)", color: "#10b981" },
      dot: "#10b981",
      msg: "Configuration saved successfully.",
    },
    error: {
      outer: { background: "rgba(239,68,68,.08)", borderColor: "rgba(239,68,68,.2)", color: "#ef4444" },
      dot: "#ef4444",
      msg: `Error: ${errorMsg}`,
    },
  };

  const v = variants[status];
  if (!v) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".75rem",
        borderRadius: ".75rem",
        border: `1px solid ${v.outer.borderColor}`,
        padding: ".75rem 1.25rem",
        fontSize: ".82rem",
        fontWeight: 600,
        background: v.outer.background,
        color: v.outer.color,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: v.dot,
          flexShrink: 0,
        }}
      />
      {v.msg}
    </div>
  );
}
