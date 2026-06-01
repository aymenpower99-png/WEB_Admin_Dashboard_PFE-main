import { useState } from "react";

const ACTION_BTN_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: 7,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--border)",
  background: "var(--bg-card)",
  cursor: "pointer",
  color: "var(--text-muted)",
  flexShrink: 0,
  transition: "all .15s",
  padding: 0,
};

export const IconEdit = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const IconDelete = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const IconAdd = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function ActionButton({
  title,
  onClick,
  hoverStyle,
  children,
  loading,
}: {
  title: string;
  onClick: () => void;
  hoverStyle: React.CSSProperties;
  children: React.ReactNode;
  loading?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={loading}
      style={{
        ...ACTION_BTN_BASE,
        ...(hovered ? hoverStyle : {}),
        opacity: loading ? 0.5 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

export function WorkAreaRowActions({
  hasWorkArea,
  onEdit,
  onDelete,
}: {
  hasWorkArea: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <ActionButton
        title={hasWorkArea ? "Edit assignment" : "Assign work area"}
        onClick={onEdit}
        hoverStyle={{
          background: "#eff6ff",
          color: "#2563eb",
          borderColor: "#bfdbfe",
        }}
      >
        {hasWorkArea ? <IconEdit /> : <IconAdd />}
      </ActionButton>
      {hasWorkArea && (
        <ActionButton
          title="Delete work area"
          onClick={onDelete}
          hoverStyle={{
            background: "#fef2f2",
            color: "#dc2626",
            borderColor: "#fecaca",
          }}
        >
          <IconDelete />
        </ActionButton>
      )}
    </div>
  );
}
