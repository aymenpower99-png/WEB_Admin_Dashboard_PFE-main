import { useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import {
  AssignDriverModal,
  AvailableRideDetailsModal,
} from "./AvailableRidesModals";
import type { RideRequest, AvailableDriver } from "./AvailableRidesModals";

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS  = 5;
const ROW_H = 96;

/* ─── MOCK DATA ──────────────────────────────────────────────────────── */
const MOCK_RIDES: RideRequest[] = [
  { id: 1, rider: "Sara M",    pickup: "Tunis-Carthage Airport",  drop: "City Center, Tunis",     vehicleClass: "Economy Sedan",              date: "Today",    time: "10:30", fare: 28,  distance: "12 km", duration: "22 min", status: "waiting", passengerCount: 2 },
  { id: 2, rider: "Omar S",    pickup: "El Mechtel Hotel",        drop: "Tunis Train Station",    vehicleClass: "Standard (Executive/Business)", date: "Today",    time: "11:15", fare: 45,  distance: "8 km",  duration: "18 min", status: "waiting", passengerCount: 4 },
  { id: 3, rider: "Lina B",    pickup: "La Marsa Beach",          drop: "Bardo Museum",           vehicleClass: "First Class",                date: "Today",    time: "12:00", fare: 35,  distance: "18 km", duration: "30 min", status: "waiting", passengerCount: 1 },
  { id: 4, rider: "Karim T",   pickup: "Lac Business District",   drop: "Hammamet Resort",        vehicleClass: "Standard Van (up to 8 passengers)", date: "Today",  time: "13:45", fare: 120, distance: "65 km", duration: "55 min", status: "waiting", passengerCount: 6 },
  { id: 5, rider: "Nadia R",   pickup: "Sfax City Center",        drop: "Sfax Airport",           vehicleClass: "Economy Sedan",              date: "Today",    time: "14:00", fare: 22,  distance: "9 km",  duration: "15 min", status: "waiting", passengerCount: 1 },
  { id: 6, rider: "Youssef A", pickup: "Sousse Medina",           drop: "Port El Kantaoui",       vehicleClass: "First Class Van",            date: "Tomorrow", time: "09:00", fare: 55,  distance: "14 km", duration: "20 min", status: "waiting", passengerCount: 3 },
  { id: 7, rider: "Fatima Z",  pickup: "Nabeul Bus Station",      drop: "Hammamet North",         vehicleClass: "Economy Sedan",              date: "Tomorrow", time: "10:30", fare: 18,  distance: "7 km",  duration: "12 min", status: "waiting", passengerCount: 1 },
];

const VEHICLE_CLASSES = [
  "All",
  "Economy Sedan",
  "Standard (Executive/Business)",
  "First Class",
  "Standard Van (up to 8 passengers)",
  "First Class Van",
  "Minibus (12 passengers)",
  "Minibus (16 passengers)",
];

const VEHICLE_CLASS_OPTIONS = VEHICLE_CLASSES.filter(c => c !== "All");

/* ─── TABLE STYLES ───────────────────────────────────────────────────── */
const TH: React.CSSProperties = {
  padding: "0.65rem 1rem", fontSize: ".78rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-body)", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
};
const TD: React.CSSProperties = {
  padding: "0 1.1rem", height: ROW_H, fontSize: ".85rem",
  color: "var(--text-body)", borderBottom: "1px solid var(--border)",
  verticalAlign: "middle", lineHeight: 1.6,
};

/* ─── MODAL OVERLAY ──────────────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 200,
  background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

/* ─── EDIT RIDE MODAL ────────────────────────────────────────────────── */
interface EditRideModalProps {
  ride: RideRequest;
  onClose: () => void;
  onSave: (updated: RideRequest) => void;
}

function EditRideModal({ ride, onClose, onSave }: EditRideModalProps) {
  const [form, setForm] = useState<RideRequest>({ ...ride });

  const field = (label: string, key: keyof RideRequest, type = "text") => (
    <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
      <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={String(form[key])}
        onChange={e => {
          const val = type === "number" ? Number(e.target.value) : e.target.value;
          setForm(prev => ({ ...prev, [key]: val }));
        }}
        style={{
          padding: ".45rem .7rem", borderRadius: ".4rem",
          border: "1px solid var(--border)", background: "var(--bg-inner)",
          fontSize: ".82rem", color: "var(--text-body)",
          outline: "none", width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );

  return (
    <div style={OVERLAY} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "var(--bg-card)", borderRadius: ".75rem",
        border: "1px solid var(--border)", width: "100%", maxWidth: 520,
        boxShadow: "0 8px 40px rgba(0,0,0,.18)", padding: "1.5rem",
        display: "flex", flexDirection: "column", gap: "1rem",
        maxHeight: "90vh", overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-h)" }}>Edit Ride</h2>
            <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>Ride #{ride.id} · {ride.rider}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: ".25rem" }}
          >
            <CloseRoundedIcon style={{ fontSize: 20 }} />
          </button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Rider Info */}
        <p style={{ margin: 0, fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-faint)" }}>Rider Info</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          {field("Rider Name", "rider")}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>Passengers</label>
            <select
              value={form.passengerCount}
              onChange={e => setForm(prev => ({ ...prev, passengerCount: Number(e.target.value) }))}
              style={{ padding: ".45rem .7rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".82rem", color: "var(--text-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
            >
              {[2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Route */}
        <p style={{ margin: 0, fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-faint)" }}>Route</p>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>
              Pickup
            </label>
            <input
              value={form.pickup}
              onChange={e => setForm(prev => ({ ...prev, pickup: e.target.value }))}
              style={{ padding: ".45rem .7rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".82rem", color: "var(--text-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>
              Drop-off
            </label>
            <input
              value={form.drop}
              onChange={e => setForm(prev => ({ ...prev, drop: e.target.value }))}
              style={{ padding: ".45rem .7rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".82rem", color: "var(--text-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Scheduling */}
        <p style={{ margin: 0, fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-faint)" }}>Scheduling</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              style={{ padding: ".45rem .7rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".82rem", color: "var(--text-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>Time</label>
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
              style={{ padding: ".45rem .7rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".82rem", color: "var(--text-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Vehicle & Fare */}
        <p style={{ margin: 0, fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-faint)" }}>Vehicle & Fare</p>
        <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
          <label style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>Vehicle Class</label>
          <select
            value={form.vehicleClass}
            onChange={e => setForm(prev => ({ ...prev, vehicleClass: e.target.value }))}
            style={{ padding: ".45rem .7rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".82rem", color: "var(--text-body)", outline: "none", width: "100%", boxSizing: "border-box" }}
          >
            {VEHICLE_CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: ".75rem" }}>
          {field("Fare ($)", "fare", "number")}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: ".5rem", justifyContent: "flex-end", paddingTop: ".25rem" }}>
          <button
            onClick={onClose}
            style={{ padding: ".45rem 1rem", borderRadius: ".4rem", border: "1px solid var(--border)", background: "var(--bg-inner)", fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="ts-btn-primary"
            style={{ fontSize: ".78rem", padding: ".45rem 1rem", display: "flex", alignItems: "center", gap: ".35rem" }}
          >
            <SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes
          </button>
        </div>

      </div>
    </div>
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

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function AvailableRidesPage() {
  const [rides,       setRides]       = useState<RideRequest[]>(MOCK_RIDES);
  const [search,      setSearch]      = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [page,        setPage]        = useState(1);
  const [assignModal, setAssignModal] = useState<RideRequest | null>(null);
  const [detailModal, setDetailModal] = useState<RideRequest | null>(null);
  const [editModal,   setEditModal]   = useState<RideRequest | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleAssign = (rideId: number, driver: AvailableDriver) => {
    setRides(prev => prev.filter(r => r.id !== rideId));
    showToast(`Driver ${driver.name} assigned successfully`);
  };

  const handleReject = (rideId: number) => {
    setRides(prev => prev.filter(r => r.id !== rideId));
    showToast("Ride request rejected");
  };

  const handleSaveEdit = (updated: RideRequest) => {
    setRides(prev => prev.map(r => r.id === updated.id ? updated : r));
    showToast("Ride updated successfully");
  };

  const filtered = rides.filter(r => {
    const matchSearch =
      r.rider.toLowerCase().includes(search.toLowerCase()) ||
      r.pickup.toLowerCase().includes(search.toLowerCase()) ||
      r.drop.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "All" || r.vehicleClass === filterClass;
    return matchSearch && matchClass;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>

      {/* ── Modals ── */}
      {assignModal && (
        <AssignDriverModal ride={assignModal} onClose={() => setAssignModal(null)} onAssign={handleAssign} />
      )}
      {detailModal && (
        <AvailableRideDetailsModal ride={detailModal} onClose={() => setDetailModal(null)} />
      )}
      {editModal && (
        <EditRideModal ride={editModal} onClose={() => setEditModal(null)} onSave={handleSaveEdit} />
      )}

      {/* ── Page header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Available Rides</h1>
          <p className="ts-page-subtitle">New requests waiting for driver assignment</p>
        </div>
        <span style={{ padding: ".25rem .75rem", borderRadius: "9999px", fontSize: ".72rem", fontWeight: 700, background: "var(--pending-bg)", color: "var(--pending-fg)" }}>
          {rides.length} Pending
        </span>
      </div>

      {/* ── Filter bar ── */}
      <div className="ts-filter-bar">
        <div className="ts-search-bar" style={{ flex: 1, maxWidth: 280 }}>
          <SearchRoundedIcon style={{ fontSize: 14 }} />
          <input placeholder="Search rider, pickup, destination…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div style={{ display: "flex", gap: ".25rem", flexWrap: "wrap" }}>
          {VEHICLE_CLASSES.map(c => (
            <button key={c} className={`ts-filter-chip${filterClass === c ? " ts-active" : ""}`} onClick={() => { setFilterClass(c); setPage(1); }}>{c}</button>
          ))}
        </div>
        <span className="ts-record-count">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Table ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "13%" }} /><col style={{ width: "24%" }} /><col style={{ width: "13%" }} />
              <col style={{ width: "8%" }} /><col style={{ width: "13%" }} /><col style={{ width: "29%" }} />
            </colgroup>
            <thead>
              <tr>
                {["Rider", "Route", "Class", "Status", "Fare", "Actions"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <>
                  <tr style={{ height: ROW_H }}>
                    <td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>No ride requests match your filters.</td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                  ))}
                </>
              ) : (
                <>
                  {paged.map(ride => (
                    <tr key={ride.id} className="ts-tr" style={{ height: ROW_H }}>

                      {/* ── Rider ── */}
                      <td style={TD}>
                        <p style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--text-h)", margin: 0 }}>{ride.rider}</p>
                        <p style={{ fontSize: ".72rem", color: "var(--text-muted)", margin: 0 }}>
                          <PersonRoundedIcon style={{ fontSize: 10, verticalAlign: "middle" }} /> {ride.passengerCount} pax
                        </p>
                      </td>

                      {/* ── Route ── */}
                      <td style={{ ...TD, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "stretch", gap: ".6rem" }}>
                          {/* Icons + connecting line */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: ".1rem", paddingBottom: ".1rem" }}>
                            {/* Purple filled circle for pickup */}
                            <div style={{
                              width: 11, height: 11, borderRadius: "50%",
                              background: "#7c3aed",
                              border: "2.5px solid #ede9fe",
                              flexShrink: 0,
                            }} />
                            {/* Connecting dashed line */}
                            <div style={{ width: 1.5, flex: 1, background: "var(--border)", margin: "3px 0" }} />
                            {/* Green location pin for drop-off */}
                            <LocationOnRoundedIcon style={{ fontSize: 14, color: "#7c3aed", flexShrink: 0, marginBottom: "-2px" }} />
                          </div>
                          {/* Text */}
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: ".3rem", overflow: "hidden", flex: 1 }}>
                            <span style={{ fontSize: ".75rem", color: "var(--text-body)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ride.pickup}</span>
                            <span style={{ fontSize: ".75rem", color: "var(--text-body)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ride.drop}</span>
                          </div>
                        </div>
                      </td>

                      {/* ── Class ── */}
                      <td style={TD}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", padding: ".25rem .6rem", borderRadius: "9999px", background: "var(--bg-inner)", border: "1px solid var(--border)" }}>
                          <DirectionsCarRoundedIcon style={{ fontSize: 13, flexShrink: 0 }} />
                          <span style={{ fontSize: ".72rem", fontWeight: 500, color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 }}>{ride.vehicleClass}</span>
                        </div>
                      </td>

                      {/* ── Status ── */}
                      <td style={TD}><span className="ts-pill ts-pill-pending">Waiting</span></td>

                      {/* ── Fare ── */}
                      <td style={TD}>
                        <span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>${ride.fare}</span>
                      </td>

                      {/* ── Actions ── */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".35rem", flexWrap: "wrap" }}>

                          {/* Assign Driver */}
                          <button
                            className="ts-btn-primary"
                            style={{ fontSize: ".7rem", padding: ".3rem .7rem" }}
                            onClick={() => setAssignModal(ride)}
                          >
                            <PersonRoundedIcon style={{ fontSize: 12 }} /> Assign Driver
                          </button>

                          {/* View Details */}
                          <button
                            className="ts-icon-btn"
                            title="View Details"
                            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }}
                            onClick={() => setDetailModal(ride)}
                          >
                            <VisibilityRoundedIcon style={{ fontSize: 15 }} />
                          </button>

                          {/* Edit Ride */}
                          <button
                            className="ts-icon-btn"
                            title="Edit Ride"
                            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }}
                            onClick={() => setEditModal(ride)}
                          >
                            <EditRoundedIcon style={{ fontSize: 15 }} />
                          </button>

                          {/* View Route */}
                          <button
                            className="ts-icon-btn"
                            title="View Route"
                            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }}
                          >
                            <RouteRoundedIcon style={{ fontSize: 15 }} />
                          </button>

                          {/* Reject */}
                          <button
                            className="ts-icon-btn ts-icon-btn-del"
                            title="Reject Request"
                            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }}
                            onClick={() => handleReject(ride.id)}
                          >
                            <BlockRoundedIcon style={{ fontSize: 15 }} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={safePage} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 100, padding: ".625rem 1rem", borderRadius: ".6rem", background: "#111827", color: "#fff", fontSize: ".78rem", fontWeight: 500, display: "flex", alignItems: "center", gap: ".5rem", boxShadow: "0 4px 20px rgba(0,0,0,.25)" }}>
          <CheckRoundedIcon style={{ fontSize: 14, color: "#34d399" }} /> {toast}
        </div>
      )}
    </div>
  );
}