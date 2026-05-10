import { Bell, Settings, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { C } from "./tokens";
import { navItems } from "./mockData";
interface NavBarProps {
  dark: boolean;
  onToggle: () => void;
  activeNav: string;
  setActiveNav: (item: string) => void;
}

export function NavBar({ dark, onToggle, activeNav, setActiveNav }: NavBarProps) {
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
      <span
        className="mr-4 font-bold text-sm tracking-tight"
        style={{
          background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Analytics
      </span>

      {navItems.map((item) => (
        <button
          key={item}
          onClick={() => setActiveNav(item)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: activeNav === item
              ? dark ? C.iconBgDark : C.iconBgLight
              : "transparent",
            color: activeNav === item
              ? C.primaryPurple
              : dark ? C.gray7B : C.lightSubtext,
          }}
        >
          {item}
        </button>
      ))}

      {/* Search */}
      <div
        className="ml-4 flex items-center gap-2 px-3 h-8 rounded-lg border flex-1 max-w-[220px]"
        style={{
          background: dark ? C.darkBorder : C.grayE6,
          borderColor: dark ? C.darkBorder : C.lightBorder,
        }}
      >
        <Search size={13} color={dark ? C.gray7B : C.lightSubtext} />
        <input
          placeholder="Search analytics…"
          className="bg-transparent outline-none text-xs w-full"
          style={{ color: dark ? C.darkText : C.lightText }}
        />
      </div>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-lg border flex items-center justify-center relative"
          style={{
            background: dark ? C.darkSurface : C.lightSurface,
            borderColor: dark ? C.darkBorder : C.lightBorder,
          }}
        >
          <Bell size={15} color={dark ? C.gray7B : C.lightSubtext} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: C.error }}
          />
        </button>

      

       

        <ThemeToggle dark={dark} onToggle={onToggle} />
      </div>
    </nav>
  );
}
