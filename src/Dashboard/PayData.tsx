import { useState } from "react";
import DriverModal from "./DriverModalProps";
import './travelsync-design-system.css'
type PayoutType = "success" | "warning" | "purple" | "destructive";

interface Payment {
  date: string; ref: string; client: string; method: string;
  driver: string; vehicle: string; driverSeed: string;
  amount: string; payout: string; payoutType: PayoutType;
  from: string; to: string;
}

interface PaymentsPageProps { dark: boolean; }

const PAYMENTS: Payment[] = [
  { date:"Mar 14, 2025", ref:"#8452A", client:"Emma Watson",    method:"Credit Card (Stripe)", driver:"Thomas Anderson", vehicle:"Mercedes E-Class", driverSeed:"Thomas",  amount:"€240.00", payout:"Cleared: €180.00",    payoutType:"success",     from:"Charles de Gaulle Airport",  to:"Paris 8th Arrondissement" },
  { date:"Mar 16, 2025", ref:"#8429B", client:"John Smith",     method:"Corporate Billing",    driver:"Marcus Chen",     vehicle:"V-Class",          driverSeed:"Marcus",  amount:"€658.00", payout:"Pending: €520.00",    payoutType:"warning",     from:"Lyon Part-Dieu Station",     to:"Geneva Airport"           },
  { date:"Mar 18, 2025", ref:"#8397C", client:"Emily Chen",     method:"Credit Card (Stripe)", driver:"Lucia Gomez",     vehicle:"Range Rover",      driverSeed:"Lucia",   amount:"€310.00", payout:"Processing: €230.00", payoutType:"purple",      from:"Nice Côte d'Azur Airport",   to:"Monaco Monte Carlo"       },
  { date:"Mar 20, 2025", ref:"#8320D", client:"Michael Scott",  method:"PayPal",               driver:"James Mbeki",     vehicle:"Audi A6",          driverSeed:"James",   amount:"€150.00", payout:"Cancelled",           payoutType:"destructive", from:"Orly Airport",               to:"Versailles Palace"        },
  { date:"Mar 22, 2025", ref:"#8291E", client:"Sophie Laurent", method:"Credit Card (Stripe)", driver:"Thomas Anderson", vehicle:"Mercedes E-Class", driverSeed:"Thomas2", amount:"€185.00", payout:"Cleared: €140.00",    payoutType:"success",     from:"Bordeaux Saint-Jean",        to:"Biarritz Airport"         },
];

const PAYOUT_COLOR: Record<PayoutType, string> = {
  success:     "text-emerald-600 dark:text-emerald-400",
  warning:     "text-amber-600   dark:text-amber-400",
  purple:      "text-violet-600  dark:text-violet-400",
  destructive: "ts-faint",
};

const ACCENT: Record<string, string> = {
  violet:  "bg-violet-100  text-violet-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber:   "bg-amber-100   text-amber-600",
  blue:    "bg-blue-100    text-blue-600",
};

export default function AgencyPaymentsData({ dark: _ }: PaymentsPageProps) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);

  const filtered = PAYMENTS.filter((p) => statusFilter === "All" || p.payoutType === statusFilter);

  const stats: { label: string; value: string; accent: string }[] = [
    { label: "Total Revenue",    value: "€42,850", accent: "violet"  },
    { label: "Paid & Cleared",   value: "€36,120", accent: "emerald" },
    { label: "Pending (Unpaid)", value: "€6,730",  accent: "amber"   },
    { label: "Driver Payouts",   value: "€28,500", accent: "blue"    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Payments Overview</h1>
          <p className="ts-page-subtitle">Track incoming revenues, pending balances, and driver payouts.</p>
        </div>
        <button className="ts-btn-ghost">↓ Export CSV</button>
      </div>

      {/* Stat cards */}
      <div className="ts-grid-4">
        {stats.map((s) => (
          <div key={s.label} className="ts-card ts-stat-card">
            <span className="ts-stat-label">{s.label}</span>
            <span className={`text-2xl font-semibold tracking-tight ts-h`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ts-filter-bar">
        <div className="ts-date-chip">
          <span>Mar 1 – Mar 31, 2025</span>
          <span className="ts-faint">▾</span>
        </div>
        {["All","success","warning","destructive"].map((f) => (
          <button key={f} className={`ts-filter-chip${statusFilter===f?" ts-active":""}`}
            onClick={() => setStatusFilter(f)}>
            {f==="All"?"All":f==="success"?"Cleared":f==="warning"?"Pending":"Cancelled"}
          </button>
        ))}
        <span className="ts-record-count">{filtered.length} records</span>
        <button className="ts-btn-primary">Apply Filters</button>
      </div>

      {/* Table */}
      <div className="ts-table-wrap">
        {/* Header row */}
        <div className="ts-thead grid px-5 py-3 border-b"
          style={{ gridTemplateColumns: "1fr 1.4fr 1.6fr 1.8fr 0.8fr 1fr 0.9fr", borderColor: "var(--border)" }}>
          {["Date & Ref","Client / Passenger","Driver & Vehicle","Route","Amount","Payout","Action"].map((h, i) => (
            <span key={h} className={`ts-th py-0 ${i===6?"text-right":""}`}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="ts-muted px-5 py-10 text-center text-sm">No payments match your filters.</div>
        ) : (
          filtered.map((p, i) => (
            <div key={p.ref}
              className={`grid px-5 py-4 text-xs items-center ts-tr-hover${i>0?" border-t":""}`}
              style={{ gridTemplateColumns: "1fr 1.4fr 1.6fr 1.8fr 0.8fr 1fr 0.9fr", borderColor: "var(--border-row)" }}>

              <div>
                <p className="ts-td-h font-medium">{p.date}</p>
                <p className="ts-td-sub">{p.ref}</p>
              </div>
              <div>
                <p className="ts-td-h font-medium">{p.client}</p>
                <p className="ts-td-sub">{p.method}</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.driverSeed}`}
                  alt={p.driver} className="w-7 h-7 rounded-full bg-violet-100 shrink-0" />
                <div>
                  <p className="ts-td-h font-medium">{p.driver}</p>
                  <p className="ts-td-sub">{p.vehicle}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <p className="ts-td-h font-medium truncate">{p.from}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                  <p className="ts-td-sub truncate">{p.to}</p>
                </div>
              </div>
              <p className={`font-semibold ts-td-h ${p.payoutType==="destructive"?"line-through ts-faint":""}`}>{p.amount}</p>
              <p className={`font-medium ${PAYOUT_COLOR[p.payoutType]}`}>{p.payout}</p>
              <div className="text-right">
                {p.payoutType !== "destructive"
                  ? <button className="ts-btn-primary" style={{ padding:".25rem .75rem" }} onClick={() => setOpen(true)}>Invoice</button>
                  : <span className="ts-faint">N/A</span>}
              </div>
            </div>
          ))
        )}
      </div>

      <DriverModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}