import { useState, useEffect } from "react";
import "../travelsync-design-system.css";
import ArrowBackRoundedIcon      from "@mui/icons-material/ArrowBackRounded";
import DirectionsCarRoundedIcon  from "@mui/icons-material/DirectionsCarRounded";
import WifiRoundedIcon           from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon         from "@mui/icons-material/AcUnitRounded";
import WaterDropRoundedIcon      from "@mui/icons-material/WaterDropRounded";
import AirlineSeatReclineExtraRoundedIcon from "@mui/icons-material/AirlineSeatReclineExtraRounded";
import LuggageRoundedIcon        from "@mui/icons-material/LuggageRounded";
import AccessTimeRoundedIcon     from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon    from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon         from "@mui/icons-material/CancelRounded";
import { classesApi }            from "../../api/classes";
import type { VehicleClassDetail, ClassVehicle } from "../../api/classes";

// ── Status badge (same palette as VehiclesPage) ──────────────────────────────
const STATUS_STYLE: Record<string, React.CSSProperties> = {
  Available:   { background: "rgba(16,185,129,.12)", color: "#10b981" },
  Pending:     { background: "rgba(245,158,11,.12)",  color: "#f59e0b" },
  On_Trip:     { background: "rgba(99,102,241,.12)",  color: "#6366f1" },
  Maintenance: { background: "rgba(239,68,68,.12)",   color: "#ef4444" },
};
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { background: "var(--bg-inner)", color: "var(--text-muted)" };
  return (
    <span style={{
      ...s, borderRadius: 9999, padding: "3px 10px",
      fontSize: ".75rem", fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {status === "On_Trip" ? "On Trip" : status}
    </span>
  );
}

// ── Feature chip ─────────────────────────────────────────────────────────────
function FeatureChip({ icon, label, on }: { icon: React.ReactNode; label: string; on: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 9999, fontSize: ".78rem", fontWeight: 600,
      background: on ? "rgba(124,58,237,.12)" : "var(--bg-inner)",
      color:      on ? "#7c3aed"              : "var(--text-faint)",
      border: `1px solid ${on ? "rgba(124,58,237,.25)" : "var(--border)"}`,
    }}>
      {icon}
      {label}
      {on
        ? <CheckCircleRoundedIcon style={{ fontSize: 13, color: "#10b981" }} />
        : <CancelRoundedIcon      style={{ fontSize: 13, color: "#ef4444" }} />}
    </span>
  );
}

// ── Stat mini-card ────────────────────────────────────────────────────────────
function MiniStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="ts-card" style={{ padding: "1rem 1.25rem", minWidth: 110, flex: 1 }}>
      <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: ".06em", color: "var(--text-muted)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: color ?? "var(--text-h)", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

// ── Table header style (mirrors ClassesPage) ──────────────────────────────────
const TH: React.CSSProperties = {
  padding: "0.65rem 1rem", fontSize: ".78rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-body)", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--bg-thead)",
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface ClassDetailPageProps {
  classId: string;
  onNavigate: (page: string, prefill?: any) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ClassDetailPage({ classId, onNavigate }: ClassDetailPageProps) {
  const [detail,  setDetail]  = useState<VehicleClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    classesApi.getDetail(classId)
      .then(setDetail)
      .catch(() => setError("Failed to load class details."))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return (
    <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".9rem" }}>
      Loading class details…
    </div>
  );

  if (error || !detail) return (
    <div style={{ padding: "4rem", textAlign: "center", color: "#ef4444", fontSize: ".9rem" }}>
      {error ?? "Class not found."}
      <br />
      <button className="ts-btn-ghost" style={{ marginTop: 12 }}
        onClick={() => onNavigate("classes")}>← Back to Classes</button>
    </div>
  );

  const available   = detail.vehicles.filter(v => v.status === "Available").length;
  const pending     = detail.vehicles.filter(v => v.status === "Pending").length;
  const onTrip      = detail.vehicles.filter(v => v.status === "On_Trip").length;
  const maintenance = detail.vehicles.filter(v => v.status === "Maintenance").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("classes")} title="Back">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
            {detail.name}
            <span style={{
              marginLeft: 10, fontSize: ".7rem", fontWeight: 700,
              padding: "3px 9px", borderRadius: 9999,
              background: detail.isActive ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)",
              color:      detail.isActive ? "#10b981"              : "#ef4444",
            }}>
              {detail.isActive ? "Active" : "Inactive"}
            </span>
          </h1>
          <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-muted)" }}>
            Class detail — features &amp; linked vehicles
          </p>
        </div>
        <button className="ts-btn-ghost" onClick={() => onNavigate("classes-add", detail)}>
          Edit Class
        </button>
      </div>

      {/* ── Stat Mini-cards ── */}
      <div style={{ display: "flex", gap: ".65rem", flexWrap: "wrap" }}>
        <MiniStat label="Total Vehicles" value={detail.vehicleCount}   color="#7c3aed" />
        <MiniStat label="Available"      value={available}             color="#10b981" />
        <MiniStat label="Pending"        value={pending}               color="#f59e0b" />
        <MiniStat label="On Trip"        value={onTrip}                color="#6366f1" />
        <MiniStat label="Maintenance"    value={maintenance}            color="#ef4444" />
      </div>

      {/* ── Class Info + Features ── */}
      <div className="ts-card" style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {detail.imageUrl && (
            <img src={detail.imageUrl} alt={detail.name}
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }} />
          )}
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-h)" }}>{detail.name}</div>
            <div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>
              <AirlineSeatReclineExtraRoundedIcon style={{ fontSize: 13, marginRight: 4 }} />
              {detail.features.seats} seats &nbsp;·&nbsp;
              <LuggageRoundedIcon style={{ fontSize: 13, marginRight: 4 }} />
              {detail.features.bags} bags &nbsp;·&nbsp;
              <AccessTimeRoundedIcon style={{ fontSize: 13, marginRight: 4 }} />
              {detail.features.freeWaitingTime} min free wait
            </div>
          </div>
        </div>

        {/* Feature chips */}
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <FeatureChip
            icon={<WifiRoundedIcon style={{ fontSize: 14 }} />}
            label="WiFi" on={detail.features.wifi} />
          <FeatureChip
            icon={<AcUnitRoundedIcon style={{ fontSize: 14 }} />}
            label="AC" on={detail.features.ac} />
          <FeatureChip
            icon={<WaterDropRoundedIcon style={{ fontSize: 14 }} />}
            label="Water" on={detail.features.water} />
          <FeatureChip
            icon={<DirectionsCarRoundedIcon style={{ fontSize: 14 }} />}
            label="Door-to-Door" on={detail.features.doorToDoor} />
          <FeatureChip
            icon={<CheckCircleRoundedIcon style={{ fontSize: 14 }} />}
            label="Meet &amp; Greet" on={detail.features.meetAndGreet} />
        </div>
      </div>

      {/* ── Vehicles Table ── */}
      <div className="ts-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "1rem 1.25rem .75rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <div style={{ fontSize: ".95rem", fontWeight: 800, color: "var(--text-h)" }}>
              <DirectionsCarRoundedIcon style={{ fontSize: 16, marginRight: 6, verticalAlign: "middle" }} />
              Vehicles in this class
            </div>
            <div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>
              {detail.vehicleCount} vehicle{detail.vehicleCount !== 1 ? "s" : ""} assigned
            </div>
          </div>
          <button className="ts-btn-primary" style={{ fontSize: ".82rem", padding: ".35rem .9rem" }}
            onClick={() => onNavigate("agency-vehicles")}>
            + Add Vehicle
          </button>
        </div>

        {detail.vehicles.length === 0 ? (
          <div style={{
            padding: "3rem", textAlign: "center",
            color: "var(--text-faint)", fontSize: ".875rem",
          }}>
            No vehicles assigned to this class yet.
            <br />
            <button className="ts-btn-ghost" style={{ marginTop: 10, fontSize: ".82rem" }}
              onClick={() => onNavigate("agency-vehicles")}>
              + Add first vehicle
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "28%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
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
                {detail.vehicles.map((v: ClassVehicle) => (
                  <VehicleRow key={v.id} v={v} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Vehicle row ───────────────────────────────────────────────────────────────
function VehicleRow({ v }: { v: ClassVehicle }) {
  const ROW_H = 72;
  const TD: React.CSSProperties = {
    padding: "0 1rem", height: ROW_H, fontSize: ".875rem",
    color: "var(--text-body)", borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  };
  const thumb = v.photos?.[0];

  return (
    <tr style={{ height: ROW_H }}>
      {/* Vehicle name + photo */}
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0, overflow: "hidden",
            background: "var(--bg-inner)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {thumb
              ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <DirectionsCarRoundedIcon style={{ fontSize: 20, color: "var(--text-faint)" }} />
            }
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--text-h)" }}>
              {v.make} {v.model}
            </div>
            <div style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
              {v.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </td>
      <td style={TD}>{v.year}</td>
      <td style={TD}>{v.color ?? "—"}</td>
      <td style={TD}>
        {v.licensePlate
          ? <span style={{
              background: "var(--bg-inner)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "2px 8px", fontSize: ".8rem", fontFamily: "monospace",
            }}>{v.licensePlate}</span>
          : <span style={{ color: "var(--text-faint)" }}>—</span>}
      </td>
      <td style={TD}><StatusBadge status={v.status} /></td>
      <td style={{ ...TD, color: v.driverId ? "var(--text-body)" : "var(--text-faint)" }}>
        {v.driverId ? "Assigned" : "Unassigned"}
      </td>
    </tr>
  );
}