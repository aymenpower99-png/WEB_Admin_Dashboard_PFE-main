import apiClient from "./apiClient";

// ─── Types aligned with backend entities ──────────────────────────────────────

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
    role: string;
  };
  assignedAdminId: string | null;
  assignedAdmin?: { id: string; firstName: string; lastName: string } | null;
  messages?: BackendMessage[];
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

// ─── API calls ─────────────────────────────────────────────────────────────────

export const supportApi = {
  /** List all tickets (admin). Optional status filter + pagination. */
  listAll: (
    page = 1,
    limit = 20,
    status?: BackendTicketStatus
  ): Promise<PaginatedTickets> => {
    const params: Record<string, unknown> = { page, limit };
    if (status) params.status = status;
    return apiClient
      .get("/admin/support/tickets", { params })
      .then((r) => r.data);
  },

  /** Get a single ticket with full messages. */
  getOne: (id: string): Promise<BackendTicket> =>
    apiClient.get(`/admin/support/tickets/${id}`).then((r) => r.data),

  /** Admin reply to a ticket. */
  reply: (id: string, body: string): Promise<BackendMessage> =>
    apiClient
      .post(`/admin/support/tickets/${id}/reply`, { body })
      .then((r) => r.data),

  /** Update ticket status. */
  updateStatus: (
    id: string,
    status: BackendTicketStatus
  ): Promise<BackendTicket> =>
    apiClient
      .patch(`/admin/support/tickets/${id}/status`, { status })
      .then((r) => r.data),

  /** Assign ticket to the currently logged-in admin. */
  assign: (id: string): Promise<BackendTicket> =>
    apiClient
      .post(`/admin/support/tickets/${id}/assign`)
      .then((r) => r.data),
};