// ============================================================
// FILE: ChangeStatusModal.tsx
// Rules:
//   Pending     → NO changes allowed (locked until auto-promoted to Available)
//   Available   → Maintenance only
//   Maintenance → Available only
//   On_Trip     → NO changes allowed (trip system controls this)
// ============================================================

import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SyncRoundedIcon  from "@mui/icons-material/SyncRounded";
import LockRoundedIcon  from "@mui/icons-material/LockRounded";
import apiClient from "../../../api/apiClient";
import { mapBackendVehicle } from "../types";
import type { Vehicle } from "../types";

const TRANSITIONS: Partial<Record<Vehicle["status"], Vehicle["status"][]>> = {
  // Pending and On_Trip have NO transitions — they are locked
  Available:   ["Maintenance"],
  Maintenance: ["Available"],
};

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  Pending:     { bg: "#fef3c7", fg: "#92400e" },
  Available:   { bg: "#d1fae5", fg: "#065f46" },
  On_Trip:     { bg: "#dbeafe", fg: "#1e40af" },
  Maintenance: { bg: "#fee2e2", fg: "#991b1b" },
};

const LOCKED_MESSAGE: Partial<Record<Vehicle["status"], string>> = {
  Pending: "This vehicle is Pending — it becomes Available automatically once it has photos and an assigned driver.",
  On_Trip: "This vehicle is currently On Trip — status is managed by the trip system.",
};

async function callBackendTransition(
  vehicleId: string,
  to: Vehicle["status"],
): Promise<any> {
  if (to === "Maintenance") return apiClient.post(`/vehicles/${vehicleId}/maintenance`);
  if (to === "Available")   return apiClient.post(`/vehicles/${vehicleId}/maintenance/complete`);
  return apiClient.patch(`/vehicles/${vehicleId}`, { status: to });
}

const labelOf = (s: string) => s === "On_Trip" ? "On Trip" : s;

export default function ChangeStatusModal({ vehicle, onClose, onUpdated }: {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdated: (v: Vehicle) => void;
}) {
  const options   = TRANSITIONS[vehicle.status] ?? [];
  const isLocked  = options.length === 0;
  const lockMsg   = LOCKED_MESSAGE[vehicle.status];

  const [selected, setSelected] = useState<Vehicle["status"] | "">(options[0] ?? "");
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  const handleSave = async () => {
    if (!selected || isLocked) return;
    setSaving(true); setErr(null);
    try {
      const res = await callBackendTransition(vehicle.id, selected as Vehicle["status"]);
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
          <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--text-h)" }}>
            Change Status
          </p>
          <button className="ts-modal-close" onClick={onClose} disabled={saving}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
          <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-body)" }}>
            <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
          </p>

          {/* Current status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
            <span style={{
              padding: ".22rem .75rem", borderRadius: "9999px",
              fontSize: ".78rem", fontWeight: 600,
              background: STATUS_STYLE[vehicle.status]?.bg ?? "#f3f4f6",
              color:      STATUS_STYLE[vehicle.status]?.fg ?? "#6b7280",
            }}>
              {labelOf(vehicle.status)}
            </span>

            {!isLocked && (
              <>
                <SyncRoundedIcon style={{ fontSize: 18, color: "var(--text-faint)" }} />
                {options.map(opt => (
                  <button key={opt} onClick={() => setSelected(opt)} style={{
                    padding: ".22rem .75rem", borderRadius: "9999px",
                    fontSize: ".78rem", fontWeight: 600, cursor: "pointer",
                    background: selected === opt
                      ? (STATUS_STYLE[opt]?.bg ?? "#f3f4f6")
                      : "var(--bg-inner)",
                    color: selected === opt
                      ? (STATUS_STYLE[opt]?.fg ?? "#374151")
                      : "var(--text-muted)",
                    border: `2px solid ${selected === opt
                      ? (STATUS_STYLE[opt]?.fg ?? "#9ca3af")
                      : "var(--border)"}`,
                    transition: "all .15s",
                  }}>
                    {labelOf(opt)}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Locked notice */}
          {isLocked && lockMsg && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: ".5rem",
              background: "var(--bg-inner)", border: "1px solid var(--border)",
              borderRadius: ".5rem", padding: ".65rem .85rem",
            }}>
              <LockRoundedIcon style={{ fontSize: 15, color: "var(--text-faint)", marginTop: 1, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: ".78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {lockMsg}
              </p>
            </div>
          )}

          {err && <p style={{ margin: 0, fontSize: ".8rem", color: "#ef4444" }}>{err}</p>}
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>
            {isLocked ? "Close" : "Cancel"}
          </button>
          {!isLocked && (
            <button
              className="ts-btn-primary"
              onClick={handleSave}
              disabled={saving || !selected}
            >
              {saving ? "Saving…" : "Change Status"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}