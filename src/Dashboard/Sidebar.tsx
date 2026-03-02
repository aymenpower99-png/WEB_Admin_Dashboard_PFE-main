import DashboardRoundedIcon      from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon      from "@mui/icons-material/PeopleAltRounded";
import FlightTakeoffRoundedIcon  from "@mui/icons-material/FlightTakeoffRounded";
import PaymentsRoundedIcon       from "@mui/icons-material/PaymentsRounded";
import HeadsetMicRoundedIcon     from "@mui/icons-material/HeadsetMicRounded";
import TuneRoundedIcon           from "@mui/icons-material/TuneRounded";
import ShieldRoundedIcon         from "@mui/icons-material/ShieldRounded";
import { NAV_ITEMS, NAV_SUPPORT, type NavItem } from "./constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard:   <DashboardRoundedIcon fontSize="small" />,
  people:      <PeopleAltRoundedIcon fontSize="small" />,
  flight:      <FlightTakeoffRoundedIcon fontSize="small" />,
  payments:    <PaymentsRoundedIcon fontSize="small" />,
  headset_mic: <HeadsetMicRoundedIcon fontSize="small" />,
  tune:        <TuneRoundedIcon fontSize="small" />,
  shield:      <ShieldRoundedIcon fontSize="small" />,
};

interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavSectionProps {
  label: string;
  items: NavItem[];
  dark: boolean;
  activePage: string;
  onNavigate: (page: string) => void;
}

interface SidebarFooterProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function Sidebar({ dark, onToggleDark, activePage, onNavigate }: SidebarProps) {
  return (
    <div className="flex flex-col h-full gap-4">
      <NavSection label="Overview"          items={NAV_ITEMS}   dark={dark} activePage={activePage} onNavigate={onNavigate} />
      <NavSection label="Support & settings" items={NAV_SUPPORT} dark={dark} activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1" />
      <SidebarFooter dark={dark} onToggleDark={onToggleDark} />
    </div>
  );
}

function NavSection({ label, items, dark, activePage, onNavigate }: NavSectionProps) {
  return (
    <div>
      <div className={`text-xs font-semibold uppercase tracking-widest px-2 mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        {label}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm font-medium transition-all duration-200 w-full ${
                isActive
                  ? "text-white scale-[1.01]"
                  : dark
                  ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
              }`}
              style={isActive ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)" } : {}}
            >
              <span className={`flex items-center justify-center w-5 h-5 ${isActive ? "text-white" : dark ? "text-gray-400" : "text-gray-500"}`}>
                {ICON_MAP[item.icon]}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarFooter({ dark, onToggleDark }: SidebarFooterProps) {
  return (
    <div className={`pt-3 border-t ${dark ? "border-gray-800" : "border-gray-200"}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-purple-200">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Admin" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Alex Martin</div>
          <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Super admin</div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onToggleDark}
            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
              dark ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            {dark ? "☀" : "🌙"}
          </button>
          <button
            onClick={() => window.history.back()}
            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
              dark ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}