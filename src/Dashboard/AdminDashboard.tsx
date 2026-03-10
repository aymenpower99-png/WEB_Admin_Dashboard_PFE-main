/**
 * AdminDashboard.tsx
 * The "Platform Overview" page — shown at /dashboard/dashboard in the sidebar.
 * This is the ADMIN dashboard (KPIs, recent users, agency performance).
 * The AGENCY dashboard is AgencyDashboard.tsx (trips/earnings for an agency).
 */
import { useState, useEffect } from "react";
import {
  Car, ClipboardList, CheckCircle, XCircle,
  DollarSign, UserPlus, Users, Ticket,
  Car as CarIcon, ChevronLeft, ChevronRight,
  UserCheck, Briefcase, Gauge,
} from "lucide-react";

/* ─── mock data ─────────────────────────────────────────────────────── */
const recentUsers = [
  { name:"Sarah Lee",     email:"sarah@moviroo.com",  role:"Rider",  status:"active",  trips:23,  seed:"Sarah"  },
  { name:"David Kim",     email:"david@moviroo.com",  role:"Driver", status:"pending", trips:8,   seed:"David"  },
  { name:"Maria Garcia",  email:"maria@moviroo.com",  role:"Admin",  status:"active",  trips:null,seed:"Maria"  },
  { name:"James Okafor",  email:"james@moviroo.com",  role:"Driver", status:"active",  trips:31,  seed:"James"  },
  { name:"Lena Müller",   email:"lena@moviroo.com",   role:"Rider",  status:"blocked", trips:2,   seed:"Lena"   },
  { name:"Omar Hassan",   email:"omar@moviroo.com",   role:"Driver", status:"active",  trips:17,  seed:"Omar"   },
  { name:"Priya Sharma",  email:"priya@moviroo.com",  role:"Rider",  status:"active",  trips:9,   seed:"Priya"  },
  { name:"Lucas Dupont",  email:"lucas@moviroo.com",  role:"Driver", status:"pending", trips:4,   seed:"Lucas"  },
  { name:"Aisha Nkrumah", email:"aisha@moviroo.com",  role:"Rider",  status:"active",  trips:14,  seed:"Aisha"  },
  { name:"Carlos Vega",   email:"carlos@moviroo.com", role:"Driver", status:"blocked", trips:6,   seed:"Carlos" },
];

const rolePill   = (r: string) => r === "Rider" ? "ts-pill ts-role-rider" : r === "Driver" ? "ts-pill ts-role-driver" : "ts-pill ts-role-admin";
const statusPill = (s: string) => s === "active" ? "ts-pill ts-pill-active" : s === "pending" ? "ts-pill ts-pill-pending" : "ts-pill ts-pill-blocked";

const USERS_PER_PAGE = 5;

/* ─── sub-components ────────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPrev, onNext }: { page: number; totalPages: number; onPrev: () => void; onNext: () => void }) {
  const btnStyle = (active: boolean, disabled: boolean) => ({
    display:"flex", alignItems:"center", justifyContent:"center",
    width:24, height:24, borderRadius:"0.375rem",
    border:"1px solid var(--border)",
    background: active ? "#7c3aed" : disabled ? "transparent" : "var(--bg-card)",
    color: active ? "#fff" : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize:"0.68rem",
    cursor: disabled ? "not-allowed" : "pointer", transition:"all .15s",
  });
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.45rem 0.75rem", borderTop:"1px solid var(--border)", flexShrink:0 }}>
      <span style={{ fontSize:"0.68rem", color:"var(--text-faint)", fontWeight:500 }}>Page {page} of {totalPages}</span>
      <div style={{ display:"flex", gap:"0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btnStyle(false, page === 1)}><ChevronLeft size={12} strokeWidth={2.5} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => n < page ? onPrev() : n > page ? onNext() : null} style={btnStyle(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btnStyle(false, page === totalPages)}><ChevronRight size={12} strokeWidth={2.5} /></button>
      </div>
    </div>
  );
}

function KpiCard({ Icon, iconBg, iconFg, label, value }: {
  Icon: React.ElementType; iconBg: string; iconFg: string; label: string; value: string | number;
}) {
  return (
    <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"0.75rem", padding:"0.85rem 1.1rem", display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", minHeight:"80px" }}>
      <div style={{ position:"absolute", top:"0.85rem", right:"1.1rem", width:36, height:36, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={16} color={iconFg} strokeWidth={1.75} />
      </div>
      <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", fontWeight:500, paddingRight:"44px" }}>{label}</span>
      <span style={{ fontSize:"1.6rem", fontWeight:800, color:"var(--text-h)", lineHeight:1, marginTop:"0.35rem" }}>{value}</span>
    </div>
  );
}

function AgencyPerformanceCard({ vals }: { vals: { drivers: number; vehicles: number; onlineDrivers: number; busyDrivers: number; availableVehicles: number } }) {
  const metrics = [
    { Icon: Users,       iconBg:"#ede9fe", iconFg:"#7c3aed", label:"Total Drivers",      value: vals.drivers          },
    { Icon: CarIcon,     iconBg:"#dbeafe", iconFg:"#2563eb", label:"Total Vehicles",      value: vals.vehicles         },
    { Icon: UserCheck,   iconBg:"#d1fae5", iconFg:"#059669", label:"Online Drivers",      value: vals.onlineDrivers    },
    { Icon: Briefcase,   iconBg:"#fef3c7", iconFg:"#d97706", label:"Busy Drivers",        value: vals.busyDrivers      },
    { Icon: Gauge,       iconBg:"#ffedd5", iconFg:"#ea580c", label:"Available Vehicles",  value: vals.availableVehicles},
  ];

  return (
    <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden" }}>
      <div className="ts-toolbar" style={{ flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
          <Gauge size={14} color="var(--text-muted)" strokeWidth={2} />
          <p className="ts-page-title" style={{ fontSize:".825rem" }}>Agency Performance</p>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", minHeight:0, padding:"0.65rem 0.75rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0.55rem 0.75rem", borderRadius:"0.5rem",
            border:"1px solid var(--border)", background:"var(--bg-card)",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.55rem" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:m.iconBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <m.Icon size={14} color={m.iconFg} strokeWidth={1.75} />
              </div>
              <span style={{ fontSize:"0.775rem", color:"var(--text-muted)", fontWeight:500 }}>{m.label}</span>
            </div>
            <span style={{ fontSize:"1.1rem", fontWeight:800, color:"var(--text-h)", lineHeight:1 }}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main export ────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [vals, setVals] = useState({
    active:0, today:0, completed:0, cancelled:0,
    revenue:0, users:0, drivers:0, tickets:0,
    // agency performance
    agencyDrivers:0, agencyVehicles:0, onlineDrivers:0, busyDrivers:0, availableVehicles:0,
  });
  const [userPage, setUserPage] = useState(1);

  const totalUserPages = Math.ceil(recentUsers.length / USERS_PER_PAGE);
  const pagedUsers     = recentUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  useEffect(() => {
    const targets = {
      active:42, today:1248, completed:1182, cancelled:66,
      revenue:12430, users:128, drivers:87, tickets:17,
      agencyDrivers:32, agencyVehicles:30, onlineDrivers:18, busyDrivers:10, availableVehicles:12,
    };
    let step = 0;
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 40, 3);
      setVals(Object.fromEntries(Object.entries(targets).map(([k, v]) => [k, Math.round(v * ease)])) as typeof vals);
      if (step >= 40) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);

  const kpiRow1 = [
    { Icon: Car,           iconBg:"#ede9fe", iconFg:"#7c3aed", label:"Active Trips",    value: vals.active                     },
    { Icon: ClipboardList, iconBg:"#dbeafe", iconFg:"#2563eb", label:"Trips Today",     value: vals.today.toLocaleString()     },
    { Icon: CheckCircle,   iconBg:"#d1fae5", iconFg:"#059669", label:"Completed Trips", value: vals.completed.toLocaleString() },
    { Icon: XCircle,       iconBg:"#fee2e2", iconFg:"#dc2626", label:"Cancelled Trips", value: vals.cancelled                  },
  ];
  const kpiRow2 = [
    { Icon: DollarSign, iconBg:"#fef3c7", iconFg:"#d97706", label:"Platform Revenue", value:`$${vals.revenue.toLocaleString()}` },
    { Icon: UserPlus,   iconBg:"#e0e7ff", iconFg:"#4f46e5", label:"New Users (24h)",  value: vals.users                        },
    { Icon: Users,      iconBg:"#fce7f3", iconFg:"#db2777", label:"Total Drivers",    value: vals.drivers                      },
    { Icon: Ticket,     iconBg:"#ffedd5", iconFg:"#ea580c", label:"Support Tickets",  value: vals.tickets                      },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:"0.55rem" }}>

      <h1 className="ts-page-title" style={{ fontSize:"1.25rem", fontWeight:800, flexShrink:0 }}>Platform Overview</h1>

      <div style={{ flexShrink:0 }}>
        <p className="ts-section-label" style={{ marginBottom:"0.3rem" }}>Platform Activity</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.65rem" }}>
          {kpiRow1.map(k => <KpiCard key={k.label} {...k} />)}
        </div>
      </div>

      <div style={{ flexShrink:0 }}>
        <p className="ts-section-label" style={{ marginBottom:"0.3rem" }}>Platform Growth</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.65rem" }}>
          {kpiRow2.map(k => <KpiCard key={k.label} {...k} />)}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", flex:1, minHeight:0 }}>

        {/* Recent Users */}
        <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden" }}>
          <div className="ts-toolbar" style={{ flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
              <Users size={14} color="var(--text-muted)" strokeWidth={2} />
              <p className="ts-page-title" style={{ fontSize:".825rem" }}>Recent Users</p>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
            <table className="ts-table">
              <thead className="ts-thead">
                <tr>
                  <th className="ts-th">User</th>
                  <th className="ts-th">Role</th>
                  <th className="ts-th">Status</th>
                  <th className="ts-th">Trips</th>
                </tr>
              </thead>
              <tbody>
                {pagedUsers.map(u => (
                  <tr key={u.name} className="ts-tr">
                    <td className="ts-td">
                      <div style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
                        <div style={{ width:26, height:26, borderRadius:"50%", overflow:"hidden", background:"#e9d5ff", flexShrink:0 }}>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}`} alt={u.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                        <div>
                          <div className="ts-td-h" style={{ fontSize:".775rem" }}>{u.name}</div>
                          <div className="ts-td-sub" style={{ fontSize:".67rem" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ts-td"><span className={rolePill(u.role)}>{u.role}</span></td>
                    <td className="ts-td"><span className={statusPill(u.status)}>{u.status}</span></td>
                    <td className="ts-td ts-td-h" style={{ color: u.trips === null ? "var(--text-faint)" : "var(--text-h)", fontSize:".775rem" }}>
                      {u.trips ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={userPage} totalPages={totalUserPages} onPrev={() => setUserPage(p => Math.max(1, p-1))} onNext={() => setUserPage(p => Math.min(totalUserPages, p+1))} />
        </div>

        {/* Agency Performance */}
        <AgencyPerformanceCard vals={{
          drivers:          vals.agencyDrivers,
          vehicles:         vals.agencyVehicles,
          onlineDrivers:    vals.onlineDrivers,
          busyDrivers:      vals.busyDrivers,
          availableVehicles:vals.availableVehicles,
        }} />

      </div>
    </div>
  );
}