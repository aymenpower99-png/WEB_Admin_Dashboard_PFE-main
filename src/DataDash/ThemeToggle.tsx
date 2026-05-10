import { Sun, Moon } from "lucide-react";
import { C } from "./tokens";

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
        color: dark ? C.darkText : C.lightText,
      }}
    >
      {dark
        ? <Sun size={14} color={C.primaryPurple} />
        : <Moon size={14} color={C.secondaryPurple} />
      }
      <span style={{ fontSize: 12, fontWeight: 500 }}>
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
