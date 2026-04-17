import type React from "react";

export const ROWS = 5;
export const ROW_H = 88;

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
  background: "var(--bg-thead)",
};

export const TD: React.CSSProperties = {
  padding: "0 1.25rem",
  height: ROW_H,
  fontSize: ".85rem",
  fontWeight: 600,
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

export const STATUS_CFG = {
  pending:       { label: "Pending",       bg: "#ede9fe", fg: "#7c3aed" },
  setup_required:{ label: "Setup Required",bg: "#fff7ed", fg: "#c2410c" },
  online:        { label: "Online",        bg: "#d1fae5", fg: "#065f46" },
  offline:       { label: "Offline",       bg: "#f3f4f6", fg: "#6b7280" },
} as const;

export type DriverStatusKey = keyof typeof STATUS_CFG;