import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import type { BackendRide } from "../../../../api/rides";
import { ridesApi, passengerName, fmtDate, fmtTime } from "../../../../api/rides";
import {
  T, overlay, modalBase, modalHeader, modalBody, modalFooter,
  btnClose, btnPrimary, btnPrimaryDisabled, btnGhost, cardInner,
  RouteCard, StatsGrid, FareCard,
} from "./modal-shared";

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

          <FareCard fare={ride.priceFinal} fareEstimate={ride.priceEstimate} />

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
          <button style={loading ? btnPrimaryDisabled : btnPrimary} disabled={loading} onClick={handleDispatch}>
            <SendRoundedIcon style={{ fontSize: 14 }} /> {loading ? "Dispatching…" : "Force Dispatch"}
          </button>
        </div>
      </div>
    </div>
  );
}
