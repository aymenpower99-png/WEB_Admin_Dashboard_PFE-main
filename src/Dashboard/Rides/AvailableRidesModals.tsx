import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";

/* ─── Design tokens ──────────────────────────────────────────────────── */
const T = {
  violet:       "#7c3aed",
  violetLight:  "#ede9fe",
  violetMid:    "#a78bfa",
  violetBorder: "#ddd6fe",
  violetGrad:   "linear-gradient(135deg,#ede9fe 0%,#e0e7ff 100%)",
  textH:        "#111827",
  textSub:      "#6b7280",
  textFaint:    "#9ca3af",
  border:       "#e5e7eb",
  bgModal:      "#ffffff",
  bgOverlay:    "rgba(17,24,39,.45)",
  bgInner:      "#f9fafb",
  rModal:       "16px",
  rInner:       "10px",
  rPill:        "9999px",
};

/* ─── Types ──────────────────────────────────────────────────────────── */
export interface RideRequest {
  id: number;
  rider: string;
  pickup: string;
  drop: string;
  vehicleClass: string;
  date: string;
  time: string;
  fare: number;
  distance: string;
  duration: string;
  status: string;
  passengerCount: number;
}

export interface AvailableDriver {
  id: number;
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  distance: string;
  eta: string;
  trips: number;
}

/* ─── Mock drivers ───────────────────────────────────────────────────── */
const MOCK_DRIVERS: AvailableDriver[] = [
  { id: 1, name: "Ahmed Ben Ali",  vehicle: "Toyota Corolla",  plate: "TN-1234", rating: 4.8, distance: "0.8 km", eta: "3 min", trips: 312 },
  { id: 2, name: "Sami Trabelsi",  vehicle: "Hyundai Tucson",  plate: "TN-5678", rating: 4.6, distance: "1.2 km", eta: "5 min", trips: 198 },
  { id: 3, name: "Riadh Khelifi",  vehicle: "Renault Megane",  plate: "TN-9012", rating: 4.9, distance: "0.5 km", eta: "2 min", trips: 540 },
  { id: 4, name: "Imed Bouazizi",  vehicle: "Kia Sportage",    plate: "TN-3456", rating: 4.5, distance: "2.1 km", eta: "8 min", trips: 87  },
  { id: 5, name: "Hedi Gharbi",    vehicle: "Volkswagen Polo", plate: "TN-7890", rating: 4.7, distance: "1.5 km", eta: "6 min", trips: 221 },
];

/* ─── Shared styles ──────────────────────────────────────────────────── */
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: T.bgOverlay,
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: "1rem",
};

const modalBase: React.CSSProperties = {
  background: T.bgModal, borderRadius: T.rModal,
  boxShadow: "0 20px 60px rgba(0,0,0,.18)",
  width: "100%", maxWidth: "480px",
  display: "flex", flexDirection: "column",
  maxHeight: "90vh", overflow: "hidden",
};

const modalHeader: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", justifyContent: "space-between",
  padding: "1.25rem 1.5rem 1rem",
  borderBottom: `1px solid ${T.border}`,
};

const modalBody: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  display: "flex", flexDirection: "column", gap: "1rem",
  overflowY: "auto",
};

const modalFooter: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: ".75rem",
  padding: "1rem 1.5rem",
  borderTop: `1px solid ${T.border}`,
};

const btnClose: React.CSSProperties = {
  width: 28, height: 28, borderRadius: "50%",
  border: `1px solid ${T.border}`, background: "transparent",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: T.textSub, flexShrink: 0,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: T.violet, color: "#fff", border: "none", borderRadius: "8px",
  padding: ".55rem 1.25rem", fontSize: ".82rem", fontWeight: 600, cursor: "pointer",
};

const btnPrimaryDisabled: React.CSSProperties = {
  ...btnPrimary, opacity: .45, cursor: "not-allowed",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: "transparent", color: T.textSub, border: "none", borderRadius: "8px",
  padding: ".55rem .9rem", fontSize: ".82rem", fontWeight: 500, cursor: "pointer",
};

const cardInner: React.CSSProperties = {
  background: T.bgInner, borderRadius: T.rInner, border: `1px solid ${T.border}`,
};

/* ─── Shared sub-components ──────────────────────────────────────────── */
function RouteCard({ pickup, drop }: { pickup: string; drop: string }) {
  return (
    <div style={{ ...cardInner, padding: "1rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", marginBottom: ".75rem" }}>
        <RadioButtonCheckedRoundedIcon style={{ fontSize: 16, color: T.violet, flexShrink: 0, marginTop: ".1rem" }} />
        <div>
          <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .15rem" }}>
            Pickup Location
          </p>
          <p style={{ fontSize: ".85rem", fontWeight: 600, color: T.textH, margin: 0 }}>{pickup}</p>
        </div>
      </div>
      <div style={{ marginLeft: "5px", marginBottom: ".75rem" }}>
        <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom,${T.violet},${T.violetMid})`, borderRadius: 2, marginLeft: "2px" }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
        <FmdGoodRoundedIcon style={{ fontSize: 16, color: T.violet, flexShrink: 0, marginTop: ".1rem" }} />
        <div>
          <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .15rem" }}>
            Drop-off Location
          </p>
          <p style={{ fontSize: ".85rem", fontWeight: 600, color: T.textH, margin: 0 }}>{drop}</p>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: { label: string; value: string; icon: React.ReactNode }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)`, gap: ".5rem" }}>
      {stats.map((s) => (
        <div key={s.label} style={{ ...cardInner, padding: ".625rem", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: ".25rem" }}>{s.icon}</div>
          <p style={{ fontSize: ".63rem", color: T.textFaint, margin: "0 0 .2rem", letterSpacing: ".04em", textTransform: "uppercase" }}>{s.label}</p>
          <p style={{ fontSize: ".8rem", fontWeight: 700, color: T.textH, margin: 0 }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function FareCard({ fare }: { fare: number }) {
  return (
    <div style={{
      background: T.violetGrad, borderRadius: T.rInner, border: `1px solid ${T.violetBorder}`,
      padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <p style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.violet, margin: 0 }}>Total Fare</p>
      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: T.violet }}>${fare.toFixed(2)}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1. ASSIGN DRIVER MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function AssignDriverModal({
  ride, onClose, onAssign,
}: {
  ride: RideRequest;
  onClose: () => void;
  onAssign: (rideId: number, driver: AvailableDriver) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = MOCK_DRIVERS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBase}>

        {/* Header */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Assign Driver</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              BOOKING ID: <span style={{ color: T.violet, fontWeight: 700 }}>#RID-{String(ride.id).padStart(5, "0")}</span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        <div style={modalBody}>

          {/* Rider + unassigned driver */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{ride.rider}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.passengerCount} pax
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem", border: `1.5px dashed ${T.violetBorder}`, background: T.violetLight }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Driver</p>
              <p style={{ fontWeight: 600, fontSize: ".82rem", color: T.violetMid, margin: 0 }}>Unassigned</p>
            </div>
          </div>

          {/* Route */}
          <RouteCard pickup={ride.pickup} drop={ride.drop} />

          {/* Stats */}
          <StatsGrid stats={[
            { label: "Date",     value: ride.date,     icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Time",     value: ride.time,     icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Distance", value: ride.distance, icon: <RouteRoundedIcon         style={{ fontSize: 14, color: T.violet    }} /> },
            { label: "Duration", value: ride.duration, icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.violet    }} /> },
          ]} />

          {/* Fare */}
          <FareCard fare={ride.fare} />

          {/* Driver selector */}
          <div>
            <p style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .5rem" }}>
              Select a Driver
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: ".5rem",
              border: `1px solid ${T.border}`, borderRadius: T.rInner,
              padding: ".5rem .75rem", background: T.bgInner, marginBottom: ".6rem",
            }}>
              <SearchRoundedIcon style={{ fontSize: 14, color: T.textFaint }} />
              <input
                placeholder="Search drivers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: ".82rem", flex: 1, color: T.textH }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", maxHeight: 220, overflowY: "auto" }}>
              {filtered.map(driver => {
                const isSel = selected === driver.id;
                return (
                  <div
                    key={driver.id}
                    onClick={() => setSelected(driver.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: ".75rem",
                      padding: ".75rem", borderRadius: T.rInner, cursor: "pointer",
                      border: `1.5px solid ${isSel ? T.violet : T.border}`,
                      background: isSel ? T.violetLight : T.bgInner,
                      transition: "all .15s",
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      background: isSel ? T.violet : T.violetLight,
                      border: `1.5px solid ${isSel ? T.violetMid : T.violetBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: ".72rem",
                      color: isSel ? "#fff" : T.violet,
                    }}>
                      {driver.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: ".83rem", color: T.textH }}>{driver.name}</p>
                      <p style={{ margin: 0, fontSize: ".71rem", color: T.textSub }}>{driver.vehicle} · {driver.plate}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".15rem", flexShrink: 0 }}>
                      <span style={{ fontSize: ".72rem", color: "#f59e0b", fontWeight: 600 }}>
                        <StarRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {driver.rating}
                      </span>
                      <span style={{ fontSize: ".71rem", color: T.textSub }}>{driver.eta} away</span>
                    </div>
                    {isSel && (
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: T.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckRoundedIcon style={{ fontSize: 12, color: "#fff" }} />
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p style={{ textAlign: "center", color: T.textFaint, fontSize: ".8rem", padding: "1rem 0" }}>No drivers found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button
            style={selected === null ? btnPrimaryDisabled : btnPrimary}
            disabled={selected === null}
            onClick={() => { const d = MOCK_DRIVERS.find(d => d.id === selected)!; onAssign(ride.id, d); onClose(); }}
          >
            <SwapHorizRoundedIcon style={{ fontSize: 14 }} /> Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. AVAILABLE RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function AvailableRideDetailsModal({
  ride, onClose,
}: {
  ride: RideRequest;
  onClose: () => void;
}) {
  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBase}>

        {/* Header */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Ride Details</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              BOOKING ID: <span style={{ color: T.violet, fontWeight: 700 }}>#RID-{String(ride.id).padStart(5, "0")}</span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        <div style={modalBody}>

          {/* Rider + vehicle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{ride.rider}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.passengerCount} pax
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Class</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .25rem" }}>{ride.vehicleClass}</p>
              <span style={{
                fontSize: ".65rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: T.rPill,
                background: "#fef3c7", color: "#d97706", textTransform: "uppercase", letterSpacing: ".04em",
              }}>
                {ride.status}
              </span>
            </div>
          </div>

          {/* Route */}
          <RouteCard pickup={ride.pickup} drop={ride.drop} />

          {/* Stats */}
          <StatsGrid stats={[
            { label: "Date",     value: ride.date,     icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Time",     value: ride.time,     icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Distance", value: ride.distance, icon: <RouteRoundedIcon         style={{ fontSize: 14, color: T.violet    }} /> },
            { label: "Duration", value: ride.duration, icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.violet    }} /> },
          ]} />

          {/* Fare */}
          <FareCard fare={ride.fare} />
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}