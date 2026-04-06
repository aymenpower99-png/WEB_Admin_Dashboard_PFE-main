import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "../../../api/apiClient";
import type { DriverOption } from "./types";

const statusColor = (s?: string) => {
  if (s === "online") return { bg: "#dcfce7", fg: "#16a34a" };
  if (s === "busy")   return { bg: "#fef9c3", fg: "#ca8a04" };
  return                     { bg: "#f3f4f6", fg: "#6b7280" };
};

const initials = (d: DriverOption) =>
  `${d.firstName.charAt(0)}${d.lastName.charAt(0)}`.toUpperCase();

export function DriverPicker({ value, error, onSelect }: {
  value: string;
  error?: string;
  /** Called with the driver's UUID id AND display name when a driver is picked */
  onSelect: (driver: { id: string; fullName: string }) => void;
}) {
  const [inputVal, setInputVal] = useState(value);
  const [drivers,  setDrivers]  = useState<DriverOption[]>([]);
  const [open,     setOpen]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [activeIdx,setActiveIdx]= useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputVal(value); }, [value]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fetchDrivers = useCallback(async () => {
    if (drivers.length > 0) { setOpen(true); return; }
    setLoading(true);
    try {
      const res = await apiClient.get("/drivers");
      const raw = res.data;
      const list: DriverOption[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data) ? raw.data : [];
      setDrivers(list);
      setOpen(true);
    } catch {
      setDrivers([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, [drivers.length]);

  const pick = (d: DriverOption) => {
    const full = `${d.firstName} ${d.lastName}`;
    setInputVal(full);
    onSelect({ id: d.id, fullName: full }); // ✅ now returns id + display name
    setOpen(false);
    setActiveIdx(-1);
  };

  const filtered = drivers.filter(d =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(inputVal.toLowerCase())
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if      (e.key === "ArrowDown")               { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(filtered[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        value={inputVal}
        placeholder="Search or select a driver…"
        autoComplete="off"
        onChange={e => {
          setInputVal(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
          if (drivers.length === 0) fetchDrivers();
        }}
        onFocus={fetchDrivers}
        onKeyDown={handleKey}
        style={{
          width: "100%",
          padding: ".55rem .75rem",
          border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
          borderBottom: open ? "none" : `1px solid ${error ? "#ef4444" : "var(--border)"}`,
          borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
          background: "var(--bg-card)",
          fontSize: ".82rem",
          color: "var(--text-h)",
          outline: "none",
          boxShadow: "none",
          boxSizing: "border-box",
        }}
      />

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)",
          zIndex: 999,
          maxHeight: "13rem",
          overflowY: "auto",
        }}>
          {loading ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
              Loading drivers…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
              No drivers available
            </div>
          ) : filtered.map((d, i) => {
            const sc  = statusColor(d.status);
            const sel = value === `${d.firstName} ${d.lastName}`;
            const hot = hovered === d.id || activeIdx === i || sel;
            return (
              <div
                key={d.id}
                onMouseDown={e => { e.preventDefault(); pick(d); }}
                onMouseEnter={() => { setHovered(d.id); setActiveIdx(i); }}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: ".65rem",
                  padding: ".5rem .75rem",
                  background: hot ? "#ede9fe" : "transparent",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background var(--t-fast)",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: ".65rem", fontWeight: 700,
                }}>
                  {initials(d)}
                </div>
                <span style={{
                  flex: 1, fontSize: ".83rem",
                  fontWeight: sel ? 700 : 500,
                  color: hot ? "#7c3aed" : "var(--text-h)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {d.firstName} {d.lastName}
                </span>
                {d.status && (
                  <span style={{
                    fontSize: ".67rem", fontWeight: 600,
                    padding: ".12rem .38rem", borderRadius: "999px",
                    background: sc.bg, color: sc.fg,
                    textTransform: "capitalize", flexShrink: 0,
                  }}>
                    {d.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}