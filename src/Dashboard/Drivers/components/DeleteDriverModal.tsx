import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function DeleteDriverModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="ts-overlay">
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-header">
          <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--text-h)" }}>Remove Driver</p>
          <button className="ts-modal-close" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="ts-modal-body">
          <p style={{ fontSize: ".8rem", color: "var(--text-body)" }}>
            Are you sure you want to remove this driver? This action cannot be undone.
          </p>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-danger" onClick={onConfirm}>Remove</button>
        </div>
      </div>
    </div>
  );
}