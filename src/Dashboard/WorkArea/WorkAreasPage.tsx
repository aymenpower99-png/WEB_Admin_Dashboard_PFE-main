import { useState, useEffect, useMemo } from "react";
import SearchRoundedIcon          from "@mui/icons-material/SearchRounded";
import AddLocationAltRoundedIcon  from "@mui/icons-material/AddLocationAltRounded";
import EditRoundedIcon            from "@mui/icons-material/EditRounded";
import "../travelsync-design-system.css";

import { workAreasApi, type WorkAreaItem, type WorkAreaDriver } from "../../api/workAreas";
import { ROWS, ROW_H, TH, TD }   from "./components/WorkAreaTypes";
import WorkAreaStatCards          from "./components/WorkAreaStatCards";
import WorkAreaPagination         from "./components/WorkAreaPagination";
import AddWorkAreaModal           from "./components/AddWorkAreaModal";
import AssignWorkAreaModal        from "./components/AssignWorkAreaModal";

export default function WorkAreasPage() {
  const [areas,        setAreas]        = useState<WorkAreaItem[]>([]);
  const [drivers,      setDrivers]      = useState<WorkAreaDriver[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [filter,       setFilter]       = useState<"all" | "assigned" | "unassigned">("all");
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(1);
  const [showAddArea,  setShowAddArea]  = useState(false);
  const [assignTarget, setAssignTarget] = useState<WorkAreaDriver | null>(null);

  function loadAll() {
    setLoading(true);
    Promise.all([workAreasApi.getAll(), workAreasApi.getDrivers()])
      .then(([a, d]) => { setAreas(a); setDrivers(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return drivers.filter(d => {
      const mF = filter === "all" ? true : filter === "assigned" ? !!d.workAreaId : !d.workAreaId;
      const mQ = !q
        || d.name.toLowerCase().includes(q)
        || (d.vehicle ?? "").toLowerCase().includes(q)
        || (d.workArea?.ville ?? "").toLowerCase().includes(q)
        || (d.workArea?.country ?? "").toLowerCase().includes(q);
      return mF && mQ;
    });
  }, [drivers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  return (
    <>
      {showAddArea && (
        <AddWorkAreaModal
          onClose={() => setShowAddArea(false)}
          onCreated={area => setAreas(prev => [...prev, area])}
        />
      )}
      {assignTarget && (
        <AssignWorkAreaModal
          driver={assignTarget}
          areas={areas}
          onClose={() => setAssignTarget(null)}
          onSaved={updated => {
            setDrivers(prev => prev.map(d => d.id === updated.id ? updated : d));
            setAssignTarget(null);
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", flex: 1 }}>

        {/* Header */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Work Areas</h1>
            <p className="ts-page-subtitle">Assign each driver to their service zone</p>
          </div>
          <button className="ts-btn-primary" onClick={() => setShowAddArea(true)}>
            <AddLocationAltRoundedIcon style={{ fontSize: 15 }} />
            Add Work Area
          </button>
        </div>

        {/* Stat cards */}
        <WorkAreaStatCards drivers={drivers} areas={areas} />

        {/* Filter + Search */}
        <div className="ts-filter-bar">
          {([
            { key: "all",        label: "All"      },
            { key: "assigned",   label: "Assigned" },
            { key: "unassigned", label: "No Ville" },
          ] as const).map(({ key, label }) => (
            <button key={key}
              className={`ts-filter-chip${filter === key ? " ts-active" : ""}`}
              onClick={() => { setFilter(key); setPage(1); }}
            >
              {label}
            </button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <div className="ts-search-bar" style={{ minWidth: 220 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search driver, vehicle, ville…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <span className="ts-record-count" style={{ marginLeft: 0 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              Loading…
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "22%" }} /><col style={{ width: "22%" }} />
                  <col style={{ width: "22%" }} /><col style={{ width: "18%" }} />
                  <col style={{ width: "16%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Driver</th>
                    <th style={TH}>Vehicle</th>
                    <th style={TH}>Ville</th>
                    <th style={TH}>Assignment</th>
                    <th style={TH}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <>
                      <tr style={{ height: ROW_H }}>
                        <td colSpan={5} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                          No drivers found{search ? ` matching "${search}"` : ""}.
                        </td>
                      </tr>
                      {Array.from({ length: ROWS - 1 }).map((_, i) => (
                        <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                          <td colSpan={5} style={{ borderBottom: "1px solid var(--border)" }} />
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {paged.map(driver => (
                        <tr key={driver.id} className="ts-tr" style={{ height: ROW_H }}>
                          {/* Driver */}
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>
                            {driver.name || "—"}
                          </td>
                          {/* Vehicle */}
                          <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {driver.vehicle ?? <span style={{ color: "var(--text-faint)", fontStyle: "italic" }}>No vehicle</span>}
                          </td>
                          {/* Ville */}
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {driver.workArea
                              ? driver.workArea.ville
                              : <span style={{ color: "var(--text-faint)", fontStyle: "italic", fontWeight: 400 }}>—</span>
                            }
                          </td>
                          {/* Assignment status text */}
                          <td style={TD}>
                            {driver.workAreaId ? (
                              <span style={{ fontSize: ".78rem", color: "#059669", fontWeight: 600 }}>Assigned</span>
                            ) : (
                              <span style={{ fontSize: ".78rem", color: "#d97706", fontWeight: 600 }}>Not Assigned</span>
                            )}
                          </td>
                          {/* Action */}
                          <td style={TD}>
                            <button
                              onClick={() => setAssignTarget(driver)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: ".3rem",
                                height: 30, padding: "0 .6rem", borderRadius: 7,
                                border: "1px solid var(--border)", background: "var(--bg-card)",
                                color: "var(--text-muted)", cursor: "pointer",
                                fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
                                transition: "all .15s",
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = driver.workAreaId ? "#eff6ff" : "#f5f3ff";
                                (e.currentTarget as HTMLButtonElement).style.color = driver.workAreaId ? "#2563eb" : "#7c3aed";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = driver.workAreaId ? "#bfdbfe" : "#ddd6fe";
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                              }}
                            >
                              {driver.workAreaId
                                ? <><EditRoundedIcon style={{ fontSize: 13 }} /> Edit</>
                                : <><AddLocationAltRoundedIcon style={{ fontSize: 13 }} /> Assign</>}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {Array.from({ length: ghostCount }).map((_, i) => (
                        <tr key={`g-${i}`} style={{ height: ROW_H }}>
                          <td colSpan={5} style={{ borderBottom: "1px solid var(--border)" }} />
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <WorkAreaPagination
            page={safePage} totalPages={totalPages}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}