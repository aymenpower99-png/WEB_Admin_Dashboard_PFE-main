import { useState, type FC } from "react";
import { Icon, SectionHead, SaveBtn } from "./SettingsComponents";
import { icons } from "./settingsTypes";

interface AppearancePanelProps { dark: boolean; onToggleDark: () => void; }

const AppearancePanel: FC<AppearancePanelProps> = ({ dark, onToggleDark }) => {
  const [saved, setSaved] = useState(false);
  const current: "light" | "dark" = dark ? "dark" : "light";
  const handleSelect = (id: "light" | "dark") => { if (id === current) return; onToggleDark(); };
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const themeCardBase: React.CSSProperties = {
    flex: 1, maxWidth: 200, display: "flex", flexDirection: "column",
    borderRadius: "1rem", overflow: "hidden", background: "none",
    cursor: "pointer", padding: 0,
  };

  return (
    <div>
      <SectionHead title="Appearance" desc="Customize the look and feel of your workspace." />
      <p className="ts-section-label mb-4">Theme</p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {/* Light card */}
        <button type="button" onClick={() => handleSelect("light")}
          style={{ ...themeCardBase, border: current === "light" ? "2px solid #7c3aed" : "2px solid #e2e8f0" }}>
          <div style={{ height: 90, background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 28, height: 7, borderRadius: 4, background: "#e2e8f0" }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#ddd6fe" }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 40, height: 50, borderRadius: 6, background: "#ede9fe" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
                <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0", width: "80%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#e2e8f0", width: "60%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#e2e8f0", width: "70%" }} />
              </div>
            </div>
          </div>
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: current === "light" ? "#7c3aed" : "var(--text-muted)" }}>
                <Icon d={icons.sun} size={15} sw={1.8} />
              </span>
              <span style={{ fontSize: ".8rem", fontWeight: current === "light" ? 700 : 500, color: current === "light" ? "#7c3aed" : "var(--text-h)" }}>Light</span>
            </div>
            {current === "light" && (
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icons.check} size={9} stroke="white" sw={3} />
              </div>
            )}
          </div>
        </button>

        {/* Dark card */}
        <button type="button" onClick={() => handleSelect("dark")}
          style={{ ...themeCardBase, border: current === "dark" ? "2px solid #7c3aed" : "2px solid #2d2a40" }}>
          <div style={{ height: 90, background: "#1e1b2e", borderBottom: "1px solid #2d2a40", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 28, height: 7, borderRadius: 4, background: "#2d2a40" }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#4c1d95" }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 40, height: 50, borderRadius: 6, background: "#3b1f6b" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
                <div style={{ height: 6, borderRadius: 3, background: "#2d2a40", width: "80%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#2d2a40", width: "60%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#2d2a40", width: "70%" }} />
              </div>
            </div>
          </div>
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e1b2e" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: current === "dark" ? "#7c3aed" : "var(--text-muted)" }}>
                <Icon d={icons.moon} size={15} sw={1.8} />
              </span>
              <span style={{ fontSize: ".8rem", fontWeight: current === "dark" ? 700 : 500, color: current === "dark" ? "#7c3aed" : "#9CA3AF" }}>Dark</span>
            </div>
            {current === "dark" && (
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icons.check} size={9} stroke="white" sw={3} />
              </div>
            )}
          </div>
        </button>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "#ede9fe", marginBottom: "1.5rem" }}>
        <span style={{ color: "#7c3aed" }}>
          <Icon d={current === "dark" ? icons.moon : icons.sun} size={12} sw={2} />
        </span>
        <span style={{ fontSize: ".72rem", fontWeight: 600, color: "#7c3aed" }}>
          {current === "dark" ? "Dark mode active" : "Light mode active"}
        </span>
      </div>

      <div className="flex justify-end">
        <SaveBtn onClick={save} saved={saved} />
      </div>
    </div>
  );
};

export default AppearancePanel;