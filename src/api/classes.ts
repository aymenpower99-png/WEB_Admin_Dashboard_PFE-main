import apiClient from "./apiClient";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export type UpdateClassPayload = Partial<CreateClassPayload>;

export const classesApi = {
  getAll: (): Promise<VehicleClass[]> =>
    apiClient.get("/admin/classes").then((r) => r.data),

  getOne: (id: string): Promise<VehicleClass> =>
    apiClient.get(`/admin/classes/${id}`).then((r) => r.data),

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