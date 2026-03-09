import { useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
interface UpcomingRide {
  id: number;
  rider: string;
  driver: string;
  driverRating: number;
  driverAvatar: string;
  vehicle: string;
  plate: string;
  pickup: string;
  drop: string;
  vehicleType: string;
  date: string;
  time: string;
  fare: number;
  distance: string;
  duration: string;
  passengerCount: number;
}

interface AvailableDriver {
  id: number;
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  status: "available" | "nearby";
  trips: number;
  avatar: string;
}

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS  = 5;
const ROW_H = 96;

/* ─── MOCK DATA ──────────────────────────────────────────────────────── */
const MOCK_UPCOMING: UpcomingRide[] = [
  { id: 1,  rider: "Lina B",    driver: "John D",   driverRating: 4.9, driverAvatar: "JD", vehicle: "Toyota Corolla", plate: "TN-1234-A", pickup: "Tunis-Carthage Airport",  drop: "City Center, Tunis",   vehicleType: "Sedan", date: "Today",    time: "14:30", fare: 28,  distance: "12 km", duration: "22 min", passengerCount: 1 },
  { id: 2,  rider: "Ali K",     driver: "Emily R",  driverRating: 4.7, driverAvatar: "ER", vehicle: "Kia Rio",        plate: "TN-5678-B", pickup: "City Mall, Tunis",        drop: "La Marsa Beach",       vehicleType: "Sedan", date: "Today",    time: "16:00", fare: 32,  distance: "15 km", duration: "28 min", passengerCount: 2 },
  { id: 3,  rider: "Sara M",    driver: "Ahmed K",  driverRating: 4.8, driverAvatar: "AK", vehicle: "Mercedes Vito",  plate: "TN-9012-C", pickup: "Bardo Museum",            drop: "Hammamet Resort",      vehicleType: "Van",   date: "Today",    time: "17:15", fare: 110, distance: "62 km", duration: "52 min", passengerCount: 5 },
  { id: 4,  rider: "Karim T",   driver: "Fatima Z", driverRating: 4.6, driverAvatar: "FZ", vehicle: "Hyundai Tucson", plate: "TN-3456-D", pickup: "Lac Business District",   drop: "Sfax City Center",     vehicleType: "SUV",   date: "Tomorrow", time: "09:00", fare: 95,  distance: "50 km", duration: "45 min", passengerCount: 3 },
  { id: 5,  rider: "Nadia R",   driver: "Rami B",   driverRating: 4.9, driverAvatar: "RB", vehicle: "BMW 5 Series",   plate: "TN-7890-E", pickup: "Sousse Medina",           drop: "Port El Kantaoui",     vehicleType: "Sedan", date: "Tomorrow", time: "11:30", fare: 55,  distance: "14 km", duration: "20 min", passengerCount: 1 },
  { id: 6,  rider: "Youssef A", driver: "John D",   driverRating: 4.9, driverAvatar: "JD", vehicle: "Toyota Corolla", plate: "TN-1234-A", pickup: "Sfax Airport",            drop: "El Mechtel Hotel",     vehicleType: "Sedan", date: "Tomorrow", time: "14:00", fare: 42,  distance: "9 km",  duration: "15 min", passengerCount: 2 },
];

const MOCK_DRIVERS: AvailableDriver[] = [
  { id: 1, name: "John D",   rating: 4.9, vehicle: "Toyota Corolla",  plate: "TN-1234-A", status: "available", trips: 412, avatar: "JD" },
  { id: 2, name: "Emily R",  rating: 4.7, vehicle: "Kia Rio",         plate: "TN-5678-B", status: "nearby",    trips: 289, avatar: "ER" },
  { id: 3, name: "Ahmed K",  rating: 4.8, vehicle: "Mercedes Vito",   plate: "TN-9012-C", status: "available", trips: 631, avatar: "AK" },
  { id: 4, name: "Fatima Z", rating: 4.6, vehicle: "Hyundai Tucson",  plate: "TN-3456-D", status: "available", trips: 178, avatar: "FZ" },
  { id: 5, name: "Rami B",   rating: 4.9, vehicle: "BMW 5 Series",    plate: "TN-7890-E", status: "nearby",    trips: 520, avatar: "RB" },
];

/* ─── SHARED STYLES ──────────────────────────────────────────────────── */
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
  lineHeight: 1.6,
};

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

/* ─── REASSIGN DRIVER MODAL ──────────────────────────────────────────── */
function ReassignDriverModal({ ride, onClose, onReassign }: {
  ride: UpcomingRide; onClose: () => void;
  onReassign: (rideId: number, driver: AvailableDriver) => void;
}) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = MOCK_DRIVERS.filter(d =>
    d.name !== ride.driver &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="ts-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ts-modal ts-modal-scroll" style={{ maxWidth: "28rem" }}>
        <div className="ts-modal-header">
          <div>
            <p style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text-h)" }}>Reassign Driver</p>
            <p style={{ fontSize: ".72rem", color: "var(--text-muted)", marginTop: ".1rem" }}>
              Currently: <strong>{ride.driver}</strong> · {ride.rider}'s ride
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}><CloseRoundedIcon style={{ fontSize: 16 }} /></button>
        </div>
        <div style={{ padding: "1rem 1.5rem .5rem" }}>
          <div className="ts-search-bar">
            <SearchRoundedIcon style={{ fontSize: 14 }} />
            <input placeholder="Search driver or vehicle…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ padding: ".5rem 1.5rem 1rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
          {filtered.map(driver => (
            <div key={driver.id} onClick={() => setSelected(driver.id)} style={{
              display: "flex", alignItems: "center", gap: ".75rem",
              padding: ".75rem", borderRadius: ".6rem", cursor: "pointer",
              border: selected === driver.id ? "1.5px solid #7c3aed" : "1px solid var(--border)",
              background: selected === driver.id ? "var(--brand-soft)" : "var(--bg-inner)",
              transition: "all .15s ease",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: selected === driver.id ? "#ede9fe" : "#e9d5ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".72rem", color: selected === driver.id ? "#6d28d9" : "#7c3aed" }}>
                {driver.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                  <span style={{ fontWeight: 600, fontSize: ".82rem", color: "var(--text-h)" }}>{driver.name}</span>
                  <span style={{ fontSize: ".62rem", fontWeight: 600, padding: ".1rem .4rem", borderRadius: "9999px", background: driver.status === "available" ? "var(--active-bg)" : "#fef3c7", color: driver.status === "available" ? "var(--active-fg)" : "#92400e" }}>
                    {driver.status === "available" ? "Available" : "Nearby"}
                  </span>
                </div>
                <p style={{ fontSize: ".72rem", color: "var(--text-muted)", marginTop: ".1rem" }}>{driver.vehicle} · {driver.plate}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".2rem", justifyContent: "flex-end" }}>
                  <StarRoundedIcon style={{ fontSize: 12, color: "#f59e0b" }} />
                  <span style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--text-h)" }}>{driver.rating}</span>
                </div>
                <p style={{ fontSize: ".68rem", color: "var(--text-faint)", marginTop: ".1rem" }}>{driver.trips} trips</p>
              </div>
              {selected === driver.id && (
                <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckRoundedIcon style={{ fontSize: 12, color: "#fff" }} />
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ fontSize: ".8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem 0" }}>No other drivers available.</p>
          )}
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" disabled={selected === null} onClick={() => { const driver = MOCK_DRIVERS.find(d => d.id === selected)!; onReassign(ride.id, driver); onClose(); }}>
            <SwapHorizRoundedIcon style={{ fontSize: 14 }} /> Confirm Reassignment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT TIME MODAL ────────────────────────────────────────────────── */
function EditTimeModal({ ride, onClose, onSave }: {
  ride: UpcomingRide; onClose: () => void;
  onSave: (rideId: number, date: string, time: string) => void;
}) {
  const [date, setDate] = useState(ride.date === "Today" || ride.date === "Tomorrow" ? "" : ride.date);
  const [time, setTime] = useState(ride.time);

  return (
    <div className="ts-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ts-modal" style={{ maxWidth: "22rem" }}>
        <div className="ts-modal-header">
          <div>
            <p style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text-h)" }}>Change Schedule</p>
            <p style={{ fontSize: ".72rem", color: "var(--text-muted)", marginTop: ".1rem" }}>{ride.rider} · {ride.pickup} → {ride.drop}</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}><CloseRoundedIcon style={{ fontSize: 16 }} /></button>
        </div>
        <div className="ts-modal-body">
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div>
              <label style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: ".35rem" }}>Date</label>
              <div style={{ position: "relative" }}>
                <CalendarTodayRoundedIcon style={{ fontSize: 14, color: "var(--text-muted)", position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)" }} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", paddingLeft: "2.25rem", paddingRight: ".75rem", height: "2.25rem", borderRadius: ".5rem", fontSize: ".82rem", border: "1px solid var(--border)", background: "var(--bg-inner)", color: "var(--text-h)", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: ".35rem" }}>Time</label>
              <div style={{ position: "relative" }}>
                <AccessTimeRoundedIcon style={{ fontSize: 14, color: "var(--text-muted)", position: "absolute", left: ".75rem", top: "50%", transform: "translateY(-50%)" }} />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: "100%", paddingLeft: "2.25rem", paddingRight: ".75rem", height: "2.25rem", borderRadius: ".5rem", fontSize: ".82rem", border: "1px solid var(--border)", background: "var(--bg-inner)", color: "var(--text-h)", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" disabled={!time} onClick={() => { onSave(ride.id, date || ride.date, time); onClose(); }}>
            <CheckRoundedIcon style={{ fontSize: 14 }} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── RIDE DETAILS MODAL ─────────────────────────────────────────────── */
function RideDetailsModal({ ride, onClose }: { ride: UpcomingRide; onClose: () => void }) {
  return (
    <div className="ts-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ts-modal">
        <div className="ts-modal-header">
          <div>
            <p style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text-h)" }}>Ride Details</p>
            <p style={{ fontSize: ".72rem", color: "var(--text-muted)", marginTop: ".1rem" }}>Booking #{ride.id}</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}><CloseRoundedIcon style={{ fontSize: 16 }} /></button>
        </div>
        <div className="ts-modal-body">
          <div className="ts-card-inner" style={{ padding: ".875rem 1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".8rem", color: "#6d28d9" }}>
              {ride.rider.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--text-h)" }}>{ride.rider}</p>
              <p style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{ride.passengerCount} passenger{ride.passengerCount > 1 ? "s" : ""}</p>
            </div>
            <span className="ts-pill ts-pill-active" style={{ marginLeft: "auto" }}>Scheduled</span>
          </div>
          <div className="ts-card-inner" style={{ padding: ".875rem 1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".8rem", color: "#059669" }}>
              {ride.driverAvatar}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--text-h)" }}>{ride.driver}</p>
              <p style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{ride.vehicle} · {ride.plate}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".25rem" }}>
              <StarRoundedIcon style={{ fontSize: 13, color: "#f59e0b" }} />
              <span style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--text-h)" }}>{ride.driverRating}</span>
            </div>
          </div>
          <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
            <div style={{ position: "absolute", left: 7, top: 12, bottom: 12, width: 1, background: "linear-gradient(to bottom, #7c3aed, #a78bfa)" }} />
            <div style={{ marginBottom: ".875rem", position: "relative" }}>
              <div style={{ position: "absolute", left: "-1.5rem", top: ".25rem", width: 10, height: 10, borderRadius: "50%", background: "#7c3aed" }} />
              <p style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-faint)", marginBottom: ".2rem" }}>Pickup</p>
              <p style={{ fontSize: ".82rem", fontWeight: 500, color: "var(--text-h)" }}>{ride.pickup}</p>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "-1.5rem", top: ".25rem", width: 10, height: 10, borderRadius: "50%", border: "2px solid #a78bfa", background: "var(--bg-card)" }} />
              <p style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-faint)", marginBottom: ".2rem" }}>Drop-off</p>
              <p style={{ fontSize: ".82rem", fontWeight: 500, color: "var(--text-h)" }}>{ride.drop}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".5rem" }}>
            {[{ label: "Time", value: `${ride.date} ${ride.time}` }, { label: "Distance", value: ride.distance }, { label: "Duration", value: ride.duration }, { label: "Fare", value: `$${ride.fare}` }].map(s => (
              <div key={s.label} className="ts-card-inner" style={{ padding: ".625rem", textAlign: "center" }}>
                <p style={{ fontSize: ".68rem", color: "var(--text-muted)", marginBottom: ".2rem" }}>{s.label}</p>
                <p style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function UpcomingRidesPage() {
  const [rides,         setRides]         = useState<UpcomingRide[]>(MOCK_UPCOMING);
  const [search,        setSearch]        = useState("");
  const [filterDate,    setFilterDate]    = useState("All");
  const [page,          setPage]          = useState(1);
  const [reassignModal, setReassignModal] = useState<UpcomingRide | null>(null);
  const [editModal,     setEditModal]     = useState<UpcomingRide | null>(null);
  const [detailModal,   setDetailModal]   = useState<UpcomingRide | null>(null);
  const [toast,         setToast]         = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleReassign = (rideId: number, driver: AvailableDriver) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, driver: driver.name, driverAvatar: driver.avatar, vehicle: driver.vehicle, plate: driver.plate, driverRating: driver.rating } : r));
    showToast(`Driver reassigned to ${driver.name}`);
  };

  const handleEditTime = (rideId: number, date: string, time: string) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, date, time } : r));
    showToast("Schedule updated successfully");
  };

  const handleCancel = (rideId: number) => {
    setRides(prev => prev.filter(r => r.id !== rideId));
    showToast("Ride cancelled");
  };

  const DATES = ["All", "Today", "Tomorrow"];

  const filtered = rides.filter(r => {
    const matchSearch =
      r.rider.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.pickup.toLowerCase().includes(search.toLowerCase()) ||
      r.drop.toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate === "All" || r.date === filterDate;
    return matchSearch && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>

      {/* ── Page header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Upcoming Rides</h1>
          <p className="ts-page-subtitle">Scheduled trips with assigned drivers</p>
        </div>
        <span style={{ padding: ".25rem .75rem", borderRadius: "9999px", fontSize: ".72rem", fontWeight: 700, background: "var(--active-bg)", color: "var(--active-fg)" }}>
          {rides.length} Scheduled
        </span>
      </div>

      {/* ── Filter bar ── */}
      <div className="ts-filter-bar">
        <div className="ts-search-bar" style={{ flex: 1, maxWidth: 280 }}>
          <SearchRoundedIcon style={{ fontSize: 14 }} />
          <input placeholder="Search rider, driver, location…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div style={{ display: "flex", gap: ".25rem" }}>
          {DATES.map(d => (
            <button key={d} className={`ts-filter-chip${filterDate === d ? " ts-active" : ""}`} onClick={() => { setFilterDate(d); setPage(1); }}>{d}</button>
          ))}
        </div>
        <span className="ts-record-count">{filtered.length} ride{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Table card (fixed height via ghost rows) ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "13%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr>
                {["Rider", "Driver & Vehicle", "Route", "Schedule", "Fare / Distance", "Actions"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <>
                  <tr style={{ height: ROW_H }}>
                    <td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>No upcoming rides match your filters.</td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                  ))}
                </>
              ) : (
                <>
                  {paged.map(ride => (
                    <tr key={ride.id} className="ts-tr" style={{ height: ROW_H }}>

                      {/* Rider */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".68rem", color: "#6d28d9" }}>
                            {ride.rider.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--text-h)", margin: 0 }}>{ride.rider}</p>
                            <p style={{ fontSize: ".72rem", color: "var(--text-muted)", margin: 0 }}>
                              <PersonRoundedIcon style={{ fontSize: 10, verticalAlign: "middle" }} /> {ride.passengerCount} pax
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Driver */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".68rem", color: "#059669" }}>
                            {ride.driverAvatar}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                              <p style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--text-h)", margin: 0 }}>{ride.driver}</p>
                              <div style={{ display: "flex", alignItems: "center", gap: ".15rem" }}>
                                <StarRoundedIcon style={{ fontSize: 10, color: "#f59e0b" }} />
                                <span style={{ fontSize: ".68rem", color: "var(--text-muted)" }}>{ride.driverRating}</span>
                              </div>
                            </div>
                            <p style={{ fontSize: ".72rem", color: "var(--text-muted)", margin: 0 }}>{ride.vehicle}</p>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td style={{ ...TD, overflow: "hidden" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: ".55rem" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
                            <LocationOnRoundedIcon style={{ fontSize: 13, color: "#7c3aed", marginTop: ".05rem", flexShrink: 0 }} />
                            <span style={{ fontSize: ".75rem", color: "var(--text-body)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ride.pickup}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
                            <FlagRoundedIcon style={{ fontSize: 13, color: "#10b981", marginTop: ".05rem", flexShrink: 0 }} />
                            <span style={{ fontSize: ".75rem", color: "var(--text-body)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ride.drop}</span>
                          </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".35rem", marginBottom: ".35rem" }}>
                          <AccessTimeRoundedIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                          <span style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-h)" }}>{ride.time}</span>
                        </div>
                        <p style={{ fontSize: ".72rem", color: "var(--text-muted)", margin: "0 0 .3rem" }}>{ride.date}</p>
                        <span className="ts-pill ts-pill-active">Scheduled</span>
                      </td>

                      {/* Fare / Distance */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".25rem", marginBottom: ".35rem" }}>
                          <AttachMoneyRoundedIcon style={{ fontSize: 13, color: "#10b981" }} />
                          <span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>${ride.fare}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: ".25rem" }}>
                          <RouteRoundedIcon style={{ fontSize: 12, color: "var(--text-faint)" }} />
                          <span style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{ride.distance} · {ride.duration}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".35rem", flexWrap: "wrap" }}>
                          <button className="ts-btn-primary" style={{ fontSize: ".7rem", padding: ".3rem .7rem" }} onClick={() => setReassignModal(ride)}>
                            <SwapHorizRoundedIcon style={{ fontSize: 12 }} /> Reassign
                          </button>
                          <button className="ts-icon-btn" title="Edit Schedule" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }} onClick={() => setEditModal(ride)}>
                            <EditRoundedIcon style={{ fontSize: 15 }} />
                          </button>
                          <button className="ts-icon-btn" title="View Details" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }} onClick={() => setDetailModal(ride)}>
                            <VisibilityRoundedIcon style={{ fontSize: 15 }} />
                          </button>
                          <button className="ts-icon-btn ts-icon-btn-del" title="Cancel Ride" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }} onClick={() => handleCancel(ride.id)}>
                            <CancelRoundedIcon style={{ fontSize: 15 }} />
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

      {/* ── Modals ── */}
      {reassignModal && <ReassignDriverModal ride={reassignModal} onClose={() => setReassignModal(null)} onReassign={handleReassign} />}
      {editModal     && <EditTimeModal       ride={editModal}     onClose={() => setEditModal(null)}     onSave={handleEditTime} />}
      {detailModal   && <RideDetailsModal    ride={detailModal}   onClose={() => setDetailModal(null)} />}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 100, padding: ".625rem 1rem", borderRadius: ".6rem", background: "#111827", color: "#fff", fontSize: ".78rem", fontWeight: 500, display: "flex", alignItems: "center", gap: ".5rem", boxShadow: "0 4px 20px rgba(0,0,0,.25)", animation: "tsSettingsIn .25s ease" }}>
          <CheckRoundedIcon style={{ fontSize: 14, color: "#34d399" }} /> {toast}
        </div>
      )}
    </div>
  );
}