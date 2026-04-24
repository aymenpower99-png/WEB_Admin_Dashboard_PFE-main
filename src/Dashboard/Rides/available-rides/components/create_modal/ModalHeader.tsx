import { T } from "./constants";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div style={{
      padding: "1.2rem 1.5rem",
      borderBottom: `1.5px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: T.surface,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "10px",
          background: `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 14px ${T.accentGlow}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: ".95rem", color: T.textH, letterSpacing: "-.01em" }}>New Ride</p>
          <p style={{ margin: 0, fontSize: ".7rem", color: T.textFaint, marginTop: "1px" }}>Book on behalf of a passenger</p>
        </div>
      </div>
      <button onClick={onClose} style={{
        background: T.surface, border: `1.5px solid ${T.border}`,
        borderRadius: "8px", width: 32, height: 32, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: T.textSub, transition: "background .15s",
      }}>
        <CloseRoundedIcon style={{ fontSize: 15 }} />
      </button>
    </div>
  );
}
