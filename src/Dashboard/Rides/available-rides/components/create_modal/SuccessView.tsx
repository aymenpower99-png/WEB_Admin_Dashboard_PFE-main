import { T } from "./constants";
import { DispatchReportInline } from "./DispatchReportInline";
import type { BackendRide } from "../../../../../api/rides";

interface SuccessViewProps {
  createdRide: BackendRide;
  logs: { time: string; msg: string; kind: "ok" | "error" }[];
  pollStatus: "polling" | "scheduled" | "cancelled" | "searching" | "assigned" | null;
}

export function SuccessView({ createdRide, logs, pollStatus }: SuccessViewProps) {
  return (
    <>
      {/* Success banner */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".5rem",
          padding: "1rem",
          background: "rgba(16,185,129,.08)",
          borderRadius: T.rSm,
          border: "1px solid rgba(16,185,129,.2)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(16,185,129,.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p
          style={{
            fontWeight: 700,
            fontSize: ".92rem",
            color: "#10b981",
            margin: 0,
          }}
        >
          Ride Created Successfully
        </p>
        <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
          ID #{createdRide.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Route summary */}
      <div
        style={{
          background: T.bgInner,
          borderRadius: T.rSm,
          border: `1px solid ${T.border}`,
          padding: ".875rem 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
            marginBottom: ".35rem",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.accent,
            }}
          />
          <span style={{ fontSize: ".78rem", color: T.textSub }}>
            {createdRide.pickupAddress}
          </span>
        </div>
        <div
          style={{
            width: 2,
            height: 14,
            background: T.border,
            marginLeft: "3px",
            borderRadius: 1,
            marginBottom: ".35rem",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "2px",
              background: T.accent,
            }}
          />
          <span style={{ fontSize: ".78rem", color: T.textSub }}>
            {createdRide.dropoffAddress}
          </span>
        </div>
      </div>

      {/* Activity log */}
      <div
        style={{
          background: T.bgInner,
          borderRadius: T.rSm,
          border: `1px solid ${T.border}`,
          padding: ".875rem 1rem",
        }}
      >
        <p
          style={{
            fontSize: ".65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            color: T.textFaint,
            margin: "0 0 .65rem",
          }}
        >
          System Activity
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: ".65rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: log.kind === "ok" ? "#10b981" : T.red,
                    marginTop: ".2rem",
                    boxShadow: `0 0 0 2px ${log.kind === "ok" ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"}`,
                  }}
                />
                {i < logs.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 18,
                      background: T.border,
                      marginTop: 2,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  paddingBottom: i < logs.length - 1 ? ".3rem" : 0,
                }}
              >
                <p
                  style={{
                    fontSize: ".76rem",
                    fontWeight: 600,
                    color: T.textH,
                    margin: "0 0 .05rem",
                  }}
                >
                  {log.msg}
                </p>
                <p
                  style={{
                    fontSize: ".66rem",
                    color: T.textFaint,
                    margin: 0,
                  }}
                >
                  {log.time}
                </p>
              </div>
            </div>
          ))}
          {/* Polling indicator (immediate rides only) */}
          {pollStatus === "polling" && (
            <div
              style={{
                display: "flex",
                gap: ".65rem",
                alignItems: "flex-start",
                marginTop: logs.length ? ".1rem" : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: T.accent,
                    marginTop: ".2rem",
                    animation: "cm-pulse 1.2s ease-in-out infinite",
                    boxShadow: `0 0 0 2px ${T.accentGlow}`,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: ".76rem",
                  color: T.textSub,
                  margin: ".1rem 0 0",
                }}
              >
                Monitoring dispatch status…
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch report if ride was cancelled */}
      {pollStatus === "cancelled" && createdRide?.dispatchSnapshot && (
        <DispatchReportInline ride={createdRide} />
      )}

      {/* Scheduled future ride info panel */}
      {pollStatus === "scheduled" && createdRide && (
        <div
          style={{
            background: "rgba(20,184,166,0.08)",
            borderRadius: T.rSm,
            border: "1px solid rgba(20,184,166,0.25)",
            padding: ".875rem 1rem",
            display: "flex",
            alignItems: "flex-start",
            gap: ".75rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              flexShrink: 0,
              background: "rgba(20,184,166,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 .2rem",
                fontWeight: 700,
                fontSize: ".82rem",
                color: "#0d9488",
              }}
            >
              Ride Scheduled
            </p>
            <p
              style={{
                margin: "0 0 .15rem",
                fontSize: ".74rem",
                color: T.textSub,
              }}
            >
              {new Date(createdRide.scheduledAt).toLocaleString("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: ".7rem",
                color: T.textFaint,
              }}
            >
              Driver search will start automatically 30 min before the ride.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
