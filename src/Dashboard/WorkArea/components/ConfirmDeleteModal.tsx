import "../../travelsync-design-system.css";

interface Props {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDeleteModal({ isOpen, itemName, onConfirm, onCancel, loading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="ts-modal" style={{ maxWidth: 400 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Confirm Delete</h2>
            <p className="ts-page-subtitle">Are you sure you want to delete this work area?</p>
          </div>
          <button className="ts-modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="ts-modal-body">
          <div style={{
            padding: "1rem",
            background: "var(--bg-inner)",
            borderRadius: ".4rem",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{itemName}</div>
          </div>
          <p style={{ fontSize: ".85rem", color: "var(--text-muted)", marginTop: "1rem" }}>
            This action cannot be undone. All drivers assigned to this work area will be unassigned.
          </p>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className="ts-btn-primary"
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: "#ef4444",
              borderColor: "#ef4444",
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background = "#dc2626";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626";
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background = "#ef4444";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444";
              }
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
