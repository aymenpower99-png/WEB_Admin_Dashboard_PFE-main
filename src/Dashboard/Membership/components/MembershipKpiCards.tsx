import { Award, CheckCircle, XCircle } from "lucide-react";
import type { MembershipLevel } from "../../../api/membershipLevels";

function StatCard({ label, value, Icon, iconBg, iconColor }: {
  label: string; value: number | string;
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

export default function MembershipKpiCards({ levels }: { levels: MembershipLevel[] }) {
  const total    = levels.length;
  const active   = levels.filter((l) => l.isActive).length;
  const inactive = levels.filter((l) => !l.isActive).length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Levels" value={total}
        Icon={Award}
        iconBg="rgba(124,58,237,0.12)" iconColor="#7c3aed"
      />
      <StatCard
        label="Active" value={active}
        Icon={CheckCircle}
        iconBg="rgba(16,185,129,0.12)" iconColor="#10b981"
      />
      <StatCard
        label="Inactive" value={inactive}
        Icon={XCircle}
        iconBg="rgba(107,114,128,0.12)" iconColor="#6b7280"
      />
    </div>
  );
}
