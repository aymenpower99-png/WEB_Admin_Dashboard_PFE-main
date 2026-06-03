// import type { RevenueEntry, SupportEntry, Vehicle } from ".";

// export const revenueData: RevenueEntry[] = [
//   { day: "Mon", revenue: 14200, rides: 1820 },
//   { day: "Tue", revenue: 16800, rides: 2140 },
//   { day: "Wed", revenue: 21400, rides: 2780 },
//   { day: "Thu", revenue: 18900, rides: 2410 },
//   { day: "Fri", revenue: 22100, rides: 2960 },
//   { day: "Sat", revenue: 28400, rides: 3580 },
//   { day: "Sun", revenue: 31200, rides: 3920 },
// ];

// export const supportData: SupportEntry[] = [
//   { time: "08:00", resolved: 45, pending: 12 },
//   { time: "10:00", resolved: 72, pending: 19 },
//   { time: "12:00", resolved: 58, pending: 8  },
//   { time: "14:00", resolved: 83, pending: 15 },
//   { time: "16:00", resolved: 67, pending: 10 },
//   { time: "18:00", resolved: 91, pending: 6  },
// ];

// export const fleetData: Vehicle[] = [
//   { id: "MOV-4822", status: "ACTIVE",      driver: "Marcus Chen",     location: "Mission District", battery: 82, lat: 0.38, lng: 0.55 },
//   { id: "MOV-9031", status: "EN ROUTE",    driver: "Elena Rodriguez", location: "SOMA",             battery: 45, lat: 0.52, lng: 0.42 },
//   { id: "MOV-2210", status: "MAINTENANCE", driver: null,              location: "Depot North",      battery: 12, lat: 0.22, lng: 0.68 },
//   { id: "MOV-5517", status: "ACTIVE",      driver: "James Park",      location: "Castro",           battery: 94, lat: 0.65, lng: 0.35 },
//   { id: "MOV-3304", status: "EN ROUTE",    driver: "Sofia Diaz",      location: "Tenderloin",       battery: 61, lat: 0.45, lng: 0.58 },
//   { id: "MOV-7729", status: "ACTIVE",      driver: "Amir Hassan",     location: "Nob Hill",         battery: 77, lat: 0.30, lng: 0.45 },
// ];
import type { RevenueEntry, SupportEntry, Vehicle, VehicleStatus } from ".";

const BASE = "/api";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Revenue ─────────────────────────────────────────────────────────────────

export async function fetchRevenueData(days = 7): Promise<RevenueEntry[]> {
  const res = await fetch(`${BASE}/dashboard/revenue-trend?days=${days}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`revenue-trend: ${res.status}`);
  const json = await res.json();
  return (json.series ?? []).map((s: { label: string; revenue: number; rides: number }) => ({
    day:     s.label,
    revenue: s.revenue,
    rides:   s.rides,
  }));
}

// ─── Support ─────────────────────────────────────────────────────────────────

export async function fetchSupportData(): Promise<SupportEntry[]> {
  const res = await fetch(`${BASE}/dashboard/support-resolution`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`support-resolution: ${res.status}`);
  const json = await res.json();
  return (json.series ?? []).map((s: { hour: string; resolved: number; pending: number }) => ({
    time:     s.hour,
    
    resolved: s.resolved,
    pending:  s.pending,
  }));
}

// ─── Fleet ───────────────────────────────────────────────────────────────────

interface APIVehicle {
  make: any;
  model: any;
  id: string;
  status: string;
  driver_id?: string | null;
  license_plate?: string;
  current_location?: string;
  location?: string;
  battery_level?: number;
  lat?: number;
  lng?: number;
}

interface APIDriver {
  id: string;
  user_id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
}
function normalizeVehicleStatus(raw: string): VehicleStatus {
  const s = (raw ?? "").toLowerCase();
  if (s === "approved")  return "ACTIVE";
  if (s === "on_trip")   return "EN ROUTE";
  if (s === "pending" || s === "suspended" || s === "rejected") return "MAINTENANCE";
  return raw.toUpperCase() as VehicleStatus;
}

function pseudoBattery(id: string): number {
  const n = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return 20 + (n % 75);
}

function pseudoCoord(id: string, axis: 0 | 1): number {
  const n = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return axis === 0
    ? Math.round((n * 17) % 100) / 100
    : Math.round((n * 31) % 100) / 100;
}

export async function fetchFleetData(): Promise<Vehicle[]> {
  const [vehiclesRes, driversRes] = await Promise.all([
    fetch(`${BASE}/vehicles`, { headers: getAuthHeaders() }),
    fetch(`${BASE}/drivers`, { headers: getAuthHeaders() }),
  ]);

  if (!vehiclesRes.ok) throw new Error(`vehicles: ${vehiclesRes.status}`);
  if (!driversRes.ok) throw new Error(`drivers: ${driversRes.status}`);

  const vehiclesJson = await vehiclesRes.json();
  const driversJson  = await driversRes.json();

  const vehicles: APIVehicle[] = Array.isArray(vehiclesJson)
    ? vehiclesJson
    : vehiclesJson.vehicles ?? vehiclesJson.data ?? [];
  const drivers: APIDriver[]   = Array.isArray(driversJson)
    ? driversJson
    : driversJson.drivers   ?? driversJson.data  ?? [];

const driversMap: Record<string, string> = Object.fromEntries(
  drivers.map((d) => [
    d.id,
    d.user
      ? `${d.user.first_name ?? ""} ${d.user.last_name ?? ""}`.trim()
      : d.name ?? "Unknown Driver",
  ])
);  

  return vehicles.map((v) => ({
    id:       v.license_plate ?? v.id,
    modele:    v.make && v.model ? `${v.make} ${v.model}` : "Unknown Model",
    status:   normalizeVehicleStatus(v.status),
    driver:   v.driver_id ? (driversMap[v.driver_id] ?? null) : null,
    location: v.current_location ?? v.location ?? "Unknown",
    battery:  v.battery_level ?? pseudoBattery(v.id),
    lat:      v.lat ?? pseudoCoord(v.id, 0),
    lng:      v.lng ?? pseudoCoord(v.id, 1),
  }));
}
// ─── KPI Overview ────────────────────────────────────────────────────────────

export interface KPIData {
  totalRides:       number;
  totalRidesDelta:  number | null;
  revenue:          number;
  revenueDelta:     number | null;
  supportTickets:   number;
  ticketsDelta:     number | null;
  satisfaction:     number;
  satisfactionMax:  number;
}

export async function fetchKPIData(): Promise<KPIData> {
  const res  = await fetch(`${BASE}/dashboard/overview?hours=24`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`overview: ${res.status}`);
  const json = await res.json();
  const k    = json.kpis ?? {};
  return {
    totalRides:      k.total_rides?.value        ?? 0,
    totalRidesDelta: k.total_rides?.change_pct   ?? null,
    revenue:         k.revenue_usd?.value        ?? 0,
    revenueDelta:    k.revenue_usd?.change_pct   ?? null,
    supportTickets:  k.support_tickets?.value    ?? 0,
    ticketsDelta:    k.support_tickets?.change_pct ?? null,
    satisfaction:    k.satisfaction_rate?.value  ?? 0,
    satisfactionMax: k.satisfaction_rate?.out_of ?? 5,
  };
}

// ─── Operational metrics ─────────────────────────────────────────────────────

export interface OperationalData {
  avgTripDuration: number | null;
  activeDrivers:   number | null;
  safetyScore:     number | null;
  utilizationRate: number | null;
}
export async function fetchOperationalData(): Promise<OperationalData> {
  const res  = await fetch(`${BASE}/dashboard/operational`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`operational: ${res.status}`);
  const json = await res.json();
  const op   = json.operational ?? json ?? {};

  const val = (v: any) => (v !== null && v !== undefined && v !== 0) ? v : null;

  return {
    avgTripDuration: val(op.avg_trip_duration?.value),
    activeDrivers:   val(op.active_drivers?.value),
    safetyScore:     val(op.safety_score?.value),
    utilizationRate: val(op.utilization_rate?.value),
  };
}
// export async function fetchOperationalData(): Promise<OperationalData> {
//   const res  = await fetch(`${BASE}/dashboard/operational`);
//   if (!res.ok) throw new Error(`operational: ${res.status}`);
//   const json = await res.json();
//   const op   = json.operational ?? json ?? {};
//   return {
//     avgTripDuration: op.avg_trip_duration?.value ?? op.avg_trip_duration ?? null,
//     activeDrivers:   op.active_drivers?.value    ?? op.active_drivers    ?? null,
//     safetyScore:     op.safety_score?.value      ?? op.safety_score      ?? null,
//     utilizationRate: op.utilization_rate?.value  ?? op.utilization_rate  ?? null,
//   };
// }

// ─── AI Insights ─────────────────────────────────────────────────────────────

export async function fetchAiInsights(): Promise<string[]> {
  try {
    const [overview, op] = await Promise.all([
      fetch(`${BASE}/dashboard/overview?hours=24`, { headers: getAuthHeaders() }).then((r) => r.json()),
      fetch(`${BASE}/dashboard/operational`, { headers: getAuthHeaders() }).then((r) => r.json()),
    ]);
    const insights: string[] = [];

    const sat: number    = overview?.kpis?.satisfaction_rate?.value ?? 0;
    const satMax: number = overview?.kpis?.satisfaction_rate?.out_of ?? 5;
    if (sat > 0)
      insights.push(
        `Satisfaction rate is ${sat}/${satMax} — ${sat / satMax >= 0.85 ? "on track, keep monitoring peak hours" : "below target, review recent low-rated rides"}.`
      );

    const tickets: number = overview?.kpis?.support_tickets?.value ?? 0;
    if (tickets > 0)
      insights.push(`${tickets} support ticket${tickets !== 1 ? "s" : ""} in the last 24 h — check the support queue.`);

    const activeDrivers = op?.operational?.active_drivers?.value ?? op?.active_drivers ?? null;
    if (activeDrivers !== null)
      insights.push(
        `${activeDrivers} driver${activeDrivers !== 1 ? "s" : ""} online — ${activeDrivers < 5 ? "low availability, consider incentives" : "coverage looks healthy"}.`
      );

    const revChange: number | null = overview?.kpis?.revenue_usd?.change_pct ?? null;
    if (revChange !== null)
      insights.push(`Revenue is ${revChange >= 0 ? "up" : "down"} ${Math.abs(revChange).toFixed(1)}% vs previous period.`);

    return insights.length ? insights : ["No live data available — check API connectivity."];
  } catch {
    return ["Unable to load live insights — check API connectivity."];
  }
}

// ─── Drivers (Live Map) ──────────────────────────────────────────────────────

export interface LiveDriver {
  id:          string;
  name:        string;
  avatar:      string;
  status:      "ACTIVE" | "EN ROUTE" | "IDLE" | "OFFLINE";
  lat:         number;
  lng:         number;
  speed:       number;
  battery:     number;
  rating:      number;
  trips:       number;
  eta?:        string;
  destination?: string;
  bearing:     number;
}

function normalizeDriverStatus(raw: string): LiveDriver["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s === "online")   return "ACTIVE";
  if (s === "on_trip")  return "EN ROUTE";
  if (s === "offline")  return "OFFLINE";
  return "IDLE";
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);
}

// Fallback drivers quand l'API ne renvoie pas de coords GPS
// const FALLBACK_DRIVERS: LiveDriver[] = [
//   { id: "D001", name: "Marcus Chen",     avatar: "MC", status: "EN ROUTE", lat: 0.28, lng: 0.22, speed: 42, battery: 82, rating: 4.9, trips: 1204, eta: "4 min",  destination: "Union Square",     bearing: 45  },
//   { id: "D002", name: "Elena Rodriguez", avatar: "ER", status: "ACTIVE",   lat: 0.45, lng: 0.48, speed: 0,  battery: 61, rating: 4.7, trips: 876,                                                   bearing: 120 },
//   { id: "D003", name: "James Park",      avatar: "JP", status: "EN ROUTE", lat: 0.62, lng: 0.35, speed: 38, battery: 94, rating: 4.8, trips: 2341, eta: "8 min",  destination: "SFO Terminal 2",   bearing: 200 },
//   { id: "D004", name: "Sofia Diaz",      avatar: "SD", status: "IDLE",     lat: 0.38, lng: 0.65, speed: 0,  battery: 45, rating: 4.6, trips: 654,                                                   bearing: 90  },
//   { id: "D005", name: "Amir Hassan",     avatar: "AH", status: "EN ROUTE", lat: 0.72, lng: 0.58, speed: 55, battery: 77, rating: 4.9, trips: 3102, eta: "2 min",  destination: "Caltrain Station", bearing: 315 },
//   { id: "D006", name: "Priya Nair",      avatar: "PN", status: "ACTIVE",   lat: 0.18, lng: 0.72, speed: 0,  battery: 33, rating: 4.5, trips: 421,                                                   bearing: 270 },
//   { id: "D007", name: "Carlos Vega",     avatar: "CV", status: "OFFLINE",  lat: 0.55, lng: 0.18, speed: 0,  battery: 12, rating: 4.3, trips: 289,                                                   bearing: 0   },
//   { id: "D008", name: "Yuki Tanaka",     avatar: "YT", status: "EN ROUTE", lat: 0.82, lng: 0.42, speed: 31, battery: 88, rating: 4.8, trips: 1567, eta: "6 min",  destination: "Castro District",  bearing: 160 },
// ];

export async function fetchLiveDrivers(): Promise<LiveDriver[]> {
  try {
    const res  = await fetch(`${BASE}/drivers`, {
      headers: getAuthHeaders(),
    });

    const json = await res.json();
    const raw: any[] = Array.isArray(json)
      ? json
      : json.drivers ?? json.data ?? [];

    return raw.map((d) => {
      const name = d.name ?? [d.first_name, d.last_name].filter(Boolean).join(" ") ?? `Driver ${d.id}`;
      return {
        id:          d.id,
        name,
        avatar:      initials(name),
        status:      normalizeDriverStatus(d.availability_status ?? d.status ?? "offline"),
        lat:         d.lat ?? pseudoCoord(d.id, 0),
        lng:         d.lng ?? pseudoCoord(d.id, 1),
        speed:       d.speed ?? 0,
        battery:     d.battery ?? pseudoBattery(d.id),
        rating:      d.average_rating ?? d.rating ?? 4.5,
        trips:       d.total_trips ?? d.trips ?? 0,
        eta:         d.eta ?? undefined,
        destination: d.destination ?? undefined,
        bearing:     d.bearing ?? Math.random() * 360,
      };
    });
  } catch {
    return [];
  }
}

// ─── Rides stats ─────────────────────────────────────────────────────────────

export interface RidesStats {
  total:          number;
  completed:      number;
  revenue:        number;
  completionRate: number;
}

export async function fetchRidesStats(): Promise<RidesStats> {
  const res  = await fetch(`${BASE}/rides/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`rides/stats: ${res.status}`);
  const json = await res.json();
  return {
    total:          json.total          ?? 0,
    completed:      json.completed      ?? 0,
    revenue:        json.revenue        ?? 0,
    completionRate: json.completion_rate ?? 0,
  };
}

// ─── Top drivers ─────────────────────────────────────────────────────────────

export interface TopDriver {
  id:     string;
  name:   string;
  rating: number;
  trips:  number;
}

export async function fetchTopDrivers(limit = 5): Promise<TopDriver[]> {
  const res  = await fetch(`${BASE}/drivers/top?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`drivers/top: ${res.status}`);
  const json = await res.json();
  const raw: any[] = json.drivers ?? json.data ?? json ?? [];
  return raw.map((d) => ({
    id:     d.id,
    name:   d.name ?? [d.first_name, d.last_name].filter(Boolean).join(" "),
    rating: d.average_rating ?? d.rating ?? 0,
    trips:  d.total_trips    ?? d.trips  ?? 0,
  }));
}

// ─── Driver status breakdown ─────────────────────────────────────────────────

export interface DriverStatusBreakdown {
  online:          number;
  offline:         number;
  on_trip:         number;
  pending:         number;
  setup_required:  number;
}

export async function fetchDriverStatusBreakdown(): Promise<DriverStatusBreakdown> {
  const res  = await fetch(`${BASE}/drivers/status-breakdown`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`drivers/status-breakdown: ${res.status}`);
  const json = await res.json();
  const data = json.breakdown ?? json ?? {};
  return {
    online:         data.online          ?? 0,
    offline:        data.offline         ?? 0,
    on_trip:        data.on_trip         ?? 0,
    pending:        data.pending         ?? 0,
    setup_required: data.setup_required  ?? 0,
  };
}

// ─── Vehicle stats ───────────────────────────────────────────────────────────

export interface VehicleStats {
  approved:  number;
  pending:   number;
  rejected:  number;
  suspended: number;
}

export async function fetchVehicleStats(): Promise<VehicleStats> {
  const res  = await fetch(`${BASE}/vehicles/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`vehicles/stats: ${res.status}`);
  const json = await res.json();
  const data = json.stats ?? json ?? {};
  return {
    approved:  data.Approved  ?? data.approved  ?? 0,
    pending:   data.Pending   ?? data.pending   ?? 0,
    rejected:  data.Rejected  ?? data.rejected  ?? 0,
    suspended: data.Suspended ?? data.suspended ?? 0,
  };
}

// ─── Support tickets ─────────────────────────────────────────────────────────

export interface SupportTicket {
  id:         string;
  status:     string;
  category:   string;
  subject:    string;
  created_at: string;
}

export async function fetchSupportTickets(status?: string): Promise<SupportTicket[]> {
  const url = status ? `${BASE}/support/tickets?status=${status}` : `${BASE}/support/tickets`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`support/tickets: ${res.status}`);
  const json = await res.json();
  // ✅ L'API NestJS retourne directement un tableau, pas { tickets: [] }
  const raw: any[] = Array.isArray(json) ? json : json.tickets ?? json.data ?? [];
  return raw.map((t) => ({
    id:         t.id,
    status:     t.status,
    category:   t.category ?? "other",
    subject:    t.subject  ?? t.title ?? "No subject",
    created_at: t.created_at ?? t.createdAt ?? "",
  }));
}

// ─── Ratings stats ───────────────────────────────────────────────────────────

export interface RatingStats {
  average:      number;
  total:        number;
  distribution: Record<string, number>;
}

export async function fetchRatingStats(): Promise<RatingStats> {
  const res  = await fetch(`${BASE}/ratings/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`ratings/stats: ${res.status}`);
  const json = await res.json();
  return {
    average:      json.average ?? json.satisfaction_rate ?? 0,
    total:        json.total   ?? 0,
    distribution: json.distribution ?? {},
  };
}

// ─── Nav items ───────────────────────────────────────────────────────────────

export const navItems: string[] = [
  "Dashboard",
  "Live Map",
  "AI Insights",
];

export const aiInsights: string[] = [
  "Deploy surge incentives in SOMA district for the next 45 minutes to balance demand.",
  "System predicted a 15% increase in weekend evening bookings.",
  "3 drivers approaching shift end in Mission District — pre-position replacements.",
];