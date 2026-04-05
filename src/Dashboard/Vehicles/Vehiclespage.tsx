// ============================================================
// FILE: VehiclesPage.tsx
// PATH: src/Dashboard/Vehicles/VehiclesPage.tsx
// ============================================================

import { useState, useEffect } from "react";
import SearchRoundedIcon            from "@mui/icons-material/SearchRounded";
import EditRoundedIcon               from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon      from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon                from "@mui/icons-material/AddRounded";
import AddPhotoAlternateRoundedIcon  from "@mui/icons-material/AddPhotoAlternateRounded";
import ChangeCircleRoundedIcon       from "@mui/icons-material/ChangeCircleRounded";

import apiClient          from "../../api/apiClient";
import { mapBackendVehicle, INITIAL_VEHICLES } from "./types";
import type { Vehicle, VehiclesPageProps }     from "./types";
import StatusPill                              from "./components/StatusPill";
import ClassBadge                              from "./components/ClassBadge";
import StatCards                               from "./components/StatCards";
import Pagination                              from "./components/Pagination";
import RemoveModal                             from "./components/RemoveModal";
import ChangeStatusModal                       from "./components/ChangeStatusModal";
import UpdatePhotoModal                        from "./UpdatePhotoModal";

export { INITIAL_VEHICLES, mapBackendVehicle };
export type { Vehicle, VehiclesPageProps };

const ROWS  = 5;
const LIMIT = 5;
const ROW_H = 88;

type FilterKey = "all" | Vehicle["status"];

export default function VehiclesPage({ vehicles, setVehicles, onNavigate }: VehiclesPageProps) {
  const [filter,       setFilter]       = useState<FilterKey>("all");
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [fetchError,   setFetchError]   = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Vehicle | null>(null);
  const [removing,     setRemoving]     = useState(false);
  const [photoTarget,  setPhotoTarget]  = useState<Vehicle | null>(null);
  const [statusTarget, setStatusTarget] = useState<Vehicle | null>(null);

  /* ── Fetch ── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setFetchError(null);
      try {
        const sp  = filter !== "all" ? `&status=${filter}` : "";
        const res = await apiClient.get<{ data: any[]; total: number }>(
          `/vehicles?page=${page}&limit=${LIMIT}${sp}`
        );
        if (cancelled) return;
        setVehicles(res.data.data.map(mapBackendVehicle));
        setTotalCount(res.data.total);
      } catch {
        if (!cancelled) setFetchError("Failed to load vehicles.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page, filter, setVehicles]);

  /* ── Delete — any status ── */
  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await apiClient.delete(`/vehicles/${removeTarget.id}`);
      setVehicles(prev => prev.filter(v => v.id !== removeTarget.id));
      setTotalCount(c => Math.max(0, c - 1));
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to remove vehicle.";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setRemoving(false);
      setRemoveTarget(null);
    }
  };

  const counts = {
    available:   vehicles.filter(v => v.status === "Available").length,
    pending:     vehicles.filter(v => v.status === "Pending").length,
    maintenance: vehicles.filter(v => v.status === "Maintenance").length,
    onTrip:      vehicles.filter(v => v.status === "On_Trip").length,
  };

  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase();
    return !q
      || `${v.make} ${v.model}`.toLowerCase().includes(q)
      || (v.driver ?? "").toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));
  const ghostCount = Math.max(0, ROWS - filtered.length);

  const TH: React.CSSProperties = {
    padding: "0.75rem 1.25rem",
    fontSize: ".78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: ".07em",
    color: "#111827",
    textAlign: "left",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
    background: "var(--bg-card)",
  };

  const TD: React.CSSProperties = {
    padding: "0 1.25rem",
    height: ROW_H,
    fontSize: ".88rem",
    color: "var(--text-body)",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  };

  return (
    <>
      {/* Modals */}
      {removeTarget && (
        <RemoveModal
          loading={removing}
          onConfirm={handleRemoveConfirm}
          onClose={() => !removing && setRemoveTarget(null)}
        />
      )}
      {photoTarget && (
        <UpdatePhotoModal
          vehicle={photoTarget}
          onClose={() => setPhotoTarget(null)}
          onUploaded={v => {
            setVehicles(prev => prev.map(x => x.id === v.id ? v : x));
            setPhotoTarget(null);
          }}
        />
      )}
      {statusTarget && (
        <ChangeStatusModal
          vehicle={statusTarget}
          onClose={() => setStatusTarget(null)}
          onUpdated={v => {
            setVehicles(prev => prev.map(x => x.id === v.id ? v : x));
            setStatusTarget(null);
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* ── Header ── */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Vehicles</h1>
          </div>
          <button className="ts-btn-primary" onClick={() => onNavigate("agency-vehicles", null)}>
            <AddRoundedIcon style={{ fontSize: 15 }} /> Add Vehicle
          </button>
        </div>

        {/* ── Stat cards ── */}
        <StatCards
          total={totalCount}
          available={counts.available}
          pending={counts.pending}
          maintenance={counts.maintenance}
          onTrip={counts.onTrip}
        />

        {/* ── Filter bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: ".35rem" }}>
            {(["all", "Available", "Pending", "On_Trip", "Maintenance"] as const).map(k => (
              <button
                key={k}
                onClick={() => { setFilter(k); setPage(1); }}
                style={{
                  padding: ".3rem .85rem",
                  borderRadius: "9999px",
                  fontSize: ".82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  background: filter === k ? "#7c3aed" : "var(--bg-inner)",
                  color: filter === k ? "#fff" : "var(--text-muted)",
                  transition: "all .15s",
                }}
              >
                {k === "all" ? "All" : k === "On_Trip" ? "On Trip" : k}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div className="ts-search-bar" style={{ minWidth: 240 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search make, model or driver…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {fetchError && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: ".875rem",
          }}>
            {fetchError}
            <button onClick={() => { setPage(1); setFilter("all"); }} style={{
              marginLeft: "1rem", fontWeight: 700, textDecoration: "underline",
              background: "none", border: "none", color: "#ef4444", cursor: "pointer",
            }}>Retry</button>
          </div>
        )}

        {/* ── Table ── */}
        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                {/* Vehicle */}
                <col style={{ width: "22%" }} />
                {/* Year */}
                <col style={{ width: "8%" }} />
                {/* Status */}
                <col style={{ width: "13%" }} />
                {/* Color */}
                <col style={{ width: "9%" }} />
                {/* Class */}
                <col style={{ width: "12%" }} />
                {/* Seats */}
                <col style={{ width: "6%" }} />
                {/* Driver */}
                <col style={{ width: "12%" }} />
                {/* Actions */}
                <col style={{ width: "18%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Year</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Color</th>
                  <th style={TH}>Class</th>
                  <th style={TH}>Seats</th>
                  <th style={TH}>Driver</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={8} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        Loading vehicles…
                      </td>
                    </tr>
                    {Array.from({ length: ROWS - 1 }).map((_, i) => (
                      <tr key={`l-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={8} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                ) : filtered.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={8} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No vehicles found.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={8} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {filtered.map(v => {
                      // "Add Photos" button: only Pending vehicles that have NO photos yet
                      const needsPhoto =
                        v.status === "Pending" &&
                        !(Array.isArray(v.photos) && v.photos.length > 0);

                      // "Change Status" button: ONLY when status is Available or Maintenance
                      // - Pending  → hidden (vehicle auto-promotes when photos+driver are set)
                      // - On_Trip  → hidden (trip system controls this)
                      const canChange =
                        v.status === "Available" || v.status === "Maintenance";

                      return (
                        <tr key={v.id} className="ts-tr" style={{ height: ROW_H }}>

                          {/* Vehicle */}
                          <td style={{ ...TD, overflow: "hidden" }}>
                            <p style={{
                              margin: 0, fontWeight: 700,
                              color: "var(--text-h)", fontSize: ".88rem",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {v.make} {v.model}
                            </p>
                          </td>

                          {/* Year */}
                          <td style={{ ...TD, color: "var(--text-muted)", fontWeight: 500 }}>
                            {v.year}
                          </td>

                          {/* Status */}
                          <td style={TD}>
                            <StatusPill status={v.status} />
                          </td>

                          {/* Color */}
                          <td style={{ ...TD, color: "var(--text-body)" }}>
                            {v.color || "—"}
                          </td>

                          {/* Class */}
                          <td style={TD}>
                            <ClassBadge vehicleClass={v.vehicleClass} />
                          </td>

                          {/* Seats */}
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>
                            {v.seats ?? "—"}
                          </td>

                          {/* Driver */}
                          <td style={{
                            ...TD,
                            color: "var(--text-muted)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {v.driver || "—"}
                          </td>

                          {/* Actions */}
                          <td style={TD}>
                            <div style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>

                              {/* Edit — always shown */}
                              <button
                                title="Edit"
                                className="ts-icon-btn"
                                onClick={() => onNavigate("agency-vehicles", v)}
                                style={{
                                  width: 32, height: 32, display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                  borderRadius: ".375rem",
                                }}
                              >
                                <EditRoundedIcon style={{ fontSize: 16 }} />
                              </button>

                              {/* Add Photos — amber, only Pending + no photos */}
                              {needsPhoto && (
                                <button
                                  title="Add Photos"
                                  onClick={() => setPhotoTarget(v)}
                                  style={{
                                    width: 32, height: 32, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    borderRadius: ".375rem", cursor: "pointer",
                                    background: "#fef3c7", border: "1px solid #f59e0b55",
                                    color: "#b45309",
                                  }}
                                >
                                  <AddPhotoAlternateRoundedIcon style={{ fontSize: 16 }} />
                                </button>
                              )}

                              {/* Change Status — purple, ONLY Available or Maintenance */}
                              {canChange && (
                                <button
                                  title="Change Status"
                                  onClick={() => setStatusTarget(v)}
                                  style={{
                                    width: 32, height: 32, display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    borderRadius: ".375rem", cursor: "pointer",
                                    background: "#ede9fe", border: "1px solid #c4b5fd",
                                    color: "#6d28d9",
                                  }}
                                >
                                  <ChangeCircleRoundedIcon style={{ fontSize: 16 }} />
                                </button>
                              )}

                              {/* Delete — always shown, works for any status */}
                              <button
                                title="Remove"
                                className="ts-icon-btn ts-icon-btn-del"
                                onClick={() => setRemoveTarget(v)}
                                style={{
                                  width: 32, height: 32, display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                  borderRadius: ".375rem",
                                }}
                              >
                                <DeleteOutlineRoundedIcon style={{ fontSize: 16 }} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Ghost rows — keep table height stable */}
                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={8} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            setPage={setPage}
          />
        </div>

      </div>
    </>
  );
}