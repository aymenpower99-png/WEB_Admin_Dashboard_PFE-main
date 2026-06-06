import { Star, Navigation, Phone, MessageSquare, Truck, X } from "lucide-react";
import { C } from "../tokens";
import type { Driver } from "./types";
import { getStatusCfg } from "./constants";

export function DriverDetailPanel({
  driver,
  dark,
  onClose,
}: {
  driver: Driver;
  dark: boolean;
  onClose: () => void;
}) {
  const cfg = getStatusCfg(driver.status);
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: C.primaryPurple,
        boxShadow: `0 0 24px rgba(168,85,247,.2)`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
            }}
          >
            {driver.avatar}
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: dark ? C.darkText : C.lightText,
              }}
            >
              {driver.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={11} color={C.warning} fill={C.warning} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.warning }}>
                {driver.rating}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: dark ? C.gray7B : C.lightSubtext,
                }}
              >
                · {driver.trips.toLocaleString()} trips
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            color: dark ? C.gray7B : C.lightSubtext,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
        style={{
          background: `${cfg.color}15`,
          border: `1px solid ${cfg.color}40`,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: cfg.color,
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>
          {cfg.label}
        </span>
        {driver.speed > 0 && (
          <span
            style={{
              fontSize: 11,
              color: dark ? C.gray7B : C.lightSubtext,
              marginLeft: "auto",
            }}
          >
            {driver.speed} km/h
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {[
          {
            label: "Battery",
            value: `${driver.battery}%`,
            color: driver.battery < 30 ? C.error : C.success,
          },
          {
            label: "Speed",
            value: driver.speed > 0 ? `${driver.speed} km/h` : "Stationary",
            color: C.primaryPurple,
          },
          { label: "ETA", value: driver.eta ?? "—", color: C.warning },
          {
            label: "ID",
            value: driver.id,
            color: dark ? C.gray7B : C.lightSubtext,
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg p-2.5"
            style={{
              background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: dark ? C.gray7B : C.lightSubtext,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 3,
              }}
            >
              {label}
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {driver.destination && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
          style={{
            background: dark ? "rgba(168,85,247,.08)" : "rgba(168,85,247,.05)",
          }}
        >
          <Navigation size={12} color={C.primaryPurple} />
          <div>
            <p
              style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }}
            >
              Destination
            </p>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: dark ? C.darkText : C.lightText,
              }}
            >
              {driver.destination}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {[
          { icon: Phone, label: "Call" },
          { icon: MessageSquare, label: "Message" },
          { icon: Truck, label: "Reassign" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex-1 flex flex-col items-center gap-1 rounded-lg py-2.5 border text-xs font-medium"
            style={{
              background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
              borderColor: dark ? C.darkBorder : C.lightBorder,
              color: dark ? C.gray7B : C.lightSubtext,
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
