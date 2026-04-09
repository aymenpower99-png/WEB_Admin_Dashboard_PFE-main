import { useState } from "react";
import type { AdminUser } from "../../../api/users";

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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const IconResend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

export const IconBlock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
);

export const IconUnblock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

export const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

export function ActionButton({
  title, onClick, hoverStyle, children, loading,
}: {
  title: string; onClick: () => void;
  hoverStyle: React.CSSProperties; children: React.ReactNode; loading?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={loading}
      style={{ ...ACTION_BTN_BASE, ...(hovered ? hoverStyle : {}), opacity: loading ? 0.5 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

export function InlineRowActions({
  user: u,
  actionLoading,
  onEdit,
  onBlock,
  onUnblock,
  onResend,
  onDelete,
}: {
  user: AdminUser;
  actionLoading: string | null;
  onEdit: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onResend: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

      {/* Edit */}
      <ActionButton
        title="Edit user" onClick={onEdit}
        hoverStyle={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
      >
        <IconEdit />
      </ActionButton>

      {/* Resend invite — only for pending, "Send email" button removed */}
      {u.status === "pending" && (
        <ActionButton
          title="Resend invite"
          onClick={onResend}
          loading={actionLoading === u.id + "-resend"}
          hoverStyle={{ background: "#fefce8", color: "#ca8a04", borderColor: "#fde68a" }}
        >
          <IconResend />
        </ActionButton>
      )}

      {/* Block / Unblock */}
      {u.status === "blocked" ? (
        <ActionButton
          title="Unblock user" onClick={onUnblock}
          loading={actionLoading === u.id + "-unblock"}
          hoverStyle={{ background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }}
        >
          <IconUnblock />
        </ActionButton>
      ) : u.status !== "pending" && (
        <ActionButton
          title="Block user" onClick={onBlock}
          loading={actionLoading === u.id + "-block"}
          hoverStyle={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
        >
          <IconBlock />
        </ActionButton>
      )}

      {/* Delete */}
      <ActionButton
        title="Delete user" onClick={onDelete}
        loading={actionLoading === u.id + "-delete"}
        hoverStyle={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
      >
        <IconDelete />
      </ActionButton>

    </div>
  );
}