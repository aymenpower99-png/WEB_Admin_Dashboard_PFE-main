import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

interface RevenueChartProps {
  data: { day: string; revenue: number; rides: number }[];
  dark: boolean;
}

export default function RevenueChart({ data, dark }: RevenueChartProps) {
  const tooltipStyle = {
    background: dark ? "#1f2937" : "#fff",
    border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    color: dark ? "#e5e7eb" : "#111827",
  };

  return (
    <div style={{
      background:"var(--bg-card)",
      border:"1px solid var(--border)",
      borderRadius:"0.75rem",
      padding:"1rem 1.1rem",
      flex:1, minHeight:0, display:"flex", flexDirection:"column",
    }}>
      <p className="ts-section-label" style={{ marginBottom:"0.5rem" }}>Revenue Trend (7 days)</p>
      <div style={{ flex:1, minHeight:0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4, right:8, left:-8, bottom:0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#e5e7eb"} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize:11, fill: dark ? "#9ca3af" : "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill: dark ? "#9ca3af" : "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={tooltipStyle as any}
              formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
