import { useRef } from "react";
import mapboxgl from "mapbox-gl";
import {
  Wifi,
  WifiOff,
  LocateFixed,
  Layers,
  Minus,
  Plus,
} from "lucide-react";
import { C } from "./tokens";
import { DEFAULT_CENTER } from "./Livemap/constants";
import { useDrivers } from "./Livemap/useDrivers";
import { Sidebar } from "./Livemap/Sidebar";
import { MapboxMap } from "./Livemap/MapboxMap";
import type { Driver } from "./Livemap/types";

export function LiveMapPage({ dark }: { dark: boolean }) {
  const {
    filtered,
    selectedId,
    setSelectedId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLive,
    setIsLive,
    counts,
  } = useDrivers();

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const zoomRef = useRef(12.5);

  const handleMapReady = (map: mapboxgl.Map) => {
    mapRef.current = map;
  };

  const handleZoom = (delta: number) => {
    const map = mapRef.current;
    if (map) {
      const next = Math.min(18, Math.max(8, map.getZoom() + delta));
      map.zoomTo(next, { duration: 300 });
      zoomRef.current = next;
    }
  };

  const handleDriverClick = (driver: Driver) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [driver.lng, driver.lat],
        zoom: 14,
        duration: 800,
        essential: true,
      });
    }
  };

  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        height: "calc(100vh - 56px - 40px)",
        minHeight: 600,
      }}
    >
      {/* Sidebar */}
      <Sidebar
        filtered={filtered}
        selectedId={selectedId}
        search={search}
        statusFilter={statusFilter}
        counts={counts}
        dark={dark}
        onSelect={setSelectedId}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onDriverClick={handleDriverClick}
      />

      {/* Map area */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center gap-3 rounded-xl border px-4 h-11"
          style={{ background: surface, borderColor: border, flexShrink: 0 }}
        >
          <button
            onClick={() => setIsLive((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: isLive
                ? "rgba(76,175,80,.12)"
                : "rgba(123,123,133,.1)",
              color: isLive ? C.success : sub,
              border: `1px solid ${isLive ? C.success + "44" : border}`,
            }}
          >
            {isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isLive ? "LIVE" : "PAUSED"}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div
              className="flex items-center gap-1 rounded-lg border p-1"
              style={{ borderColor: border }}
            >
              <button
                onClick={() => handleZoom(-1)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: "none",
                  background: dark ? C.darkBorder : C.grayE6,
                  color: text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Minus size={10} />
              </button>
              <span
                style={{
                  fontSize: 10,
                  color: sub,
                  minWidth: 32,
                  textAlign: "center",
                }}
              >
                {Math.round(zoomRef.current)}x
              </span>
              <button
                onClick={() => handleZoom(+1)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: "none",
                  background: dark ? C.darkBorder : C.grayE6,
                  color: text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={10} />
              </button>
            </div>
            <button
              className="w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{ background: surface, borderColor: border }}
            >
              <Layers size={13} color={sub} />
            </button>
            <button
              className="w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{ background: surface, borderColor: border }}
              onClick={() =>
                mapRef.current?.flyTo({
                  center: DEFAULT_CENTER,
                  zoom: 12.5,
                  duration: 800,
                })
              }
            >
              <LocateFixed size={13} color={C.primaryPurple} />
            </button>
          </div>
        </div>

        {/* Map */}
        <div
          className="rounded-xl border overflow-hidden relative"
          style={{ flex: 1, borderColor: border }}
        >
          <MapboxMap
            drivers={filtered}
            dark={dark}
            onMapReady={handleMapReady}
          />

          {/* Legend */}
          <div
            className="absolute bottom-4 left-4 rounded-xl border px-3 py-2.5 flex items-center gap-4"
            style={{
              background: "rgba(8,12,20,.85)",
              borderColor: "rgba(168,85,247,.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            {[
              { color: C.success, label: "Available" },
              { color: C.primaryPurple, label: "En Route" },
              { color: C.gray7B, label: "Offline" },
            ].map(({ color, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5"
                style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: color,
                    display: "inline-block",
                  }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
