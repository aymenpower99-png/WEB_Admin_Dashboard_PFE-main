import { useState } from "react";
import type { DriverProfile } from "../../../api/drivers";

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

export const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/** Wrench icon — shown when driver status is setup_required */
export const IconSetupRequired = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
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

export function DriverInlineRowActions({
  driver: d,
  actionLoading,
  onEdit,
  onDelete,
}: {
  driver: DriverProfile;
  actionLoading: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

      {/* Edit — shows wrench icon when setup_required, pencil otherwise */}
      <ActionButton
        title={d.availabilityStatus === "setup_required" ? "Setup Required — Edit Driver" : "Edit Driver"}
        onClick={onEdit}
        hoverStyle={
          d.availabilityStatus === "setup_required"
            ? { background: "#fff7ed", color: "#c2410c", borderColor: "rgba(234,88,12,0.4)" }
            : { background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }
        }
      >
        {d.availabilityStatus === "setup_required" ? <IconSetupRequired /> : <IconEdit />}
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