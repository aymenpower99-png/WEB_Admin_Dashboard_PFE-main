import { useEffect, useState } from "react";
import { C, getBatteryColor, getStatusStyle } from "./tokens";
import type { Vehicle } from ".";
import { fetchFleetData, fetchVehicleStats } from "./mockData";

interface FleetTableProps {
  dark: boolean;
}

export function FleetTable({ dark }: FleetTableProps) {
  const [fleetData, setFleetData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const load = async () => {
    try {
      const [fleet] = await Promise.all([
        fetchFleetData(),
        fetchVehicleStats(),
      ]);
      setFleetData(fleet);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalPages = Math.ceil(fleetData.length / rowsPerPage);
  const rows = fleetData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const headers = ["Vehicle ID", "Model", "Status", "Battery/Fuel"];

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
                const globalIndex = (page - 1) * rowsPerPage + i;
                return (
                  <tr key={v.id}
                    style={{ borderBottom: i < rows.length - 1 ? `1px solid ${border}` : "none", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "rgba(168,85,247,.04)" : "rgba(168,85,247,.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, fontWeight: 500, color: C.primaryPurple }}>
                        VH-{String(globalIndex + 1).padStart(3, "0")}
                      </span>
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
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ width: 80, height: 5, borderRadius: 3,
                        background: dark ? C.darkBorder : C.grayE6, overflow: "hidden", marginBottom: 3 }}>
                        <div style={{ width: `${v.battery}%`, height: "100%", background: batColor,
                          borderRadius: 3, transition: "width .6s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: batColor }}>{v.battery}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-3 border-t" style={{ borderColor: border }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              color: page === 1 ? sub : text,
              background: dark ? C.darkBorder : C.grayE6,
              opacity: page === 1 ? 0.5 : 1,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-7 h-7 rounded text-xs font-semibold"
              style={{
                background: p === page ? C.primaryPurple : dark ? C.darkBorder : C.grayE6,
                color: p === page ? "#fff" : text,
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              color: page === totalPages ? sub : text,
              background: dark ? C.darkBorder : C.grayE6,
              opacity: page === totalPages ? 0.5 : 1,
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}