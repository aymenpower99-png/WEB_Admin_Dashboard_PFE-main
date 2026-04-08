import { useState } from "react";
import type { Ticket, TicketStatus, Message } from "./Components/types";
import { INITIAL_TICKETS } from "./Components/data";
import TicketList from "./Components/TicketList";
import TicketDetails from "./Components/TicketDetails";

interface HelpCenterProps {
  dark: boolean;
}

export default function HelpCenter({ dark }: HelpCenterProps) {
  const [tickets, setTickets] = useState<Ticket[]>(() =>
    INITIAL_TICKETS.map((t) => ({
      ...t,
      notes: [...t.notes],
      messages: [...t.messages],
      activity: [...t.activity],
    }))
  );
  const [selectedId, setSelectedId] = useState<string>(INITIAL_TICKETS[0].id);
  const selectedTicket = tickets.find((t) => t.id === selectedId) ?? tickets[0];

  function handleStatusChange(id: string, status: TicketStatus) {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status,
          activity: [
            ...t.activity,
            {
              id: `a${Date.now()}`,
              type: status === "Resolved" ? ("resolved" as const) : ("status_change" as const),
              description: `Status changed to ${status}`,
              timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
              actor: "Admin",
            },
          ],
        };
      })
    );
  }

  function handleSendMessage(id: string, content: string) {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: "Admin",
      senderType: "admin",
      content,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          messages: [...t.messages, newMessage],
          activity: [
            ...t.activity,
            {
              id: `a${Date.now()}`,
              type: "admin_reply" as const,
              description: "Admin sent a message",
              timestamp: newMessage.timestamp,
              actor: "Admin",
            },
          ],
        };
      })
    );
  }

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - var(--nav-h, 56px))" }}
    >
      {/* Left: Ticket List — fixed width */}
      <div className="w-[340px] flex-shrink-0 h-full">
        <TicketList
          tickets={tickets}
          selectedId={selectedId}
          onSelect={setSelectedId}
          dark={dark}
        />
      </div>

      {/* Right: Ticket Details — fills rest */}
      <div className="flex-1 min-w-0 h-full">
        <TicketDetails
          ticket={selectedTicket}
          onStatusChange={handleStatusChange}
          onSendMessage={handleSendMessage}
          dark={dark}
        />
      </div>
    </div>
  );
}