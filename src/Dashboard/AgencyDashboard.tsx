import { useState, useEffect } from "react";
import {
  Clock, Car, UserCheck, Users, Truck, DollarSign,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

interface AgencyDashboardProps { dark: boolean; }

/* ─── DATA ───────────────────────────────────────────────────────────── */
const tripsChartData = [
  { day:"Mon", trips:90  },
  { day:"Tue", trips:120 },
  { day:"Wed", trips:110 },
  { day:"Thu", trips:150 },
  { day:"Fri", trips:170 },
  { day:"Sat", trips:200 },
  { day:"Sun", trips:180 },
];

const earningsChartData = [
  { period:"Mon", today:820,  week:5200,  month:21000 },
  { period:"Tue", today:960,  week:5800,  month:22400 },
  { period:"Wed", today:880,  week:5600,  month:21800 },
  { period:"Thu", today:1050, week:6100,  month:23500 },
  { period:"Fri", today:1240, week:6800,  month:25200 },
  { period:"Sat", today:1100, week:6400,  month:24100 },
  { period:"Sun", today:930,  week:5900,  month:22900 },
];

const tripRequests = [
  { rider:"Sara M",  driver:"Ahmed Ben",   vehicle:"Toyota Corolla", pickup:"Airport",  destination:"Downtown",  status:"completed" },
  { rider:"Ali K",   driver:"Karim Ali",   vehicle:"Kia Rio",        pickup:"Mall",     destination:"Station",   status:"completed" },
  { rider:"Lina B",  driver:"Samir Salah", vehicle:"Hyundai i10",    pickup:"Station",  destination:"Airport",   status:"completed" },
  { rider:"Omar S",  driver:"Youssef M",   vehicle:"Dacia Logan",    pickup:"Hotel",    destination:"City Hall", status:"completed" },
  { rider:"Nour F",  driver:"Nabil H",     vehicle:"Peugeot 301",    pickup:"Airport",  destination:"Hotel",     status:"completed" },
  { rider:"Sami T",  driver:"Raouf T",     vehicle:"Toyota Corolla", pickup:"Downtown", destination:"Mall",      status:"completed" },
];

const driverActivity = [
  { name:"Ahmed Ben",   status:"online",   trips:12, seed:"Ahmed"   },
  { name:"Karim Ali",   status:"on-trip",  trips:9,  seed:"Karim"   },
  { name:"Samir Salah", status:"offline",  trips:3,  seed:"Samir"   },
  { name:"Youssef M",   status:"online",   trips:7,  seed:"Youssef" },
  { name:"Nabil H",     status:"on-trip",  trips:5,  seed:"Nabil"   },
  { name:"Raouf T",     status:"offline",  trips:1,  seed:"Raouf"   },
];

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const tripStatusPill = (s: string) => {
  if (s === "completed")                    return "ts-pill ts-pill-completed";
  if (s === "ongoing"  || s === "online")   return "ts-pill ts-pill-active";
  if (s === "assigned" || s === "on-trip")  return "ts-pill ts-pill-pending";
  if (s === "waiting"  || s === "offline")  return "ts-pill ts-pill-blocked";
  return "ts-pill ts-pill-pending";
};

const ROWS = 4;

function MiniPagination({ page, total, onPrev, onNext }: { page:number; total:number; onPrev:()=>void; onNext:()=>void }) {
  const btn = (disabled: boolean): React.CSSProperties => ({
    display:"flex", alignItems:"center", justifyContent:"center",
    width:22, height:22, borderRadius:"0.375rem",
    border:"1px solid var(--border)",
    background: disabled ? "transparent" : "var(--bg-card)",
    color: disabled ? "var(--text-faint)" : "var(--text-muted)",
    cursor: disabled ? "not-allowed" : "pointer",
  });
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.4rem 0.75rem", borderTop:"1px solid var(--border)", flexShrink:0 }}>
      <span style={{ fontSize:"0.65rem", color:"var(--text-faint)", fontWeight:500 }}>Page {page} of {total}</span>
      <div style={{ display:"flex", gap:"0.25rem" }}>
        <button onClick={onPrev} disabled={page===1} style={btn(page===1)}><ChevronLeft size={11} strokeWidth={2.5}/></button>
        <button onClick={onNext} disabled={page===total} style={btn(page===total)}><ChevronRight size={11} strokeWidth={2.5}/></button>
      </div>
    </div>
  );
}

/* ─── KPI CARD ───────────────────────────────────────────────────────── */
function KpiCard({ Icon, iconBg, iconFg, label, value }: {
  Icon: React.ElementType; iconBg:string; iconFg:string; label:string; value:string;
}) {
  return (
    <div style={{
      background:"var(--bg-card)", border:"1px solid var(--border)",
      borderRadius:"0.75rem", padding:"0.85rem 1.1rem",
      display:"flex", flexDirection:"column", justifyContent:"space-between",
      position:"relative", minHeight:"80px",
    }}>
      <div style={{
        position:"absolute", top:"0.85rem", right:"1.1rem",
        width:36, height:36, borderRadius:"50%", background:iconBg,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <Icon size={16} color={iconFg} strokeWidth={1.75}/>
      </div>
      <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", fontWeight:500, paddingRight:"44px" }}>{label}</span>
      <span style={{ fontSize:"1.6rem", fontWeight:800, color:"var(--text-h)", lineHeight:1, marginTop:"0.35rem" }}>{value}</span>
    </div>
  );
}

/* ─── CHART TOOLTIP ──────────────────────────────────────────────────── */
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"0.5rem", padding:"0.5rem 0.75rem", fontSize:"0.72rem", color:"var(--text-h)", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight:700, marginBottom:"0.2rem" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color:p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AgencyDashboard({ dark: _ }: AgencyDashboardProps) {
  const [vals, setVals] = useState({ pending:0, active:0, online:0, busy:0, vehicles:0, earnings:0 });
  const [earningsTab, setEarningsTab] = useState<"today"|"week"|"month">("today");
  const [tripPage,   setTripPage]   = useState(1);
  const [driverPage, setDriverPage] = useState(1);

  const totalTripPages   = Math.ceil(tripRequests.length  / ROWS);
  const totalDriverPages = Math.ceil(driverActivity.length / ROWS);
  const pagedTrips   = tripRequests.slice( (tripPage   - 1) * ROWS, tripPage   * ROWS);
  const pagedDrivers = driverActivity.slice((driverPage - 1) * ROWS, driverPage * ROWS);

  useEffect(() => {
    const targets = { pending:6, active:12, online:8, busy:10, vehicles:14, earnings:1240 };
    let step = 0;
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 40, 3);
      setVals(Object.fromEntries(Object.entries(targets).map(([k,v]) => [k, Math.round(v * ease)])) as typeof vals);
      if (step >= 40) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);

  const kpis = [
    { Icon:Clock,     iconBg:"#ffedd5", iconFg:"#ea580c", label:"Pending Requests",  value:`${vals.pending} waiting`  },
    { Icon:Car,       iconBg:"#ede9fe", iconFg:"#7c3aed", label:"Active Trips",      value:`${vals.active} ongoing`   },
    { Icon:UserCheck, iconBg:"#d1fae5", iconFg:"#059669", label:"Online Drivers",    value:`${vals.online} drivers`   },
    { Icon:Users,     iconBg:"#dbeafe", iconFg:"#2563eb", label:"Busy Drivers",      value:`${vals.busy} drivers`     },
    { Icon:Truck,     iconBg:"#fce7f3", iconFg:"#db2777", label:"Available Vehicles",value:`${vals.vehicles} cars`    },
    { Icon:DollarSign,iconBg:"#fef3c7", iconFg:"#d97706", label:"Today's Earnings",  value:`$${vals.earnings.toLocaleString()}` },
  ];

  return (
    <>
      <style>{`
        .ts-pill-completed {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:"0.55rem", overflow:"hidden" }}>

        {/* ── Heading ── */}
        <h1 className="ts-page-title" style={{ fontSize:"1.25rem", fontWeight:800, flexShrink:0 }}>Agency Dashboard</h1>

        {/* ── KPI Row — 6 cards ── */}
        <div style={{ flexShrink:0 }}>
          <p className="ts-section-label" style={{ marginBottom:"0.3rem" }}>Live Overview</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"0.65rem" }}>
            {kpis.map(k => <KpiCard key={k.label} {...k}/>)}
          </div>
        </div>

        {/* ── Charts ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem", flexShrink:0 }}>

          {/* Trips overview */}
          <div className="ts-table-wrap" style={{ padding:"0.75rem 1rem 0.5rem" }}>
            <p className="ts-page-title" style={{ fontSize:".825rem", marginBottom:"0.5rem" }}>Trips Overview — Last 7 Days</p>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={tripsChartData} margin={{ top:4, right:4, left:-28, bottom:0 }}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="day"   tick={{ fontSize:10, fill:"var(--text-faint)" }} axisLine={false} tickLine={false}/>
                <YAxis               tick={{ fontSize:10, fill:"var(--text-faint)" }} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Area type="monotone" dataKey="trips" name="Trips" stroke="#7c3aed" strokeWidth={2} fill="url(#aGrad)" dot={false} activeDot={{ r:4, fill:"#7c3aed" }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings */}
          <div className="ts-table-wrap" style={{ padding:"0.75rem 1rem 0.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.5rem" }}>
              <p className="ts-page-title" style={{ fontSize:".825rem" }}>Earnings</p>
              <div style={{ display:"flex", gap:"0.25rem" }}>
                {(["today","week","month"] as const).map(tab => (
                  <button key={tab} onClick={() => setEarningsTab(tab)} style={{
                    padding:"0.2rem 0.55rem", borderRadius:"9999px", fontSize:"0.65rem",
                    fontWeight:600, border:"1px solid var(--border)",
                    background: earningsTab===tab ? "#7c3aed" : "transparent",
                    color: earningsTab===tab ? "#fff" : "var(--text-muted)",
                    cursor:"pointer", transition:"all .15s",
                  }}>
                    {tab === "today" ? "Today" : tab === "week" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={earningsChartData} margin={{ top:4, right:4, left:-28, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="period" tick={{ fontSize:10, fill:"var(--text-faint)" }} axisLine={false} tickLine={false}/>
                <YAxis              tick={{ fontSize:10, fill:"var(--text-faint)" }} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey={earningsTab} name="$" fill="#7c3aed" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ── Tables ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem", flex:1, minHeight:0 }}>

          {/* Recent Trip Requests */}
          <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden" }}>
            <div className="ts-toolbar" style={{ flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                <Clock size={14} color="var(--text-muted)" strokeWidth={2}/>
                <p className="ts-page-title" style={{ fontSize:".825rem" }}>Recent Trip Requests</p>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
              <table className="ts-table">
                <thead className="ts-thead">
                  <tr>
                    <th className="ts-th">Rider</th>
                    <th className="ts-th">Driver</th>
                    <th className="ts-th">Vehicle</th>
                    <th className="ts-th">Pickup</th>
                    <th className="ts-th">Destination</th>
                    <th className="ts-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTrips.map((t, i) => (
                    <tr key={i} className="ts-tr">
                      <td className="ts-td ts-td-h" style={{ fontSize:".775rem" }}>{t.rider}</td>
                      <td className="ts-td" style={{ fontSize:".75rem", color:"var(--text-muted)" }}>{t.driver}</td>
                      <td className="ts-td" style={{ fontSize:".75rem", color:"var(--text-muted)" }}>{t.vehicle}</td>
                      <td className="ts-td" style={{ fontSize:".75rem", color:"var(--text-muted)" }}>{t.pickup}</td>
                      <td className="ts-td" style={{ fontSize:".75rem", color:"var(--text-muted)" }}>{t.destination}</td>
                      <td className="ts-td"><span className={tripStatusPill(t.status)}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MiniPagination page={tripPage} total={totalTripPages} onPrev={() => setTripPage(p => Math.max(1,p-1))} onNext={() => setTripPage(p => Math.min(totalTripPages,p+1))}/>
          </div>

          {/* Driver Activity */}
          <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden" }}>
            <div className="ts-toolbar" style={{ flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                <Users size={14} color="var(--text-muted)" strokeWidth={2}/>
                <p className="ts-page-title" style={{ fontSize:".825rem" }}>Driver Activity</p>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
              <table className="ts-table">
                <thead className="ts-thead">
                  <tr>
                    <th className="ts-th">Driver</th>
                    <th className="ts-th">Status</th>
                    <th className="ts-th">Trips Today</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedDrivers.map(d => (
                    <tr key={d.name} className="ts-tr">
                      <td className="ts-td">
                        <div style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", overflow:"hidden", background:"#e9d5ff", flexShrink:0 }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${d.seed}`} alt={d.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          </div>
                          <span className="ts-td-h" style={{ fontSize:".775rem" }}>{d.name}</span>
                        </div>
                      </td>
                      <td className="ts-td"><span className={tripStatusPill(d.status)}>{d.status}</span></td>
                      <td className="ts-td ts-td-h" style={{ fontSize:".775rem" }}>{d.trips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MiniPagination page={driverPage} total={totalDriverPages} onPrev={() => setDriverPage(p => Math.max(1,p-1))} onNext={() => setDriverPage(p => Math.min(totalDriverPages,p+1))}/>
          </div>

        </div>
      </div>
    </>
  );
}