import { useState } from "react";
import type { DriverEarningRecord } from "../../../../api/billing";
import { driversApi } from "../../../../api/drivers";
import { TD, ROW_H } from "./DriverEarningsTypes";

interface Props {
  record:    DriverEarningRecord;
  index:     number;
  onRefresh: () => void;
}

export default function DriverEarningsTableRow({ record, index, onRefresh }: Props) {
  const [editing, setEditing] = useState(false);
  const [value,   setValue]   = useState(String(record.fixedSalary));
  const [saving,  setSaving]  = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await driversApi.update(record.driverProfileId, {
        fixedMonthlySalary: Number(value),
      });
      setEditing(false);
      onRefresh();
    } catch {
      alert("Failed to update salary");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setValue(String(record.fixedSalary));
    setEditing(false);
  };

  return (
    <tr className="ts-tr" style={{ height: ROW_H }}>

      {/* # */}
      <td style={TD}>{index}</td>

      {/* Driver */}
      <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>
        {record.driverName}
      </td>

      {/* Rides */}
      <td style={TD}>{record.completedTrips}</td>

      {/* Salary — inline edit */}
      <td style={TD}>
        {editing ? (
          <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                width:        70,
                fontSize:     "0.72rem",
                padding:      "0.2rem 0.4rem",
                border:       "1px solid var(--border)",
                borderRadius: 4,
                background:   "var(--bg-card)",
                color:        "var(--text-h)",
              }}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                fontSize:     "0.65rem",
                padding:      "0.15rem 0.45rem",
                background:   "#10b981",
                color:        "#fff",
                border:       "none",
                borderRadius: 4,
                cursor:       "pointer",
              }}
            >
              {saving ? "…" : "✓"}
            </button>
            <button
              onClick={handleCancel}
              style={{
                fontSize:     "0.65rem",
                padding:      "0.15rem 0.45rem",
                background:   "var(--border)",
                color:        "var(--text-h)",
                border:       "none",
                borderRadius: 4,
                cursor:       "pointer",
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <span>{record.fixedSalary.toLocaleString()} DT</span>
        )}
      </td>

      {/* Commission */}
      <td style={TD}>
        <span style={{ color: "#10b981", fontWeight: 600 }}>
          +{record.totalBonuses.toLocaleString()} DT
        </span>
      </td>

      {/* Net Earnings */}
      <td style={TD}>
        <span style={{ fontWeight: 700 }}>
          {record.netEarnings.toLocaleString()} DT
        </span>
      </td>

      {/* Actions */}
      <td style={{ ...TD, textAlign: "center" as const }}>
        {!editing && (
          <button
            className="ts-btn-ghost"
            style={{ padding: "0.2rem 0.5rem", fontSize: "0.65rem" }}
            onClick={() => { setValue(String(record.fixedSalary)); setEditing(true); }}
          >
            Edit Salary
          </button>
        )}
      </td>
    </tr>
  );
}
