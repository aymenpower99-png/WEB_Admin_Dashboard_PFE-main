import type { DriverProfile } from "../../../api/drivers";

interface Props {
  driver: DriverProfile;
  onClose: () => void;
  onGoEdit: () => void;
}

export default function DriverSetupInfoModal({ driver, onClose, onGoEdit }: Props) {
  const hasVehicle  = !!driver.vehicle;
  const hasWorkArea = !!(driver as any).workAreaId;

  const missing: { label: string; done: boolean }[] = [
    { label: "Vehicle — a vehicle needs to be assigned to this driver", done: hasVehicle },
    { label: "Work Area — a service zone needs to be assigned to this driver", done: hasWorkArea },
  ];

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 430 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Setup Required — {driver.firstName} {driver.lastName}
            </h2>
            <p className="ts-page-subtitle">
              Some items still need to be configured before this driver can go online.
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {missing.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: ".6rem",
                padding: ".65rem .9rem", borderRadius: 8,
                background: item.done ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${item.done ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}>
                <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>
                  {item.done ? "✅" : "❌"}
                </span>
                <span style={{
                  fontSize: ".855rem",
                  color: item.done ? "#059669" : "var(--text-body)",
                  fontWeight: item.done ? 600 : 400,
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: ".65rem .9rem", borderRadius: 8,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            fontSize: ".8rem", color: "var(--text-muted)", lineHeight: 1.7,
          }}>
            <strong>Setup flow:</strong>
            <ol style={{ margin: ".3rem 0 0 1.1rem", padding: 0 }}>
              <li>Assign a vehicle via <em>Edit Driver</em> or from the Vehicles page.</li>
              <li>Assign a work area from the <em>Work Areas</em> page.</li>
              <li>Once both are set, status changes to <strong>Offline</strong> — driver can then go online.</li>
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