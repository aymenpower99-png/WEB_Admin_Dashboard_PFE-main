import type { DashboardStatus } from "../Components/types";
import { STATUS_PILL, ROLE_PILL } from "../Components/types";

export function StatusBadge({ status }: { status: DashboardStatus }) {
  const cls = STATUS_PILL[status] ?? "ts-pill ts-pill-pending";
  return <span className={cls}>{status.replace(/_/g, " ")}</span>;
}

export function RoleBadge({ role }: { role: string }) {
  const cls = ROLE_PILL[role] ?? "ts-pill ts-role-rider";
  const label =
    role === "passenger"
      ? "Rider"
      : role === "driver"
      ? "Driver"
      : role === "admin"
      ? "Admin"
      : role === "super_admin"
      ? "Super Admin"
      : role;
  return <span className={cls}>{label}</span>;
}
