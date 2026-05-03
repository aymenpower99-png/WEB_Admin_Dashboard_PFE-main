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
  active:   { label: "Active",   bg: "rgba(16,185,129,0.12)",  fg: "#10b981",           border: "rgba(16,185,129,0.4)"   },
  inactive: { label: "Inactive", bg: "rgba(107,114,128,0.12)", fg: "var(--text-muted)", border: "rgba(107,114,128,0.35)" },
} as const;

export type MembershipStatusKey = keyof typeof STATUS_CFG;
