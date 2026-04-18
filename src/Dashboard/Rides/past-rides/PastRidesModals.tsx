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
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import type { BackendRide } from "../../../api/rides";
import {
  passengerName,
  driverName,
  vehicleLabel,
  statusLabel,
  fmtDate,
  fmtTime,
} from "../../../api/rides";

/* ─── Design tokens ──────────────────────────────────────────────────── */
const T = {
  violet: "var(--brand-to)",
  violetLight: "var(--brand-soft)",
  violetMid: "#a78bfa",
  violetBorder: "var(--border)",
  violetGrad:
    "linear-gradient(135deg, var(--brand-soft) 0%, rgba(124,58,237,.08) 100%)",
  textH: "var(--text-h)",
  textSub: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  border: "var(--border)",
  bgModal: "var(--bg-card)",
  bgOverlay: "rgba(0,0,0,.5)",
  bgInner: "var(--bg-inner)",
  rModal: "var(--r-modal)",
  rInner: "var(--r-inner)",
  rPill: "var(--r-pill)",
};

/* ─── Shared styles ──────────────────────────────────────────────────── */
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
  backdropFilter: "blur(8px)",
};

const modalBase: React.CSSProperties = {
  background: T.bgModal,
  borderRadius: T.rModal,
  boxShadow: "0 24px 60px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.06)",
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
  overflow: "hidden",
  border: `1.5px solid ${T.border}`,
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

const modalHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  padding: "1.2rem 1.5rem",
  borderBottom: `1.5px solid ${T.border}`,
  background: T.bgInner,
};

const modalBody: React.CSSProperties = {
  padding: "1.4rem 1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.05rem",
  overflowY: "auto",
};

const modalFooter: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: ".75rem",
  padding: "1rem 1.5rem",
  borderTop: `1.5px solid ${T.border}`,
  background: T.bgInner,
};

const btnClose: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "8px",
  border: `1.5px solid ${T.border}`,
  background: T.bgInner,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: T.textSub,
  flexShrink: 0,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: ".4rem",
  background: "linear-gradient(135deg, #a855f7, #7c22ce)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: ".55rem 1.25rem",
  fontSize: ".82rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(168,85,247,0.18)",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: ".4rem",
  background: "transparent",
  color: T.textSub,
  border: `1.5px solid ${T.border}`,
  borderRadius: "10px",
  padding: ".55rem 1rem",
  fontSize: ".82rem",
  fontWeight: 600,
  cursor: "pointer",
};

const cardInner: React.CSSProperties = {
  background: T.bgInner,
  borderRadius: T.rInner,
  border: `1px solid ${T.border}`,
};

/* ─── Shared sub-components ──────────────────────────────────────────── */
function RouteCard({ pickup, drop }: { pickup: string; drop: string }) {
  return (
    <div style={{ ...cardInner, padding: "1rem 1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: ".75rem",
          marginBottom: ".75rem",
        }}
      >
        <RadioButtonCheckedRoundedIcon
          style={{
            fontSize: 16,
            color: T.violet,
            flexShrink: 0,
            marginTop: ".1rem",
          }}
        />
        <div>
          <p
            style={{
              fontSize: ".65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: T.textFaint,
              margin: "0 0 .15rem",
            }}
          >
            Pickup Location
          </p>
          <p
            style={{
              fontSize: ".85rem",
              fontWeight: 600,
              color: T.textH,
              margin: 0,
            }}
          >
            {pickup}
          </p>
        </div>
      </div>
      <div style={{ marginLeft: "5px", marginBottom: ".75rem" }}>
        <div
          style={{
            width: 2,
            height: 20,
            background: `linear-gradient(to bottom,${T.violet},${T.violetMid})`,
            borderRadius: 2,
            marginLeft: "2px",
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
        <FmdGoodRoundedIcon
          style={{
            fontSize: 16,
            color: T.violet,
            flexShrink: 0,
            marginTop: ".1rem",
          }}
        />
        <div>
          <p
            style={{
              fontSize: ".65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: T.textFaint,
              margin: "0 0 .15rem",
            }}
          >
            Drop-off Location
          </p>
          <p
            style={{
              fontSize: ".85rem",
              fontWeight: 600,
              color: T.textH,
              margin: 0,
            }}
          >
            {drop}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({
  stats,
}: {
  stats: { label: string; value: string; icon: React.ReactNode }[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length},1fr)`,
        gap: ".5rem",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{ ...cardInner, padding: ".625rem", textAlign: "center" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: ".25rem",
            }}
          >
            {s.icon}
          </div>
          <p
            style={{
              fontSize: ".63rem",
              color: T.textFaint,
              margin: "0 0 .2rem",
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            {s.label}
          </p>
          <p
            style={{
              fontSize: ".8rem",
              fontWeight: 700,
              color: T.textH,
              margin: 0,
            }}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function FareCard({
  fare,
  fareEstimate,
}: {
  fare: number;
  fareEstimate?: number | null;
}) {
  return (
    <div
      style={{
        background: T.violetGrad,
        borderRadius: T.rInner,
        border: `1px solid ${T.violetBorder}`,
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p
        style={{
          fontSize: ".68rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          color: T.violet,
          margin: 0,
        }}
      >
        Total Fare
      </p>
      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: T.violet }}>
        {fare.toFixed(2)} TND
      </span>
    </div>
  );
}

/* ─── Dispatch Report ────────────────────────────────────────────────── */
function DispatchReport({ ride }: { ride: BackendRide }) {
  const snap = ride.dispatchSnapshot;
  if (!snap) return null;

  const statusColor = (s: string) => {
    if (s === "ACCEPTED") return "#10b981";
    if (s === "REJECTED") return "#ef4444";
    if (s === "EXPIRED")  return "#f59e0b";
    return "#6b7280";
  };

  const noDrivers = snap.totalOffers === 0;

  return (
    <div style={{ ...cardInner, padding: "1rem 1.25rem", borderColor: "rgba(239,68,68,.25)", background: "rgba(239,68,68,.04)" }}>
      <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#ef4444", margin: "0 0 .6rem" }}>
        Dispatch Report
      </p>

      {/* Summary row */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: ".6rem" }}>
        {[
          { label: "Attempts", value: `${snap.attempts} / 3` },
          { label: "Offers Sent", value: `${snap.totalOffers}` },
          { label: "Result", value: snap.result === "ASSIGNED" ? "Driver Found" : "No Driver" },
        ].map((s) => (
          <div key={s.label} style={{ flex: "1 1 70px", background: T.bgModal, borderRadius: "8px", border: `1px solid ${T.border}`, padding: ".45rem .6rem", textAlign: "center" }}>
            <p style={{ fontSize: ".6rem", color: T.textFaint, margin: "0 0 .15rem", textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</p>
            <p style={{ fontSize: ".78rem", fontWeight: 700, color: T.textH, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Diagnosis */}
      {noDrivers ? (
        <div style={{ background: "rgba(239,68,68,.08)", borderRadius: "8px", padding: ".6rem .75rem", display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>🚫</span>
          <div>
            <p style={{ fontSize: ".76rem", fontWeight: 700, color: "#ef4444", margin: "0 0 .15rem" }}>No eligible drivers found in search area</p>
            <p style={{ fontSize: ".7rem", color: T.textSub, margin: 0 }}>
              All 3 dispatch attempts (10 km → 15 km → 20 km radius) found zero online drivers matching the vehicle class. No notifications were sent.
            </p>
          </div>
        </div>
      ) : snap.offers.length > 0 ? (
        <div>
          <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .4rem" }}>
            Offer Responses
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
            {snap.offers.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".35rem .6rem", background: T.bgModal, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: ".72rem", color: T.textSub }}>Driver #{o.driverId.slice(0, 6).toUpperCase()}</span>
                <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                  {o.distKm != null && <span style={{ fontSize: ".68rem", color: T.textFaint }}>{o.distKm.toFixed(1)} km away</span>}
                  <span style={{ fontSize: ".65rem", fontWeight: 700, padding: ".1rem .45rem", borderRadius: "99px", background: `${statusColor(o.status)}22`, color: statusColor(o.status) }}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Activity Log timeline ──────────────────────────────────────────── */
function RideActivityLog({ ride }: { ride: BackendRide }) {
  const fmtTs = (ts: string) =>
    new Date(ts).toLocaleString("fr-FR", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });

  const events: { ts: string | null; label: string; color: string }[] = [
    { ts: ride.createdAt,       label: "Ride Created",                                            color: "#a855f7" },
    { ts: ride.confirmedAt,     label: "Confirmed — Dispatch Started",                             color: "#a855f7" },
    { ts: ride.enrouteAt,       label: "Driver En Route to Pickup",                               color: "#3b82f6" },
    { ts: ride.arrivedAt,       label: "Driver Arrived at Pickup",                                color: "#3b82f6" },
    { ts: ride.tripStartedAt,   label: "Trip Started",                                            color: "#10b981" },
    { ts: ride.completedAt,     label: "Trip Completed",                                          color: "#10b981" },
    { ts: ride.cancelledAt,     label: ride.cancellationReason ? `Cancelled — ${ride.cancellationReason}` : "Cancelled", color: "#ef4444" },
  ].filter((e) => e.ts != null) as { ts: string; label: string; color: string }[];

  if (events.length === 0) return null;

  return (
    <div style={{ ...cardInner, padding: "1rem 1.25rem" }}>
      <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .75rem" }}>
        Activity Log
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {events.map((ev, i) => (
          <div key={i} style={{ display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, marginTop: ".15rem", boxShadow: `0 0 0 3px ${ev.color}22`, flexShrink: 0 }} />
              {i < events.length - 1 && (
                <div style={{ width: 2, height: 22, background: T.border, borderRadius: 1, marginTop: 2 }} />
              )}
            </div>
            <div style={{ paddingBottom: i < events.length - 1 ? ".35rem" : 0 }}>
              <p style={{ fontSize: ".78rem", fontWeight: 600, color: T.textH, margin: "0 0 .1rem" }}>{ev.label}</p>
              <p style={{ fontSize: ".68rem", color: T.textFaint, margin: 0 }}>{fmtTs(ev.ts)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAST RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function PastRideDetailsModal({
  ride,
  onClose,
}: {
  ride: BackendRide;
  onClose: () => void;
}) {
  const isCompleted = ride.status === "COMPLETED";

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modalBase}>
        {/* Header */}
        <div style={modalHeader}>
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: T.textH,
                margin: 0,
              }}
            >
              Ride Details
            </p>
            <p
              style={{
                fontSize: ".72rem",
                color: T.textSub,
                marginTop: ".25rem",
                marginBottom: 0,
              }}
            >
              RIDE ID:{" "}
              <span style={{ color: T.violet, fontWeight: 700 }}>
                #{ride.id.slice(0, 8).toUpperCase()}
              </span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 15 }} />
          </button>
        </div>

        <div style={modalBody}>
          {/* Status banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
              padding: ".55rem 1rem",
              borderRadius: T.rInner,
              background: isCompleted ? "#d1fae5" : "#fee2e2",
              color: isCompleted ? "#059669" : "#dc2626",
            }}
          >
            {isCompleted ? (
              <CheckCircleRoundedIcon style={{ fontSize: 15 }} />
            ) : (
              <CancelRoundedIcon style={{ fontSize: 15 }} />
            )}
            <span style={{ fontSize: ".78rem", fontWeight: 700 }}>
              {statusLabel(ride.status)}
            </span>
          </div>

          {/* Rider + Driver */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: ".75rem",
            }}
          >
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p
                style={{
                  fontSize: ".68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  color: T.textFaint,
                  margin: "0 0 .3rem",
                }}
              >
                Rider
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: ".88rem",
                  color: T.textH,
                  margin: "0 0 .2rem",
                }}
              >
                {passengerName(ride)}
              </p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon
                  style={{ fontSize: 11, verticalAlign: "middle" }}
                />{" "}
                {ride.passenger?.email ?? "—"}
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p
                style={{
                  fontSize: ".68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  color: T.textFaint,
                  margin: "0 0 .3rem",
                }}
              >
                Driver
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: ".88rem",
                  color: T.textH,
                  margin: "0 0 .2rem",
                }}
              >
                {driverName(ride)}
              </p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <DirectionsCarRoundedIcon
                  style={{ fontSize: 11, verticalAlign: "middle" }}
                />{" "}
                {vehicleLabel(ride)}
              </p>
            </div>
          </div>

          {/* Route */}
          <RouteCard pickup={ride.pickupAddress} drop={ride.dropoffAddress} />

          {/* Stats */}
          <StatsGrid
            stats={[
              {
                label: "Date",
                value: fmtDate(ride.scheduledAt),
                icon: (
                  <CalendarTodayRoundedIcon
                    style={{ fontSize: 14, color: T.textFaint }}
                  />
                ),
              },
              {
                label: "Time",
                value: fmtTime(ride.scheduledAt),
                icon: (
                  <AccessTimeRoundedIcon
                    style={{ fontSize: 14, color: T.textFaint }}
                  />
                ),
              },
              {
                label: "Distance",
                value: `${ride.distanceKmReal ?? ride.distanceKm ?? "—"} km`,
                icon: (
                  <RouteRoundedIcon style={{ fontSize: 14, color: T.violet }} />
                ),
              },
              {
                label: "Duration",
                value: `${ride.durationMinReal ?? ride.durationMin ?? "—"} min`,
                icon: (
                  <AccessTimeRoundedIcon
                    style={{ fontSize: 14, color: T.violet }}
                  />
                ),
              },
            ]}
          />

          {/* Fare */}
          <FareCard
            fare={ride.priceFinal ?? 0}
            fareEstimate={ride.priceEstimate}
          />

          {/* Loyalty Points (completed only) */}
          {isCompleted && ride.loyaltyPointsEarned > 0 && (
            <div
              style={{
                ...cardInner,
                padding: ".75rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: ".78rem", color: T.textSub }}>
                Loyalty Points Earned
              </span>
              <span
                style={{
                  fontSize: ".85rem",
                  fontWeight: 700,
                  color: "#7c3aed",
                }}
              >
                +{ride.loyaltyPointsEarned} pts
              </span>
            </div>
          )}

          {/* Activity Log */}
          <RideActivityLog ride={ride} />

          {/* Dispatch Report (CANCELLED rides only) */}
          {ride.status === "CANCELLED" && <DispatchReport ride={ride} />}
        </div>

        {/* Footer */}
        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>
            Report Issue
          </button>
          <button style={btnPrimary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   DELETE CONFIRM MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function DeleteConfirmModal({
  ride,
  onClose,
  onConfirm,
  deleting,
}: {
  ride: BackendRide;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <style>{`@keyframes prm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div
        style={overlay}
        onClick={(e) => { if (e.target === e.currentTarget && !deleting) onClose(); }}
      >
        <div style={{ ...modalBase, maxWidth: 420 }}>
          {/* Header */}
          <div style={modalHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(239,68,68,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <WarningAmberRoundedIcon style={{ fontSize: 18, color: "#ef4444" }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: ".95rem", color: T.textH, margin: 0 }}>Delete Ride</p>
                <p style={{ fontSize: ".7rem", color: T.textSub, margin: "1px 0 0" }}>This action cannot be undone</p>
              </div>
            </div>
            <button style={btnClose} onClick={onClose} disabled={deleting}>
              <CloseRoundedIcon style={{ fontSize: 15 }} />
            </button>
          </div>

          {/* Body */}
          <div style={{ ...modalBody, gap: ".75rem" }}>
            <p style={{ fontSize: ".85rem", color: T.textSub, margin: 0 }}>
              Are you sure you want to{" "}
              <strong style={{ color: "#ef4444" }}>permanently delete</strong> this
              ride? All associated data will be lost and this cannot be reversed.
            </p>

            {/* Ride summary */}
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .4rem" }}>
                Ride to delete
              </p>
              <p style={{ fontSize: ".82rem", fontWeight: 700, color: T.textH, margin: "0 0 .2rem" }}>
                {passengerName(ride)}
              </p>
              <p style={{ fontSize: ".75rem", color: T.textSub, margin: "0 0 .15rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                <RadioButtonCheckedRoundedIcon style={{ fontSize: 11, color: T.violet }} />
                {ride.pickupAddress}
              </p>
              <p style={{ fontSize: ".75rem", color: T.textSub, margin: "0 0 .2rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                <FmdGoodRoundedIcon style={{ fontSize: 11, color: T.violet }} />
                {ride.dropoffAddress}
              </p>
              <p style={{ fontSize: ".7rem", color: T.textFaint, margin: 0 }}>
                {fmtDate(ride.scheduledAt)} at {fmtTime(ride.scheduledAt)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ ...modalFooter, justifyContent: "space-between" }}>
            <button style={btnGhost} onClick={onClose} disabled={deleting}>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              style={{
                ...btnPrimary,
                background: deleting ? "rgba(239,68,68,.35)" : "#ef4444",
                boxShadow: deleting ? "none" : "0 4px 16px rgba(239,68,68,.2)",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.6 : 1,
              }}
            >
              {deleting ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "prm-spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3" />
                    <path d="M21 12a9 9 0 01-9 9" />
                  </svg>
                  Deleting…
                </>
              ) : (
                <>
                  <DeleteForeverRoundedIcon style={{ fontSize: 15 }} />
                  Delete Permanently
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
