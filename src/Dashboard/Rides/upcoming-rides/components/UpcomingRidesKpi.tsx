import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CheckCircleRoundedIcon  from "@mui/icons-material/CheckCircleRounded";
import RouteRoundedIcon        from "@mui/icons-material/RouteRounded";
import LocalTaxiRoundedIcon    from "@mui/icons-material/LocalTaxiRounded";

import type { BackendRide } from "../../../../api/rides";

/* ─── StatCard (identical to Drivers) ──────────────────────────────────── */
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

/* ─── KPI Row ──────────────────────────────────────────────────────────── */
export default function UpcomingRidesKpi({ rides }: { rides: BackendRide[] }) {
  const assigned  = rides.filter(r => r.status === "ASSIGNED").length;
  const enRoute   = rides.filter(r => r.status === "EN_ROUTE_TO_PICKUP").length;
  const inTrip    = rides.filter(r => r.status === "IN_TRIP").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard label="Total Active"  value={rides.length} icon={<DirectionsCarRoundedIcon style={{ fontSize: 20 }} />} iconBg="var(--driver-bg)" iconColor="var(--driver-fg)" />
      <StatCard label="Assigned"      value={assigned}     icon={<CheckCircleRoundedIcon  style={{ fontSize: 20 }} />} iconBg="var(--active-bg)" iconColor="var(--active-fg)" />
      <StatCard label="En Route"      value={enRoute}      icon={<RouteRoundedIcon        style={{ fontSize: 20 }} />} iconBg="rgba(59,130,246,0.12)" iconColor="#3b82f6" />
      <StatCard label="In Trip"       value={inTrip}       icon={<LocalTaxiRoundedIcon    style={{ fontSize: 20 }} />} iconBg="rgba(99,102,241,0.12)" iconColor="#6366f1" />
    </div>
  );
}
