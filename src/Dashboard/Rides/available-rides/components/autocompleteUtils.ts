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
  locality: "📍",
  neighborhood: "🏘️",
  landmark: "🏛️",
  tourist_attraction: "🎯",
  point_of_interest: "📍",
  
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

export function getCategoryIcon(categories: string): string {
  const lower = categories.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📍";
}

// Search with fallback chain: Google Places -> Mapbox -> Nominatim
export async function searchPlaces(
  query: string,
  proximity: [number, number] = [10.18, 36.81]
): Promise<Place[]> {
  if (!query.trim()) return [];

  const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY ?? "";
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "";
  const GEOCODE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

  // Try Google Places API first (primary)
  if (GOOGLE_PLACES_API_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&components=country:tn&language=en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.predictions && data.predictions.length > 0) {
          return data.predictions.slice(0, 6).map((p: any) => ({
            id: p.place_id,
            name: p.structured_formatting?.main_text || p.description,
            fullAddress: p.description,
            category: p.types?.join(",") || "point_of_interest",
            lat: 0,
            lng: 0,
          }));
        }
      }
    } catch (e) {
      console.warn("Google Places API failed:", e);
    }
  }

  // Fallback to Mapbox
  if (MAPBOX_TOKEN) {
    try {
      const url = `${GEOCODE_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=poi,address,place,locality,neighborhood&country=tn&limit=6&proximity=${proximity[0]},${proximity[1]}&language=en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return (data.features ?? []).map((f: any) => ({
          id: f.id,
          name: f.text || f.place_name,
          fullAddress: f.place_name,
          category: f.properties?.category ?? f.place_type?.[0] ?? "",
          lat: f.center?.[1] ?? 0,
          lng: f.center?.[0] ?? 0,
        }));
      }
    } catch (e) {
      console.warn("Mapbox API failed:", e);
    }
  }

  // Fallback to Nominatim (OpenStreetMap)
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=tn&limit=6&addressdetails=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return (data ?? []).map((f: any) => ({
        id: f.place_id || f.osm_id?.toString(),
        name: f.display_name.split(",")[0] || f.display_name,
        fullAddress: f.display_name,
        category: f.type || "point_of_interest",
        lat: parseFloat(f.lat) || 0,
        lng: parseFloat(f.lon) || 0,
      }));
    }
  } catch (e) {
    console.warn("Nominatim API failed:", e);
  }

  // All APIs failed
  return [];
}
