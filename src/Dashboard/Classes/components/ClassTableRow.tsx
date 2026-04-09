import { useState } from "react";
import EditRoundedIcon   from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import WifiRoundedIcon   from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import type { VehicleClass } from "../../../api/classes";

const ROW_H = 80;

const TD: React.CSSProperties = {
  padding: "0 1rem", height: ROW_H, fontSize: ".875rem",
  color: "var(--text-body)", borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--bg-inner)" : "transparent", transition: "background .12s" }}
    >
      {/* Name + image — NO description */}
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {cls.imageUrl ? (
            <img
              src={cls.imageUrl} alt={cls.name}
              style={{ width: 44, height: 44, borderRadius: ".5rem",
                objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }}
            />
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: ".5rem", background: "var(--bg-inner)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", flexShrink: 0,
            }}>
              🚗
            </div>
          )}
          <span style={{ fontWeight: 700, color: "var(--text-h)", fontSize: ".88rem" }}>
            {cls.name}
          </span>
        </div>
      </td>

      {/* Seats */}
      <td style={TD}>
        <span style={{ fontWeight: 600 }}>{cls.seats}</span>
        <span style={{ color: "var(--text-faint)", fontSize: ".78rem" }}> seats</span>
      </td>

      {/* Bags */}
      <td style={TD}>
        <span style={{ fontWeight: 600 }}>{cls.bags}</span>
        <span style={{ color: "var(--text-faint)", fontSize: ".78rem" }}> bags</span>
      </td>

      {/* Features */}
      <td style={TD}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
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

      {/* Waiting time */}
      <td style={TD}>
        <span style={{ fontWeight: 600 }}>{cls.freeWaitingTime}</span>
        <span style={{ color: "var(--text-faint)", fontSize: ".78rem" }}> min</span>
      </td>

      {/* Status */}
      <td style={TD}>
        <span style={{
          padding: "3px 10px", borderRadius: "9999px", fontSize: ".75rem", fontWeight: 700,
          background: cls.isActive ? "var(--active-bg)" : "var(--blocked-bg)",
          color:      cls.isActive ? "var(--active-fg)" : "var(--blocked-fg)",
        }}>
          {cls.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td style={TD}>
        <div style={{ display: "flex", gap: ".4rem" }}>
          <button
            onClick={() => onEdit(cls)}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".3rem",
              padding: "5px 12px", borderRadius: ".4rem", fontSize: ".78rem",
              fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)",
              background: "var(--bg-card)", color: "var(--text-body)", transition: "all .12s",
            }}
          >
            <EditRoundedIcon style={{ fontSize: 14 }} /> Edit
          </button>
          <button
            onClick={() => onDelete(cls)}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".3rem",
              padding: "5px 12px", borderRadius: ".4rem", fontSize: ".78rem",
              fontWeight: 600, cursor: "pointer",
              border: "1px solid #ef4444",
              background: "transparent", color: "#ef4444", transition: "all .12s",
            }}
          >
            <DeleteRoundedIcon style={{ fontSize: 14 }} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}