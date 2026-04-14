import { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import type {
  BackendRide,
  CreateRidePayload,
  RideVehicleClass,
} from "../../../api/rides";
import {
  ridesApi,
  passengerName,
  statusLabel,
  fmtDate,
  fmtTime,
} from "../../../api/rides";
import { classesApi } from "../../../api/classes";
import { usersApi } from "../../../api/users";
import type { AdminUser } from "../../../api/users";
import type { VehicleClass } from "../../../api/classes";

/* ─── Design tokens ──────────────────────────────────────────────────── */
const T = {
  violet:       "#7c3aed",
  violetLight:  "#ede9fe",
  violetMid:    "#a78bfa",
  violetBorder: "#ddd6fe",
  violetGrad:   "linear-gradient(135deg,#ede9fe 0%,#e0e7ff 100%)",
  textH:        "#111827",
  textSub:      "#6b7280",
  textFaint:    "#9ca3af",
  border:       "#e5e7eb",
  bgModal:      "#ffffff",
  bgOverlay:    "rgba(17,24,39,.45)",
  bgInner:      "#f9fafb",
  rModal:       "16px",
  rInner:       "10px",
  rPill:        "9999px",
};

/* ─── Shared styles ──────────────────────────────────────────────────── */
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: T.bgOverlay,
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: "1rem",
};

const modalBase: React.CSSProperties = {
  background: T.bgModal, borderRadius: T.rModal,
  boxShadow: "0 20px 60px rgba(0,0,0,.18)",
  width: "100%", maxWidth: "480px",
  display: "flex", flexDirection: "column",
  maxHeight: "90vh", overflow: "hidden",
};

const modalHeader: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", justifyContent: "space-between",
  padding: "1.25rem 1.5rem 1rem",
  borderBottom: `1px solid ${T.border}`,
};

const modalBody: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  display: "flex", flexDirection: "column", gap: "1rem",
  overflowY: "auto",
};

const modalFooter: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: ".75rem",
  padding: "1rem 1.5rem",
  borderTop: `1px solid ${T.border}`,
};

const btnClose: React.CSSProperties = {
  width: 28, height: 28, borderRadius: "50%",
  border: `1px solid ${T.border}`, background: "transparent",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: T.textSub, flexShrink: 0,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: T.violet, color: "#fff", border: "none", borderRadius: "8px",
  padding: ".55rem 1.25rem", fontSize: ".82rem", fontWeight: 600, cursor: "pointer",
};

const btnPrimaryDisabled: React.CSSProperties = {
  ...btnPrimary, opacity: .45, cursor: "not-allowed",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: ".4rem",
  background: "transparent", color: T.textSub, border: "none", borderRadius: "8px",
  padding: ".55rem .9rem", fontSize: ".82rem", fontWeight: 500, cursor: "pointer",
};

const cardInner: React.CSSProperties = {
  background: T.bgInner, borderRadius: T.rInner, border: `1px solid ${T.border}`,
};

/* ─── Shared sub-components ──────────────────────────────────────────── */
function RouteCard({ pickup, drop }: { pickup: string; drop: string }) {
  return (
    <div style={{ ...cardInner, padding: "1rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", marginBottom: ".75rem" }}>
        <RadioButtonCheckedRoundedIcon style={{ fontSize: 16, color: T.violet, flexShrink: 0, marginTop: ".1rem" }} />
        <div>
          <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .15rem" }}>
            Pickup Location
          </p>
          <p style={{ fontSize: ".85rem", fontWeight: 600, color: T.textH, margin: 0 }}>{pickup}</p>
        </div>
      </div>
      <div style={{ marginLeft: "5px", marginBottom: ".75rem" }}>
        <div style={{ width: 2, height: 20, background: `linear-gradient(to bottom,${T.violet},${T.violetMid})`, borderRadius: 2, marginLeft: "2px" }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
        <FmdGoodRoundedIcon style={{ fontSize: 16, color: T.violet, flexShrink: 0, marginTop: ".1rem" }} />
        <div>
          <p style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .15rem" }}>
            Drop-off Location
          </p>
          <p style={{ fontSize: ".85rem", fontWeight: 600, color: T.textH, margin: 0 }}>{drop}</p>
        </div>
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: { label: string; value: string; icon: React.ReactNode }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)`, gap: ".5rem" }}>
      {stats.map((s) => (
        <div key={s.label} style={{ ...cardInner, padding: ".625rem", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: ".25rem" }}>{s.icon}</div>
          <p style={{ fontSize: ".63rem", color: T.textFaint, margin: "0 0 .2rem", letterSpacing: ".04em", textTransform: "uppercase" }}>{s.label}</p>
          <p style={{ fontSize: ".8rem", fontWeight: 700, color: T.textH, margin: 0 }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function FareCard({ fare }: { fare: number | null }) {
  return (
    <div style={{
      background: T.violetGrad, borderRadius: T.rInner, border: `1px solid ${T.violetBorder}`,
      padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <p style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: T.violet, margin: 0 }}>Total Fare</p>
      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: T.violet }}>{fare != null ? `${fare} TND` : "—"}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1. FORCE DISPATCH MODAL (admin override — dispatch is normally automatic)
   ════════════════════════════════════════════════════════════════════════════ */
export function DispatchRideModal({
  ride, onClose, onDispatch,
}: {
  ride: BackendRide;
  onClose: () => void;
  onDispatch: (rideId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const needsConfirm = ride.status === "PENDING";

  const handleDispatch = async () => {
    setLoading(true);
    try {
      if (needsConfirm) {
        await ridesApi.confirm(ride.id);
      }
      await ridesApi.triggerDispatch(ride.id);
      onDispatch(ride.id);
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Dispatch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBase}>

        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Force Dispatch</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              RIDE ID: <span style={{ color: T.violet, fontWeight: 700 }}>{ride.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        <div style={modalBody}>
          <div style={{ ...cardInner, padding: ".75rem 1rem", background: "#fef3c7", border: "1px solid #fde68a" }}>
            <p style={{ fontSize: ".75rem", color: "#92400e", margin: 0, fontWeight: 600 }}>
              ⚠ Manual override — dispatch is handled automatically by the system.
              Use this only if a ride appears stuck or needs immediate attention.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{passengerName(ride)}</p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem", border: `1.5px dashed ${T.violetBorder}`, background: T.violetLight }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Driver</p>
              <p style={{ fontWeight: 600, fontSize: ".82rem", color: T.violetMid, margin: 0 }}>Auto-assign</p>
            </div>
          </div>

          <RouteCard pickup={ride.pickupAddress} drop={ride.dropoffAddress} />

          <StatsGrid stats={[
            { label: "Date",     value: fmtDate(ride.scheduledAt), icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Time",     value: fmtTime(ride.scheduledAt), icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Distance", value: ride.distanceKm ? `${ride.distanceKm} km` : "—", icon: <RouteRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
            { label: "Duration", value: ride.durationMin ? `${ride.durationMin} min` : "—", icon: <AccessTimeRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
          ]} />

          <FareCard fare={ride.priceFinal} />

          {needsConfirm && (
            <div style={{ ...cardInner, padding: ".75rem 1rem", background: "#fef3c7", border: "1px solid #fde68a" }}>
              <p style={{ fontSize: ".75rem", color: "#92400e", margin: 0, fontWeight: 600 }}>
                ⚠ This ride is PENDING. It will be confirmed automatically before dispatch.
              </p>
            </div>
          )}

          <div style={{ ...cardInner, padding: ".75rem 1rem" }}>
            <p style={{ fontSize: ".75rem", color: T.textSub, margin: 0 }}>
              This will immediately trigger the dispatch pipeline, bypassing the automatic scheduler.
              The system will find the best available driver based on distance, rating, and vehicle class.
            </p>
          </div>
        </div>

        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button
            style={loading ? btnPrimaryDisabled : btnPrimary}
            disabled={loading}
            onClick={handleDispatch}
          >
            <SendRoundedIcon style={{ fontSize: 14 }} /> {loading ? "Dispatching…" : "Force Dispatch"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. AVAILABLE RIDE DETAILS MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function AvailableRideDetailsModal({
  ride, onClose,
}: {
  ride: BackendRide;
  onClose: () => void;
}) {
  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBase}>

        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Ride Details</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              RIDE ID: <span style={{ color: T.violet, fontWeight: 700 }}>{ride.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        <div style={modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Rider</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .2rem" }}>{passengerName(ride)}</p>
              <p style={{ fontSize: ".72rem", color: T.textSub, margin: 0 }}>
                <PersonRoundedIcon style={{ fontSize: 11, verticalAlign: "middle" }} /> {ride.passenger?.email ?? ""}
              </p>
            </div>
            <div style={{ ...cardInner, padding: ".875rem 1rem" }}>
              <p style={{ fontSize: ".68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: T.textFaint, margin: "0 0 .3rem" }}>Class</p>
              <p style={{ fontWeight: 700, fontSize: ".88rem", color: T.textH, margin: "0 0 .25rem" }}>{ride.vehicleClass?.name ?? "—"}</p>
              <span style={{
                fontSize: ".65rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: T.rPill,
                background: "#fef3c7", color: "#d97706", textTransform: "uppercase", letterSpacing: ".04em",
              }}>
                {statusLabel(ride.status)}
              </span>
            </div>
          </div>

          <RouteCard pickup={ride.pickupAddress} drop={ride.dropoffAddress} />

          <StatsGrid stats={[
            { label: "Date",     value: fmtDate(ride.scheduledAt), icon: <CalendarTodayRoundedIcon style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Time",     value: fmtTime(ride.scheduledAt), icon: <AccessTimeRoundedIcon    style={{ fontSize: 14, color: T.textFaint }} /> },
            { label: "Distance", value: ride.distanceKm ? `${ride.distanceKm} km` : "—", icon: <RouteRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
            { label: "Duration", value: ride.durationMin ? `${ride.durationMin} min` : "—", icon: <AccessTimeRoundedIcon style={{ fontSize: 14, color: T.violet }} /> },
          ]} />

          <FareCard fare={ride.priceFinal} />
        </div>

        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. CREATE RIDE MODAL (admin creates ride for a passenger)
   ════════════════════════════════════════════════════════════════════════════ */
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

  const [passengerId, setPassengerId]     = useState("");
  const [classId, setClassId]             = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
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
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
           p.email.toLowerCase().includes(q);
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!passengerId) e.passenger = "Select a passenger";
    if (!classId)     e.classId   = "Select a class";
    if (!pickupAddress.trim())  e.pickup  = "Required";
    if (!dropoffAddress.trim()) e.dropoff = "Required";
    if (!scheduledDate) e.date = "Required";
    if (!scheduledTime) e.time = "Required";
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

  const inputStyle: React.CSSProperties = {
    padding: ".45rem .7rem", borderRadius: ".4rem",
    border: `1px solid ${T.border}`, background: T.bgInner,
    fontSize: ".82rem", color: T.textH,
    outline: "none", width: "100%", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: ".05em", color: T.textFaint,
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...modalBase, maxWidth: "520px" }}>

        <div style={modalHeader}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: T.textH, margin: 0 }}>Create New Ride</p>
            <p style={{ fontSize: ".72rem", color: T.textSub, marginTop: ".25rem", marginBottom: 0 }}>
              Book a ride on behalf of a passenger
            </p>
          </div>
          <button style={btnClose} onClick={onClose}><CloseRoundedIcon style={{ fontSize: 15 }} /></button>
        </div>

        <div style={modalBody}>
          {/* Passenger selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={labelStyle}>Passenger *</label>
            <div style={{
              display: "flex", alignItems: "center", gap: ".5rem",
              border: `1px solid ${errors.passenger ? "#ef4444" : T.border}`, borderRadius: T.rInner,
              padding: ".4rem .7rem", background: T.bgInner,
            }}>
              <SearchRoundedIcon style={{ fontSize: 14, color: T.textFaint }} />
              <input placeholder="Search passengers…" value={passengerSearch}
                onChange={e => setPassengerSearch(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: ".82rem", flex: 1, color: T.textH }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", maxHeight: 140, overflowY: "auto", marginTop: ".25rem" }}>
              {filteredPassengers.slice(0, 20).map(p => {
                const isSel = passengerId === p.id;
                return (
                  <div key={p.id} onClick={() => { setPassengerId(p.id); setErrors(e => ({ ...e, passenger: "" })); }}
                    style={{
                      display: "flex", alignItems: "center", gap: ".6rem",
                      padding: ".5rem .6rem", borderRadius: T.rInner, cursor: "pointer",
                      border: `1.5px solid ${isSel ? T.violet : T.border}`,
                      background: isSel ? T.violetLight : T.bgInner, transition: "all .15s",
                    }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                      background: isSel ? T.violet : T.violetLight,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: ".65rem", color: isSel ? "#fff" : T.violet,
                    }}>
                      {(p.firstName?.[0] ?? "").toUpperCase()}{(p.lastName?.[0] ?? "").toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: ".8rem", color: T.textH }}>{p.firstName} {p.lastName}</p>
                      <p style={{ margin: 0, fontSize: ".68rem", color: T.textSub }}>{p.email}</p>
                    </div>
                  </div>
                );
              })}
              {filteredPassengers.length === 0 && (
                <p style={{ textAlign: "center", color: T.textFaint, fontSize: ".78rem", padding: ".5rem 0" }}>No passengers found.</p>
              )}
            </div>
            {errors.passenger && <span style={{ color: "#ef4444", fontSize: ".7rem" }}>{errors.passenger}</span>}
          </div>

          {/* Vehicle class */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label style={labelStyle}>Vehicle Class *</label>
            <select value={classId} onChange={e => { setClassId(e.target.value); setErrors(ev => ({ ...ev, classId: "" })); }}
              style={{ ...inputStyle, borderColor: errors.classId ? "#ef4444" : T.border }}>
              <option value="">Select a class…</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.seats} seats)</option>)}
            </select>
            {errors.classId && <span style={{ color: "#ef4444", fontSize: ".7rem" }}>{errors.classId}</span>}
          </div>

          {/* Route */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <label style={labelStyle}>Route</label>
            <input placeholder="Pickup address" value={pickupAddress}
              onChange={e => { setPickupAddress(e.target.value); setErrors(ev => ({ ...ev, pickup: "" })); }}
              style={{ ...inputStyle, borderColor: errors.pickup ? "#ef4444" : T.border }} />
            {errors.pickup && <span style={{ color: "#ef4444", fontSize: ".7rem" }}>{errors.pickup}</span>}
            <input placeholder="Drop-off address" value={dropoffAddress}
              onChange={e => { setDropoffAddress(e.target.value); setErrors(ev => ({ ...ev, dropoff: "" })); }}
              style={{ ...inputStyle, borderColor: errors.dropoff ? "#ef4444" : T.border }} />
            {errors.dropoff && <span style={{ color: "#ef4444", fontSize: ".7rem" }}>{errors.dropoff}</span>}
          </div>

          {/* Schedule */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
              <label style={labelStyle}>Date *</label>
              <input type="date" value={scheduledDate}
                onChange={e => { setScheduledDate(e.target.value); setErrors(ev => ({ ...ev, date: "" })); }}
                style={{ ...inputStyle, borderColor: errors.date ? "#ef4444" : T.border }} />
              {errors.date && <span style={{ color: "#ef4444", fontSize: ".7rem" }}>{errors.date}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
              <label style={labelStyle}>Time *</label>
              <input type="time" value={scheduledTime}
                onChange={e => { setScheduledTime(e.target.value); setErrors(ev => ({ ...ev, time: "" })); }}
                style={{ ...inputStyle, borderColor: errors.time ? "#ef4444" : T.border }} />
              {errors.time && <span style={{ color: "#ef4444", fontSize: ".7rem" }}>{errors.time}</span>}
            </div>
          </div>
        </div>

        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={loading ? btnPrimaryDisabled : btnPrimary} disabled={loading} onClick={handleCreate}>
            {loading ? "Creating…" : "+ Create Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}
