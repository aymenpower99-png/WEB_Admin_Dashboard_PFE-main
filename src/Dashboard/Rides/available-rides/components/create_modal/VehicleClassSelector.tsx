import { T, labelStyle, inputBase } from "./constants";
import type { VehicleClass } from "../../../../../api/classes";

interface VehicleClassSelectorProps {
  classes: VehicleClass[];
  classId: string;
  error?: string;
  onClassIdChange: (id: string) => void;
  onClearError: () => void;
}

export function VehicleClassSelector({
  classes,
  classId,
  error,
  onClassIdChange,
  onClearError,
}: VehicleClassSelectorProps) {
  return (
    <div>
      <label style={labelStyle}>Vehicle Class *</label>
      <select
        className="crm-select"
        value={classId}
        onChange={(e) => {
          onClassIdChange(e.target.value);
          onClearError();
        }}
        style={{
          ...inputBase,
          borderColor: error ? T.red : T.border,
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right .85rem center",
          paddingRight: "2.2rem",
        }}
      >
        <option value="">Select a class…</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.seats} seats
          </option>
        ))}
      </select>
      {error && (
        <span
          style={{
            color: T.red,
            fontSize: ".68rem",
            marginTop: ".3rem",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
