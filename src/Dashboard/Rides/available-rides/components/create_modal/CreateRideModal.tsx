import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { BackendRide, CreateRidePayload } from "../../../../../api/rides";
import { ridesApi } from "../../../../../api/rides";
import { classesApi } from "../../../../../api/classes";
import { usersApi } from "../../../../../api/users";
import type { AdminUser } from "../../../../../api/users";
import type { VehicleClass } from "../../../../../api/classes";
import { T, overlay, labelStyle } from "./constants";
import { SchedulePicker } from "./SchedulePicker";
import { ModalHeader } from "./ModalHeader";
import { ModalFooter } from "./ModalFooter";
import { SuccessView } from "./SuccessView";
import { PassengerSelector } from "./PassengerSelector";
import { RouteInputs } from "./RouteInputs";
import { VehicleClassSelector } from "./VehicleClassSelector";

// ─── Main Modal ─────────────────────────────────────────────────────────────────
export function CreateRideModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (ride: BackendRide) => void;
}) {
  const [passengers, setPassengers] = useState<AdminUser[]>([]);
  const [classes, setClasses] = useState<VehicleClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [logs, setLogs] = useState<
    { time: string; msg: string; kind: "ok" | "error" }[]
  >([]);
  const [createdRide, setCreatedRide] = useState<BackendRide | null>(null);
  const [pollStatus, setPollStatus] = useState<
    "polling" | "scheduled" | "cancelled" | "searching" | "assigned" | null
  >(null);
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
      for (let i = 0; i < 12; i++) {
        // 12 × 5s = 60s max
        if (stopped) return;
        await new Promise((r) => setTimeout(r, 5000));
        if (stopped) return;
        try {
          const fresh = await ridesApi.getOne(createdRide.id);
          setCreatedRide(fresh);
          if (fresh.status === "CANCELLED") {
            const time = new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const reason = fresh.cancellationReason ?? "Unknown reason";
            setLogs((prev) => [
              ...prev,
              { time, msg: ` Ride cancelled — ${reason}`, kind: "error" },
            ]);
            setPollStatus("cancelled");
            return;
          }
          if (fresh.status === "ASSIGNED") {
            const time = new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            setLogs((prev) => [
              ...prev,
              { time, msg: " Driver assigned successfully!", kind: "ok" },
            ]);
            setPollStatus("assigned");
            return;
          }
        } catch {
          /* ignore poll errors */
        }
      }
      setPollStatus("searching"); // timed out but still searching
    };
    poll();
    return () => {
      stopped = true;
    };
  }, [phase, createdRide?.id, isImmediateRide]);

  const [passengerId, setPassengerId] = useState("");
  const [classId, setClassId] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [passengerSearch, setPassengerSearch] = useState("");

  useEffect(() => {
    usersApi
      .getAll()
      .then((res) => {
        setPassengers(
          res.data.filter((u: AdminUser) => u.role === "passenger"),
        );
      })
      .catch(() => {});
    classesApi
      .getAll()
      .then((res) => {
        setClasses(res.filter((c: VehicleClass) => c.isActive));
      })
      .catch(() => {});
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!passengerId) e.passenger = "Select a passenger";
    if (!classId) e.classId = "Select a class";
    if (!pickupAddress.trim()) e.pickup = "Required";
    else if (!pickupCoords) e.pickup = "Select a location from the dropdown";
    if (!dropoffAddress.trim()) e.dropoff = "Required";
    else if (!dropoffCoords) e.dropoff = "Select a location from the dropdown";
    if (!scheduledDate) e.date = "Required";
    if (!scheduledTime) e.time = "Required";
    return e;
  };

  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setLogs([]);
    const pushLog = (msg: string, kind: "ok" | "error") => {
      const time = new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLogs((prev) => [...prev, { time, msg, kind }]);
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
      pushLog(
        `Ride created — ID #${newRide.id.slice(0, 8).toUpperCase()}`,
        "ok",
      );
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
        pushLog(
          "Dispatch will start automatically 30 min before the ride time",
          "ok",
        );
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

  const selectedPassenger = passengers.find((p) => p.id === passengerId);

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

      <div
        style={overlay}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: T.bg,
            border: `1.5px solid ${T.border}`,
            borderRadius: "20px",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
            fontFamily: "'DM Sans', sans-serif",
            overflow: "hidden",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Header ── */}
          <ModalHeader onClose={onClose} />

          {/* ── Body ── */}
          <div
            className="crm-scroll"
            style={{
              overflowY: "auto",
              padding: "1.4rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              flex: 1,
            }}
          >
            {/* ── Success view ── */}
            {phase === "success" && createdRide ? (
              <SuccessView
                createdRide={createdRide}
                logs={logs}
                pollStatus={pollStatus}
              />
            ) : (
              <>
                {/* ── Schedule ── */}
                <div>
                  <label style={labelStyle}>Schedule</label>
                  <SchedulePicker
                    date={scheduledDate}
                    time={scheduledTime}
                    onDateChange={(v) => {
                      setScheduledDate(v);
                      setErrors((e) => ({ ...e, date: "" }));
                    }}
                    onTimeChange={(v) => {
                      setScheduledTime(v);
                      setErrors((e) => ({ ...e, time: "" }));
                    }}
                    dateError={errors.date}
                    timeError={errors.time}
                  />
                  {(errors.date || errors.time) && (
                    <span
                      style={{
                        color: T.red,
                        fontSize: ".68rem",
                        marginTop: ".3rem",
                        display: "block",
                      }}
                    >
                      {errors.date || errors.time}
                    </span>
                  )}
                </div>

                {/* ── Divider ── */}
                <div
                  style={{
                    height: 1,
                    background: T.border,
                    margin: "0 -.1rem",
                  }}
                />

                {/* ── Passenger ── */}
                <PassengerSelector
                  passengers={passengers}
                  passengerId={passengerId}
                  passengerSearch={passengerSearch}
                  error={errors.passenger}
                  onPassengerIdChange={(id) => {
                    setPassengerId(id);
                    setErrors((e) => ({ ...e, passenger: "" }));
                  }}
                  onSearchChange={setPassengerSearch}
                  onClearError={() =>
                    setErrors((e) => ({ ...e, passenger: "" }))
                  }
                />

                {/* ── Vehicle Class ── */}
                <VehicleClassSelector
                  classes={classes}
                  classId={classId}
                  error={errors.classId}
                  onClassIdChange={(id) => {
                    setClassId(id);
                    setErrors((ev) => ({ ...ev, classId: "" }));
                  }}
                  onClearError={() =>
                    setErrors((ev) => ({ ...ev, classId: "" }))
                  }
                />

                {/* ── Route ── */}
                <RouteInputs
                  pickupAddress={pickupAddress}
                  dropoffAddress={dropoffAddress}
                  pickupError={errors.pickup}
                  dropoffError={errors.dropoff}
                  onPickupChange={(v) => {
                    setPickupAddress(v);
                    setPickupCoords(null);
                    setErrors((ev) => ({ ...ev, pickup: "" }));
                  }}
                  onDropoffChange={(v) => {
                    setDropoffAddress(v);
                    setDropoffCoords(null);
                    setErrors((ev) => ({ ...ev, dropoff: "" }));
                  }}
                  onPickupSelect={(place) => {
                    setPickupAddress(place.fullAddress);
                    setPickupCoords({ lat: place.lat, lng: place.lng });
                    setErrors((ev) => ({ ...ev, pickup: "" }));
                  }}
                  onDropoffSelect={(place) => {
                    setDropoffAddress(place.fullAddress);
                    setDropoffCoords({ lat: place.lat, lng: place.lng });
                    setErrors((ev) => ({ ...ev, dropoff: "" }));
                  }}
                  onClearPickupError={() =>
                    setErrors((ev) => ({ ...ev, pickup: "" }))
                  }
                  onClearDropoffError={() =>
                    setErrors((ev) => ({ ...ev, dropoff: "" }))
                  }
                />
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <ModalFooter
            phase={phase}
            loading={loading}
            selectedPassenger={selectedPassenger || null}
            onClose={onClose}
            onCreate={handleCreate}
          />
        </div>
      </div>
    </>
  );
}