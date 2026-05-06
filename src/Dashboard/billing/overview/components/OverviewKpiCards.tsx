import TrendingUpRoundedIcon          from "@mui/icons-material/TrendingUpRounded";
import MonetizationOnRoundedIcon       from "@mui/icons-material/MonetizationOnRounded";
import PendingActionsRoundedIcon       from "@mui/icons-material/PendingActionsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import type { RevenueStats } from "../../../../api/billing";
import OverviewStatCard from "./OverviewStatCard";

interface Props {
  stats: RevenueStats | null;
  loading: boolean;
}

const CARDS = (stats: RevenueStats | null) => [
  {
    label:  "Total Revenue (This Month)",
    value:  stats ? `${stats.totalEarnings.toLocaleString()} TND` : "—",
    icon:   <TrendingUpRoundedIcon style={{ fontSize: 18, color: "#10b981" }} />,
    iconBg: "rgba(16,185,129,0.12)",
  },
  {
    label:  "Paid Revenue",
    value:  stats ? `${stats.paidRevenue.toLocaleString()} TND` : "—",
    icon:   <MonetizationOnRoundedIcon style={{ fontSize: 18, color: "#3b82f6" }} />,
    iconBg: "rgba(59,130,246,0.12)",
  },
  {
    label:  "Pending Payments",
    value:  stats ? `${stats.pendingPayments.toLocaleString()} TND` : "—",
    icon:   <PendingActionsRoundedIcon style={{ fontSize: 18, color: "#f59e0b" }} />,
    iconBg: "rgba(245,158,11,0.12)",
  },
  {
    label:  "Total Trips",
    value:  stats ? `${stats.totalTrips}` : "—",
    icon:   <AccountBalanceWalletRoundedIcon style={{ fontSize: 18, color: "#8b5cf6" }} />,
    iconBg: "rgba(139,92,246,0.12)",
  },
];

export default function OverviewKpiCards({ stats, loading }: Props) {
  return (
    <div className="ts-grid-4">
      {CARDS(stats).map((c) => (
        <OverviewStatCard key={c.label} {...c} loading={loading} />
      ))}
    </div>
  );
}
