/**
 * AdminDashboard.tsx
 * Platform Overview — updated to match TravelSync design system (TopNav structure).
 */
import { useState, useEffect } from "react";
import {
  Car, ClipboardList, CheckCircle, XCircle,
  DollarSign, UserPlus, Users, Ticket,
  ChevronLeft, ChevronRight,
  MessageSquare,
} from "lucide-react";

/* ─── mock data ──────────────────────────────────────────────────────── */
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

const supportTickets = [
  { user:"Sarah Lee",     seed:"Sarah",  issue:"Payment not processed",         status:"open"        },
  { user:"David Kim",     seed:"David",  issue:"App crashes on trip start",      status:"in-progress" },
  { user:"Lena Müller",   seed:"Lena",   issue:"Account blocked incorrectly",    status:"open"        },
  { user:"Omar Hassan",   seed:"Omar",   issue:"Navigation issues on route",     status:"resolved"    },
  { user:"Carlos Vega",   seed:"Carlos", issue:"Driver rating dispute",          status:"in-progress" },
  { user:"Priya Sharma",  seed:"Priya",  issue:"Promo code not applying",        status:"resolved"    },
  { user:"Lucas Dupont",  seed:"Lucas",  issue:"Cannot upload vehicle docs",     status:"open"        },
  { user:"Aisha Nkrumah", seed:"Aisha",  issue:"Trip fare overcharged",          status:"in-progress" },
  { user:"James Okafor",  seed:"James",  issue:"Payout delay >7 days",          status:"resolved"    },
  { user:"Maria Garcia",  seed:"Maria",  issue:"Dashboard login error",          status:"open"        },
];

const rolePill   = (r: string) => r === "Rider" ? "ts-pill ts-role-rider" : r === "Driver" ? "ts-pill ts-role-driver" : "ts-pill ts-role-admin";
const statusPill = (s: string) => s === "active" ? "ts-pill ts-pill-active" : s === "pending" ? "ts-pill ts-pill-pending" : "ts-pill ts-pill-blocked";

const ticketStatusPill = (s: string) => {
  if (s === "open")        return "ts-pill ts-pill-pending";
  if (s === "in-progress") return "ts-pill ts-role-driver";
  return "ts-pill ts-pill-active";
};

const USERS_PER_PAGE   = 5;
const TICKETS_PER_PAGE = 5;

/* ─── types ──────────────────────────────────────────────────────────── */
interface KpiCardProps {
  Icon: React.ElementType;
  iconBg: string;
  iconFgLight: string;
  iconFgDark: string;
  label: string;
  value: string | number;
  dark: boolean;
}

/* ─── Pagination ─────────────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPrev, onNext }: {
  page: number; totalPages: number; onPrev: () => void; onNext: () => void;
}) {
  const btnBase: React.CSSProperties = {
    display:"flex", alignItems:"center", justifyContent:"center",
    width:24, height:24, borderRadius:"0.375rem",
    border:"1px solid var(--border)",
    fontWeight:500, fontSize:"0.68rem",
    cursor:"pointer", transition:"all .15s",
  };
  const numBtn = (n: number): React.CSSProperties => ({
    ...btnBase,
    background: n === page ? "#7c3aed" : "var(--bg-card)",
    color:       n === page ? "#fff"    : "var(--text-muted)",
    fontWeight:  n === page ? 700       : 500,
  });
  const arrowBtn = (disabled: boolean): React.CSSProperties => ({
    ...btnBase,
    background: disabled ? "transparent" : "var(--bg-card)",
    color:      disabled ? "var(--text-faint)" : "var(--text-muted)",
    cursor:     disabled ? "not-allowed" : "pointer",
  });

  const goTo = (n: number) => {
    if (n < page) onPrev();
    else if (n > page) onNext();
  };

  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0.45rem 0.75rem",
      borderTop:"1px solid var(--border)",
      flexShrink:0,
    }}>
      <span style={{ fontSize:"0.68rem", color:"var(--text-faint)", fontWeight:500 }}>
        Page {page} of {totalPages}
      </span>
      <div style={{ display:"flex", gap:"0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={arrowBtn(page === 1)}>
          <ChevronLeft size={12} strokeWidth={2.5} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => goTo(n)} style={numBtn(n)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={arrowBtn(page === totalPages)}>
          <ChevronRight size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── KpiCard ────────────────────────────────────────────────────────── */
function KpiCard({ Icon, iconBg, iconFgLight, iconFgDark, label, value, dark }: KpiCardProps) {
  // ✅ FIX: use explicit light/dark icon color instead of relying on CSS inheritance
  const iconFg = dark ? iconFgDark : iconFgLight;

  return (
    <div style={{
      background:"var(--bg-card)",
      border:"1px solid var(--border)",
      borderRadius:"0.75rem",
      padding:"0.85rem 1.1rem",
      display:"flex", flexDirection:"column", justifyContent:"space-between",
      position:"relative", minHeight:80,
    }}>
      <div style={{
        position:"absolute", top:"0.85rem", right:"1.1rem",
        width:36, height:36, borderRadius:"50%",
        background:iconBg,
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0,
      }}>
        {/* ✅ FIX: color is always an explicit hex, never a CSS var */}
        <Icon size={16} color={iconFg} strokeWidth={1.75} />
      </div>

      <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", fontWeight:500, paddingRight:44 }}>
        {label}
      </span>
      <span style={{ fontSize:"1.6rem", fontWeight:800, color:"var(--text-h)", lineHeight:1, marginTop:"0.35rem" }}>
        {value}
      </span>
    </div>
  );
}

/* ─── SupportTicketsCard ─────────────────────────────────────────────── */
function SupportTicketsCard({ dark }: { dark: boolean }) {
  const [ticketPage, setTicketPage] = useState(1);
  const totalTicketPages = Math.ceil(supportTickets.length / TICKETS_PER_PAGE);
  const pagedTickets     = supportTickets.slice((ticketPage - 1) * TICKETS_PER_PAGE, ticketPage * TICKETS_PER_PAGE);

  // ✅ FIX: explicit icon color per theme
  const iconColor = dark ? "#9ca3af" : "#6b7280";

  return (
    <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden" }}>

      <div className="ts-toolbar" style={{ flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          {/* ✅ FIX: was color="var(--text-muted)" — SVG color attrs don't always resolve CSS vars */}
          <MessageSquare size={14} color={iconColor} strokeWidth={2} />
          <p className="ts-page-title" style={{ fontSize:"0.825rem" }}>Support Tickets</p>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
        <table className="ts-table">
          <thead className="ts-thead">
            <tr>
              <th className="ts-th">User</th>
              <th className="ts-th">Issue</th>
              <th className="ts-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {pagedTickets.map((t, i) => (
              <tr key={i} className="ts-tr">

                {/* avatar + name */}
                <td className="ts-td">
                  <span className="ts-td-h" style={{ fontSize:"0.775rem" }}>{t.user}</span>
                </td>

                <td className="ts-td">
                  <span className="ts-td-sub" style={{ fontSize:"0.72rem" }}>{t.issue}</span>
                </td>

                <td className="ts-td">
                  <span className={ticketStatusPill(t.status)}>{t.status}</span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={ticketPage}
        totalPages={totalTicketPages}
        onPrev={() => setTicketPage(p => Math.max(1, p - 1))}
        onNext={() => setTicketPage(p => Math.min(totalTicketPages, p + 1))}
      />
    </div>
  );
}

/* ─── main export ────────────────────────────────────────────────────── */
export default function AdminDashboard({ dark = false }: { dark?: boolean }) {
  const [vals, setVals] = useState({
    active:0, today:0, completed:0, cancelled:0,
    revenue:0, users:0, drivers:0, tickets:0,
  });
  const [userPage, setUserPage] = useState(1);

  const totalUserPages = Math.ceil(recentUsers.length / USERS_PER_PAGE);
  const pagedUsers     = recentUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  // ✅ FIX: explicit icon color per theme for toolbar icons
  const iconColor = dark ? "#9ca3af" : "#6b7280";

  /* animated count-up */
  useEffect(() => {
    const targets = {
      active:42, today:1248, completed:1182, cancelled:66,
      revenue:12430, users:128, drivers:87, tickets:17,
    };
    let step = 0;
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / 40, 3);
      setVals(Object.fromEntries(
        Object.entries(targets).map(([k, v]) => [k, Math.round(v * ease)])
      ) as typeof vals);
      if (step >= 40) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);

  /* KPI rows
   * ✅ FIX: each KPI now has iconFgLight + iconFgDark so the icon is
   *         always a legible hex value in both themes.
   */
  const kpiActivity = [
    { Icon: Car,           iconBg: dark ? "rgba(109,40,217,0.25)" : "#ede9fe", iconFgLight:"#7c3aed", iconFgDark:"#c4b5fd", label:"Active Trips",    value: vals.active                     },
    { Icon: ClipboardList, iconBg: dark ? "rgba(37,99,235,0.25)"  : "#dbeafe", iconFgLight:"#2563eb", iconFgDark:"#93c5fd", label:"Trips Today",     value: vals.today.toLocaleString()     },
    { Icon: CheckCircle,   iconBg: dark ? "rgba(5,150,105,0.25)"  : "#d1fae5", iconFgLight:"#059669", iconFgDark:"#34d399", label:"Completed Trips", value: vals.completed.toLocaleString() },
    { Icon: XCircle,       iconBg: dark ? "rgba(220,38,38,0.25)"  : "#fee2e2", iconFgLight:"#dc2626", iconFgDark:"#f87171", label:"Cancelled Trips", value: vals.cancelled                  },
  ];
  const kpiGrowth = [
    { Icon: DollarSign, iconBg: dark ? "rgba(217,119,6,0.25)"  : "#fef3c7", iconFgLight:"#d97706", iconFgDark:"#fbbf24", label:"Platform Revenue", value:`$${vals.revenue.toLocaleString()}` },
    { Icon: UserPlus,   iconBg: dark ? "rgba(79,70,229,0.25)"  : "#e0e7ff", iconFgLight:"#4f46e5", iconFgDark:"#a5b4fc", label:"New Users (24h)",  value: vals.users                        },
    { Icon: Users,      iconBg: dark ? "rgba(219,39,119,0.25)" : "#fce7f3", iconFgLight:"#db2777", iconFgDark:"#f9a8d4", label:"Total Drivers",    value: vals.drivers                      },
    { Icon: Ticket,     iconBg: dark ? "rgba(234,88,12,0.25)"  : "#ffedd5", iconFgLight:"#ea580c", iconFgDark:"#fdba74", label:"Support Tickets",  value: vals.tickets                      },
  ];

  return (
    <>
      <style>{`
        @keyframes ts-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .ts-dashboard-root > * { animation: ts-fade-up 0.22s ease both; }
        .ts-dashboard-root > *:nth-child(1) { animation-delay: 0.00s; }
        .ts-dashboard-root > *:nth-child(2) { animation-delay: 0.04s; }
        .ts-dashboard-root > *:nth-child(3) { animation-delay: 0.08s; }
        .ts-dashboard-root > *:nth-child(4) { animation-delay: 0.12s; }
      `}</style>

      <div
        className="ts-dashboard-root"
        style={{ display:"flex", flexDirection:"column", height:"100%", gap:"0.55rem" }}
      >

        {/* page heading */}
        <h1 className="ts-page-title" style={{ fontSize:"1.25rem", fontWeight:800, flexShrink:0 }}>
          Platform Overview
        </h1>

        {/* KPI: Activity */}
        <div style={{ flexShrink:0 }}>
          <p className="ts-section-label" style={{ marginBottom:"0.3rem" }}>Platform Activity</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.65rem" }}>
            {kpiActivity.map(k => <KpiCard key={k.label} {...k} dark={dark} />)}
          </div>
        </div>

        {/* KPI: Growth */}
        <div style={{ flexShrink:0 }}>
          <p className="ts-section-label" style={{ marginBottom:"0.3rem" }}>Platform Growth</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.65rem" }}>
            {kpiGrowth.map(k => <KpiCard key={k.label} {...k} dark={dark} />)}
          </div>
        </div>

        {/* bottom row: Recent Users + Support Tickets */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", flex:1, minHeight:0 }}>

          {/* Recent Users */}
          <div className="ts-table-wrap" style={{ display:"flex", flexDirection:"column", minHeight:0, overflow:"hidden" }}>

            <div className="ts-toolbar" style={{ flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                {/* ✅ FIX: was color="var(--text-muted)" */}
                <Users size={14} color={iconColor} strokeWidth={2} />
                <p className="ts-page-title" style={{ fontSize:"0.825rem" }}>Recent Users</p>
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
                        <div>
                          <div className="ts-td-h"  style={{ fontSize:"0.775rem" }}>{u.name}</div>
                          <div className="ts-td-sub" style={{ fontSize:"0.67rem"  }}>{u.email}</div>
                        </div>
                      </td>

                      <td className="ts-td"><span className={rolePill(u.role)}>{u.role}</span></td>
                      <td className="ts-td"><span className={statusPill(u.status)}>{u.status}</span></td>

                      <td className="ts-td ts-td-h" style={{
                        color: u.trips === null ? "var(--text-faint)" : "var(--text-h)",
                        fontSize:"0.775rem",
                      }}>
                        {u.trips ?? "—"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={userPage}
              totalPages={totalUserPages}
              onPrev={() => setUserPage(p => Math.max(1, p - 1))}
              onNext={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
            />
          </div>

          {/* Support Tickets */}
          <SupportTicketsCard dark={dark} />

        </div>
      </div>
    </>
  );
}