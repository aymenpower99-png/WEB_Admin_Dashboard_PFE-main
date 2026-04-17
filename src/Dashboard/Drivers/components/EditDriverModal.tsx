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
  status: string;
}

export default function EditDriverModal({ driver, onClose, onSaved }: Props) {
  const [vehicleId, setVehicleId] = useState<string>(driver.vehicle?.id ?? "");
  const [vehicles,  setVehicles]  = useState<VehicleOption[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Fetch with status=Available filter — backend enforces this too, but we pre-filter in UI
    apiClient.get("/vehicles", { params: { limit: 200, status: "Available" } })
      .then(res => {
        const list: any[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        // Extra client-side guard: keep only Available vehicles
        const available = list.filter(v => v.status === "Available");
        setVehicles(available.map(v => ({
          id:           v.id,
          make:         v.make,
          model:        v.model,
          year:         v.year,
          licensePlate: v.licensePlate,
          status:       v.status,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const updated = await driversApi.update(driver.id, {
        ...(vehicleId ? { vehicleId } : {}),
      });
      onSaved(updated);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save driver.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setSaving(false);
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);

  // Current vehicle may already be assigned (driver.vehicle) — show it even if not in 'available' list
  const currentVehicleNotInList =
    driver.vehicle &&
    driver.vehicle.status === "Available" &&
    !vehicles.find(v => v.id === driver.vehicle!.id);

  const allOptions: VehicleOption[] = [
    ...(currentVehicleNotInList
      ? [{ ...driver.vehicle!, status: "Available" } as VehicleOption]
      : []),
    ...vehicles,
  ];

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 440 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Edit Driver — {driver.firstName} {driver.lastName}
            </h2>
            <p className="ts-page-subtitle">Assign an available vehicle to this driver.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
          {error && (
            <div className="ts-alert-error">
              {error}
            </div>
          )}

          {/* Current vehicle info */}
          {driver.vehicle && (
            <div style={{
              padding: ".65rem .9rem", borderRadius: 8,
              background: driver.vehicle.status === "Available"
                ? "rgba(16,185,129,0.06)"
                : "rgba(239,68,68,0.06)",
              border: `1px solid ${driver.vehicle.status === "Available"
                ? "rgba(16,185,129,0.25)"
                : "rgba(239,68,68,0.25)"}`,
              fontSize: ".8rem",
            }}>
              <div style={{ fontWeight: 700, color: "var(--text-h)", marginBottom: 2 }}>
                Current vehicle
              </div>
              <div style={{ color: "var(--text-body)" }}>
                {driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}
                {driver.vehicle.licensePlate ? ` · ${driver.vehicle.licensePlate}` : ""}
              </div>
              <div style={{ marginTop: 4 }}>
                <span style={{
                  padding: "2px 8px", borderRadius: 9999, fontSize: ".72rem", fontWeight: 700,
                  background: driver.vehicle.status === "Available"
                    ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
                  color: driver.vehicle.status === "Available" ? "#10b981" : "#ef4444",
                }}>
                  {driver.vehicle.status}
                </span>
                {driver.vehicle.status !== "Available" && (
                  <span style={{ marginLeft: 8, fontSize: ".75rem", color: "#ef4444" }}>
                    ⚠ Vehicle unavailable — assign a new one below
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Assign Vehicle — only Available vehicles shown */}
          <div className="ts-field">
            <label className="ts-label">
              Assign Vehicle
              <span style={{ marginLeft: 6, fontSize: ".72rem", color: "var(--text-faint)", fontWeight: 400 }}>
                (Available only)
              </span>
            </label>
            {loading ? (
              <div style={{ padding: ".6rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
                Loading available vehicles…
              </div>
            ) : (
              <select
                className="ts-select"
                value={vehicleId}
                onChange={e => setVehicleId(e.target.value)}
              >
                <option value="">— No vehicle assigned —</option>
                {allOptions.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model}{v.licensePlate ? ` · ${v.licensePlate}` : ""}
                  </option>
                ))}
              </select>
            )}
            {allOptions.length === 0 && !loading && (
              <div style={{
                padding: ".6rem .9rem", borderRadius: 8, fontSize: ".8rem",
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)",
                color: "#92400e",
              }}>
                ⚠ No available vehicles found. Add a vehicle or set an existing one to Available first.
              </div>
            )}
            {selectedVehicle && (
              <span style={{ fontSize: ".78rem", color: "#7c3aed" }}>
                ✓ Selected: {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </span>
            )}
          </div>

          {/* Setup flow hint */}
          <div style={{
            padding: ".65rem .9rem", borderRadius: 8,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            fontSize: ".8rem", color: "var(--text-muted)", lineHeight: 1.6,
          }}>
            After assigning a vehicle, go to <strong>Work Areas</strong> to assign a work area.
            Once both are done and the vehicle is <strong>Available</strong>, the driver status becomes{" "}
            <strong>Offline</strong> and they can go online.
          </div>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button
            className="ts-btn-primary"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}