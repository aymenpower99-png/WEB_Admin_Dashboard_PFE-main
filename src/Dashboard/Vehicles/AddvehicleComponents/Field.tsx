import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import type { DropdownOption } from "./types";
import { VEHICLE_CLASSES } from "./types";

/* ── Shared dropdown styles (identical to Make/Model) ── */
const dropTriggerBase: React.CSSProperties = {
  width: "100%",
  padding: ".55rem .75rem",
  border: "1px solid var(--border)",
  borderRadius: ".4rem",
  background: "var(--bg-card)",
  fontSize: ".82rem",
  outline: "none",
  boxShadow: "none",
  boxSizing: "border-box",
  cursor: "pointer",
  userSelect: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

/* ── Field wrapper ── */
export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
      {/* ✅ Bold, uses var(--text-h) → black in light mode, white in dark */}
      <label
        style={{
          fontSize: ".78rem",
          fontWeight: 700,
          color: "var(--text-h)",
          letterSpacing: ".01em",
        }}
      >
        {label}
        {hint && (
          <span
            style={{
              marginLeft: ".4rem",
              fontWeight: 400,
              color: "var(--text-faint)",
              fontSize: ".72rem",
            }}
          >
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".25rem",
            marginTop: ".05rem",
            margin: 0,
            fontSize: ".75rem",
            color: "#ef4444",
          }}
        >
          <ErrorRoundedIcon style={{ fontSize: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── PlainDropdown — identical look to Make/Model input ── */
export function PlainDropdown({
  value,
  onChange,
  options,
  error,
  placeholder = "SELECT",
}: {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  error?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = triggerRef.current;
      const d = dropdownRef.current;
      const target = e.target as Node;
      if (t && d && !t.contains(target) && !d.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    } else {
      setPosition(null);
    }
  }, [open]);

  const selected = options.find((o) => o.value === value);

  const dropdownContent =
    position && open ? (
      <div
        ref={dropdownRef}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width: position.width,
          maxHeight: "13rem",
          overflowY: "auto",
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)",
          zIndex: 10000,
        }}
      >
        {options.map((opt) => (
          <div
            key={opt.value || "__empty__"}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            onMouseEnter={() => setHovered(opt.value)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: ".55rem .75rem",
              fontSize: ".82rem",
              color: hovered === opt.value ? "#7c3aed" : "var(--text-body)",
              background: hovered === opt.value ? "#ede9fe" : "transparent",
              fontWeight: hovered === opt.value ? 600 : 400,
              cursor: "pointer",
              borderBottom: "1px solid var(--border)",
              transition: "background var(--t-fast), color var(--t-fast)",
            }}
          >
            {opt.label}
          </div>
        ))}
      </div>
    ) : null;

  return (
    <>
      <div ref={triggerRef} style={{ position: "relative" }}>
        {/* Trigger — same style as Make/Model input box */}
        <div
          onClick={() => setOpen((o) => !o)}
          style={{
            ...dropTriggerBase,
            border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
            borderBottom: open
              ? "none"
              : `1px solid ${error ? "#ef4444" : "var(--border)"}`,
            borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
            color: selected ? "var(--text-h)" : "var(--text-faint)",
          }}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <span
            style={{
              fontSize: ".6rem",
              color: "var(--text-faint)",
              marginLeft: ".4rem",
            }}
          >
            ▾
          </span>
        </div>
      </div>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}

/* ── VehicleClassGrid ── */
export function VehicleClassGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        border: "1px solid var(--border)",
        borderRadius: ".4rem",
        overflow: "hidden",
        marginTop: ".35rem",
      }}
    >
      {VEHICLE_CLASSES.map((cls, i) => (
        <div
          key={cls.key}
          style={{
            padding: ".45rem .65rem",
            borderRight: i % 3 < 2 ? "1px solid var(--border)" : "none",
            borderBottom: i < 3 ? "1px solid var(--border)" : "none",
            background: "var(--bg-inner)",
          }}
        >
          {/* ✅ Bold, var(--text-h) → black/white depending on mode */}
          <p
            style={{
              margin: "0 0 .2rem 0",
              fontSize: ".7rem",
              fontWeight: 700,
              color: "var(--text-h)",
              textTransform: "uppercase",
              letterSpacing: ".05em",
            }}
          >
            {cls.label}
          </p>
          {cls.examples.map((ex) => (
            <p
              key={ex}
              style={{
                margin: 0,
                fontSize: ".68rem",
                lineHeight: 1.5,
                color: "var(--text-muted)",
              }}
            >
              {ex}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
