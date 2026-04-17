import { Car, CheckCircle, Navigation, CarTaxiFront } from "lucide-react";

import type { BackendRide } from "../../../../api/rides";

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

export default function UpcomingRidesKpi({ rides }: { rides: BackendRide[] }) {
  const assigned  = rides.filter(r => r.status === "ASSIGNED").length;
  const enRoute   = rides.filter(r => r.status === "EN_ROUTE_TO_PICKUP").length;
  const inTrip    = rides.filter(r => r.status === "IN_TRIP").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard label="Total Active" value={rides.length} Icon={Car}          iconBg="var(--driver-bg)"        iconColor="var(--driver-fg)" />
      <StatCard label="Assigned"     value={assigned}     Icon={CheckCircle}  iconBg="var(--active-bg)"        iconColor="var(--active-fg)" />
      <StatCard label="En Route"     value={enRoute}      Icon={Navigation}   iconBg="rgba(59,130,246,0.12)"   iconColor="#3b82f6" />
      <StatCard label="In Trip"      value={inTrip}       Icon={CarTaxiFront} iconBg="rgba(99,102,241,0.12)"   iconColor="#6366f1" />
    </div>
  );
}
