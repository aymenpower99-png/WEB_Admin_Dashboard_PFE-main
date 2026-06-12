import { useState, useEffect } from "react";
import { toast } from "sonner";
import { driversApi, type DriverProfile } from "../../../api/drivers";
import { workAreasApi, type WorkAreaItem } from "../../../api/workAreas";
import apiClient from "../../../api/apiClient";
import { PlainDropdown } from "../../Vehicles/AddvehicleComponents/Field";

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
  const [workAreaId, setWorkAreaId] = useState<string>(driver.workAreaId ?? "");
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkAreaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get("/vehicles", { params: { limit: 200, status: "Available" } })
        .then(res => {
          const list: any[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
          const available = list.filter(v => v.status === "Available");
          setVehicles(available.map(v => ({
            id: v.id,
            make: v.make,
            model: v.model,
            year: v.year,
            licensePlate: v.licensePlate,
            status: v.status,
          })));
        }),
      workAreasApi.getAll().then(setWorkAreas),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prevVehicleId = driver.vehicle?.id ?? null;
  const prevWorkAreaId = driver.workAreaId ?? null;

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const payload = {
        vehicleId: vehicleId || null,
        workAreaId: workAreaId || null,
      };
      const updated = await driversApi.update(driver.id, payload);

      const vehicleChanged = (vehicleId || null) !== prevVehicleId;
      const workAreaChanged = (workAreaId || null) !== prevWorkAreaId;

      if (vehicleChanged) {
        if (vehicleId) {
          toast.success("Vehicle assigned");
        } else {
          toast.success("Vehicle unassigned", {
            style: { background: "rgb(194, 65, 12)", color: "#fff", border: "none" },
          });
        }
      }
      if (workAreaChanged) {
        if (workAreaId) {
          toast.success("Work area assigned");
        } else {
          toast.success("Work area unassigned", {
            style: { background: "rgb(194, 65, 12)", color: "#fff", border: "none" },
          });
        }
      }
      if (!vehicleChanged && !workAreaChanged) {
        toast.success("Driver assignments unchanged");
      }
      onSaved(updated);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save driver.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
      toast.error("Failed to update driver assignments");
    } finally {
      setSaving(false);
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const selectedWorkArea = workAreas.find(w => w.id === workAreaId);

  // Current vehicle may already be assigned — show it even if not in 'available' list
  const currentVehicleNotInList =
    driver.vehicle &&
    driver.vehicle.status === "Available" &&
    !vehicles.find(v => v.id === driver.vehicle!.id);

  const allVehicleOptions: VehicleOption[] = [
    ...(currentVehicleNotInList
      ? [{ ...driver.vehicle!, status: "Available" } as VehicleOption]
      : []),
    ...vehicles,
  ];

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 440 }}>
        <div className="ts-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div>
              <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
                Assign Driver — {driver.firstName} {driver.lastName}
              </h2>
              <p className="ts-page-subtitle">Assign vehicle and work area to this driver.</p>
            </div>
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

          {/* Assign Vehicle */}
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
              <PlainDropdown
                value={vehicleId}
                onChange={(v) => setVehicleId(v)}
                options={[
                  { value: "", label: "— No vehicle assigned —" },
                  ...allVehicleOptions.map((v) => ({
                    value: v.id,
                    label: `${v.year} ${v.make} ${v.model}${v.licensePlate ? ` · ${v.licensePlate}` : ""}`,
                  })),
                ]}
                placeholder="SELECT VEHICLE"
              />
            )}
            {allVehicleOptions.length === 0 && !loading && (
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

          {/* Assign Work Area */}
          <div className="ts-field">
            <label className="ts-label">Assign Work Area</label>
            {loading ? (
              <div style={{ padding: ".6rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
                Loading work areas…
              </div>
            ) : (
              <PlainDropdown
                value={workAreaId}
                onChange={(v) => setWorkAreaId(v)}
                options={[
                  { value: "", label: "— No work area assigned —" },
                  ...workAreas.map((w) => ({
                    value: w.id,
                    label: `${w.ville}, ${w.country}`,
                  })),
                ]}
                placeholder="SELECT WORK AREA"
              />
            )}
            {workAreas.length === 0 && !loading && (
              <div style={{
                padding: ".6rem .9rem", borderRadius: 8, fontSize: ".8rem",
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)",
                color: "#92400e",
              }}>
                ⚠ No work areas found. Create a work area first.
              </div>
            )}
            {selectedWorkArea && (
              <span style={{ fontSize: ".78rem", color: "#7c3aed" }}>
                ✓ Selected: {selectedWorkArea.ville}, {selectedWorkArea.country}
              </span>
            )}
          </div>

          {/* Setup flow hint */}
          <div style={{
            padding: ".65rem .9rem", borderRadius: 8,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            fontSize: ".8rem", color: "var(--text-muted)", lineHeight: 1.6,
          }}>
            Once both a vehicle (<strong>Available</strong>) and a work area are assigned, the driver status becomes <strong>Offline</strong> and they can go online.
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