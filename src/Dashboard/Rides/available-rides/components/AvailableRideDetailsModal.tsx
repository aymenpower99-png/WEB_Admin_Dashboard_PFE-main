import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import type { BackendRide } from "../../../../api/rides";
import { passengerName, statusLabel, fmtDate, fmtTime } from "../../../../api/rides";
import {
  T, overlay, modalBase, modalHeader, modalBody, modalFooter,
  btnClose, btnPrimary, btnGhost, cardInner,
  RouteCard, StatsGrid, FareCard,
} from "./modal-shared";

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

          <FareCard fare={ride.priceFinal} fareEstimate={ride.priceEstimate} />
        </div>

        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>Cancel</button>
          <button style={btnPrimary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
