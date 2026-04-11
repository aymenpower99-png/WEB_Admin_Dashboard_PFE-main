import { useState } from "react";
import type { Vehicle } from "../types";
import StatusPill from "./StatusPill";
import ClassBadge from "./ClassBadge";

const IconEdit = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconSync = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const BTN_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: 7,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--border)",
  background: "var(--bg-card)",
  color: "var(--text-muted)",
  cursor: "pointer",
  flexShrink: 0,
  transition: "all .15s",
  padding: 0,
};

function ActionBtn({
  title,
  onClick,
  hoverStyle,
  children,
}: {
  title: string;
  onClick: () => void;
  hoverStyle: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ ...BTN_BASE, ...(hov ? hoverStyle : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

const ROW_H = 88;
const TD: React.CSSProperties = {
  padding: "0 1rem",
  height: ROW_H,
  fontSize: ".875rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

interface VehicleTableRowProps {
  v: Vehicle;
  onEdit: (v: Vehicle) => void;
  onStatusChange: (v: Vehicle) => void;
  onRemove: (v: Vehicle) => void;
  onUpdatePhotos: (v: Vehicle) => void;
}

export default function VehicleTableRow({
  v,
  onEdit,
  onStatusChange,
  onRemove,
}: VehicleTableRowProps) {
  const seats = v.vehicleClass?.seats ?? "—";

  return (
    <tr className="ts-tr" style={{ height: ROW_H }}>
      {/* Vehicle name — no photo thumbnail */}
      <td
        style={{
          ...TD,
          fontWeight: 600,
          color: "var(--text-h)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {v.make} {v.model}
      </td>

      {/* Class */}
      <td style={TD}>
        <ClassBadge vehicleClass={v.vehicleClass} />
      </td>

      {/* Status */}
      <td style={TD}>
        <StatusPill status={v.status} />
      </td>

      {/* Year */}
      <td style={{ ...TD, color: "var(--text-muted)" }}>{v.year}</td>

      {/* Seats */}
      <td style={{ ...TD, color: "var(--text-muted)" }}>{seats}</td>

      {/* Driver — no "Loading…" if name not resolved */}
      <td
        style={{
          ...TD,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {v.driver ? (
          <span style={{ color: "var(--text-body)" }}>{v.driver}</span>
        ) : v.driverId ? (
          <span style={{ color: "var(--text-muted)", fontSize: ".8rem" }}>
            Assigned
          </span>
        ) : (
          <span style={{ color: "var(--text-faint)", fontSize: ".8rem" }}>
            Unassigned
          </span>
        )}
      </td>

      {/* Actions — edit, change status, delete only (no eye, no photo) */}
      {/* Actions */}
      <td style={TD} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ActionBtn
            title="Edit vehicle"
            onClick={() => onEdit(v)}
            hoverStyle={{
              background: "#eff6ff",
              color: "#2563eb",
              borderColor: "#bfdbfe",
            }}
          >
            <IconEdit />
          </ActionBtn>
          <ActionBtn
            title="Change status"
            onClick={() => onStatusChange(v)}
            hoverStyle={{
              background: "#f5f3ff",
              color: "#7c3aed",
              borderColor: "#ddd6fe",
            }}
          >
            <IconSync />
          </ActionBtn>
          {/* ✅ NEW: Disabled + tooltip when On Trip */}
          <button
            title={
              v.status === "On_Trip"
                ? "Cannot delete: vehicle is On Trip"
                : "Remove vehicle"
            }
            onClick={() => v.status !== "On_Trip" && onRemove(v)}
            disabled={v.status === "On_Trip"}
            style={{
              ...BTN_BASE,
              opacity: v.status === "On_Trip" ? 0.35 : 1,
              cursor: v.status === "On_Trip" ? "not-allowed" : "pointer",
            }}
          >
            <IconTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}
