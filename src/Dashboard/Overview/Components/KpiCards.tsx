import {
  Car, ClipboardList, CheckCircle, XCircle,
  DollarSign, UserPlus, Users, Ticket,
} from "lucide-react";

interface KpiCardsProps {
  kpis: {
    activeTrips: number;
    todayTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    revenue: number;
    newUsers: number;
    totalDrivers: number;
    totalTickets: number;
  };
  dark: boolean;
}

interface KpiItem {
  Icon: React.ElementType;
  iconBg: string;
  iconFgLight: string;
  iconFgDark: string;
  label: string;
  value: string | number;
}

export default function KpiCards({ kpis, dark }: KpiCardsProps) {
  const activity: KpiItem[] = [
    { Icon: Car,           iconBg: dark ? "rgba(109,40,217,0.25)" : "#ede9fe", iconFgLight:"#7c3aed", iconFgDark:"#c4b5fd", label:"Active Trips",    value: kpis.activeTrips },
    { Icon: ClipboardList, iconBg: dark ? "rgba(37,99,235,0.25)"  : "#dbeafe", iconFgLight:"#2563eb", iconFgDark:"#93c5fd", label:"Trips Today",     value: kpis.todayTrips.toLocaleString() },
    { Icon: CheckCircle,   iconBg: dark ? "rgba(5,150,105,0.25)"  : "#d1fae5", iconFgLight:"#059669", iconFgDark:"#34d399", label:"Completed Trips", value: kpis.completedTrips.toLocaleString() },
    { Icon: XCircle,       iconBg: dark ? "rgba(220,38,38,0.25)"  : "#fee2e2", iconFgLight:"#dc2626", iconFgDark:"#f87171", label:"Cancelled Trips", value: kpis.cancelledTrips },
  ];
  const growth: KpiItem[] = [
    { Icon: DollarSign, iconBg: dark ? "rgba(217,119,6,0.25)"  : "#fef3c7", iconFgLight:"#d97706", iconFgDark:"#fbbf24", label:"Platform Revenue", value: `$${kpis.revenue.toLocaleString()}` },
    { Icon: UserPlus,   iconBg: dark ? "rgba(79,70,229,0.25)"  : "#e0e7ff", iconFgLight:"#4f46e5", iconFgDark:"#a5b4fc", label:"New Users (24h)",  value: kpis.newUsers },
    { Icon: Users,      iconBg: dark ? "rgba(219,39,119,0.25)" : "#fce7f3", iconFgLight:"#db2777", iconFgDark:"#f9a8d4", label:"Total Drivers",    value: kpis.totalDrivers },
    { Icon: Ticket,     iconBg: dark ? "rgba(234,88,12,0.25)"  : "#ffedd5", iconFgLight:"#ea580c", iconFgDark:"#fdba74", label:"Support Tickets",  value: kpis.totalTickets },
  ];

  return (
    <>
      <div style={{ flexShrink:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.65rem" }}>
          {activity.map(k => <KpiCard key={k.label} {...k} dark={dark} />)}
        </div>
      </div>
      <div style={{ flexShrink:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.65rem" }}>
          {growth.map(k => <KpiCard key={k.label} {...k} dark={dark} />)}
        </div>
      </div>
    </>
  );
}

function KpiCard({ Icon, iconBg, iconFgLight, iconFgDark, label, value, dark }: KpiItem & { dark: boolean }) {
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
