import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function RemoveModal({ onConfirm, onClose, loading }: {
  onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  return (
    <div className="ts-overlay">
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-header">
          <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--text-h)" }}>Remove Vehicle</p>
          <button className="ts-modal-close" onClick={onClose} disabled={loading}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="ts-modal-body">
          <p style={{ fontSize: ".82rem", color: "var(--text-body)", margin: 0 }}>
            Are you sure you want to remove this vehicle? This action cannot be undone.
          </p>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="ts-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}