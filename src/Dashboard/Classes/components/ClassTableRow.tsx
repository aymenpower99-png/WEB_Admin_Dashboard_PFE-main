import { useState } from "react";
import WifiRoundedIcon   from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import type { VehicleClass } from "../../../api/classes";

const ROW_H = 88; // ✅ same as Drivers

// ✅ Exact copy of Drivers TD style
const TD: React.CSSProperties = {
  padding: "0 1.25rem",
  height: ROW_H,
  fontSize: ".85rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

const ACTION_BTN_BASE: React.CSSProperties = {
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
  cursor: "pointer",
  color: "var(--text-muted)",
  flexShrink: 0,
  transition: "all .15s",
  padding: 0,
};

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

function ActionBtn({
  title, onClick, hoverStyle, children,
}: {
  title: string; onClick: () => void;
  hoverStyle: React.CSSProperties; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ ...ACTION_BTN_BASE, ...(hovered ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

export default function ClassTableRow({
  cls, onEdit, onDelete,
}: {
  cls: VehicleClass;
  onEdit:   (c: VehicleClass) => void;
  onDelete: (c: VehicleClass) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      className="ts-tr"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: ROW_H,
        background: hovered ? "var(--bg-inner)" : "transparent",
        transition: "background .12s",
      }}
    >
      {/* CLASS — bold like Driver name */}
      <td style={TD}>
        <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: ".85rem" }}>
          {cls.name}
        </span>
      </td>

      {/* SEATS — bold number centered, like Trips */}
      <td style={{ ...TD, textAlign: "center" }}>
        <span style={{ fontWeight: 800, fontSize: ".85rem", color: "var(--text-h)" }}>
          {cls.seats}
        </span>
      </td>

      {/* BAGS — bold number centered */}
      <td style={{ ...TD, textAlign: "center" }}>
        <span style={{ fontWeight: 800, fontSize: ".85rem", color: "var(--text-h)" }}>
          {cls.bags}
        </span>
      </td>

      {/* FEATURES — chips like Driver email area */}
      <td style={TD}>
        <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", alignItems: "center" }}>
          {cls.wifi && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".72rem",
              fontWeight: 600, background: "var(--rider-bg)", color: "var(--rider-fg)",
            }}>
              <WifiRoundedIcon style={{ fontSize: 12 }} /> WiFi
            </span>
          )}
          {cls.ac && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".72rem",
              fontWeight: 600, background: "var(--pending-bg)", color: "var(--pending-fg)",
            }}>
              <AcUnitRoundedIcon style={{ fontSize: 12 }} /> A/C
            </span>
          )}
          {cls.water && (
            <span style={{
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".72rem",
              fontWeight: 600, background: "var(--active-bg)", color: "var(--active-fg)",
            }}>
              💧 Water
            </span>
          )}
          {cls.meetAndGreet && (
            <span style={{
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".72rem",
              fontWeight: 600, background: "var(--driver-bg)", color: "var(--driver-fg)",
            }}>
              🤝 Meet &amp; Greet
            </span>
          )}
          {!cls.wifi && !cls.ac && !cls.water && !cls.meetAndGreet && (
            <span style={{ fontSize: ".75rem", color: "var(--text-faint)" }}>—</span>
          )}
        </div>
      </td>

      {/* WAIT — like Trips: bold number + small unit */}
      <td style={{ ...TD, textAlign: "center" }}>
        <span style={{ fontWeight: 800, fontSize: ".85rem", color: "var(--text-h)" }}>
          {cls.freeWaitingTime}
        </span>
        <span style={{ fontSize: ".72rem", color: "var(--text-faint)", marginLeft: 2 }}>min</span>
      </td>

      {/* STATUS — badge like Driver status */}
      <td style={TD}>
        <span style={{
          padding: "3px 10px", borderRadius: "9999px", fontSize: ".75rem", fontWeight: 700,
          background: cls.isActive ? "var(--active-bg)" : "var(--blocked-bg)",
          color:      cls.isActive ? "var(--active-fg)" : "var(--blocked-fg)",
        }}>
          {cls.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* ACTIONS — icon buttons like Driver actions */}
      <td style={TD} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ActionBtn
            title="Edit class"
            onClick={() => onEdit(cls)}
            hoverStyle={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
          >
            <IconEdit />
          </ActionBtn>
          <ActionBtn
            title="Delete class"
            onClick={() => onDelete(cls)}
            hoverStyle={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
          >
            <IconDelete />
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}