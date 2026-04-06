import { useState, useEffect, useMemo } from "react";
import "../travelsync-design-system.css";
import apiClient from "../../api/apiClient";
import { mapBackendVehicle, INITIAL_VEHICLES } from "./types";
import type { Vehicle, VehiclesPageProps } from "./types";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StatCards         from "./components/StatCards";
import Pagination        from "./components/Pagination";
import RemoveModal       from "./components/RemoveModal";
import ChangeStatusModal from "./components/ChangeStatusModal";
import VehicleTableRow   from "./components/VehicleTableRow";
import UpdatePhotoModal  from "./UpdatePhotoModal"; // ✅

export { INITIAL_VEHICLES, mapBackendVehicle };
export type { Vehicle, VehiclesPageProps };

const ROWS_PER_PAGE = 5;
const ROW_H = 88;

const TH: React.CSSProperties = {
  padding: "0.65rem 1rem", fontSize: ".78rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-body)", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--bg-thead)",
};
const TD: React.CSSProperties = {
  padding: "0 1rem", height: ROW_H, fontSize: ".875rem", color: "var(--text-body)",
  borderBottom: "1px solid var(--border)", verticalAlign: "middle",
};

type FilterTab = "All" | "Available" | "Pending" | "On_Trip" | "Maintenance";
const TABS: { key: FilterTab; label: string }[] = [
  { key: "All",         label: "All"         },
  { key: "Available",   label: "Available"   },
  { key: "Pending",     label: "Pending"     },
  { key: "On_Trip",     label: "On Trip"     },
  { key: "Maintenance", label: "Maintenance" },
];

export default function VehiclesPage({ vehicles, setVehicles, onNavigate }: VehiclesPageProps) {
  const [loading,       setLoading]       = useState(false);
  const [search,        setSearch]        = useState("");
  const [activeFilter,  setActiveFilter]  = useState<FilterTab>("All");
  const [page,          setPage]          = useState(1);
  const [removeTarget,  setRemoveTarget]  = useState<Vehicle | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [statusTarget,  setStatusTarget]  = useState<Vehicle | null>(null);
  const [photoTarget,   setPhotoTarget]   = useState<Vehicle | null>(null); // ✅

  function loadVehicles() {
    setLoading(true);
    apiClient.get("/vehicles")
      .then(async res => {
        const list: any[] = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data?.vehicles ?? []);

        // ✅ Build driverId → "First Last" map
        const driverMap = new Map<string, string>();
        const driverIds = [...new Set(list.map((v: any) => v.driverId).filter(Boolean))] as string[];
        if (driverIds.length > 0) {
          try {
            const drRes  = await apiClient.get("/drivers", { params: { limit: 200 } });
            const drList: any[] = Array.isArray(drRes.data) ? drRes.data : (drRes.data?.data ?? []);
            for (const d of drList) {
              if (d.id && (d.firstName || d.lastName))
                driverMap.set(d.id, `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim());
            }
          } catch { /* cosmetic */ }
        }
        setVehicles(list.map((v: any) => mapBackendVehicle(v, driverMap)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadVehicles(); }, []);

  const total       = vehicles.length;
  const available   = vehicles.filter(v => v.status === "Available").length;
  const pending     = vehicles.filter(v => v.status === "Pending").length;
  const onTrip      = vehicles.filter(v => v.status === "On_Trip").length;
  const maintenance = vehicles.filter(v => v.status === "Maintenance").length;

  const filtered = useMemo(() => vehicles.filter(v => {
    const matchStatus = activeFilter === "All" || v.status === activeFilter;
    const q = search.toLowerCase();
    return matchStatus && (!q
      || `${v.make} ${v.model}`.toLowerCase().includes(q)
      || v.driver?.toLowerCase().includes(q)
      || v.vehicleClass?.toLowerCase().includes(q)
      || String(v.year).includes(q));
  }), [vehicles, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const ghostCount = ROWS_PER_PAGE - paged.length;

  async function handleRemove() {
    if (!removeTarget) return;
    setRemoveLoading(true);
    try {
      await apiClient.delete(`/vehicles/${removeTarget.id}`);
      setVehicles(p => p.filter(v => v.id !== removeTarget.id));
      setRemoveTarget(null);
    } catch { } finally { setRemoveLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* ── Modals ── */}
      {removeTarget && <RemoveModal loading={removeLoading} onConfirm={handleRemove} onClose={() => setRemoveTarget(null)} />}
      {statusTarget && (
        <ChangeStatusModal vehicle={statusTarget} onClose={() => setStatusTarget(null)}
          onUpdated={u => { setVehicles(p => p.map(v => v.id === u.id ? u : v)); setStatusTarget(null); }} />
      )}
      {/* ✅ Photo modal */}
      {photoTarget && (
        <UpdatePhotoModal vehicle={photoTarget} onClose={() => setPhotoTarget(null)}
          onUploaded={u => { setVehicles(p => p.map(v => v.id === u.id ? u : v)); setPhotoTarget(null); }} />
      )}

      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>Vehicles</h1>
        </div>
        <button className="ts-btn-primary" onClick={() => onNavigate("agency-vehicles", null)}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span> Add Vehicle
        </button>
      </div>

      <StatCards total={total} available={available} pending={pending} onTrip={onTrip} maintenance={maintenance} />

      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setActiveFilter(t.key); setPage(1); }} style={{
              padding: ".3rem .85rem", borderRadius: "9999px", fontSize: ".82rem", fontWeight: 600,
              cursor: "pointer", border: "none",
              background: activeFilter === t.key ? "#7c3aed" : "var(--bg-inner)",
              color:      activeFilter === t.key ? "#fff"    : "var(--text-muted)",
              transition: "all .15s",
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div className="ts-search-bar" style={{ minWidth: 240 }}>
            <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
            <input placeholder="Search vehicles…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>
      </div>

      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>Loading vehicles…</div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "20%" }} /><col style={{ width: "12%" }} /><col style={{ width: "11%" }} />
                <col style={{ width: "8%" }}  /><col style={{ width: "8%" }}  /><col style={{ width: "15%" }} />
                <col style={{ width: "26%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Vehicle</th><th style={TH}>Class</th><th style={TH}>Status</th>
                  <th style={TH}>Year</th><th style={TH}>Seats</th><th style={TH}>Driver</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No vehicles found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS_PER_PAGE - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                    ))}
                  </>
                ) : (
                  <>
                    {paged.map(v => (
                      <VehicleTableRow key={v.id} v={v}
                        onEdit={vehicle => onNavigate("agency-vehicles", vehicle)}
                        onStatusChange={vehicle => setStatusTarget(vehicle)}
                        onRemove={vehicle => setRemoveTarget(vehicle)}
                        onUpdatePhotos={vehicle => setPhotoTarget(vehicle)} // ✅
                      />
                    ))}
                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={safePage} totalPages={totalPages}
          onPrev={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          setPage={setPage} />
      </div>
    </div>
  );
}