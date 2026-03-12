import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";

/* ─── Types ─────────────────────────────────────────────────────────────── */
export type PayStatus = "Paid" | "Pending";

export interface TripPayment {
  id: string;
  rider: string;
  riderSeed: string;
  pickup: string;
  drop: string;
  amount: string;
  amountNum: number;
  method: "Card";
  status: PayStatus;
  date: "today" | "week" | "month";
  distance: string;
  duration: string;
  time: string;
}

/* ─── Diamond icon (same for pickup & dropoff) ──────────────────────────── */
function CircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6" fill="#7c3aed" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 0.5L13.5 7L7 13.5L0.5 7Z" fill="#7c3aed" />
    </svg>
  );
}

/* ─── View Trip Modal ───────────────────────────────────────────────────── */
export default function ViewTripModal({
  trip,
  onClose,
}: {
  trip: TripPayment;
  onClose: () => void;
}) {
  const isPaid = trip.status === "Paid";

  const statusConfig = isPaid
    ? {
        iconBg: "#dcfce7",
        label: "PAYMENT SUCCESSFUL",
        labelColor: "#16a34a",
        icon: <CheckCircleRoundedIcon style={{ fontSize: 30, color: "#16a34a" }} />,
      }
    : {
        iconBg: "#fef3c7",
        label: "PAYMENT PENDING",
        labelColor: "#d97706",
        icon: <HourglassTopRoundedIcon style={{ fontSize: 30, color: "#d97706" }} />,
      };

  const dateLabel =
    trip.date === "today"
      ? "Today, Mar 12 2026"
      : trip.date === "week"
      ? "Mar 10 2026"
      : "Mar 01 2026";

  /* derive drop-off time (+28 min) */
  const [hStr, mStr] = trip.time.split(":");
  const totalMin = parseInt(hStr) * 60 + parseInt(mStr) + 28;
  const dropH = String(Math.floor(totalMin / 60) % 24).padStart(2, "0");
  const dropM = String(totalMin % 60).padStart(2, "0");
  const pickupTime = `${trip.time} AM, ${dateLabel}`;
  const dropTime   = `${dropH}:${dropM} AM, ${dateLabel}`;

  return (
    <div
      className="ts-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ts-modal"
        style={{ maxWidth: 420, width: "100%", borderRadius: "1.25rem", overflow: "hidden" }}
      >
        {/* ── Header ── */}
        <div className="ts-modal-header" style={{ padding: "1rem 1.25rem" }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--text-h)", margin: 0 }}>
              Trip Receipt
            </p>
            <p style={{ fontSize: ".7rem", color: "var(--text-muted)", margin: ".15rem 0 0" }}>
              Transaction ID:&nbsp;{trip.id}-99X
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="ts-modal-body" style={{ padding: "0 1.25rem 1.25rem", gap: "1.1rem" }}>

          {/* Status hero */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", padding: ".75rem 0 .5rem" }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: statusConfig.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {statusConfig.icon}
            </div>
            <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-h)", letterSpacing: "-.03em", lineHeight: 1 }}>
              {trip.amount}
            </span>
            <span style={{ fontSize: ".65rem", fontWeight: 800, letterSpacing: ".12em", color: statusConfig.labelColor }}>
              {statusConfig.label}
            </span>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)" }} />

          {/* ── Rider card — no avatar, just label + name ── */}
          <div
            style={{
              background: "var(--bg-inner, #f8f8fb)",
              border: "1px solid var(--border)",
              borderRadius: ".875rem",
              padding: ".875rem 1rem",
              boxShadow: "0 2px 12px 0 rgba(124,58,237,0.07), 0 1px 3px 0 rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ fontSize: ".6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#7c3aed", margin: "0 0 .25rem" }}>
              Rider
            </p>
            <p style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--text-h)", margin: 0, lineHeight: 1.2 }}>
              {trip.rider}
            </p>
          </div>

          {/* ── Route — both icons diamond, purple ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Pickup */}
            <div style={{ display: "flex", gap: ".85rem", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: ".2rem" }}>
                <CircleIcon />
                <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom,#7c3aed,#a78bfa55)", margin: ".15rem 0" }} />
              </div>
              <div style={{ paddingBottom: ".75rem" }}>
                <p style={{ fontSize: ".62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "var(--text-faint)", margin: "0 0 .2rem" }}>
                  Pickup
                </p>
                <p style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--text-h)", margin: "0 0 .15rem" }}>
                  {trip.pickup}
                </p>
                <p style={{ fontSize: ".7rem", color: "var(--text-muted)", margin: 0 }}>
                  {pickupTime}
                </p>
              </div>
            </div>

            {/* Drop-off */}
            <div style={{ display: "flex", gap: ".85rem", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: ".2rem" }}>
                <DiamondIcon />
              </div>
              <div>
                <p style={{ fontSize: ".62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "var(--text-faint)", margin: "0 0 .2rem" }}>
                  Drop-off
                </p>
                <p style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--text-h)", margin: "0 0 .15rem" }}>
                  {trip.drop}
                </p>
                <p style={{ fontSize: ".7rem", color: "var(--text-muted)", margin: 0 }}>
                  {dropTime}
                </p>
              </div>
            </div>
          </div>

          {/* Duration / Distance */}
          <div
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              border: "1px solid var(--border)", borderRadius: ".75rem", overflow: "hidden",
            }}
          >
            {[
              { icon: <RouteRoundedIcon style={{ fontSize: 14, color: "#7c3aed" }} />, label: "DURATION", value: trip.duration },
              { icon: <RouteRoundedIcon style={{ fontSize: 14, color: "#7c3aed" }} />, label: "DISTANCE", value: trip.distance },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: ".75rem 1rem", borderRight: i === 0 ? "1px solid var(--border)" : "none", textAlign: "center" }}>
                <p style={{ fontSize: ".6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-faint)", margin: "0 0 .3rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".3rem" }}>
                  {s.icon} {s.label}
                </p>
                <p style={{ fontSize: ".92rem", fontWeight: 700, color: "var(--text-h)", margin: 0 }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: ".75rem",
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {/* Print — ghost outline */}
          <button
            className="ts-btn-ghost"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem", padding: ".65rem 1rem", borderRadius: "2rem" }}
            onClick={() => window.print()}
          >
            <PrintRoundedIcon style={{ fontSize: 15 }} />
            Print Receipt
          </button>

          {/* Close — solid purple pill */}
          <button
            onClick={onClose}
            style={{
              padding: ".65rem 1rem",
              borderRadius: "2rem",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              color: "#fff",
              fontSize: ".82rem",
              fontWeight: 700,
              letterSpacing: ".01em",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
              transition: "opacity .15s",
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = ".88")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}