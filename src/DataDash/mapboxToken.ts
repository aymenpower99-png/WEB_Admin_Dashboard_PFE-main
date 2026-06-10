// ─── Fetch Mapbox token from backend ────────────────────────────────────────
// The token is stored in the backend env (MAPBOX_ACCESS_TOKEN) and exposed
// via a public endpoint so the admin dashboard can initialise Mapbox without
// baking the key into the frontend build.
// ─────────────────────────────────────────────────────────────────────────────

import mapboxgl from "mapbox-gl";

let cachedToken: string | null = null;
let cachedPromise: Promise<string> | null = null;

export async function getMapboxToken(): Promise<string> {
  // If Mapbox already has a token (e.g. from a previous load or HMR), reuse it.
  if (mapboxgl.accessToken && mapboxgl.accessToken !== "") {
    cachedToken = mapboxgl.accessToken;
    return cachedToken;
  }
  if (cachedToken) {
    mapboxgl.accessToken = cachedToken;
    return cachedToken;
  }
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const res = await fetch(`${baseUrl}/rides/config/mapbox-token`);
    if (!res.ok) throw new Error(`Failed to fetch Mapbox token: ${res.status}`);
    const data = await res.json();
    if (!data.token) throw new Error("Mapbox token missing in response");
    cachedToken = data.token;
    mapboxgl.accessToken = cachedToken;
    return cachedToken;
  })();

  return cachedPromise;
}
