import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "../../../api/apiClient";
import type { MakeOption, ModelOption } from "./types";

/* ✅ Shared input style — no focus ring, no purple border ever */
const baseInput: React.CSSProperties = {
  width: "100%",
  padding: ".55rem .75rem",
  border: "1px solid var(--border)",
  borderRadius: ".4rem",
  background: "var(--bg-card)",
  fontSize: ".82rem",
  color: "var(--text-h)",
  outline: "none",
  boxShadow: "none",
  boxSizing: "border-box",
};

const errorInput: React.CSSProperties = {
  ...baseInput,
  border: "1px solid #ef4444",
};

/* ── Shared dropdown list ── */
function DropList({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", top: "100%", left: 0, right: 0,
      maxHeight: "14rem", overflowY: "auto",
      // ✅ Neutral border — no purple
      border: "1px solid var(--border)",
      borderTop: "none",
      borderRadius: "0 0 .4rem .4rem",
      background: "var(--bg-card)",
      zIndex: 999,
    }}>
      {children}
    </div>
  );
}

function DropItem({ active, children, onMouseDown, onMouseEnter, onMouseLeave }: {
  active: boolean;
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        padding: ".55rem .75rem",
        fontSize: ".82rem",
        color: active ? "#7c3aed" : "var(--text-body)",
        background: active ? "#ede9fe" : "transparent",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        borderBottom: "1px solid var(--border)",
        transition: "background var(--t-fast), color var(--t-fast)",
      }}
    >
      {children}
    </div>
  );
}

/* ── MakeAutocomplete ── */
export function MakeAutocomplete({ value, error, onSelect }: {
  value: string; error?: string; onSelect: (name: string, id: number | null) => void;
}) {
  const [inputVal,    setInputVal]   = useState(value);
  const [suggestions, setSuggests]  = useState<MakeOption[]>([]);
  const [open,        setOpen]       = useState(false);
  const [activeIdx,   setActiveIdx]  = useState(-1);
  const [hovered,     setHovered]    = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputVal(value); }, [value]);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fetchMakes = useCallback(async (q: string) => {
    try {
      const ep = q.trim().length > 0
        ? `/vehicles/makes/search?q=${encodeURIComponent(q.trim())}`
        : `/vehicles/makes`;
      const res = await apiClient.get<MakeOption[]>(ep);
      setSuggests(res.data); setOpen(true); setActiveIdx(-1);
    } catch { /**/ }
  }, []);

  const pick = (opt: MakeOption) => {
    setInputVal(opt.name); onSelect(opt.name, opt.id); setOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if      (e.key === "ArrowDown")               { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        style={error ? errorInput : baseInput}
        placeholder="e.g. Mercedes-Benz, Toyota, BMW…"
        value={inputVal}
        onChange={e => {
          setInputVal(e.target.value); onSelect(e.target.value, null);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => fetchMakes(e.target.value), 250);
        }}
        onFocus={() => { if (suggestions.length === 0) fetchMakes(inputVal); else setOpen(true); }}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <DropList>
          {suggestions.map((opt, i) => (
            <DropItem
              key={opt.id}
              active={hovered === opt.id || activeIdx === i}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }}
              onMouseLeave={() => setHovered(null)}
            >
              {opt.name}
            </DropItem>
          ))}
        </DropList>
      )}
    </div>
  );
}

/* ── ModelAutocomplete ── */
export function ModelAutocomplete({ value, makeId, error, onChange }: {
  value: string; makeId: number | null; error?: string; onChange: (v: string) => void;
}) {
  const [models,    setModels]    = useState<ModelOption[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [open,      setOpen]      = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hovered,   setHovered]   = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!makeId) { setModels([]); return; }
    setLoading(true);
    apiClient.get<ModelOption[]>(`/vehicles/makes/${makeId}/models`)
      .then(res => setModels(res.data)).catch(() => setModels([])).finally(() => setLoading(false));
  }, [makeId]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = models.filter(m => m.name.toLowerCase().includes(value.toLowerCase()));
  const pick = (opt: ModelOption) => { onChange(opt.name); setOpen(false); };

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
        style={{
          ...(error ? errorInput : baseInput),
          color: !makeId ? "var(--text-faint)" : "var(--text-h)",
          cursor: !makeId ? "not-allowed" : "text",
        }}
        placeholder={!makeId ? "Select a Make first" : loading ? "Loading…" : "e.g. E-Class, Corolla…"}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => { if (makeId) setOpen(true); }}
        onKeyDown={handleKey}
        disabled={!makeId}
        autoComplete="off"
      />
      {open && makeId && (
        <DropList>
          {loading ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>No models found</div>
          ) : filtered.map((opt, i) => (
            <DropItem
              key={opt.id}
              active={hovered === opt.id || activeIdx === i}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }}
              onMouseLeave={() => setHovered(null)}
            >
              {opt.name}
            </DropItem>
          ))}
        </DropList>
      )}
    </div>
  );
}