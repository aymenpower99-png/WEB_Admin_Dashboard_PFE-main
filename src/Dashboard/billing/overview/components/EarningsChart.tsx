import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyRevenue, MonthlyRevenue } from "../../../../api/billing";
import { FilterPill, ChartTooltip } from "../../components/billing-shared";

interface Props {
  daily: DailyRevenue[];
  monthly: MonthlyRevenue[];
}

function formatTnd(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M TND`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k TND`;
  return `${v.toLocaleString()} TND`;
}

export default function EarningsChart({ daily, monthly }: Props) {
  const [toggle, setToggle] = useState<"daily" | "monthly">("daily");

  const data = toggle === "daily" ? daily : monthly;
  const xKey = toggle === "daily" ? "day" : "month";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <p
            className="ts-section-label"
            style={{ margin: 0, marginBottom: "0.15rem" }}
          >
            EARNINGS OVER TIME
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              color: "var(--text-faint)",
              fontWeight: 400,
            }}
          >
            Revenue trend across {toggle === "daily" ? "days" : "months"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {(["daily", "monthly"] as const).map((t) => (
            <FilterPill
              key={t}
              label={t === "daily" ? "Daily" : "Monthly"}
              active={toggle === t}
              onClick={() => setToggle(t)}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatTnd}
              width={80}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#earnGrad)"
              dot={data.length <= 1}
              activeDot={{ r: 5, strokeWidth: 0, fill: "#7c3aed" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}