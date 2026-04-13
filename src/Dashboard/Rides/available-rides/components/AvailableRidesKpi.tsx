import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import type { BackendRide } from "../../../../api/rides";

/* ─── Stat card (same pattern as DriverKpiCards) ─────────────────────── */
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
        <p style={{ margin: 0, fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: ".3rem" }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>
          {value}
        </p>
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

/* ─── KPI row ────────────────────────────────────────────────────────── */
export default function AvailableRidesKpi({ rides }: { rides: BackendRide[] }) {
  const total     = rides.length;
  const pending   = rides.filter(r => r.status === "PENDING").length;
  const searching = rides.filter(r => r.status === "SEARCHING_DRIVER").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Available"
        value={total}
        icon={<DirectionsCarRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="var(--driver-bg)"
        iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Pending"
        value={pending}
        icon={<HourglassEmptyRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="#fef9c3"
        iconColor="#854d0e"
      />
      <StatCard
        label="Searching"
        value={searching}
        icon={<SearchRoundedIcon style={{ fontSize: 20 }} />}
        iconBg="rgba(37,99,235,0.12)"
        iconColor="#2563eb"
      />
    </div>
  );
}
