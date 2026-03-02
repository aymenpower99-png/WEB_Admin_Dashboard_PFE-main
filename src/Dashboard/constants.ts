// constants.ts

export interface NavItem {
  icon: string;
  label: string;
  page: string;
  type?: "page" | "layout";
  layouts?: { label: string; icon: string; key: string }[];
}

export const NAV_ITEMS: NavItem[] = [
  { icon: "dashboard",  label: "Dashboard", page: "dashboard", type: "page" },
  { icon: "people",     label: "Users",     page: "users",     type: "page" },
  { icon: "flight",     label: "Trips",     page: "trips",     type: "page" },
  { icon: "payments",   label: "Payments",  page: "payments",  type: "page" },
];

export const NAV_SUPPORT: NavItem[] = [
  { icon: "headset_mic", label: "Help center", page: "help"     },
  { icon: "tune",        label: "Settings",    page: "settings" },
  { icon: "shield",      label: "Security",    page: "security" },
];

export type UserStatus = "active" | "pending" | "blocked";

export interface User {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  trips: number;
}

export const USERS: User[] = [
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
  { name: "Sarah Lee",    email: "sarah.lee@example.com", role: "Rider",  status: "active",  trips: 23 },
  { name: "David Kim",    email: "david.kim@example.com", role: "Driver", status: "pending", trips: 8  },
  { name: "Maria Garcia", email: "m.garcia@example.com",  role: "Admin",  status: "active",  trips: 41 },
  { name: "John Doe",     email: "john.doe@example.com",  role: "Rider",  status: "blocked", trips: 5  },
];

export const STATUS_STYLES: Record<UserStatus, string> = {
  active:  "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  blocked: "bg-red-100 text-red-600",
};

export const SYSTEM_SERVICES = [
  { label: "API",               status: "All systems normal",  ok: true  },
  { label: "Realtime updates",  status: "Operational",         ok: true  },
  { label: "Payment providers", status: "1 provider degraded", ok: false },
];

export const STATS = [
  { title: "Active trips",  value: "42",      tag: "Now",     trend: "+12%", note: "vs last hour", warning: false },
  { title: "Today revenue", value: "$12,430", tag: "USD",     trend: "+8.4%",note: "vs yesterday", warning: false },
  { title: "New users",     value: "128",     tag: "Last 24h",trend: "+5.1%",note: "signup rate",  warning: false },
  { title: "Support load",  value: "17",      tag: "Tickets", trend: "High", note: "+3 pending",   warning: true  },
];