import type { Ticket } from "./types";
import StatusBadge from "./StatusBadge";

interface UserContextSectionProps {
  ticket: Ticket;
  dark: boolean;
}

/** Generate readable ticket ID: TKT-XXXXXXXX (first 8 chars of UUID uppercased) */
function formatTicketId(id: string) {
  return `TKT-${id.slice(0, 8).toUpperCase()}`;
}

// ─── Avatar with initials ─────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const palettes = [
    "from-violet-500 to-purple-700",
    "from-purple-400 to-violet-600",
    "from-indigo-500 to-purple-600",
    "from-violet-600 to-purple-800",
  ];
  const palette = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${palette} flex items-center justify-center text-white text-base font-bold shrink-0 shadow-md`}
    >
      {initials}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  dark,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dark: boolean;
  accent?: boolean;
}) {
  const muted = dark ? "text-gray-500" : "text-gray-400";
  const valCls = accent
    ? "text-violet-500 font-semibold"
    : dark
      ? "text-gray-200 font-medium"
      : "text-gray-800 font-medium";

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

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({
  title,
  children,
  dark,
}: {
  title: string;
  children: React.ReactNode;
  dark: boolean;
}) {
  const border = dark ? "border-gray-800" : "border-gray-200";
  const bg = dark ? "bg-gray-800/30" : "bg-gray-50/60";
  const headBg = dark ? "bg-gray-800/60" : "bg-gray-100/80";
  const titleCls = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`rounded-xl border overflow-hidden ${border}`}>
      <div className={`px-4 py-2.5 ${headBg} border-b ${border}`}>
        <p
          className={`text-xs font-bold uppercase tracking-widest ${titleCls}`}
        >
          {title}
        </p>
      </div>
      <div className={`px-4 py-4 flex flex-col gap-3.5 ${bg}`}>{children}</div>
    </div>
  );
}

export default function UserContextSection({
  ticket,
  dark,
}: UserContextSectionProps) {
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const textCls = dark ? "text-gray-200" : "text-gray-900";

  return (
    <div className="flex flex-col gap-5">
      {/* ── USER INFORMATION ── */}
      <Card title="User Information" dark={dark}>
        {/* Avatar + name only */}
        <div
          className={`flex items-center gap-4 pb-3 border-b ${dark ? "border-gray-700/60" : "border-gray-200"}`}
        >
          <Avatar name={ticket.user.name} />
          <p className={`text-sm font-bold ${textCls}`}>{ticket.user.name}</p>
        </div>

        {/* Email */}
        <InfoRow
          dark={dark}
          accent
          label="Email"
          value={ticket.user.email}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />

        {/* Phone */}
        <InfoRow
          dark={dark}
          label="Phone"
          value={ticket.user.phone}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.64 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
      </Card>

      {/* ── TICKET DETAILS ── */}
      <Card title="Ticket Details" dark={dark}>
        {/* Ticket ID */}
        <div className="flex items-center justify-between">
          <span className={`text-xs ${muted}`}>Ticket ID</span>
          <span
            className={`text-xs font-mono font-bold px-2 py-1 rounded-md ${
              dark
                ? "bg-gray-800 text-violet-400"
                : "bg-violet-50 text-violet-600"
            }`}
          >
            {formatTicketId(ticket.id)}
          </span>
        </div>

        {/* Subject */}
        <div>
          <p className={`text-xs mb-1 ${muted}`}>Subject</p>
          <p className={`text-sm font-semibold ${textCls}`}>{ticket.title}</p>
        </div>

        {/* Category + Status */}
        <div className="flex items-center gap-4">
          <div>
            <p className={`text-xs mb-1 ${muted}`}>Category</p>
            <StatusBadge type="category" value={ticket.category} dark={dark} />
          </div>
          <div>
            <p className={`text-xs mb-1 ${muted}`}>Status</p>
            <StatusBadge type="status" value={ticket.status} dark={dark} />
          </div>
        </div>

        {/* Description */}
        <div>
          <p className={`text-xs mb-1.5 ${muted}`}>Description</p>
          <div
            className={`rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
              dark
                ? "bg-gray-800 text-gray-300"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            {ticket.description || (
              <span className={`italic ${muted}`}>
                No description provided.
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
