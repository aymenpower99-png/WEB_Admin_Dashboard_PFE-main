import { useState, useEffect, useCallback, useRef } from "react";
import {
  supportApi,
  type BackendTicket,
  type BackendTicketStatus,
} from "../../../api/support";
import type { Ticket, TicketStatus, Message, ActivityEvent } from "./types";

// ─── Status mapping ───────────────────────────────────────────────────────────
function mapStatus(s: BackendTicketStatus): TicketStatus {
  switch (s) {
    case "open":             return "Open";
    case "in_progress":      return "In Progress";
    case "waiting_for_user": return "Pending";
    case "resolved":         return "Resolved";
    default:                 return "Open";
  }
}

export function mapStatusToBackend(s: TicketStatus): BackendTicketStatus {
  switch (s) {
    case "Open":        return "open";
    case "In Progress": return "in_progress";
    case "Pending":     return "waiting_for_user";
    case "Resolved":    return "resolved";
    default:            return "open";
  }
}

// ─── Adapt backend ticket → frontend Ticket ───────────────────────────────────
function adaptTicket(t: BackendTicket): Ticket {
  const authorName = t.author
    ? `${t.author.firstName} ${t.author.lastName}`
    : "Unknown";

  const messages: Message[] = (t.messages ?? []).map((m) => ({
    id: m.id,
    sender: m.sender
      ? `${m.sender.firstName} ${m.sender.lastName}`
      : m.senderId === t.authorId
      ? authorName
      : "Admin",
    senderType: m.senderId === t.authorId ? "user" : "admin",
    content: m.body,
    timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const category = ((): Ticket["category"] => {
    switch (t.category) {
      case "payment":   return "Payment";
      case "ride":      return "Ride";
      case "account":   return "Account";
      case "technical": return "Technical";
      default:          return "Technical";
    }
  })();

  const activity: ActivityEvent[] = [
    {
      id: `a-created-${t.id}`,
      type: "created",
      description: "Ticket created",
      timestamp: new Date(t.createdAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actor: authorName,
    },
  ];

  return {
    id: t.id,
    title: t.subject,
    description: t.description,
    status: mapStatus(t.status),
    role: (t.author?.role === "driver" ? "Driver" : "Passenger") as "Passenger" | "Driver",
    category,
    time: new Date(t.createdAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    user: {
      name: authorName,
      role: (t.author?.role === "driver" ? "Driver" : "Passenger") as "Passenger" | "Driver",
      memberSince: new Date(t.createdAt).getFullYear().toString(),
      email: t.author?.email ?? "",
      phone: "",
    },
    trip: { tripId: "—", date: "—", route: "—", price: "—", status: "—" },
    payment: { method: "—", transactionStatus: "—" },
    notes: [],
    messages,
    activity,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Track which ticket IDs have had their full messages loaded
  const loadedMessages = useRef<Set<string>>(new Set());

  // ── Fetch ticket list (no messages) ────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loadedMessages.current.clear();
      const res = await supportApi.listAll(1, 50);
      setTickets(res.data.map(adaptTicket));
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // ── Load full messages for a specific ticket (called when ticket is selected) ──
  const loadTicketMessages = useCallback(async (id: string) => {
    // Already loaded, skip
    if (loadedMessages.current.has(id)) return;
    try {
      const full = await supportApi.getOne(id);
      loadedMessages.current.add(id);
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? adaptTicket(full) : t))
      );
    } catch {
      // silently ignore — ticket still shows, just no messages yet
    }
  }, []);

  // ── Change status ───────────────────────────────────────────────────────────
  const changeStatus = useCallback(
    async (id: string, status: TicketStatus) => {
      // Optimistic update
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                activity: [
                  ...t.activity,
                  {
                    id: `a${Date.now()}`,
                    type: status === "Resolved"
                      ? ("resolved" as const)
                      : ("status_change" as const),
                    description: `Status changed to ${status}`,
                    timestamp: new Date().toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    actor: "Admin",
                  },
                ],
              }
            : t
        )
      );
      try {
        await supportApi.updateStatus(id, mapStatusToBackend(status));
      } catch {
        // revert by re-fetching
        fetchTickets();
      }
    },
    [fetchTickets]
  );

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (id: string, content: string) => {
      const tempId = `temp-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // 1. Optimistic: add message immediately so it appears at once
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  {
                    id: tempId,
                    sender: "Admin",
                    senderType: "admin" as const,
                    content,
                    timestamp,
                  },
                ],
                activity: [
                  ...t.activity,
                  {
                    id: `a${Date.now()}`,
                    type: "admin_reply" as const,
                    description: "Admin sent a message",
                    timestamp,
                    actor: "Admin",
                  },
                ],
              }
            : t
        )
      );

      try {
        // 2. Send to backend
        await supportApi.reply(id, content);

        // 3. Fetch the real updated ticket from backend (with real message IDs)
        const updated = await supportApi.getOne(id);
        loadedMessages.current.add(id);

        setTickets((prev) =>
          prev.map((t) => (t.id === id ? adaptTicket(updated) : t))
        );
      } catch {
        // Remove the optimistic message on failure
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  messages: t.messages.filter((m) => m.id !== tempId),
                }
              : t
          )
        );
      }
    },
    []
  );

  return {
    tickets,
    loading,
    error,
    changeStatus,
    sendMessage,
    loadTicketMessages,
    refetch: fetchTickets,
  };
}