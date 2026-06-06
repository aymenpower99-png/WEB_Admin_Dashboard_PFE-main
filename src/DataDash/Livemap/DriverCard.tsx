import { Star, Navigation } from "lucide-react";
import { C } from "../tokens";
import type { Driver } from "./types";
import { getStatusCfg } from "./constants";

export function DriverCard({
  driver,
  selected,
  onClick,
  dark,
}: {
  driver: Driver;
  selected: boolean;
  onClick: () => void;
  dark: boolean;
}) {
  const cfg = getStatusCfg(driver.status);
  return (
    <div
      onClick={onClick}
      className="rounded-xl border p-3 cursor-pointer transition-all"
      style={{
        background: selected
          ? dark
            ? "rgba(168,85,247,.12)"
            : "rgba(168,85,247,.08)"
          : dark
            ? C.darkSurface
            : C.lightSurface,
        borderColor: selected
          ? C.primaryPurple
          : dark
            ? C.darkBorder
            : C.lightBorder,
        marginBottom: 8,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 relative"
          style={{
            background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
          }}
        >
          {driver.avatar}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{
              background: cfg.color,
              borderColor: dark ? C.darkSurface : C.lightSurface,
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: dark ? C.darkText : C.lightText,
              }}
            >
              {driver.name}
            </span>
            <Star size={10} color={C.warning} fill={C.warning} />
            <span style={{ fontSize: 10, color: C.warning, fontWeight: 600 }}>
              {driver.rating}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                background: `${cfg.color}22`,
                color: cfg.color,
                fontSize: 10,
              }}
            >
              {cfg.label}
            </span>
            {driver.speed > 0 && (
              <span
                style={{
                  fontSize: 10,
                  color: dark ? C.gray7B : C.lightSubtext,
                }}
              >
                {driver.speed} km/h
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color:
                driver.battery < 30
                  ? C.error
                  : dark
                    ? C.gray7B
                    : C.lightSubtext,
            }}
          >
            {driver.battery}%
          </span>
          <div
            style={{
              width: 32,
              height: 4,
              borderRadius: 2,
              background: dark ? C.darkBorder : C.grayE6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${driver.battery}%`,
                height: "100%",
                borderRadius: 2,
                background:
                  driver.battery < 30
                    ? C.error
                    : driver.battery < 60
                      ? C.warning
                      : C.success,
              }}
            />
          </div>
        </div>
      </div>
      {driver.destination && (
        <div
          className="flex items-center gap-1.5 mt-2 pt-2"
          style={{
            borderTop: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
          }}
        >
          <Navigation size={10} color={C.primaryPurple} />
          <span
            style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }}
            className="truncate"
          >
            → {driver.destination}
          </span>
          {driver.eta && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.primaryPurple,
                marginLeft: "auto",
                flexShrink: 0,
              }}
            >
              ETA {driver.eta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
