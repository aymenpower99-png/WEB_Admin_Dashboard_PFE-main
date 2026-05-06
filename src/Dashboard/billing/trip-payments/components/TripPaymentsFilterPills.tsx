import { FILTER_TABS, type FilterTab } from "./TripPaymentsTypes";

const LABEL: Record<FilterTab, string> = {
  All:      "All",
  PENDING:  "Pending",
  PAID:     "Paid",
  REFUNDED: "Refunded",
};

interface Props {
  active:   FilterTab;
  onChange: (f: FilterTab) => void;
}

export default function TripPaymentsFilterPills({ active, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
      {FILTER_TABS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding:      ".3rem .85rem",
            borderRadius: "9999px",
            fontSize:     ".82rem",
            fontWeight:   600,
            cursor:       "pointer",
            border:       "none",
            background:   active === f ? "#7c3aed" : "var(--bg-inner)",
            color:        active === f ? "#fff"    : "var(--text-muted)",
            transition:   "all .15s",
          }}
        >
          {LABEL[f]}
        </button>
      ))}
    </div>
  );
}
