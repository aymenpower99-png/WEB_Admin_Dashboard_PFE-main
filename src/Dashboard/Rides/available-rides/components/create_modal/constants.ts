// ─── Design tokens (dark-mode safe via CSS vars) ────────────────────────────
export const T = {
  bg: "var(--bg-card)",
  surface: "var(--bg-inner)",
  surfaceHover: "var(--bg-thead)",
  border: "var(--border)",
  borderFocus: "rgba(168,85,247,0.4)",
  accent: "#a855f7",
  accentGlow: "rgba(168,85,247,0.18)",
  accentLight: "rgba(168,85,247,0.08)",
  textH: "var(--text-h)",
  textSub: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  red: "#ef4444",
  redBg: "rgba(239,68,68,0.06)",
  r: "16px",
  rSm: "10px",
  rInner: "8px",
  violet: "#a855f7",
  violetLight: "rgba(168,85,247,0.08)",
  bgInner: "var(--bg-inner)",
};

// ─── Shared styles ──────────────────────────────────────────────────────────────
export const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(17,24,39,0.45)",
  backdropFilter: "blur(8px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "1rem",
};

export const labelStyle: React.CSSProperties = {
  fontSize: ".65rem", fontWeight: 700,
  letterSpacing: ".1em", textTransform: "uppercase",
  color: T.textFaint, marginBottom: ".35rem", display: "block",
};

export const inputBase: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: ".6rem .85rem",
  background: T.bg,
  border: `1.5px solid ${T.border}`,
  borderRadius: T.rSm,
  fontSize: ".83rem", color: T.textH,
  outline: "none",
  transition: "border-color .2s, box-shadow .2s",
  fontFamily: "inherit",
};
