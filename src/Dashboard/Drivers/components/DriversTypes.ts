import type React from "react";

export const ROWS = 10;
export const ROW_H = 54;

export const TH: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
  background: "var(--bg-thead)", // <-- grey header like dashboard
};

export const TD: React.CSSProperties = {
  padding: "0 1.25rem",
  height: ROW_H,
  fontSize: ".85rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

export const STATUS_CFG = {
  online:  { label: "Online",  bg: "#d1fae5", fg: "#065f46" },
  busy:    { label: "Busy",    bg: "#fef3c7", fg: "#92400e" },
  offline: { label: "Offline", bg: "var(--refunded-bg)", fg: "var(--refunded-fg)" },
} as const;