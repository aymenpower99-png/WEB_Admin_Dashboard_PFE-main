import { useEffect, useState } from "react";
import { ChevronRight, MoreVertical, RefreshCw } from "lucide-react";
import { C, getBatteryColor, getStatusStyle } from "./tokens";
import type { Vehicle } from ".";
import { fetchFleetData, fetchVehicleStats, type VehicleStats } from "./mockData";

interface FleetTableProps {
  dark: boolean;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FleetTable({ dark, showAll, setShowAll }: FleetTableProps) {
  const [fleetData, setFleetData] = useState<Vehicle[]>([]);
  const [stats, setStats]         = useState<VehicleStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [fleet, vehicleStats] = await Promise.all([
        fetchFleetData(),
        fetchVehicleStats(),
      ]);
      setFleetData(fleet);
      setStats(vehicleStats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    load();
  };

  const rows = showAll ? fleetData : fleetData.slice(0, 5);
  const headers = ["Vehicle ID", "Model", "Status", "Driver", "Location", "Battery/Fuel", "Actions"];

  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  return (
    <div className="rounded-xl border" style={{ background: surface, borderColor: border }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Fleet Monitoring</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.primaryPurple }}>
            {fleetData.length} Units
          </span>
          {stats && (
            <div className="flex items-center gap-2 ml-2">
              {[
                { label: "Active",    value: stats.approved,  color: C.success  },
                { label: "Pending",   value: stats.pending,   color: C.warning  },
                { label: "Suspended", value: stats.suspended, color: C.error    },
              ].map(({ label, value, color }) => (
                <span key={label} className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: `${color}18`, fontSize: 10, fontWeight: 700, color }}>
                  {label}: {value}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh}
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border"
            style={{ color: sub, borderColor: border, background: "transparent" }}>
            <RefreshCw size={11} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: C.primaryPurple }}>
            View All <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: sub }}>Loading fleet data…</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {headers.map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 12px 8px",
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: sub }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => {
                const { bg, text: statusText } = getStatusStyle(v.status);
                const batColor = getBatteryColor(v.battery);
                return (
                  <tr key={v.id}
                    style={{ borderBottom: i < rows.length - 1 ? `1px solid ${border}` : "none", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "rgba(168,85,247,.04)" : "rgba(168,85,247,.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, fontWeight: 500, color: C.primaryPurple }}>{v.id}</span>
                    </td>
                                          <td style={{ padding: "10px 12px" }}>
  <span style={{ fontSize: 12, color: text }}>{v.modele}</span>
</td>

                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.05em", padding: "2px 8px", borderRadius: 4, background: bg, color: statusText }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12,
                      color: v.driver ? text : sub, fontStyle: v.driver ? "normal" : "italic" }}>
                      {v.driver ?? "Unassigned"}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: sub }}>{v.location}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ width: 80, height: 5, borderRadius: 3,
                        background: dark ? C.darkBorder : C.grayE6, overflow: "hidden", marginBottom: 3 }}>
                        <div style={{ width: `${v.battery}%`, height: "100%", background: batColor,
                          borderRadius: 3, transition: "width .6s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: batColor }}>{v.battery}%</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ color: sub, background: "none", border: "none", cursor: "pointer" }}>
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => setShowAll((p) => !p)}
        className="w-full py-3 border-t text-xs font-semibold tracking-widest uppercase transition-colors"
        style={{ borderColor: border, color: sub, background: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.primaryPurple)}
        onMouseLeave={(e) => (e.currentTarget.style.color = sub)}>
        {showAll ? "Show Less" : `See All ${fleetData.length} Vehicles`}
      </button>
    </div>
  );
}