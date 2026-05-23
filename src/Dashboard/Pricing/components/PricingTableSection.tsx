import PricingNumInput from "./PricingNumInput";
import PricingMultBadge from "./PricingMultBadge";

const TH: React.CSSProperties = {
  padding: "0.65rem 1.25rem",
  fontSize: ".72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
  background: "var(--bg-thead)",
};

const TD: React.CSSProperties = {
  padding: "0.55rem 1.25rem",
  fontSize: ".82rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

interface PricingTableSectionProps {
  data: Record<string, number>;
  keyLabel: string;
  onChange: (k: string, v: number) => void;
  keyDisplay?: (k: string) => string;
}

export default function PricingTableSection({
  data,
  keyLabel,
  onChange,
  keyDisplay,
}: PricingTableSectionProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "55%" }} />
          <col style={{ width: "45%" }} />
        </colgroup>
        <thead>
          <tr>
            <th style={TH}>{keyLabel}</th>
            <th style={TH}>Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([k, v]) => (
            <tr
              key={k}
              style={{
                transition: "background .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-inner)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <td style={TD}>
                <span style={{ fontWeight: 600, color: "var(--text-h)" }}>
                  {keyDisplay ? keyDisplay(k) : k}
                </span>
              </td>
              <td style={TD}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{ width: 110 }}>
                    <PricingNumInput value={v} onChange={(nv) => onChange(k, nv)} step={0.05} />
                  </div>
                  <PricingMultBadge value={v} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
