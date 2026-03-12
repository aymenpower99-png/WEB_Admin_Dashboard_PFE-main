import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";

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
export type RideStatus = "completed" | "cancelled";

export interface PastRide {
  id: number;
  rider: string;
  driver: string;
  driverAvatar: string;
  driverRating: number;
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
  status: RideStatus;
  riderRating: number | null;
  paymentMethod: string;
}

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
   PAST RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function PastRideDetailsModal({
  ride, onClose,
}: {
  ride: PastRide;
  onClose: () => void;
}) {
  const isCompleted = ride.status === "completed";

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

          {/* Status banner */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
            padding: ".55rem 1rem", borderRadius: T.rInner,
            background: isCompleted ? "#d1fae5" : "#fee2e2",
            color: isCompleted ? "#059669" : "#dc2626",
          }}>
            {isCompleted
              ? <CheckCircleRoundedIcon style={{ fontSize: 15 }} />
              : <CancelRoundedIcon      style={{ fontSize: 15 }} />
            }
            <span style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "capitalize" }}>{ride.status}</span>
          </div>

          {/* Rider + Driver */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{ride.rider}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.passengerCount} pax
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Driver</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{ride.driver}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <DirectionsCarRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.vehicle}
              </p>
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

          {/* Rider rating (completed only) */}
          {isCompleted && ride.riderRating !== null && (
            <div style={{ ...cardInner, padding: ".75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: ".78rem", color: T.textSub }}>Rider Rating</span>
              <div style={{ display: "flex", alignItems: "center", gap: ".2rem" }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <StarRoundedIcon key={i} style={{ fontSize: 14, color: i <= (ride.riderRating ?? 0) ? "#f59e0b" : T.border }} />
                ))}
                <span style={{ fontSize: ".78rem", fontWeight: 700, color: T.textH, marginLeft: ".25rem" }}>{ride.riderRating}.0</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Report Issue</button>
          <button style={btnPrimary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}