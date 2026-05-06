import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ClassRevenue } from "../../../../api/billing";
import { ChartTooltip } from "../../components/billing-shared";

interface Props {
  data: ClassRevenue[];
}

export default function RevenueByClassChart({ data }: Props) {
  return (
    <div className="ts-table-wrap" style={{ padding: "1.25rem" }}>
      <p
        style={{
          margin: "0 0 1rem",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "var(--text-h)",
          userSelect: "none",
          cursor: "default",
        }}
      >
        Revenue by Vehicle Class
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="barGradOverview" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--brand-from)" />
              <stop offset="100%" stopColor="var(--brand-to)"   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="className"
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-faint)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="url(#barGradOverview)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
