import type React from "react";

/* ─── Table layout ──────────────────────────────────────────────────────── */
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

/* ─── Status config ─────────────────────────────────────────────────────── */
export const STATUS_CFG = {
  PAID: { label: "Paid", bg: "#d1fae5", fg: "#065f46" },
  PENDING: { label: "Pending", bg: "#ede9fe", fg: "#7c3aed" },
  REFUNDED: { label: "Refunded", bg: "#e0f2fe", fg: "#0369a1" },
  FAILED: { label: "Failed", bg: "#fee2e2", fg: "#dc2626" },
  SUCCESS: { label: "Success", bg: "#d1fae5", fg: "#065f46" },
} as const;

export type PaymentStatusKey = keyof typeof STATUS_CFG;

/* ─── Filter tabs ───────────────────────────────────────────────────────── */
export const FILTER_TABS = ["All", "PENDING", "PAID", "REFUNDED"] as const;
export type FilterTab = (typeof FILTER_TABS)[number];
