import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import type { BackendRide } from "../../../api/rides";
import { passengerName, driverName, vehicleLabel, statusLabel, fmtDate, fmtTime } from "../../../api/rides";

/* ─── Design tokens ──────────────────────────────────────────────────── */
const T = {
  violet:       "var(--brand-to)",
  violetLight:  "var(--brand-soft)",
  violetMid:    "#a78bfa",
  violetBorder: "var(--border)",
  violetGrad:   "linear-gradient(135deg, var(--brand-soft) 0%, rgba(124,58,237,.08) 100%)",
  textH:        "var(--text-h)",
  textSub:      "var(--text-muted)",
  textFaint:    "var(--text-faint)",
  border:       "var(--border)",
  bgModal:      "var(--bg-card)",
  bgOverlay:    "rgba(0,0,0,.5)",
  bgInner:      "var(--bg-inner)",
  rModal:       "var(--r-modal)",
  rInner:       "var(--r-inner)",
  rPill:        "var(--r-pill)",
};

/* ─── Shared styles ──────────────────────────────────────────────────── */
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: T.bgOverlay,
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: "1rem", backdropFilter: "blur(4px)",
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
      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: T.violet }}>{fare.toFixed(2)} TND</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAST RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function PastRideDetailsModal({
  ride, onClose,
}: {
  ride: BackendRide;
  onClose: () => void;
}) {
  const isCompleted = ride.status === "COMPLETED";

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBase}>

        {/* Header */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Ride Details</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              RIDE ID: <span style={{ color: T.violet, fontWeight: 700 }}>#{ride.id.slice(0, 8).toUpperCase()}</span>
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
            <span style={{ fontSize: ".78rem", fontWeight: 700 }}>{statusLabel(ride.status)}</span>
          </div>

          {/* Rider + Driver */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{passengerName(ride)}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.passenger?.email ?? "—"}
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Driver</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{driverName(ride)}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <DirectionsCarRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {vehicleLabel(ride)}
              </p>
            </div>
          </div>

          {/* Route */}
          <RouteCard pickup={ride.pickupAddress} drop={ride.dropoffAddress} />

          {/* Stats */}
          <StatsGrid stats={[
            { label: "Date",     value: fmtDate(ride.scheduledAt), icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Time",     value: fmtTime(ride.scheduledAt), icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Distance", value: `${ride.distanceKmReal ?? ride.distanceKm ?? "—"} km`, icon: <RouteRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
            { label: "Duration", value: `${ride.durationMinReal ?? ride.durationMin ?? "—"} min`, icon: <AccessTimeRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
          ]} />

          {/* Fare */}
          <FareCard fare={ride.priceFinal ?? 0} />

          {/* Loyalty Points (completed only) */}
          {isCompleted && ride.loyaltyPointsEarned > 0 && (
            <div style={{ ...cardInner, padding: ".75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: ".78rem", color: T.textSub }}>Loyalty Points Earned</span>
              <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#7c3aed" }}>+{ride.loyaltyPointsEarned} pts</span>
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
