import PricingNumInput from "./PricingNumInput";

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

interface PricingMLTableProps {
  title: string;
  params: Record<string, number | string>;
  onChange: (k: string, v: number | string) => void;
}

export default function PricingMLTable({ title, params, onChange }: PricingMLTableProps) {
  return (
    <div>
      <div
        style={{
          padding: ".6rem 1.25rem",
          background: "var(--bg-thead)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontSize: ".7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            color: "var(--text-muted)",
          }}
        >
          {title}
        </span>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "50%" }} />
        </colgroup>
        <thead>
          <tr>
            <th style={TH}>Parameter</th>
            <th style={TH}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(params).map(([k, v]) => (
            <tr
              key={k}
              style={{ transition: "background .12s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-inner)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <td style={{ ...TD, fontFamily: "monospace", fontSize: ".78rem", color: "var(--text-muted)" }}>
                {k}
              </td>
              <td style={TD}>
                {typeof v === "string" ? (
                  <input
                    value={v}
                    onChange={(e) => onChange(k, e.target.value)}
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
                ) : (
                  <PricingNumInput
                    value={v}
                    onChange={(nv) => onChange(k, nv)}
                    step={k.includes("rate") ? 0.01 : 1}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
