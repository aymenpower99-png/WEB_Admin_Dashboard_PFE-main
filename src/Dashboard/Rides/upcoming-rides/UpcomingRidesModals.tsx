import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import type { BackendRide } from "../../../api/rides";
import { ridesApi, passengerName, driverName, vehicleLabel, statusLabel, fmtDate, fmtTime } from "../../../api/rides";

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
  position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: "1rem", backdropFilter: "blur(8px)",
};

const modalBase: React.CSSProperties = {
  background: T.bgModal, borderRadius: T.rModal,
  boxShadow: "0 24px 60px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.06)",
  width: "100%", maxWidth: "480px",
  display: "flex", flexDirection: "column",
  maxHeight: "90vh", overflow: "hidden",
  border: `1.5px solid ${T.border}`,
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

const modalHeader: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", justifyContent: "space-between",
  padding: "1.2rem 1.5rem",
  borderBottom: `1.5px solid ${T.border}`,
  background: T.bgInner,
};

const modalBody: React.CSSProperties = {
  padding: "1.4rem 1.5rem",
  display: "flex", flexDirection: "column", gap: "1.05rem",
  overflowY: "auto",
};

const modalFooter: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: ".75rem",
  padding: "1rem 1.5rem",
  borderTop: `1.5px solid ${T.border}`,
  background: T.bgInner,
};

const btnClose: React.CSSProperties = {
  width: 32, height: 32, borderRadius: "8px",
  border: `1.5px solid ${T.border}`, background: T.bgInner,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: T.textSub, flexShrink: 0,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: "linear-gradient(135deg, #a855f7, #7c22ce)", color: "#fff",
  border: "none", borderRadius: "10px",
  padding: ".55rem 1.25rem", fontSize: ".82rem", fontWeight: 700, cursor: "pointer",
  boxShadow: "0 4px 16px rgba(168,85,247,0.18)",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: "transparent", color: T.textSub,
  border: `1.5px solid ${T.border}`, borderRadius: "10px",
  padding: ".55rem 1rem", fontSize: ".82rem", fontWeight: 600, cursor: "pointer",
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

function FareCard({ fare }: { fare: number | null }) {
  return (
    <div style={{
      background: T.violetGrad, borderRadius: T.rInner, border: `1px solid ${T.violetBorder}`,
      padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <p style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.violet, margin: 0 }}>Total Fare</p>
      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: T.violet }}>{fare != null ? `${fare} TND` : "—"}</span>
    </div>
  );
}

/* ─── Status banner colours ──────────────────────────────────────────── */
const STATUS_CFG: Record<string, { bg: string; fg: string }> = {
  ASSIGNED:           { bg: "#d1fae5", fg: "#059669" },
  EN_ROUTE_TO_PICKUP: { bg: "#dbeafe", fg: "#2563eb" },
  ARRIVED:            { bg: "#fff7ed", fg: "#c2410c" },
  IN_TRIP:            { bg: "#ede9fe", fg: "#7c3aed" },
};

/* ════════════════════════════════════════════════════════════════════════════
   1. UPCOMING RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function UpcomingRideDetailsModal({
  ride, onClose, onCancel,
}: {
  ride: BackendRide;
  onClose: () => void;
  onCancel?: () => void;
}) {
  const sc = STATUS_CFG[ride.status] ?? { bg: T.bgInner, fg: T.textSub };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBase}>

        {/* ── Header ── */}
        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Ride Details</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              RIDE ID: <span style={{ color: T.violet, fontWeight: 700 }}>{ride.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        {/* ── Body ── */}
        <div style={modalBody}>

          {/* Status banner */}
          <div style={{
            padding: ".45rem .85rem", borderRadius: T.rPill,
            background: sc.bg, color: sc.fg,
            fontSize: ".72rem", fontWeight: 700, textAlign: "center",
            letterSpacing: ".04em", textTransform: "uppercase",
          }}>
            {statusLabel(ride.status)}
          </div>

          {/* Rider / Driver */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{passengerName(ride)}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.passenger?.email ?? ""}
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Driver</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{driverName(ride)}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <DirectionsCarRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {vehicleLabel(ride)}{ride.vehicle?.licensePlate ? ` · ${ride.vehicle.licensePlate}` : ""}
              </p>
            </div>
          </div>

          <RouteCard pickup={ride.pickupAddress} drop={ride.dropoffAddress} />

          <StatsGrid stats={[
            { label: "Date",     value: fmtDate(ride.scheduledAt), icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Time",     value: fmtTime(ride.scheduledAt), icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Distance", value: ride.distanceKm ? `${ride.distanceKm} km` : "—", icon: <RouteRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
            { label: "Duration", value: ride.durationMin ? `${ride.durationMin} min` : "—", icon: <AccessTimeRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
          ]} />

          <FareCard fare={ride.priceFinal} fareEstimate={ride.priceEstimate} />
        </div>

        {/* ── Footer ── */}
        <div style={modalFooter}>
          {onCancel && (
            <button style={btnGhost} onClick={onCancel}>Cancel</button>
          )}
          <button style={btnPrimary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. CANCEL RIDE MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function CancelRideModal({
  ride, onClose, onCancelled,
}: {
  ride: BackendRide;
  onClose: () => void;
  onCancelled: (id: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await ridesApi.cancel(ride.id, reason.trim() ? { cancellation_reason: reason.trim() } : undefined);
      onCancelled(ride.id);
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...modalBase, maxWidth: "400px" }}>

        <div style={modalHeader}>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Cancel Ride?</p>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        <div style={modalBody}>
          <p style={{ fontSize: ".85rem", color: T.textSub, margin: 0, lineHeight: 1.5 }}>
            This action will cancel the ride for{" "}
            <strong style={{ color: T.textH }}>{passengerName(ride)}</strong>.
            The driver will be notified and the passenger will be refunded according to the cancellation policy.
          </p>

          <div>
            <label style={{ fontSize: ".72rem", fontWeight: 600, color: T.textSub, display: "block", marginBottom: ".35rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter cancellation reason…"
              rows={3}
              style={{
                width: "100%", padding: ".55rem .75rem", borderRadius: "8px",
                border: `1px solid ${T.border}`, background: T.bgInner,
                fontSize: ".82rem", color: T.textH, outline: "none",
                resize: "vertical", boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Keep Ride</button>
          <button
            style={{
              ...btnPrimary,
              background: "#dc2626",
              ...(loading ? { opacity: 0.45, cursor: "not-allowed" } : {}),
            }}
            disabled={loading}
            onClick={handleCancel}
          >
            {loading ? "Cancelling…" : "Cancel Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}
