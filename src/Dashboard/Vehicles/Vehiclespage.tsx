import { useState, useEffect, useMemo } from "react";
import "../travelsync-design-system.css";
import apiClient from "../../api/apiClient";
import { mapBackendVehicle, INITIAL_VEHICLES } from "./types";
import type { Vehicle, VehiclesPageProps } from "./types";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import StatCards         from "./components/StatCards";
import StatusPill        from "./components/StatusPill";
import ClassBadge        from "./components/ClassBadge";
import Pagination        from "./components/Pagination";
import RemoveModal       from "./components/RemoveModal";
import ChangeStatusModal from "./components/ChangeStatusModal";

export { INITIAL_VEHICLES, mapBackendVehicle };
export type { Vehicle, VehiclesPageProps };

const ROWS_PER_PAGE = 5;
const ROW_H = 88;

const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
  fontSize: ".78rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-body)", textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap", background: "var(--bg-thead)",
};

const TD: React.CSSProperties = {
  padding: "0 1rem", height: ROW_H,
  fontSize: ".875rem", color: "var(--text-body)",
  borderBottom: "1px solid var(--border)", verticalAlign: "middle",
};

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconSync = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

// ── Reusable action button ────────────────────────────────────────────────────
const BTN_BASE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 30, height: 30, borderRadius: 7,
  borderWidth: "1px", borderStyle: "solid",
  borderColor: "var(--border)",
  background: "var(--bg-card)",
  color: "var(--text-muted)",
  cursor: "pointer", flexShrink: 0,
  transition: "all .15s", padding: 0,
};

function ActionBtn({ title, onClick, hoverStyle, children, loading }: {
  title: string; onClick: () => void;
  hoverStyle: React.CSSProperties;
  children: React.ReactNode;
  loading?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={loading}
      style={{ ...BTN_BASE, ...(hovered ? hoverStyle : {}), opacity: loading ? 0.5 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

type FilterTab = "All" | "Available" | "Pending" | "On_Trip" | "Maintenance";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "All",         label: "All"         },
  { key: "Available",   label: "Available"   },
  { key: "Pending",     label: "Pending"     },
  { key: "On_Trip",     label: "On Trip"     },
  { key: "Maintenance", label: "Maintenance" },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function VehiclesPage({ vehicles, setVehicles, onNavigate }: VehiclesPageProps) {
  const [loading,       setLoading]       = useState(false);
  const [search,        setSearch]        = useState("");
  const [activeFilter,  setActiveFilter]  = useState<FilterTab>("All");
  const [page,          setPage]          = useState(1);
  const [removeTarget,  setRemoveTarget]  = useState<Vehicle | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [statusTarget,  setStatusTarget]  = useState<Vehicle | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  function loadVehicles() {
    setLoading(true);
    apiClient.get("/vehicles")
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data?.vehicles ?? []);
        setVehicles(list.map(mapBackendVehicle));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(() => { loadVehicles(); }, []);

  // ── KPI counts ─────────────────────────────────────────────────────────────
  const total       = vehicles.length;
  const available   = vehicles.filter(v => v.status === "Available").length;
  const pending     = vehicles.filter(v => v.status === "Pending").length;
  const onTrip      = vehicles.filter(v => v.status === "On_Trip").length;
  const maintenance = vehicles.filter(v => v.status === "Maintenance").length;

  // ── Filter + search ────────────────────────────────────────────────────────
  const filtered = useMemo(() => vehicles.filter(v => {
    const matchStatus = activeFilter === "All" || v.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || `${v.make} ${v.model}`.toLowerCase().includes(q)
      || v.driver?.toLowerCase().includes(q)
      || v.vehicleClass?.toLowerCase().includes(q)
      || String(v.year).includes(q);
    return matchStatus && matchSearch;
  }), [vehicles, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const ghostCount = ROWS_PER_PAGE - paged.length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleRemove() {
    if (!removeTarget) return;
    setRemoveLoading(true);
    try {
      await apiClient.delete(`/vehicles/${removeTarget.id}`);
      setVehicles(p => p.filter(v => v.id !== removeTarget.id));
      setRemoveTarget(null);
    } catch { /* ignore */ } finally {
      setRemoveLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* ── Modals ── */}
      {removeTarget && (
        <RemoveModal
          loading={removeLoading}
          onConfirm={handleRemove}
          onClose={() => setRemoveTarget(null)}
        />
      )}
      {statusTarget && (
        <ChangeStatusModal
          vehicle={statusTarget}
          onClose={() => setStatusTarget(null)}
          onUpdated={updated => {
            setVehicles(p => p.map(v => v.id === updated.id ? updated : v));
            setStatusTarget(null);
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>Vehicles</h1>
        </div>
        <button className="ts-btn-primary" onClick={() => onNavigate("agency-vehicles", null)}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span> Add Vehicle
        </button>
      </div>

      {/* ── KPI cards ── */}
      <StatCards
        total={total}
        available={available}
        pending={pending}
        onTrip={onTrip}
        maintenance={maintenance}
      />

      {/* ── Filter bar + search ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setActiveFilter(t.key); setPage(1); }}
              style={{
                padding: ".3rem .85rem", borderRadius: "9999px",
                fontSize: ".82rem", fontWeight: 600,
                cursor: "pointer", border: "none",
                background: activeFilter === t.key ? "#7c3aed" : "var(--bg-inner)",
                color:      activeFilter === t.key ? "#fff"    : "var(--text-muted)",
                transition: "all .15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div className="ts-search-bar" style={{ minWidth: 240 }}>
            <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
            <input
              placeholder="Search vehicles…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
            Loading vehicles…
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              {/* ⚠️ No whitespace/comments between <col> tags — fixes hydration warning */}
              <colgroup><col style={{ width: "22%" }} /><col style={{ width: "13%" }} /><col style={{ width: "12%" }} /><col style={{ width: "9%" }} /><col style={{ width: "9%" }} /><col style={{ width: "16%" }} /><col style={{ width: "19%" }} /></colgroup>
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
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No vehicles found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS_PER_PAGE - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {paged.map(v => (
                      <tr key={v.id} className="ts-tr" style={{ height: ROW_H }}>

                        {/* Vehicle make + model */}
                        <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.make} {v.model}
                        </td>

                        {/* Class */}
                        <td style={TD}>
                          <ClassBadge vehicleClass={v.vehicleClass} />
                        </td>

                        {/* Status */}
                        <td style={TD}>
                          <StatusPill status={v.status} />
                        </td>

                        {/* Year */}
                        <td style={{ ...TD, color: "var(--text-muted)" }}>
                          {v.year}
                        </td>

                        {/* Seats */}
                        <td style={{ ...TD, color: "var(--text-muted)" }}>
                          {v.seats ?? "—"}
                        </td>

                        {/* Driver */}
                        <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.driver || <span style={{ color: "var(--text-faint)" }}>Unassigned</span>}
                        </td>

                        {/* Actions */}
                        <td style={TD} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <ActionBtn
                              title="Edit vehicle"
                              onClick={() => onNavigate("agency-vehicles", v)}
                              hoverStyle={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
                            ><IconEdit /></ActionBtn>
                            <ActionBtn
                              title="Change status"
                              onClick={() => setStatusTarget(v)}
                              hoverStyle={{ background: "#f5f3ff", color: "#7c3aed", borderColor: "#ddd6fe" }}
                            ><IconSync /></ActionBtn>
                            <ActionBtn
                              title="Remove vehicle"
                              onClick={() => setRemoveTarget(v)}
                              hoverStyle={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
                            ><IconTrash /></ActionBtn>
                          </div>
                        </td>

                      </tr>
                    ))}
                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPrev={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>
    </div>
  );
}