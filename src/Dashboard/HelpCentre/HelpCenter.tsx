import { useState, useEffect } from "react";
import type { TicketStatus } from "./Components/types";
import { useTickets } from "./Components/useTickets";
import TicketList from "./Components/TicketList";
import TicketDetails from "./Components/TicketDetails";

interface HelpCenterProps {
  dark: boolean;
}

export default function HelpCenter({ dark }: HelpCenterProps) {
  const { tickets, loading, error, changeStatus, sendMessage, deleteTicket, loadTicketMessages } = useTickets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Auto-select first ticket once loaded
  useEffect(() => {
    if (!selectedId && tickets.length > 0) {
      setSelectedId(tickets[0].id);
    }
  }, [tickets, selectedId]);

  // When selected ticket changes → load its full messages from backend
  useEffect(() => {
    if (selectedId) {
      loadTicketMessages(selectedId);
    }
  }, [selectedId, loadTicketMessages]);

  const selectedTicket = tickets.find((t) => t.id === selectedId) ?? tickets[0];

  function handleSelect(id: string) {
    setSelectedId(id);
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${dark ? "text-gray-300" : "text-gray-600"}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading tickets…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${dark ? "text-red-400" : "text-red-600"}`}>
        <div className="text-center">
          <p className="text-sm font-semibold mb-1">Failed to load tickets</p>
          <p className="text-xs opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedTicket) {
    return (
      <div className={`flex items-center justify-center h-full ${dark ? "text-gray-400" : "text-gray-500"}`}>
        <p className="text-sm">No tickets found.</p>
      </div>
    );
  }

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100vh - var(--nav-h, 56px))" }}
    >
      <div className="w-[340px] flex-shrink-0 h-full">
        <TicketList
          tickets={tickets}
          selectedId={selectedTicket.id}
          onSelect={handleSelect}
          dark={dark}
        />
      </div>
      <div className="flex-1 min-w-0 h-full">
        <TicketDetails
          ticket={selectedTicket}
          onStatusChange={(id, status: TicketStatus) => changeStatus(id, status)}
          onSendMessage={(id, content) => sendMessage(id, content)}
          onDelete={(id) => {
            deleteTicket(id);
            setSelectedId(null);
          }}
          dark={dark}
        />
      </div>
    </div>
  );
}