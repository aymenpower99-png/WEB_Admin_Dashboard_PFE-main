// ─── Color tokens ─────────────────────────────────────────────────────────────

export const C = {
  primaryPurple: "#A855F7",
  secondaryPurple: "#7C3AED",
  darkBg: "#0B0B0F",
  darkSurface: "#1A1A22",
  darkBorder: "#222228",
  darkText: "#FFFFFF",
  lightBg: "#F4F4F8",
  lightSurface: "#FFFFFF",
  lightBorder: "#E5E7EB",
  lightText: "#121214",
  lightSubtext: "#6B7280",
  iconBgDark: "#2A1A3E",
  iconBgLight: "#F3E8FF",
  gray7B: "#7B7B85",
  grayE6: "#E6E6EA",
  success: "#4CAF50",
  error: "#FF3B30",
  warning: "#FF9500",
} as const;

// ─── Helper functions ──────────────────────────────────────────────────────────

export function getBatteryColor(pct: number): string {
  if (pct >= 60) return C.success;
  if (pct >= 30) return C.warning;
  return C.error;
}

export function getStatusStyle(status: string): { bg: string; text: string } {
  switch (status) {
    case "ACTIVE":      return { bg: "rgba(76,175,80,.12)",   text: C.success };
    case "EN ROUTE":    return { bg: "rgba(168,85,247,.12)",  text: C.primaryPurple };
    case "MAINTENANCE": return { bg: "rgba(255,149,0,.12)",   text: C.warning };
    default:            return { bg: "rgba(123,123,133,.12)", text: C.gray7B };
  }
}
