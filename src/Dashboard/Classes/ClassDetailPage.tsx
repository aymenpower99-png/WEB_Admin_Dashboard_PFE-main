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
import DoorFrontRoundedIcon      from "@mui/icons-material/DoorFrontRounded";
import EmojiPeopleRoundedIcon    from "@mui/icons-material/EmojiPeopleRounded";
import { classesApi }            from "../../api/classes";
import type { VehicleClassDetail, ClassVehicle } from "../../api/classes";

// ── status palette ────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { bg: string; color: string }> = {
  Available:   { bg: "rgba(16,185,129,.12)",  color: "#10b981" },
  Pending:     { bg: "rgba(245,158,11,.12)",  color: "#f59e0b" },
  On_Trip:     { bg: "rgba(99,102,241,.12)",  color: "#6366f1" },
  Maintenance: { bg: "rgba(239,68,68,.12)",   color: "#ef4444" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_META[status] ?? { bg: "var(--bg-inner)", color: "var(--text-muted)" };
  return (
    <span style={{
      borderRadius: 9999, padding: "3px 12px",
      fontSize: ".75rem", fontWeight: 700, whiteSpace: "nowrap",
      background: s.bg, color: s.color,
    }}>
      {status === "On_Trip" ? "On Trip" : status}
    </span>
  );
}

function FeatureChip({ icon, label, on }: { icon: React.ReactNode; label: string; on: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 11px", borderRadius: 9999, fontSize: ".78rem", fontWeight: 600,
      background: on ? "rgba(124,58,237,.10)" : "var(--bg-inner)",
      color:      on ? "#7c3aed"              : "var(--text-faint)",
      border: `1px solid ${on ? "rgba(124,58,237,.22)" : "var(--border)"}`,
      opacity: on ? 1 : 0.55,
    }}>
      {icon} {label}
    </span>
  );
}

const TH: React.CSSProperties = {
  padding: "0.6rem 1rem", fontSize: ".75rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-muted)", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
  background: "transparent",
};

const ROW_H = 64;
const TD_STYLE: React.CSSProperties = {
  padding: "0 1rem", height: ROW_H, fontSize: ".875rem",
  color: "var(--text-body)", borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

interface ClassDetailPageProps {
  classId: string;
  onNavigate: (page: string, prefill?: any) => void;
}

// ═════════════════════════════════════════════════════════════════════════════
export default function ClassDetailPage({ classId, onNavigate }: ClassDetailPageProps) {
  const [detail,  setDetail]  = useState<VehicleClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // ✅ This drives whether we show the vehicle detail VIEW (not a modal)
  const [selectedVehicle, setSelectedVehicle] = useState<ClassVehicle | null>(null);

  useEffect(() => {
    if (!classId) return;
    setLoading(true); setError(null);
    setSelectedVehicle(null);
    classesApi.getDetail(classId)
      .then(setDetail)
      .catch(() => setError("Failed to load class details."))
      .finally(() => setLoading(false));
  }, [classId]);

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".9rem" }}>
      Loading class details…
    </div>
  );

  if (error || !detail) return (
    <div style={{ padding: "4rem", textAlign: "center", color: "#ef4444", fontSize: ".9rem" }}>
      {error ?? "Class not found."}
      <br />
      <button className="ts-btn-ghost" style={{ marginTop: 12 }} onClick={() => onNavigate("classes")}>
        ← Back to Classes
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // ✅ VEHICLE DETAIL VIEW — full page replacement, zero modal/overlay markup
  // ══════════════════════════════════════════════════════════════════════════
  if (selectedVehicle) {
    const v = selectedVehicle;
    const thumb = v.photos?.[0];
    const sm = STATUS_META[v.status] ?? { bg: "var(--bg-inner)", color: "var(--text-muted)" };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>

        {/* Back button — goes back to class detail, not classes list */}
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <button className="ts-icon-btn" onClick={() => setSelectedVehicle(null)} title="Back to class">
            <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
          </button>
          <span style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--text-h)" }}>
            {v.make} {v.model}
          </span>
          <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>— Vehicle Details</span>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* Left: photo + status */}
          <div className="ts-card" style={{
            flex: "0 0 280px", minWidth: 220, padding: "1.25rem",
            display: "flex", flexDirection: "column", gap: ".85rem",
          }}>
            <div style={{
              width: "100%", height: 165, borderRadius: 10, overflow: "hidden",
              background: "var(--bg-inner)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {thumb
                ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <DirectionsCarRoundedIcon style={{ fontSize: 52, color: "var(--text-faint)" }} />
              }
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-h)" }}>
              {v.make} {v.model}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 600 }}>Status</span>
              <span style={{
                borderRadius: 9999, padding: "3px 12px",
                fontSize: ".75rem", fontWeight: 700,
                background: sm.bg, color: sm.color,
              }}>
                {v.status === "On_Trip" ? "On Trip" : v.status}
              </span>
            </div>
          </div>

          {/* Right: attributes */}
          <div className="ts-card" style={{
            flex: 1, minWidth: 260, padding: "1.25rem 1.5rem",
            display: "flex", flexDirection: "column", gap: ".45rem",
          }}>
            <div style={{ fontSize: ".88rem", fontWeight: 800, color: "var(--text-h)", marginBottom: ".35rem" }}>
              Attributes
            </div>
            {([
              { label: "Make",   value: v.make },
              { label: "Model",  value: v.model },
              { label: "Year",   value: String(v.year) },
              { label: "Color",  value: v.color ?? "—" },
              {
                label: "Plate",
                value: v.licensePlate
                  ? <span style={{ fontFamily: "monospace", background: "var(--bg-inner)", border: "1px solid var(--border)", borderRadius: 5, padding: "1px 8px", fontSize: ".84rem" }}>{v.licensePlate}</span>
                  : <span style={{ color: "var(--text-faint)" }}>—</span>,
              },
              { label: "Active", value: v.isActive ? "Yes" : "No" },
              {
                label: "Driver",
                value: v.driverId
                  ? <span style={{ color: "var(--text-body)", fontWeight: 600 }}>Assigned</span>
                  : <span style={{ color: "var(--text-faint)" }}>Unassigned</span>,
              },
            ] as { label: string; value: React.ReactNode }[]).map(row => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", gap: ".75rem",
                padding: ".45rem .85rem", borderRadius: 8,
                background: "var(--bg-inner)", border: "1px solid var(--border)",
              }}>
                <span style={{ minWidth: 80, fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>
                  {row.label}
                </span>
                <span style={{ fontSize: ".86rem", color: "var(--text-body)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN CLASS DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("classes")} title="Back to Classes">
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

      {/* Two-column layout matching screenshot */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* LEFT: Class Overview */}
        <div className="ts-card" style={{
          flex: "0 0 300px", minWidth: 240, padding: "1.5rem",
          display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-h)" }}>
            Class Overview
          </div>

          {detail.imageUrl && (
            <div style={{ width: "100%", height: 150, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
              <img src={detail.imageUrl} alt={detail.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-h)" }}>
            {detail.name}
          </div>

          <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
            <FeatureChip icon={<AirlineSeatReclineExtraRoundedIcon style={{ fontSize: 14 }} />}
              label={`${detail.features.seats} Seats`} on={true} />
            <FeatureChip icon={<LuggageRoundedIcon style={{ fontSize: 14 }} />}
              label={`${detail.features.bags} Bags`} on={true} />
            <FeatureChip icon={<WifiRoundedIcon style={{ fontSize: 14 }} />}
              label="WiFi" on={detail.features.wifi} />
            <FeatureChip icon={<AcUnitRoundedIcon style={{ fontSize: 14 }} />}
              label="A/C" on={detail.features.ac} />
            <FeatureChip icon={<WaterDropRoundedIcon style={{ fontSize: 14 }} />}
              label="Water" on={detail.features.water} />
            <FeatureChip icon={<AccessTimeRoundedIcon style={{ fontSize: 14 }} />}
              label={`${detail.features.freeWaitingTime}min Wait`} on={true} />
            <FeatureChip icon={<DoorFrontRoundedIcon style={{ fontSize: 14 }} />}
              label="Door-to-Door" on={detail.features.doorToDoor} />
            <FeatureChip icon={<EmojiPeopleRoundedIcon style={{ fontSize: 14 }} />}
              label="Meet & Greet" on={detail.features.meetAndGreet} />
          </div>
        </div>

        {/* RIGHT: Assigned Vehicles */}
        <div className="ts-card" style={{ flex: 1, minWidth: 320, padding: 0, overflow: "hidden" }}>

          <div style={{
            padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: ".95rem", fontWeight: 800, color: "var(--text-h)" }}>
              Assigned Vehicles ({detail.vehicleCount})
            </div>
            <button className="ts-btn-primary"
              style={{ fontSize: ".82rem", padding: ".35rem .9rem" }}
              onClick={() => onNavigate("agency-vehicles")}>
              + Add Vehicle
            </button>
          </div>

          {detail.vehicles.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".875rem" }}>
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
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "7%"  }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Vehicle</th>
                    <th style={TH}>Plate</th>
                    <th style={TH}>Driver</th>
                    <th style={TH}>Status</th>
                    <th style={TH}></th>
                  </tr>
                </thead>
                <tbody>
                  {detail.vehicles.map((v: ClassVehicle) => (
                    <VehicleRow
                      key={v.id}
                      v={v}
                      onView={() => setSelectedVehicle(v)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Vehicle row — eye sets selectedVehicle, which triggers the early return ──
function VehicleRow({ v, onView }: { v: ClassVehicle; onView: () => void }) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[v.status] ?? { bg: "var(--bg-inner)", color: "var(--text-muted)" };

  return (
    <tr
      style={{
        height: ROW_H,
        background: hov ? "var(--bg-inner)" : "transparent",
        transition: "background .12s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <td style={{ ...TD_STYLE, fontWeight: 600, color: "var(--text-h)" }}>
        {v.make} {v.model}
      </td>
      <td style={TD_STYLE}>
        {v.licensePlate
          ? <span style={{
              background: "var(--bg-inner)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "2px 8px", fontSize: ".78rem", fontFamily: "monospace",
            }}>{v.licensePlate}</span>
          : <span style={{ color: "var(--text-faint)" }}>—</span>
        }
      </td>
      <td style={{ ...TD_STYLE, color: v.driverId ? "var(--text-body)" : "var(--text-faint)" }}>
        {v.driverId ? "Assigned" : "Unassigned"}
      </td>
      <td style={TD_STYLE}>
        <span style={{
          borderRadius: 9999, padding: "3px 10px",
          fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap",
          background: sm.bg, color: sm.color,
        }}>
          {v.status === "On_Trip" ? "On Trip" : v.status}
        </span>
      </td>

      {/* ✅ Eye — calls onView → sets selectedVehicle → triggers early return (full page, no modal) */}
      <td style={{ ...TD_STYLE, textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <button
          title="View vehicle details"
          onClick={onView}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: 6, border: "none",
            background: "transparent", color: "var(--text-faint)",
            cursor: "pointer", transition: "all .15s", padding: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "#7c3aed";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,.08)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}