import apiClient from "./apiClient";

export interface HelpArticleRaw {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  categoryKey: string;
  categoryLabel: Record<string, string>;
  status: "auto" | "reviewed" | "disabled";
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  categoryKey: string;
  categoryLabel?: string;
  sortOrder?: number;
}

export interface UpdateArticlePayload {
  title?: Record<string, string>;
  description?: Record<string, string>;
  categoryKey?: string;
  categoryLabel?: Record<string, string>;
  status?: "auto" | "reviewed" | "disabled";
  isActive?: boolean;
  sortOrder?: number;
}

export const helpCenterApi = {
  listAll: (): Promise<HelpArticleRaw[]> =>
    apiClient.get("/admin/help-center").then((r) => r.data),

  getOne: (id: string): Promise<HelpArticleRaw> =>
    apiClient.get(`/admin/help-center/${id}`).then((r) => r.data),

  create: (data: CreateArticlePayload): Promise<HelpArticleRaw> =>
    apiClient.post("/admin/help-center", data).then((r) => r.data),

  update: (id: string, data: UpdateArticlePayload): Promise<HelpArticleRaw> =>
    apiClient.patch(`/admin/help-center/${id}`, data).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/admin/help-center/${id}`).then(() => undefined),
};
