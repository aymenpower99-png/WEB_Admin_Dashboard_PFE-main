import { Users, Banknote, TrendingUp, Wallet } from "lucide-react";
import type { DriverEarningRecord } from "../../../../api/billing";

function StatCard({
  label, value, Icon, iconBg, iconColor, loading,
}: {
  label: string; value: string | number;
  Icon: React.ElementType; iconBg: string; iconColor: string;
  loading: boolean;
}) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: ".75rem", padding: "1.1rem 1.3rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flex: 1, minWidth: 0, boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div>
        <p style={{
          margin: 0, fontSize: ".78rem", color: "var(--text-muted)",
          fontWeight: 500, marginBottom: ".3rem",
          textTransform: "uppercase", letterSpacing: ".05em",
        }}>{label}</p>
        <p style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>
          {loading ? "—" : value}
        </p>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: "50%", background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} color={iconColor} strokeWidth={1.75} />
      </div>
    </div>
  );
}

interface Props {
  drivers: DriverEarningRecord[];
  total:   number;
  loading: boolean;
}

export default function DriverEarningsKpiCards({ drivers, total, loading }: Props) {
  const totalSalary  = drivers.reduce((s, d) => s + d.fixedSalary,   0);
  const totalBonuses = drivers.reduce((s, d) => s + d.totalBonuses,  0);
  const netEarnings  = drivers.reduce((s, d) => s + d.netEarnings,   0);

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Drivers" loading={loading}
        value={total}
        Icon={Users}
        iconBg="var(--driver-bg, rgba(139,92,246,0.12))" iconColor="var(--driver-fg, #7c3aed)"
      />
      <StatCard
        label="Total Fixed Salary" loading={loading}
        value={`${totalSalary.toLocaleString()} DT`}
        Icon={Banknote}
        iconBg="rgba(59,130,246,0.12)" iconColor="#3b82f6"
      />
      <StatCard
        label="Total Bonuses" loading={loading}
        value={`${totalBonuses.toLocaleString()} DT`}
        Icon={TrendingUp}
        iconBg="rgba(16,185,129,0.12)" iconColor="#10b981"
      />
      <StatCard
        label="Net Earnings" loading={loading}
        value={`${netEarnings.toLocaleString()} DT`}
        Icon={Wallet}
        iconBg="#fef9c3" iconColor="#854d0e"
      />
    </div>
  );
}
