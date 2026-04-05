import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import type { Driver } from "../types";

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: ".75rem",
        padding: "1.1rem 1.3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minWidth: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: ".78rem",
            color: "var(--text-muted)",
            fontWeight: 500,
            marginBottom: ".3rem",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "1.65rem",
            fontWeight: 800,
            color: "var(--text-h)",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
      </div>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
      </div>
    </div>
  );
}

export default function DriverKpiCards({ drivers }: { drivers: Driver[] }) {
  const total = drivers.length;
  const online = drivers.filter((d) => d.status === "online").length;
  const busy = drivers.filter((d) => d.status === "busy").length;
  const offline = drivers.filter((d) => d.status === "offline").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Drivers"
        value={total}
        icon={<PersonRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="#ede9fe"
        iconColor="#7c3aed"
      />
      <StatCard
        label="Online"
        value={online}
        icon={<CheckCircleRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="#d1fae5"
        iconColor="#059669"
      />
      <StatCard
        label="Busy"
        value={busy}
        icon={<HourglassEmptyRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="#fef3c7"
        iconColor="#d97706"
      />
      <StatCard
        label="Offline"
        value={offline}
        icon={<HighlightOffRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="#e5e7eb"
        iconColor="#4b5563"
      />
    </div>
  );
}
