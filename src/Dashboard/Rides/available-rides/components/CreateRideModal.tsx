import { useState, useEffect, useRef } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { BackendRide, CreateRidePayload } from "../../../../api/rides";
import { ridesApi } from "../../../../api/rides";
import { classesApi } from "../../../../api/classes";
import { usersApi } from "../../../../api/users";
import type { AdminUser } from "../../../../api/users";
import type { VehicleClass } from "../../../../api/classes";

// ─── Design tokens (Light Mode) ────────────────────────────────────────────────
const T = {
  bg: "#ffffff",
  surface: "#f8f9fb",
  surfaceHover: "#f1f3f7",
  border: "#e4e7ee",
  borderFocus: "rgba(109,40,217,0.4)",
  accent: "#7c3aed",
  accentGlow: "rgba(124,58,237,0.15)",
  accentLight: "rgba(124,58,237,0.08)",
  textH: "#111827",
  textSub: "#6b7280",
  textFaint: "#9ca3af",
  red: "#ef4444",
  redBg: "rgba(239,68,68,0.06)",
  r: "16px",
  rSm: "10px",
  rInner: "8px",
  violet: "#7c3aed",
  violetLight: "rgba(124,58,237,0.08)",
  bgInner: "#f8f9fb",
};

// ─── Shared styles ──────────────────────────────────────────────────────────────
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(17,24,39,0.45)",
  backdropFilter: "blur(8px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "1rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: ".65rem", fontWeight: 700,
  letterSpacing: ".1em", textTransform: "uppercase",
  color: T.textFaint, marginBottom: ".35rem", display: "block",
};

const inputBase: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: ".6rem .85rem",
  background: T.bg,
  border: `1.5px solid ${T.border}`,
  borderRadius: T.rSm,
  fontSize: ".83rem", color: T.textH,
  outline: "none",
  transition: "border-color .2s, box-shadow .2s",
  fontFamily: "inherit",
};

// ─── Custom Date Picker ─────────────────────────────────────────────────────────
function DatePicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const selectDay = (d: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputBase,
          borderColor: error ? T.red : open ? T.accent : T.border,
          boxShadow: open ? `0 0 0 3px ${T.accentGlow}` : "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span style={{ color: displayValue ? T.textH : T.textFaint }}>
          {displayValue || "Pick a date"}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textFaint} strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
          background: "#fff",
          border: `1.5px solid ${T.border}`,
          borderRadius: T.r, padding: "1rem", width: 260,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".85rem" }}>
            <button onClick={prevMonth} style={{ background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", color: T.textSub, padding: "4px 6px", borderRadius: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span style={{ fontSize: ".82rem", fontWeight: 700, color: T.textH }}>
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} style={{ background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", color: T.textSub, padding: "4px 6px", borderRadius: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          {/* Day names */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: ".5rem" }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: ".6rem", fontWeight: 700, color: T.textFaint, padding: "3px 0" }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const isSelected = selectedDate?.getDate() === d && selectedDate?.getMonth() === viewMonth && selectedDate?.getFullYear() === viewYear;
              const isToday = today.getDate() === d && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
              return (
                <div key={d} onClick={() => selectDay(d)} style={{
                  textAlign: "center", padding: "5px 0", borderRadius: "7px", cursor: "pointer", fontSize: ".78rem",
                  fontWeight: isSelected ? 700 : 400,
                  background: isSelected ? T.accent : "transparent",
                  color: isSelected ? "#fff" : isToday ? T.accent : T.textH,
                  outline: isToday && !isSelected ? `1.5px solid ${T.accent}` : "none",
                  transition: "background .15s",
                }}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Custom Time Picker ─────────────────────────────────────────────────────────
function TimePicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  const parsedHour = value ? parseInt(value.split(":")[0]) : -1;
  const parsedMin = value ? parseInt(value.split(":")[1]) : -1;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && parsedHour >= 0) {
      setTimeout(() => {
        hourRef.current?.children[parsedHour]?.scrollIntoView({ block: "center" });
        minRef.current?.children[parsedMin]?.scrollIntoView({ block: "center" });
      }, 50);
    }
  }, [open]);

  const selectHour = (h: number) => {
    const mm = parsedMin >= 0 ? String(parsedMin).padStart(2, "0") : "00";
    onChange(`${String(h).padStart(2, "0")}:${mm}`);
  };
  const selectMin = (m: number) => {
    const hh = parsedHour >= 0 ? String(parsedHour).padStart(2, "0") : "00";
    onChange(`${hh}:${String(m).padStart(2, "0")}`);
  };

  const displayHour = parsedHour >= 0 ? parsedHour % 12 || 12 : null;
  const displayAmPm = parsedHour >= 0 ? (parsedHour >= 12 ? "PM" : "AM") : null;
  const displayMin = parsedMin >= 0 ? String(parsedMin).padStart(2, "0") : null;
  const displayValue = displayHour !== null ? `${displayHour}:${displayMin} ${displayAmPm}` : "";

  const scrollStyle: React.CSSProperties = {
    overflowY: "auto", height: 160, scrollbarWidth: "none",
    display: "flex", flexDirection: "column", gap: 2,
  };
  const itemStyle = (active: boolean): React.CSSProperties => ({
    padding: "5px 10px", borderRadius: "7px", cursor: "pointer",
    fontSize: ".8rem", textAlign: "center",
    background: active ? T.accent : "transparent",
    color: active ? "#fff" : T.textSub,
    fontWeight: active ? 700 : 400,
    flexShrink: 0,
    transition: "background .12s",
  });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputBase,
          borderColor: error ? T.red : open ? T.accent : T.border,
          boxShadow: open ? `0 0 0 3px ${T.accentGlow}` : "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span style={{ color: displayValue ? T.textH : T.textFaint }}>
          {displayValue || "Pick a time"}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textFaint} strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
          background: "#fff",
          border: `1.5px solid ${T.border}`,
          borderRadius: T.r, padding: "1rem", width: 200,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}>
          <div style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: ".1em", color: T.textFaint, textTransform: "uppercase", marginBottom: ".6rem" }}>
            Select Time
          </div>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: ".6rem", color: T.textFaint, textAlign: "center", marginBottom: ".3rem" }}>HR</div>
              <div ref={hourRef} style={scrollStyle}>
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} onClick={() => selectHour(h)} style={itemStyle(parsedHour === h)}>
                    {h % 12 || 12}{h < 12 ? "am" : "pm"}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: ".6rem", color: T.textFaint, textAlign: "center", marginBottom: ".3rem" }}>MIN</div>
              <div ref={minRef} style={scrollStyle}>
                {Array.from({ length: 60 }, (_, m) => (
                  <div key={m} onClick={() => selectMin(m)} style={itemStyle(parsedMin === m)}>
                    {String(m).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────────
export function CreateRideModal({
  onClose, onCreate,
}: {
  onClose: () => void;
  onCreate: (ride: BackendRide) => void;
}) {
  const [passengers, setPassengers] = useState<AdminUser[]>([]);
  const [classes, setClasses]       = useState<VehicleClass[]>([]);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});

  const [passengerId, setPassengerId]         = useState("");
  const [classId, setClassId]                 = useState("");
  const [pickupAddress, setPickupAddress]     = useState("");
  const [dropoffAddress, setDropoffAddress]   = useState("");
  const [scheduledDate, setScheduledDate]     = useState("");
  const [scheduledTime, setScheduledTime]     = useState("");
  const [passengerSearch, setPassengerSearch] = useState("");

  useEffect(() => {
    usersApi.getAll().then(res => {
      setPassengers(res.data.filter(u => u.role === "passenger"));
    }).catch(() => {});
    classesApi.getAll().then(res => {
      setClasses(res.filter(c => c.isActive));
    }).catch(() => {});
  }, []);

  const filteredPassengers = passengers.filter(p => {
    const q = passengerSearch.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!passengerId)          e.passenger = "Select a passenger";
    if (!classId)              e.classId   = "Select a class";
    if (!pickupAddress.trim()) e.pickup    = "Required";
    if (!dropoffAddress.trim())e.dropoff   = "Required";
    if (!scheduledDate)        e.date      = "Required";
    if (!scheduledTime)        e.time      = "Required";
    return e;
  };

  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const payload: CreateRidePayload = {
        passenger_id: passengerId,
        class_id: classId,
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        scheduled_at: `${scheduledDate}T${scheduledTime}:00`,
      };
      const newRide = await ridesApi.create(payload);
      onCreate(newRide);
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  const selectedPassenger = passengers.find(p => p.id === passengerId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .crm-scroll::-webkit-scrollbar { width: 4px; }
        .crm-scroll::-webkit-scrollbar-track { background: transparent; }
        .crm-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 99px; }
        .crm-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentGlow} !important; }
        .crm-passenger-row:hover { background: ${T.surfaceHover} !important; }
        .crm-btn-ghost:hover { background: ${T.surface} !important; }
        .crm-select:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentGlow} !important; outline: none; }
        .crm-select option { background: #fff; color: #111827; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{
          width: "100%", maxWidth: 520,
          background: "#ffffff",
          border: `1.5px solid ${T.border}`,
          borderRadius: "20px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex", flexDirection: "column",
        }}>

          {/* Header */}
          <div style={{
            padding: "1.2rem 1.5rem",
            borderBottom: `1.5px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fafbfc",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "10px",
                background: `linear-gradient(135deg, ${T.accent}, #5b21b6)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${T.accentGlow}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: ".95rem", color: T.textH, letterSpacing: "-.01em" }}>New Ride</p>
                <p style={{ margin: 0, fontSize: ".7rem", color: T.textFaint, marginTop: "1px" }}>Book on behalf of a passenger</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: T.surface, border: `1.5px solid ${T.border}`,
              borderRadius: "8px", width: 32, height: 32, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: T.textSub, transition: "background .15s",
            }}>
              <CloseRoundedIcon style={{ fontSize: 15 }} />
            </button>
          </div>

          {/* Body */}
          <div className="crm-scroll" style={{ overflowY: "auto", padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>

            {/* ── Schedule (MOVED TO TOP) ── */}
            <div>
              <label style={labelStyle}>Schedule</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                <div>
                  <DatePicker
                    value={scheduledDate}
                    onChange={v => { setScheduledDate(v); setErrors(e => ({ ...e, date: "" })); }}
                    error={errors.date}
                  />
                  {errors.date && <span style={{ color: T.red, fontSize: ".68rem", marginTop: ".3rem", display: "block" }}>{errors.date}</span>}
                </div>
                <div>
                  <TimePicker
                    value={scheduledTime}
                    onChange={v => { setScheduledTime(v); setErrors(e => ({ ...e, time: "" })); }}
                    error={errors.time}
                  />
                  {errors.time && <span style={{ color: T.red, fontSize: ".68rem", marginTop: ".3rem", display: "block" }}>{errors.time}</span>}
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: T.border, margin: "0 -.1rem" }} />

            {/* ── Passenger ── */}
            <div>
              <label style={labelStyle}>Passenger *</label>
              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: ".5rem",
                border: `1.5px solid ${T.border}`, borderRadius: T.rSm,
                padding: ".55rem .85rem", background: T.bg, marginBottom: ".5rem",
              }}>
                <SearchRoundedIcon style={{ fontSize: 14, color: T.textFaint, flexShrink: 0 }} />
                <input
                  className="crm-input"
                  placeholder="Search by name or email…"
                  value={passengerSearch}
                  onChange={e => setPassengerSearch(e.target.value)}
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: ".82rem", flex: 1, color: T.textH, fontFamily: "inherit" }}
                />
              </div>

              {/* Passenger list */}
              <div className="crm-scroll" style={{
                display: "flex", flexDirection: "column", gap: ".3rem",
                maxHeight: 148, overflowY: "auto",
                border: `1.5px solid ${errors.passenger ? T.red : T.border}`,
                borderRadius: T.rSm, padding: ".4rem",
                background: T.surface,
              }}>
                {filteredPassengers.slice(0, 20).map(p => {
                  const isSel = passengerId === p.id;
                  return (
                    <div key={p.id} className={isSel ? "" : "crm-passenger-row"}
                      onClick={() => { setPassengerId(p.id); setErrors(e => ({ ...e, passenger: "" })); }}
                      style={{
                        display: "flex", alignItems: "center", gap: ".6rem",
                        padding: ".5rem .65rem", borderRadius: T.rInner, cursor: "pointer",
                        background: isSel ? T.violetLight : "transparent",
                        border: `1.5px solid ${isSel ? T.accent : "transparent"}`,
                        transition: "all .15s",
                      }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: isSel ? `linear-gradient(135deg, ${T.accent}, #5b21b6)` : "rgba(0,0,0,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: ".62rem",
                        color: isSel ? "#fff" : T.textSub,
                      }}>
                        {(p.firstName?.[0] ?? "").toUpperCase()}{(p.lastName?.[0] ?? "").toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: ".8rem", color: T.textH }}>{p.firstName} {p.lastName}</p>
                        <p style={{ margin: 0, fontSize: ".67rem", color: T.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email}</p>
                      </div>
                      {isSel && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
                {filteredPassengers.length === 0 && (
                  <div style={{ textAlign: "center", color: T.textFaint, fontSize: ".78rem", padding: ".75rem 0" }}>No passengers found</div>
                )}
              </div>
              {errors.passenger && <span style={{ color: T.red, fontSize: ".68rem", marginTop: ".3rem", display: "block" }}>{errors.passenger}</span>}
            </div>

            {/* ── Vehicle Class (Dropdown) ── */}
            <div>
              <label style={labelStyle}>Vehicle Class *</label>
              <select
                className="crm-select"
                value={classId}
                onChange={e => { setClassId(e.target.value); setErrors(ev => ({ ...ev, classId: "" })); }}
                style={{
                  ...inputBase,
                  borderColor: errors.classId ? T.red : T.border,
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right .85rem center",
                  paddingRight: "2.2rem",
                }}
              >
                <option value="">Select a class…</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.seats} seats</option>
                ))}
              </select>
              {errors.classId && <span style={{ color: T.red, fontSize: ".68rem", marginTop: ".3rem", display: "block" }}>{errors.classId}</span>}
            </div>

            {/* ── Route ── */}
            <div>
              <label style={labelStyle}>Route</label>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {/* Pickup */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)",
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#22c55e", boxShadow: "0 0 8px #22c55e66",
                  }} />
                  <input
                    className="crm-input"
                    placeholder="Pickup address"
                    value={pickupAddress}
                    onChange={e => { setPickupAddress(e.target.value); setErrors(ev => ({ ...ev, pickup: "" })); }}
                    style={{
                      ...inputBase, paddingLeft: "2rem",
                      borderColor: errors.pickup ? T.red : T.border,
                    }}
                  />
                </div>
                {errors.pickup && <span style={{ color: T.red, fontSize: ".68rem" }}>{errors.pickup}</span>}

                {/* Connector line */}
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: "0 .85rem" }}>
                  <div style={{ width: 1, height: 14, background: `linear-gradient(to bottom, #22c55e, ${T.red})`, marginLeft: 3 }} />
                  <span style={{ fontSize: ".65rem", color: T.textFaint }}>direct route</span>
                </div>

                {/* Dropoff */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)",
                    width: 8, height: 8, borderRadius: "2px",
                    background: T.red, boxShadow: `0 0 8px ${T.red}55`,
                  }} />
                  <input
                    className="crm-input"
                    placeholder="Drop-off address"
                    value={dropoffAddress}
                    onChange={e => { setDropoffAddress(e.target.value); setErrors(ev => ({ ...ev, dropoff: "" })); }}
                    style={{
                      ...inputBase, paddingLeft: "2rem",
                      borderColor: errors.dropoff ? T.red : T.border,
                    }}
                  />
                </div>
                {errors.dropoff && <span style={{ color: T.red, fontSize: ".68rem" }}>{errors.dropoff}</span>}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div style={{
            padding: "1rem 1.5rem",
            borderTop: `1.5px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fafbfc", flexShrink: 0,
          }}>
            {selectedPassenger ? (
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "6px",
                  background: `linear-gradient(135deg, ${T.accent}, #5b21b6)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".55rem", fontWeight: 700, color: "#fff",
                }}>
                  {(selectedPassenger.firstName?.[0] ?? "").toUpperCase()}{(selectedPassenger.lastName?.[0] ?? "").toUpperCase()}
                </div>
                <span style={{ fontSize: ".72rem", color: T.textSub }}>
                  {selectedPassenger.firstName} {selectedPassenger.lastName}
                </span>
              </div>
            ) : <div />}

            <div style={{ display: "flex", gap: ".5rem" }}>
              <button className="crm-btn-ghost" onClick={onClose} style={{
                padding: ".55rem 1rem", borderRadius: "10px",
                border: `1.5px solid ${T.border}`, background: "transparent",
                color: T.textSub, fontSize: ".82rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "background .15s",
              }}>
                Cancel
              </button>
              <button onClick={handleCreate} disabled={loading} style={{
                padding: ".55rem 1.25rem", borderRadius: "10px",
                border: "none",
                background: loading ? "rgba(124,58,237,0.35)" : `linear-gradient(135deg, ${T.accent}, #5b21b6)`,
                color: loading ? "rgba(255,255,255,0.6)" : "#fff",
                fontSize: ".82rem", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: loading ? "none" : `0 4px 16px ${T.accentGlow}`,
                transition: "all .2s", display: "flex", alignItems: "center", gap: ".4rem",
              }}>
                {loading ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/><path d="M21 12a9 9 0 01-9 9"/>
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Create Ride
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}