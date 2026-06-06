import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Driver } from "./types";
import { DEFAULT_CENTER, MAP_EVENTS, EVENT_COLORS } from "./constants";
import { toRealCoords, makeMarkerEl } from "./utils";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function MapboxMap({
  drivers,
  dark,
  onMapReady,
}: {
  drivers: Driver[];
  dark: boolean;
  onMapReady?: (map: mapboxgl.Map) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const eventLayersRef = useRef<string[]>([]);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: dark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11",
      center: DEFAULT_CENTER,
      zoom: 12.5,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right",
    );
    mapRef.current = map;
    onMapReady?.(map);

    map.on("load", () => {
      MAP_EVENTS.forEach((ev) => {
        const [lng, lat] = toRealCoords(ev.lat, ev.lng);
        const sourceId = `event-${ev.id}`;
        const fillId = `event-fill-${ev.id}`;
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
        : "mapbox://styles/mapbox/light-v11",
    );
  }, [dark]);

  // Sync driver markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const existingIds = new Set(markersRef.current.keys());

    drivers.forEach((d) => {
      const [lng, lat] = toRealCoords(d.lat, d.lng);

      if (markersRef.current.has(d.id)) {
        const marker = markersRef.current.get(d.id)!;
        marker.setLngLat([lng, lat]);
        const newEl = makeMarkerEl(d, false);
        newEl.addEventListener("click", (e) => {
          e.stopPropagation();
          map.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 800,
            essential: true,
          });
        });
        const oldEl = marker.getElement();
        oldEl.replaceWith(newEl);
        existingIds.delete(d.id);
      } else {
        const el = makeMarkerEl(d, false);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          map.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 800,
            essential: true,
          });
        });

        const marker = new mapboxgl.Marker({ element: el, rotation: d.bearing })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.set(d.id, marker);
        existingIds.delete(d.id);
      }
    });

    existingIds.forEach((id) => {
      markersRef.current.get(id)?.remove();
      markersRef.current.delete(id);
    });
  }, [drivers]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
