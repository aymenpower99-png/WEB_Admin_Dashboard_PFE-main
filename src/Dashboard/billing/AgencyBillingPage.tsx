import { useState, useEffect, useCallback } from "react";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import "../travelsync-design-system.css";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  billingApi,
  type RevenueStats, type DailyRevenue, type MonthlyRevenue, type ClassRevenue,
} from "../../api/billing";
import { FilterPill, ChartTooltip } from "./components/billing-shared";
import DriverEarningsTab from "./components/DriverEarningsTab";
import TripPaymentsTab from "./components/TripPaymentsTab";

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AgencyBillingPage() {
  const [chartToggle, setChartToggle] = useState<"daily" | "monthly">("daily");
  const [activeTab, setActiveTab] = useState(0);

  /* API data */
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [dailyChart, setDailyChart] = useState<DailyRevenue[]>([]);
  const [monthlyChart, setMonthlyChart] = useState<MonthlyRevenue[]>([]);
  const [classRevenue, setClassRevenue] = useState<ClassRevenue[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [s, d, m, c] = await Promise.all([
        billingApi.getRevenueStats(),
        billingApi.getDailyRevenue(),
        billingApi.getMonthlyRevenue(),
        billingApi.getRevenueByClass(),
      ]);
      setStats(s);
      setDailyChart(d);
      setMonthlyChart(m);
      setClassRevenue(c);
    } catch { /* silent */ }
    setLoadingStats(false);
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const tabs = ["Trip Payments", "Driver Earnings"];

  const summaryCards = [
    { label: "Total Revenue (This Month)", value: stats ? `${stats.totalEarnings.toLocaleString()} TND` : "—", icon: <TrendingUpRoundedIcon style={{ fontSize: 18, color: "#10b981" }} />, iconBg: "rgba(16,185,129,0.12)" },
    { label: "Paid Revenue",               value: stats ? `${stats.paidRevenue.toLocaleString()} TND` : "—", icon: <MonetizationOnRoundedIcon style={{ fontSize: 18, color: "#3b82f6" }} />, iconBg: "rgba(59,130,246,0.12)" },
    { label: "Pending Payments",           value: stats ? `${stats.pendingPayments.toLocaleString()} TND` : "—", icon: <PendingActionsRoundedIcon style={{ fontSize: 18, color: "#f59e0b" }} />, iconBg: "rgba(245,158,11,0.12)" },
    { label: "Total Trips",               value: stats ? `${stats.totalTrips}` : "—", icon: <AccountBalanceWalletRoundedIcon style={{ fontSize: 18, color: "#8b5cf6" }} />, iconBg: "rgba(139,92,246,0.12)" },
  ];

  const chartData = chartToggle === "daily" ? dailyChart : monthlyChart;
  const chartKey = chartToggle === "daily" ? "day" : "month";

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Agency Billing</h1>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="ts-grid-4">
        {summaryCards.map(c => (
          <div key={c.label} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: ".75rem",
            padding: "1.1rem 1.3rem", display: "flex", alignItems: "center",
            justifyContent: "space-between", flex: 1, minWidth: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,.04)",
          }}>
            <div>
              <p style={{ margin: 0, fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: ".3rem", textTransform: "uppercase", letterSpacing: ".05em" }}>{c.label}</p>
              <p style={{ margin: 0, fontSize: "1.45rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>{c.value}</p>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs (above charts) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "0.65rem 1.15rem",
                fontSize: "0.78rem",
                fontWeight: activeTab === i ? 700 : 500,
                color: activeTab === i ? "var(--text-h)" : "var(--text-faint)",
                background: "none",
                border: "none",
                borderBottom: activeTab === i ? "2px solid var(--brand-from)" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all .15s",
                marginBottom: -1,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "1rem" }}>
          {activeTab === 0 && <TripPaymentsTab onRefresh={fetchDashboard} />}
          {activeTab === 1 && <DriverEarningsTab />}
        </div>
      </div>

      {/* ── Revenue Analytics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="ts-table-wrap" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-h)", outline: "none", userSelect: "none", cursor: "default" }}>Earnings Over Time</p>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {(["daily", "monthly"] as const).map(t => (
                <FilterPill key={t} label={t === "daily" ? "Daily" : "Monthly"} active={chartToggle === t} onClick={() => setChartToggle(t)} />
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey={chartKey} tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="earnings" stroke="var(--brand-from)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--brand-from)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ts-table-wrap" style={{ padding: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-h)", marginBottom: "1rem", outline: "none", userSelect: "none", cursor: "default" }}>Revenue by Vehicle Class</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classRevenue} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="className" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="url(#barGrad2)" />
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-from)" />
                  <stop offset="100%" stopColor="var(--brand-to)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}