import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyRevenue, MonthlyRevenue } from "../../../../api/billing";
import { FilterPill, ChartTooltip } from "../../components/billing-shared";

interface Props {
  daily:   DailyRevenue[];
  monthly: MonthlyRevenue[];
}

export default function EarningsChart({ daily, monthly }: Props) {
  const [toggle, setToggle] = useState<"daily" | "monthly">("daily");

  const data    = toggle === "daily" ? daily   : monthly;
  const xKey    = toggle === "daily" ? "day"   : "month";

  return (
    <div className="ts-table-wrap" style={{ padding: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--text-h)",
            userSelect: "none",
            cursor: "default",
          }}
        >
          Earnings Over Time
        </p>
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

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "var(--text-faint)" }}
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
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="var(--brand-from)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "var(--brand-from)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
