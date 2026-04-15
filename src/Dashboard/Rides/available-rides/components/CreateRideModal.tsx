import { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { BackendRide, CreateRidePayload } from "../../../../api/rides";
import { ridesApi } from "../../../../api/rides";
import { classesApi } from "../../../../api/classes";
import { usersApi } from "../../../../api/users";
import type { AdminUser } from "../../../../api/users";
import type { VehicleClass } from "../../../../api/classes";
import {
  T, overlay, modalBase, modalHeader, modalBody, modalFooter,
  btnClose, btnPrimary, btnPrimaryDisabled, btnGhost,
} from "./modal-shared";

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
