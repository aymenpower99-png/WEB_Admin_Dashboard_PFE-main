import type { UserStatus } from "../../constants";
import type { UserRole } from "../../../api/users";

export type { UserStatus, UserRole };
export type FilterTab = "All" | "Riders" | "Drivers";

export const ROWS_PER_PAGE = 5;
export const ROW_H = 88;

export const ROLE_MAP: Record<FilterTab, UserRole | null> = {
  All: null,
  Riders: "passenger",
  Drivers: "driver",
};

export const STATUS_PILL: Record<UserStatus, string> = {
  active: "ts-pill ts-pill-active",
  pending: "ts-pill ts-pill-pending",
  blocked: "ts-pill ts-pill-blocked",
};

export const ROLE_BADGE: Record<UserRole, React.CSSProperties> = {
  passenger: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  driver: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    background: "#fce7f3",
    color: "#be185d",
  },
  admin: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    background: "#ede9fe",
    color: "#6d28d9",
  },
  super_admin: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    background: "#fef9c3",
    color: "#92400e",
  },
};

export const ROLE_LABEL: Record<UserRole, string> = {
  passenger: "Rider",
  driver: "Driver",
  admin: "Admin",
  super_admin: "Super Admin",
};

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
  background: "var(--bg-thead)", // ✅ grey header
};

export const TD: React.CSSProperties = {
  padding: "0 1rem",
  height: ROW_H,
  fontSize: ".875rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};