import StatCard from "./StatCard";
import { STATS } from "./constants";

interface StatsRowProps {
  dark: boolean;
}

export default function StatsRow({ dark }: StatsRowProps) {
  return (
    <div className="grid pb-4 pt-6 grid-cols-4 gap-3">
      {STATS.map((s) => (
        <StatCard key={s.title} {...s} dark={dark} />
      ))}
    </div>
  );
}