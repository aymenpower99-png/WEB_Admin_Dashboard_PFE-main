import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  supportApi,
  type BackendTicket,
  type BackendTicketStatus,
} from "../../../api/support";
import type { Ticket, TicketStatus, Message, ActivityEvent } from "./types";

// ── Status mapping ─────────────────────────────────────────────────────────────
// open             → Open         (ticket just created, no admin reply yet)
// in_progress      → In Progress  (admin has replied)
// waiting_for_user → Pending      (user replied back, waiting for admin again)
// resolved         → Resolved     (manually closed)
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

function fmt(date: string) {
  return new Date(date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

  // ── Adapt backend ticket → frontend Ticket ─────────────────────────────────────
function adaptTicket(t: BackendTicket): Ticket {
  const authorName = t.author
    ? `${t.author.firstName} ${t.author.lastName}`.trim() || "Unknown"
    : "Unknown";

  // ── Messages ──────────────────────────────────────────────────────────────
  const messages: Message[] = (t.messages ?? []).map((m) => ({
    id: m.id,
    sender: m.sender
      ? `${m.sender.firstName} ${m.sender.lastName}`.trim() || "User"
      : m.senderId === t.authorId ? authorName : "Admin",
    senderId: m.senderId,
    senderType: m.senderId === t.authorId ? "user" : "admin",
    content: m.body,
    timestamp: fmt(m.createdAt),
    createdAt: m.createdAt,
    updatedAt: m.updatedAt ? fmt(m.updatedAt) : undefined,
  }));

  // ── Category ──────────────────────────────────────────────────────────────
  const category = ((): Ticket["category"] => {
    switch (t.category) {
      case "payment":   return "Payment";
      case "ride":      return "Ride";
      case "account":   return "Account";
      case "technical": return "Technical";
      default:          return "Technical";
    }
  })();

  // ── Activity — built from ticket creation + every message ─────────────────
  // This makes the activity timeline reflect reality instead of only showing "Ticket Created"
  const activity: ActivityEvent[] = [];

  // 1. Ticket created
  activity.push({
    id: `a-created-${t.id}`,
    type: "created",
    description: "Ticket created",
    timestamp: fmt(t.createdAt),
    actor: authorName,
  });

  // 2. One activity entry per message (sorted by createdAt, which backend already returns ASC)
  (t.messages ?? []).forEach((m) => {
    const isAdmin   = m.senderId !== t.authorId;
    const senderName = m.sender
      ? `${m.sender.firstName} ${m.sender.lastName}`.trim() || (isAdmin ? "Admin" : authorName)
      : isAdmin ? "Admin" : authorName;

    activity.push({
      id: `a-msg-${m.id}`,
      type: isAdmin ? "admin_reply" : "status_change",
      description: isAdmin ? "Admin sent a message" : "User replied",
      timestamp: fmt(m.createdAt),
      actor: senderName,
    });
  });

  // 3. If resolved, add a resolved event at the end
  if (t.status === "resolved" && t.resolvedAt) {
    activity.push({
      id: `a-resolved-${t.id}`,
      type: "resolved",
      description: "Ticket resolved",
      timestamp: fmt(t.resolvedAt),
      actor: "Admin",
    });
  }

  // Determine role
  const rawRole = t.author?.role ?? "";
  const role: "Passenger" | "Driver" = rawRole === "driver" ? "Driver" : "Passenger";

  return {
    id: t.id,
    title: t.subject,
    description: t.description,
    status: mapStatus(t.status),
    role,
    category,
    time: new Date(t.createdAt).toLocaleString("en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    }),
    createdAt: t.createdAt,
    user: {
      name: authorName,
      role,
      memberSince: new Date(t.createdAt).getFullYear().toString(),
      email: t.author?.email ?? "",
      phone: t.author?.phone ?? "",
    },
    trip: {
      tripId: t.rideId ?? "—",
      date: t.metadata?.rideTime
        ? new Date(t.metadata.rideTime).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
          })
        : new Date(t.createdAt).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
          }),
      route: t.metadata?.pickupAddress && t.metadata?.dropOffAddress
        ? `${t.metadata.pickupAddress} → ${t.metadata.dropOffAddress}`
        : "—",
      price: t.metadata?.price ?? "—",
      status: t.metadata?.rideStatus ?? "—",
      pickupAddress: t.metadata?.pickupAddress,
      dropOffAddress: t.metadata?.dropOffAddress,
      passengerName: t.metadata?.passengerName,
    },
    payment: { method: "—", transactionStatus: "—" },
    notes:   [],
    messages,
    activity,
  };
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const loadedMessages = useRef<Set<string>>(new Set());

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loadedMessages.current.clear();
      const res = await supportApi.listAll(1, 50) as any;
      const ticketsArr = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setTickets(ticketsArr.map(adaptTicket));
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Load full messages+activity when a ticket is selected
  const loadTicketMessages = useCallback(async (id: string) => {
    if (loadedMessages.current.has(id)) return;
    try {
      const full = await supportApi.getOne(id);
      loadedMessages.current.add(id);
      setTickets((prev) => prev.map((t) => (t.id === id ? adaptTicket(full) : t)));
    } catch {
      // silently ignore
    }
  }, []);

  // Change status
  const changeStatus = useCallback(
    async (id: string, status: TicketStatus) => {
      const timestamp = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                activity: [
                  ...t.activity,
                  {
                    id: `a-status-${Date.now()}`,
                    type: status === "Resolved" ? ("resolved" as const) : ("status_change" as const),
                    description: status === "Resolved"
                      ? "Ticket resolved"
                      : `Status changed to ${status}`,
                    timestamp,
                    actor: "Admin",
                  },
                ],
              }
            : t
        )
      );
      try {
        await supportApi.updateStatus(id, mapStatusToBackend(status));
        toast.success(`Ticket status changed to ${status}`);
        // Re-fetch to sync real resolvedAt etc
        const updated = await supportApi.getOne(id);
        loadedMessages.current.add(id);
        setTickets((prev) => prev.map((t) => (t.id === id ? adaptTicket(updated) : t)));
      } catch {
        toast.error("Failed to update ticket status");
        fetchTickets();
      }
    },
    [fetchTickets]
  );

  // Send message — optimistic + then refetch real data
  const sendMessage = useCallback(
    async (id: string, content: string) => {
      const tempId    = `temp-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

      // Optimistic add
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  { id: tempId, sender: "Admin", senderType: "admin" as const, content, timestamp },
                ],
                activity: [
                  ...t.activity,
                  {
                    id: `a-msg-${tempId}`,
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
        await supportApi.reply(id, content);
        toast.success("Message sent");
        // Re-fetch real ticket with real message IDs + updated status
        const updated = await supportApi.getOne(id);
        loadedMessages.current.add(id);
        setTickets((prev) => prev.map((t) => (t.id === id ? adaptTicket(updated) : t)));
      } catch {
        toast.error("Failed to send message");
        // Rollback optimistic message
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  messages: t.messages.filter((m) => m.id !== tempId),
                  activity: t.activity.filter((a) => a.id !== `a-msg-${tempId}`),
                }
              : t
          )
        );
      }
    },
    []
  );

  // Delete ticket (hard delete)
  const deleteTicket = useCallback(
    async (id: string) => {
      await supportApi.remove(id);
      toast.success("Ticket deleted", {
        style: { background: "#dc2626", color: "#fff", border: "none" },
      });
      setTickets((prev) => prev.filter((t) => t.id !== id));
    },
    []
  );

  // Edit a message
  const editMessage = useCallback(
    async (ticketId: string, messageId: string, content: string) => {
      try {
        const updated = await supportApi.editMessage(ticketId, messageId, content);
        toast.success("Message updated");
        // Refresh ticket to sync real data
        const full = await supportApi.getOne(ticketId);
        loadedMessages.current.add(ticketId);
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? adaptTicket(full) : t)));
        return updated;
      } catch {
        toast.error("Failed to update message");
        throw new Error("Failed to update message");
      }
    },
    []
  );

  // Delete a message
  const deleteMessage = useCallback(
    async (ticketId: string, messageId: string) => {
      try {
        await supportApi.deleteMessage(ticketId, messageId);
        toast.success("Message deleted");
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId
              ? { ...t, messages: t.messages.filter((m) => m.id !== messageId) }
              : t
          )
        );
      } catch {
        toast.error("Failed to delete message");
      }
    },
    []
  );

  // ── Offline catch-up: compare fetched tickets with last seen timestamp ────────
  const checkMissedNotifications = useCallback(() => {
    if (tickets.length === 0) return;

    const lastSeenRaw = localStorage.getItem("support:lastSeenAt");
    const newestTimestamp = tickets.reduce((max, t) => {
      const d = new Date(t.createdAt).getTime();
      return d > max ? d : max;
    }, 0);

    if (lastSeenRaw) {
      const lastSeen = new Date(lastSeenRaw).getTime();
      const missed = tickets.filter(
        (t) => new Date(t.createdAt).getTime() > lastSeen
      );
      if (missed.length > 0) {
        toast.info(
          `${missed.length} new ticket${missed.length > 1 ? "s" : ""} while you were away`
        );
      }
    }

    localStorage.setItem(
      "support:lastSeenAt",
      new Date(newestTimestamp).toISOString()
    );
  }, [tickets]);

  // Run offline check once after the initial fetch completes
  const didInitialSyncRef = useRef(false);
  useEffect(() => {
    if (loading || didInitialSyncRef.current) return;
    didInitialSyncRef.current = true;
    checkMissedNotifications();
  }, [loading, checkMissedNotifications]);

  return {
    tickets,
    loading,
    error,
    changeStatus,
    sendMessage,
    deleteTicket,
    editMessage,
    deleteMessage,
    loadTicketMessages,
    refetch: fetchTickets,
    checkMissedNotifications,
  };
}


