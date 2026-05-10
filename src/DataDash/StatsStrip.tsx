import { useEffect, useState } from "react";
import { Activity, Users, Shield, BarChart2 } from "lucide-react";
import { C } from "./tokens";
import { fetchOperationalData, type OperationalData } from "./mockData";

interface StatsStripProps {
  dark: boolean;
}

export function StatsStrip({ dark }: StatsStripProps) {
  const [data, setData]       = useState<OperationalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperationalData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const stats = data
    ? [
        {
          icon:  Activity,
          label: "Avg Trip Duration",
          value: data.avgTripDuration !== null ? `${data.avgTripDuration.toFixed(1)} min` : "—",
          up:    true,
        },
        {
          icon:  Users,
          label: "Active Drivers",
          value: data.activeDrivers !== null ? data.activeDrivers.toString() : "—",
          up:    true,
        },
        {
          icon:  Shield,
          label: "Safety Score",
          value: data.safetyScore !== null ? `${data.safetyScore.toFixed(1)}%` : "—",
          up:    true,
        },
        {
          icon:  BarChart2,
          label: "Utilization Rate",
          value: data.utilizationRate !== null ? `${data.utilizationRate.toFixed(1)}%` : "—",
          up:    false,
        },
      ]
    : [];

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border p-3 animate-pulse"
            style={{ background: surface, borderColor: border, height: 80 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
      {stats.map(({ icon: Icon, label, value, up }) => (
        <div key={label} className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
              <Icon size={14} color={C.primaryPurple} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
              textTransform: "uppercase", color: sub }}>{label}</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", color: text }}>{value}</p>
        </div>
      ))}
    </div>
  );
}