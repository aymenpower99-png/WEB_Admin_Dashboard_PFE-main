import { SYSTEM_SERVICES } from "./constants";

interface SystemStatusProps {
  dark: boolean;
}

interface ServiceRowProps {
  label: string;
  status: string;
  ok: boolean;
  dark: boolean;
}

interface UsageBarProps {
  usage: number;
  dark: boolean;
}

export default function SystemStatus({ dark }: SystemStatusProps) {
  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm  transition-all duration-300 ${
        dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>
            System status
          </div>
          <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Live health &amp; capacity
          </div>
        </div>
        <button className="text-xs font-medium text-purple-500 hover:text-purple-400">
          Open status page
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {SYSTEM_SERVICES.map((s) => (
          <ServiceRow key={s.label} {...s} dark={dark} />
        ))}

        <UsageBar usage={68} dark={dark} />

        <p className={`text-xs mt-2 ${dark ? "text-gray-600" : "text-gray-400"}`}>
          Tip: use the help center to contact support or open incidents directly from here.
        </p>
      </div>
    </div>
  );
}

function ServiceRow({ label, status, ok, dark }: ServiceRowProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={dark ? "text-gray-400" : "text-gray-500"}>{label}</span>
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          ok ? "bg-emerald-500 text-white" : "bg-amber-400 text-gray-900"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function UsageBar({ usage, dark }: UsageBarProps) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className={dark ? "text-gray-400" : "text-gray-500"}>
          Infrastructure usage
        </span>
        <span className={dark ? "text-gray-400" : "text-gray-500"}>
          {usage}% of capacity
        </span>
      </div>
      <div
        className={`w-full h-1.5 rounded-full overflow-hidden ${
          dark ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${usage}%`,
            background: "linear-gradient(90deg,#a855f7,#7c3aed)",
          }}
        />
      </div>
    </div>
  );
}