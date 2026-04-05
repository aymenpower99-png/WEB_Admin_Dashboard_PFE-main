import { Users, UserCheck, Clock, ShieldOff, Car } from "lucide-react";
import type { AdminUser } from "../../../api/users";
import "../../travelsync-design-system.css";

function StatCard({
  label,
  value,
  Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: ".75rem",
        padding: "1.1rem 1.3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minWidth: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: ".78rem",
            color: "var(--text-muted)",
            fontWeight: 500,
            marginBottom: ".3rem",
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
          {label}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "1.65rem",
            fontWeight: 800,
            color: "var(--text-h)",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
      </div>

      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={iconColor} strokeWidth={1.75} />
      </div>
    </div>
  );
}

export default function UserKpiCards({ users }: { users: AdminUser[] }) {
  const totalUsers = users.length;
  const totalRiders = users.filter(u => u.role === "passenger").length;
  const totalDrivers = users.filter(u => u.role === "driver").length;
  const active = users.filter(u => u.status === "active").length;
  const pending = users.filter(u => u.status === "pending").length;
  const blocked = users.filter(u => u.status === "blocked").length;

  return (
    <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap" }}>
      <StatCard label="Total Users"   value={totalUsers}   Icon={Users}     iconBg="var(--driver-bg)"  iconColor="var(--driver-fg)" />
      <StatCard label="Total Riders"  value={totalRiders}  Icon={Car}       iconBg="var(--rider-bg)"   iconColor="var(--rider-fg)"  />
      <StatCard label="Total Drivers" value={totalDrivers} Icon={UserCheck} iconBg="var(--driver-bg)"  iconColor="var(--driver-fg)" />
      <StatCard label="Active"        value={active}       Icon={UserCheck} iconBg="var(--active-bg)"  iconColor="var(--active-fg)" />
      <StatCard label="Pending"       value={pending}      Icon={Clock}     iconBg="var(--pending-bg)" iconColor="var(--pending-fg)" />
      <StatCard label="Blocked"       value={blocked}      Icon={ShieldOff} iconBg="var(--blocked-bg)" iconColor="var(--blocked-fg)" />
    </div>
  );
}