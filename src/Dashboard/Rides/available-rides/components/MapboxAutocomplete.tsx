import { useState, useRef, useEffect, useCallback } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "";
const GEOCODE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export interface MapboxPlace {
  id: string;
  name: string;
  fullAddress: string;
  category: string;
  lat: number;
  lng: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  hotel: "🏨",
  lodging: "🏨",
  restaurant: "🍽️",
  food: "🍽️",
  airport: "✈️",
  aerodrome: "✈️",
  hospital: "🏥",
  school: "🎓",
  shop: "🛒",
  park: "🌳",
};

function getCategoryIcon(categories: string): string {
  const lower = categories.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📍";
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: MapboxPlace) => void;
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
  const [results, setResults] = useState<MapboxPlace[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (query: string) => {
    if (!query.trim() || !MAPBOX_TOKEN) {
      setResults([]);
      return;
    }
    try {
      const url = `${GEOCODE_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=poi,address,place,locality,neighborhood&country=tn&limit=6&proximity=${proximity[0]},${proximity[1]}&language=en`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const places: MapboxPlace[] = (data.features ?? []).map((f: any) => ({
        id: f.id,
        name: f.text || f.place_name,
        fullAddress: f.place_name,
        category: (f.properties?.category ?? f.place_type?.[0] ?? ""),
        lat: f.center?.[1] ?? 0,
        lng: f.center?.[0] ?? 0,
      }));
      setResults(places);
      setOpen(places.length > 0);
      setHighlighted(-1);
    } catch {
      // silently fail
    }
  }, [proximity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    // Debounce 300ms
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (place: MapboxPlace) => {
    onChange(place.fullAddress);
    onSelect?.(place);
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(h => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(h => (h - 1 + results.length) % results.length);
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
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={e => {
          if (results.length > 0) setOpen(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          // Delay to allow click on dropdown item
          setTimeout(() => onBlur?.(e), 150);
        }}
        style={inputStyle}
        autoComplete="off"
      />

      {open && results.length > 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "var(--bg-card)",
          border: "1.5px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
          maxHeight: 260,
          overflowY: "auto",
        }}>
          {results.map((place, i) => (
            <div
              key={place.id}
              onMouseDown={e => { e.preventDefault(); handleSelect(place); }}
              onMouseEnter={() => setHighlighted(i)}
              style={{
                padding: ".6rem .85rem",
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
                cursor: "pointer",
                background: highlighted === i ? "var(--bg-inner)" : "transparent",
                transition: "background 100ms",
                borderBottom: i < results.length - 1 ? "1px solid var(--border-inner, var(--border))" : "none",
              }}
            >
              <span style={{
                fontSize: "1.1rem",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: "var(--brand-soft, rgba(124,58,237,0.06))",
                flexShrink: 0,
              }}>
                {getCategoryIcon(place.category)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: ".82rem",
                  fontWeight: 600,
                  color: "var(--text-h)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {place.name}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: ".68rem",
                  color: "var(--text-faint)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {place.fullAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
