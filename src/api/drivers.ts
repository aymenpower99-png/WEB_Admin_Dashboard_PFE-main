import apiClient from "./apiClient";

export type DriverAvailabilityStatus = "online" | "offline";
export type DriverLanguage = "English" | "French" | "Arabic";

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
  language: DriverLanguage | null;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string | null;
  } | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface CompleteDriverProfilePayload {
  driverLicenseNumber: string;
  driverLicenseExpiry: string;
  driverLicenseFrontUrl: string;
  driverLicenseBackUrl: string;
  language: DriverLanguage;
  phone: string;
}

export const driversApi = {
  // axios response shape: { data: { data: DriverProfile[], total, page, limit } }
  // so .then(r => r.data) gives us { data: DriverProfile[], total, page, limit }
  getAll: (params?: {
    page?: number;
    limit?: number;
    availabilityStatus?: DriverAvailabilityStatus;
  }): Promise<{ data: DriverProfile[]; total: number; page: number; limit: number }> =>
    apiClient.get("/drivers", { params }).then((r) => r.data),

  getOne: (id: string): Promise<DriverProfile> =>
    apiClient.get(`/drivers/${id}`).then((r) => r.data),

  update: (
    id: string,
    payload: Partial<CompleteDriverProfilePayload & { availabilityStatus: DriverAvailabilityStatus }>,
  ): Promise<DriverProfile> =>
    apiClient.patch(`/drivers/${id}`, payload).then((r) => r.data),

  remove: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/drivers/${id}`).then((r) => r.data),
};