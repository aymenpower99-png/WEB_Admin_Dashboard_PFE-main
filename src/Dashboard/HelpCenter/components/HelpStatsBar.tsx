import type { ReactNode } from "react";
import ArticleRoundedIcon    from "@mui/icons-material/ArticleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutorenewRoundedIcon   from "@mui/icons-material/AutorenewRounded";

function StatCard({ label, value, icon, iconBg, iconColor }: {
  label: string; value: number;
  icon: ReactNode; iconBg: string; iconColor: string;
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

export default function HelpStatsBar({ total, reviewed, auto }: { total: number; reviewed: number; auto: number }) {
  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Total Articles" value={total}
        icon={<ArticleRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--driver-bg)" iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Reviewed" value={reviewed}
        icon={<CheckCircleRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--active-bg)" iconColor="var(--active-fg)"
      />
      <StatCard
        label="Auto / Draft" value={auto}
        icon={<AutorenewRoundedIcon style={{ fontSize: 22 }} />}
        iconBg="var(--pending-bg)" iconColor="var(--pending-fg)"
      />
    </div>
  );
}

