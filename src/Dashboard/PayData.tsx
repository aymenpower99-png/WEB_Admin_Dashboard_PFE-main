import { useState } from "react";
import DriverModal from "./DriverModalProps";

type Accent = "violet" | "emerald" | "amber" | "blue";
type PayoutType = "success" | "warning" | "purple" | "destructive";

interface Payment {
  date: string;
  ref: string;
  client: string;
  method: string;
  driver: string;
  vehicle: string;
  driverSeed: string;
  amount: string;
  payout: string;
  payoutType: PayoutType;
  from: string;
  to: string;
}

interface PaymentsPageProps {
  dark: boolean;
}

const PAYMENTS: Payment[] = [
  { date: "Mar 14, 2025", ref: "#8452A", client: "Emma Watson",    method: "Credit Card (Stripe)", driver: "Thomas Anderson", vehicle: "Mercedes E-Class", driverSeed: "Thomas",  amount: "€240.00", payout: "Cleared: €180.00",    payoutType: "success",     from: "Charles de Gaulle Airport", to: "Paris 8th Arrondissement" },
  { date: "Mar 16, 2025", ref: "#8429B", client: "John Smith",     method: "Corporate Billing",    driver: "Marcus Chen",     vehicle: "V-Class",          driverSeed: "Marcus",  amount: "€658.00", payout: "Pending: €520.00",    payoutType: "warning",     from: "Lyon Part-Dieu Station",    to: "Geneva Airport"           },
  { date: "Mar 18, 2025", ref: "#8397C", client: "Emily Chen",     method: "Credit Card (Stripe)", driver: "Lucia Gomez",     vehicle: "Range Rover",      driverSeed: "Lucia",   amount: "€310.00", payout: "Processing: €230.00", payoutType: "purple",      from: "Nice Côte d'Azur Airport",  to: "Monaco Monte Carlo"       },
  { date: "Mar 20, 2025", ref: "#8320D", client: "Michael Scott",  method: "PayPal",               driver: "James Mbeki",     vehicle: "Audi A6",          driverSeed: "James",   amount: "€150.00", payout: "Cancelled",           payoutType: "destructive", from: "Orly Airport",              to: "Versailles Palace"        },
  { date: "Mar 22, 2025", ref: "#8291E", client: "Sophie Laurent", method: "Credit Card (Stripe)", driver: "Thomas Anderson", vehicle: "Mercedes E-Class", driverSeed: "Thomas2", amount: "€185.00", payout: "Cleared: €140.00",    payoutType: "success",     from: "Bordeaux Saint-Jean",       to: "Biarritz Airport"         },
];

export default function AgencyPaymentsData({ dark }: PaymentsPageProps) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);

  const card       = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const heading    = dark ? "text-gray-100"                : "text-gray-900";
  const muted      = dark ? "text-gray-400"                : "text-gray-500";
  const thead      = dark ? "bg-gray-800 border-gray-700"  : "bg-gray-50 border-gray-200";
  const rowHover   = dark ? "hover:bg-gray-800"            : "hover:bg-violet-50";
  const rowBorder  = dark ? "border-gray-800"              : "border-gray-100";
  const tdMuted    = dark ? "text-gray-500"                : "text-gray-400";
  const exportBtn  = dark ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
  const filterBar  = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const filterChip = dark ? "border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100";
  const datePicker = dark ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-gray-50 text-gray-700";

  const payoutTypeColors: Record<PayoutType, string> = {
    success:     dark ? "text-emerald-400" : "text-emerald-600",
    warning:     dark ? "text-amber-400"   : "text-amber-600",
    purple:      dark ? "text-violet-400"  : "text-violet-600",
    destructive: dark ? "text-gray-400"    : "text-gray-500",
  };

  const filtered = PAYMENTS.filter(
    (p) => statusFilter === "All" || p.payoutType === statusFilter
  );

  const accentColors: Record<Accent, string> = {
    violet:  dark ? "bg-violet-900/30 text-violet-400"   : "bg-violet-100 text-violet-600",
    emerald: dark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600",
    amber:   dark ? "bg-amber-900/30 text-amber-400"     : "bg-amber-100 text-amber-600",
    blue:    dark ? "bg-blue-900/30 text-blue-400"       : "bg-blue-100 text-blue-600",
  };

  const stats: { label: string; value: string; accent: Accent }[] = [
    { label: "Total Revenue",    value: "€42,850", accent: "violet"  },
    { label: "Paid & Cleared",   value: "€36,120", accent: "emerald" },
    { label: "Pending (Unpaid)", value: "€6,730",  accent: "amber"   },
    { label: "Driver Payouts",   value: "€28,500", accent: "blue"    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${heading}`}>Payments Overview</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>
            Track incoming revenues, pending balances, and driver payouts.
          </p>
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium border transition-colors ${exportBtn}`}>
          ↓ Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl border p-5 flex flex-col gap-2 shadow-sm transition-all duration-300 ${card}`}>
            <span className={`text-xs ${muted}`}>{s.label}</span>
            <span className={`text-2xl font-semibold tracking-tight ${heading}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-3xl border flex-wrap shadow-sm ${filterBar}`}>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs cursor-pointer ${datePicker}`}>
          <span>Mar 1 – Mar 31, 2025</span> <span className={muted}>▾</span>
        </div>
        {["All", "success", "warning", "destructive"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-medium transition-all duration-200 ${
              statusFilter === f ? "text-white border-transparent" : filterChip
            }`}
            style={statusFilter === f ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)" } : {}}
          >
            {f === "All" ? "All" : f === "success" ? "Cleared" : f === "warning" ? "Pending" : "Cancelled"}
          </button>
        ))}
        <span className={`ml-auto text-xs ${muted}`}>{filtered.length} records</span>
        <button
          className="px-3 py-1.5 rounded-2xl text-xs font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-3xl border shadow-sm transition-all duration-300 overflow-hidden ${card}`}>
        <div
          className={`grid text-[10px] font-semibold uppercase tracking-wider px-5 py-3 border-b ${thead}`}
          style={{ gridTemplateColumns: "1fr 1.4fr 1.6fr 1.8fr 0.8fr 1fr 0.9fr" }}
        >
          {["Date & Ref", "Client / Passenger", "Driver & Vehicle", "Route", "Amount", "Payout", "Action"].map((h, i) => (
            <span key={h} className={i === 6 ? "text-right" : ""}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={`px-5 py-10 text-center text-sm ${muted}`}>
            No payments match your filters.
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.ref}
              className={`grid px-5 py-4 text-xs items-center transition-colors ${rowHover} ${i > 0 ? `border-t ${rowBorder}` : ""}`}
              style={{ gridTemplateColumns: "1fr 1.4fr 1.6fr 1.8fr 0.8fr 1fr 0.9fr" }}
            >
              {/* Date & Ref */}
              <div>
                <p className={`font-medium ${heading}`}>{p.date}</p>
                <p className={`mt-0.5 ${tdMuted}`}>{p.ref}</p>
              </div>

              {/* Client */}
              <div>
                <p className={`font-medium ${heading}`}>{p.client}</p>
                <p className={`mt-0.5 ${tdMuted}`}>{p.method}</p>
              </div>

              {/* Driver & Vehicle */}
              <div className="flex items-center gap-2">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.driverSeed}`}
                  alt={p.driver}
                  className="w-7 h-7 rounded-full bg-violet-100 shrink-0"
                />
                <div>
                  <p className={`font-medium ${heading}`}>{p.driver}</p>
                  <p className={`mt-0.5 ${tdMuted}`}>{p.vehicle}</p>
                </div>
              </div>

              {/* Route */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <p className={`truncate ${heading} font-medium`}>{p.from}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                  <p className={`truncate ${tdMuted}`}>{p.to}</p>
                </div>
              </div>

              {/* Amount */}
              <p className={`font-semibold ${p.payoutType === "destructive" ? `line-through ${tdMuted}` : heading}`}>
                {p.amount}
              </p>

              {/* Payout */}
              <p className={`font-medium ${payoutTypeColors[p.payoutType]}`}>
                {p.payout}
              </p>

              {/* Action */}
              <div className="text-right">
                {p.payoutType !== "destructive" ? (
                  <button
                    onClick={() => setOpen(true)}
                    className="px-3 py-1 rounded-xl text-xs font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}
                  >
                    Invoice
                  </button>
                ) : (
                  <span className={tdMuted}>N/A</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <DriverModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}