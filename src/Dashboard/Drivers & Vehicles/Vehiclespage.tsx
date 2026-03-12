import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  type: "sedan" | "suv" | "van" | "truck";
  status: "active" | "maintenance" | "inactive";
  driver: string;
  mileage: number;
  fuel: "petrol" | "diesel" | "electric" | "hybrid";
  seats: number;
  vehicleClass?: string;
}

export interface VehiclesPageProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate: (page: string, prefill?: Vehicle | null) => void;
}

/* ─── SEED DATA ──────────────────────────────────────────────────────── */
export const INITIAL_VEHICLES: Vehicle[] = [
  { id:1,  make:"Toyota",     model:"Corolla",  year:2021, plate:"ABC-1234", color:"White",        type:"sedan", status:"active",      driver:"John Doe",        mileage:32400, fuel:"petrol",   seats:5, vehicleClass:"economy" },
  { id:2,  make:"Hyundai",    model:"i10",      year:2020, plate:"DEF-5678", color:"Silver",       type:"sedan", status:"active",      driver:"Emily Ross",      mileage:18700, fuel:"petrol",   seats:5, vehicleClass:"economy" },
  { id:3,  make:"Kia",        model:"Rio",      year:2019, plate:"GHI-9012", color:"Blue",         type:"sedan", status:"maintenance", driver:"Mike Smith",      mileage:47200, fuel:"petrol",   seats:5, vehicleClass:"standard" },
  { id:4,  make:"Dacia",      model:"Logan",    year:2022, plate:"JKL-3456", color:"Black",        type:"sedan", status:"active",      driver:"Sara Lee",        mileage:12300, fuel:"diesel",   seats:5, vehicleClass:"economy" },
  { id:5,  make:"Peugeot",    model:"301",      year:2020, plate:"MNO-7890", color:"Gray",         type:"sedan", status:"active",      driver:"Ahmed Ben Ali",   mileage:28900, fuel:"petrol",   seats:5, vehicleClass:"standard" },
  { id:6,  make:"Renault",    model:"Symbol",   year:2018, plate:"PQR-1234", color:"Red",          type:"sedan", status:"inactive",    driver:"Karim Hassan",    mileage:61000, fuel:"petrol",   seats:5, vehicleClass:"economy" },
  { id:7,  make:"Toyota",     model:"Yaris",    year:2023, plate:"STU-5678", color:"White",        type:"sedan", status:"active",      driver:"Lina Nour",       mileage:8400,  fuel:"hybrid",   seats:5, vehicleClass:"economy" },
  { id:8,  make:"Kia",        model:"Picanto",  year:2021, plate:"VWX-9012", color:"Yellow",       type:"sedan", status:"active",      driver:"Youssef Mansour", mileage:22100, fuel:"petrol",   seats:5, vehicleClass:"economy" },
  { id:9,  make:"Peugeot",    model:"208",      year:2022, plate:"YZA-1111", color:"Pearl White",  type:"sedan", status:"maintenance", driver:"Nadia Ferhat",    mileage:15600, fuel:"electric", seats:5, vehicleClass:"standard" },
  { id:10, make:"Volkswagen", model:"Polo",     year:2020, plate:"BCD-2222", color:"Graphite",     type:"sedan", status:"inactive",    driver:"Omar Trabelsi",   mileage:39800, fuel:"petrol",   seats:5, vehicleClass:"first_class" },
  { id:11, make:"Citroën",    model:"C3",       year:2021, plate:"EFG-3333", color:"Orange",       type:"sedan", status:"active",      driver:"Sofia Martin",    mileage:26300, fuel:"petrol",   seats:5, vehicleClass:"standard" },
  { id:12, make:"Hyundai",    model:"Accent",   year:2023, plate:"HIJ-4444", color:"Midnight Blue",type:"sedan", status:"active",      driver:"Tarek Bouaziz",   mileage:5200,  fuel:"hybrid",   seats:5, vehicleClass:"first_class" },
];

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS  = 10;
const ROW_H = 54;

const STATUS_CFG: Record<Vehicle["status"], { label: string; dot: string; bg: string; fg: string }> = {
  active:      { label: "Active",      dot: "#10b981", bg: "#d1fae5",            fg: "#065f46" },
  maintenance: { label: "Maintenance", dot: "#f59e0b", bg: "#fef3c7",            fg: "#92400e" },
  inactive:    { label: "Inactive",    dot: "#af9c9c", bg: "var(--refunded-bg)", fg: "var(--refunded-fg)" },
};

const CLASS_CFG: Record<string, { label: string; color: string }> = {
  economy:               { label: "Economy",            color: "#6366f1" },
  standard:              { label: "Standard",           color: "#0ea5e9" },
  first_class:           { label: "First Class",        color: "#f59e0b" },
  standard_van:          { label: "Standard Van",       color: "#10b981" },
  suv_first_class_van:   { label: "SUV / 1st Class Van", color: "#8b5cf6" },
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────── */
function StatusPill({ status }: { status: Vehicle["status"] }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: ".35rem",
      padding: ".22rem .7rem", borderRadius: "9999px",
      background: c.bg, color: c.fg,
      fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}

function ClassBadge({ vehicleClass }: { vehicleClass?: string }) {
  const key = vehicleClass ?? "";
  const c = CLASS_CFG[key] ?? { label: "—", color: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: ".2rem .6rem", borderRadius: "9999px",
      background: `${c.color}18`, color: c.color,
      fontSize: ".78rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}

/* ─── PAGINATION ─────────────────────────────────────────────────────── */
interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  setPage: (n: number) => void;
}

function Pagination({ page, totalPages, onPrev, onNext, setPage }: PaginationProps) {
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
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.6rem 1rem",
      borderTop: "1px solid var(--border)",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 500 }}>
        Page {page} of {totalPages}
      </span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btn(false, page === 1)}>
          <ChevronLeftRoundedIcon style={{ fontSize: 13 }} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => setPage(n)} style={btn(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btn(false, page === totalPages)}>
          <ChevronRightRoundedIcon style={{ fontSize: 13 }} />
        </button>
      </div>
    </div>
  );
}

/* ─── CONFIRM REMOVE MODAL ───────────────────────────────────────────── */
function RemoveModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="ts-overlay">
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-header">
          <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--text-h)" }}>Remove Vehicle</p>
          <button className="ts-modal-close" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="ts-modal-body">
          <p style={{ fontSize: ".8rem", color: "var(--text-body)" }}>
            Are you sure you want to remove this vehicle? This action cannot be undone.
          </p>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-danger" onClick={onConfirm}>Remove</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
type FilterKey = "all" | Vehicle["status"];

export default function VehiclesPage({ vehicles, setVehicles, onNavigate }: VehiclesPageProps) {
  const [filter,   setFilter]   = useState<FilterKey>("all");
  const [search,   setSearch]   = useState<string>("");
  const [page,     setPage]     = useState<number>(1);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const filtered = vehicles.filter(v => {
    const mS = filter === "all" || v.status === filter;
    const q  = search.toLowerCase();
    const mQ = !q
      || `${v.make} ${v.model}`.toLowerCase().includes(q)
      || v.plate.toLowerCase().includes(q)
      || v.driver.toLowerCase().includes(q);
    return mS && mQ;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  const counts = {
    all:         vehicles.length,
    active:      vehicles.filter(v => v.status === "active").length,
    maintenance: vehicles.filter(v => v.status === "maintenance").length,
    inactive:    vehicles.filter(v => v.status === "inactive").length,
  };

  const TH: React.CSSProperties = {
    padding: "0.65rem 1rem",
    fontSize: ".78rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    color: "var(--text-body)",
    textAlign: "left",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  const TD: React.CSSProperties = {
    padding: "0 1rem",
    height: ROW_H,
    fontSize: ".85rem",
    color: "var(--text-body)",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  };

  return (
    <>
      {removeId !== null && (
        <RemoveModal
          onConfirm={() => { setVehicles(p => p.filter(v => v.id !== removeId)); setRemoveId(null); }}
          onClose={() => setRemoveId(null)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>

        {/* ── Page header ── */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Vehicles</h1>
            <p className="ts-page-subtitle">
              {vehicles.length} registered · {counts.active} active · {counts.maintenance} in maintenance
            </p>
          </div>
          <button className="ts-btn-primary" onClick={() => onNavigate("agency-vehicles", null)}>
            <AddRoundedIcon style={{ fontSize: 15 }} /> Add Vehicle
          </button>
        </div>

        {/* ── Filter + Search ── */}
        <div className="ts-filter-bar">
          {(["all", "active", "maintenance", "inactive"] as const).map(k => (
            <button
              key={k}
              className={`ts-filter-chip${filter === k ? " ts-active" : ""}`}
              onClick={() => { setFilter(k); setPage(1); }}
            >
              {k === "all"
                ? `All (${counts.all})`
                : `${STATUS_CFG[k].label} (${counts[k]})`}
            </button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <div className="ts-search-bar" style={{ minWidth: 220 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search make, plate or driver…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <span className="ts-record-count" style={{ marginLeft: 0 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Table card ── */}
        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "18%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "8%"  }} />
                <col style={{ width: "16%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Plate</th>
                  <th style={TH}>Assigned Driver</th>
                  <th style={TH}>Class</th>
                  <th style={TH}>Seats</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No vehicles match your search.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {paged.map(v => (
                      <tr key={v.id} className="ts-tr" style={{ height: ROW_H }}>

                        <td style={{ ...TD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-h)" }}>
                            {v.year} {v.make} {v.model}
                          </span>
                        </td>

                        <td style={TD}><StatusPill status={v.status} /></td>

                        <td style={{ ...TD, fontWeight: 700, color: "var(--text-h)", fontFamily: "monospace", fontSize: ".82rem", letterSpacing: ".04em" }}>
                          {v.plate}
                        </td>

                        <td style={{ ...TD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)" }}>
                          {v.driver || "—"}
                        </td>

                        <td style={TD}><ClassBadge vehicleClass={v.vehicleClass} /></td>

                        <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>{v.seats}</td>

                        <td style={TD}>
                          <div style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                            <button
                              title="Edit Vehicle"
                              className="ts-icon-btn"
                              onClick={() => onNavigate("agency-vehicles", v)}
                              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }}
                            >
                              <EditRoundedIcon style={{ fontSize: 16 }} />
                            </button>
                            <button
                              title="Remove Vehicle"
                              className="ts-icon-btn ts-icon-btn-del"
                              onClick={() => setRemoveId(v.id)}
                              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }}
                            >
                              <DeleteOutlineRoundedIcon style={{ fontSize: 16 }} />
                            </button>
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