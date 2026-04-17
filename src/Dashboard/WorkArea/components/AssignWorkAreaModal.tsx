import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon  from "@mui/icons-material/PlaceRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import { workAreasApi, type WorkAreaDriver, type WorkAreaItem } from "../../../api/workAreas";

interface Props {
  driver: WorkAreaDriver;
  areas: WorkAreaItem[];
  onClose: () => void;
  onSaved: (d: WorkAreaDriver) => void;
}

export default function AssignWorkAreaModal({ driver, areas, onClose, onSaved }: Props) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(driver.workAreaId ?? "");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const selectedArea = areas.find(a => a.id === selectedAreaId);

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const updated = await workAreasApi.assignDriver(driver.id, selectedAreaId || null);
      // Build updated WorkAreaDriver shape
      const newArea = areas.find(a => a.id === selectedAreaId) ?? null;
      onSaved({
        ...driver,
        workAreaId: selectedAreaId || null,
        workArea:   newArea ? { id: newArea.id, country: newArea.country, ville: newArea.ville } : null,
        availabilityStatus: updated.availabilityStatus ?? driver.availabilityStatus,
      });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to assign work area.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally { setSaving(false); }
  }

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal ts-modal-scroll" style={{ maxWidth: 440 }}>
        <div className="ts-modal-header">
          <div>
            <p style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--text-h)", margin: 0 }}>
              {driver.workAreaId ? "Edit Work Area" : "Assign Work Area"}
            </p>
            <p style={{ fontSize: ".7rem", color: "var(--text-muted)", margin: ".1rem 0 0" }}>
              {driver.workAreaId
                ? `Update work area for ${driver.name}`
                : `Assign a service zone to ${driver.name}`}
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="ts-modal-body">
          {error && (
            <div className="ts-alert-error" style={{ marginBottom: ".5rem" }}>
              {error}
            </div>
          )}

          {/* Driver info card */}
          <div style={{ background: "var(--bg-inner,#f9fafb)", border: "1px solid var(--border)", borderRadius: ".75rem", padding: ".875rem", display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--driver-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--driver-fg)", flexShrink: 0 }}>
              <DirectionsCarRoundedIcon style={{ fontSize: 20 }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--text-h)", margin: 0 }}>{driver.name}</p>
              <p style={{ fontSize: ".75rem", color: "var(--text-muted)", margin: ".1rem 0 0" }}>
                {driver.vehicle ?? "No vehicle assigned"}
              </p>
            </div>
          </div>

          {/* Work area select */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label className="ts-label">Work Area (Ville)</label>
            <select
              className="ts-input" value={selectedAreaId} style={{ cursor: "pointer" }}
              onChange={e => setSelectedAreaId(e.target.value)}
            >
              <option value="">— No area assigned —</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.ville} — {a.country}</option>
              ))}
            </select>
          </div>

          {/* Preview */}
          {selectedArea ? (
            <div style={{ marginTop: ".75rem", background: "var(--bg-inner,#f9fafb)", border: "1px solid var(--border)", borderRadius: ".75rem", padding: ".875rem" }}>
              <p style={{ fontSize: ".7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 .5rem" }}>
                Selected Zone
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed", flexShrink: 0 }}>
                  <PlaceRoundedIcon style={{ fontSize: 18 }} />
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: ".95rem", color: "var(--text-h)", margin: 0 }}>{selectedArea.ville}</p>
                  <p style={{ fontSize: ".73rem", color: "var(--text-muted)", margin: ".1rem 0 0" }}>{selectedArea.country}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: ".75rem", background: "var(--bg-inner,#f9fafb)", border: "1px dashed var(--border)", borderRadius: ".75rem", padding: "1.25rem", textAlign: "center", color: "var(--text-faint)" }}>
              <PlaceRoundedIcon style={{ fontSize: 28, marginBottom: ".35rem", opacity: .4 }} />
              <p style={{ fontSize: ".8rem", margin: 0 }}>Select a zone to preview</p>
            </div>
          )}
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : driver.workAreaId ? "Update Zone" : "Assign Zone"}
          </button>
        </div>
      </div>
    </div>
  );
}