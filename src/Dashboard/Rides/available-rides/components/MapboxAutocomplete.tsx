import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { searchPlaces, getCategoryIcon, type Place } from "./autocompleteUtils";

export type { Place as MapboxPlace };

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: Place) => void;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Tunisia-centered proximity bias */
  proximity?: [number, number];
}

export default function MapboxAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search address…",
  inputStyle,
  inputClassName,
  onFocus,
  onBlur,
  proximity = [10.18, 36.81], // Tunis center
}: Props) {
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [open]);

  const search = useCallback(
    async (query: string) => {
      const places = await searchPlaces(query, proximity);
      setResults(places);
      setOpen(places.length > 0);
      setHighlighted(-1);
    },
    [proximity],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    // Debounce 300ms
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (place: Place) => {
    onChange(place.fullAddress);
    onSelect?.(place);
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      handleSelect(results[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        ref={inputRef}
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          if (results.length > 0) setOpen(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          // Delay to allow click on dropdown item
          setTimeout(() => onBlur?.(e), 150);
        }}
        style={inputStyle}
        autoComplete="off"
      />

      {open &&
        results.length > 0 &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              overflow: "hidden",
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {results.map((place, i) => (
              <div
                key={place.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(place);
                }}
                onMouseEnter={() => setHighlighted(i)}
                style={{
                  padding: ".6rem .85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".6rem",
                  cursor: "pointer",
                  background:
                    highlighted === i ? "var(--bg-inner)" : "transparent",
                  transition: "background 100ms",
                  borderBottom:
                    i < results.length - 1
                      ? "1px solid var(--border-inner, var(--border))"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    background: "var(--brand-soft, rgba(124,58,237,0.06))",
                    flexShrink: 0,
                  }}
                >
                  {getCategoryIcon(place.category)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: ".82rem",
                      fontWeight: 600,
                      color: "var(--text-h)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {place.name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: ".68rem",
                      color: "var(--text-faint)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {place.fullAddress}
                  </p>
                </div>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
