
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { C } from "./tokens";
import type { SupportEntry } from ".";
import { fetchSupportData } from "./mockData";

interface SupportChartProps {
  dark: boolean;
}

export function SupportChart({ dark }: SupportChartProps) {
  const [supportData, setSupportData] = useState<SupportEntry[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);

  useEffect(() => {
    fetchSupportData()
      .then((data) => {
        setSupportData(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B : C.lightSubtext;
  const surface   = dark ? C.darkSurface : C.lightSurface;
  const border    = dark ? C.darkBorder  : C.lightBorder;
  const text      = dark ? C.darkText    : C.lightText;
  const sub       = dark ? C.gray7B      : C.lightSubtext;

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, color: sub }}>Loading…</span>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <span style={{ fontSize: 12, color: sub }}>Failed to load support data</span>
        </div>
      );
    }

    if (!supportData.length) {
      return (
        <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 22 }}>📭</span>
          <span style={{ fontSize: 12, color: sub }}>No support tickets in the last 7 days</span>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={supportData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="time" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          <Bar dataKey="resolved" name="Resolved" fill={C.primaryPurple}      radius={[3, 3, 0, 0]} />
          <Bar dataKey="pending"  name="Pending"  fill="rgba(168,85,247,.35)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: text }}>Support Resolution</p>
          <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>Response efficiency by hourly block</p>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Resolved", color: C.primaryPurple },
            { label: "Pending",  color: "rgba(168,85,247,.35)" },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1" style={{ fontSize: 11, color: sub }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  );
}