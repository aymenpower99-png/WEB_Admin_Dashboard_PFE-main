import "../../travelsync-design-system.css";

interface Props { userName: string; onConfirm: () => void; onClose: () => void; loading: boolean; }

export default function DeleteConfirmModal({ userName, onConfirm, onClose, loading }: Props) {
  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-header">
          <p style={{ fontWeight:700, fontSize:".88rem", color:"var(--text-h)" }}>Delete User</p>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body">
          <p style={{ fontSize:".85rem", color:"var(--text-body)" }}>
            Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="ts-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}