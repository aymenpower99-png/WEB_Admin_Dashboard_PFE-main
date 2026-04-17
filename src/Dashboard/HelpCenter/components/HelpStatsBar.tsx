import { FileText, CheckCircle, RefreshCw } from "lucide-react";

function StatCard({ label, value, Icon, iconBg, iconColor }: {
  label: string; value: number;
  Icon: React.ElementType; iconBg: string; iconColor: string;
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
        <p style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>{value}</p>
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

export default function HelpStatsBar({ total, reviewed, auto }: { total: number; reviewed: number; auto: number }) {
  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Articles" value={total}
        Icon={FileText}
        iconBg="var(--driver-bg)" iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Reviewed" value={reviewed}
        Icon={CheckCircle}
        iconBg="var(--active-bg)" iconColor="var(--active-fg)"
      />
      <StatCard
        label="Auto / Draft" value={auto}
        Icon={RefreshCw}
        iconBg="var(--pending-bg)" iconColor="var(--pending-fg)"
      />
    </div>
  );
}

