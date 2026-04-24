import { T } from "./constants";
import type { BackendRide } from "../../../../../api/rides";

// ─── Dispatch Report (inline for CreateRideModal) ────────────────────────────
export function DispatchReportInline({ ride }: { ride: BackendRide }) {
  const snap = ride.dispatchSnapshot;
  if (!snap) return null;
  const statusColor = (s: string) =>
    s === "ACCEPTED" ? "#10b981" : s === "REJECTED" ? "#ef4444" : "#f59e0b";
  const noDrivers = snap.totalOffers === 0;
  return (
    <div
      style={{
        background: "rgba(239,68,68,.06)",
        borderRadius: T.rSm,
        border: "1px solid rgba(239,68,68,.25)",
        padding: ".875rem 1rem",
      }}
    >
      <p
        style={{
          fontSize: ".65rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          color: "#ef4444",
          margin: "0 0 .55rem",
        }}
      >
        Dispatch Report
      </p>
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          flexWrap: "wrap",
          marginBottom: ".6rem",
        }}
      >
        {[
          { label: "Attempts", value: `${snap.attempts} / 3` },
          { label: "Offers", value: `${snap.totalOffers}` },
          {
            label: "Result",
            value: snap.result === "ASSIGNED" ? "Assigned" : "No Driver",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: "1 1 60px",
              background: T.bgInner,
              borderRadius: "8px",
              border: `1px solid ${T.border}`,
              padding: ".4rem .5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: ".58rem",
                color: T.textFaint,
                margin: "0 0 .1rem",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: ".78rem",
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
      {noDrivers ? (
        <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
          🚫 No eligible drivers were online in the service area. All 3 attempts
          (10→15→20 km) returned 0 candidates.
        </p>
      ) : snap.offers.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
          {snap.offers.map((o, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: ".3rem .6rem",
                background: T.bgInner,
                borderRadius: "6px",
                border: `1px solid ${T.border}`,
              }}
            >
              <span style={{ fontSize: ".7rem", color: T.textSub }}>
                Driver #{o.driverId.slice(0, 6).toUpperCase()}
              </span>
              <div
                style={{ display: "flex", gap: ".35rem", alignItems: "center" }}
              >
                {o.distKm != null && (
                  <span style={{ fontSize: ".66rem", color: T.textFaint }}>
                    {o.distKm.toFixed(1)} km
                  </span>
                )}
                <span
                  style={{
                    fontSize: ".62rem",
                    fontWeight: 700,
                    padding: ".08rem .4rem",
                    borderRadius: "99px",
                    background: `${statusColor(o.status)}22`,
                    color: statusColor(o.status),
                  }}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
