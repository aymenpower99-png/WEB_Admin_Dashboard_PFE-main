import { TrendingUp, Wallet, Car } from "lucide-react";
import type { RevenueStats } from "../../../../api/billing";
import OverviewStatCard from "./OverviewStatCard";

interface Props {
  stats: RevenueStats | null;
  loading: boolean;
}

const CARDS = (stats: RevenueStats | null) => [
  {
    label: "TOTAL REVENUE (THIS MONTH)",
    value: stats?.totalEarnings != null
      ? `${stats.totalEarnings.toLocaleString()} TND`
      : "—",
    icon: <TrendingUp size={16} color="#10b981" strokeWidth={1.75} />,
    iconBg: "#d1fae5",
  },
  {
    label: "PAID REVENUE",
    value: stats?.paidRevenue != null
      ? `${stats.paidRevenue.toLocaleString()} TND`
      : "—",
    icon: <Wallet size={16} color="#2563eb" strokeWidth={1.75} />,
    iconBg: "#dbeafe",
  },
  {
    label: "TOTAL TRIPS",
    value: stats?.totalTrips != null
      ? `${stats.totalTrips.toLocaleString()}`
      : "—",
    icon: <Car size={16} color="#7c3aed" strokeWidth={1.75} />,
    iconBg: "#ede9fe",
  },
];

export default function OverviewKpiCards({ stats, loading }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
      {CARDS(stats).map((c) => (
        <OverviewStatCard key={c.label} {...c} loading={loading} />
      ))}
    </div>
  );
}