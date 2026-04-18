import apiClient from "./apiClient";

/* ─── Ride Status Enum ─────────────────────────────────────────────────────── */
export type RideStatus =
  | "PENDING"
  | "SEARCHING_DRIVER"
  | "ASSIGNED"
  | "EN_ROUTE_TO_PICKUP"
  | "ARRIVED"
  | "IN_TRIP"
  | "COMPLETED"
  | "CANCELLED";

/* ─── Backend Ride shape ───────────────────────────────────────────────────── */
export interface RidePassenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface RideDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface RideVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string | null;
  status: string;
}

export interface RideVehicleClass {
  id: string;
  name: string;
  seats: number;
  bags: number;
  freeWaitingTime: number;
}

export interface BackendRide {
  id: string;
  passengerId: string;
  driverId: string | null;
  vehicleId: string | null;
  classId: string;
  status: RideStatus;

  pickupAddress: string;
  pickupLat: number | null;
  pickupLon: number | null;
  dropoffAddress: string;
  dropoffLat: number | null;
  dropoffLon: number | null;

  distanceKm: number | null;
  durationMin: number | null;
  distanceKmReal: number | null;
  durationMinReal: number | null;

  priceEstimate: number | null;
  priceFinal: number | null;
  surgeMultiplier: number | null;
  loyaltyPointsEarned: number;

  scheduledAt: string;
  confirmedAt: string | null;
  enrouteAt: string | null;
  arrivedAt: string | null;
  tripStartedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  dispatchSnapshot: {
    attempts: number;
    totalOffers: number;
    offers: Array<{ driverId: string; status: string; score?: number; distKm?: number }>;
    result: "ASSIGNED" | "NO_DRIVER_FOUND";
  } | null;

  createdAt: string;
  updatedAt: string;

  passenger?: RidePassenger;
  driver?: RideDriver | null;
  vehicle?: RideVehicle | null;
  vehicleClass?: RideVehicleClass;
}

/* ─── Create Ride DTO ──────────────────────────────────────────────────────── */
export interface CreateRidePayload {
  passenger_id?: string;
  class_id: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_lat?: number;
  pickup_lon?: number;
  dropoff_lat?: number;
  dropoff_lon?: number;
  scheduled_at: string;
}

/* ─── Cancel Ride DTO ──────────────────────────────────────────────────────── */
export interface CancelRidePayload {
  cancellation_reason?: string;
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const AVAILABLE_STATUSES: RideStatus[] = ["PENDING", "SEARCHING_DRIVER"];
const UPCOMING_STATUSES: RideStatus[] = ["ASSIGNED", "EN_ROUTE_TO_PICKUP", "ARRIVED", "IN_TRIP"];
const PAST_STATUSES: RideStatus[] = ["COMPLETED", "CANCELLED"];

/* ─── API ──────────────────────────────────────────────────────────────────── */
export const ridesApi = {
  getAll: (): Promise<BackendRide[]> =>
    apiClient.get("/rides").then((r) => r.data),

  getOne: (id: string): Promise<BackendRide> =>
    apiClient.get(`/rides/${id}`).then((r) => r.data),

  create: (payload: CreateRidePayload): Promise<BackendRide> =>
    apiClient.post("/rides", payload).then((r) => r.data),

  confirm: (id: string): Promise<BackendRide> =>
    apiClient.patch(`/rides/${id}/confirm`).then((r) => r.data),

  cancel: (id: string, payload?: CancelRidePayload): Promise<BackendRide> =>
    apiClient.patch(`/rides/${id}/cancel`, payload ?? {}).then((r) => r.data),

  hardDelete: (id: string): Promise<void> =>
    apiClient.delete(`/rides/${id}`).then(() => undefined),

  triggerDispatch: (rideId: string): Promise<{ message: string }> =>
    apiClient.post(`/dispatch/ride/${rideId}`).then((r) => r.data),
};

/* ─── Filter helpers ───────────────────────────────────────────────────────── */
export function filterAvailable(rides: BackendRide[]): BackendRide[] {
  return rides.filter((r) => AVAILABLE_STATUSES.includes(r.status));
}

export function filterUpcoming(rides: BackendRide[]): BackendRide[] {
  return rides.filter((r) => UPCOMING_STATUSES.includes(r.status));
}

export function filterPast(rides: BackendRide[]): BackendRide[] {
  return rides.filter((r) => PAST_STATUSES.includes(r.status));
}

/* ─── Formatting helpers ───────────────────────────────────────────────────── */
export function fmtDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function fmtTime(iso: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  } catch {
    return iso;
  }
}

export function passengerName(ride: BackendRide): string {
  const p = ride.passenger;
  if (!p) return "Unknown";
  return `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.email;
}

export function driverName(ride: BackendRide): string {
  const d = ride.driver;
  if (!d) return "Unassigned";
  return `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim() || d.email;
}

export function vehicleLabel(ride: BackendRide): string {
  const v = ride.vehicle;
  if (!v) return "—";
  return `${v.make} ${v.model}`.trim();
}

export function statusLabel(status: RideStatus): string {
  const map: Record<RideStatus, string> = {
    PENDING: "Pending",
    SEARCHING_DRIVER: "Searching",
    ASSIGNED: "Assigned",
    EN_ROUTE_TO_PICKUP: "En Route",
    ARRIVED: "Arrived",
    IN_TRIP: "In Trip",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[status] ?? status;
}
