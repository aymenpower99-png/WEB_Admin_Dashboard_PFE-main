import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
export interface Driver {
  id: number;
  first: string;
  last: string;
  phone: string;
  email: string;
  lang: string;
  status: "online" | "busy" | "offline";
  vehicle: string;
  plate: string;
  trips: number;
  earnings: number;
  rating: number;
  seed: string;
}

export interface DriversPageProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  onNavigate: (page: string, prefill?: Driver | null) => void;
}

/* ─── SEED DATA ──────────────────────────────────────────────────────── */
export const INITIAL_DRIVERS: Driver[] = [
  { id:1,  first:"John",    last:"Doe",       phone:"+1 555-0101", email:"john.doe@email.com",     lang:"English", status:"online",  vehicle:"Toyota Corolla",  plate:"ABC-1234", trips:24, earnings:560, rating:4.8, seed:"John"    },
  { id:2,  first:"Emily",   last:"Ross",      phone:"+1 555-0102", email:"emily.ross@email.com",   lang:"French",  status:"busy",    vehicle:"Hyundai i10",     plate:"DEF-5678", trips:18, earnings:480, rating:4.6, seed:"Emily"   },
  { id:3,  first:"Mike",    last:"Smith",     phone:"+1 555-0103", email:"mike.smith@email.com",   lang:"English", status:"offline", vehicle:"Kia Rio",          plate:"GHI-9012", trips:12, earnings:300, rating:4.3, seed:"Mike"    },
  { id:4,  first:"Sara",    last:"Lee",       phone:"+1 555-0104", email:"sara.lee@email.com",     lang:"Arabic",  status:"online",  vehicle:"Dacia Logan",      plate:"JKL-3456", trips:31, earnings:720, rating:4.9, seed:"Sara"    },
  { id:5,  first:"Ahmed",   last:"Ben Ali",   phone:"+1 555-0105", email:"ahmed.b@email.com",      lang:"Arabic",  status:"busy",    vehicle:"Peugeot 301",      plate:"MNO-7890", trips:9,  earnings:210, rating:4.1, seed:"Ahmed"   },
  { id:6,  first:"Karim",   last:"Hassan",    phone:"+1 555-0106", email:"karim.h@email.com",      lang:"French",  status:"offline", vehicle:"Renault Symbol",   plate:"PQR-1234", trips:6,  earnings:140, rating:3.9, seed:"Karim"   },
  { id:7,  first:"Lina",    last:"Nour",      phone:"+1 555-0107", email:"lina.n@email.com",       lang:"English", status:"online",  vehicle:"Toyota Yaris",     plate:"STU-5678", trips:19, earnings:430, rating:4.7, seed:"Lina"    },
  { id:8,  first:"Youssef", last:"Mansour",   phone:"+1 555-0108", email:"youssef.m@email.com",    lang:"Arabic",  status:"busy",    vehicle:"Kia Picanto",      plate:"VWX-9012", trips:22, earnings:510, rating:4.5, seed:"Youssef" },
  { id:9,  first:"Nadia",   last:"Ferhat",    phone:"+1 555-0109", email:"nadia.f@email.com",      lang:"French",  status:"online",  vehicle:"Peugeot 208",      plate:"YZA-1111", trips:15, earnings:370, rating:4.4, seed:"Nadia"   },
  { id:10, first:"Omar",    last:"Trabelsi",  phone:"+1 555-0110", email:"omar.t@email.com",       lang:"Arabic",  status:"offline", vehicle:"Volkswagen Polo",  plate:"BCD-2222", trips:8,  earnings:190, rating:4.0, seed:"Omar"    },
  { id:11, first:"Sofia",   last:"Martin",    phone:"+1 555-0111", email:"sofia.m@email.com",      lang:"French",  status:"busy",    vehicle:"Citroën C3",       plate:"EFG-3333", trips:27, earnings:640, rating:4.7, seed:"Sofia"   },
  { id:12, first:"Tarek",   last:"Bouaziz",   phone:"+1 555-0112", email:"tarek.b@email.com",      lang:"Arabic",  status:"online",  vehicle:"Hyundai Accent",   plate:"HIJ-4444", trips:33, earnings:780, rating:4.9, seed:"Tarek"   },
];

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS  = 10;
const ROW_H = 54; // taller rows = more breathing room

const STATUS_CFG = {
  online:  { label:"Online",  dot:"#10b981", bg:"#d1fae5", fg:"#065f46" },
  busy:    { label:"Busy",    dot:"#f59e0b", bg:"#fef3c7", fg:"#92400e" },
  offline: { label:"Offline", dot:"#af9c9c", bg:"var(--refunded-bg)", fg:"var(--refunded-fg)" },
} as const;

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────── */
function StatusPill({ status }: { status: Driver["status"] }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.offline;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:".35rem",
      padding:".22rem .7rem", borderRadius:"9999px",
      background:c.bg, color:c.fg,
      fontSize:".78rem",
      fontWeight:600, whiteSpace:"nowrap",
    }}>
      {c.label}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:".2rem",
      fontSize:".82rem",   // ← was .72rem
      color:"#f59e0b", fontWeight:700,
    }}>
      <StarRoundedIcon style={{ fontSize:16 }} />{rating}   {/* ← icon was 14 */}
    </span>
  );
}

/* ─── PAGINATION ─────────────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPrev, onNext, setPage }: {
  page: number; totalPages: number;
  onPrev: () => void; onNext: () => void; setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display:"flex", alignItems:"center", justifyContent:"center",
    width:26, height:26, borderRadius:"0.375rem",
    border:"1px solid var(--border)",
    background: active ? "#7c3aed" : disabled ? "transparent" : "var(--bg-card)",
    color: active ? "#fff" : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize:"0.75rem",  // ← was 0.68rem
    cursor: disabled ? "not-allowed" : "pointer", transition:"all .15s",
  });
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 1rem", borderTop:"1px solid var(--border)", flexShrink:0 }}>
      <span style={{ fontSize:"0.75rem", color:"var(--text-faint)", fontWeight:500 }}>Page {page} of {totalPages}</span>
      <div style={{ display:"flex", gap:"0.3rem" }}>
        <button onClick={onPrev} disabled={page===1} style={btn(false, page===1)}>
          <ChevronLeftRoundedIcon style={{ fontSize:14 }}/>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
          <button key={n} onClick={() => setPage(n)} style={btn(n===page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page===totalPages} style={btn(false, page===totalPages)}>
          <ChevronRightRoundedIcon style={{ fontSize:14 }}/>
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
          <p style={{ fontWeight:700, fontSize:".88rem", color:"var(--text-h)" }}>Remove Driver</p>
          <button className="ts-modal-close" onClick={onClose}><CloseRoundedIcon style={{ fontSize:16 }}/></button>
        </div>
        <div className="ts-modal-body">
          <p style={{ fontSize:".8rem", color:"var(--text-body)" }}>Are you sure you want to remove this driver? This action cannot be undone.</p>
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
export default function DriversPage({ drivers, setDrivers, onNavigate }: DriversPageProps) {
  const [filter,   setFilter]   = useState<"all"|"online"|"busy"|"offline">("all");
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const filtered = drivers.filter(d => {
    const mS = filter === "all" || d.status === filter;
    const q  = search.toLowerCase();
    const mQ = !q || `${d.first} ${d.last}`.toLowerCase().includes(q) || d.vehicle.toLowerCase().includes(q);
    return mS && mQ;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  const counts = {
    all:     drivers.length,
    online:  drivers.filter(d => d.status === "online").length,
    busy:    drivers.filter(d => d.status === "busy").length,
    offline: drivers.filter(d => d.status === "offline").length,
  };

  /* ── shared th style ── */
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

  /* ── shared td style ── */
  const TD: React.CSSProperties = {
    padding: "0 1rem",
    height: ROW_H,
    fontSize: ".85rem",        // ← was .73–.8rem — matches reference screenshot
    color: "var(--text-body)",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  };

  return (
    <>
      {removeId !== null && (
        <RemoveModal
          onConfirm={() => { setDrivers(p => p.filter(d => d.id !== removeId)); setRemoveId(null); }}
          onClose={() => setRemoveId(null)}
        />
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:".85rem" }}>

        {/* ── Page header ── */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Drivers</h1>
            <p className="ts-page-subtitle">{drivers.length} registered · {counts.online} online · {counts.busy} busy</p>
          </div>
          <button className="ts-btn-primary" onClick={() => onNavigate("agency-drivers", null)}>
            <PersonAddAlt1RoundedIcon style={{ fontSize:15 }} /> Add Driver
          </button>
        </div>

        {/* ── Filter + Search ── */}
        <div className="ts-filter-bar">
          {(["all","online","busy","offline"] as const).map(k => (
            <button key={k} className={`ts-filter-chip${filter===k?" ts-active":""}`}
              onClick={() => { setFilter(k); setPage(1); }}>
              {k === "all" ? `All (${counts.all})` : `${STATUS_CFG[k].label} (${counts[k]})`}
            </button>
          ))}
          <div style={{ marginLeft:"auto" }}>
            <div className="ts-search-bar" style={{ minWidth:220 }}>
              <SearchRoundedIcon style={{ fontSize:15, flexShrink:0 }} />
              <input
                placeholder="Search name or vehicle…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <span className="ts-record-count" style={{ marginLeft:0 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Table card ── */}
        <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>

              <colgroup>
                <col style={{ width:"18%" }} />
                <col style={{ width:"12%" }} />
                <col style={{ width:"16%" }} />
                <col style={{ width:"11%" }} />
                <col style={{ width:"8%"  }} />
                <col style={{ width:"11%" }} />
                <col style={{ width:"10%" }} />
                <col style={{ width:"14%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th style={TH}>Driver</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Language</th>
                  <th style={TH}>Trips</th>
                  <th style={TH}>Earnings</th>
                  <th style={TH}>Rating</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paged.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={8} style={{ ...TD, textAlign:"center", color:"var(--text-faint)" }}>
                        No drivers match your search.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={8} style={{ borderBottom:"1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {paged.map(d => (
                      <tr key={d.id} className="ts-tr" style={{ height: ROW_H }}>

                        {/* Driver name */}
                        <td style={{ ...TD, fontWeight:600, color:"var(--text-h)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {d.first} {d.last}
                        </td>

                        {/* Status */}
                        <td style={TD}><StatusPill status={d.status} /></td>

                        {/* Vehicle */}
                        <td style={{ ...TD, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {d.vehicle}
                        </td>

                        {/* Language */}
                        <td style={{ ...TD, color:"var(--text-muted)" }}>{d.lang}</td>

                        {/* Trips */}
                        <td style={{ ...TD, fontWeight:600, color:"var(--text-h)" }}>{d.trips}</td>

                        {/* Earnings */}
                        <td style={{ ...TD, fontWeight:700, color:"#7c3aed" }}>${d.earnings}</td>

                        {/* Rating */}
                        <td style={TD}><Stars rating={d.rating} /></td>

                        {/* Actions */}
                        <td style={TD}>
                          <div style={{ display:"flex", alignItems:"center", gap:".35rem" }}>
                            <button
                              title="Edit Driver"
                              className="ts-icon-btn"
                              onClick={() => onNavigate("agency-drivers", d)}
                              style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:".375rem" }}
                            >
                              <EditRoundedIcon style={{ fontSize:16 }}/>
                            </button>
                            <button
                              title="Remove Driver"
                              className="ts-icon-btn ts-icon-btn-del"
                              onClick={() => setRemoveId(d.id)}
                              style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:".375rem" }}
                            >
                              <DeleteOutlineRoundedIcon style={{ fontSize:16 }}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Ghost rows */}
                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={8} style={{ borderBottom:"1px solid var(--border)" }} />
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