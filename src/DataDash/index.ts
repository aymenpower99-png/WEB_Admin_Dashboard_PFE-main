// ─── Shared Types ─────────────────────────────────────────────────────────────

export type VehicleStatus = "ACTIVE" | "EN ROUTE" | "MAINTENANCE";

export interface Vehicle {
  modele: string;
  id: string;
  status: VehicleStatus;
  driver: string | null;
  location: string;
  battery: number;
  lat: number;
  lng: number;
}

export interface RevenueEntry {
  day: string;
  revenue: number;
  rides: number;
}

export interface SupportEntry {
  time: string;
  resolved: number;
  pending: number;
}

export interface StatusStyle {
  bg: string;
  text: string;
}
