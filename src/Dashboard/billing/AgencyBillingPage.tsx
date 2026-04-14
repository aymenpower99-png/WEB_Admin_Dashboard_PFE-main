import { useState, useMemo } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ViewTripModal from "../ViewTripModal";
import type { TripPayment, PayStatus } from "../ViewTripModal";
import "../travelsync-design-system.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type TransactionType = "Ride" | "Refund" | "Adjustment";
type TransactionStatus = "Paid" | "Pending" | "Failed";
type VehicleClass = "Economy" | "Comfort" | "Premium";

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  vehicleClass: VehicleClass;
}

interface DriverEarning {
  id: string;
  name: string;
  seed: string;
  rides: number;
  fixedSalary: number;
  rideCommission: number;
  performanceBonus: number;
}

/* ─── Static Data ────────────────────────────────────────────────────────── */
const ALL_PAYMENTS: TripPayment[] = [
  { id: "TRP1024", rider: "Sara Mitchell", riderSeed: "Sara", pickup: "Airport", drop: "Hotel Downtown", amount: "$32.00", amountNum: 32, method: "Card", status: "Paid", date: "today", distance: "12 km", duration: "22 min", time: "10:30" },
  { id: "TRP1026", rider: "Lina Becker", riderSeed: "Lina", pickup: "Train Station", drop: "Airport", amount: "$27.50", amountNum: 27.5, method: "Card", status: "Pending", date: "today", distance: "18 km", duration: "30 min", time: "12:00" },
  { id: "TRP1027", rider: "James Liu", riderSeed: "James", pickup: "University", drop: "Business Park", amount: "$41.00", amountNum: 41, method: "Card", status: "Paid", date: "week", distance: "9 km", duration: "18 min", time: "13:45" },
  { id: "TRP1029", rider: "David Chen", riderSeed: "David", pickup: "Hotel Grand", drop: "Convention Ctr", amount: "$22.00", amountNum: 22, method: "Card", status: "Paid", date: "week", distance: "7 km", duration: "14 min", time: "15:20" },
  { id: "TRP1030", rider: "Amara Diallo", riderSeed: "Amara", pickup: "Airport T2", drop: "City Center", amount: "$38.50", amountNum: 38.5, method: "Card", status: "Paid", date: "month", distance: "16 km", duration: "28 min", time: "08:10" },
  { id: "TRP1032", rider: "Sophie Martin", riderSeed: "Sophie", pickup: "Museum", drop: "Old Town", amount: "$19.50", amountNum: 19.5, method: "Card", status: "Paid", date: "month", distance: "5 km", duration: "11 min", time: "14:55" },
  { id: "TRP1034", rider: "Mia Tanaka", riderSeed: "Mia", pickup: "City Center", drop: "Airport T1", amount: "$44.00", amountNum: 44, method: "Card", status: "Pending", date: "week", distance: "20 km", duration: "35 min", time: "17:05" },
  { id: "TRP1036", rider: "Carlos Reyes", riderSeed: "Carlos", pickup: "Harbor", drop: "Financial Dist", amount: "$29.00", amountNum: 29, method: "Card", status: "Paid", date: "today", distance: "11 km", duration: "20 min", time: "09:15" },
  { id: "TRP1038", rider: "Priya Nair", riderSeed: "Priya", pickup: "Tech Campus", drop: "Downtown", amount: "$33.00", amountNum: 33, method: "Card", status: "Paid", date: "month", distance: "14 km", duration: "25 min", time: "18:30" },
  { id: "TRP1039", rider: "Felix Müller", riderSeed: "Felix", pickup: "Central Park", drop: "East District", amount: "$26.00", amountNum: 26, method: "Card", status: "Pending", date: "month", distance: "10 km", duration: "19 min", time: "07:45" },
  { id: "TRP1040", rider: "Ines Ferreira", riderSeed: "Ines", pickup: "West Terminal", drop: "Stadium", amount: "$21.50", amountNum: 21.5, method: "Card", status: "Paid", date: "today", distance: "6 km", duration: "13 min", time: "16:00" },
];

const TRANSACTIONS: Transaction[] = [
  { id: "TXN-0091", date: "2025-07-14", type: "Ride", amount: 32.0, status: "Paid", vehicleClass: "Economy" },
  { id: "TXN-0092", date: "2025-07-14", type: "Ride", amount: 27.5, status: "Pending", vehicleClass: "Comfort" },
  { id: "TXN-0093", date: "2025-07-13", type: "Refund", amount: -15.0, status: "Paid", vehicleClass: "Economy" },
  { id: "TXN-0094", date: "2025-07-13", type: "Ride", amount: 41.0, status: "Paid", vehicleClass: "Premium" },
  { id: "TXN-0095", date: "2025-07-12", type: "Adjustment", amount: 5.0, status: "Paid", vehicleClass: "Economy" },
  { id: "TXN-0096", date: "2025-07-12", type: "Ride", amount: 22.0, status: "Paid", vehicleClass: "Comfort" },
  { id: "TXN-0097", date: "2025-07-11", type: "Ride", amount: 38.5, status: "Failed", vehicleClass: "Premium" },
  { id: "TXN-0098", date: "2025-07-11", type: "Ride", amount: 19.5, status: "Paid", vehicleClass: "Economy" },
  { id: "TXN-0099", date: "2025-07-10", type: "Refund", amount: -10.0, status: "Paid", vehicleClass: "Comfort" },
  { id: "TXN-0100", date: "2025-07-10", type: "Ride", amount: 44.0, status: "Pending", vehicleClass: "Premium" },
  { id: "TXN-0101", date: "2025-07-09", type: "Ride", amount: 29.0, status: "Paid", vehicleClass: "Economy" },
  { id: "TXN-0102", date: "2025-07-09", type: "Adjustment", amount: 8.0, status: "Paid", vehicleClass: "Economy" },
];

const DRIVER_EARNINGS: DriverEarning[] = [
  { id: "D01", name: "Marcus Wade",   seed: "Marcus", rides: 142, fixedSalary: 800,  rideCommission: 2130, performanceBonus: 350 },
  { id: "D02", name: "Lena Kovač",    seed: "Lena",   rides: 118, fixedSalary: 800,  rideCommission: 1770, performanceBonus: 200 },
  { id: "D03", name: "Omar Khalid",   seed: "Omar",   rides: 97,  fixedSalary: 700,  rideCommission: 1455, performanceBonus: 150 },
  { id: "D04", name: "Yuki Sato",     seed: "Yuki",   rides: 88,  fixedSalary: 700,  rideCommission: 1320, performanceBonus: 100 },
  { id: "D05", name: "Bianca Torres", seed: "Bianca", rides: 74,  fixedSalary: 650,  rideCommission: 1110, performanceBonus: 80  },
  { id: "D06", name: "Ethan Brooks",  seed: "Ethan",  rides: 65,  fixedSalary: 650,  rideCommission:  975, performanceBonus: 50  },
  { id: "D07", name: "Aisha Okafor",  seed: "Aisha",  rides: 58,  fixedSalary: 600,  rideCommission:  870, performanceBonus: 0   },
];

const DAILY_EARNINGS = [
  { day: "Mon", earnings: 1820 },
  { day: "Tue", earnings: 2340 },
  { day: "Wed", earnings: 1980 },
  { day: "Thu", earnings: 2760 },
  { day: "Fri", earnings: 3120 },
  { day: "Sat", earnings: 2890 },
  { day: "Sun", earnings: 2100 },
];

const MONTHLY_EARNINGS = [
  { month: "Jan", earnings: 18200 },
  { month: "Feb", earnings: 20400 },
  { month: "Mar", earnings: 22100 },
  { month: "Apr", earnings: 19800 },
  { month: "May", earnings: 23600 },
  { month: "Jun", earnings: 24300 },
  { month: "Jul", earnings: 16800 },
];

const CLASS_REVENUE = [
  { class: "Economy", revenue: 12400 },
  { class: "Comfort", revenue: 7800 },
  { class: "Premium", revenue: 4100 },
];

/* ─── Shared style constants ─────────────────────────────────────────────── */
const ROWS = 5;
const ROW_H = 72;

const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "0 1.1rem",
  height: ROW_H,
  fontSize: ".85rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
  lineHeight: 1.6,
};

/* ─── Status styles ──────────────────────────────────────────────────────── */
const STATUS_STYLE: Record<PayStatus | TransactionStatus, string> = {
  Paid: "ts-pill ts-pill-completed",
  Pending: "ts-pill ts-pill-pending",
  Failed: "ts-pill ts-pill-failed",
};

const STATUS_ICON: Record<PayStatus | TransactionStatus, React.ReactNode> = {
  Paid: <CheckCircleRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
  Pending: <HourglassTopRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
  Failed: <CancelRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />,
};

/* ─── Pagination ─────────────────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPrev, onNext, setPage }: {
  page: number; totalPages: number; onPrev: () => void; onNext: () => void; setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    background: active ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))" : disabled ? "transparent" : "var(--bg-card)",
    color: active ? "#fff" : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 500 }}>Page {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btn(false, page === 1)}><ChevronLeftRoundedIcon style={{ fontSize: 14 }} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => setPage(n)} style={btn(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btn(false, page === totalPages)}><ChevronRightRoundedIcon style={{ fontSize: 14 }} /></button>
      </div>
    </div>
  );
}

/* ─── Filter Pill ────────────────────────────────────────────────────────── */
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "0.3rem 0.875rem", fontSize: "0.7rem", fontWeight: 600,
      border: active ? "none" : "1px solid var(--border)", borderRadius: "2rem", cursor: "pointer",
      background: active ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))" : "var(--bg-inner)",
      color: active ? "#fff" : "var(--text-muted)", transition: "all 0.15s ease", whiteSpace: "nowrap" as const,
    }}>{label}</button>
  );
}

/* ─── Custom Tooltip ─────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.5rem 0.85rem", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
      <p style={{ fontSize: ".75rem", color: "var(--text-faint)", marginBottom: ".2rem", fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ fontSize: ".82rem", fontWeight: 700, color: p.color || "var(--text-h)" }}>${p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
}

/* ─── TAB 1: Transactions ────────────────────────────────────────────────── */
function TransactionsTab() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"All" | TransactionStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>("All");
  const [classFilter, setClassFilter] = useState<"All" | VehicleClass>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => TRANSACTIONS.filter(t => {
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchType = typeFilter === "All" || t.type === typeFilter;
    const matchClass = classFilter === "All" || t.vehicleClass === classFilter;
    const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchClass && matchSearch;
  }), [statusFilter, typeFilter, classFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  const TYPE_COLOR: Record<TransactionType, string> = {
    Ride: "var(--text-h)",
    Refund: "#ef4444",
    Adjustment: "#f59e0b",
  };

  return (
    <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="flex items-center gap-2">
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Transactions</p>
          <span className="ts-chip">{filtered.length} entries</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              padding: "0.3rem 0.75rem", fontSize: "0.75rem", borderRadius: "2rem",
              border: "1px solid var(--border)", background: "var(--bg-inner)",
              color: "var(--text-body)", outline: "none", width: 140,
            }}
          />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem", fontWeight: 600, border: "1px solid var(--border)", borderRadius: "2rem", background: "var(--bg-inner)", color: "var(--text-muted)", cursor: "pointer" }}>
            {["All", "Paid", "Pending", "Failed"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value as any); setPage(1); }}
            style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem", fontWeight: 600, border: "1px solid var(--border)", borderRadius: "2rem", background: "var(--bg-inner)", color: "var(--text-muted)", cursor: "pointer" }}>
            {["All", "Ride", "Refund", "Adjustment"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={classFilter} onChange={e => { setClassFilter(e.target.value as any); setPage(1); }}
            style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem", fontWeight: 600, border: "1px solid var(--border)", borderRadius: "2rem", background: "var(--bg-inner)", color: "var(--text-muted)", cursor: "pointer" }}>
            {["All", "Economy", "Comfort", "Premium"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "18%" }} /><col style={{ width: "16%" }} /><col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} /><col style={{ width: "16%" }} /><col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>{["Transaction ID", "Date", "Type", "Vehicle Class", "Amount", "Status"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <>
                <tr style={{ height: ROW_H }}><td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>No transactions match the selected filters.</td></tr>
                {Array.from({ length: ROWS - 1 }).map((_, i) => <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            ) : (
              <>
                {paged.map(t => (
                  <tr key={t.id} className="ts-tr" style={{ height: ROW_H }}>
                    <td style={TD}><span className="ts-td-h font-mono font-semibold" style={{ fontSize: ".78rem" }}>{t.id}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>{t.date}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: TYPE_COLOR[t.type] }}>{t.type}</span></td>
                    <td style={TD}><span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>{t.vehicleClass}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 700, color: t.amount < 0 ? "#ef4444" : "var(--text-h)" }}>{t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `$${t.amount.toFixed(2)}`}</span></td>
                    <td style={TD}><span className={STATUS_STYLE[t.status]} style={{ fontSize: "0.7rem", display: "inline-flex", alignItems: "center" }}>{STATUS_ICON[t.status]}{t.status}</span></td>
                  </tr>
                ))}
                {Array.from({ length: ghostCount }).map((_, i) => <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={safePage} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
    </div>
  );
}

/* ─── TAB 2: Driver Earnings (Hybrid Payment Model) ─────────────────────── */
function DriverEarningsTab() {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(DRIVER_EARNINGS.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = DRIVER_EARNINGS.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  /* Payment model info cards */
  const modelCards = [
    {
      emoji: "💰",
      title: "Fixed Salary",
      desc: "Guaranteed monthly base pay per driver. Not affected by ride count — ensures stable income and retention.",
      color: "#3b82f6",
    },
    {
      emoji: "📈",
      title: "Ride Commission",
      desc: "Performance-based earnings per completed ride. Motivates high activity and encourages more trips.",
      color: "#10b981",
    },
    {
      emoji: "🏆",
      title: "Performance Bonus",
      desc: "Bonus for high ride volume (100+ rides/month) or top ratings (4.8+). Rewards outstanding drivers.",
      color: "#f59e0b",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Payment model explanation cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.875rem" }}>
        {modelCards.map(c => (
          <div key={c.title} className="ts-card" style={{ padding: "1rem 1.25rem", borderLeft: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{c.emoji}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-h)" }}>{c.title}</span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Formula banner */}
      <div className="ts-card" style={{ padding: "0.875rem 1.25rem", background: "var(--bg-inner)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: ".07em" }}>Formula</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Fixed Salary", color: "#3b82f6" },
            { label: "+", color: "var(--text-faint)" },
            { label: "Ride Commission", color: "#10b981" },
            { label: "+", color: "var(--text-faint)" },
            { label: "Performance Bonus", color: "#f59e0b" },
            { label: "=", color: "var(--text-faint)" },
            { label: "Total Earnings", color: "var(--text-h)" },
          ].map((item, i) => (
            <span key={i} style={{ fontSize: "0.8rem", fontWeight: item.label === "Total Earnings" ? 800 : item.label === "+" || item.label === "=" ? 500 : 600, color: item.color }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Driver Earnings Table */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div className="ts-toolbar">
          <div className="flex items-center gap-2">
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Driver Payment Breakdown</p>
            <span className="ts-chip">{DRIVER_EARNINGS.length} drivers</span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", fontWeight: 500 }}>Hybrid salary + commission model</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr>
                {[
                  { label: "Driver Name", align: "left" },
                  { label: "Rides", align: "left" },
                  { label: "Fixed Salary", align: "left" },
                  { label: "Ride Commission", align: "left" },
                  { label: "Performance Bonus", align: "left" },
                  { label: "Total Earnings", align: "left" },
                ].map(h => (
                  <th key={h.label} style={{ ...TH, textAlign: h.align as any }}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(d => {
                const total = d.fixedSalary + d.rideCommission + d.performanceBonus;
                return (
                  <tr key={d.id} className="ts-tr" style={{ height: ROW_H }}>
                    {/* Driver Name */}
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg,var(--brand-from),var(--brand-to))",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.65rem", fontWeight: 800, color: "#fff",
                        }}>
                          {d.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <span style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-h)" }}>{d.name}</span>
                      </div>
                    </td>
                    {/* Rides */}
                    <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>{d.rides}</span></td>
                    {/* Fixed Salary */}
                    <td style={TD}>
                      <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#3b82f6" }}>{d.fixedSalary.toLocaleString()} TND</span>
                    </td>
                    {/* Ride Commission */}
                    <td style={TD}>
                      <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#10b981" }}>{d.rideCommission.toLocaleString()} TND</span>
                    </td>
                    {/* Performance Bonus */}
                    <td style={TD}>
                      {d.performanceBonus > 0 ? (
                        <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#f59e0b" }}>{d.performanceBonus.toLocaleString()} TND</span>
                      ) : (
                        <span style={{ fontSize: ".78rem", color: "var(--text-faint)" }}>—</span>
                      )}
                    </td>
                    {/* Total Earnings */}
                    <td style={TD}>
                      <span style={{ fontSize: ".85rem", fontWeight: 800, color: "var(--text-h)" }}>{total.toLocaleString()} TND</span>
                    </td>
                  </tr>
                );
              })}
              {Array.from({ length: ghostCount }).map((_, i) => (
                <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={safePage} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
      </div>
    </div>
  );
}

/* ─── TAB 0: Trip Payments ───────────────────────────────────────────────── */
function TripPaymentsTab({ onViewTrip }: { onViewTrip: (t: TripPayment) => void }) {
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month">("today");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => ALL_PAYMENTS.filter(p => {
    return dateFilter === "today" ? p.date === "today"
      : dateFilter === "week" ? p.date === "today" || p.date === "week"
      : true;
  }), [dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  return (
    <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="flex items-center gap-2">
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Trip Payments</p>
          <span className="ts-chip">{filtered.length} trips</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontWeight: 600 }}>Period:</span>
          {(["today", "week", "month"] as const).map(d => (
            <FilterPill key={d} label={d === "today" ? "Today" : d === "week" ? "Last 7 Days" : "This Month"} active={dateFilter === d}
              onClick={() => { setDateFilter(d); setPage(1); }} />
          ))}
          <button className="ts-btn-ghost" style={{ padding: "0.25rem 0.75rem", marginLeft: "0.25rem" }}>↓ Export</button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "10%" }} /><col style={{ width: "18%" }} /><col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} /><col style={{ width: "12%" }} /><col style={{ width: "12%" }} /><col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr>
              {["Trip ID", "Rider", "Pickup", "Drop-off", "Amount", "Status", "Action"].map((h, i) => (
                <th key={h} style={{ ...TH, textAlign: i === 6 ? "center" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <>
                <tr style={{ height: ROW_H }}><td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>No payments match the selected filters.</td></tr>
                {Array.from({ length: ROWS - 1 }).map((_, i) => <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            ) : (
              <>
                {paged.map(p => (
                  <tr key={p.id} className="ts-tr" style={{ height: ROW_H }}>
                    <td style={TD}><span className="ts-td-h font-mono font-semibold" style={{ fontSize: ".78rem" }}>{p.id}</span></td>
                    <td style={TD}><span className="ts-td-h" style={{ fontSize: ".82rem", fontWeight: 600 }}>{p.rider}</span></td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <NearMeRoundedIcon style={{ fontSize: 13, color: "#7c3aed", flexShrink: 0 }} />
                        <span style={{ fontSize: ".78rem", color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.pickup}</span>
                      </div>
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <PlaceRoundedIcon style={{ fontSize: 13, color: "#10b981", flexShrink: 0 }} />
                        <span style={{ fontSize: ".78rem", color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.drop}</span>
                      </div>
                    </td>
                    <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>{p.amount}</span></td>
                    <td style={TD}>
                      <span className={STATUS_STYLE[p.status]} style={{ fontSize: "0.7rem", display: "inline-flex", alignItems: "center" }}>
                        {STATUS_ICON[p.status]}{p.status}
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button className="ts-btn-primary" style={{ padding: "0.28rem 0.7rem", fontSize: "0.7rem" }} onClick={() => onViewTrip(p)}>View Trip</button>
                    </td>
                  </tr>
                ))}
                {Array.from({ length: ghostCount }).map((_, i) => <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={safePage} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AgencyBillingPage() {
  const [chartToggle, setChartToggle] = useState<"daily" | "monthly">("daily");
  const [activeTab, setActiveTab] = useState(0);
  const [viewTrip, setViewTrip] = useState<TripPayment | null>(null);

  const tabs = ["Trip Payments", "Transactions", "Driver Earnings"];

  const summaryCards = [
    { label: "Total Earnings (This Month)", value: "$24,300", icon: <TrendingUpRoundedIcon style={{ fontSize: 18 }} />, accent: "#10b981" },
    { label: "Net Revenue",                 value: "$23,100", icon: <MonetizationOnRoundedIcon style={{ fontSize: 18 }} />, accent: "#3b82f6" },
    { label: "Pending Payments",            value: "$1,100",  icon: <PendingActionsRoundedIcon style={{ fontSize: 18 }} />, accent: "#f59e0b" },
    { label: "Paid Revenue",                value: "$22,000", icon: <AccountBalanceWalletRoundedIcon style={{ fontSize: 18 }} />, accent: "#10b981" },
  ];

  const chartData = chartToggle === "daily" ? DAILY_EARNINGS : MONTHLY_EARNINGS;
  const chartKey = chartToggle === "daily" ? "day" : "month";

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Agency Billing</h1>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="ts-grid-4">
        {summaryCards.map(c => (
          <div key={c.label} className="ts-card" style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="ts-stat-label">{c.label}</span>
              <span style={{ color: c.accent, opacity: 0.85 }}>{c.icon}</span>
            </div>
            <span className="ts-stat-value">{c.value}</span>
          </div>
        ))}
      </div>

      {/* ── Revenue Analytics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="ts-table-wrap" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-h)" }}>Earnings Over Time</p>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {(["daily", "monthly"] as const).map(t => (
                <FilterPill key={t} label={t === "daily" ? "Daily" : "Monthly"} active={chartToggle === t} onClick={() => setChartToggle(t)} />
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey={chartKey} tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="earnings" stroke="var(--brand-from)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--brand-from)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="ts-table-wrap" style={{ padding: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-h)", marginBottom: "1rem" }}>Revenue by Vehicle Class</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CLASS_REVENUE} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="class" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="url(#barGrad2)" />
              <defs>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-from)" />
                  <stop offset="100%" stopColor="var(--brand-to)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "0.65rem 1.15rem",
                fontSize: "0.78rem",
                fontWeight: activeTab === i ? 700 : 500,
                color: activeTab === i ? "var(--text-h)" : "var(--text-faint)",
                background: "none",
                border: "none",
                borderBottom: activeTab === i ? "2px solid var(--brand-from)" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all .15s",
                marginBottom: -1,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "1rem" }}>
          {activeTab === 0 && <TripPaymentsTab onViewTrip={setViewTrip} />}
          {activeTab === 1 && <TransactionsTab />}
          {activeTab === 2 && <DriverEarningsTab />}
        </div>
      </div>

      {viewTrip && <ViewTripModal trip={viewTrip} onClose={() => setViewTrip(null)} />}
    </div>
  );
}