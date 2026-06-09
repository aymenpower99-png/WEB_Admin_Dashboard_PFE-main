import type { MapEvent } from "./types";
import { C } from "../tokens";

export const DEFAULT_CENTER: [number, number] = [10.18, 36.82];

export const MAP_EVENTS: MapEvent[] = [];

export const EVENT_COLORS = {
  surge: { fill: "rgba(255,149,0,.25)", stroke: "#FF9500" },
  hotspot: { fill: "rgba(168,85,247,.2)", stroke: "#A855F7" },
  incident: { fill: "rgba(255,59,48,.2)", stroke: "#FF3B30" },
};

export const STATUS_CONFIG = {
  ACTIVE: { color: C.success, label: "Online", pulse: true },
  "EN ROUTE": { color: C.primaryPurple, label: "En Route", pulse: true },
  IDLE: { color: C.warning, label: "Idle", pulse: false },
  OFFLINE: { color: C.gray7B, label: "Offline", pulse: false },
};

export function getStatusCfg(s: string) {
  return (
    STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.OFFLINE
  );
}
