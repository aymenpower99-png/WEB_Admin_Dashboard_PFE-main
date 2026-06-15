import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import type { ClassRevenue } from "../../../../api/billing";
import { ChartTooltip } from "../../components/billing-shared";

interface Props {
  data: ClassRevenue[];
}

function formatTnd(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return v.toLocaleString();
}

const BAR_COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff", "#f3e8ff"];

export default function RevenueByClassChart({ data }: Props) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1rem 1.1rem",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <p
          className="ts-section-label"
          style={{ margin: 0, marginBottom: "0.15rem" }}
        >
          REVENUE BY VEHICLE CLASS
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.72rem",
            color: "var(--text-faint)",
            fontWeight: 400,
          }}
        >
          Breakdown of earnings per vehicle category
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 8, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="className"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatTnd}
              width={70}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="revenue"
              radius={[6, 6, 0, 0]}
              fill="url(#barGradOverview)"
              maxBarSize={48}
              barSize={data.length === 1 ? 48 : undefined}
            >
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={BAR_COLORS[i % BAR_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(v) => formatTnd(Number(v))}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fill: "var(--text-muted)",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}