import apiClient from "./apiClient";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OverviewKPIs {
  activeTrips: number;
  todayTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  revenue: number;
  newUsers: number;
  totalDrivers: number;
  totalTickets: number;
}

export interface RevenueEntry {
  day: string;
  revenue: number;
  rides: number;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  trips?: number;
  createdAt: string;
}

export interface RecentTicket {
  id: string;
  user: string;
  issue: string;
  status: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfYesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function mapTicketStatus(raw: string): string {
  switch (raw) {
    case "open":             return "Open";
    case "in_progress":      return "In Progress";
    case "waiting_for_user": return "Pending";
    case "resolved":         return "Resolved";
    default:                 return raw;
  }
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** Build overview KPIs from existing endpoints */
  getOverview: async (): Promise<OverviewKPIs> => {
    const [ridesRes, revenueRes, driversRes, ticketsRes, usersRes] = await Promise.all([
      apiClient.get("/rides"),
      apiClient.get("/billing/revenue/stats").catch(() => ({ data: null })),
      apiClient.get("/drivers"),
      apiClient.get("/admin/support/tickets", { params: { page: 1, limit: 1 } }).catch(() => ({ data: { data: [], total: 0 } })),
      apiClient.get("/admin/users").catch(() => ({ data: { data: [] } })),
    ]);

    const rides: any[] = ridesRes.data ?? [];
    const today = startOfToday().getTime();
    const yesterday = startOfYesterday().getTime();

    let activeTrips = 0;
    let completedTrips = 0;
    let cancelledTrips = 0;
    let todayTrips = 0;

    for (const r of rides) {
      const status = r.status?.toLowerCase?.() ?? "";
      if (status === "in_trip" || status === "searching_driver" || status === "driver_assigned") activeTrips++;
      if (status === "completed") completedTrips++;
      if (status === "cancelled" || status === "cancelled_by_passenger" || status === "cancelled_by_driver") cancelledTrips++;

      const created = new Date(r.createdAt ?? r.created_at ?? 0).getTime();
      if (created >= today) todayTrips++;
    }

    const rev = revenueRes.data;
    const revenue = rev?.totalRevenue ?? rev?.total ?? rev?.revenue ?? 0;

    const drivers: any[] = driversRes.data?.drivers ?? driversRes.data?.data ?? driversRes.data ?? [];

    // Paginated response: { data: [...], total: number }
    const totalTickets = ticketsRes.data?.total ?? ticketsRes.data?.data?.length ?? 0;

    const users: any[] = usersRes.data?.data ?? usersRes.data ?? [];
    const newUsers = users.filter((u) => {
      const created = new Date(u.createdAt ?? u.created_at ?? 0).getTime();
      return created >= yesterday;
    }).length;

    return {
      activeTrips,
      todayTrips,
      completedTrips,
      cancelledTrips,
      revenue,
      newUsers,
      totalDrivers: drivers.length,
      totalTickets,
    };
  },

  /** GET /billing/revenue/daily?days=7 */
  getRevenueTrend: async (days = 7): Promise<RevenueEntry[]> => {
    const res = await apiClient.get(`/billing/revenue/daily?days=${days}`);
    const raw: any[] = res.data?.daily ?? res.data?.data ?? res.data ?? [];
    return raw.map((d) => ({
      day: d.date ?? d.day ?? d.label ?? "",
      revenue: d.revenue ?? d.amount ?? 0,
      rides: d.rides ?? d.rideCount ?? 0,
    }));
  },

  /** GET /admin/users?limit=10 */
  getRecentUsers: async (limit = 10): Promise<RecentUser[]> => {
    const res = await apiClient.get("/admin/users", { params: { limit } });
    const raw: any[] = res.data?.data ?? res.data ?? [];
    return raw.map((u) => ({
      id: u.id,
      name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "Unknown",
      email: u.email ?? "",
      role: u.role ?? "passenger",
      status: u.status ?? "active",
      trips: u.trips ?? 0,
      createdAt: u.createdAt ?? u.created_at ?? "",
    }));
  },

  /** GET /admin/support/tickets — all statuses, large limit */
  getRecentTickets: async (limit = 100): Promise<RecentTicket[]> => {
    const res = await apiClient.get("/admin/support/tickets", {
      params: { page: 1, limit },
    });
    const raw: any[] = res.data?.data ?? res.data?.tickets ?? (Array.isArray(res.data) ? res.data : []);
    return raw.map((t) => ({
      id: t.id,
      user: t.author
        ? `${t.author.firstName ?? ""} ${t.author.lastName ?? ""}`.trim()
        : t.user ?? "Unknown",
      issue: t.subject ?? t.title ?? "No subject",
      status: mapTicketStatus(t.status ?? "open"),
      createdAt: t.createdAt ?? t.created_at ?? "",
    }));
  },
};
