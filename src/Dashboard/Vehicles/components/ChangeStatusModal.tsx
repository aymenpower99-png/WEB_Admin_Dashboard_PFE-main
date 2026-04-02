// ============================================================
// FILE: ChangeStatusModal.tsx
// PATH: src/Dashboard/Drivers & Vehicles/vehicles/components/ChangeStatusModal.tsx
// ============================================================

import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SyncRoundedIcon  from "@mui/icons-material/SyncRounded";
import apiClient from "../../../api/apiClient";
import { mapBackendVehicle } from "../types";
import type { Vehicle } from "../types";

const TRANSITIONS: Partial<Record<Vehicle["status"], Vehicle["status"][]>> = {
  Available:   ["Maintenance"],
  Maintenance: ["Available"],
};

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  Available:   { bg: "#d1fae5", fg: "#065f46" },
  Maintenance: { bg: "#fee2e2", fg: "#991b1b" },
};

export default function ChangeStatusModal({ vehicle, onClose, onUpdated }: {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdated: (v: Vehicle) => void;
}) {
  const options  = TRANSITIONS[vehicle.status] ?? [];
  const [selected, setSelected] = useState<Vehicle["status"] | "">(options[0] ?? "");
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true); setErr(null);
    try {
      const res = await apiClient.patch<any>(`/vehicles/${vehicle.id}`, { status: selected });
      onUpdated(mapBackendVehicle(res.data));
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to update status.";
      setErr(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ts-overlay">
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-header">
          <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--text-h)" }}>Change Status</p>
          <button className="ts-modal-close" onClick={onClose} disabled={saving}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
          <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-body)" }}>
            <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
            {/* Current status */}
            <span style={{
              padding: ".22rem .75rem", borderRadius: "9999px",
              fontSize: ".78rem", fontWeight: 600,
              background: STATUS_STYLE[vehicle.status]?.bg ?? "#f3f4f6",
              color:      STATUS_STYLE[vehicle.status]?.fg ?? "#6b7280",
            }}>
              {vehicle.status}
            </span>

            <SyncRoundedIcon style={{ fontSize: 18, color: "var(--text-faint)" }} />

            {/* Target options */}
            {options.map(opt => (
              <button key={opt} onClick={() => setSelected(opt)} style={{
                padding: ".22rem .75rem", borderRadius: "9999px",
                fontSize: ".78rem", fontWeight: 600, cursor: "pointer",
                background: selected === opt ? (STATUS_STYLE[opt]?.bg ?? "#f3f4f6") : "var(--bg-inner)",
                color:      selected === opt ? (STATUS_STYLE[opt]?.fg ?? "#374151") : "var(--text-muted)",
                border: `2px solid ${selected === opt ? (STATUS_STYLE[opt]?.fg ?? "#9ca3af") : "var(--border)"}`,
                transition: "all .15s",
              }}>
                {opt}
              </button>
            ))}
          </div>

          {err && <p style={{ margin: 0, fontSize: ".8rem", color: "#ef4444" }}>{err}</p>}
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSave} disabled={saving || !selected}>
            {saving ? "Saving…" : "Change Status"}
          </button>
        </div>
      </div>
    </div>
  );
}