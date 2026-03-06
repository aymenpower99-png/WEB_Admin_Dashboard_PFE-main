import MenuRoundedIcon               from "@mui/icons-material/MenuRounded";
import KeyboardArrowDownRoundedIcon  from "@mui/icons-material/KeyboardArrowDownRounded";
import './travelsync-design-system.css';

interface TopNavProps {
  onSearch?: (q: string) => void;
  dark: boolean;
  onToggleSidebar?: () => void;
}

export default function TravelSyncTopNav({ onToggleSidebar }: TopNavProps) {
  return (
    <nav style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.5rem",
    }}>

      {/* LEFT — hamburger only */}
      <button
        onClick={onToggleSidebar}
        style={{
          width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", background: "transparent",
          cursor: "pointer", color: "var(--text-muted)",
          borderRadius: "0.5rem",
        }}
      >
        <MenuRoundedIcon style={{ fontSize: 22 }} />
      </button>

      {/* RIGHT — flag + avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
        <div style={{ width: 1, height: 28, background: "var(--border)", flexShrink: 0, margin: "0 0.25rem" }} />

        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          cursor: "pointer", padding: "0.375rem 0.5rem",
          borderRadius: "0.625rem",
        }}>
          <span style={{ fontSize: "1.1rem" }}>🇬🇧</span>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            overflow: "hidden", background: "#e9d5ff", flexShrink: 0,
          }}>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
              alt="Sarah Lee"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span style={{
            fontSize: "0.8125rem", fontWeight: 600,
            color: "var(--text-h)", whiteSpace: "nowrap",
          }}>
            Sarah Lee (Agency Manager)
          </span>
          <KeyboardArrowDownRoundedIcon style={{ fontSize: 18, color: "var(--text-faint)" }} />
        </div>
      </div>
    </nav>
  );
}