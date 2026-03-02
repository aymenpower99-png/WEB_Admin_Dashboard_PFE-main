import { useState } from "react";

interface NewBookingModalProps {
  dark: boolean;
  onClose: () => void;
  onAdd: (booking: NewBooking) => void;
  editBooking?: NewBooking & { id: string };
}

export interface NewBooking {
  date: string;
  time: string;
  from: string;
  to: string;
  passengerName: string;
  passengerPhone: string;
  driver: string;
  vehicle: string;
  tripStatus: "scheduled" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
}

const VEHICLES = ["Business Sedan", "Luxury Van", "Premium SUV"];
const VEHICLE_ICONS: Record<string, string> = {
  "Business Sedan": "🚗",
  "Luxury Van": "🚐",
  "Premium SUV": "🚙",
};

export const DRIVERS = [
  { name: "Carlos Vega",  trips: 312, seed: "CarlosVega"  },
  { name: "Amara Diallo", trips: 208, seed: "AmaraDiallo" },
  { name: "Pavel Novak",  trips: 15,  seed: "PavelNovak"  },
  { name: "Aiko Tanaka",  trips: 67,  seed: "AikoTanaka"  },
];

const TIME_SLOTS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    TIME_SLOTS.push(`${hh}:${mm}`);
  }
}

function fmt12(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export default function NewBookingModal({ dark, onClose, onAdd, editBooking }: NewBookingModalProps) {
  const isEdit = !!editBooking;
  const [form, setForm] = useState<NewBooking>(
    editBooking ? { ...editBooking } : {
      date: "", time: "", from: "", to: "",
      passengerName: "", passengerPhone: "",
      driver: "", vehicle: "Business Sedan",
      tripStatus: "scheduled", paymentStatus: "pending",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof NewBooking>(k: K, v: NewBooking[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const bg      = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const heading = dark ? "text-gray-100" : "text-gray-900";
  const muted   = dark ? "text-gray-400" : "text-gray-500";
  const divider = dark ? "border-gray-800" : "border-gray-200";
  const lbl     = dark ? "text-gray-400" : "text-gray-600";
  const inp     = dark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-violet-500"
    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400";

  function validate() {
    const e: Record<string, string> = {};
    if (!form.from.trim())          e.from          = "Required";
    if (!form.to.trim())            e.to            = "Required";
    if (!form.date)                 e.date          = "Required";
    if (!form.time)                 e.time          = "Required";
    if (!form.passengerName.trim()) e.passengerName = "Required";
    if (!form.driver)               e.driver        = "Please assign a driver";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd(form);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border ${bg}`}
        style={{ animation: "modalIn 0.2s ease", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${divider} sticky top-0 z-10 ${dark ? "bg-gray-900" : "bg-white"}`}>
          <div>
            <h2 className={`text-base font-semibold ${heading}`}>{isEdit ? "Edit booking" : "New booking"}</h2>
            <p className={`text-xs mt-0.5 ${muted}`}>{isEdit ? "Update the booking details." : "Create a new transfer booking."}</p>
          </div>
          <button onClick={onClose}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors ${dark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Route */}
          <div>
            <p className={`text-xs font-medium mb-2 ${lbl}`}>Route</p>
            <div className="relative pl-6 flex flex-col gap-2">
              <div className="absolute left-[7px] top-[10px] bottom-[10px] w-px"
                style={{ background: "linear-gradient(to bottom, #7c3aed, #a78bfa)" }} />
              <div className="relative">
                <div className="absolute -left-6 top-2.5 w-3 h-3 rounded-full bg-violet-500" />
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inp} ${errors.from ? "border-red-400" : ""}`}
                  placeholder="Pickup — CDG Airport, Terminal 2E"
                  value={form.from}
                  onChange={(e) => { set("from", e.target.value); setErrors((p) => ({ ...p, from: "" })); }}
                />
                {errors.from && <span className="text-xs text-red-500">{errors.from}</span>}
              </div>
              <div className="relative">
                <div className={`absolute -left-6 top-2.5 w-3 h-3 rounded-full border-2 border-violet-400 ${dark ? "bg-gray-900" : "bg-white"}`} />
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inp} ${errors.to ? "border-red-400" : ""}`}
                  placeholder="Drop-off — Hôtel de Crillon, Paris 8e"
                  value={form.to}
                  onChange={(e) => { set("to", e.target.value); setErrors((p) => ({ ...p, to: "" })); }}
                />
                {errors.to && <span className="text-xs text-red-500">{errors.to}</span>}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-medium ${lbl}`}>Date *</label>
              <input type="date"
                className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inp} ${errors.date ? "border-red-400" : ""}`}
                value={form.date}
                onChange={(e) => { set("date", e.target.value); setErrors((p) => ({ ...p, date: "" })); }}
              />
              {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-medium ${lbl}`}>Time *</label>
              <select
                className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors cursor-pointer appearance-none ${inp} ${errors.time ? "border-red-400" : ""}`}
                value={form.time}
                onChange={(e) => { set("time", e.target.value); setErrors((p) => ({ ...p, time: "" })); }}
              >
                <option value="">Select time…</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{fmt12(t)}</option>
                ))}
              </select>
              {errors.time && <span className="text-xs text-red-500">{errors.time}</span>}
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <p className={`text-xs font-medium mb-2 ${lbl}`}>Vehicle type</p>
            <div className="flex gap-2">
              {VEHICLES.map((v) => {
                const sel = form.vehicle === v;
                return (
                  <button key={v} type="button" onClick={() => set("vehicle", v)}
                    className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      sel ? "border-violet-500 text-violet-500"
                          : dark ? "border-gray-700 text-gray-400 hover:border-gray-600"
                               : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                    style={sel ? { background: dark ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.06)" } : {}}>
                    <span className="text-xl">{VEHICLE_ICONS[v]}</span>
                    <span className="text-center leading-tight">{v}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Passenger */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-medium ${lbl}`}>Passenger name *</label>
              <input
                autoComplete="off"
                className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inp} ${errors.passengerName ? "border-red-400" : ""}`}
                placeholder="Emma Watson"
                value={form.passengerName}
                onChange={(e) => { set("passengerName", e.target.value); setErrors((p) => ({ ...p, passengerName: "" })); }}
              />
              {errors.passengerName && <span className="text-xs text-red-500">{errors.passengerName}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-medium ${lbl}`}>Phone <span className={muted}>(opt.)</span></label>
              <input type="tel" autoComplete="off"
                className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inp}`}
                placeholder="+33 6 12 34 56 78"
                value={form.passengerPhone}
                onChange={(e) => set("passengerPhone", e.target.value)}
              />
            </div>
          </div>

          {/* Assign Driver */}
          <div>
            <p className={`text-xs font-medium mb-2 ${lbl}`}>Assign driver *</p>
            <div className="grid grid-cols-2 gap-2">
              {DRIVERS.map((d) => {
                const sel = form.driver === d.name;
                return (
                  <button key={d.name} type="button"
                    onClick={() => { set("driver", d.name); setErrors((p) => ({ ...p, driver: "" })); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      sel ? "border-violet-500"
                          : dark ? "border-gray-700 hover:border-gray-600"
                               : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={sel ? { background: dark ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.06)" } : {}}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${d.seed}`}
                      className="w-8 h-8 rounded-full bg-violet-100 shrink-0" alt={d.name}
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${sel ? "text-violet-500" : heading}`}>{d.name}</p>
                      <p className={`text-xs ${muted}`}>{d.trips} trips</p>
                    </div>
                    {sel && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.driver && <span className="text-xs text-red-500 mt-1 block">{errors.driver}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${divider} sticky bottom-0 ${dark ? "bg-gray-900" : "bg-white"}`}>
          <span className={`text-xs ${muted}`}>Fields marked <span className="text-red-500">*</span> are required.</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${dark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
              {isEdit ? "✓ Save changes" : "+ Create booking"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}