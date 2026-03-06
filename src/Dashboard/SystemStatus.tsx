import { SYSTEM_SERVICES } from "./constants";
import './travelsync-design-system.css'
interface SystemStatusProps { dark: boolean; }

export default function SystemStatus({ dark: _ }: SystemStatusProps) {
  return (
    <div className="ts-card" style={{ padding: "1.5rem" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="ts-td-h text-sm font-semibold">System status</div>
          <div className="ts-faint text-xs">Live health &amp; capacity</div>
        </div>
        <button className="ts-link">Open status page</button>
      </div>

      <div className="flex flex-col gap-3">
        {SYSTEM_SERVICES.map((s) => (
          <div key={s.label} className="ts-service-row">
            <span>{s.label}</span>
            <span className={`ts-pill text-xs font-medium ${s.ok ? "ts-status-ok" : "ts-status-warn"}`}>
              {s.status}
            </span>
          </div>
        ))}

        <div className="mt-2">
          <div className="ts-service-row mb-1.5">
            <span>Infrastructure usage</span>
            <span>68% of capacity</span>
          </div>
          <div className="ts-usage-track">
            <div className="ts-usage-bar" style={{ width: "68%" }} />
          </div>
        </div>

        <p className="ts-faint text-xs mt-2">
          Tip: use the help center to contact support or open incidents directly from here.
        </p>
      </div>
    </div>
  );
}