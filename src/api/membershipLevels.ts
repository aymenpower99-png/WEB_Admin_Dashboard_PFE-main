import apiClient from "./apiClient";

export interface MembershipLevel {
  id: string;
  name: string;
  requiredPoints: number;
  discountPercentage: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipLevelPayload {
  name: string;
  requiredPoints: number;
  discountPercentage: number;
  order: number;
  isActive?: boolean;
}

export type UpdateMembershipLevelPayload = Partial<CreateMembershipLevelPayload>;

export const membershipLevelsApi = {
  /** GET /admin/membership-levels */
  getAll: (): Promise<MembershipLevel[]> =>
    apiClient.get("/admin/membership-levels").then((r) => r.data),

  /** GET /admin/membership-levels/active */
  getAllActive: (): Promise<MembershipLevel[]> =>
    apiClient.get("/admin/membership-levels/active").then((r) => r.data),

  /** GET /admin/membership-levels/:id */
  getOne: (id: string): Promise<MembershipLevel> =>
    apiClient.get(`/admin/membership-levels/${id}`).then((r) => r.data),

  /** POST /admin/membership-levels */
  create: (payload: CreateMembershipLevelPayload): Promise<MembershipLevel> =>
    apiClient.post("/admin/membership-levels", payload).then((r) => r.data),

  /** PATCH /admin/membership-levels/:id */
  update: (id: string, payload: UpdateMembershipLevelPayload): Promise<MembershipLevel> =>
    apiClient.patch(`/admin/membership-levels/${id}`, payload).then((r) => r.data),

  /** PATCH /admin/membership-levels/:id/toggle */
  toggleActive: (id: string): Promise<MembershipLevel> =>
    apiClient.patch(`/admin/membership-levels/${id}/toggle`).then((r) => r.data),
};
