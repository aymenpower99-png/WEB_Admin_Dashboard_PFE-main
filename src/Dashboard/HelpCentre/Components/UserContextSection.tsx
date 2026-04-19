import type { Ticket } from "./types";
import StatusBadge from "./StatusBadge";

interface UserContextSectionProps {
  ticket: Ticket;
  dark: boolean;
}

function formatTicketId(id: string) {
  return `TKT-${id.slice(0, 8).toUpperCase()}`;
}

function formatTripId(id: string) {
  if (!id || id === "—") return "—";
  return `TRP-${id.slice(0, 8).toUpperCase()}`;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const palettes = [
    "from-violet-500 to-purple-700",
    "from-purple-400 to-violet-600",
    "from-indigo-500 to-purple-600",
    "from-violet-600 to-purple-800",
  ];
  const palette = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${palette} flex items-center justify-center text-white text-base font-bold shrink-0 shadow-md`}>
      {initials}
    </div>
  );
}

function InfoRow({ icon, label, value, dark, accent }: {
  icon: React.ReactNode; label: string; value: string; dark: boolean; accent?: boolean;
}) {
  const muted  = dark ? "text-gray-500" : "text-gray-400";
  const valCls = accent
    ? "text-violet-500 font-semibold"
    : dark ? "text-gray-200 font-medium" : "text-gray-800 font-medium";

  return (
    <div className="flex items-center gap-3">
      <span className={`shrink-0 ${muted}`}>{icon}</span>
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        <span className={`text-xs shrink-0 ${muted}`}>{label}</span>
        <span className={`text-sm text-right truncate max-w-[240px] ${valCls}`}>
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

function Card({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) {
  const border   = dark ? "border-gray-800" : "border-gray-200";
  const bg       = dark ? "bg-gray-800/30" : "bg-gray-50/60";
  const headBg   = dark ? "bg-gray-800/60" : "bg-gray-100/80";
  const titleCls = dark ? "text-gray-400" : "text-gray-500";
  return (
    <div className={`rounded-xl border overflow-hidden ${border}`}>
      <div className={`px-4 py-2.5 ${headBg} border-b ${border}`}>
        <p className={`text-xs font-bold uppercase tracking-widest ${titleCls}`}>{title}</p>
      </div>
      <div className={`px-4 py-4 flex flex-col gap-3.5 ${bg}`}>{children}</div>
    </div>
  );
}

export default function UserContextSection({ ticket, dark }: UserContextSectionProps) {
  const muted   = dark ? "text-gray-400" : "text-gray-500";
  const textCls = dark ? "text-gray-200" : "text-gray-900";
  const divider = dark ? "border-gray-700/60" : "border-gray-200";

  return (
    <div className="flex flex-col gap-5">

      {/* ── USER INFORMATION ── */}
      <Card title="User Information" dark={dark}>
        {/* Avatar + name only — NO role badge here */}
        <div className={`flex items-center gap-4 pb-3 border-b ${divider}`}>
          <Avatar name={ticket.user.name} />
          <p className={`text-sm font-bold ${textCls}`}>{ticket.user.name}</p>
        </div>

        {/* Email */}
        <InfoRow dark={dark} accent label="Email" value={ticket.user.email}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />

        {/* Phone */}
        <InfoRow dark={dark} label="Phone" value={ticket.user.phone}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.64 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />

        {/* Role — text only, no badge */}
        <InfoRow dark={dark} label="Role" value={ticket.user.role}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
      </Card>

      {/* ── TICKET DETAILS ── */}
      <Card title="Ticket Details" dark={dark}>

        {/* Ticket ID */}
        <div className="flex items-center justify-between">
          <span className={`text-xs ${muted}`}>Ticket ID</span>
          <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md ${
            dark ? "bg-gray-800 text-violet-400" : "bg-violet-50 text-violet-600"
          }`}>
            {formatTicketId(ticket.id)}
          </span>
        </div>

        {/* Subject */}
        <div>
          <p className={`text-xs mb-1 ${muted}`}>Subject</p>
          <p className={`text-sm font-semibold ${textCls}`}>{ticket.title}</p>
        </div>

        {/* Category + Status — redesigned as card rows */}
        <div className={`rounded-xl border ${dark ? "border-gray-700 bg-gray-800/40" : "border-gray-200 bg-white"} px-4 py-3 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${muted}`}>Category</span>
            <StatusBadge type="category" value={ticket.category} dark={dark} />
          </div>
          <div className={`border-t ${dark ? "border-gray-700" : "border-gray-100"}`} />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${muted}`}>Status</span>
            <StatusBadge type="status" value={ticket.status} dark={dark} />
          </div>
        </div>

        {/* Description */}
        <div>
          <p className={`text-xs mb-1.5 ${muted}`}>Description</p>
          <div className={`rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
            dark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700 border border-gray-200"
          }`}>
            {ticket.description || <span className={`italic ${muted}`}>No description provided.</span>}
          </div>
        </div>
      </Card>

      {/* ── TRIP DETAILS ── */}
      {ticket.trip.tripId !== "—" && (
        <Card title="Trip Details" dark={dark}>
          <InfoRow dark={dark} label="Trip ID" value={formatTripId(ticket.trip.tripId)} accent
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
              </svg>
            }
          />
          {ticket.trip.pickupAddress && (
            <InfoRow dark={dark} label="Pickup" value={ticket.trip.pickupAddress}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
            />
          )}
          {ticket.trip.dropOffAddress && (
            <InfoRow dark={dark} label="Drop-off" value={ticket.trip.dropOffAddress}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              }
            />
          )}
          {ticket.trip.passengerName && (
            <InfoRow dark={dark} label="Passenger" value={ticket.trip.passengerName}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
          )}
          <InfoRow dark={dark} label="Date" value={ticket.trip.date}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            }
          />
        </Card>
      )}
    </div>
  );
}