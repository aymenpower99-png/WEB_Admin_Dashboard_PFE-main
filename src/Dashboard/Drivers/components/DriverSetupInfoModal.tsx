import type { DriverProfile } from "../../../api/drivers";

interface Props {
  driver: DriverProfile;
  onClose: () => void;
  onGoEdit: () => void;
}

export default function DriverSetupInfoModal({ driver, onClose, onGoEdit }: Props) {
  const hasVehicle        = !!driver.vehicle;
  const vehicleAvailable  = driver.vehicle?.status === "Available";
  const hasWorkArea       = !!driver.workAreaId;

  // All three must be true for the driver to be OFFLINE-ready
  const vehicleOk = hasVehicle && vehicleAvailable;

  const checklist: { label: string; sublabel?: string; done: boolean }[] = [
    {
      label: "Vehicle assigned",
      sublabel: hasVehicle && !vehicleAvailable
        ? `Vehicle is "${driver.vehicle!.status}" — must be Available`
        : hasVehicle
        ? `${driver.vehicle!.year} ${driver.vehicle!.make} ${driver.vehicle!.model}`
        : "No vehicle assigned yet",
      done: vehicleOk,
    },
    {
      label: "Vehicle must be Available",
      sublabel: hasVehicle
        ? `Current status: ${driver.vehicle!.status}`
        : "No vehicle to check",
      done: vehicleOk,
    },
    {
      label: "Work Area assigned",
      sublabel: hasWorkArea ? "Work area configured" : "No work area assigned yet",
      done: hasWorkArea,
    },
  ];

  const allDone = checklist.every(c => c.done);

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 460 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Setup Required — {driver.firstName} {driver.lastName}
            </h2>
            <p className="ts-page-subtitle">
              {allDone
                ? "All requirements met — driver can go Offline/Online."
                : "Some items still need to be configured before this driver can go online."}
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>

          {/* Checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
            {checklist.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: ".6rem",
                padding: ".6rem .9rem", borderRadius: 8,
                background: item.done ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${item.done ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              }}>
                <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>
                  {item.done ? "✅" : "❌"}
                </span>
                <div>
                  <div style={{
                    fontSize: ".855rem",
                    color: item.done ? "#059669" : "var(--text-body)",
                    fontWeight: 600,
                  }}>
                    {item.label}
                  </div>
                  {item.sublabel && (
                    <div style={{
                      fontSize: ".78rem", marginTop: 2,
                      color: item.done ? "#10b981" : "#ef4444",
                    }}>
                      {item.sublabel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Performance stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: ".5rem",
            padding: ".65rem .9rem",
            borderRadius: 8,
            background: "rgba(59,130,246,0.04)",
            border: "1px solid rgba(59,130,246,0.12)",
          }}>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>Trips</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-h)" }}>{driver.totalTrips ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>Cancellations</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: driver.cancellationCount ? "#ef4444" : "var(--text-h)" }}>{driver.cancellationCount ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>Acceptance</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-h)" }}>{driver.acceptanceRate ?? 0}%</div>
            </div>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>Assigned</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-h)" }}>{driver.assignedRidesCount ?? 0}</div>
            </div>
          </div>

          {/* Flow instructions */}
          <div style={{
            padding: ".65rem .9rem", borderRadius: 8,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            fontSize: ".8rem", color: "var(--text-muted)", lineHeight: 1.7,
          }}>
            <strong>Setup flow:</strong>
            <ol style={{ margin: ".3rem 0 0 1.1rem", padding: 0 }}>
              <li>Assign an <strong>Available</strong> vehicle via <em>Edit Driver</em>.</li>
              <li>Assign a work area from the <em>Work Areas</em> page.</li>
              <li>Status becomes <strong>Offline</strong> automatically — driver can then go Online.</li>
            </ol>
            <div style={{ marginTop: ".5rem", color: "#c2410c", fontWeight: 600 }}>
              ⚠ Vehicles in Maintenance or Pending cannot be used — only Available vehicles count.
            </div>
          </div>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Close</button>
          <button className="ts-btn-primary" onClick={() => { onClose(); onGoEdit(); }}>
            Edit Driver
          </button>
        </div>
      </div>
    </div>
  );
}