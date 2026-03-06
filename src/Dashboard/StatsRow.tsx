import './travelsync-design-system.css'
interface StatCardProps {
  title: string; value: string; tag: string;
  trend: string; note: string; warning: boolean; dark: boolean;
}

export function StatCard({ title, value, tag, trend, note, warning }: StatCardProps) {
  return (
    <div className="ts-card ts-stat-card">
      <div className="flex items-center justify-between">
        <span className="ts-stat-label">{title}</span>
        <span className="ts-stat-chip">{tag}</span>
      </div>
      <div className="ts-stat-value">{value}</div>
      <div className={`flex gap-1 text-xs ${warning ? "ts-stat-warn" : "ts-stat-up"}`}>
        <span>{trend}</span>
        <span className="ts-faint">{note}</span>
      </div>
    </div>
  );
}

// StatsRow.tsx
import { STATS } from "./constants";
interface StatsRowProps { dark: boolean; }

export default function StatsRow({ dark }: StatsRowProps) {
  return (
    <div className="ts-grid-4 py-4">
      {STATS.map((s) => <StatCard key={s.title} {...s} dark={dark} />)}
    </div>
  );
}