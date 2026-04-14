import apiClient from "./apiClient";
import type { UserStatus } from "../Dashboard/constants";

export type UserRole = "passenger" | "driver" | "admin" | "super_admin";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  agencyId: string | null;
  provider: string;
  createdAt: string;
  trips?: number;
  profileComplete?: boolean;
}

export interface InviteUserPayload {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;       // ← now required
  role: "passenger" | "driver";
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?:  string;
  email?:     string;
  role?: "passenger" | "driver";
  phone?:    string;
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

  deleteUser: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/admin/users/${id}`).then((r) => r.data),

  block: (id: string): Promise<{ message: string }> =>
    apiClient.post(`/admin/users/${id}/block`).then((r) => r.data),

  unblock: (id: string): Promise<{ message: string }> =>
    apiClient.post(`/admin/users/${id}/unblock`).then((r) => r.data),

  resendInvite: (id: string): Promise<{ message: string }> =>
    apiClient.post(`/admin/users/${id}/resend-invite`).then((r) => r.data),
};