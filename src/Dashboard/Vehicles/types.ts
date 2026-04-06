// ============================================================
// FILE: types.ts
// ============================================================

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  vehicleClass: string;
  seats: number | null;
  driverId: string | null;
  driver: string;          // resolved display name (firstName + lastName) or ""
  status: "Pending" | "Available" | "On_Trip" | "Maintenance";
  photos: string[] | null;
  type: string;
  fuel: string;
  mileage: number;
}

export interface VehiclesPageProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate: (page: string, prefill?: Vehicle | null) => void;
}

export interface AddVehiclePageProps {
  prefill: Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate: (page: string) => void;
}

export const INITIAL_VEHICLES: Vehicle[] = [];

export function mapBackendVehicle(v: any, driverMap?: Map<string, string>): Vehicle {
  return {
    id:           v.id,
    make:         v.make,
    model:        v.model,
    year:         v.year,
    color:        v.color ?? null,
    vehicleClass: v.vehicleType ?? "Standard",
    seats:        v.seats ?? null,
    driverId:     v.driverId ?? null,
    // ✅ resolve driver name from map if provided, else empty string
    driver:       (v.driverId && driverMap?.get(v.driverId)) ?? "",
    status:       v.status,
    photos:       v.photos ?? null,
    type:         "sedan",
    fuel:         "petrol",
    mileage:      0,
  };
}