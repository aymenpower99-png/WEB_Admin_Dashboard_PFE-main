import type React from "react";

/* ─── Table layout ──────────────────────────────────────────────────────── */
export const ROWS  = 5;
export const ROW_H = 88;

export const TH: React.CSSProperties = {
  padding:       "0.75rem 1.25rem",
  fontSize:      ".78rem",
  fontWeight:    800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color:         "var(--text-body)",
  textAlign:     "left",
  borderBottom:  "1px solid var(--border)",
  whiteSpace:    "nowrap",
  background:    "var(--bg-thead)",
};

export const TD: React.CSSProperties = {
  padding:       "0 1.25rem",
  height:        ROW_H,
  fontSize:      ".85rem",
  fontWeight:    600,
  color:         "var(--text-body)",
  borderBottom:  "1px solid var(--border)",
  verticalAlign: "middle",
};

/* ─── Month helpers ─────────────────────────────────────────────────────── */
export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthOptions(): { value: string; label: string }[] {
  const opts: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    opts.push({ value, label });
  }
  return opts;
}
