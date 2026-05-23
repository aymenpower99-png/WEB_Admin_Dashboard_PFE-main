import PricingNumInput from "./PricingNumInput";
import PricingMultBadge from "./PricingMultBadge";

interface PricingSingleRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  note: string;
}

export default function PricingSingleRow({ label, value, onChange, note }: PricingSingleRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".75rem",
        padding: ".85rem 1.25rem",
        flexWrap: "wrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-inner)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        style={{
          fontSize: ".82rem",
          fontWeight: 600,
          color: "var(--text-h)",
          width: 140,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ width: 120, flexShrink: 0 }}>
        <PricingNumInput value={value} onChange={onChange} step={0.05} />
      </div>
      <PricingMultBadge value={value} />
      <span
        style={{
          fontSize: ".72rem",
          color: "var(--text-faint)",
          marginLeft: "auto",
        }}
      >
        {note}
      </span>
    </div>
  );
}
