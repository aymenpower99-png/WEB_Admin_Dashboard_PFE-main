import { useState, useEffect, useCallback } from "react";
import {
  billingApi,
  type RevenueStats,
  type DailyRevenue,
  type MonthlyRevenue,
  type ClassRevenue,
} from "../../../api/billing";
import OverviewKpiCards from "./components/OverviewKpiCards";
import EarningsChart from "./components/EarningsChart";
import RevenueByClassChart from "./components/RevenueByClassChart";

export default function AgencyBillingOverviewPage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [daily, setDaily] = useState<DailyRevenue[]>([]);
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [classRevenue, setClassRevenue] = useState<ClassRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, d, m, c] = await Promise.all([
        billingApi.getRevenueStats(),
        billingApi.getDailyRevenue(),
        billingApi.getMonthlyRevenue(),
        billingApi.getRevenueByClass(),
      ]);
      setStats(s);
      setDaily(d);
      setMonthly(m);
      setClassRevenue(c);
    } catch {
      /* silent */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* ── Header ── */}
      <div>
        <h1
          className="ts-page-title"
          style={{ fontSize: "1.25rem", fontWeight: 800, flexShrink: 0 }}
        >
          Overview
        </h1>
        <p
          className="ts-muted"
          style={{ fontSize: "0.72rem", marginTop: "0.15rem" }}
        >
          Revenue summary and analytics
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <OverviewKpiCards stats={stats} loading={loading} />

      {/* ── Charts ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          minHeight: 280,
        }}
      >
        <EarningsChart daily={daily} monthly={monthly} />
        <RevenueByClassChart data={classRevenue} />
      </div>
    </div>
  );
}