import { useState } from "react";
import './travelsync-design-system.css'
interface NewBookingModalProps {
  dark: boolean; onClose: () => void; onAdd: (booking: NewBooking) => void;
  editBooking?: NewBooking & { id: string };
}

export interface NewBooking {
  date: string; time: string; from: string; to: string;
  passengerName: string; passengerPhone: string;
  driver: string; vehicle: string;
  tripStatus: "scheduled"|"completed"|"cancelled";
  paymentStatus: "pending"|"paid"|"refunded";
}

const VEHICLES = ["Business Sedan","Luxury Van","Premium SUV"];
const VEHICLE_ICONS: Record<string, string> = { "Business Sedan":"🚗","Luxury Van":"🚐","Premium SUV":"🚙" };

export const DRIVERS = [
  { name:"Carlos Vega",  trips:312, seed:"CarlosVega"  },
  { name:"Amara Diallo", trips:208, seed:"AmaraDiallo" },
  { name:"Pavel Novak",  trips:15,  seed:"PavelNovak"  },
  { name:"Aiko Tanaka",  trips:67,  seed:"AikoTanaka"  },
];

const TIME_SLOTS: string[] = [];
for (let h = 0; h < 24; h++) for (const m of [0,30]) TIME_SLOTS.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
function fmt12(t: string) { if (!t) return ""; const [h,m]=t.split(":").map(Number); return `${h%12||12}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`; }

export default function NewBookingModal({ dark: _, onClose, onAdd, editBooking }: NewBookingModalProps) {
  const isEdit = !!editBooking;
  const [form, setForm] = useState<NewBooking>(editBooking ? {...editBooking} : {
    date:"", time:"", from:"", to:"", passengerName:"", passengerPhone:"",
    driver:"", vehicle:"Business Sedan", tripStatus:"scheduled", paymentStatus:"pending",
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const set = <K extends keyof NewBooking>(k: K, v: NewBooking[K]) => setForm((p) => ({...p,[k]:v}));

  function validate() {
    const e: Record<string,string> = {};
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
    onAdd(form); onClose();
  }

  return (
    <div className="ts-overlay" onClick={(e) => e.target===e.currentTarget&&onClose()}>
      <div className="ts-modal ts-modal-scroll">
        {/* Header */}
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title text-base font-semibold">{isEdit?"Edit booking":"New booking"}</h2>
            <p className="ts-page-subtitle">{isEdit?"Update the booking details.":"Create a new transfer booking."}</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ts-modal-body">
          {/* Route */}
          <div>
            <p className="ts-label">Route</p>
            <div className="relative pl-6 flex flex-col gap-2">
              <div className="ts-route-line" />
              <div className="relative">
                <div className="ts-route-dot-start" />
                <input className={`ts-input${errors.from?" ts-input-error":""}`}
                  placeholder="Pickup — CDG Airport, Terminal 2E" value={form.from}
                  onChange={(e)=>{set("from",e.target.value);setErrors((p)=>({...p,from:""}));}} />
                {errors.from && <span className="ts-err">{errors.from}</span>}
              </div>
              <div className="relative">
                <div className="ts-route-dot-end" />
                <input className={`ts-input${errors.to?" ts-input-error":""}`}
                  placeholder="Drop-off — Hôtel de Crillon, Paris 8e" value={form.to}
                  onChange={(e)=>{set("to",e.target.value);setErrors((p)=>({...p,to:""}));}} />
                {errors.to && <span className="ts-err">{errors.to}</span>}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="ts-label">Date *</label>
              <input type="date" className={`ts-input${errors.date?" ts-input-error":""}`} value={form.date}
                onChange={(e)=>{set("date",e.target.value);setErrors((p)=>({...p,date:""}));}} />
              {errors.date && <span className="ts-err">{errors.date}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="ts-label">Time *</label>
              <select className={`ts-input cursor-pointer${errors.time?" ts-input-error":""}`} value={form.time}
                onChange={(e)=>{set("time",e.target.value);setErrors((p)=>({...p,time:""}));}}>
                <option value="">Select time…</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{fmt12(t)}</option>)}
              </select>
              {errors.time && <span className="ts-err">{errors.time}</span>}
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <p className="ts-label">Vehicle type</p>
            <div className="flex gap-2">
              {VEHICLES.map((v) => (
                <button key={v} type="button" onClick={() => set("vehicle",v)}
                  className={`ts-selector-card${form.vehicle===v?" ts-sel":""}`}>
                  <span className="text-xl">{VEHICLE_ICONS[v]}</span>
                  <span className="text-center leading-tight">{v}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Passenger */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="ts-label">Passenger name *</label>
              <input autoComplete="off" className={`ts-input${errors.passengerName?" ts-input-error":""}`}
                placeholder="Emma Watson" value={form.passengerName}
                onChange={(e)=>{set("passengerName",e.target.value);setErrors((p)=>({...p,passengerName:""}));}} />
              {errors.passengerName && <span className="ts-err">{errors.passengerName}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="ts-label">Phone <span className="ts-faint">(opt.)</span></label>
              <input type="tel" autoComplete="off" className="ts-input"
                placeholder="+33 6 12 34 56 78" value={form.passengerPhone}
                onChange={(e) => set("passengerPhone",e.target.value)} />
            </div>
          </div>

          {/* Driver */}
          <div>
            <p className="ts-label">Assign driver *</p>
            <div className="grid grid-cols-2 gap-2">
              {DRIVERS.map((d) => {
                const sel = form.driver === d.name;
                return (
                  <button key={d.name} type="button"
                    onClick={() => {set("driver",d.name);setErrors((p)=>({...p,driver:""}));}}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all${sel?" ts-selector-card ts-sel":""}`}
                    style={!sel ? { borderColor: "var(--border)" } : {}}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${d.seed}`}
                      className="w-8 h-8 rounded-full bg-violet-100 shrink-0" alt={d.name} />
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${sel?"text-violet-500":"ts-td-h"}`}>{d.name}</p>
                      <p className="ts-muted text-xs">{d.trips} trips</p>
                    </div>
                    {sel && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.driver && <span className="ts-err mt-1 block">{errors.driver}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="ts-modal-footer justify-between">
          <span className="ts-muted text-xs">Fields marked <span className="text-red-500">*</span> are required.</span>
          <div className="flex items-center gap-2">
            <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
            <button className="ts-btn-primary" onClick={handleSubmit}>
              {isEdit ? "✓ Save changes" : "+ Create booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}