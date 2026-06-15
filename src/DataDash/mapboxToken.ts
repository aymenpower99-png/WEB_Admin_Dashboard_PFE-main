// ─── Fetch Mapbox token from backend ────────────────────────────────────────
import mapboxgl from "mapbox-gl";

let cachedToken: string | null = null;
let cachedPromise: Promise<string> | null = null;

export async function getMapboxToken(): Promise<string> {
  if (mapboxgl.accessToken && mapboxgl.accessToken !== "") {
    cachedToken = mapboxgl.accessToken;
    return cachedToken;
  }
  if (cachedToken) {
    mapboxgl.accessToken = cachedToken; // ✅ safe: inside `if (cachedToken)` so it's a string here
    return cachedToken;
  }
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const res = await fetch(`${baseUrl}/rides/config/mapbox-token`);
    if (!res.ok) throw new Error(`Failed to fetch Mapbox token: ${res.status}`);
    const data = await res.json();
    if (!data.token) throw new Error("Mapbox token missing in response");
    cachedToken = data.token as string; // ✅ explicitly cast to string
    mapboxgl.accessToken = cachedToken; // ✅ now guaranteed string
    return cachedToken;
  })();

  return cachedPromise;
}