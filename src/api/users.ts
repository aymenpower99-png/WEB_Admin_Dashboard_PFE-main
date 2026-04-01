import apiClient from "./apiClient";
import type { UserStatus } from "../Dashboard/constants";

// ✅ Added super_admin to match what the backend actually returns
export type UserRole = "passenger" | "driver" | "admin" | "super_admin";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  trips?: number;
}

export interface InviteUserPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  role: "passenger" | "driver";
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?:  string;
  email?:     string;
  role?: "passenger" | "driver";
}

export const usersApi = {
  getAll: (): Promise<{ data: AdminUser[]; total: number }> =>
    apiClient.get("/admin/users").then((r) => r.data),

  getOne: (id: string): Promise<AdminUser> =>
    apiClient.get(`/admin/users/${id}`).then((r) => r.data),

  invite: (payload: InviteUserPayload): Promise<{ message: string; userId: string }> =>
    apiClient.post("/admin/users/invite", payload).then((r) => r.data),

  update: (id: string, payload: UpdateUserPayload): Promise<AdminUser> =>
    apiClient.patch(`/admin/users/${id}`, payload).then((r) => r.data),

  block: (id: string): Promise<{ message: string }> =>
    apiClient.post(`/admin/users/${id}/block`).then((r) => r.data),

  unblock: (id: string): Promise<{ message: string }> =>
    apiClient.post(`/admin/users/${id}/unblock`).then((r) => r.data),

  resendInvite: (id: string): Promise<{ message: string }> =>
    apiClient.post(`/admin/users/${id}/resend-invite`).then((r) => r.data),
};