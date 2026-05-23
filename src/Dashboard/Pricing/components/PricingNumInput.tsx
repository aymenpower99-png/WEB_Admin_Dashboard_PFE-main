interface PricingNumInputProps {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}

export default function PricingNumInput({ value, onChange, step = 0.01, min = 0 }: PricingNumInputProps) {
  return (
    <input
      type="number"
      step={step}
      min={min}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      style={{
        width: "100%",
        padding: "6px 10px",
        fontSize: ".82rem",
        fontWeight: 600,
        borderRadius: 8,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text-h)",
        outline: "none",
        fontFamily: "var(--font)",
        transition: "border-color .15s, box-shadow .15s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--brand-to)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,.12)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}
