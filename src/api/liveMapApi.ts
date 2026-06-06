import apiClient from "./apiClient";

// ─── Types matching backend response ─────────────────────────────────────────────

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

export interface RideLocation {
  ride_id: string;
  status: string;
  pickup_lat: number | null;
  pickup_lon: number | null;
  dropoff_lat: number | null;
  dropoff_lon: number | null;
  distance_km: number | null;
  driver: {
    id: string;
    user_id: string;
    name: string;
  };
  passenger: {
    id: string;
    user_id: string;
    name: string;
  };
  driver_location: {
    latitude: number | null;
    longitude: number | null;
    progress: number | null;
  };
}

export interface NearbyDriver extends DriverLocation {
  distance_km: number;
}

export interface HeatmapPoint {
  grid_lat: number;
  grid_lng: number;
  driver_count: number;
}

// ─── API functions ───────────────────────────────────────────────────────────────

export const liveMapApi = {
  /**
   * Get online drivers with their current locations
   */
  getOnlineDrivers: async (params?: {
    status?: string;
    rating_min?: number;
    online_only?: boolean;
    lat_min?: number;
    lat_max?: number;
    lng_min?: number;
    lng_max?: number;
  }): Promise<DriverLocation[]> => {
    const response = await apiClient.get<DriverLocation[]>(
      "/analytics/live-map/drivers",
      { params }
    );
    return response.data;
  },

  /**
   * Get active rides with driver and passenger positions
   */
  getActiveRides: async (params?: {
    status?: string;
    lat_min?: number;
    lat_max?: number;
    lng_min?: number;
    lng_max?: number;
  }): Promise<RideLocation[]> => {
    const response = await apiClient.get<RideLocation[]>(
      "/analytics/live-map/rides",
      { params }
    );
    return response.data;
  },

  /**
   * Get drivers within a specific radius of a point
   */
  getNearbyDrivers: async (
    lat: number,
    lng: number,
    radiusMeters: number
  ): Promise<NearbyDriver[]> => {
    const response = await apiClient.get<NearbyDriver[]>(
      "/analytics/live-map/drivers/nearby",
      {
        params: { lat, lng, radius_meters: radiusMeters },
      }
    );
    return response.data;
  },

  /**
   * Get heat map data - driver density by grid cells
   */
  getHeatmapData: async (
    latMin: number,
    latMax: number,
    lngMin: number,
    lngMax: number,
    gridSize?: number
  ): Promise<HeatmapPoint[]> => {
    const response = await apiClient.get<HeatmapPoint[]>(
      "/analytics/live-map/heatmap",
      {
        params: { lat_min: latMin, lat_max: latMax, lng_min: lngMin, lng_max: lngMax, grid_size: gridSize },
      }
    );
    return response.data;
  },
};
