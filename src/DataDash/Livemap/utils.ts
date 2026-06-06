import type { Driver, DriverLocation } from "./types";
import { getStatusCfg } from "./constants";

// Inject pulse animation CSS once
const PULSE_CSS = `
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .5; }
    100% { transform: scale(1.7); opacity: 0;  }
  }
`;
if (!document.getElementById("mapbox-pulse-style")) {
  const s = document.createElement("style");
  s.id = "mapbox-pulse-style";
  s.textContent = PULSE_CSS;
  document.head.appendChild(s);
}

export function toRealCoords(lat: number, lng: number): [number, number] {
  return [lng, lat];
}

export function convertToDriver(loc: DriverLocation): Driver {
  const status = loc.is_online
    ? loc.speed_kmh > 0
      ? "EN ROUTE"
      : "ACTIVE"
    : "OFFLINE";

  return {
    id: loc.driver_id,
    name: loc.name,
    avatar: loc.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    status,
    lat: loc.latitude,
    lng: loc.longitude,
    speed: loc.speed_kmh,
    battery: 80,
    rating: loc.rating,
    trips: loc.total_trips,
    bearing: loc.heading,
    last_seen_at: loc.last_seen_at,
  };
}

export function makeMarkerEl(
  driver: Driver,
  selected: boolean,
): HTMLDivElement {
  const cfg = getStatusCfg(driver.status);
  const size = selected ? 40 : 32;
  const el = document.createElement("div");
  el.style.cssText = `
    width: ${size}px; height: ${size}px;
    border-radius: 50%;
    background: ${cfg.color};
    border: ${selected ? `3px solid #fff` : `2px solid ${cfg.color}`};
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: ${selected ? 11 : 9}px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 0 ${selected ? 20 : 10}px ${cfg.color}88;
    transition: all .2s ease;
    position: relative;
  `;
  el.textContent = driver.avatar;

  if (cfg.pulse && driver.status !== "OFFLINE") {
    const ring = document.createElement("div");
    ring.style.cssText = `
      position: absolute; inset: -6px;
      border-radius: 50%;
      border: 1.5px solid ${cfg.color};
      opacity: .5;
      animation: pulse-ring 1.8s ease-out infinite;
    `;
    el.appendChild(ring);
  }
  return el;
}
