import { useState, useEffect } from "react";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import type { VehicleClass } from "../../../api/classes";
import apiClient from "../../../api/apiClient";

// ── Status badge palette — uses design system CSS variables for dark/light ───
const STATUS_STYLE: Record<string, React.CSSProperties> = {
  Available:   { background: "var(--active-bg)",   color: "var(--active-fg)" },
  Pending:     { background: "var(--pending-bg)",  color: "var(--pending-fg)" },
  On_Trip:     { background: "var(--rider-bg)",    color: "var(--rider-fg)" },
  Maintenance: { background: "var(--blocked-bg)",  color: "var(--blocked-fg)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { background: "var(--bg-inner)", color: "var(--text-muted)" };
  return (
    <span style={{
      ...s, borderRadius: 9999, padding: "3px 10px",
      fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {status === "On_Trip" ? "On Trip" : status}
    </span>
  );
}

interface ClassVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string | null;
  driverId: string | null;
  status: "Pending" | "Available" | "On_Trip" | "Maintenance";
  photos: string[] | null;
  isActive: boolean;
}

interface Props {
  cls: VehicleClass;
  onClose: () => void;
  onViewDetail: (cls: VehicleClass) => void;
}

const TH: React.CSSProperties = {
  padding: "0.55rem 1rem", fontSize: ".72rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-muted)", textAlign: "left",
  borderBottom: "1px solid var(--border)",
  background: "var(--bg-thead)", whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "0 1rem", height: 60, fontSize: ".84rem",
  color: "var(--text-body)", borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

export default function ClassVehiclesModal({ cls, onClose, onViewDetail }: Props) {
  const [vehicles, setVehicles] = useState<ClassVehicle[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    apiClient.get(`/vehicles/by-class/${cls.id}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setVehicles(data);
      })
      .catch(() => setError("Failed to load vehicles."))
      .finally(() => setLoading(false));
  }, [cls.id]);

  const available   = vehicles.filter(v => v.status === "Available").length;
  const pending     = vehicles.filter(v => v.status === "Pending").length;
  const onTrip      = vehicles.filter(v => v.status === "On_Trip").length;
  const maintenance = vehicles.filter(v => v.status === "Maintenance").length;

  const statChips: { label: string; value: number; color: string; bg: string }[] = [
    { label: "Available",   value: available,   color: "#10b981", bg: "rgba(16,185,129,.1)"  },
    { label: "Pending",     value: pending,     color: "#f59e0b", bg: "rgba(245,158,11,.1)"  },
    { label: "On Trip",     value: onTrip,      color: "#6366f1", bg: "rgba(99,102,241,.1)"  },
    { label: "Maintenance", value: maintenance, color: "#ef4444", bg: "rgba(239,68,68,.1)"   },
  ];

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 680, width: "95vw" }}>

        {/* Header */}
        <div className="ts-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: "rgba(124,58,237,.12)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <DirectionsCarRoundedIcon style={{ fontSize: 20, color: "#7c3aed" }} />
            </div>
            <div>
              <h2 className="ts-page-title" style={{ fontSize: "1rem", margin: 0 }}>
                {cls.name}
              </h2>
              <p className="ts-page-subtitle" style={{ margin: 0 }}>
                {loading ? "Loading…" : `${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""} in this class`}
              </p>
            </div>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Stat chips */}
        {!loading && !error && vehicles.length > 0 && (
          <div style={{
            display: "flex", gap: ".5rem", flexWrap: "wrap",
            padding: ".75rem 1.25rem", borderBottom: "1px solid var(--border)",
          }}>
            {statChips.map(chip => (
              <span key={chip.label} style={{
                padding: "3px 12px", borderRadius: 9999,
                fontSize: ".75rem", fontWeight: 700,
                background: chip.bg, color: chip.color,
              }}>
                {chip.label}: {chip.value}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="ts-modal-body" style={{ padding: 0, maxHeight: "55vh", overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              Loading vehicles…
            </div>
          ) : error ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444", fontSize: ".85rem" }}>
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              <DirectionsCarRoundedIcon style={{ fontSize: 36, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
              No vehicles assigned to this class yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Vehicle</th>
                    <th style={TH}>Year</th>
                    <th style={TH}>Color</th>
                    <th style={TH}>Plate</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => {
                    const thumb = v.photos?.[0];
                    return (
                      <tr key={v.id} style={{ height: 60 }}>
                        {/* Vehicle name + photo */}
                        <td style={TD}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 7, flexShrink: 0,
                              overflow: "hidden", background: "var(--bg-inner)",
                              border: "1px solid var(--border)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {thumb
                                ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <DirectionsCarRoundedIcon style={{ fontSize: 18, color: "var(--text-faint)" }} />
                              }
                            </div>
                            <span style={{ fontWeight: 700, fontSize: ".84rem", color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {v.make} {v.model}
                            </span>
                          </div>
                        </td>
                        <td style={{ ...TD, color: "var(--text-muted)" }}>{v.year}</td>
                        <td style={{ ...TD, color: "var(--text-muted)" }}>{v.color ?? "—"}</td>
                        <td style={TD}>
                          {v.licensePlate
                            ? <span style={{
                                background: "var(--bg-inner)", border: "1px solid var(--border)",
                                borderRadius: 6, padding: "2px 7px", fontSize: ".78rem", fontFamily: "monospace",
                              }}>{v.licensePlate}</span>
                            : <span style={{ color: "var(--text-faint)" }}>—</span>
                          }
                        </td>
                        <td style={TD}><StatusBadge status={v.status} /></td>
                        <td style={{ ...TD, color: v.driverId ? "var(--text-body)" : "var(--text-faint)", fontSize: ".78rem" }}>
                          {v.driverId ? "Assigned" : "None"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Close</button>
          <button
            className="ts-btn-primary"
            onClick={() => { onClose(); onViewDetail(cls); }}
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}