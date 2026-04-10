export interface Vehicle {
  id:           string;
  classId:      string;
  vehicleClass: { id: string; name: string; seats: number; bags: number; wifi: boolean; ac: boolean } | null;
  make:         string;
  model:        string;
  year:         number;
  color:        string | null;
  licensePlate: string | null;
  driverId:     string | null;
  driver:       string;
  status:       "Pending" | "Available" | "On_Trip" | "Maintenance";
  photos:       string[] | null;
  isActive:     boolean;
}

export interface VehiclesPageProps {
  vehicles:    Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate:  (page: string, prefill?: Vehicle | null) => void;
}

export interface AddVehiclePageProps {
  prefill:     Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate:  (page: string) => void;
}

export const INITIAL_VEHICLES: Vehicle[] = [];

export function mapBackendVehicle(v: any, driverMap?: Map<string, string>): Vehicle {
  return {
    id:           v.id,
    classId:      v.classId  ?? v.class_id ?? "",
    vehicleClass: v.vehicleClass ?? null,
    make:         v.make,
    model:        v.model,
    year:         v.year,
    color:        v.color        ?? null,
    licensePlate: v.licensePlate ?? null,
    driverId:     v.driverId     ?? null,
    driver:       (v.driverId && driverMap?.get(v.driverId)) ?? "",
    status:       v.status,
    photos:       v.photos       ?? null,
    isActive:     v.isActive     ?? true,
  };
}