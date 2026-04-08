import { useState } from "react";
import type { Ticket, TicketStatus, UserRole } from "./types";
import TicketCard from "./TicketCard";

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string;
  onSelect: (id: string) => void;
  dark: boolean;
}

const STATUS_OPTIONS: (TicketStatus | "All")[] = ["All", "Open", "In Progress", "Pending", "Resolved"];

export default function TicketList({ tickets, selectedId, onSelect, dark }: TicketListProps) {
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");

  const panel    = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const muted    = dark ? "text-gray-400"                 : "text-gray-500";
  const inputCls = dark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-violet-500"
    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400 focus:bg-white";
  const selectCls = dark
    ? "bg-gray-800 border-gray-700 text-gray-300"
    : "bg-white border-gray-200 text-gray-600";

  const openCount = tickets.filter((t) => t.status === "Open").length;

  const filtered = tickets.filter((tk) => {
    const roleOk   = roleFilter === "All" || tk.role === roleFilter;
    const statusOk = statusFilter === "All" || tk.status === statusFilter;
    const q        = search.toLowerCase();
    const searchOk =
      !q ||
      tk.title.toLowerCase().includes(q) ||
      tk.user.name.toLowerCase().includes(q) ||
      tk.user.email.toLowerCase().includes(q) ||
      tk.id.toLowerCase().includes(q);
    return roleOk && statusOk && searchOk;
  });

  const ROLE_BTNS: (UserRole | "All")[] = ["All", "Passenger", "Driver"];

  return (
    <div className={`flex flex-col h-full border-r overflow-hidden ${panel}`}>

      {/* ── Header ── */}
      <div className={`px-4 pt-4 pb-3 border-b flex-shrink-0 ${dark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-base font-bold ${dark ? "text-gray-100" : "text-gray-900"}`}>
            Tickets
          </h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
            {openCount} open
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, email or ticket ID"
            className={`w-full border rounded-lg pl-8 pr-3 py-2 text-xs outline-none transition-all ${inputCls}`}
          />
          <svg
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${muted}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Role pills */}
        <div className="flex gap-1.5 mb-3">
          {ROLE_BTNS.map((r) => {
            const isActive = roleFilter === r;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-150 ${
                  isActive
                    ? "text-white shadow-sm"
                    : dark
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={isActive ? { background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" } : {}}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Status dropdown only — category removed */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "All")}
            className={`w-full border rounded-lg pl-3 pr-8 py-2 text-xs outline-none appearance-none cursor-pointer transition-colors font-medium ${selectCls}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "Status: All" : s}
              </option>
            ))}
          </select>
          <svg
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${muted}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Ticket list ── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-10">
            <svg className={`w-8 h-8 ${muted}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className={`text-xs ${muted}`}>No tickets match your filters.</p>
          </div>
        ) : (
          filtered.map((tk) => (
            <TicketCard
              key={tk.id}
              ticket={tk}
              isSelected={selectedId === tk.id}
              onSelect={onSelect}
              dark={dark}
            />
          ))
        )}
      </div>
    </div>
  );
}