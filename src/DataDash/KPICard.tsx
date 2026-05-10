import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { C } from "./tokens";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  dark: boolean;
}

export function KPICard({ icon: Icon, label, value, delta, deltaUp, dark }: KPICardProps) {
  return (
    <div
      className="rounded-xl p-4 border transition-all hover:scale-[1.02]"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: dark ? C.iconBgDark : C.iconBgLight }}
        >
          <Icon size={17} color={C.primaryPurple} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: dark ? C.gray7B : C.lightSubtext,
          }}
        >
          {label}
        </span>
        <span
          className="ml-auto flex items-center gap-0.5"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: deltaUp ? C.success : C.error,
          }}
        >
          {deltaUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {delta}
        </span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: dark ? C.darkText : C.lightText,
        }}
      >
        {value}
      </div>
    </div>
  );
}
