export interface Place {
  id: string;
  name: string;
  fullAddress: string;
  category: string;
  lat: number;
  lng: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  // Airports & Travel
  airport: "✈️",
  aerodrome: "✈️",
  airport_terminal: "✈️",
  heliport: "🚁",
  train_station: "🚂",
  bus_station: "🚌",
  transit_station: "🚇",

  // Hotels & Lodging
  hotel: "🏨",
  lodging: "🏨",
  motel: "🏨",
  hostel: "🏨",
  bed_and_breakfast: "🏨",
  guest_house: "🏨",
  resort: "🏨",

  // Restaurants & Food
  restaurant: "🍽️",
  food: "🍽️",
  cafe: "☕",
  coffee_shop: "☕",
  bar: "🍺",
  pub: "🍺",
  bakery: "🥐",
  fast_food: "🍔",

  // Shopping
  shop: "🛒",
  shopping_mall: "🛍️",
  supermarket: "🛒",
  grocery: "🛒",
  convenience_store: "🏪",

  // Health & Medical
  hospital: "🏥",
  clinic: "🏥",
  pharmacy: "💊",
  dentist: "🦷",
  doctor: "🏥",

  // Education
  school: "🎓",
  university: "🎓",
  college: "🎓",
  library: "📚",

  // Entertainment
  cinema: "🎬",
  movie_theater: "🎬",
  theater: "🎭",
  museum: "🏛️",
  art_gallery: "🎨",
  park: "🌳",
  amusement_park: "🎢",
  zoo: "🦁",

  // Places & Landmarks
  city: "🏙️",
  town: "🏘️",
  village: "🏘️",
  locality: "🏙️",
  neighborhood: "🏘️",
  landmark: "🏛️",
  tourist_attraction: "🎯",
  point_of_interest: "📍",
  place: "📍",

  // Services
  bank: "🏦",
  atm: "💳",
  post_office: "📮",
  police: "👮",
  fire_station: "🚒",

  // Sports & Recreation
  stadium: "🏟️",
  gym: "🏋️",
  swimming_pool: "🏊",
  golf_course: "⛳",

  // Default
  default: "📍",
};

export function getCategoryIcon(categories: string, name?: string): string {
  const lower = categories.toLowerCase();
  console.log(
    `[ICON] 🔍 Looking up icon for category: "${categories}" (lower: "${lower}")`,
  );

  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) {
      console.log(`[ICON] ✅ Matched key "${key}" → icon: ${icon}`);
      return icon;
    }
  }

  // Fallback: try to infer from name if category is generic
  if (name) {
    const nameLower = name.toLowerCase();
    console.log(`[ICON] 🔄 Trying name-based fallback for: "${name}"`);

    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
      if (nameLower.includes(key)) {
        console.log(`[ICON] ✅ Name matched key "${key}" → icon: ${icon}`);
        return icon;
      }
    }
  }

  console.log(`[ICON] ❌ No match found, returning default 📍`);
  return "📍";
}

// Search using backend API (same as mobile app)
// Google Places primary, then fallback to Mapbox + Nominatim
export async function searchPlaces(
  query: string,
  proximity: [number, number] = [10.18, 36.81],
): Promise<Place[]> {
  if (!query.trim()) return [];

  const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api";

  console.log(`[AUTOCOMPLETE] 🔍 Searching for: "${query}"`);
  console.log(`[AUTOCOMPLETE] 📍 Proximity: ${proximity[0]}, ${proximity[1]}`);

  // Standard fetch options with ngrok skip header for deployed environments
  const fetchOpts: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  };

  // Try Google Places first (primary)
  try {
    const params = new URLSearchParams({
      q: query,
      lang: "en",
    });

    const url = `${API_URL}/rides/geocode/google-search?${params.toString()}`;
    console.log(`[AUTOCOMPLETE] 🌐 Trying Google Places: ${url}`);

    const startTime = Date.now();
    const res = await fetch(url, fetchOpts);
    const duration = Date.now() - startTime;

    console.log(`[AUTOCOMPLETE] ⏱️ Google request duration: ${duration}ms`);
    console.log(
      `[AUTOCOMPLETE] 📊 Google response status: ${res.status} ${res.statusText}`,
    );

    if (res.ok) {
      const data = await res.json();
      console.log(`[AUTOCOMPLETE] 📦 Google raw response:`, data);
      console.log(`[AUTOCOMPLETE] 📋 Google results: ${data?.length || 0}`);

      if (data && data.length > 0) {
        const sources = data.map(
          (item: any) => item.source || item._debug_source || "unknown",
        );
        const uniqueSources = [...new Set(sources)];
        console.log(
          `[AUTOCOMPLETE] 🔌 Google API source:`,
          uniqueSources.join(", "),
        );

        const transformed = (data || []).map((item: any) => ({
          id: item.place_id || item.id || `${item.lat},${item.lon}`,
          name:
            item.display_name?.split(",")[0] ||
            item.display_name ||
            item.address ||
            item.name,
          fullAddress: item.display_name || item.address || item.name,
          category: item.place_type || item.type || "point_of_interest",
          lat: item.lat || 0,
          lng: item.lon || 0,
          source: item.source || item._debug_source || "google",
        }));

        console.log(
          `[AUTOCOMPLETE] ✅ Google - Transformed ${transformed.length} places`,
        );
        return transformed;
      }
      console.log(`[AUTOCOMPLETE] Google returned empty, trying fallback`);
    } else {
      console.warn(
        `[AUTOCOMPLETE] Google failed with status ${res.status}, trying fallback`,
      );
    }
  } catch (e) {
    console.warn(`[AUTOCOMPLETE] Google Places error, trying fallback:`, e);
  }

  // Fallback to Mapbox + Nominatim
  console.log(`[AUTOCOMPLETE] 🔄 Falling back to Mapbox/Nominatim`);
  try {
    const params = new URLSearchParams({
      q: query,
      proximityLat: proximity[0].toString(),
      proximityLon: proximity[1].toString(),
      lang: "en",
    });

    const url = `${API_URL}/rides/geocode/search?${params.toString()}`;
    console.log(`[AUTOCOMPLETE] 🌐 Fallback URL: ${url}`);

    const startTime = Date.now();
    const res = await fetch(url, fetchOpts);
    const duration = Date.now() - startTime;

    console.log(`[AUTOCOMPLETE] ⏱️ Fallback request duration: ${duration}ms`);
    console.log(
      `[AUTOCOMPLETE] 📊 Fallback response status: ${res.status} ${res.statusText}`,
    );

    if (!res.ok) {
      console.warn(
        `[AUTOCOMPLETE] ❌ Fallback API failed:`,
        res.status,
        res.statusText,
      );
      return [];
    }

    const data = await res.json();
    console.log(`[AUTOCOMPLETE] 📦 Fallback raw response:`, data);
    console.log(`[AUTOCOMPLETE] 📋 Fallback results: ${data?.length || 0}`);

    // Log API source if available in response
    if (data && data.length > 0) {
      const sources = data.map(
        (item: any) => item.source || item._debug_source || "unknown",
      );
      const uniqueSources = [...new Set(sources)];
      console.log(
        `[AUTOCOMPLETE] 🔌 Fallback API sources:`,
        uniqueSources.join(", "),
      );

      // Log first result details
      console.log(`[AUTOCOMPLETE] 🏷️ First result:`, {
        name: data[0].display_name || data[0].name,
        place_type: data[0].place_type,
        source: data[0].source || data[0]._debug_source,
        coordinates: `${data[0].lat}, ${data[0].lon}`,
      });
    }

    // Transform backend response to Place interface
    const transformed = (data || []).map((item: any) => ({
      id: item.place_id || item.id || `${item.lat},${item.lon}`,
      name:
        item.display_name?.split(",")[0] ||
        item.display_name ||
        item.address ||
        item.name,
      fullAddress: item.display_name || item.address || item.name,
      category: item.place_type || item.type || "point_of_interest",
      lat: item.lat || 0,
      lng: item.lon || 0,
      source: item.source || item._debug_source || "fallback",
    }));

    console.log(
      `[AUTOCOMPLETE] ✅ Fallback - Transformed ${transformed.length} places`,
    );
    return transformed;
  } catch (e) {
    console.error(`[AUTOCOMPLETE] 💥 Fallback API error:`, e);
    return [];
  }
}
