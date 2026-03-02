import { useState } from "react";

type TicketStatus = "Open" | "Waiting for user" | "Resolved";

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: string;
  user: string;
  agency: string;
  time: string;
  channel: string;
  userInfo: {
    name: string;
    role: string;
    since: string;
    email: string;
    phone: string;
    agencyEmail: string;
  };
  tripInfo: {
    agency: string;
    tripId: string;
    payment: string;
    date: string;
    route: string;
    price: string;
    currentStatus: string;
  };
}

interface HelpCenterProps {
  dark: boolean;
}

const TICKETS: Ticket[] = [
  {
    id: "3241",
    subject: "Payment failed for airport transfer",
    status: "Open",
    priority: "High",
    user: "Sarah Lee",
    agency: "SkyRide",
    time: "5 min ago",
    channel: "In-app chat",
    userInfo: { name: "Sarah Lee", role: "User", since: "2023", email: "sarah.lee@example.com", phone: "+33 6 12 34 56 78", agencyEmail: "support@skyride.com" },
    tripInfo: { agency: "SkyRide", tripId: "TR-98214", payment: "Visa", date: "12 Mar 2025 · 08:30", route: "City center → Airport", price: "€48.00", currentStatus: "Payment failed" },
  },
  {
    id: "3238",
    subject: "Driver did not arrive on time",
    status: "Waiting for user",
    priority: "Medium",
    user: "Ahmed Y.",
    agency: "CityMove",
    time: "18 min ago",
    channel: "In-app chat",
    userInfo: { name: "Ahmed Y.", role: "User", since: "2022", email: "ahmed.y@example.com", phone: "+33 7 98 76 54 32", agencyEmail: "support@citymove.com" },
    tripInfo: { agency: "CityMove", tripId: "TR-97890", payment: "Mastercard", date: "11 Mar 2025 · 06:00", route: "Hotel Lumière → CDG", price: "€62.00", currentStatus: "Completed (delayed)" },
  },
  {
    id: "3231",
    subject: "Need invoice for business trip",
    status: "Resolved",
    priority: "Low",
    user: "Maria G.",
    agency: "EuroCab",
    time: "1 h ago",
    channel: "Email",
    userInfo: { name: "Maria G.", role: "Agency admin", since: "2021", email: "maria.g@eurocab.com", phone: "+39 3 11 22 33 44", agencyEmail: "billing@eurocab.com" },
    tripInfo: { agency: "EuroCab", tripId: "TR-97650", payment: "Wire transfer", date: "08 Mar 2025 · 14:00", route: "Rome Termini → FCO", price: "€95.00", currentStatus: "Completed" },
  },
  {
    id: "3229",
    subject: "Can't login to admin account",
    status: "Open",
    priority: "High",
    user: "Olivia",
    agency: "Premium Rides",
    time: "2 h ago",
    channel: "In-app chat",
    userInfo: { name: "Olivia", role: "Agency admin", since: "2022", email: "olivia@premiumrides.com", phone: "+44 7 700 900 461", agencyEmail: "it@premiumrides.com" },
    tripInfo: { agency: "Premium Rides", tripId: "—", payment: "—", date: "—", route: "—", price: "—", currentStatus: "Account locked" },
  },
];

const FILTERS = ["Open", "Waiting for user", "Resolved", "All"] as const;

const GRADIENT = "linear-gradient(135deg,#8b5cf6,#6d28d9)";

const STATUS_PILL_LIGHT: Record<TicketStatus, string> = {
  "Open":             "bg-amber-100 text-amber-700",
  "Waiting for user": "bg-gray-100 text-gray-500",
  "Resolved":         "bg-emerald-100 text-emerald-700",
};

const STATUS_PILL_DARK: Record<TicketStatus, string> = {
  "Open":             "bg-amber-900/40 text-amber-400",
  "Waiting for user": "bg-gray-800 text-gray-400",
  "Resolved":         "bg-emerald-900/40 text-emerald-400",
};

function InitialAvatar({ name, md }: { name: string; md?: boolean }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const sz       = md ? "w-8 h-8 text-sm" : "w-6 h-6 text-xs";
  const palettes = [
    "from-violet-500 to-purple-700",
    "from-blue-500 to-indigo-600",
    "from-teal-500 to-emerald-600",
    "from-orange-500 to-amber-500",
  ];
  const palette = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${palette} flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export default function HelpCenter({ dark }: HelpCenterProps) {
  const [activeFilter, setActiveFilter] = useState("Open");
  const [selected, setSelected]         = useState<Ticket>(TICKETS[0]);
  const [search, setSearch]             = useState("");
  const [statuses, setStatuses]         = useState<Record<string, TicketStatus>>({});
  const [notes, setNotes]               = useState<Record<string, string>>({});

  const page            = dark ? "bg-gray-950 text-gray-100"   : "bg-stone-100 text-gray-900";
  const card            = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const inner           = dark ? "bg-gray-800 border-gray-700"  : "bg-stone-50 border-stone-200";
  const muted           = dark ? "text-gray-400"                : "text-gray-500";
  const divider         = dark ? "border-gray-800"              : "border-gray-100";
  const inputCls        = dark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-violet-500"
    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400";
  const ghostBtn        = dark
    ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50";
  const chip            = dark ? "bg-gray-800 text-gray-300"    : "bg-gray-100 text-gray-500";
  const filterInactive  = dark
    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
    : "bg-gray-100 text-gray-500 hover:bg-gray-200";
  const ticketHover     = dark ? "hover:bg-gray-800"            : "hover:bg-stone-50";
  const ticketActive    = dark ? "bg-violet-900/30 border-violet-600" : "bg-violet-50 border-violet-400";
  const ticketBase      = dark ? "bg-gray-800 border-gray-700"  : "bg-stone-50 border-stone-200";
  const statusPill      = dark ? STATUS_PILL_DARK : STATUS_PILL_LIGHT;

  const openCount     = TICKETS.filter(tk => (statuses[tk.id] ?? tk.status) === "Open").length;
  const currentStatus = statuses[selected.id] ?? selected.status;

  const filtered = TICKETS.filter(tk => {
    const status   = statuses[tk.id] ?? tk.status;
    const statusOk = activeFilter === "All" || status === activeFilter;
    const searchOk = !search || [tk.subject, tk.user, tk.id, tk.agency]
      .some(v => v.toLowerCase().includes(search.toLowerCase()));
    return statusOk && searchOk;
  });

  return (
    <div className={`min-h-screen p-5 transition-colors duration-300 ${page}`}>
      <div className="grid gap-4" style={{ gridTemplateColumns: "280px 1fr" }}>

        <div className={`rounded-2xl border p-4 flex flex-col gap-3 ${card}`}>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold leading-tight">Tickets</p>
              <p className={`text-xs ${muted}`}>All problems reported by users and agencies.</p>
            </div>
            <span className={`text-xs w-16 font-medium px-2 py-2 rounded-full ${chip}`}>
              {openCount} open
            </span>
          </div>

          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by user, email or ticket ID"
              className={`w-full border rounded-lg pl-8 pr-3 py-2 text-xs outline-none transition-colors ${inputCls}`}
            />
            <svg
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${muted}`}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  activeFilter === f ? "text-white" : filterInactive
                }`}
                style={activeFilter === f ? { background: GRADIENT } : {}}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "560px" }}>
            {filtered.length === 0 && (
              <p className={`text-xs text-center py-6 ${muted}`}>No tickets found.</p>
            )}
            {filtered.map(tk => {
              const tStatus = statuses[tk.id] ?? tk.status;
              return (
                <button
                  key={tk.id}
                  onClick={() => setSelected(tk)}
                  className={`w-full text-left rounded-xl border p-3 transition-colors ${
                    selected.id === tk.id ? ticketActive : `${ticketBase} ${ticketHover}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-semibold line-clamp-2 leading-snug flex-1">{tk.subject}</p>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusPill[tStatus]}`}>
                      {tStatus}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${muted}`}>User: {tk.user} · Agency: {tk.agency}</p>
                  <p className={`text-xs mt-0.5 ${muted}`}>{tk.time}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 flex flex-col gap-5 overflow-y-auto ${card}`} style={{ maxHeight: "720px" }}>

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold mb-0.5">User &amp; trip summary</p>
              <p className={`text-xs ${muted}`}>#{selected.id} · {selected.subject}</p>
            </div>
            {currentStatus !== "Resolved" ? (
              <button
                onClick={() => setStatuses(prev => ({ ...prev, [selected.id]: "Resolved" }))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity shrink-0"
                style={{ background: GRADIENT }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Mark as resolved
              </button>
            ) : (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusPill["Resolved"]}`}>
                Resolved ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <InitialAvatar name={selected.userInfo.name} md />
              <div>
                <p className="text-sm font-semibold">{selected.userInfo.name}</p>
                <p className={`text-xs ${muted}`}>{selected.userInfo.role} · Member since {selected.userInfo.since}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                `Agency: ${selected.tripInfo.agency}`,
                `Trip ID: ${selected.tripInfo.tripId}`,
                `Payment: ${selected.tripInfo.payment}`,
              ].map(c => (
                <span key={c} className={`text-xs px-2.5 py-1 rounded-full ${chip}`}>{c}</span>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-4 flex flex-col gap-2.5 ${inner}`}>
            <p className={`text-xs font-semibold mb-1 uppercase tracking-wide ${muted}`}>Trip details</p>
            {[
              { label: "Trip date",      value: selected.tripInfo.date          },
              { label: "Route",          value: selected.tripInfo.route         },
              { label: "Total price",    value: selected.tripInfo.price         },
              { label: "Current status", value: selected.tripInfo.currentStatus },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center text-xs gap-2">
                <span className={muted}>{row.label}</span>
                <span className="font-semibold text-right">{row.value}</span>
              </div>
            ))}
          </div>

          <div className={`border-t ${divider}`} />

          <div>
            <p className="text-sm font-semibold mb-0.5">Contact options</p>
            <p className={`text-xs mb-3 ${muted}`}>Reach the user or related admin if needed.</p>
            <div className={`rounded-xl border p-4 flex flex-col gap-2.5 mb-3 ${inner}`}>
              {[
                { label: "User email",   value: selected.userInfo.email       },
                { label: "User phone",   value: selected.userInfo.phone       },
                { label: "Agency admin", value: selected.userInfo.agencyEmail },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-start text-xs gap-2">
                  <span className={`shrink-0 ${muted}`}>{row.label}</span>
                  <span className="font-semibold text-right break-all">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Call user", "Email user", "Contact agency admin"].map(action => (
                <button key={action} className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${ghostBtn}`}>
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className={`border-t ${divider}`} />

          <div>
            <p className="text-sm font-semibold mb-0.5">Internal note</p>
            <p className={`text-xs mb-3 ${muted}`}>Visible to admins only.</p>
            <textarea
              rows={3}
              placeholder="Add an internal note for your admin team."
              value={notes[selected.id] ?? ""}
              onChange={e => setNotes(prev => ({ ...prev, [selected.id]: e.target.value }))}
              className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none resize-none transition-colors ${inputCls}`}
            />
            <button
              onClick={() => alert(`Note saved for ticket #${selected.id}`)}
              disabled={!(notes[selected.id] ?? "").trim()}
              className="mt-2 w-full py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              style={{ background: GRADIENT }}
            >
              Save note
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}