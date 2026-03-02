interface StatCardProps {
  title: string;
  value: string;
  tag: string;
  trend: string;
  note: string;
  warning: boolean;
  dark: boolean;
}

export default function StatCard({ title, value, tag, trend, note, warning, dark }: StatCardProps) {
  const card    = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const heading = dark ? "text-gray-100"               : "text-gray-900";
  const muted   = dark ? "text-gray-400"               : "text-gray-500";
  const chip    = dark ? "bg-gray-800 text-gray-400"   : "bg-gray-100 text-gray-500";

  return (
    <div className={`rounded-3xl border p-6 shadow-sm  transition-all duration-300 flex flex-col gap-2 ${card}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${muted}`}>{title}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${chip}`}>{tag}</span>
      </div>
      <div className={`text-xl font-semibold ${heading}`}>{value}</div>
      <div className={`text-xs flex gap-1 ${warning ? "text-amber-400" : "text-emerald-500"}`}>
        <span>{trend}</span>
        <span className={dark ? "text-gray-500" : "text-gray-400"}>{note}</span>
      </div>
    </div>
  );
}