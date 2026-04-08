import { useState } from "react";
import type { Ticket, TicketStatus } from "./types";
import StatusBadge from "./StatusBadge";
import UserContextSection from "./UserContextSection";
import ConversationTab from "./ConversationTab";
import ActivityTab from "./ActivityTab";

interface TicketDetailsProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onSendMessage: (id: string, content: string) => void;
  onLinkTrip: (id: string) => void;
  dark: boolean;
}

type Page = 1 | 2 | 3;

const GRADIENT = "linear-gradient(135deg,#8b5cf6,#6d28d9)";

export default function TicketDetails({ ticket, onStatusChange, onSendMessage, onLinkTrip, dark }: TicketDetailsProps) {
  const [page, setPage] = useState<Page>(1);

  const card = dark ? "bg-gray-900" : "bg-white";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const divider = dark ? "border-gray-800" : "border-gray-200";

  const PAGE_TABS: { id: Page; label: string; icon: React.ReactNode }[] = [
    {
      id: 1,
      label: "Details",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Conversation",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      label: "Activity",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`flex flex-col h-full overflow-hidden ${card}`}>

      {/* ── HEADER — no avatar, no member since, no status dropdown, no escalate ── */}
      <div className={`flex-shrink-0 px-6 py-4 border-b ${divider}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">

          {/* Left: title + meta badges */}
          <div className="min-w-0 flex-1">
            <h1 className={`text-lg font-bold leading-tight mb-2 ${dark ? "text-gray-100" : "text-gray-900"}`}>
              {ticket.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs ${muted}`}>#{ticket.id}</span>
              <span className={`text-xs ${muted}`}>·</span>
              <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
                {ticket.user.name}
              </span>
              <span className={`text-xs ${muted}`}>·</span>
              <StatusBadge type="ticket-type" value={ticket.ticketType} dark={dark} />
              <StatusBadge type="role" value={ticket.role} dark={dark} />
              <StatusBadge type="category" value={ticket.category} dark={dark} />
              <StatusBadge type="status" value={ticket.status} dark={dark} />
            </div>
          </div>

          {/* Right: Resolve + Link to Trip */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {ticket.ticketType === "general" && ticket.status !== "Resolved" && (
              <button
                onClick={() => onLinkTrip(ticket.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${
                  dark
                    ? "border-violet-500 text-violet-300 hover:bg-violet-900/30"
                    : "border-violet-400 text-violet-700 hover:bg-violet-50"
                }`}
              >
                🔗 Link to Trip
              </button>
            )}
            {ticket.status !== "Resolved" ? (
              <button
                onClick={() => onStatusChange(ticket.id, "Resolved")}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                style={{ background: "#10b981" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
                </svg>
                Resolve
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-100 text-emerald-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
                </svg>
                Resolved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── PAGE TABS ── */}
      <div className={`flex-shrink-0 flex border-b ${divider}`}>
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              page === tab.id
                ? "border-violet-500 text-violet-600"
                : `border-transparent ${dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 2 && ticket.messages.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                dark ? "bg-violet-900/40 text-violet-300" : "bg-violet-100 text-violet-600"
              }`}>
                {ticket.messages.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── PAGE 1: Details ── */}
      {page === 1 && (
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          <UserContextSection ticket={ticket} dark={dark} />
        </div>
      )}

      {/* ── PAGE 2: Conversation ── */}
      {page === 2 && (
        <div className="flex-1 flex flex-col min-h-0">
          <ConversationTab
            messages={ticket.messages}
            onSend={(content) => onSendMessage(ticket.id, content)}
            dark={dark}
          />
        </div>
      )}

      {/* ── PAGE 3: Activity ── */}
      {page === 3 && (
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          <ActivityTab events={ticket.activity} dark={dark} />
        </div>
      )}
    </div>
  );
}