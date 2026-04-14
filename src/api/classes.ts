import apiClient from "./apiClient";

// ── Extra feature/service item ────────────────────────────────────────────────
export interface ExtraFeatureItem {
  name: string;
  enabled: boolean;
}

// ── Vehicle (minimal, for class detail view) ─────────────────────────────────
export interface ClassVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string | null;
  driverId: string | null;
  driverName: string | null;   // ✅ NEW — resolved from backend
  status: "Pending" | "Available" | "On_Trip" | "Maintenance";
  photos: string[] | null;
  isActive: boolean;
  createdAt: string;
}

// ── Class ─────────────────────────────────────────────────────────────────────
export interface VehicleClass {
  id: string;
  name: string;
  imageUrl: string | null;
  seats: number;
  bags: number;
  wifi: boolean;
  ac: boolean;
  water: boolean;
  freeWaitingTime: number;
  doorToDoor: boolean;
  meetAndGreet: boolean;
  extraFeatures: ExtraFeatureItem[];
  extraServices: ExtraFeatureItem[];
  isActive: boolean;
  vehicleCount?: number;   // ← returned by GET /admin/classes list
  createdAt: string;
  updatedAt: string;
}

// ── Class Detail (with vehicles) ─────────────────────────────────────────────
export interface VehicleClassDetail extends VehicleClass {
  features: {
    seats: number;
    bags: number;
    wifi: boolean;
    ac: boolean;
    water: boolean;
    freeWaitingTime: number;
    doorToDoor: boolean;
    meetAndGreet: boolean;
  };
  vehicleCount: number;
  vehicles: ClassVehicle[];
}

export interface ClassFeatures {
  seats: number;
  bags: number;
  wifi: boolean;
  ac: boolean;
  water: boolean;
  freeWaitingTime: number;
  doorToDoor: boolean;
  meetAndGreet: boolean;
  extraFeatures: ExtraFeatureItem[];
  extraServices: ExtraFeatureItem[];
}

export interface CreateClassPayload {
  name: string;
  imageUrl?: string;
  seats?: number;
  bags?: number;
  wifi?: boolean;
  ac?: boolean;
  water?: boolean;
  freeWaitingTime?: number;
  doorToDoor?: boolean;
  meetAndGreet?: boolean;
  extraFeatures?: ExtraFeatureItem[];
  extraServices?: ExtraFeatureItem[];
}

export type UpdateClassPayload = Partial<CreateClassPayload>;

export const classesApi = {
  /** GET /admin/classes — returns all classes WITH vehicleCount */
  getAll: (): Promise<VehicleClass[]> =>
    apiClient.get("/admin/classes").then((r) => r.data),

  /** GET /admin/classes/:id — class info only */
  getOne: (id: string): Promise<VehicleClass> =>
    apiClient.get(`/admin/classes/${id}`).then((r) => r.data),

  /** GET /admin/classes/:id/detail — class + features + all vehicles */
  getDetail: (id: string): Promise<VehicleClassDetail> =>
    apiClient.get(`/admin/classes/${id}/detail`).then((r) => r.data),

  getFeatures: (id: string): Promise<ClassFeatures> =>
    apiClient.get(`/admin/classes/${id}/features`).then((r) => r.data),

  create: (payload: CreateClassPayload): Promise<VehicleClass> =>
    apiClient.post("/admin/classes", payload).then((r) => r.data),

  update: (id: string, payload: UpdateClassPayload): Promise<VehicleClass> =>
    apiClient.patch(`/admin/classes/${id}`, payload).then((r) => r.data),

  remove: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/admin/classes/${id}`).then((r) => r.data),

  uploadImage: (file: File): Promise<{ url: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    return apiClient
      .post("/admin/classes/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};