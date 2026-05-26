import { useState, useCallback } from "react";
import PricingNumInput from "./PricingNumInput";
import PricingMultBadge from "./PricingMultBadge";
import type { VehicleClass } from "../../../api/classes";

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

interface PricingCarTypesSectionProps {
  classes: VehicleClass[];
  onChange: (id: string, multiplier: number) => void;
  savingId?: string | null;
}

export default function PricingCarTypesSection({
  classes,
  onChange,
  savingId,
}: PricingCarTypesSectionProps) {
  // Local optimistic state so inputs feel responsive
  const [local, setLocal] = useState<Record<string, number>>({});

  const handleChange = useCallback(
    (id: string, value: number) => {
      setLocal((prev) => ({ ...prev, [id]: value }));
      onChange(id, value);
    },
    [onChange]
  );

  const getValue = (cls: VehicleClass) => {
    if (local[cls.id] !== undefined) return local[cls.id];
    const m = cls.multiplier;
    return typeof m === "number" ? m : parseFloat(m as any) || 1.0;
  };

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
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "45%" }} />
        </colgroup>
        <thead>
          <tr>
            <th style={TH}>Class</th>
            <th style={TH}>Seats</th>
            <th style={TH}>Status</th>
            <th style={TH}>Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr
              key={cls.id}
              style={{
                transition: "background .12s",
                opacity: !cls.isActive ? 0.5 : 1,
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
                  {cls.name}
                </span>
              </td>
              <td style={TD}>
                <span style={{ fontSize: ".75rem", color: "var(--text-faint)" }}>
                  {cls.seats}
                </span>
              </td>
              <td style={TD}>
                <span
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    color: cls.isActive ? "#22c55e" : "#ef4444",
                  }}
                >
                  {cls.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td style={TD}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{ width: 110 }}>
                    <PricingNumInput
                      value={getValue(cls)}
                      onChange={(nv) => handleChange(cls.id, nv)}
                      step={0.05}
                      disabled={savingId === cls.id}
                    />
                  </div>
                  <PricingMultBadge value={getValue(cls)} />
                  {savingId === cls.id && (
                    <span style={{ fontSize: ".7rem", color: "var(--text-faint)" }}>
                      Saving…
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
