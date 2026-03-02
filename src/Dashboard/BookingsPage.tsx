import { useState } from "react";
import NewBookingModal, { type NewBooking, DRIVERS } from "./NewBookingModal";

type TripStatus    = "completed" | "scheduled" | "cancelled";
type PaymentStatus = "paid" | "pending" | "refunded";

interface Booking {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  passengerName: string;
  passengerPhone: string;
  driver: string;
  ref: string;
  vehicle: string;
  vehicleModel: string;
  tripStatus: TripStatus;
  paymentStatus: PaymentStatus;
  amount: string;
}

interface BookingsPageProps {
  dark: boolean;
}

const STATUS_STYLES: Record<TripStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100  text-amber-700",
  cancelled: "bg-red-100    text-red-700",
};
const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid:     "bg-emerald-100 text-emerald-700",
  pending:  "bg-amber-100  text-amber-700",
  refunded: "bg-gray-200   text-gray-600",
};
const VEHICLE_MODELS: Record<string, string> = {
  "Business Sedan": "Mercedes E-Class",
  "Luxury Van":     "V-Class",
  "Premium SUV":    "Range Rover",
};

let nextId = 10;
function genRef() { return `#${Math.floor(Math.random() * 9000 + 1000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`; }
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function fmtDate(d: string) {
  if (!d) return "—";
  try { return new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
}
function fmt12(t: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h < 12 ? "AM" : "PM"}`;
}
function driverSeed(name: string) {
  return DRIVERS.find((d) => d.name === name)?.seed ?? name.replace(/ /g, "");
}

const INITIAL: Booking[] = [
  { id:"1", date:"Mar 14, 2025", time:"09:30 AM", from:"CDG Airport",  to:"Paris Center",     passengerName:"Emma Watson",   passengerPhone:"+33 6 11 11 11 11", driver:"Carlos Vega",  ref:"#8452A", vehicle:"Business Sedan", vehicleModel:"Mercedes E-Class", tripStatus:"completed", paymentStatus:"paid",     amount:"€240.00" },
  { id:"2", date:"Mar 16, 2025", time:"02:00 PM", from:"Lyon Station", to:"Geneva Center",    passengerName:"John Smith",    passengerPhone:"+33 6 22 22 22 22", driver:"Amara Diallo", ref:"#8429B", vehicle:"Luxury Van",     vehicleModel:"V-Class",          tripStatus:"scheduled", paymentStatus:"paid",     amount:"€658.00" },
  { id:"3", date:"Mar 18, 2025", time:"05:30 PM", from:"Nice Airport", to:"Cannes",           passengerName:"Emily Chen",    passengerPhone:"",                  driver:"Pavel Novak",  ref:"#8397C", vehicle:"Premium SUV",    vehicleModel:"Range Rover",      tripStatus:"scheduled", paymentStatus:"pending",  amount:"€310.00" },
  { id:"4", date:"Mar 20, 2025", time:"12:00 PM", from:"Paris Center", to:"Brussels Airport", passengerName:"Michael Scott", passengerPhone:"+33 6 44 44 44 44", driver:"Aiko Tanaka",  ref:"#8320D", vehicle:"Business Sedan", vehicleModel:"Audi A6",          tripStatus:"cancelled", paymentStatus:"refunded", amount:"€0.00"   },
];

// ── Delete confirmation modal ──────────────────────────────────────────────────
function DeleteConfirm({ dark, booking, onConfirm, onCancel }: {
  dark: boolean; booking: Booking; onConfirm: () => void; onCancel: () => void;
}) {
  const bg      = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const heading = dark ? "text-gray-100" : "text-gray-900";
  const muted   = dark ? "text-gray-400" : "text-gray-500";
  const divider = dark ? "border-gray-800" : "border-gray-200";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={`w-full max-w-sm rounded-2xl shadow-2xl border ${bg}`}
        style={{ animation: "modalIn 0.2s ease" }}>
        <div className="px-6 py-5 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-xl">🗑️</div>
          <div>
            <p className={`text-sm font-semibold ${heading}`}>Delete booking?</p>
            <p className={`text-xs mt-1 ${muted}`}>
              <span className="font-medium">{booking.ref}</span> — {booking.from} → {booking.to}<br />
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className={`flex gap-2 px-6 py-4 border-t ${divider}`}>
          <button onClick={onCancel}
            className={`flex-1 py-2 rounded-full text-xs font-medium border transition-colors ${dark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-full text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BookingsPage({ dark }: BookingsPageProps) {
  const [bookings, setBookings]         = useState<Booking[]>(INITIAL);
  const [showModal, setShowModal]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [statusFilter, setStatus]       = useState("All");
  const [payFilter, setPay]             = useState("All");

  // ── theme ──────────────────────────────────────────────────────────────
  const card      = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const heading   = dark ? "text-gray-100"                : "text-gray-900";
  const muted     = dark ? "text-gray-400"                : "text-gray-500";
  const divider   = dark ? "border-gray-800"              : "border-gray-200";
  const thead     = dark ? "bg-gray-800 border-gray-700"  : "bg-gray-50 border-gray-200";
  const rowHover  = dark ? "hover:bg-gray-800/50"         : "hover:bg-gray-50";
  const rowBorder = dark ? "border-gray-800"              : "border-gray-100";
  const tdText    = dark ? "text-gray-300"                : "text-gray-700";
  const tdMuted   = dark ? "text-gray-500"                : "text-gray-400";
  const selectCls = dark ? "bg-gray-800 border-gray-700 text-gray-300 focus:outline-none" : "bg-gray-50 border-gray-200 text-gray-700 focus:outline-none";
  const chip      = dark ? "bg-gray-800 text-gray-300"    : "bg-gray-100 text-gray-500";
  const actionBtn = dark ? "text-gray-500 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100";

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "All" && b.tripStatus    !== statusFilter) return false;
    if (payFilter    !== "All" && b.paymentStatus !== payFilter)    return false;
    return true;
  });

  // ── handlers ──────────────────────────────────────────────────────────
  function handleAdd(nb: NewBooking) {
    const booking: Booking = {
      id:             String(nextId++),
      date:           fmtDate(nb.date),
      time:           fmt12(nb.time),
      from:           nb.from,
      to:             nb.to,
      passengerName:  nb.passengerName,
      passengerPhone: nb.passengerPhone,
      driver:         nb.driver,
      ref:            genRef(),
      vehicle:        nb.vehicle,
      vehicleModel:   VEHICLE_MODELS[nb.vehicle] ?? nb.vehicle,
      tripStatus:     "scheduled",
      paymentStatus:  "pending",
      amount:         "—",
    };
    setBookings((prev) => [booking, ...prev]);
  }

  function handleEdit(nb: NewBooking) {
    if (!editTarget) return;
    setBookings((prev) => prev.map((b) =>
      b.id === editTarget.id ? {
        ...b,
        date:           fmtDate(nb.date),
        time:           fmt12(nb.time),
        from:           nb.from,
        to:             nb.to,
        passengerName:  nb.passengerName,
        passengerPhone: nb.passengerPhone,
        driver:         nb.driver,
        vehicle:        nb.vehicle,
        vehicleModel:   VEHICLE_MODELS[nb.vehicle] ?? nb.vehicle,
      } : b
    ));
    setEditTarget(null);
  }

  function handleDelete(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDeleteTarget(null);
  }

  function toEditForm(b: Booking): NewBooking & { id: string } {
    const rawTime = (() => {
      const match = b.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return "";
      let h = parseInt(match[1]);
      const min = match[2];
      const period = match[3].toUpperCase();
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2,"0")}:${min}`;
    })();
    const rawDate = (() => {
      try {
        const d = new Date(b.date + " 2025");
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split("T")[0];
      } catch { return ""; }
    })();
    return {
      id: b.id,
      date: rawDate,
      time: rawTime,
      from: b.from,
      to: b.to,
      passengerName:  b.passengerName,
      passengerPhone: b.passengerPhone,
      driver:         b.driver,
      vehicle:        b.vehicle,
      tripStatus:     b.tripStatus,
      paymentStatus:  b.paymentStatus,
    };
  }

  const stats = [
    { label: "Total Trips", value: bookings.length },
    { label: "Completed",   value: bookings.filter((b) => b.tripStatus === "completed").length },
    { label: "Scheduled",   value: bookings.filter((b) => b.tripStatus === "scheduled").length },
    { label: "Revenue",     value: "€" + bookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((s, b) => s + parseFloat(b.amount.replace(/[€,]/g, "") || "0"), 0)
        .toLocaleString("en", { minimumFractionDigits: 2 }) },
  ];

  return (
    <div className="flex flex-col gap-5">
      {showModal && (
        <NewBookingModal dark={dark} onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
      {editTarget && (
        <NewBookingModal dark={dark} onClose={() => setEditTarget(null)} onAdd={handleEdit} editBooking={toEditForm(editTarget)} />
      )}
      {deleteTarget && (
        <DeleteConfirm dark={dark} booking={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-semibold ${heading}`}>Trips</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${chip}`}>{bookings.length} total</span>
          </div>
          <p className={`text-xs mt-0.5 ${muted}`}>Monitor bookings, revenue and trip performance.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="group flex items-center overflow-hidden w-10 hover:w-36 focus:w-36 transition-all duration-300 ease-in-out px-3 py-2 rounded-full text-white text-sm font-medium"
          style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
          <span className="text-lg leading-none shrink-0">＋</span>
          <span className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">New Trip</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl border p-5 flex flex-col gap-1 shadow-sm transition-all duration-300 ${card}`}>
            <span className={`text-xs ${muted}`}>{s.label}</span>
            <span className={`text-2xl font-bold ${heading}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`rounded-3xl border p-4 shadow-sm flex items-center gap-3 ${card}`}>
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)}
          className={`px-4 py-2 rounded-xl border text-sm cursor-pointer appearance-none ${selectCls}`}>
          <option value="All">All Status</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={payFilter} onChange={(e) => setPay(e.target.value)}
          className={`px-4 py-2 rounded-xl border text-sm cursor-pointer appearance-none ${selectCls}`}>
          <option value="All">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden ${card}`}>
        <table className="w-full">
          <thead className={`border-b ${thead}`}>
            <tr>
              {["Date", "Route", "Driver", "Passenger", "Vehicle", "Status", "Payment", "Amount", ""].map((h) => (
                <th key={h} className={`px-5 py-4 text-xs font-semibold uppercase tracking-widest text-left ${muted}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9}>
                <div className={`flex flex-col items-center justify-center py-14 ${muted}`}>
                  <span className="text-3xl mb-2">🔍</span>
                  <p className="text-sm font-medium">No trips found</p>
                </div>
              </td></tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className={`border-b transition ${rowBorder} ${rowHover} group`}>
                  <td className="px-5 py-4">
                    <p className={`text-sm font-medium ${heading}`}>{b.date}</p>
                    <p className={`text-xs mt-1 ${tdMuted}`}>{b.time}</p>
                  </td>
                  <td className={`px-5 py-4 text-sm ${tdText}`}>
                    <p className="font-medium">{b.from}</p>
                    <p className={`text-xs ${tdMuted}`}>→ {b.to}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driverSeed(b.driver)}`}
                        className="w-6 h-6 rounded-full bg-violet-100 shrink-0" alt={b.driver} />
                      <span className={`text-sm ${tdText}`}>{b.driver || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className={`text-sm font-medium ${heading}`}>{b.passengerName}</p>
                    <p className={`text-xs ${tdMuted}`}>{b.ref}</p>
                  </td>
                  <td className={`px-5 py-4 text-sm ${tdText}`}>
                    <p>{b.vehicle}</p>
                    <p className={`text-xs ${tdMuted}`}>{b.vehicleModel}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.tripStatus]}`}>
                      {cap(b.tripStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PAYMENT_STYLES[b.paymentStatus]}`}>
                      {cap(b.paymentStatus)}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm font-semibold ${heading}`}>{b.amount}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditTarget(b)}
                        title="Edit"
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${actionBtn}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        title="Delete"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}