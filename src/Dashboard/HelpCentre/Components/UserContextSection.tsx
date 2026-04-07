import type { Ticket } from "./types";

interface UserContextSectionProps {
  ticket: Ticket;
  dark: boolean;
}

function Row({
  label,
  value,
  dark,
  accent,
}: {
  label: string;
  value: string;
  dark: boolean;
  accent?: boolean;
}) {
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const val = accent
    ? "text-violet-500 font-semibold"
    : dark
    ? "text-gray-200 font-medium"
    : "text-gray-800 font-medium";
  return (
    <div
      className={`flex items-center justify-between py-3 border-b text-sm last:border-b-0 ${
        dark ? "border-gray-800" : "border-gray-100"
      }`}
    >
      <span className={muted}>{label}</span>
      <span className={val}>{value}</span>
    </div>
  );
}

function SectionBlock({
  title,
  children,
  dark,
}: {
  title: string;
  children: React.ReactNode;
  dark: boolean;
}) {
  const border = dark ? "border-gray-800" : "border-gray-200";
  const bg = dark ? "bg-gray-800/40" : "bg-gray-50";
  const titleCls = dark ? "text-gray-400" : "text-gray-500";
  return (
    <div className={`rounded-xl border overflow-hidden ${border}`}>
      <div className={`px-4 py-2.5 border-b ${border} ${bg}`}>
        <p className={`text-xs font-bold uppercase tracking-widest ${titleCls}`}>
          {title}
        </p>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

export default function UserContextSection({ ticket, dark }: UserContextSectionProps) {
  const muted = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className="flex flex-col gap-4">

      {/* User Information */}
      <SectionBlock title="User Information" dark={dark}>
        <Row label="Name"  value={ticket.user.name}  dark={dark} />
        <Row label="Role"  value={ticket.user.role}  dark={dark} />
        <Row label="Email" value={ticket.user.email} dark={dark} accent />
        <Row label="Phone" value={ticket.user.phone} dark={dark} />
      </SectionBlock>

      {/* Trip Details */}
      <SectionBlock title="Trip Details" dark={dark}>
        <Row label="Trip ID" value={ticket.trip.tripId} dark={dark} />
        <Row label="Date"    value={ticket.trip.date}   dark={dark} />
        <Row label="Route"   value={ticket.trip.route}  dark={dark} />
        <Row label="Price"   value={ticket.trip.price}  dark={dark} />
        <div
          className={`flex items-center justify-between py-3 text-sm last:border-b-0 ${
            dark ? "border-gray-800" : "border-gray-100"
          }`}
        >
          <span className={muted}>Status</span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              ticket.trip.status.toLowerCase().includes("fail") ||
              ticket.trip.status.toLowerCase().includes("lock")
                ? dark
                  ? "bg-red-900/30 text-red-400"
                  : "bg-red-100 text-red-700"
                : ticket.trip.status.toLowerCase().includes("complet")
                ? dark
                  ? "bg-emerald-900/30 text-emerald-400"
                  : "bg-emerald-100 text-emerald-700"
                : dark
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {ticket.trip.status}
          </span>
        </div>
      </SectionBlock>

      {/* Payment */}

    </div>
  );
}