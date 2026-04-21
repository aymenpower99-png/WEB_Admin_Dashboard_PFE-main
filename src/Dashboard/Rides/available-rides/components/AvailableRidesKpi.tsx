import { Car, Clock, Search, CalendarClock } from "lucide-react";

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

export default function AvailableRidesKpi({ rides }: { rides: BackendRide[] }) {
  const total     = rides.length;
  const pending   = rides.filter(r => r.status === "PENDING" && !r.confirmedAt).length;
  const scheduled = rides.filter(r => r.status === "PENDING" && !!r.confirmedAt).length;
  const searching = rides.filter(r => r.status === "SEARCHING_DRIVER").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Available" value={total}
        Icon={Car}
        iconBg="var(--driver-bg)" iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Pending" value={pending}
        Icon={Clock}
        iconBg="#fef9c3" iconColor="#854d0e"
      />
      <StatCard
        label="Scheduled" value={scheduled}
        Icon={CalendarClock}
        iconBg="rgba(20,184,166,0.12)" iconColor="#0d9488"
      />
      <StatCard
        label="Searching" value={searching}
        Icon={Search}
        iconBg="rgba(37,99,235,0.12)" iconColor="#2563eb"
      />
    </div>
  );
}
