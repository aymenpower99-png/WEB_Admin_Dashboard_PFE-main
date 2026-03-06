import { useState } from "react";
import NewBookingModal, { type NewBooking, DRIVERS } from "./NewBookingModal";
import './travelsync-design-system.css'


type TripStatus    = "completed" | "scheduled" | "cancelled";
type PaymentStatus = "paid" | "pending" | "refunded";

interface Booking {
  id: string; date: string; time: string; from: string; to: string;
  passengerName: string; passengerPhone: string; driver: string;
  ref: string; vehicle: string; vehicleModel: string;
  tripStatus: TripStatus; paymentStatus: PaymentStatus; amount: string;
}

interface BookingsPageProps { dark: boolean; }

const TRIP_PILL: Record<TripStatus, string> = {
  completed: "ts-pill ts-pill-completed",
  scheduled: "ts-pill ts-pill-scheduled",
  cancelled:  "ts-pill ts-pill-cancelled",
};
const PAY_PILL: Record<PaymentStatus, string> = {
  paid:     "ts-pill ts-pill-active",
  pending:  "ts-pill ts-pill-pending",
  refunded: "ts-pill ts-pill-refunded",
};
const VEHICLE_MODELS: Record<string, string> = {
  "Business Sedan": "Mercedes E-Class",
  "Luxury Van":     "V-Class",
  "Premium SUV":    "Range Rover",
};

let nextId = 10;
function genRef() { return `#${Math.floor(Math.random()*9000+1000)}${String.fromCharCode(65+Math.floor(Math.random()*26))}`; }
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function fmtDate(d: string) {
  if (!d) return "—";
  try { return new Date(d+"T12:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }
  catch { return d; }
}
function fmt12(t: string) {
  if (!t) return "—";
  const [h,m] = t.split(":").map(Number);
  return `${h%12||12}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`;
}
function driverSeed(name: string) { return DRIVERS.find((d)=>d.name===name)?.seed ?? name.replace(/ /g,""); }

const INITIAL: Booking[] = [
  { id:"1", date:"Mar 14, 2025", time:"09:30 AM", from:"CDG Airport",  to:"Paris Center",     passengerName:"Emma Watson",   passengerPhone:"+33 6 11 11 11 11", driver:"Carlos Vega",  ref:"#8452A", vehicle:"Business Sedan", vehicleModel:"Mercedes E-Class", tripStatus:"completed", paymentStatus:"paid",     amount:"€240.00" },
  { id:"2", date:"Mar 16, 2025", time:"02:00 PM", from:"Lyon Station", to:"Geneva Center",    passengerName:"John Smith",    passengerPhone:"+33 6 22 22 22 22", driver:"Amara Diallo", ref:"#8429B", vehicle:"Luxury Van",     vehicleModel:"V-Class",          tripStatus:"scheduled", paymentStatus:"paid",     amount:"€658.00" },
  { id:"3", date:"Mar 18, 2025", time:"05:30 PM", from:"Nice Airport", to:"Cannes",           passengerName:"Emily Chen",    passengerPhone:"",                  driver:"Pavel Novak",  ref:"#8397C", vehicle:"Premium SUV",    vehicleModel:"Range Rover",      tripStatus:"scheduled", paymentStatus:"pending",  amount:"€310.00" },
  { id:"4", date:"Mar 20, 2025", time:"12:00 PM", from:"Paris Center", to:"Brussels Airport", passengerName:"Michael Scott", passengerPhone:"+33 6 44 44 44 44", driver:"Aiko Tanaka",  ref:"#8320D", vehicle:"Business Sedan", vehicleModel:"Audi A6",          tripStatus:"cancelled", paymentStatus:"refunded", amount:"€0.00"   },
];

/* ─── Delete confirm modal ─────────────────────────────────────────────── */
function DeleteConfirm({ booking, onConfirm, onCancel }: { dark: boolean; booking: Booking; onConfirm: ()=>void; onCancel: ()=>void }) {
  return (
    <div className="ts-overlay" onClick={(e)=>e.target===e.currentTarget&&onCancel()}>
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-body items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-xl mx-auto">🗑️</div>
          <div>
            <p className="ts-td-h text-sm font-semibold">Delete booking?</p>
            <p className="ts-muted text-xs mt-1">
              <span className="font-medium">{booking.ref}</span> — {booking.from} → {booking.to}<br/>This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="ts-modal-footer justify-between">
          <button className="ts-btn-ghost flex-1 justify-center" onClick={onCancel}>Cancel</button>
          <button className="ts-btn-danger flex-1" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function BookingsPage({ dark }: BookingsPageProps) {
  const [bookings, setBookings]         = useState<Booking[]>(INITIAL);
  const [showModal, setShowModal]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [statusFilter, setStatus]       = useState("All");
  const [payFilter, setPay]             = useState("All");

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "All" && b.tripStatus    !== statusFilter) return false;
    if (payFilter    !== "All" && b.paymentStatus !== payFilter)    return false;
    return true;
  });

  function handleAdd(nb: NewBooking) {
    const booking: Booking = {
      id: String(nextId++), date: fmtDate(nb.date), time: fmt12(nb.time),
      from: nb.from, to: nb.to, passengerName: nb.passengerName, passengerPhone: nb.passengerPhone,
      driver: nb.driver, ref: genRef(), vehicle: nb.vehicle,
      vehicleModel: VEHICLE_MODELS[nb.vehicle] ?? nb.vehicle,
      tripStatus: "scheduled", paymentStatus: "pending", amount: "—",
    };
    setBookings((prev) => [booking, ...prev]);
  }

  function handleEdit(nb: NewBooking) {
    if (!editTarget) return;
    setBookings((prev) => prev.map((b) => b.id !== editTarget.id ? b : {
      ...b, date: fmtDate(nb.date), time: fmt12(nb.time), from: nb.from, to: nb.to,
      passengerName: nb.passengerName, passengerPhone: nb.passengerPhone,
      driver: nb.driver, vehicle: nb.vehicle, vehicleModel: VEHICLE_MODELS[nb.vehicle] ?? nb.vehicle,
    }));
    setEditTarget(null);
  }

  function toEditForm(b: Booking): NewBooking & { id: string } {
    const rawTime = (() => {
      const match = b.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return "";
      let h = parseInt(match[1]);
      const period = match[3].toUpperCase();
      if (period==="PM"&&h!==12) h+=12;
      if (period==="AM"&&h===12) h=0;
      return `${String(h).padStart(2,"0")}:${match[2]}`;
    })();
    const rawDate = (() => {
      try { const d=new Date(b.date+" 2025"); return isNaN(d.getTime())?"":d.toISOString().split("T")[0]; }
      catch { return ""; }
    })();
    return { id:b.id, date:rawDate, time:rawTime, from:b.from, to:b.to, passengerName:b.passengerName, passengerPhone:b.passengerPhone, driver:b.driver, vehicle:b.vehicle, tripStatus:b.tripStatus, paymentStatus:b.paymentStatus };
  }

  const stats = [
    { label: "Total Trips", value: bookings.length },
    { label: "Completed",   value: bookings.filter((b)=>b.tripStatus==="completed").length },
    { label: "Scheduled",   value: bookings.filter((b)=>b.tripStatus==="scheduled").length },
    { label: "Revenue",     value: "€"+bookings.filter((b)=>b.paymentStatus==="paid").reduce((s,b)=>s+parseFloat(b.amount.replace(/[€,]/g,"")||"0"),0).toLocaleString("en",{minimumFractionDigits:2}) },
  ];

  return (
    <div className="flex flex-col gap-5">
      {showModal  && <NewBookingModal dark={dark} onClose={() => setShowModal(false)}  onAdd={handleAdd} />}
      {editTarget && <NewBookingModal dark={dark} onClose={() => setEditTarget(null)}  onAdd={handleEdit} editBooking={toEditForm(editTarget)} />}
      {deleteTarget && <DeleteConfirm dark={dark} booking={deleteTarget} onConfirm={()=>{setBookings((p)=>p.filter((b)=>b.id!==deleteTarget.id));setDeleteTarget(null);}} onCancel={()=>setDeleteTarget(null)} />}

      {/* Header */}
      <div className="ts-page-header">
        <div>
          <div className="ts-page-title-row">
            <h1 className="ts-page-title">Trips</h1>
            <span className="ts-chip">{bookings.length} total</span>
          </div>
          <p className="ts-page-subtitle">Monitor bookings, revenue and trip performance.</p>
        </div>
        <button className="ts-btn-fab" onClick={() => setShowModal(true)}>
          <span className="text-lg leading-none shrink-0">＋</span>
          <span className="ts-btn-fab-label">New Trip</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="ts-grid-4">
        {stats.map((s) => (
          <div key={s.label} className="ts-card ts-stat-card">
            <span className="ts-stat-label">{s.label}</span>
            <span className="ts-stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ts-filter-bar">
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className="ts-input" style={{ width: "auto" }}>
          <option value="All">All Status</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={payFilter} onChange={(e) => setPay(e.target.value)} className="ts-input" style={{ width: "auto" }}>
          <option value="All">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className="ts-table-wrap">
        <table className="ts-table">
          <thead className="ts-thead">
            <tr>
              {["Date","Route","Driver","Passenger","Vehicle","Status","Payment","Amount",""].map((h) => (
                <th key={h} className="ts-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9}>
                <div className="flex flex-col items-center justify-center py-14 ts-muted">
                  <span className="text-3xl mb-2">🔍</span>
                  <p className="text-sm font-medium">No trips found</p>
                </div>
              </td></tr>
            ) : filtered.map((b) => (
              <tr key={b.id} className="ts-tr">
                <td className="ts-td">
                  <p className="ts-td-h">{b.date}</p>
                  <p className="ts-td-sub">{b.time}</p>
                </td>
                <td className="ts-td">
                  <p className="ts-td-h font-medium">{b.from}</p>
                  <p className="ts-td-sub">→ {b.to}</p>
                </td>
                <td className="ts-td">
                  <div className="flex items-center gap-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driverSeed(b.driver)}`}
                      className="w-6 h-6 rounded-full bg-violet-100 shrink-0" alt={b.driver} />
                    <span className="ts-body text-sm">{b.driver || "—"}</span>
                  </div>
                </td>
                <td className="ts-td">
                  <p className="ts-td-h font-medium">{b.passengerName}</p>
                  <p className="ts-td-sub">{b.ref}</p>
                </td>
                <td className="ts-td">
                  <p className="ts-body text-sm">{b.vehicle}</p>
                  <p className="ts-td-sub">{b.vehicleModel}</p>
                </td>
                <td className="ts-td"><span className={TRIP_PILL[b.tripStatus]}>{cap(b.tripStatus)}</span></td>
                <td className="ts-td"><span className={PAY_PILL[b.paymentStatus]}>{cap(b.paymentStatus)}</span></td>
                <td className="ts-td ts-td-h font-semibold">{b.amount}</td>
                <td className="ts-td">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditTarget(b)} title="Edit" className="ts-icon-btn">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button onClick={() => setDeleteTarget(b)} title="Delete" className="ts-icon-btn ts-icon-btn-del">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}