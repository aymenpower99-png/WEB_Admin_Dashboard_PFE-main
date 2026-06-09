import { useState } from "react";

interface Props {
  dark: boolean;
  articleTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  dark,
  articleTitle,
  onClose,
  onConfirm,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      setDeleting(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className={dark ? "dark" : ""}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-sidebar)",
          borderRadius: 20,
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: 400,
          boxShadow: "var(--shadow-modal)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "22px 28px 18px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-inner)",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 800,
              color: "var(--text-h)",
              letterSpacing: "-.01em",
            }}
          >
            Delete Article
          </h2>
        </div>

        {/* Modal body */}
        <div
          style={{
            padding: "24px 28px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete <strong>"{articleTitle}"</strong>?
          </p>
        </div>

        {/* Modal footer */}
        <div
          style={{
            padding: "16px 28px 22px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            background: "var(--bg-inner)",
            borderRadius: "0 0 20px 20px",
          }}
        >
          <button
            onClick={onClose}
            disabled={deleting}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: deleting ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            style={{
              padding: "10px 22px",
              borderRadius: 10,
              fontSize: 13,
              background: deleting ? "var(--brand-soft)" : "#dc2626",
              color: deleting ? "var(--text-muted)" : "#fff",
              border: "none",
              cursor: deleting ? "wait" : "pointer",
              fontWeight: 700,
              fontFamily: "inherit",
            }}
          >
            {deleting ? "Deleting…" : "Delete Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
