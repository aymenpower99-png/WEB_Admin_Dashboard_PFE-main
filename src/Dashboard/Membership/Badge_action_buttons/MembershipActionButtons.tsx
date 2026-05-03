import { useState } from "react";
import type { MembershipLevel } from "../../../api/membershipLevels";

const ACTION_BTN_BASE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 30, height: 30, borderRadius: 7, borderWidth: "1px", borderStyle: "solid",
  borderColor: "var(--border)", background: "var(--bg-card)", cursor: "pointer",
  color: "var(--text-muted)", flexShrink: 0, transition: "all .15s", padding: 0,
};

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconToggleOn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
    <circle cx="16" cy="12" r="3" fill="currentColor" stroke="none"/>
  </svg>
);

const IconToggleOff = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
    <circle cx="8" cy="12" r="3" fill="currentColor" stroke="none"/>
  </svg>
);

function ActionButton({
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

export function MembershipInlineRowActions({
  level,
  actionLoading,
  onEdit,
  onToggle,
}: {
  level: MembershipLevel;
  actionLoading: string | null;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

      {/* Edit */}
      <ActionButton
        title="Edit Level"
        onClick={onEdit}
        hoverStyle={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}
      >
        <IconEdit />
      </ActionButton>

      {/* Toggle active / inactive */}
      <ActionButton
        title={level.isActive ? "Deactivate Level" : "Activate Level"}
        onClick={onToggle}
        loading={actionLoading === level.id + "-toggle"}
        hoverStyle={
          level.isActive
            ? { background: "#fff7ed", color: "#c2410c", borderColor: "rgba(234,88,12,0.4)" }
            : { background: "#f0fdf4", color: "#16a34a", borderColor: "rgba(22,163,74,0.4)"  }
        }
      >
        {level.isActive ? <IconToggleOn /> : <IconToggleOff />}
      </ActionButton>

    </div>
  );
}
