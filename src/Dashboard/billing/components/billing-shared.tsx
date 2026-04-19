import React from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

/* ─── Table constants ──────────────────────────────────────────────────────── */
export const ROWS = 5;
export const ROW_H = 72;

export const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
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
  padding: "0 1.1rem",
  height: ROW_H,
  fontSize: ".85rem",
  fontWeight: 600,
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
  lineHeight: 1.6,
};

/* ─── Status maps ──────────────────────────────────────────────────────────── */
export const PAYMENT_STATUS_STYLE: Record<string, string> = {
  PAID:     "ts-pill ts-pill-completed",
  PENDING:  "ts-pill ts-pill-pending",
  FAILED:   "ts-pill ts-pill-failed",
  REFUNDED: "ts-pill ts-pill-failed",
  SUCCESS:  "ts-pill ts-pill-completed",
};

export const PAYMENT_STATUS_ICON: Record<string, React.ReactNode> = {
  PAID:     <CheckCircleRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
  PENDING:  <HourglassTopRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
  FAILED:   <CancelRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
  REFUNDED: <CancelRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
  SUCCESS:  <CheckCircleRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PAID:        "Paid",
  PENDING:     "Pending",
  FAILED:      "Failed",
  REFUNDED:    "Refunded",
  SUCCESS:     "Success",
  RIDE_PAYMENT: "Ride",
  REFUND:      "Refund",
  ADJUSTMENT:  "Adjustment",
};

/* ─── Pagination ───────────────────────────────────────────────────────────── */
export function Pagination({
  page, totalPages, onPrev, onNext, setPage,
}: {
  page: number; totalPages: number;
  onPrev: () => void; onNext: () => void;
  setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    background: active
      ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))"
      : disabled ? "transparent" : "var(--bg-card)",
    color: active ? "#fff" : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 500 }}>Page {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btn(false, page === 1)}>
          <ChevronLeftRoundedIcon style={{ fontSize: 14 }} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => setPage(n)} style={btn(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btn(false, page === totalPages)}>
          <ChevronRightRoundedIcon style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}

/* ─── Filter Pill ──────────────────────────────────────────────────────────── */
export function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "0.3rem 0.875rem", fontSize: "0.7rem", fontWeight: 600,
      border: active ? "none" : "1px solid var(--border)", borderRadius: "2rem", cursor: "pointer",
      background: active ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))" : "var(--bg-inner)",
      color: active ? "#fff" : "var(--text-muted)", transition: "all 0.15s ease", whiteSpace: "nowrap" as const,
    }}>{label}</button>
  );
}

/* ─── Chart Tooltip ────────────────────────────────────────────────────────── */
export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.5rem 0.85rem", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
      <p style={{ fontSize: ".75rem", color: "var(--text-faint)", marginBottom: ".2rem", fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ fontSize: ".82rem", fontWeight: 700, color: p.color || "var(--text-h)" }}>
          {p.value?.toLocaleString()} TND
        </p>
      ))}
    </div>
  );
}
