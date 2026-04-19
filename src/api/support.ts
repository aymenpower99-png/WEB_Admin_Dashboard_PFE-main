import apiClient from "./apiClient";

export type BackendTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_user"
  | "resolved";

export type BackendTicketCategory =
  | "account"
  | "payment"
  | "ride"
  | "technical"
  | "other";

export interface BackendMessage {
  id: string;
  body: string;
  senderId: string;
  ticketId: string;
  sender?: { id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
}

export interface BackendTicket {
  id: string;
  subject: string;
  description: string;
  status: BackendTicketStatus;
  category: BackendTicketCategory;
  authorId: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
  assignedAdminId: string | null;
  assignedAdmin?: { id: string; firstName: string; lastName: string } | null;
  messages?: BackendMessage[];
  rideId?: string | null;
  metadata?: Record<string, any> | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTickets {
  data: BackendTicket[];
  total: number;
  page: number;
  limit: number;
}

export const supportApi = {
  listAll: (page = 1, limit = 20, status?: BackendTicketStatus): Promise<PaginatedTickets> => {
    const params: Record<string, unknown> = { page, limit };
    if (status) params.status = status;
    return apiClient.get("/admin/support/tickets", { params }).then((r) => r.data);
  },

  getOne: (id: string): Promise<BackendTicket> =>
    apiClient.get(`/admin/support/tickets/${id}`).then((r) => r.data),

  reply: (id: string, body: string): Promise<BackendMessage> =>
    apiClient.post(`/admin/support/tickets/${id}/reply`, { body }).then((r) => r.data),

  updateStatus: (id: string, status: BackendTicketStatus): Promise<BackendTicket> =>
    apiClient.patch(`/admin/support/tickets/${id}/status`, { status }).then((r) => r.data),

  assign: (id: string): Promise<BackendTicket> =>
    apiClient.post(`/admin/support/tickets/${id}/assign`).then((r) => r.data),

  remove: (id: string): Promise<{ message: string }> =>
    apiClient.delete(`/admin/support/tickets/${id}`).then((r) => r.data),
};