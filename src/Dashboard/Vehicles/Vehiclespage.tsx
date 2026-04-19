import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import "../travelsync-design-system.css";
import apiClient from "../../api/apiClient";
import { mapBackendVehicle, INITIAL_VEHICLES } from "./types";
import type { Vehicle, VehiclesPageProps } from "./types";
import SearchRoundedIcon  from "@mui/icons-material/SearchRounded";
import StatCards          from "./components/StatCards";
import Pagination         from "./components/Pagination";
import RemoveModal        from "./components/RemoveModal";
import ChangeStatusModal  from "./components/ChangeStatusModal";
import VehicleTableRow    from "./components/VehicleTableRow";
import UpdatePhotoModal   from "./UpdatePhotoModal";

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
  padding: "0 1rem", height: ROW_H, fontSize: ".875rem", fontWeight: 600, color: "var(--text-body)",
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
  const [photoTarget,   setPhotoTarget]   = useState<Vehicle | null>(null);
  const [error,         setError]         = useState<string | null>(null);

  function loadVehicles() {
    setLoading(true);
    setError(null);
    apiClient.get("/vehicles")
      .then(async res => {
        const raw = res.data;
        const list: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data) ? raw.data
          : Array.isArray(raw?.vehicles) ? raw.vehicles
          : [];

        // ✅ FIX: correct endpoint /drivers not /admin/drivers
        const driverMap = new Map<string, string>();
        const driverIds = [...new Set(list.map((v: any) => v.driverId).filter(Boolean))] as string[];

        if (driverIds.length > 0) {
          try {
            const drRes  = await apiClient.get("/drivers", { params: { limit: 200 } });
            const drRaw  = drRes.data;
            const drList: any[] = Array.isArray(drRaw) ? drRaw : (drRaw?.data ?? []);
            for (const d of drList) {
              const name = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim();
              if (d.id && name) driverMap.set(d.id, name);
            }
          } catch { /* cosmetic — fail silently */ }
        }

        setVehicles(list.map((v: any) => mapBackendVehicle(v, driverMap)));
      })
      .catch(() => setError("Failed to load vehicles. Check your connection."))
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
    const className = v.vehicleClass?.name ?? "";
    return matchStatus && (!q
      || `${v.make} ${v.model}`.toLowerCase().includes(q)
      || v.driver?.toLowerCase().includes(q)
      || className.toLowerCase().includes(q)
      || String(v.year).includes(q));
  }), [vehicles, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  async function handleRemove() {
    if (!removeTarget) return;
    setRemoveLoading(true);
    try {
      await apiClient.delete(`/vehicles/${removeTarget.id}`);
      setVehicles(p => p.filter(v => v.id !== removeTarget.id));
      setRemoveTarget(null);
      toast.success("Vehicle removed");
    } catch {
      toast.error("Failed to remove vehicle");
    } finally { setRemoveLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {removeTarget && (
        <RemoveModal loading={removeLoading} onConfirm={handleRemove}
          onClose={() => setRemoveTarget(null)} />
      )}
      {statusTarget && (
        <ChangeStatusModal vehicle={statusTarget} onClose={() => setStatusTarget(null)}
          onUpdated={u => { setVehicles(p => p.map(v => v.id === u.id ? u : v)); setStatusTarget(null); }} />
      )}
      {photoTarget && (
        <UpdatePhotoModal vehicle={photoTarget} onClose={() => setPhotoTarget(null)}
          onUploaded={u => { setVehicles(p => p.map(v => v.id === u.id ? u : v)); setPhotoTarget(null); }} />
      )}

      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>Vehicles</h1>
          <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-muted)" }}>
            Manage your fleet vehicles
          </p>
        </div>
        <button
          onClick={() => onNavigate("agency-vehicles", null)}
          style={{
            background: "#7c3aed", color: "#fff", border: "none",
            borderRadius: 8, padding: "8px 18px", fontSize: ".82rem",
            fontWeight: 600, cursor: "pointer",
          }}
        >
          + Add Vehicle
        </button>
      </div>

      <StatCards total={total} available={available} pending={pending}
        onTrip={onTrip} maintenance={maintenance} />

      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setActiveFilter(t.key); setPage(1); }}
              style={{
                padding: ".3rem .85rem", borderRadius: "9999px",
                fontSize: ".82rem", fontWeight: 600,
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
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
            Loading vehicles…
          </div>
        ) : error ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444", fontSize: ".85rem" }}>
            {error}{" "}
            <button onClick={loadVehicles} style={{
              marginLeft: 8, textDecoration: "underline", cursor: "pointer",
              background: "none", border: "none", color: "inherit",
            }}>Retry</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "24%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "9%"  }} />
                <col style={{ width: "9%"  }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "16%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Class</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Year</th>
                  <th style={TH}>Seats</th>
                  <th style={TH}>Driver</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr style={{ height: ROW_H }}>
                    <td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                      No vehicles found{search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                ) : (
                  paged.map(v => (
                    <VehicleTableRow key={v.id} v={v}
                      onEdit={vehicle => onNavigate("agency-vehicles", vehicle)}
                      onStatusChange={vehicle => setStatusTarget(vehicle)}
                      onRemove={vehicle => setRemoveTarget(vehicle)}
                      onUpdatePhotos={vehicle => setPhotoTarget(vehicle)}
                    />
                  ))
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