import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Navigation, Wifi, WifiOff, Search,
  LocateFixed, Layers, Minus, Plus, Radio,
  Truck, Star, Phone, MessageSquare, X,
} from "lucide-react";
import { C } from "./tokens";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;


// ─── Types ──────────────────────────────────────────────────────────────────

interface Driver {
  id: string;
  name: string;
  avatar: string;
  status: "ACTIVE" | "EN ROUTE" | "IDLE" | "OFFLINE";
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  rating: number;
  trips: number;
  eta?: string;
  destination?: string;
  bearing: number;
}

interface MapEvent {
  id: string;
  type: "surge" | "incident" | "hotspot";
  lat: number;
  lng: number;
  label: string;
  radius: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

// Coordonnées réelles San Francisco
const SF_CENTER: [number, number] = [-122.4194, 37.7749];

// Conversion coordonnées normalisées (0-1) → SF lat/lng
function toSFCoords(lat: number, lng: number): [number, number] {
  const lngMin = -122.52, lngMax = -122.35;
  const latMin = 37.70,   latMax = 37.83;
  return [
    lngMin + lng * (lngMax - lngMin),
    latMin + lat * (latMax - latMin),
  ];
}

const INITIAL_DRIVERS: Driver[] = [
  { id: "D001", name: "Marcus Chen",     avatar: "MC", status: "EN ROUTE", lat: 0.28, lng: 0.22, speed: 42, battery: 82, rating: 4.9, trips: 1204, eta: "4 min",  destination: "Union Square",     bearing: 45  },
  { id: "D002", name: "Elena Rodriguez", avatar: "ER", status: "ACTIVE",   lat: 0.45, lng: 0.48, speed: 0,  battery: 61, rating: 4.7, trips: 876,                                                   bearing: 120 },
  { id: "D003", name: "James Park",      avatar: "JP", status: "EN ROUTE", lat: 0.62, lng: 0.35, speed: 38, battery: 94, rating: 4.8, trips: 2341, eta: "8 min",  destination: "SFO Terminal 2",   bearing: 200 },
  { id: "D004", name: "Sofia Diaz",      avatar: "SD", status: "IDLE",     lat: 0.38, lng: 0.65, speed: 0,  battery: 45, rating: 4.6, trips: 654,                                                   bearing: 90  },
  { id: "D005", name: "Amir Hassan",     avatar: "AH", status: "EN ROUTE", lat: 0.72, lng: 0.58, speed: 55, battery: 77, rating: 4.9, trips: 3102, eta: "2 min",  destination: "Caltrain Station", bearing: 315 },
  { id: "D006", name: "Priya Nair",      avatar: "PN", status: "ACTIVE",   lat: 0.18, lng: 0.72, speed: 0,  battery: 33, rating: 4.5, trips: 421,                                                   bearing: 270 },
  { id: "D007", name: "Carlos Vega",     avatar: "CV", status: "OFFLINE",  lat: 0.55, lng: 0.18, speed: 0,  battery: 12, rating: 4.3, trips: 289,                                                   bearing: 0   },
  { id: "D008", name: "Yuki Tanaka",     avatar: "YT", status: "EN ROUTE", lat: 0.82, lng: 0.42, speed: 31, battery: 88, rating: 4.8, trips: 1567, eta: "6 min",  destination: "Castro District",  bearing: 160 },
];

const MAP_EVENTS: MapEvent[] = [
  { id: "E1", type: "surge",    lat: 0.25, lng: 0.30, label: "2.4× Surge",   radius: 400 },
  { id: "E2", type: "hotspot",  lat: 0.55, lng: 0.55, label: "High Demand",  radius: 300 },
  { id: "E3", type: "incident", lat: 0.42, lng: 0.22, label: "Road Closure", radius: 200 },
  { id: "E4", type: "surge",    lat: 0.75, lng: 0.65, label: "1.8× Surge",   radius: 250 },
];

const EVENT_COLORS = {
  surge:    { fill: "rgba(255,149,0,.25)",  stroke: "#FF9500" },
  hotspot:  { fill: "rgba(168,85,247,.2)",  stroke: "#A855F7" },
  incident: { fill: "rgba(255,59,48,.2)",   stroke: "#FF3B30" },
};

const STATUS_CONFIG = {
  ACTIVE:     { color: C.success,       label: "Available", pulse: true  },
  "EN ROUTE": { color: C.primaryPurple, label: "En Route",  pulse: true  },
  IDLE:       { color: C.warning,       label: "Idle",      pulse: false },
  OFFLINE:    { color: C.gray7B,        label: "Offline",   pulse: false },
};

function getStatusCfg(s: string) {
  return STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.OFFLINE;
}

// ─── Marker HTML ─────────────────────────────────────────────────────────────

function makeMarkerEl(driver: Driver, selected: boolean): HTMLDivElement {
  const cfg = getStatusCfg(driver.status);
  const size = selected ? 40 : 32;
  const el = document.createElement("div");
  el.style.cssText = `
    width: ${size}px; height: ${size}px;
    border-radius: 50%;
    background: ${driver.status === "OFFLINE" ? "#2a2a35" : cfg.color};
    border: ${selected ? `3px solid #fff` : `2px solid ${cfg.color}`};
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: ${selected ? 11 : 9}px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 0 ${selected ? 20 : 10}px ${cfg.color}88;
    transition: all .2s ease;
    position: relative;
  `;
  el.textContent = driver.avatar;

  // Pulse ring for active drivers
  if (cfg.pulse && driver.status !== "OFFLINE") {
    const ring = document.createElement("div");
    ring.style.cssText = `
      position: absolute; inset: -6px;
      border-radius: 50%;
      border: 1.5px solid ${cfg.color};
      opacity: .5;
      animation: pulse-ring 1.8s ease-out infinite;
    `;
    el.appendChild(ring);
  }
  return el;
}

// ─── CSS injection pour l'animation pulse ────────────────────────────────────

const PULSE_CSS = `
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .5; }
    100% { transform: scale(1.7); opacity: 0;  }
  }
`;
if (!document.getElementById("mapbox-pulse-style")) {
  const s = document.createElement("style");
  s.id = "mapbox-pulse-style";
  s.textContent = PULSE_CSS;
  document.head.appendChild(s);
}

// ─── DriverCard ──────────────────────────────────────────────────────────────

function DriverCard({ driver, selected, onClick, dark }: {
  driver: Driver; selected: boolean; onClick: () => void; dark: boolean;
}) {
  const cfg = getStatusCfg(driver.status);
  return (
    <div
      onClick={onClick}
      className="rounded-xl border p-3 cursor-pointer transition-all"
      style={{
        background: selected
          ? dark ? "rgba(168,85,247,.12)" : "rgba(168,85,247,.08)"
          : dark ? C.darkSurface : C.lightSurface,
        borderColor: selected ? C.primaryPurple : dark ? C.darkBorder : C.lightBorder,
        marginBottom: 8,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 relative"
          style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})` }}
        >
          {driver.avatar}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ background: cfg.color, borderColor: dark ? C.darkSurface : C.lightSurface }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 12, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>{driver.name}</span>
            <Star size={10} color={C.warning} fill={C.warning} />
            <span style={{ fontSize: 10, color: C.warning, fontWeight: 600 }}>{driver.rating}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${cfg.color}22`, color: cfg.color, fontSize: 10 }}>{cfg.label}</span>
            {driver.speed > 0 && (
              <span style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }}>{driver.speed} km/h</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span style={{ fontSize: 10, fontWeight: 700, color: driver.battery < 30 ? C.error : dark ? C.gray7B : C.lightSubtext }}>
            {driver.battery}%
          </span>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
            <div style={{ width: `${driver.battery}%`, height: "100%", borderRadius: 2,
              background: driver.battery < 30 ? C.error : driver.battery < 60 ? C.warning : C.success }} />
          </div>
        </div>
      </div>
      {driver.destination && (
        <div className="flex items-center gap-1.5 mt-2 pt-2"
          style={{ borderTop: `1px solid ${dark ? C.darkBorder : C.lightBorder}` }}>
          <Navigation size={10} color={C.primaryPurple} />
          <span style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }} className="truncate">
            → {driver.destination}
          </span>
          {driver.eta && (
            <span style={{ fontSize: 10, fontWeight: 700, color: C.primaryPurple, marginLeft: "auto", flexShrink: 0 }}>
              ETA {driver.eta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DriverDetailPanel ───────────────────────────────────────────────────────

function DriverDetailPanel({ driver, dark, onClose }: {
  driver: Driver; dark: boolean; onClose: () => void;
}) {
  const cfg = getStatusCfg(driver.status);
  return (
    <div className="rounded-xl border p-4"
      style={{ background: dark ? C.darkSurface : C.lightSurface, borderColor: C.primaryPurple,
        boxShadow: `0 0 24px rgba(168,85,247,.2)` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})` }}>
            {driver.avatar}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: dark ? C.darkText : C.lightText }}>{driver.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={11} color={C.warning} fill={C.warning} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.warning }}>{driver.rating}</span>
              <span style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext }}>· {driver.trips.toLocaleString()} trips</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: dark ? C.gray7B : C.lightSubtext, background: "none", border: "none", cursor: "pointer" }}>
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
        style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}40` }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
        {driver.speed > 0 && (
          <span style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext, marginLeft: "auto" }}>{driver.speed} km/h</span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Battery", value: `${driver.battery}%`, color: driver.battery < 30 ? C.error : C.success },
          { label: "Speed",   value: driver.speed > 0 ? `${driver.speed} km/h` : "Stationary", color: C.primaryPurple },
          { label: "ETA",     value: driver.eta ?? "—",   color: C.warning },
          { label: "ID",      value: driver.id,           color: dark ? C.gray7B : C.lightSubtext },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg p-2.5"
            style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)" }}>
            <p style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {driver.destination && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
          style={{ background: dark ? "rgba(168,85,247,.08)" : "rgba(168,85,247,.05)" }}>
          <Navigation size={12} color={C.primaryPurple} />
          <div>
            <p style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }}>Destination</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>{driver.destination}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {[{ icon: Phone, label: "Call" }, { icon: MessageSquare, label: "Message" }, { icon: Truck, label: "Reassign" }].map(({ icon: Icon, label }) => (
          <button key={label} className="flex-1 flex flex-col items-center gap-1 rounded-lg py-2.5 border text-xs font-medium"
            style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
              borderColor: dark ? C.darkBorder : C.lightBorder, color: dark ? C.gray7B : C.lightSubtext }}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MapboxMap ───────────────────────────────────────────────────────────────

function MapboxMap({ drivers, selectedId, onSelect, dark }: {
  drivers: Driver[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  dark: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markersRef   = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const eventLayersRef = useRef<string[]>([]);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: dark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      center: SF_CENTER,
      zoom: 12.5,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      // Zones events (cercles)
      MAP_EVENTS.forEach((ev) => {
        const [lng, lat] = toSFCoords(ev.lat, ev.lng);
        const sourceId = `event-${ev.id}`;
        const fillId   = `event-fill-${ev.id}`;
        const strokeId = `event-stroke-${ev.id}`;
        const col = EVENT_COLORS[ev.type];

        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lng, lat] },
            properties: { label: ev.label },
          },
        });

        map.addLayer({
          id: fillId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": ev.radius,
            "circle-color": col.fill,
            "circle-stroke-color": col.stroke,
            "circle-stroke-width": 1.5,
            "circle-opacity": 0.8,
          },
        });

        // Label
        map.addLayer({
          id: strokeId,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["get", "label"],
            "text-size": 11,
            "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, -2.2],
            "text-anchor": "bottom",
          },
          paint: {
            "text-color": col.stroke,
            "text-halo-color": dark ? "#080C14" : "#fff",
            "text-halo-width": 1.5,
          },
        });

        eventLayersRef.current.push(fillId, strokeId, sourceId);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync dark/light style
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(
      dark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11"
    );
  }, [dark]);

  // Sync driver markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const existingIds = new Set(markersRef.current.keys());

    drivers.forEach((d) => {
      const [lng, lat] = toSFCoords(d.lat, d.lng);
      const isSelected = d.id === selectedId;

      if (markersRef.current.has(d.id)) {
        // Update position + refresh element
        const marker = markersRef.current.get(d.id)!;
        marker.setLngLat([lng, lat]);
        const newEl = makeMarkerEl(d, isSelected);
        newEl.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelect(d.id);
        });
        // Remplace l'élément DOM
        const oldEl = marker.getElement();
        oldEl.replaceWith(newEl);
        existingIds.delete(d.id);
      } else {
        // Créer nouveau marker
        const el = makeMarkerEl(d, isSelected);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelect(d.id);
        });

        const marker = new mapboxgl.Marker({ element: el, rotation: d.bearing })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.set(d.id, marker);
        existingIds.delete(d.id);
      }
    });

    // Supprimer les markers des drivers filtrés
    existingIds.forEach((id) => {
      markersRef.current.get(id)?.remove();
      markersRef.current.delete(id);
    });
  }, [drivers, selectedId, onSelect]);

  // Fly to selected driver
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const d = drivers.find((dr) => dr.id === selectedId);
    if (!d) return;
    const [lng, lat] = toSFCoords(d.lat, d.lng);
    map.flyTo({ center: [lng, lat], zoom: 14, duration: 800, essential: true });
  }, [selectedId, drivers]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
}

// ─── LiveMapPage ─────────────────────────────────────────────────────────────

export function LiveMapPage({ dark }: { dark: boolean }) {
  const [drivers, setDrivers]       = useState<Driver[]>(INITIAL_DRIVERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [zoom, setZoom]             = useState(12.5);
  const [isLive, setIsLive]         = useState(true);
  const [tick, setTick]             = useState(0);
  const mapRef                      = useRef<mapboxgl.Map | null>(null);

  // Mouvement simulé
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.status === "OFFLINE" || d.speed === 0) return d;
          const rad  = (d.bearing * Math.PI) / 180;
          const step = 0.0008;
          return {
            ...d,
            lat:     Math.max(0.05, Math.min(0.95, d.lat + Math.cos(rad) * step * -1 + (Math.random() - 0.5) * 0.0003)),
            lng:     Math.max(0.05, Math.min(0.95, d.lng + Math.sin(rad) * step     + (Math.random() - 0.5) * 0.0003)),
            bearing: (d.bearing + (Math.random() - 0.5) * 4) % 360,
          };
        })
      );
      setTick((t) => t + 1);
    }, 800);
    return () => clearInterval(id);
  }, [isLive]);

  const filtered = drivers.filter((d) => {
    const matchName   = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchName && matchStatus;
  });

  const selectedDriver = drivers.find((d) => d.id === selectedId) ?? null;
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const counts = {
    total:   drivers.length,
    active:  drivers.filter((d) => d.status === "ACTIVE" || d.status === "EN ROUTE").length,
    idle:    drivers.filter((d) => d.status === "IDLE").length,
    offline: drivers.filter((d) => d.status === "OFFLINE").length,
  };

  // Zoom map via boutons
  const handleZoom = (delta: number) => {
    const map = mapRef.current;
    if (map) map.zoomTo(map.getZoom() + delta, { duration: 300 });
    setZoom((z) => Math.min(18, Math.max(8, z + delta)));
  };

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 56px - 40px)", minHeight: 600 }}>

      {/* Sidebar gauche */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[
            { label: "On Duty",  value: counts.active,  color: C.success  },
            { label: "Idle",     value: counts.idle,    color: C.warning  },
            { label: "Offline",  value: counts.offline, color: C.gray7B   },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-3 text-center" style={{ background: surface, borderColor: border }}>
              <p style={{ fontSize: 20, fontWeight: 700, color }}>{value}</p>
              <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
          <div className="flex items-center gap-2 rounded-lg px-3 h-8 mb-2" style={{ background: dark ? C.darkBorder : C.grayE6 }}>
            <Search size={13} color={sub} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search driver or ID…"
              className="bg-transparent outline-none text-xs w-full" style={{ color: text }} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["ALL", "ACTIVE", "EN ROUTE", "IDLE", "OFFLINE"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-2 py-1 rounded text-xs font-semibold transition-all"
                style={{
                  background: statusFilter === s ? C.primaryPurple : dark ? C.darkBorder : C.grayE6,
                  color: statusFilter === s ? "#fff" : sub, border: "none",
                }}>
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0
            ? <p style={{ fontSize: 12, color: sub, textAlign: "center", padding: "24px 0" }}>No drivers found</p>
            : filtered.map((d) => (
              <DriverCard key={d.id} driver={d} selected={d.id === selectedId}
                onClick={() => setSelectedId(d.id === selectedId ? null : d.id)} dark={dark} />
            ))
          }
        </div>
      </div>

      {/* Zone carte */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Toolbar */}
        <div className="flex items-center gap-3 rounded-xl border px-4 h-11"
          style={{ background: surface, borderColor: border, flexShrink: 0 }}>
          <button onClick={() => setIsLive((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: isLive ? "rgba(76,175,80,.12)" : "rgba(123,123,133,.1)",
              color: isLive ? C.success : sub,
              border: `1px solid ${isLive ? C.success + "44" : border}`,
            }}>
            {isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isLive ? "LIVE" : "PAUSED"}
          </button>

          {isLive && (
            <div className="flex items-center gap-1.5">
              <Radio size={11} color={C.success} />
              <span style={{ fontSize: 10, color: sub }}>Updated {tick}s ago</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: border }}>
              <button onClick={() => handleZoom(-1)}
                style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: dark ? C.darkBorder : C.grayE6, color: text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Minus size={10} />
              </button>
              <span style={{ fontSize: 10, color: sub, minWidth: 32, textAlign: "center" }}>{Math.round(zoom)}x</span>
              <button onClick={() => handleZoom(+1)}
                style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: dark ? C.darkBorder : C.grayE6, color: text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={10} />
              </button>
            </div>
            <button className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ background: surface, borderColor: border }}>
              <Layers size={13} color={sub} />
            </button>
            <button
              className="w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{ background: surface, borderColor: border }}
              onClick={() => mapRef.current?.flyTo({ center: SF_CENTER, zoom: 12.5, duration: 800 })}>
              <LocateFixed size={13} color={C.primaryPurple} />
            </button>
          </div>
        </div>

        {/* Carte Mapbox */}
        <div className="rounded-xl border overflow-hidden relative" style={{ flex: 1, borderColor: border }}>
          <MapboxMap
            drivers={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            dark={dark}
          />

          {/* Légende */}
          <div className="absolute bottom-4 left-4 rounded-xl border px-3 py-2.5 flex items-center gap-4"
            style={{ background: "rgba(8,12,20,.85)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(8px)" }}>
            {[
              { color: C.success,       label: "Available"  },
              { color: C.primaryPurple, label: "En Route"   },
              { color: C.warning,       label: "Idle"       },
              { color: C.gray7B,        label: "Offline"    },
              { color: "#FF9500",       label: "Surge Zone" },
              { color: "#FF3B30",       label: "Incident"   },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>

          {/* Compteur actifs */}
          <div className="absolute top-4 right-4 rounded-xl border px-3 py-2"
            style={{ background: "rgba(8,12,20,.85)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(8px)" }}>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Units</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.success, lineHeight: 1.2 }}>{counts.active}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>of {counts.total} total</p>
          </div>
        </div>
      </div>

      {/* Panel détail driver */}
      {selectedDriver && (
        <div style={{ width: 260, flexShrink: 0 }}>
          <DriverDetailPanel driver={selectedDriver} dark={dark} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </div>
  );
}