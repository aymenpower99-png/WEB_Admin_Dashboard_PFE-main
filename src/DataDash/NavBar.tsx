import { LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { C } from "./tokens";
import { navItems } from "./mockData";

import logoLight from "../assets/moviroo light_dark_big.png";
import logoDark from "../assets/moviroo dark_light_big.png";

interface NavBarProps {
  dark: boolean;
  onToggle: () => void;
  activeNav: string;
  setActiveNav: (item: string) => void;
  onGoToAdmin?: () => void;
  onGoToAdminWithSplash?: () => void;
}

export function NavBar({
  dark,
  onToggle,
  activeNav,
  setActiveNav,
  onGoToAdmin,
  onGoToAdminWithSplash,
}: NavBarProps) {
  return (
    <nav
      className="flex items-center gap-1 px-5 h-14 border-b sticky top-0 z-20"
      style={{
        background: dark ? "rgba(11,11,15,.92)" : "rgba(244,244,248,.92)",
        borderColor: dark ? C.darkBorder : C.lightBorder,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div className="mr-4 flex items-center">
        <img
          src={dark ? logoDark : logoLight}
          alt="Moviroo logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {navItems.map((item) => (
        <button
          key={item}
          onClick={() => setActiveNav(item)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background:
              activeNav === item
                ? dark
                  ? C.iconBgDark
                  : C.iconBgLight
                : "transparent",
            color:
              activeNav === item
                ? C.primaryPurple
                : dark
                  ? C.gray7B
                  : C.lightSubtext,
          }}
        >
          {item}
        </button>
      ))}

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onGoToAdminWithSplash || onGoToAdmin}
          title="Admin Dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
          style={{
            background: dark ? C.darkSurface : C.lightSurface,
            borderColor: dark ? C.darkBorder : C.lightBorder,
            color: dark ? C.darkText : C.lightText,
          }}
        >
          <LayoutDashboard size={14} color={C.primaryPurple} />
          <span>Dashboard</span>
        </button>

        <ThemeToggle dark={dark} onToggle={onToggle} />
      </div>
    </nav>
  );
}
