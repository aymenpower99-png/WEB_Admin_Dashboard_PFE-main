import type { Ticket } from "./types";
import StatusBadge from "./StatusBadge";

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (id: string) => void;
  dark: boolean;
}

/** TKT-XXXXXXXX format (first 8 chars uppercased) */
function formatTicketId(id: string) {
  return `TKT-${id.slice(0, 8).toUpperCase()}`;
}

export default function TicketCard({ ticket, isSelected, onSelect, dark }: TicketCardProps) {
  const base = dark
    ? "border-b border-gray-800 hover:bg-gray-800/50"
    : "border-b border-gray-100 hover:bg-gray-50";
  const selected = dark
    ? "border-b border-gray-800 bg-violet-900/20 border-l-2 border-l-violet-500"
    : "border-b border-gray-100 bg-violet-50 border-l-2 border-l-violet-500";
  const muted = dark ? "text-gray-400" : "text-gray-500";

  return (
    <button
      onClick={() => onSelect(ticket.id)}
      className={`w-full text-left px-4 py-3.5 transition-all duration-150 ${isSelected ? selected : base}`}
    >
      {/* Row 1: title + status badge */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className={`text-sm font-semibold line-clamp-1 flex-1 leading-snug ${dark ? "text-gray-100" : "text-gray-900"}`}>
          {ticket.title}
        </p>
        <StatusBadge type="status" value={ticket.status} dark={dark} />
      </div>

      {/* Row 2: Ticket ID on its own line */}
      <p className={`text-xs font-mono mb-0.5 ${muted}`}>
        {formatTicketId(ticket.id)}
      </p>

      {/* Row 3: user name on its own line */}
      <p className={`text-xs mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}>
        {ticket.user.name}
      </p>

      {/* Row 4: role + category badges + time */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <StatusBadge type="role"     value={ticket.role}     dark={dark} />
        <StatusBadge type="category" value={ticket.category} dark={dark} />
        <span className={`text-xs ml-auto ${muted}`}>{ticket.time}</span>
      </div>
    </button>
  );
}