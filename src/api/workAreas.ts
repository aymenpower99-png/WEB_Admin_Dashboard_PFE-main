import apiClient from "./apiClient";

export interface WorkAreaItem {
  id: string;
  country: string;
  ville: string;
  createdAt: string;
}

export interface WorkAreaDriver {
  id: string;
  name: string;
  vehicle: string | null;
  availabilityStatus: string;
  workAreaId: string | null;
  workArea: { id: string; country: string; ville: string } | null;
}

export const workAreasApi = {
  getAll: (): Promise<WorkAreaItem[]> =>
    apiClient.get("/work-areas").then(r => r.data),

  create: (payload: { country: string; ville: string }): Promise<WorkAreaItem> =>
    apiClient.post("/work-areas", payload).then(r => r.data),

  update: (id: string, payload: { country?: string; ville?: string }): Promise<WorkAreaItem> =>
    apiClient.patch(`/work-areas/${id}`, payload).then(r => r.data),

  remove: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/work-areas/${id}`).then(r => r.data),

  getDrivers: (): Promise<WorkAreaDriver[]> =>
    apiClient.get("/work-areas/drivers").then(r => r.data),

  assignDriver: (driverId: string, workAreaId: string | null): Promise<any> =>
    apiClient.post(`/work-areas/drivers/${driverId}/assign`, { workAreaId }).then(r => r.data),
};