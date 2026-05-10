import { useState, useEffect, useCallback } from "react";
import { dashboardApi } from "../../../api/dashboard";
import type { DashboardData, DashboardUser, DashboardTicket } from "./types";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overview, revenue, users, tickets] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getRevenueTrend(7),
        dashboardApi.getRecentUsers(10),
        dashboardApi.getRecentTickets(100),
      ]);

      setData({
        kpis: {
          activeTrips:    overview.activeTrips,
          todayTrips:     overview.todayTrips,
          completedTrips: overview.completedTrips,
          cancelledTrips: overview.cancelledTrips,
          revenue:        overview.revenue,
          newUsers:       overview.newUsers,
          totalDrivers:   overview.totalDrivers,
          totalTickets:   overview.totalTickets,
        },
        revenueTrend: revenue,
        recentUsers: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status as DashboardUser["status"],
          trips: u.trips ?? null,
        })),
        recentTickets: tickets.map((t) => ({
          id: t.id,
          user: t.user,
          issue: t.issue,
          status: t.status as DashboardTicket["status"],
        })),
      });
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
