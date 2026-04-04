import { Users, UserCheck, Clock, ShieldOff, Car } from "lucide-react";
import type { AdminUser } from "../../../api/users";
import "../../travelsync-design-system.css";

function KpiCard({ Icon, iconBg, iconFg, label, value }: {
  Icon: React.ElementType; iconBg: string; iconFg: string; label: string; value: number;
}) {
  return (
    <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"0.75rem", padding:"0.85rem 1.1rem", display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", minHeight:72 }}>
      <div style={{ position:"absolute", top:"0.85rem", right:"1.1rem", width:36, height:36, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon size={16} color={iconFg} strokeWidth={1.75} />
      </div>
      <span style={{ fontSize:"0.68rem", fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", paddingRight:"44px" }}>
        {label}
      </span>
      <span style={{ fontSize:"1.45rem", fontWeight:800, color:iconFg, lineHeight:1, marginTop:"0.35rem" }}>
        {value}
      </span>
    </div>
  );
}

export default function UserKpiCards({ users }: { users: AdminUser[] }) {
  const cards = [
    { Icon: Users,     iconBg:"#ede9fe", iconFg:"#7c3aed", label:"Total Users",   value: users.length },
    { Icon: Car,       iconBg:"#dbeafe", iconFg:"#2563eb", label:"Total Riders",  value: users.filter(u => u.role === "passenger").length },
    { Icon: UserCheck, iconBg:"#fce7f3", iconFg:"#db2777", label:"Total Drivers", value: users.filter(u => u.role === "driver").length },
    { Icon: UserCheck, iconBg:"#d1fae5", iconFg:"#059669", label:"Active",        value: users.filter(u => u.status === "active").length },
    { Icon: Clock,     iconBg:"#fef3c7", iconFg:"#d97706", label:"Pending",       value: users.filter(u => u.status === "pending").length },
    { Icon: ShieldOff, iconBg:"#fee2e2", iconFg:"#dc2626", label:"Blocked",       value: users.filter(u => u.status === "blocked").length },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"0.65rem" }}>
      {cards.map(k => <KpiCard key={k.label} {...k} />)}
    </div>
  );
}