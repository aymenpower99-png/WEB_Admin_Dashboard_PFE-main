import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const T = {
  orange:      "#7c3aed",
  orangeLight: "#ede9fe",
  orangeBorder:"#ddd6fe",
  violet:      "#7c3aed",
  violetLight: "#ede9fe",
  violetMid:   "#a78bfa",
  violetBorder:"#ddd6fe",
  textH:       "#111827",
  textSub:     "#6b7280",
  textFaint:   "#9ca3af",
  border:      "#e5e7eb",
  bgModal:     "#ffffff",
  bgOverlay:   "rgba(17,24,39,.45)",
  bgInner:     "#f9fafb",
  bgFareCard:  "linear-gradient(135deg,#ede9fe 0%,#e0e7ff 100%)",
  rModal:      "16px",
  rInner:      "10px",
  rPill:       "9999px",
};

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface UpcomingRide {
  id: number;
  rider: string;
  driver: string;
  driverRating: number;
  driverAvatar: string;
  vehicle: string;
  plate: string;
  pickup: string;
  drop: string;
  vehicleType: string;
  date: string;
  time: string;
  fare: number;
  distance: string;
  duration: string;
  passengerCount: number;
}

export interface AvailableDriver {
  id: number;
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  status: "available" | "nearby";
  trips: number;
  avatar: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fmt12(t: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function fmtDate(d: string) {
  if (!d) return "—";
  try {
    return new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return d; }
}

/* ─── Shared inline styles ──────────────────────────────────────────────── */
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: T.bgOverlay,
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: "1rem",
};

const modal: React.CSSProperties = {
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
  background: T.orange, color: "#fff",
  border: "none", borderRadius: "8px",
  padding: ".55rem 1.1rem", fontSize: ".82rem", fontWeight: 600,
  cursor: "pointer", transition: "opacity .15s",
};

const btnPrimaryDisabled: React.CSSProperties = {
  ...btnPrimary, opacity: .45, cursor: "not-allowed",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: "transparent", color: T.textSub,
  border: "none", borderRadius: "8px",
  padding: ".55rem .9rem", fontSize: ".82rem", fontWeight: 500,
  cursor: "pointer",
};

const cardInner: React.CSSProperties = {
  background: T.bgInner, borderRadius: T.rInner,
  border: `1px solid ${T.border}`,
};

const searchBar: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: ".5rem",
  background: T.bgInner, border: `1px solid ${T.border}`,
  borderRadius: "8px", padding: ".5rem .75rem",
  fontSize: ".82rem", color: T.textSub,
};

/* ─── Mock drivers ──────────────────────────────────────────────────────── */
export const DRIVERS: AvailableDriver[] = [
  { id: 1, name: "John D",   rating: 4.9, vehicle: "Toyota Corolla", plate: "TN-1234-A", status: "available", trips: 412, avatar: "JD" },
  { id: 2, name: "Emily R",  rating: 4.7, vehicle: "Kia Rio",        plate: "TN-5678-B", status: "nearby",    trips: 289, avatar: "ER" },
  { id: 3, name: "Ahmed K",  rating: 4.8, vehicle: "Mercedes Vito",  plate: "TN-9012-C", status: "available", trips: 631, avatar: "AK" },
  { id: 4, name: "Fatima Z", rating: 4.6, vehicle: "Hyundai Tucson", plate: "TN-3456-D", status: "available", trips: 178, avatar: "FZ" },
  { id: 5, name: "Rami B",   rating: 4.9, vehicle: "BMW 5 Series",   plate: "TN-7890-E", status: "nearby",    trips: 520, avatar: "RB" },
];

/* ════════════════════════════════════════════════════════════════════════════
   1. REASSIGN DRIVER MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function ReassignDriverModal({
  ride, onClose, onReassign,
}: {
  ride: UpcomingRide;
  onClose: () => void;
  onReassign: (rideId: number, driver: AvailableDriver) => void;
}) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = DRIVERS.filter(
    (d) =>
      d.name !== ride.driver &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...modal, maxWidth: "420px", maxHeight: "80vh" }}>

        {/* Header */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: T.textH, margin: 0 }}>
              Reassign Driver
            </p>
            <p style={{ fontSize: ".75rem", color: T.textSub, marginTop: ".2rem", marginBottom: 0 }}>
              Currently: <strong style={{ color: T.textH }}>{ride.driver}</strong> · {ride.rider}'s ride
            </p>
          </div>
          <button style={btnClose} onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 15 }} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "1rem 1.5rem .5rem" }}>
          <div style={searchBar}>
            <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
            <input
              placeholder="Search driver or vehicle…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: ".82rem", color: T.textH, flex: 1 }}
            />
          </div>
        </div>

        {/* Driver list */}
        <div style={{ padding: ".5rem 1.5rem 1rem", display: "flex", flexDirection: "column", gap: ".5rem", overflowY: "auto" }}>
          {filtered.map((driver) => {
            const isSel = selected === driver.id;
            return (
              <div
                key={driver.id}
                onClick={() => setSelected(driver.id)}
                style={{
                  display: "flex", alignItems: "center", gap: ".75rem",
                  padding: ".75rem", borderRadius: T.rInner, cursor: "pointer",
                  border: isSel ? `1.5px solid ${T.orange}` : `1px solid ${T.border}`,
                  background: isSel ? T.orangeLight : T.bgInner,
                  transition: "all .15s ease",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: isSel ? T.orangeLight : T.violetLight,
                  border: `1.5px solid ${isSel ? T.orangeBorder : T.violetBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: ".72rem",
                  color: isSel ? T.orange : T.violet,
                }}>
                  {driver.avatar}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                    <span style={{ fontWeight: 600, fontSize: ".83rem", color: T.textH }}>{driver.name}</span>
                    <span style={{
                      fontSize: ".62rem", fontWeight: 600, padding: ".1rem .45rem", borderRadius: T.rPill,
                      background: driver.status === "available" ? "#dcfce7" : "#fef9c3",
                      color:      driver.status === "available" ? "#15803d"  : "#854d0e",
                    }}>
                      {driver.status === "available" ? "Available" : "Nearby"}
                    </span>
                  </div>
                  <p style={{ fontSize: ".72rem", color: T.textSub, margin: ".1rem 0 0" }}>
                    {driver.vehicle} · {driver.plate}
                  </p>
                </div>

                {/* Rating */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".2rem", justifyContent: "flex-end" }}>
                    <StarRoundedIcon style={{ fontSize: 12, color: "#f59e0b" }} />
                    <span style={{ fontSize: ".75rem", fontWeight: 600, color: T.textH }}>{driver.rating}</span>
                  </div>
                  <p style={{ fontSize: ".68rem", color: T.textFaint, margin: ".1rem 0 0" }}>{driver.trips} trips</p>
                </div>

                {/* Check */}
                {isSel && (
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    background: T.orange,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckRoundedIcon style={{ fontSize: 12, color: "#fff" }} />
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p style={{ fontSize: ".8rem", color: T.textSub, textAlign: "center", padding: "1rem 0" }}>
              No other drivers available.
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button
            style={selected === null ? btnPrimaryDisabled : btnPrimary}
            disabled={selected === null}
            onClick={() => {
              const driver = DRIVERS.find((d) => d.id === selected)!;
              onReassign(ride.id, driver);
              onClose();
            }}
          >
            <SwapHorizRoundedIcon style={{ fontSize: 15 }} /> Confirm Reassignment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. EDIT TIME / CHANGE SCHEDULE MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function EditTimeModal({
  ride, onClose, onSave,
}: {
  ride: UpcomingRide;
  onClose: () => void;
  onSave: (rideId: number, date: string, time: string) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState(ride.time);

  const fieldInput: React.CSSProperties = {
    width: "100%", paddingLeft: "2.25rem", paddingRight: ".75rem", height: "2.4rem",
    borderRadius: "8px", fontSize: ".83rem",
    border: `1px solid ${T.border}`,
    background: T.bgInner, color: T.textH, outline: "none",
    boxSizing: "border-box", transition: "border-color .15s",
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...modal, maxWidth: "360px" }}>

        {/* Header */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: T.textH, margin: 0 }}>Change Schedule</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".2rem", marginBottom: 0 }}>
              {ride.rider} · {ride.pickup} → {ride.drop}
            </p>
          </div>
          <button style={btnClose} onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 15 }} />
          </button>
        </div>

        {/* Body */}
        <div style={modalBody}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            {/* Date */}
            <div>
              <label style={{ fontSize: ".72rem", fontWeight: 600, color: T.textSub, display: "block", marginBottom: ".35rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
                Date
              </label>
              <div style={{ position: "relative" }}>
                <CalendarTodayRoundedIcon style={{
                  fontSize: 14, color: T.textFaint,
                  position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)",
                }} />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={fieldInput} />
              </div>
            </div>
            {/* Time */}
            <div>
              <label style={{ fontSize: ".72rem", fontWeight: 600, color: T.textSub, display: "block", marginBottom: ".35rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
                Time
              </label>
              <div style={{ position: "relative" }}>
                <AccessTimeRoundedIcon style={{
                  fontSize: 14, color: T.textFaint,
                  position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)",
                }} />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={fieldInput} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button
            style={!time ? btnPrimaryDisabled : btnPrimary}
            disabled={!time}
            onClick={() => {
              onSave(ride.id, date ? fmtDate(date) : ride.date, time);
              onClose();
            }}
          >
            <CheckRoundedIcon style={{ fontSize: 14 }} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function UpcomingRideDetailsModal({
  ride, onClose,
}: {
  ride: UpcomingRide;
  onClose: () => void;
}) {
  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modal}>

        {/* ── Header ── */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Ride Details</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              BOOKING ID:{" "}
              <span style={{ color: T.orange, fontWeight: 700 }}>
                #RID-{String(ride.id).padStart(5, "0")}
              </span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 15 }} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={modalBody}>

          {/* Rider / Driver row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>
                Rider
              </p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: 0 }}>
                {ride.rider}
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>
                Driver
              </p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: 0 }}>
                {ride.driver}
              </p>
            </div>
          </div>

          {/* Route */}
          <div style={{ ...cardInner, padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", marginBottom: ".875rem" }}>
              <div style={{ paddingTop: ".15rem", flexShrink: 0 }}>
                <RadioButtonCheckedRoundedIcon style={{ fontSize: 16, color: T.orange }} />
              </div>
              <div>
                <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .15rem" }}>
                  Pickup Location
                </p>
                <p style={{ fontSize: ".85rem", fontWeight: 600, color: T.textH, margin: 0 }}>{ride.pickup}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".875rem", paddingLeft: ".35rem" }}>
              <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom, ${T.orange}, ${T.violet})`, borderRadius: "2px", marginLeft: "5px" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
              <div style={{ paddingTop: ".15rem", flexShrink: 0 }}>
                <FmdGoodRoundedIcon style={{ fontSize: 16, color: T.violet }} />
              </div>
              <div>
                <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .15rem" }}>
                  Drop-off Location
                </p>
                <p style={{ fontSize: ".85rem", fontWeight: 600, color: T.textH, margin: 0 }}>{ride.drop}</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: ".5rem" }}>
            {[
              { label: "DATE",     value: ride.date,        icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
              { label: "TIME",     value: fmt12(ride.time), icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
              { label: "DISTANCE", value: ride.distance,    icon: <RouteRoundedIcon         style={{ fontSize: 14, color: T.violet    }} /> },
              { label: "DURATION", value: ride.duration,    icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.violet    }} /> },
            ].map((s) => (
              <div key={s.label} style={{ ...cardInner, padding: ".625rem", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: ".25rem" }}>{s.icon}</div>
                <p style={{ fontSize: ".63rem", color: T.textFaint, margin: "0 0 .2rem", letterSpacing: ".04em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
                <p style={{ fontSize: ".8rem", fontWeight: 700, color: T.textH, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Fare card */}
          <div style={{
            background: T.bgFareCard,
            borderRadius: T.rInner,
            border: `1px solid ${T.violetBorder}`,
            padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <p style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.violet, margin: 0 }}>
              Total Fare
            </p>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: T.violet }}>
              ${ride.fare.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={modalFooter}>
          <button style={btnPrimary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}