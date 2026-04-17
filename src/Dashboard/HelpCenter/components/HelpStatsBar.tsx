interface Props {
  total: number;
  reviewed: number;
  auto: number;
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div style={{
      background: "var(--bg-sidebar)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", color: "var(--text-faint)",
      }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color: "var(--text-h)", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</span>
    </div>
  );
}

export default function HelpStatsBar({ total, reviewed, auto }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
      <StatCard label="Total Articles" value={total} sub="across all categories" />
      <StatCard label="Reviewed" value={reviewed} sub="manually approved" />
      <StatCard label="Auto / Draft" value={auto} sub="pending review" />
    </div>
  );
}
