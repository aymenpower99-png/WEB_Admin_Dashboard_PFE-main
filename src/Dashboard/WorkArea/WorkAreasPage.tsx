import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
export interface WorkArea {
  id: number;
  name: string;       // ville name e.g. "Nabeul"
  governorate: string; // e.g. "Nabeul Governorate"
  radius: number;
}

export interface Driver {
  id: number;
  name: string;
  vehicle: string;
  status: "active" | "inactive";
  workAreaId: number | null;
}

export interface WorkAreasPageProps {
  areas: WorkArea[];
  setAreas: React.Dispatch<React.SetStateAction<WorkArea[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

/* ─── SEED DATA ──────────────────────────────────────────────────────── */
export const INITIAL_AREAS: WorkArea[] = [
  { id: 1,  name: "Tunis",        governorate: "Tunis Governorate",        radius: 12 },
  { id: 2,  name: "Nabeul",       governorate: "Nabeul Governorate",       radius: 8  },
  { id: 3,  name: "Sfax",         governorate: "Sfax Governorate",         radius: 10 },
  { id: 4,  name: "Sousse",       governorate: "Sousse Governorate",       radius: 9  },
  { id: 5,  name: "Hammamet",     governorate: "Nabeul Governorate",       radius: 6  },
  { id: 6,  name: "Bizerte",      governorate: "Bizerte Governorate",      radius: 7  },
  { id: 7,  name: "Monastir",     governorate: "Monastir Governorate",     radius: 7  },
  { id: 8,  name: "Gabès",        governorate: "Gabès Governorate",        radius: 8  },
  { id: 9,  name: "Kairouan",     governorate: "Kairouan Governorate",     radius: 9  },
  { id: 10, name: "La Marsa",     governorate: "Tunis Governorate",        radius: 5  },
];

export const INITIAL_DRIVERS: Driver[] = [
  { id: 1,  name: "John D",    vehicle: "Toyota Corolla",   status: "active",   workAreaId: 2  },
  { id: 2,  name: "Emily R",   vehicle: "Kia Rio",          status: "active",   workAreaId: 1  },
  { id: 3,  name: "Mike S",    vehicle: "Hyundai i10",      status: "active",   workAreaId: 4  },
  { id: 4,  name: "Alex T",    vehicle: "Dacia Logan",      status: "active",   workAreaId: null },
  { id: 5,  name: "Sara L",    vehicle: "Renault Symbol",   status: "inactive", workAreaId: 3  },
  { id: 6,  name: "Omar B",    vehicle: "Peugeot 301",      status: "active",   workAreaId: null },
  { id: 7,  name: "Nadia K",   vehicle: "Citroën C-Élysée", status: "active",   workAreaId: 5  },
  { id: 8,  name: "Yassine M", vehicle: "Volkswagen Polo",  status: "inactive", workAreaId: null },
  { id: 9,  name: "Fatma Z",   vehicle: "Toyota Yaris",     status: "active",   workAreaId: 7  },
  { id: 10, name: "Hatem R",   vehicle: "Nissan Micra",     status: "active",   workAreaId: null },
];

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS  = 8;
const ROW_H = 54;

const ZONE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316"];

/* ─── STAT CARD ──────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, color }: {
  label: string; value: number | string; icon: React.ReactNode; color: string;
}) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "1rem", padding: "1.1rem 1.25rem",
      display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "0.75rem", flexShrink: 0,
        background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── STATUS PILL ────────────────────────────────────────────────────── */
function StatusPill({ assigned }: { assigned: boolean }) {
  return assigned ? (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: ".35rem",
      padding: ".22rem .7rem", borderRadius: "9999px",
      background: "#d1fae5", color: "#065f46", fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
      Assigned
    </span>
  ) : (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: ".35rem",
      padding: ".22rem .7rem", borderRadius: "9999px",
      background: "#fef3c7", color: "#92400e", fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
      Not Assigned
    </span>
  );
}

/* ─── PAGINATION ─────────────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPrev, onNext, setPage }: {
  page: number; totalPages: number;
  onPrev: () => void; onNext: () => void; setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    background: active ? "#7c3aed" : disabled ? "transparent" : "var(--bg-card)",
    color: active ? "#fff" : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 500 }}>Page {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btn(false, page === 1)}>
          <ChevronLeftRoundedIcon style={{ fontSize: 14 }} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => setPage(n)} style={btn(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btn(false, page === totalPages)}>
          <ChevronRightRoundedIcon style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}

/* ─── ASSIGN / EDIT MODAL ────────────────────────────────────────────── */
function AssignModal({ driver, areas, onSave, onClose }: {
  driver: Driver;
  areas: WorkArea[];
  onSave: (driverId: number, workAreaId: number | null) => void;
  onClose: () => void;
}) {
  const [selectedAreaId, setSelectedAreaId] = useState<number | "">(driver.workAreaId ?? "");
  const selectedArea = areas.find(a => a.id === Number(selectedAreaId));
  const selectedAreaIdx = selectedArea ? areas.indexOf(selectedArea) : -1;
  const selectedAreaColor = selectedAreaIdx >= 0 ? ZONE_COLORS[selectedAreaIdx % ZONE_COLORS.length] : "#7c3aed";

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: ".5rem .875rem", fontSize: ".875rem",
    fontFamily: "var(--font)", color: "var(--text-body)",
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: ".5rem", outline: "none", boxSizing: "border-box", cursor: "pointer",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: ".75rem", fontWeight: 500,
    color: "var(--text-muted)", marginBottom: ".375rem",
  };

  return (
    <div className="ts-overlay" style={{ display: "flex" }}>
      <div className="ts-modal ts-modal-scroll">
        <div className="ts-modal-header">
          <div>
            <p style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--text-h)", margin: 0 }}>
              {driver.workAreaId ? "Edit Work Area" : "Assign Work Area"}
            </p>
            <p style={{ fontSize: ".7rem", color: "var(--text-muted)", margin: ".1rem 0 0" }}>
              {driver.workAreaId ? `Update ville for ${driver.name}` : `Assign a ville to ${driver.name}`}
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}><CloseRoundedIcon style={{ fontSize: 16 }} /></button>
        </div>

        <div className="ts-modal-body">
          {/* Driver info */}
          <div style={{ background: "var(--bg-inner,#f9fafb)", border: "1px solid var(--border)", borderRadius: ".75rem", padding: ".875rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed", flexShrink: 0 }}>
              <DirectionsCarRoundedIcon style={{ fontSize: 20 }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--text-h)", margin: 0 }}>{driver.name}</p>
              <p style={{ fontSize: ".75rem", color: "var(--text-muted)", margin: ".1rem 0 0" }}>{driver.vehicle}</p>
            </div>
          </div>

          {/* Ville selector */}
          <div>
            <label style={labelStyle}>Ville (Work Area)</label>
            <select
              style={inputStyle}
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value === "" ? "" : Number(e.target.value))}
            >
              <option value="">— No ville assigned —</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.name} — {a.governorate}</option>
              ))}
            </select>
          </div>

          {/* Preview */}
          {selectedArea ? (
            <div style={{ background: "var(--bg-inner,#f9fafb)", border: "1px solid var(--border)", borderRadius: ".75rem", padding: ".875rem" }}>
              <p style={{ fontSize: ".7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 .625rem" }}>Ville Preview</p>

              {/* Ville badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: ".75rem",
                padding: ".75rem 1rem", borderRadius: ".625rem",
                background: `${selectedAreaColor}12`, border: `1px solid ${selectedAreaColor}30`,
                marginBottom: ".625rem",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${selectedAreaColor}20`, display: "flex", alignItems: "center", justifyContent: "center",
                  color: selectedAreaColor, flexShrink: 0,
                }}>
                  <PlaceRoundedIcon style={{ fontSize: 20 }} />
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-h)", margin: 0 }}>{selectedArea.name}</p>
                  <p style={{ fontSize: ".73rem", color: "var(--text-muted)", margin: ".1rem 0 0" }}>{selectedArea.governorate}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".625rem" }}>
                {[
                  { label: "Ville",        value: selectedArea.name },
                  { label: "Governorate",  value: selectedArea.governorate },
                  { label: "Radius",       value: `${selectedArea.radius} km` },
                  { label: "Driver",       value: driver.name },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: ".5rem", padding: ".625rem .75rem" }}>
                    <p style={{ fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-faint)", fontWeight: 600, margin: "0 0 .2rem" }}>{label}</p>
                    <p style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--text-h)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "var(--bg-inner,#f9fafb)", border: "1px dashed var(--border)", borderRadius: ".75rem", padding: "1.5rem", textAlign: "center", color: "var(--text-faint)" }}>
              <PlaceRoundedIcon style={{ fontSize: 28, marginBottom: ".35rem", opacity: .4 }} />
              <p style={{ fontSize: ".8rem", margin: 0 }}>Select a ville to preview details</p>
            </div>
          )}
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="ts-btn-primary"
            onClick={() => {
              onSave(driver.id, selectedAreaId === "" ? null : Number(selectedAreaId));
              onClose();
            }}
          >
            <span style={{ fontSize: 14 }}>✓</span>
            {driver.workAreaId ? "Update Ville" : "Assign Ville"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function WorkAreasPage({ areas, setAreas, drivers, setDrivers }: WorkAreasPageProps) {
  const [filter,      setFilter]      = useState<"all" | "assigned" | "unassigned">("all");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [assignModal, setAssignModal] = useState<Driver | null>(null);

  /* ── Derived counts ── */
  const totalDrivers    = drivers.length;
  const assignedDrivers = drivers.filter(d => d.workAreaId !== null).length;
  const noAreaDrivers   = totalDrivers - assignedDrivers;

  /* ── Filtering ── */
  const filtered = drivers.filter(d => {
    const area = areas.find(a => a.id === d.workAreaId);
    const mF =
      filter === "all"        ? true :
      filter === "assigned"   ? d.workAreaId !== null :
                                d.workAreaId === null;
    const q  = search.toLowerCase();
    const mQ = !q
      || d.name.toLowerCase().includes(q)
      || d.vehicle.toLowerCase().includes(q)
      || (area?.name.toLowerCase().includes(q) ?? false)
      || (area?.governorate.toLowerCase().includes(q) ?? false);
    return mF && mQ;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  const TH: React.CSSProperties = {
    padding: "0.65rem 1rem", fontSize: ".78rem", fontWeight: 800,
    textTransform: "uppercase", letterSpacing: ".06em",
    color: "var(--text-body)", textAlign: "left",
    borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
  };
  const TD: React.CSSProperties = {
    padding: "0 1rem", height: ROW_H, fontSize: ".85rem",
    color: "var(--text-body)", borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  };

  function handleSaveAssignment(driverId: number, workAreaId: number | null) {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, workAreaId } : d));
  }

  return (
    <>
      {assignModal && (
        <AssignModal
          driver={assignModal}
          areas={areas}
          onSave={handleSaveAssignment}
          onClose={() => setAssignModal(null)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", flex: 1 }}>

        {/* ── Page header ── */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Work Areas</h1>
            <p className="ts-page-subtitle">Assign each driver to their ville / service coverage zone</p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: "flex", gap: ".875rem", flexWrap: "wrap" }}>
          <StatCard
            label="Total Drivers"
            value={totalDrivers}
            color="#7c3aed"
            icon={<DirectionsCarRoundedIcon style={{ fontSize: 22 }} />}
          />
          <StatCard
            label="Assigned to Ville"
            value={assignedDrivers}
            color="#10b981"
            icon={<MyLocationRoundedIcon style={{ fontSize: 22 }} />}
          />
          <StatCard
            label="No Ville Assigned"
            value={noAreaDrivers}
            color="#f59e0b"
            icon={<PersonOffRoundedIcon style={{ fontSize: 22 }} />}
          />
          <StatCard
            label="Defined Villes"
            value={areas.length}
            color="#3b82f6"
            icon={<PlaceRoundedIcon style={{ fontSize: 22 }} />}
          />
        </div>

        {/* ── Table ── */}
        <div className="ts-filter-bar">
          {([
            { key: "all",        label: "All" },
            { key: "assigned",   label: "Assigned" },
            { key: "unassigned", label: "No Ville" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
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

        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Driver</th>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Ville</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={5} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No drivers match your search.
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
                    {paged.map(driver => {
                      const area      = areas.find(a => a.id === driver.workAreaId);
                      const areaIdx   = area ? areas.indexOf(area) : -1;
                      const areaColor = areaIdx >= 0 ? ZONE_COLORS[areaIdx % ZONE_COLORS.length] : undefined;

                      return (
                        <tr key={driver.id} className="ts-tr" style={{ height: ROW_H }}>
                          {/* Driver */}
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>
                            {driver.name}
                          </td>

                          {/* Vehicle */}
                          <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {driver.vehicle}
                          </td>

                          {/* Ville */}
                          <td style={{ ...TD, fontWeight: 600 }}>
                            {area ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                                <span style={{ width: 9, height: 9, borderRadius: "50%", background: areaColor, flexShrink: 0, display: "inline-block" }} />
                                <span style={{ color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{area.name}</span>
                              </span>
                            ) : (
                              <span style={{ color: "var(--text-faint)", fontStyle: "italic", fontWeight: 400 }}>—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td style={TD}>
                            <StatusPill assigned={driver.workAreaId !== null} />
                          </td>

                          {/* Action */}
                          <td style={TD}>
                            <button
                              title={driver.workAreaId ? "Edit Ville" : "Assign Ville"}
                              className="ts-icon-btn"
                              onClick={() => setAssignModal(driver)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: ".3rem",
                                padding: ".2rem .4rem", borderRadius: ".375rem",
                                fontSize: ".8rem", fontWeight: 600, whiteSpace: "nowrap",
                                color: driver.workAreaId ? "var(--text-muted)" : "#7c3aed",
                                background: "none", border: "none", cursor: "pointer",
                              }}
                            >
                              {driver.workAreaId
                                ? <><EditRoundedIcon style={{ fontSize: 14 }} /> Edit</>
                                : <><AddLocationAltRoundedIcon style={{ fontSize: 14 }} /> Assign</>
                              }
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
          <Pagination
            page={safePage}
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