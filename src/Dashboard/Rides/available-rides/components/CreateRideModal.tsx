import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MapboxAutocomplete from "./MapboxAutocomplete";
import type { BackendRide, CreateRidePayload } from "../../../../api/rides";
import { ridesApi } from "../../../../api/rides";
import { classesApi } from "../../../../api/classes";
import { usersApi } from "../../../../api/users";
import type { AdminUser } from "../../../../api/users";
import type { VehicleClass } from "../../../../api/classes";

// ─── Design tokens (dark-mode safe via CSS vars) ────────────────────────────
const T = {
  bg: "var(--bg-card)",
  surface: "var(--bg-inner)",
  surfaceHover: "var(--bg-thead)",
  border: "var(--border)",
  borderFocus: "rgba(168,85,247,0.4)",
  accent: "#a855f7",
  accentGlow: "rgba(168,85,247,0.18)",
  accentLight: "rgba(168,85,247,0.08)",
  textH: "var(--text-h)",
  textSub: "var(--text-muted)",
  textFaint: "var(--text-faint)",
  red: "#ef4444",
  redBg: "rgba(239,68,68,0.06)",
  r: "16px",
  rSm: "10px",
  rInner: "8px",
  violet: "#a855f7",
  violetLight: "rgba(168,85,247,0.08)",
  bgInner: "var(--bg-inner)",
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

// ─── Schedule Picker (Calendar + Spinner Time) ──────────────────────────────────
function SchedulePicker({
  date, time, onDateChange, onTimeChange, dateError, timeError,
}: {
  date: string; time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  dateError?: string; timeError?: string;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [calOpen, setCalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selDate = date ? new Date(date + "T00:00:00") : null;
  const initH = time ? parseInt(time.split(":")[0]) : today.getHours();
  const initM = time ? Math.round(parseInt(time.split(":")[1]) / 15) * 15 % 60 : 0;
  const [dispH, setDispH] = useState(initH);
  const [dispM, setDispM] = useState(initM);

  useEffect(() => {
    const h = String(dispH).padStart(2, "0");
    const m = String(dispM).padStart(2, "0");
    onTimeChange(`${h}:${m}`);
  }, [dispH, dispM]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (d: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onDateChange(`${viewYear}-${mm}-${dd}`);
    setCalOpen(false);
  };

  const displayDate = selDate
    ? selDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "Pick a date";

  const spinnerBtn: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    color: T.textSub, padding: "2px 6px", borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background .12s",
  };

  const spinnerNum: React.CSSProperties = {
    fontSize: "1.35rem", fontWeight: 700, color: T.textH,
    minWidth: 42, textAlign: "center" as const,
    lineHeight: 1,
  };

  return (
    <div ref={ref}>
      {/* Date + Time combined row */}
      <div style={{
        display: "flex", alignItems: "center", gap: ".5rem",
        border: `1.5px solid ${(dateError || timeError) ? T.red : T.border}`,
        borderRadius: T.rSm, padding: ".45rem .85rem",
        background: T.bg,
      }}>
        {/* Date trigger */}
        <div
          onClick={() => setCalOpen(o => !o)}
          style={{ cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: ".5rem", userSelect: "none" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontSize: ".82rem", color: selDate ? T.textH : T.textFaint }}>
            {displayDate}
          </span>
        </div>

        <div style={{ width: 1, height: 32, background: T.border, flexShrink: 0 }} />

        {/* Time spinners */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          {/* Hours */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button style={spinnerBtn} onClick={() => setDispH(h => (h + 1) % 24)}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
            <span style={spinnerNum}>{String(dispH).padStart(2, "0")}</span>
            <button style={spinnerBtn} onClick={() => setDispH(h => (h - 1 + 24) % 24)}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>

          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: T.textH, paddingBottom: 2 }}>:</span>

          {/* Minutes */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button style={spinnerBtn} onClick={() => setDispM(m => (m + 15) % 60)}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
            <span style={spinnerNum}>{String(dispM).padStart(2, "0")}</span>
            <button style={spinnerBtn} onClick={() => setDispM(m => (m - 15 + 60) % 60)}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar dropdown */}
      {calOpen && (
        <div style={{
          marginTop: 6, zIndex: 200,
          background: T.bg,
          border: `1.5px solid ${T.border}`,
          borderRadius: T.r,
          width: "100%",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          boxSizing: "border-box",
        }}>
          {/* Month/Year header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <button onClick={prevMonth} style={{
              background: T.surface, border: `1px solid ${T.border}`,
              cursor: "pointer", color: T.textSub, padding: "5px 8px", borderRadius: "6px",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span style={{ fontSize: ".88rem", fontWeight: 700, color: T.textH }}>
              {monthNames[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} style={{
              background: T.surface, border: `1px solid ${T.border}`,
              cursor: "pointer", color: T.textSub, padding: "5px 8px", borderRadius: "6px",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Day name headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: ".4rem" }}>
            {dayNames.map(d => (
              <div key={d} style={{
                textAlign: "center", fontSize: ".62rem", fontWeight: 700,
                color: T.textFaint, padding: "3px 0",
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const isSel =
                selDate?.getDate() === d &&
                selDate?.getMonth() === viewMonth &&
                selDate?.getFullYear() === viewYear;
              const isTod =
                today.getDate() === d &&
                today.getMonth() === viewMonth &&
                today.getFullYear() === viewYear;
              return (
                <div
                  key={d}
                  onClick={() => selectDay(d)}
                  style={{
                    textAlign: "center", padding: "6px 0", borderRadius: "8px",
                    cursor: "pointer", fontSize: ".8rem",
                    fontWeight: isSel ? 700 : 400,
                    background: isSel ? T.accent : "transparent",
                    color: isSel ? "#fff" : isTod ? T.accent : T.textH,
                    outline: isTod && !isSel ? `1.5px solid ${T.accent}` : "none",
                    transition: "background .15s",
                  }}
                >
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

// ─── Dispatch Report (inline for CreateRideModal) ────────────────────────────
function DispatchReportInline({ ride }: { ride: BackendRide }) {
  const snap = ride.dispatchSnapshot;
  if (!snap) return null;
  const statusColor = (s: string) => s === "ACCEPTED" ? "#10b981" : s === "REJECTED" ? "#ef4444" : "#f59e0b";
  const noDrivers = snap.totalOffers === 0;
  return (
    <div style={{ background: "rgba(239,68,68,.06)", borderRadius: T.rSm, border: "1px solid rgba(239,68,68,.25)", padding: ".875rem 1rem" }}>
      <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#ef4444", margin: "0 0 .55rem" }}>
        Dispatch Report
      </p>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: ".6rem" }}>
        {[{ label: "Attempts", value: `${snap.attempts} / 3` }, { label: "Offers", value: `${snap.totalOffers}` }, { label: "Result", value: snap.result === "ASSIGNED" ? "Assigned" : "No Driver" }].map(s => (
          <div key={s.label} style={{ flex: "1 1 60px", background: T.bgInner, borderRadius: "8px", border: `1px solid ${T.border}`, padding: ".4rem .5rem", textAlign: "center" }}>
            <p style={{ fontSize: ".58rem", color: T.textFaint, margin: "0 0 .1rem", textTransform: "uppercase" }}>{s.label}</p>
            <p style={{ fontSize: ".78rem", fontWeight: 700, color: T.textH, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>
      {noDrivers ? (
        <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
          🚫 No eligible drivers were online in the service area. All 3 attempts (10→15→20 km) returned 0 candidates.
        </p>
      ) : snap.offers.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
          {snap.offers.map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".3rem .6rem", background: T.bgInner, borderRadius: "6px", border: `1px solid ${T.border}` }}>
              <span style={{ fontSize: ".7rem", color: T.textSub }}>Driver #{o.driverId.slice(0, 6).toUpperCase()}</span>
              <div style={{ display: "flex", gap: ".35rem", alignItems: "center" }}>
                {o.distKm != null && <span style={{ fontSize: ".66rem", color: T.textFaint }}>{o.distKm.toFixed(1)} km</span>}
                <span style={{ fontSize: ".62rem", fontWeight: 700, padding: ".08rem .4rem", borderRadius: "99px", background: `${statusColor(o.status)}22`, color: statusColor(o.status) }}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
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
  const [phase, setPhase]           = useState<"form" | "success">("form");
  const [logs, setLogs]             = useState<{ time: string; msg: string; kind: "ok" | "error" }[]>([]);
  const [createdRide, setCreatedRide] = useState<BackendRide | null>(null);
  const [pollStatus, setPollStatus] = useState<"polling" | "scheduled" | "cancelled" | "searching" | "assigned" | null>(null);
  const [isImmediateRide, setIsImmediateRide] = useState(false);

  // Poll ride status after creation to detect quick cancellations (immediate rides only)
  useEffect(() => {
    if (phase !== "success" || !createdRide) return;

    // Future scheduled rides don't dispatch yet — no need to poll
    if (!isImmediateRide) {
      setPollStatus("scheduled");
      return;
    }

    let stopped = false;
    setPollStatus("polling");

    const poll = async () => {
      for (let i = 0; i < 12; i++) { // 12 × 5s = 60s max
        if (stopped) return;
        await new Promise(r => setTimeout(r, 5000));
        if (stopped) return;
        try {
          const fresh = await ridesApi.getOne(createdRide.id);
          setCreatedRide(fresh);
          if (fresh.status === "CANCELLED") {
            const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const reason = fresh.cancellationReason ?? "Unknown reason";
            setLogs(prev => [...prev, { time, msg: `⚠️ Ride cancelled — ${reason}`, kind: "error" }]);
            setPollStatus("cancelled");
            return;
          }
          if (fresh.status === "ASSIGNED") {
            const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            setLogs(prev => [...prev, { time, msg: "✅ Driver assigned successfully!", kind: "ok" }]);
            setPollStatus("assigned");
            return;
          }
        } catch { /* ignore poll errors */ }
      }
      setPollStatus("searching"); // timed out but still searching
    };
    poll();
    return () => { stopped = true; };
  }, [phase, createdRide?.id, isImmediateRide]);

  const [passengerId, setPassengerId]         = useState("");
  const [classId, setClassId]                 = useState("");
  const [pickupAddress, setPickupAddress]     = useState("");
  const [dropoffAddress, setDropoffAddress]   = useState("");
  const [pickupCoords, setPickupCoords]       = useState<{lat: number; lng: number} | null>(null);
  const [dropoffCoords, setDropoffCoords]     = useState<{lat: number; lng: number} | null>(null);
  const [scheduledDate, setScheduledDate]     = useState("");
  const [scheduledTime, setScheduledTime]     = useState("");
  const [passengerSearch, setPassengerSearch] = useState("");

  useEffect(() => {
    usersApi.getAll().then(res => {
      setPassengers(res.data.filter((u: AdminUser) => u.role === "passenger"));
    }).catch(() => {});
    classesApi.getAll().then(res => {
      setClasses(res.filter((c: VehicleClass) => c.isActive));
    }).catch(() => {});
  }, []);

  const filteredPassengers = passengers.filter(p => {
    const q = passengerSearch.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!passengerId)           e.passenger = "Select a passenger";
    if (!classId)               e.classId   = "Select a class";
    if (!pickupAddress.trim())  e.pickup    = "Required";
    else if (!pickupCoords)     e.pickup    = "Select a location from the dropdown";
    if (!dropoffAddress.trim()) e.dropoff   = "Required";
    else if (!dropoffCoords)    e.dropoff   = "Select a location from the dropdown";
    if (!scheduledDate)         e.date      = "Required";
    if (!scheduledTime)         e.time      = "Required";
    return e;
  };

  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setLogs([]);
    const pushLog = (msg: string, kind: "ok" | "error") => {
      const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLogs(prev => [...prev, { time, msg, kind }]);
    };
    try {
      const payload: CreateRidePayload = {
        passenger_id: passengerId,
        class_id: classId,
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        pickup_lat: pickupCoords?.lat,
        pickup_lon: pickupCoords?.lng,
        dropoff_lat: dropoffCoords?.lat,
        dropoff_lon: dropoffCoords?.lng,
        scheduled_at: `${scheduledDate}T${scheduledTime}:00`,
      };
      const newRide = await ridesApi.create(payload);
      pushLog(`Ride created — ID #${newRide.id.slice(0, 8).toUpperCase()}`, "ok");
      // Auto-confirm: transitions PENDING → SEARCHING_DRIVER (immediate) or stays PENDING (future)
      const confirmed = await ridesApi.confirm(newRide.id);
      const diff = new Date(confirmed.scheduledAt).getTime() - Date.now();
      const immediate = diff <= 60 * 60 * 1000;
      setIsImmediateRide(immediate);
      pushLog(
        immediate
          ? "Ride confirmed — searching for a driver now…"
          : `Ride confirmed — scheduled for ${new Date(confirmed.scheduledAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`,
        "ok",
      );
      if (!immediate) {
        pushLog("Dispatch will start automatically 30 min before the ride time", "ok");
      }
      setCreatedRide(confirmed);
      setPhase("success");
      onCreate(confirmed);
      toast.success("Ride created");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create ride");
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
        .crm-passenger-row:hover { background: ${T.surfaceHover} !important; }
        .crm-btn-ghost:hover { background: ${T.surface} !important; }
        .crm-select:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentGlow} !important; outline: none; }
        .crm-select option { background: var(--bg-card); color: var(--text-h); }
        .crm-input:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentGlow} !important; }
        .crm-spinner-btn:hover { background: ${T.surface} !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cm-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(1.3); } }
      `}</style>

      <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={{
          width: "100%", maxWidth: 520,
          background: T.bg,
          border: `1.5px solid ${T.border}`,
          borderRadius: "20px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex", flexDirection: "column",
        }}>

          {/* ── Header ── */}
          <div style={{
            padding: "1.2rem 1.5rem",
            borderBottom: `1.5px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: T.surface,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "10px",
                background: `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${T.accentGlow}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
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

          {/* ── Body ── */}
          <div className="crm-scroll" style={{ overflowY: "auto", padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>

            {/* ── Success view ── */}
            {phase === "success" && createdRide ? (
              <>
                {/* Success banner */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", padding: "1rem", background: "rgba(16,185,129,.08)", borderRadius: T.rSm, border: "1px solid rgba(16,185,129,.2)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: ".92rem", color: "#10b981", margin: 0 }}>Ride Created Successfully</p>
                  <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>ID #{createdRide.id.slice(0, 8).toUpperCase()}</p>
                </div>

                {/* Route summary */}
                <div style={{ background: T.bgInner, borderRadius: T.rSm, border: `1px solid ${T.border}`, padding: ".875rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginBottom: ".35rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
                    <span style={{ fontSize: ".78rem", color: T.textSub }}>{createdRide.pickupAddress}</span>
                  </div>
                  <div style={{ width: 2, height: 14, background: T.border, marginLeft: "3px", borderRadius: 1, marginBottom: ".35rem" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "2px", background: T.accent }} />
                    <span style={{ fontSize: ".78rem", color: T.textSub }}>{createdRide.dropoffAddress}</span>
                  </div>
                </div>

                {/* Activity log */}
                <div style={{ background: T.bgInner, borderRadius: T.rSm, border: `1px solid ${T.border}`, padding: ".875rem 1rem" }}>
                  <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .65rem" }}>
                    System Activity
                  </p>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {logs.map((log, i) => (
                      <div key={i} style={{ display: "flex", gap: ".65rem", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.kind === "ok" ? "#10b981" : T.red, marginTop: ".2rem", boxShadow: `0 0 0 2px ${log.kind === "ok" ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"}` }} />
                          {i < logs.length - 1 && <div style={{ width: 1, height: 18, background: T.border, marginTop: 2 }} />}
                        </div>
                        <div style={{ paddingBottom: i < logs.length - 1 ? ".3rem" : 0 }}>
                          <p style={{ fontSize: ".76rem", fontWeight: 600, color: T.textH, margin: "0 0 .05rem" }}>{log.msg}</p>
                          <p style={{ fontSize: ".66rem", color: T.textFaint, margin: 0 }}>{log.time}</p>
                        </div>
                      </div>
                    ))}
                    {/* Polling indicator (immediate rides only) */}
                    {pollStatus === "polling" && (
                      <div style={{ display: "flex", gap: ".65rem", alignItems: "flex-start", marginTop: logs.length ? ".1rem" : 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, marginTop: ".2rem", animation: "cm-pulse 1.2s ease-in-out infinite", boxShadow: `0 0 0 2px ${T.accentGlow}` }} />
                        </div>
                        <p style={{ fontSize: ".76rem", color: T.textSub, margin: ".1rem 0 0" }}>Monitoring dispatch status…</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dispatch report if ride was cancelled */}
                {pollStatus === "cancelled" && createdRide?.dispatchSnapshot && (
                  <DispatchReportInline ride={createdRide} />
                )}

                {/* Scheduled future ride info panel */}
                {pollStatus === "scheduled" && createdRide && (
                  <div style={{
                    background: "rgba(20,184,166,0.08)", borderRadius: T.rSm,
                    border: "1px solid rgba(20,184,166,0.25)", padding: ".875rem 1rem",
                    display: "flex", alignItems: "flex-start", gap: ".75rem",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
                      background: "rgba(20,184,166,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 .2rem", fontWeight: 700, fontSize: ".82rem", color: "#0d9488" }}>Ride Scheduled</p>
                      <p style={{ margin: "0 0 .15rem", fontSize: ".74rem", color: T.textSub }}>
                        {new Date(createdRide.scheduledAt).toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}
                      </p>
                      <p style={{ margin: 0, fontSize: ".7rem", color: T.textFaint }}>
                        Driver search will start automatically 30 min before the ride.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
            <>
            {/* ── Schedule ── */}
            <div>
              <label style={labelStyle}>Schedule</label>
              <SchedulePicker
                date={scheduledDate}
                time={scheduledTime}
                onDateChange={v => { setScheduledDate(v); setErrors(e => ({ ...e, date: "" })); }}
                onTimeChange={v => { setScheduledTime(v); setErrors(e => ({ ...e, time: "" })); }}
                dateError={errors.date}
                timeError={errors.time}
              />
              {(errors.date || errors.time) && (
                <span style={{ color: T.red, fontSize: ".68rem", marginTop: ".3rem", display: "block" }}>
                  {errors.date || errors.time}
                </span>
              )}
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: T.border, margin: "0 -.1rem" }} />

            {/* ── Passenger ── */}
            <div>
              <label style={labelStyle}>Passenger *</label>

              <div
                style={{
                  display: "flex", alignItems: "center", gap: ".5rem",
                  border: `1.5px solid ${T.border}`, borderRadius: T.rSm,
                  padding: ".55rem .85rem", background: T.bg, marginBottom: ".5rem",
                  transition: "border-color .2s, box-shadow .2s",
                }}
                onFocus={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = T.accent;
                  el.style.boxShadow = `0 0 0 3px ${T.accentGlow}`;
                }}
                onBlur={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = T.border;
                  el.style.boxShadow = "none";
                }}
              >
                <SearchRoundedIcon style={{ fontSize: 14, color: T.textFaint, flexShrink: 0 }} />
                <input
                  placeholder="Search by name or email…"
                  value={passengerSearch}
                  onChange={e => setPassengerSearch(e.target.value)}
                  style={{
                    border: "none", outline: "none", background: "transparent",
                    fontSize: ".82rem", flex: 1, color: T.textH, fontFamily: "inherit",
                  }}
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
                    <div
                      key={p.id}
                      className={isSel ? "" : "crm-passenger-row"}
                      onClick={() => { setPassengerId(p.id); setErrors(e => ({ ...e, passenger: "" })); }}
                      style={{
                        display: "flex", alignItems: "center", gap: ".6rem",
                        padding: ".5rem .65rem", borderRadius: T.rInner, cursor: "pointer",
                        background: isSel ? T.violetLight : "transparent",
                        border: `1.5px solid ${isSel ? T.accent : "transparent"}`,
                        transition: "all .15s",
                      }}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: isSel ? `linear-gradient(135deg, ${T.accent}, #7c22ce)` : "rgba(0,0,0,0.06)",
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
                  <div style={{ textAlign: "center", color: T.textFaint, fontSize: ".78rem", padding: ".75rem 0" }}>
                    No passengers found
                  </div>
                )}
              </div>
              {errors.passenger && <span style={{ color: T.red, fontSize: ".68rem", marginTop: ".3rem", display: "block" }}>{errors.passenger}</span>}
            </div>

            {/* ── Vehicle Class ── */}
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
                    background: T.accent,
                    boxShadow: `0 0 8px ${T.accentGlow}`,
                    zIndex: 1,
                  }} />
                  <MapboxAutocomplete
                    value={pickupAddress}
                    onChange={v => { setPickupAddress(v); setPickupCoords(null); setErrors(ev => ({ ...ev, pickup: "" })); }}
                    onSelect={place => { setPickupAddress(place.fullAddress); setPickupCoords({ lat: place.lat, lng: place.lng }); setErrors(ev => ({ ...ev, pickup: "" })); }}
                    placeholder="Pickup address"
                    inputClassName="crm-input"
                    inputStyle={{
                      ...inputBase, paddingLeft: "2rem",
                      borderColor: errors.pickup ? T.red : T.border,
                    }}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = T.accent;
                      (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.accentGlow}`;
                    }}
                    onBlur={e => {
                      if (e?.target) {
                        (e.target as HTMLInputElement).style.borderColor = errors.pickup ? T.red : T.border;
                        (e.target as HTMLInputElement).style.boxShadow = "none";
                      }
                    }}
                  />
                </div>
                {errors.pickup && <span style={{ color: T.red, fontSize: ".68rem" }}>{errors.pickup}</span>}

                {/* Connector */}
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: "0 .85rem" }}>
                  <div style={{ width: 1, height: 14, background: `linear-gradient(to bottom, ${T.accent}, ${T.red})`, marginLeft: 3 }} />
                  <span style={{ fontSize: ".65rem", color: T.textFaint }}>direct route</span>
                </div>

                {/* Dropoff */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)",
                    width: 8, height: 8, borderRadius: "2px",
                    background: T.red, boxShadow: `0 0 8px ${T.red}55`,
                    zIndex: 1,
                  }} />
                  <MapboxAutocomplete
                    value={dropoffAddress}
                    onChange={v => { setDropoffAddress(v); setDropoffCoords(null); setErrors(ev => ({ ...ev, dropoff: "" })); }}
                    onSelect={place => { setDropoffAddress(place.fullAddress); setDropoffCoords({ lat: place.lat, lng: place.lng }); setErrors(ev => ({ ...ev, dropoff: "" })); }}
                    placeholder="Drop-off address"
                    inputClassName="crm-input"
                    inputStyle={{
                      ...inputBase, paddingLeft: "2rem",
                      borderColor: errors.dropoff ? T.red : T.border,
                    }}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = T.accent;
                      (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${T.accentGlow}`;
                    }}
                    onBlur={e => {
                      if (e?.target) {
                        (e.target as HTMLInputElement).style.borderColor = errors.dropoff ? T.red : T.border;
                        (e.target as HTMLInputElement).style.boxShadow = "none";
                      }
                    }}
                  />
                </div>
                {errors.dropoff && <span style={{ color: T.red, fontSize: ".68rem" }}>{errors.dropoff}</span>}
              </div>
            </div>
            </>
            )}

          </div>

          {/* ── Footer ── */}
          <div style={{
            padding: "1rem 1.5rem",
            borderTop: `1.5px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: T.surface, flexShrink: 0,
          }}>
            {phase === "success" ? (
              <>
                <p style={{ fontSize: ".72rem", color: T.textFaint, margin: 0 }}>Ride is now active in the system</p>
                <button onClick={onClose} style={{
                  padding: ".55rem 1.25rem", borderRadius: "10px",
                  border: "none",
                  background: `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
                  color: "#fff", fontSize: ".82rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: `0 4px 16px ${T.accentGlow}`,
                }}>
                  Done
                </button>
              </>
            ) : (
              <>
                {selectedPassenger ? (
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "6px",
                      background: `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
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
                    background: loading ? "rgba(168,85,247,0.35)" : `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
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
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/>
                          <path d="M21 12a9 9 0 01-9 9"/>
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Ride
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}