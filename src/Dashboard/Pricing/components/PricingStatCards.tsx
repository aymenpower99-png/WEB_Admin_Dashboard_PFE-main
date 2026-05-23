import { LayoutGrid, TrendingUp, ShieldCheck, Zap, Calculator, BrainCircuit } from "lucide-react";
import type { PricingConfig } from "../../../api/pricing";

function StatCard({
  label,
  value,
  sub,
  Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  sub: string;
  Icon: React.ElementType;
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
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "1.55rem",
            fontWeight: 800,
            color: "var(--text-h)",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            margin: 0,
            marginTop: ".25rem",
            fontSize: ".72rem",
            color: "var(--text-faint)",
          }}
        >
          {sub}
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
        <Icon size={18} color={iconColor} strokeWidth={1.75} />
      </div>
    </div>
  );
}

interface PricingStatCardsProps {
  config: PricingConfig;
}

export default function PricingStatCards({ config }: PricingStatCardsProps) {
  const maxMult = Math.max(
    ...Object.values(config.MULT_SPECIAL_EVENT),
    ...Object.values(config.MULT_RAMADAN),
    config.MULT_NIGHT,
  );
  const sample = (config.BASE_FARE + 10 * config.RATE_PER_KM + 15 * config.RATE_PER_MIN).toFixed(2);
  const xgbPct = ((config.W_XGB / (config.W_XGB + config.W_LGBM || 1)) * 100).toFixed(0);

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard
        label="Base Fare"
        value={`${config.BASE_FARE.toFixed(2)} TND`}
        sub="fixed pickup charge"
        Icon={LayoutGrid}
        iconBg="var(--driver-bg)"
        iconColor="var(--driver-fg)"
      />
      <StatCard
        label="Rate / km"
        value={`${config.RATE_PER_KM.toFixed(2)} TND`}
        sub="per kilometre"
        Icon={TrendingUp}
        iconBg="var(--rider-bg)"
        iconColor="var(--rider-fg)"
      />
      <StatCard
        label="Min Fare"
        value={`${config.MIN_FARE.toFixed(2)} TND`}
        sub="floor guarantee"
        Icon={ShieldCheck}
        iconBg="var(--active-bg)"
        iconColor="var(--active-fg)"
      />
      <StatCard
        label="Max Multiplier"
        value={`×${maxMult.toFixed(2)}`}
        sub="peak surge"
        Icon={Zap}
        iconBg="var(--pending-bg)"
        iconColor="var(--pending-fg)"
      />
      <StatCard
        label="Est. 10 km / 15 min"
        value={`${sample} TND`}
        sub="sample ride"
        Icon={Calculator}
        iconBg="rgba(124,58,237,.12)"
        iconColor="#7c3aed"
      />
      <StatCard
        label="XGBoost Weight"
        value={`${xgbPct}%`}
        sub="ensemble share"
        Icon={BrainCircuit}
        iconBg="rgba(20,184,166,.12)"
        iconColor="#14b8a6"
      />
    </div>
  );
}
