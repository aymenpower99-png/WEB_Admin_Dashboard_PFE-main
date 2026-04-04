import type { AdminUser } from "../../../api/users";

interface Props { users: AdminUser[]; }

export default function UserKpiCards({ users }: Props) {
  const total      = users.length;
  const active     = users.filter(u => u.status === "active").length;
  const pending    = users.filter(u => u.status === "pending").length;
  const drivers    = users.filter(u => u.role === "driver").length;
  // Drivers who are active but profile not yet created by admin
  const needsSetup = users.filter(u => u.role === "driver" && u.status === "active" && u.profileComplete === false).length;

  const cards = [
    { label: "Total Users",      value: total,      color: "#7c3aed", bg: "#ede9fe" },
    { label: "Active",           value: active,     color: "#059669", bg: "#d1fae5" },
    { label: "Pending",          value: pending,    color: "#d97706", bg: "#fef3c7" },
    { label: "Drivers",          value: drivers,    color: "#2563eb", bg: "#dbeafe" },
    { label: "Needs Agency Setup", value: needsSetup, color: "#dc2626", bg: "#fee2e2" },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:".65rem" }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: ".75rem", padding: ".85rem 1rem",
          display: "flex", flexDirection: "column", gap: ".3rem",
        }}>
          <span style={{ fontSize: ".72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>
            {c.label}
          </span>
          <span style={{ fontSize: "1.45rem", fontWeight: 800, color: c.color }}>
            {c.value}
          </span>
          {c.label === "Needs Agency Setup" && needsSetup > 0 && (
            <span style={{ fontSize: ".7rem", color: "#dc2626", fontWeight: 600 }}>
              ⚠ Action required
            </span>
          )}
        </div>
      ))}
    </div>
  );
}