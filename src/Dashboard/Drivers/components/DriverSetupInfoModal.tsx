import type { DriverProfile } from "../../../api/drivers";

interface Props {
  driver: DriverProfile;
  onClose: () => void;
  onGoEdit: () => void;
}

export default function DriverSetupInfoModal({ driver, onClose, onGoEdit }: Props) {
  const hasVehicle   = !!driver.vehicle;
  const hasWorkArea  = !!(driver as any).workAreaId; // will be true once assigned
  const missingItems: string[] = [];
  if (!hasVehicle)  missingItems.push("Vehicle — assign a vehicle to this driver");
  if (!hasWorkArea) missingItems.push("Work Area — admin must assign a work area");

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 420 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Setup Required — {driver.firstName} {driver.lastName}
            </h2>
            <p className="ts-page-subtitle">The following items are missing before this driver can go online.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body">
          {missingItems.length === 0 ? (
            <div style={{ color: "#16a34a", fontWeight: 600 }}>
              ✅ All setup items are complete. Status should update shortly.
            </div>
          ) : (
            <ul style={{ margin: 0, padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {missingItems.map((item, i) => (
                <li key={i} style={{ fontSize: ".875rem", color: "#c2410c" }}>
                  <span style={{ fontWeight: 600 }}>❌ {item}</span>
                </li>
              ))}
            </ul>
          )}
          <div style={{
            marginTop: "1rem", padding: ".75rem", borderRadius: 8,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            fontSize: ".82rem", color: "var(--text-body)",
          }}>
            <strong>How setup works:</strong>
            <ol style={{ margin: ".4rem 0 0 1.1rem", padding: 0, lineHeight: 1.7 }}>
              <li>Assign a vehicle to the driver (via Edit Driver or from the Vehicles page).</li>
              <li>Assign a work area to the driver (from the Work Areas page).</li>
              <li>Once both are done, the driver status changes to <strong>Offline</strong> and they can go online.</li>
            </ol>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Close</button>
          <button className="ts-btn-primary" onClick={() => { onClose(); onGoEdit(); }}>
            Go to Edit Driver
          </button>
        </div>
      </div>
    </div>
  );
}