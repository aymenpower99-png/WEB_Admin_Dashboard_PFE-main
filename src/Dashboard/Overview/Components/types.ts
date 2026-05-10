export type DashboardStatus =
  | "active" | "pending" | "blocked"
  | "Open" | "In Progress" | "Pending" | "Resolved";

export interface DashboardData {
  kpis: {
    activeTrips: number;
    todayTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    revenue: number;
    newUsers: number;
    totalDrivers: number;
    totalTickets: number;
  };
  revenueTrend: { day: string; revenue: number; rides: number }[];
  recentUsers: DashboardUser[];
  recentTickets: DashboardTicket[];
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: DashboardStatus;
  trips: number | null;
}

export interface DashboardTicket {
  id: string;
  user: string;
  issue: string;
  status: DashboardStatus;
}

export const STATUS_PILL: Record<string, string> = {
  active:      "ts-pill ts-pill-active",
  pending:     "ts-pill ts-pill-pending",
  blocked:     "ts-pill ts-pill-blocked",
  // Backend raw statuses (fallback)
  open:        "ts-pill ts-pill-pending",
  in_progress: "ts-pill ts-role-driver",
  resolved:    "ts-pill ts-pill-active",
  // Ticket display labels (matching Help Centre)
  "Open":        "ts-pill ts-pill-pending",
  "In Progress": "ts-pill ts-role-driver",
  "Pending":     "ts-pill ts-pill-pending",
  "Resolved":    "ts-pill ts-pill-active",
};

export const ROLE_PILL: Record<string, string> = {
  passenger:   "ts-pill ts-role-rider",
  driver:      "ts-pill ts-role-driver",
  admin:       "ts-pill ts-role-admin",
  super_admin: "ts-pill ts-role-admin",
};

export const ROLE_LABEL: Record<string, string> = {
  passenger:   "Rider",
  driver:      "Driver",
  admin:       "Admin",
  super_admin: "Super Admin",
};
