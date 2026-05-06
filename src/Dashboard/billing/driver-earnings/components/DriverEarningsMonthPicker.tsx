import { getMonthOptions } from "./DriverEarningsTypes";

interface Props {
  value:    string;
  onChange: (month: string) => void;
}

export default function DriverEarningsMonthPicker({ value, onChange }: Props) {
  const options = getMonthOptions();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize:     "0.72rem",
        padding:      "0.3rem 0.6rem",
        borderRadius: "0.5rem",
        border:       "1px solid var(--border)",
        background:   "var(--bg-card)",
        color:        "var(--text-h)",
        fontWeight:   600,
        cursor:       "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
