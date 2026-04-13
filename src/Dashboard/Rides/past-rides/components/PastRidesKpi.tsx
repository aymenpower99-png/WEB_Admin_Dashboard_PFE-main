import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CheckCircleRoundedIcon  from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon       from "@mui/icons-material/CancelRounded";
import TrendingUpRoundedIcon   from "@mui/icons-material/TrendingUpRounded";

import type { BackendRide } from "../../../../api/rides";

function StatCard({ label, value, icon, iconBg, iconColor }: {
  label: string; value: number | string;
  icon: React.ReactNode; iconBg: string; iconColor: string;
}) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: ".75rem", padding: "1.1rem 1.3rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flex: 1, minWidth: 0, boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div>
        <p style={{ margin: 0, fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: ".3rem" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>{value}</p>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: "50%", background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
      </div>
    </div>
  );
}

export default function PastRidesKpi({ rides }: { rides: BackendRide[] }) {
  const total     = rides.length;
  const completed = rides.filter(r => r.status === "COMPLETED").length;
  const cancelled = rides.filter(r => r.status === "CANCELLED").length;
  const revenue   = rides
    .filter(r => r.status === "COMPLETED")
    .reduce((sum, r) => sum + (r.priceFinal ?? 0), 0);

  const fmtRevenue = revenue.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " TND";

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Rides" value={total}
        icon={<DirectionsCarRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="var(--driver-bg)" iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Completed" value={completed}
        icon={<CheckCircleRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="var(--active-bg)" iconColor="var(--active-fg)"
      />
      <StatCard
        label="Cancelled" value={cancelled}
        icon={<CancelRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="rgba(220,38,38,0.12)" iconColor="#dc2626"
      />
      <StatCard
        label="Revenue" value={fmtRevenue}
        icon={<TrendingUpRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="#fef9c3" iconColor="#854d0e"
      />
    </div>
  );
}
