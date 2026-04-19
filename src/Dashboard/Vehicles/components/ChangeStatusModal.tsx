import { useState } from "react";
import { toast } from "sonner";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SyncRoundedIcon  from "@mui/icons-material/SyncRounded";
import LockRoundedIcon  from "@mui/icons-material/LockRounded";
import apiClient from "../../../api/apiClient";
import { mapBackendVehicle } from "../types";
import type { Vehicle } from "../types";

const TRANSITIONS: Partial<Record<Vehicle["status"], Vehicle["status"][]>> = {
  Pending:     ["Available"],
  Available:   ["Maintenance"],
  Maintenance: ["Available"],
};

// Use CSS variables so the modal adapts to dark/light mode
const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  Pending:     { bg: "var(--pending-bg)", fg: "var(--pending-fg)" },
  Available:   { bg: "var(--active-bg)",  fg: "var(--active-fg)"  },
  On_Trip:     { bg: "var(--rider-bg)",   fg: "var(--rider-fg)"   },
  Maintenance: { bg: "var(--blocked-bg)", fg: "var(--blocked-fg)" },
};

const LOCKED_MESSAGE: Partial<Record<Vehicle["status"], string>> = {
  On_Trip: "This vehicle is currently On Trip — status is managed by the trip system.",
};

async function callBackendTransition(vehicleId: string, from: Vehicle["status"], to: Vehicle["status"]): Promise<any> {
  if (to === "Maintenance") return apiClient.post(`/vehicles/${vehicleId}/maintenance`);
  if (to === "Available" && from === "Pending")     return apiClient.post(`/vehicles/${vehicleId}/activate`);
  if (to === "Available" && from === "Maintenance") return apiClient.post(`/vehicles/${vehicleId}/maintenance/complete`);
  return apiClient.patch(`/vehicles/${vehicleId}`, { status: to });
}

const labelOf = (s: string) => s === "On_Trip" ? "On Trip" : s;

export default function ChangeStatusModal({ vehicle, onClose, onUpdated }: {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdated: (v: Vehicle) => void;
}) {
  const options  = TRANSITIONS[vehicle.status] ?? [];
  const isLocked = options.length === 0;
  const lockMsg  = LOCKED_MESSAGE[vehicle.status];

  const [selected, setSelected] = useState<Vehicle["status"] | "">(options[0] ?? "");
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  const handleSave = async () => {
    if (!selected || isLocked) return;
    setSaving(true); setErr(null);
    try {
      const res = await callBackendTransition(vehicle.id, vehicle.status, selected as Vehicle["status"]);
      toast.success("Vehicle status updated");
      onUpdated(mapBackendVehicle(res.data));
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to update status.";
      setErr(Array.isArray(msg) ? msg.join(" · ") : String(msg));
      toast.error("Failed to update vehicle status");
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
            <span style={{
              padding: ".22rem .75rem", borderRadius: "9999px",
              fontSize: ".78rem", fontWeight: 600,
              background: STATUS_STYLE[vehicle.status]?.bg ?? "var(--bg-inner)",
              color:      STATUS_STYLE[vehicle.status]?.fg ?? "var(--text-muted)",
              border: "1px solid var(--border)",
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
                      ? (STATUS_STYLE[opt]?.bg ?? "var(--bg-inner)")
                      : "var(--bg-inner)",
                    color: selected === opt
                      ? (STATUS_STYLE[opt]?.fg ?? "var(--text-body)")
                      : "var(--text-muted)",
                    border: `2px solid ${selected === opt ? "var(--brand-from)" : "var(--border)"}`,
                    transition: "all .15s",
                  }}>
                    {labelOf(opt)}
                  </button>
                ))}
              </>
            )}
          </div>

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
            <button className="ts-btn-primary" onClick={handleSave} disabled={saving || !selected}>
              {saving ? "Saving…" : "Change Status"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}