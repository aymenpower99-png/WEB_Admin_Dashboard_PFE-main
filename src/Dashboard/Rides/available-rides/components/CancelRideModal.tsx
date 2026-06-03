import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { BackendRide } from "../../../../api/rides";
import { ridesApi, passengerName } from "../../../../api/rides";
import {
  T,
  overlay,
  modalBase,
  modalHeader,
  modalBody,
  modalFooter,
  btnClose,
  btnPrimary,
  btnGhost,
} from "./modal-shared";

/* ════════════════════════════════════════════════════════════════════════════
   CANCEL RIDE MODAL
   ════════════════════════════════════════════════════════════════════════════ */
export function CancelRideModal({
  ride,
  onClose,
  onCancelled,
}: {
  ride: BackendRide;
  onClose: () => void;
  onCancelled: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await ridesApi.cancel(
        ride.id,
        reason.trim() ? { cancellation_reason: reason.trim() } : undefined,
      );
      onCancelled();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={modalBase}>
        <div style={modalHeader}>
          <p
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: T.textH,
              margin: 0,
            }}
          >
            Cancel Ride?
          </p>
          <button style={btnClose} onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 15 }} />
          </button>
        </div>

        <div style={modalBody}>
          <p
            style={{
              fontSize: ".85rem",
              color: T.textSub,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            This action will cancel the ride for{" "}
            <strong style={{ color: T.textH }}>{passengerName(ride)}</strong>.
            The passenger will be notified and refunded according to the
            cancellation policy.
          </p>

          <div>
            <label
              style={{
                fontSize: ".72rem",
                fontWeight: 600,
                color: T.textSub,
                display: "block",
                marginBottom: ".35rem",
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter cancellation reason…"
              rows={3}
              style={{
                width: "100%",
                padding: ".55rem .75rem",
                borderRadius: "8px",
                border: `1px solid ${T.border}`,
                background: T.bgInner,
                fontSize: ".82rem",
                color: T.textH,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div style={modalFooter}>
          <button style={btnGhost} onClick={onClose}>
            Keep Ride
          </button>
          <button
            style={{
              ...btnPrimary,
              background: "#dc2626",
              ...(loading ? { opacity: 0.45, cursor: "not-allowed" } : {}),
            }}
            disabled={loading}
            onClick={handleCancel}
          >
            {loading ? "Cancelling…" : "Cancel Ride"}
          </button>
        </div>
      </div>
    </div>
  );
}
