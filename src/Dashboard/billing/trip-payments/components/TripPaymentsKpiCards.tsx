import { Receipt, CheckCircle, Clock, RotateCcw } from "lucide-react";
import type { RevenueStats } from "../../../../api/billing";

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
  stats:   RevenueStats | null;
  loading: boolean;
}

export default function TripPaymentsKpiCards({ stats, loading }: Props) {
  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Payments" loading={loading}
        value={stats?.totalTrips ?? 0}
        Icon={Receipt}
        iconBg="rgba(139,92,246,0.12)" iconColor="#7c3aed"
      />
      <StatCard
        label="Paid Revenue" loading={loading}
        value={stats ? `${stats.paidRevenue.toLocaleString()} TND` : "—"}
        Icon={CheckCircle}
        iconBg="rgba(16,185,129,0.12)" iconColor="#10b981"
      />
      <StatCard
        label="Pending" loading={loading}
        value={stats ? `${stats.pendingPayments.toLocaleString()} TND` : "—"}
        Icon={Clock}
        iconBg="#fef9c3" iconColor="#854d0e"
      />
      <StatCard
        label="Refunded" loading={loading}
        value={stats ? `${stats.refundedAmount.toLocaleString()} TND` : "—"}
        Icon={RotateCcw}
        iconBg="rgba(59,130,246,0.12)" iconColor="#3b82f6"
      />
    </div>
  );
}
