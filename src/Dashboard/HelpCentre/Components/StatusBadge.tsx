interface StatusBadgeProps {
  type: "status" | "role" | "category";
  value: string;
  dark?: boolean;
}

const STATUS_CLASSES: Record<string, { light: string; dark: string }> = {
  "Open":        { light: "bg-slate-100 text-slate-600",     dark: "bg-slate-800 text-slate-400" },
  "In Progress": { light: "bg-violet-100 text-violet-700",   dark: "bg-violet-900/40 text-violet-400" },
  "Pending":     { light: "bg-amber-100 text-amber-700",     dark: "bg-amber-900/30 text-amber-400" },
  "Resolved":    { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-900/30 text-emerald-400" },
};

const ROLE_CLASSES: Record<string, { light: string; dark: string }> = {
  "Passenger": { light: "bg-purple-100 text-purple-700", dark: "bg-purple-900/40 text-purple-300" },
  "Driver":    { light: "bg-indigo-100 text-indigo-700", dark: "bg-indigo-900/40 text-indigo-300" },
};

const CATEGORY_CLASSES: Record<string, { light: string; dark: string }> = {
  "Ride":      { light: "bg-cyan-100 text-cyan-700",       dark: "bg-cyan-900/30 text-cyan-400" },
  "Payment":   { light: "bg-fuchsia-100 text-fuchsia-700", dark: "bg-fuchsia-900/30 text-fuchsia-400" },
  "Account":   { light: "bg-violet-100 text-violet-700",   dark: "bg-violet-900/40 text-violet-400" },
  "Technical": { light: "bg-indigo-100 text-indigo-700",   dark: "bg-indigo-900/40 text-indigo-400" },
  "App Bug":   { light: "bg-orange-100 text-orange-700",   dark: "bg-orange-900/30 text-orange-400" },
};

export default function StatusBadge({ type, value, dark = false }: StatusBadgeProps) {
  let map: Record<string, { light: string; dark: string }>;
  if (type === "status") map = STATUS_CLASSES;
  else if (type === "role") map = ROLE_CLASSES;
  else map = CATEGORY_CLASSES;

  const classes = map[value] ?? { light: "bg-slate-100 text-slate-500", dark: "bg-slate-800 text-slate-400" };
  const cls = dark ? classes.dark : classes.light;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}