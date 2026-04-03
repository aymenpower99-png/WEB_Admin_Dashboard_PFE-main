import { useState, type FC, type ReactNode } from "react";
import '../travelsync-design-system.css';
import { Icon } from "./SettingsComponents";
import { icons } from "../settings/settingsTypes";
import type { TabItem } from "../settings/settingsTypes";
import PersonalPanel    from "./PersonalPanel";
import PasswordPanel    from "./PasswordPanel";
import AppearancePanel  from "./AppearancePanel";
import CurrencyPanel    from "./CurrencyPanel";

type TabId = "personal" | "password" | "appearance" | "currency";

const tabs: TabItem[] = [
  { id: "personal",   label: "Personal",   icon: icons.user     },
  { id: "password",   label: "Password",   icon: icons.lock     },
  { id: "appearance", label: "Appearance", icon: icons.palette  },
  { id: "currency",   label: "Currency",   icon: icons.currency },
];

interface SettingsProps { dark: boolean; onToggleDark: () => void; }

const Settings: FC<SettingsProps> = ({ dark, onToggleDark }) => {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const panelMap: Record<TabId, ReactNode> = {
    personal:   <PersonalPanel />,
    password:   <PasswordPanel />,
    appearance: <AppearancePanel dark={dark} onToggleDark={onToggleDark} />,
    currency:   <CurrencyPanel />,
  };

  return (
    <div className="px-6 py-6 h-full overflow-y-auto">
      <div className="mb-5">
        <h1 className="ts-page-title">Settings</h1>
        <p className="ts-page-subtitle">Manage your account, preferences and agency configuration.</p>
      </div>

      <div className="flex gap-1 border-b mb-6" style={{ borderColor: "var(--border)" }}>
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id as TabId)}
            className={`ts-settings-tab${activeTab === t.id ? " ts-active" : ""}`}>
            <span className={activeTab === t.id ? "text-violet-600" : "ts-faint"}>
              <Icon d={t.icon} size={15} sw={1.8} />
            </span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="ts-card" style={{ padding: "1.5rem", minHeight: 460 }}>
        <div key={activeTab} className="ts-settings-panel">
          {panelMap[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default Settings;