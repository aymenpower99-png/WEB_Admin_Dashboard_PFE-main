import { useState } from "react";
import type { DriverProfile } from "../../../api/drivers";

const ACTION_BTN_BASE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 30, height: 30, borderRadius: 7, borderWidth: "1px", borderStyle: "solid",
  borderColor: "var(--border)", background: "var(--bg-card)", cursor: "pointer",
  color: "var(--text-muted)", flexShrink: 0, transition: "all .15s", padding: 0,
};

export const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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

export const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
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
    <button title={title} onClick={onClick} disabled={loading}
      style={{ ...ACTION_BTN_BASE, ...(hovered ? hoverStyle : {}), opacity: loading ? 0.5 : 1 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
    </button>
  );
}

export function DriverInlineRowActions({
  driver: d, actionLoading, onEdit, onDelete, onInfo,
}: {
  driver: DriverProfile;
  actionLoading: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onInfo?: () => void;   // 👁 eye button — only shown when setup_required
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

      {/* 👁 Eye info button — only for setup_required */}
      {d.availabilityStatus === "setup_required" && onInfo && (
        <ActionButton
          title="See what's missing for setup"
          onClick={onInfo}
          hoverStyle={{ background: "#fff7ed", color: "#c2410c", borderColor: "rgba(234,88,12,0.4)" }}
        >
          <IconEye />
        </ActionButton>
      )}

      {/* Edit */}
      <ActionButton
        title="Edit Driver"
        onClick={onEdit}
        hoverStyle={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
      >
        <IconEdit />
      </ActionButton>

      {/* Delete */}
      <ActionButton
        title="Delete Driver"
        onClick={onDelete}
        loading={actionLoading === d.id + "-delete"}
        hoverStyle={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
      >
        <IconDelete />
      </ActionButton>

    </div>
  );
}