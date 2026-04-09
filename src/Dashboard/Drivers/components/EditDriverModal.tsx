import { useState, useEffect } from "react";
import { driversApi, type DriverProfile } from "../../../api/drivers";
import apiClient from "../../../api/apiClient";

interface Props {
  driver: DriverProfile;
  onClose: () => void;
  onSaved: (d: DriverProfile) => void;
}

interface VehicleOption {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string | null;
}

export default function EditDriverModal({ driver, onClose, onSaved }: Props) {
  const [vehicleId, setVehicleId] = useState<string>(driver.vehicle?.id ?? "");
  const [vehicles,  setVehicles]  = useState<VehicleOption[]>([]);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    apiClient.get("/vehicles", { params: { limit: 200 } })
      .then(res => {
        const list: any[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setVehicles(list.map(v => ({
          id: v.id, make: v.make, model: v.model,
          year: v.year, licensePlate: v.licensePlate,
        })));
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const updated = await driversApi.update(driver.id, {
        ...(vehicleId ? { vehicleId } : {}),
      });
      onSaved(updated); onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save driver.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally { setSaving(false); }
  }

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 440 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Edit Driver — {driver.firstName} {driver.lastName}
            </h2>
            <p className="ts-page-subtitle">Assign a vehicle to this driver.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 8, padding: "8px 14px", color: "#ef4444", fontSize: ".875rem",
            }}>
              {error}
            </div>
          )}

          {/* Assign Vehicle */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label className="ts-label">Assign Vehicle</label>
            <select
              className="ts-input"
              value={vehicleId}
              onChange={e => setVehicleId(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">— No vehicle assigned —</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model}{v.licensePlate ? ` · ${v.licensePlate}` : ""}
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <span style={{ fontSize: ".78rem", color: "#7c3aed" }}>
                Vehicle selected: {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </span>
            )}
          </div>

          {/* Info hint */}
          <div style={{
            padding: ".65rem .9rem", borderRadius: 8,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            fontSize: ".8rem", color: "var(--text-muted)", lineHeight: 1.6,
          }}>
            After assigning a vehicle, go to <strong>Work Areas</strong> to assign a work area.
            Once both are done, the driver status becomes <strong>Offline</strong> and they can go online.
          </div>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}