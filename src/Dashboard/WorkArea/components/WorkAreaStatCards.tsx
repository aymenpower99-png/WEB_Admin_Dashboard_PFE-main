import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import MyLocationRoundedIcon    from "@mui/icons-material/MyLocationRounded";
import PersonOffRoundedIcon     from "@mui/icons-material/PersonOffRounded";
import PlaceRoundedIcon         from "@mui/icons-material/PlaceRounded";
import type { WorkAreaDriver, WorkAreaItem } from "../../../api/workAreas";

function StatCard({ label, value, icon, iconBg, iconFg }: {
  label: string; value: number | string;
  icon: React.ReactNode; iconBg: string; iconFg: string;
}) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "1rem", padding: "1.1rem 1.25rem",
      display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0,
      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconFg,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export default function WorkAreaStatCards({ drivers, areas }: { drivers: WorkAreaDriver[]; areas: WorkAreaItem[] }) {
  const total    = drivers.length;
  const assigned = drivers.filter(d => d.workAreaId !== null).length;
  const noArea   = total - assigned;
  return (
    <div style={{ display: "flex", gap: ".875rem", flexWrap: "wrap" }}>
      <StatCard label="Total Drivers"     value={total}    iconBg="var(--driver-bg)"  iconFg="var(--driver-fg)"  icon={<DirectionsCarRoundedIcon style={{ fontSize: 22 }} />} />
      <StatCard label="Assigned to Ville" value={assigned} iconBg="var(--active-bg)"  iconFg="var(--active-fg)"  icon={<MyLocationRoundedIcon    style={{ fontSize: 22 }} />} />
      <StatCard label="No Ville Assigned" value={noArea}   iconBg="var(--pending-bg)" iconFg="var(--pending-fg)" icon={<PersonOffRoundedIcon     style={{ fontSize: 22 }} />} />
      <StatCard label="Defined Villes"    value={areas.length} iconBg="var(--rider-bg)" iconFg="var(--rider-fg)" icon={<PlaceRoundedIcon         style={{ fontSize: 22 }} />} />
    </div>
  );
}