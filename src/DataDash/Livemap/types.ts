export interface Driver {
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
  last_seen_at?: string;
}

export interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed_kmh: number;
  is_online: boolean;
  last_seen_at: string;
  progress: number | null;
  rating: number;
  total_trips: number;
  name: string;
}

export interface MapEvent {
  id: string;
  type: "surge" | "incident" | "hotspot";
  lat: number;
  lng: number;
  label: string;
  radius: number;
}