import CategoryRoundedIcon   from "@mui/icons-material/CategoryRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WifiRoundedIcon        from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon      from "@mui/icons-material/AcUnitRounded";

function StatCard({
  label, value, icon, iconBg, iconColor,
}: {
  label: string; value: number;
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
        <p style={{
          margin: 0, fontSize: ".78rem", color: "var(--text-muted)",
          fontWeight: 500, marginBottom: ".3rem",
          textTransform: "uppercase", letterSpacing: ".05em",
        }}>
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

export default function ClassStatCards({
  total, active, withWifi, withAc,
}: {
  total: number; active: number; withWifi: number; withAc: number;
}) {
  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard label="Total Classes" value={total}
        icon={<CategoryRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--driver-bg)" iconColor="var(--driver-fg)" />
      <StatCard label="Active" value={active}
        icon={<CheckCircleRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--active-bg)" iconColor="var(--active-fg)" />
      <StatCard label="WiFi Enabled" value={withWifi}
        icon={<WifiRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--rider-bg)" iconColor="var(--rider-fg)" />
      <StatCard label="A/C Enabled" value={withAc}
        icon={<AcUnitRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--pending-bg)" iconColor="var(--pending-fg)" />
    </div>
  );
}