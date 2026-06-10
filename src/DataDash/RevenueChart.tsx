import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { C } from "./tokens";
import type { RevenueEntry } from ".";
import { fetchRevenueData } from "./mockData";

interface RevenueChartProps {
  dark: boolean;
}

export function RevenueChart({ dark }: RevenueChartProps) {
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRevenueData(days)
      .then(setRevenueData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B : C.lightSubtext;
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: surface, borderColor: border }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: text }}>
            Revenue Trends
          </p>
          <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>
            Daily gross revenue across all sectors
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-xs rounded-lg border px-2 py-1"
          style={{
            background: dark ? C.darkBorder : C.grayE6,
            borderColor: border,
            color: text,
            fontFamily: "inherit",
          }}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      {loading ? (
        <div
          style={{
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 12, color: sub }}>Loading…</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart
            data={revenueData}
            margin={{ top: 5, right: 5, bottom: 0, left: 30 }}
          >
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={C.primaryPurple}
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor={C.primaryPurple}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="day"
              tick={{ fill: tickColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v.toFixed(0)} TND`}
            />
            <Tooltip content={<CustomTooltip dark={dark} prefix="TND" />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={C.primaryPurple}
              strokeWidth={2.5}
              fill="url(#revGrad)"
              dot={{ fill: C.primaryPurple, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
