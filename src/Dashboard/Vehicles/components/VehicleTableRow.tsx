import { useState } from "react";
import type { Vehicle } from "../types";
import StatusPill from "./StatusPill";
import ClassBadge from "./ClassBadge";

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconPhoto = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconSync = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const BTN_BASE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 30, height: 30, borderRadius: 7,
  borderWidth: "1px", borderStyle: "solid",
  borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text-muted)",
  cursor: "pointer", flexShrink: 0, transition: "all .15s", padding: 0,
};

function ActionBtn({ title, onClick, hoverStyle, children }: {
  title: string; onClick: () => void; hoverStyle: React.CSSProperties; children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      style={{ ...BTN_BASE, ...(hov ? hoverStyle : {}) }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

const ROW_H = 88;
const TD: React.CSSProperties = {
  padding: "0 1rem", height: ROW_H, fontSize: ".875rem", color: "var(--text-body)",
  borderBottom: "1px solid var(--border)", verticalAlign: "middle",
};

interface VehicleTableRowProps {
  v: Vehicle;
  onEdit:         (v: Vehicle) => void;
  onStatusChange: (v: Vehicle) => void;
  onRemove:       (v: Vehicle) => void;
  onUpdatePhotos: (v: Vehicle) => void;
}

export default function VehicleTableRow({ v, onEdit, onStatusChange, onRemove, onUpdatePhotos }: VehicleTableRowProps) {
  const needsPhotos = !Array.isArray(v.photos) || v.photos.length === 0;

  // Seats come from the CLASS, not the vehicle itself
  const seats = v.vehicleClass?.seats ?? "—";

  return (
    <tr className="ts-tr" style={{ height: ROW_H }}>
      <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {v.make} {v.model}
      </td>
      <td style={TD}><ClassBadge vehicleClass={v.vehicleClass} /></td>
      <td style={TD}><StatusPill status={v.status} /></td>
      <td style={{ ...TD, color: "var(--text-muted)" }}>{v.year}</td>
      <td style={{ ...TD, color: "var(--text-muted)" }}>{seats}</td>
      <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {v.driver
          ? v.driver
          : v.driverId
            ? <span style={{ fontStyle: "italic" }}>Loading…</span>
            : <span style={{ color: "var(--text-faint)" }}>Unassigned</span>
        }
      </td>
      <td style={TD} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ActionBtn title="Edit vehicle" onClick={() => onEdit(v)}
            hoverStyle={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}>
            <IconEdit />
          </ActionBtn>

          {needsPhotos && (
            <ActionBtn
              title="Add photos (required to activate)"
              onClick={() => onUpdatePhotos(v)}
              hoverStyle={{ background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }}>
              <IconPhoto />
            </ActionBtn>
          )}

          <ActionBtn title="Change status" onClick={() => onStatusChange(v)}
            hoverStyle={{ background: "#f5f3ff", color: "#7c3aed", borderColor: "#ddd6fe" }}>
            <IconSync />
          </ActionBtn>
          <ActionBtn title="Remove vehicle" onClick={() => onRemove(v)}
            hoverStyle={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}>
            <IconTrash />
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}