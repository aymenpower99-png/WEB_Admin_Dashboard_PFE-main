import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { C } from "./tokens";
import { fetchFleetData } from "./mockData";
import type { Vehicle } from ".";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:      C.success,
  "EN ROUTE":  C.primaryPurple,
  MAINTENANCE: C.warning,
};

/** Demand hotspots — [lng, lat, weight 0-1] */
const HEAT_POINTS: GeoJSON.Feature[] = [
  [10.1658, 36.8190, 1.0],
  [10.2271, 36.8510, 0.85],
  [10.1930, 36.8740, 0.70],
  [10.2310, 36.8320, 0.65],
  [10.1750, 36.8640, 0.55],
  [10.3230, 36.8780, 0.50],
  [10.1340, 36.8090, 0.60],
  [10.0990, 36.8090, 0.40],
  [10.3050, 36.8180, 0.45],
  [10.2050, 36.8400, 0.35],
  [10.7603, 34.7406, 0.80],
  [10.6369, 35.8256, 0.55],
  [10.8113, 35.7643, 0.45],
].map(([lng, lat, w]) => ({
  type: "Feature",
  properties: { weight: w },
  geometry: { type: "Point", coordinates: [lng, lat] },
}));

function markerEl(color: string): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = `
    width:100%;height:100%;border-radius:50%;
    background:${color};
    border:2.5px solid #fff;
    box-shadow:0 0 8px ${color}99;
    cursor:pointer;
  `;
  return el;
}

interface HeatMapCanvasProps {
  dark: boolean;
}

export function HeatMapCanvas({ dark }: HeatMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markersRef   = useRef<mapboxgl.Marker[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);

  /* fetch fleet once */
  useEffect(() => {
    fetchFleetData().then(setFleet).catch(console.error);
  }, []);

  /* init map */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: dark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      center: [10.18, 36.82],
      zoom: 11,
      attributionControl: false,
      logoPosition: "bottom-left",
    });

    map.on("load", () => {
      /* ── heatmap layer ── */
      map.addSource("demand", {
        type: "geojson",
        data: { type: "FeatureCollection", features: HEAT_POINTS },
      });

      map.addLayer({
        id: "demand-heat",
        type: "heatmap",
        source: "demand",
        maxzoom: 15,
        paint: {
          "heatmap-weight":    ["interpolate", ["linear"], ["get", "weight"], 0, 0, 1, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
          "heatmap-radius":    ["interpolate", ["linear"], ["zoom"], 0, 20, 15, 60],
          "heatmap-opacity":   0.55,
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0,   "rgba(0,0,0,0)",
            0.2, "rgba(75,159,255,0.6)",
            0.5, "rgba(255,149,0,0.7)",
            0.8, "rgba(255,59,48,0.8)",
            1,   "rgba(255,59,48,1)",
          ],
        },
      });
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* swap style when dark changes */
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(
      dark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11"
    );
  }, [dark]);

  /* drop / refresh driver markers whenever fleet updates */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || fleet.length === 0) return;

    /* clear old markers */
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const addMarkers = () => {
      fleet.forEach((v) => {
        if (v.lat == null || v.lng == null) return;

        const color = STATUS_COLOR[v.status] ?? C.gray7B;
        const el    = markerEl(color);

        const popup = new mapboxgl.Popup({
          offset: 12,
          closeButton: false,
          className: "moviroo-popup",
        }).setHTML(`
          <div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#fff;min-width:150px">
            <div style="font-weight:700;color:${color};margin-bottom:6px">${v.id}</div>
            <div style="color:#aaa;margin-bottom:2px">
              <span style="display:inline-block;width:7px;height:7px;border-radius:50%;
                background:${color};margin-right:5px;vertical-align:middle"></span>
              ${v.status}
            </div>
            <div style="color:#ccc">${v.driver ?? "Unassigned"}</div>
            <div style="color:#888;font-size:11px;margin-top:4px">${v.location}</div>
            <div style="margin-top:6px">
              <div style="height:4px;border-radius:2px;background:#333;overflow:hidden">
                <div style="width:${v.battery}%;height:100%;background:${color};border-radius:2px"></div>
              </div>
              <div style="font-size:10px;color:${color};margin-top:2px">${v.battery}%</div>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([v.lng, v.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    /* if style already loaded, add immediately; otherwise wait */
    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once("styledata", addMarkers);
    }
  }, [fleet]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0 0 12px 12px",
        overflow: "hidden",
      }}
    />
  );
}