import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";

import type { DriverProfile } from "../../../api/drivers";

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

export default function DriverKpiCards({ drivers }: { drivers: DriverProfile[] }) {
  const total         = drivers.length;
  const pending       = drivers.filter((d) => d.availabilityStatus === "pending").length;
  const setupRequired = drivers.filter((d) => d.availabilityStatus === "setup_required").length;
  const online        = drivers.filter((d) => d.availabilityStatus === "online").length;
  const offline       = drivers.filter((d) => d.availabilityStatus === "offline").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Drivers" value={total}
        icon={<PersonRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--driver-bg)" iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Pending" value={pending}
        icon={<HourglassEmptyRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="#fef9c3" iconColor="#854d0e"
      />
      <StatCard
        label="Setup Required" value={setupRequired}
        icon={<BuildRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="rgba(234,88,12,0.12)" iconColor="#c2410c"
      />
      <StatCard
        label="Online" value={online}
        icon={<CheckCircleRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--active-bg)" iconColor="var(--active-fg)"
      />
      <StatCard
        label="Offline" value={offline}
        icon={<HighlightOffRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--refunded-bg)" iconColor="var(--refunded-fg)"
      />
      {/* Avg Rating card removed */}
    </div>
  );
}