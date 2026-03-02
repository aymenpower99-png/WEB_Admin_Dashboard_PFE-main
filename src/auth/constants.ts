export type UserStatus = "active" | "pending" | "blocked";

export interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
}

export interface Stat {
  title: string;
  value: string;
  tag: string;
  trend: string;
  note: string;
  warning: boolean;
}

export interface User {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  trips: number;
}

export interface SystemService {
  label: string;
  status: string;
  ok: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: "⊞", label: "Dashboard", active: true },
  { icon: "👥", label: "Users" },
  { icon: "🚗", label: "Trips" },
  { icon: "💳", label: "Payments" },
];

export const NAV_SUPPORT: NavItem[] = [
  { icon: "🎧", label: "Help center" },
  { icon: "⚙️", label: "Settings" },
  { icon: "🛡", label: "Security" },
];

export const STATS: Stat[] = [
  { title: "Active trips", value: "42", tag: "Now", trend: "+12%", note: "vs last hour", warning: false },
  { title: "Today revenue", value: "$12,430", tag: "USD", trend: "+8.4%", note: "vs yesterday", warning: false },
  { title: "New users", value: "128", tag: "Last 24h", trend: "+5.1%", note: "signup rate", warning: false },
  { title: "Support load", value: "17", tag: "Tickets", trend: "High", note: "+3 pending", warning: true },
];

export const USERS: User[] = [
  { name: "Sarah Lee", email: "sarah.lee@example.com", role: "Rider", status: "active", trips: 23 },
  { name: "David Kim", email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8 },
  { name: "Maria Garcia", email: "m.garcia@example.com", role: "Admin", status: "active", trips: 41 },
  { name: "John Doe", email: "john.doe@example.com", role: "Rider", status: "blocked", trips: 5 },
];

export const SYSTEM_SERVICES: SystemService[] = [
  { label: "API", status: "All systems normal", ok: true },
  { label: "Realtime updates", status: "Operational", ok: true },
  { label: "Payment providers", status: "1 provider degraded", ok: false },
];

export const STATUS_STYLES: Record<UserStatus, string> = {
  active: "bg-emerald-500 text-white",
  pending: "bg-amber-400 text-gray-900",
  blocked: "bg-red-500 text-white",
};
