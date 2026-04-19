import apiClient from "./apiClient";

export type DriverAvailabilityStatus =
  | "pending"
  | "setup_required"
  | "offline"
  | "online"
  | "on_trip";

export interface DriverProfile {
  id: string;
  userId: string;
  driverLicenseNumber: string;
  driverLicenseExpiry: string;
  driverLicenseFrontUrl: string;
  driverLicenseBackUrl: string;
  ratingAverage: number | string | null;
  totalRatings: number;
  totalTrips: number;
  availabilityStatus: DriverAvailabilityStatus;
  currentLatitude: number | null;
  currentLongitude: number | null;
  lastLocationUpdate: string | null;
  createdAt: string;
  updatedAt: string;
  workAreaId?: string | null;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string | null;
    status: "Pending" | "Available" | "On_Trip" | "Maintenance";
  } | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UpdateDriverPayload {
  driverLicenseNumber?: string;
  driverLicenseExpiry?: string;
  driverLicenseFrontUrl?: string;
  driverLicenseBackUrl?: string;
  availabilityStatus?: DriverAvailabilityStatus;
  vehicleId?: string;
  fixedMonthlySalary?: number;
}

export const driversApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    availabilityStatus?: DriverAvailabilityStatus;
  }): Promise<{ data: DriverProfile[]; total: number; page: number; limit: number }> =>
    apiClient.get("/drivers", { params }).then(r => r.data),

  getOne: (id: string): Promise<DriverProfile> =>
    apiClient.get(`/drivers/${id}`).then(r => r.data),

  update: (id: string, payload: UpdateDriverPayload): Promise<DriverProfile> =>
    apiClient.patch(`/drivers/${id}`, payload).then(r => r.data),

  remove: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/drivers/${id}`).then(r => r.data),
};