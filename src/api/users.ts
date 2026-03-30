import apiClient from "./apiClient";
import type { UserStatus } from "../Dashboard/constants";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Rider" | "Driver" | "Admin";
  status: UserStatus;
  createdAt: string;
  trips?: number;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Rider" | "Driver";
  status: UserStatus;
}

export const usersApi = {
  getAll: (): Promise<{ data: AdminUser[]; total: number }> =>
    apiClient.get("/admin/users").then((r) => r.data),

  create: (payload: CreateUserPayload): Promise<AdminUser> =>
    apiClient.post("/admin/users", payload).then((r) => r.data),

  update: (id: string, payload: Partial<CreateUserPayload>): Promise<AdminUser> =>
    apiClient.patch(`/admin/users/${id}`, payload).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/admin/users/${id}`).then((r) => r.data),
};