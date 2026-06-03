/**
 * AIInsightsPage.tsx – v9  (fixes: missing imports, duplicate helpers, scope/brace errors,
 *                           ETASection inline vs export conflict, unreachable utility fns)
 *
 * Intelligence API  port 8002  →  /api8002
 *   GET /intelligence/overview
 *   GET /revenue/revenue-forecast?days=7
 *   GET /demand/demand-forecast?hours=
 *   GET /anomalies?hours=
 *   GET /models/
 *   GET /models/{name}/promote
 *   GET /intelligence/zones
 *
 * Prediction API   port 8005  →  /api8005
 *   GET  /dashboard/kpis
 *   GET  /predict/demand?hours=
 *   POST /predict/surge
 *   GET  /predict/anomalies?hours=
 *   GET  /intelligence/zones         ← fallback if :8002 fails
 */

import React, { useState, useCallback, useRef } from "react"; // FIX: added useRef
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle,
  Zap, Target, BarChart2, ChevronRight, RefreshCw,
  Cpu, Activity, ArrowUpRight, ArrowDownRight,
  Users, DollarSign, Map, CheckCircle2,
  XCircle, Info, WifiOff, Loader2,
  Clock, Gauge, Navigation,           // FIX: added Navigation (was used but not imported)
} from "lucide-react";

import { C } from "./tokens";
import { CustomTooltip } from "./CustomTooltip";
import { useMLApi, useAutoPost, API2, API5 } from "../hooks/useMLApi";

// ─── Types API ────────────────────────────────────────────────────────────────

interface DashboardKPIs {
  total_rides: number;
  completed_rides: number;
  cancelled_rides: number;
  rides_today: number;
  cancellation_rate_pct: number;
  avg_fare_tnd: number;
  revenue_today_tnd: number;
  revenue_week_tnd: number;
  revenue_total_tnd: number;
  total_drivers: number;
  drivers_online: number;
  drivers_on_trip: number;
  drivers_offline: number;
  avg_driver_rating: number;
  avg_trips_per_driver: number;
  avg_wait_minutes: number;
  avg_trip_duration_min: number;
  active_passengers_today: number;
  active_passengers_week: number;
  avg_passenger_rating: number;
  completion_rate_pct: number;
  realtime: {
    completed_last_hour: number;
    cancelled_last_hour: number;
    active_rides_now: number;
    revenue_last_hour: number;
  };
  top_zones: ZoneKPI[];
  vehicle_breakdown: VehicleBreakdown[];
  trend_7_days: TrendDay[];
  generated_at: string;
}

interface ZoneKPI {
  zone: string;
  zone_id: string;
  total_rides: number;
  revenue: number;
  avg_surge: number;
  unique_drivers: number;
}

interface VehicleBreakdown {
  type: string;
  count: number;
  rides: number;
}

interface TrendDay {
  day: string;
  completed: number;
  cancelled: number;
  revenue: number;
  avg_fare: number;
}

interface OverviewKPI {
  total_revenue_7d: number;
  total_rides_7d: number;
  active_drivers: number;
  avg_rating: number;
  revenue_growth_pct: number;
  rides_growth_pct: number;
  generated_at: string;
}

interface RevenuePoint {
  date: string;
  day_name: string;
  predicted_revenue: number;
  baseline_revenue: number;
  uplift_pct: number;
  is_weekend: boolean;
}
interface RevenueForecast {
  predictions: RevenuePoint[];
  total_predicted: number;
  total_baseline: number;
  total_uplift_pct: number;
  daily_average_hist: number;
  trend_slope: number;
  training_days: number;
  generated_at: string;
}

interface DemandPoint {
  timestamp: string;
  demand: number;
  lower: number;
  upper: number;
  hour?: number;
  period?: string;
}
interface DemandForecast {
  predictions: DemandPoint[];
  metrics: { MAPE: number | null; RMSE: number | null };
  model_version: string;
  generated_at: string;
  summary?: {
    max_demand: number;
    min_demand: number;
    avg_demand: number;
    peak_hours_count: number;
    busiest_hour: number;
  };
}

interface AnomalyItem {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  impact: string;
  action: string;
  ride_id: number;
  driver_id: number;
  detected_at: string;
  resolved: boolean;
}
interface AnomaliesResp {
  anomalies: AnomalyItem[];
  total: number;
  critical_count: number;
  rides_analyzed?: number;
  anomaly_rate?: number;
  thresholds?: Record<string, number>;
  model_version?: string;
  metrics?: Record<string, number>;
  generated_at: string;
}

interface ZoneIntelligence {
  zone: string;
  zone_id: string;
  total_rides_30d: number;
  rides_last_7d: number;
  growth_pct: number;
  trend: string;
  revenue_total: number;
  avg_surge: number;
  avg_wait_min: number;
  unique_drivers: number;
  unique_passengers: number;
  drivers_online_now: number;
  drivers_on_trip: number;
  demand_coverage_ratio: number;
  coverage_status: string;
}
interface ZonesResponse {
  zones: ZoneIntelligence[];
  total_zones: number;
  top_zones: ZoneIntelligence[];
  growing_zones: ZoneIntelligence[];
  under_served: ZoneIntelligence[];
  heatmap: Record<string, Record<string, number>>;
  generated_at: string;
}

interface ModelEntry {
  name: string;
  run_id: string;
  status: string;
  health: "healthy" | "warning" | "critical" | "unknown";
  started: string;
  metrics: Record<string, number>;
  feat_importance: Record<string, number>;
  thresholds: Record<string, [string, number]>;
}
interface ModelsResp {
  cached: boolean;
  data: {
    generated_at: string;
    experiment: string;
    summary: Record<string, number>;
    models: ModelEntry[];
  };
}

interface PromoteDetail {
  metric: string;
  op: string;
  threshold: number;
  actual: number;
  passed: boolean;
}
interface PromoteResp {
  model: string;
  eligible: boolean;
  health: string;
  details: PromoteDetail[];
}

interface PredictSurgeZone {
  zone_id: string;
  current_surge: number;
  recommended_surge: number;
  historical_surge_avg: number;
  demand_score: number;
  supply_score: number;
  demand_supply_ratio: number;
  data_source: string;
  realtime_rides: number;
  realtime_drivers: number;
}
interface PredictSurgeResp {
  zones: PredictSurgeZone[];
  model_version: string;
  generated_at: string;
}

interface ETABody {
  distance_km: number;
  hour_of_day: number;
  pickup_lat: number;
  pickup_lon: number;
  vehicle_type: string;
}

interface ETAResponse {
  predicted_trip_minutes: number;
  avg_wait_minutes: number;
  total_estimated_minutes: number;
  confidence_interval: { lower: number; upper: number };
  real_avg_speed_kmh: number;
  speed_source: string;
  input_distance_km: number;
  hour_of_day: number;
  samples_used: number;
  model_version: string;
  metrics: {
    mae_minutes: number;
    r2: number;
    rmse: number;
    mape: number;
    n_samples: number;
  };
  data_source: string;
}

// ─── Utilitaires (module scope — single definition) ───────────────────────────

// FIX: was defined twice (once at module level, once inside ETASection).
//      Kept here at module scope; removed the duplicate inside ETASection.

const n = (v: unknown, fb = 0): number =>
  v == null || v === "" ? fb : Number(v);

function fmt(v: unknown, d: number, fb = "—"): string {
  const x = n(v);
  return isNaN(x) ? fb : x.toFixed(d);
}

function hourLabel(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function dateLabel(d: string): string {
  try {
    return new Date(d).toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

function normSev(s: string): "HIGH" | "MEDIUM" | "LOW" {
  const u = (s || "").toUpperCase();
  if (u === "CRITICAL" || u === "HIGH") return "HIGH";
  if (u === "MEDIUM" || u === "WARNING") return "MEDIUM";
  return "LOW";
}

function coverageColor(status: string): string {
  switch (status) {
    case "under_served": return C.error;
    case "over_served":  return C.warning;
    default:             return C.success;
  }
}

// ─── Vehicles disponibles ──────────────────────────────────────────────────────

const VEHICLES = ["standard", "premium", "xl", "moto", "eco"] as const;
type VehicleType = (typeof VEHICLES)[number];

// ─── Preset scénarios ──────────────────────────────────────────────────────────

const PRESETS: { label: string; body: ETABody }[] = [
  {
    label: "Centre → Aéroport",
    body: {
      distance_km: 14.5,
      hour_of_day: 8,
      pickup_lat: 36.8065,
      pickup_lon: 10.1815,
      vehicle_type: "standard",
    },
  },
  {
    label: "Courte distance",
    body: {
      distance_km: 2.3,
      hour_of_day: 12,
      pickup_lat: 36.819,
      pickup_lon: 10.1658,
      vehicle_type: "moto",
    },
  },
  {
    label: "Heure de pointe",
    body: {
      distance_km: 7.8,
      hour_of_day: 17,
      pickup_lat: 36.796,
      pickup_lon: 10.189,
      vehicle_type: "standard",
    },
  },
];

// ─── Hook POST ETA ─────────────────────────────────────────────────────────────

function useETA(api5Base: string) {
  const [data, setData]       = useState<ETAResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const abortRef              = useRef<AbortController | null>(null); // FIX: useRef now imported

  const predict = useCallback(async (body: ETABody) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${api5Base}/predict/eta`, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ETAResponse;
      setData(json);
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError")
        setError((e as Error).message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [api5Base]);

  return { data, loading, error, predict };
}

// ─── Atomes UI ────────────────────────────────────────────────────────────────

function ProgressBar({
  value, max, color, dark,
}: {
  value: number; max: number; color: string; dark: boolean;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{
      height: 5, borderRadius: 3, overflow: "hidden",
      background: dark ? C.darkBorder : C.grayE6, flex: 1,
    }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: color }} />
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = normSev(severity);
  const cfg = {
    HIGH:   { bg: "rgba(255,59,48,.12)",  color: C.error,   icon: XCircle },
    MEDIUM: { bg: "rgba(255,149,0,.12)",  color: C.warning, icon: AlertTriangle },
    LOW:    { bg: "rgba(75,159,255,.12)", color: "#4B9FFF", icon: Info },
  } as const;
  const { bg, color, icon: Icon } = cfg[s];
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: bg, color, fontSize: 10, fontWeight: 700 }}
    >
      <Icon size={10} />
      {s}
    </span>
  );
}

function HealthDot({ health }: { health: string }) {
  const color =
    ({
      healthy:  C.success,
      warning:  C.warning,
      critical: C.error,
    } as Record<string, string>)[health] ?? C.gray7B;
  return (
    <span
      style={{
        width: 7, height: 7, borderRadius: "50%",
        background: color, display: "inline-block",
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}

function Skeleton({ h = 16, w = "100%" as number | string }: { h?: number; w?: number | string }) {
  return (
    <div
      style={{
        height: h, width: w, borderRadius: 6,
        background:
          "linear-gradient(90deg,rgba(128,128,128,.1) 25%,rgba(128,128,128,.2) 50%,rgba(128,128,128,.1) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-4 py-3"
      style={{ background: "rgba(255,59,48,.06)", borderColor: "rgba(255,59,48,.25)" }}
    >
      <WifiOff size={16} color={C.error} />
      <span style={{ fontSize: 13, color: C.error, fontWeight: 600 }}>{message}</span>
      <button
        onClick={onRetry}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
        style={{ background: "rgba(255,59,48,.15)", color: C.error, border: "none" }}
      >
        <RefreshCw size={11} /> Réessayer
      </button>
    </div>
  );
}

function Section({
  title, subtitle, icon: Icon, children, dark, action,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  dark: boolean;
  action?: React.ReactNode;
}) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;
  return (
    <div className="rounded-xl border" style={{ background: surface, borderColor: border }}>
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: dark ? C.iconBgDark : C.iconBgLight }}
          >
            <Icon size={15} color={C.primaryPurple} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: text }}>{title}</p>
            {subtitle && (
              <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

function TrendBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold"
      style={{
        background: up ? "rgba(76,175,80,.12)" : "rgba(255,59,48,.12)",
        color: up ? C.success : C.error,
      }}
    >
      {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      {up ? "+" : ""}
      {fmt(pct, 1)}%
    </span>
  );
}

// ─── ETA Section (extracted to its own component, no longer inline) ───────────
// FIX: was simultaneously `export`-ed AND embedded as raw JSX inside OverviewTab,
//      causing a duplicate/conflict. Now it is a plain (non-exported) component
//      used by composition inside OverviewTab. Export it separately if needed.

function ETASection({
  dark,
  api5Base = "/api8005",
}: {
  dark: boolean;
  api5Base?: string;
}) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const [distance, setDistance] = useState(7.5);
  const [hour,     setHour]     = useState(new Date().getHours());
  const [lat,      setLat]      = useState(36.8065);
  const [lon,      setLon]      = useState(10.1815);
  const [vehicle,  setVehicle]  = useState<VehicleType>("standard");

  const { data, loading, error, predict } = useETA(api5Base);

  const handlePreset = useCallback((p: (typeof PRESETS)[number]) => {
    setDistance(p.body.distance_km);
    setHour(p.body.hour_of_day);
    setLat(p.body.pickup_lat);
    setLon(p.body.pickup_lon);
    setVehicle(p.body.vehicle_type as VehicleType);
    void predict(p.body);
  }, [predict]);

  const handleSubmit = useCallback(() => {
    void predict({
      distance_km:  distance,
      hour_of_day:  hour,
      pickup_lat:   lat,
      pickup_lon:   lon,
      vehicle_type: vehicle,
    });
  }, [predict, distance, hour, lat, lon, vehicle]);

  // FIX: fmt / n are now module-level, no duplicate definition here
  const r2Pct   = data ? Math.round((data.metrics.r2   ?? 0) * 100) : 0;
  const mapePct = data ? Math.round((data.metrics.mape ?? 0) * 100) : 0;
  const quality = r2Pct >= 90 ? C.success : r2Pct >= 70 ? C.warning : C.error;

  return (
    <div className="rounded-xl border" style={{ background: surface, borderColor: border }}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: dark ? C.iconBgDark : C.iconBgLight }}
          >
            <Clock size={15} color={C.primaryPurple} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: text }}>ETA Predictor</p>
            <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>
              POST /predict/eta · :8005 · {data?.model_version ?? "eta_estimator v3"}
            </p>
          </div>
        </div>
        {data && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: `${quality}18`, border: `1px solid ${quality}44` }}
          >
            <CheckCircle2 size={11} color={quality} />
            <span style={{ fontSize: 11, color: quality, fontWeight: 600 }}>
              R² {fmt(data.metrics.r2, 3)}
            </span>
          </div>
        )}
      </div>

      <div className="px-4 pb-4" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              disabled={loading}
              style={{
                fontSize: 11, fontWeight: 600, padding: "4px 10px",
                borderRadius: 6, border: `1px solid ${border}`,
                background: "transparent", color: sub, cursor: "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10, padding: "12px", borderRadius: 10,
            background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.025)",
            border: `1px solid ${border}`,
          }}
        >
          {/* Distance */}
          <div>
            <label style={{ fontSize: 10, color: sub, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Distance (km)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="range" min={0.5} max={50} step={0.5}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.primaryPurple, minWidth: 36 }}>
                {distance}
              </span>
            </div>
          </div>

          {/* Hour */}
          <div>
            <label style={{ fontSize: 10, color: sub, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Heure (0–23)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="range" min={0} max={23} step={1}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.primaryPurple, minWidth: 28 }}>
                {String(hour).padStart(2, "0")}h
              </span>
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <label style={{ fontSize: 10, color: sub, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Véhicule
            </label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {VEHICLES.map((v) => (
                <button
                  key={v}
                  onClick={() => setVehicle(v)}
                  style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                    border: `1px solid ${vehicle === v ? C.primaryPurple : border}`,
                    background: vehicle === v ? "rgba(168,85,247,.15)" : "transparent",
                    color: vehicle === v ? C.primaryPurple : sub,
                    cursor: "pointer", textTransform: "capitalize",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Lat */}
          <div>
            <label style={{ fontSize: 10, color: sub, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Pickup Lat
            </label>
            <input
              type="number" step={0.0001} value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              style={{
                width: "100%", fontSize: 11, padding: "5px 8px", borderRadius: 6,
                border: `1px solid ${border}`, background: "transparent", color: text,
              }}
            />
          </div>

          {/* Lon */}
          <div>
            <label style={{ fontSize: 10, color: sub, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Pickup Lon
            </label>
            <input
              type="number" step={0.0001} value={lon}
              onChange={(e) => setLon(Number(e.target.value))}
              style={{
                width: "100%", fontSize: 11, padding: "5px 8px", borderRadius: 6,
                border: `1px solid ${border}`, background: "transparent", color: text,
              }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", padding: "8px 0", borderRadius: 8,
                background: loading
                  ? "rgba(168,85,247,.3)"
                  : `linear-gradient(135deg,${C.primaryPurple},${C.secondaryPurple})`,
                color: "#fff", fontWeight: 700, fontSize: 12,
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              {loading
                ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Calcul…</>
                : <><Zap size={13} /> Prédire ETA</>
              }
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,59,48,.08)", border: "1px solid rgba(255,59,48,.25)",
            }}
          >
            <AlertTriangle size={13} color={C.error} />
            <span style={{ fontSize: 12, color: C.error, fontWeight: 600 }}>{error}</span>
            <button
              onClick={handleSubmit}
              style={{
                marginLeft: "auto", fontSize: 11, color: C.error,
                background: "rgba(255,59,48,.15)", border: "none",
                padding: "3px 8px", borderRadius: 5, cursor: "pointer", fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <RefreshCw size={10} /> Retry
            </button>
          </div>
        )}

        {/* Result */}
        {data && !loading && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {/* Trip */}
              <div style={{
                borderRadius: 10, padding: "12px 14px",
                background: dark ? "rgba(168,85,247,.1)" : "rgba(168,85,247,.07)",
                border: "1px solid rgba(168,85,247,.25)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Navigation size={12} color={C.primaryPurple} /> {/* FIX: now properly imported */}
                  <span style={{ fontSize: 10, color: C.primaryPurple, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Trajet
                  </span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 800, color: C.primaryPurple, letterSpacing: "-1px", margin: 0 }}>
                  {fmt(data.predicted_trip_minutes, 1)}
                  <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 3 }}>min</span>
                </p>
                <p style={{ fontSize: 10, color: sub, marginTop: 3 }}>
                  IC [{fmt(data.confidence_interval.lower, 1)} – {fmt(data.confidence_interval.upper, 1)}] min
                </p>
              </div>

              {/* Wait */}
              <div style={{
                borderRadius: 10, padding: "12px 14px",
                background: dark ? "rgba(255,149,0,.08)" : "rgba(255,149,0,.06)",
                border: "1px solid rgba(255,149,0,.25)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Clock size={12} color={C.warning} />
                  <span style={{ fontSize: 10, color: C.warning, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Attente
                  </span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 800, color: C.warning, letterSpacing: "-1px", margin: 0 }}>
                  {fmt(data.avg_wait_minutes, 1)}
                  <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 3 }}>min</span>
                </p>
                <p style={{ fontSize: 10, color: sub, marginTop: 3 }}>Attente moyenne chauffeur</p>
              </div>

              {/* Total */}
              <div style={{
                borderRadius: 10, padding: "12px 14px",
                background: dark ? "rgba(76,175,80,.08)" : "rgba(76,175,80,.06)",
                border: "1px solid rgba(76,175,80,.25)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Target size={12} color={C.success} />
                  <span style={{ fontSize: 10, color: C.success, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Total estimé
                  </span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 800, color: C.success, letterSpacing: "-1px", margin: 0 }}>
                  {fmt(data.total_estimated_minutes, 1)}
                  <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 3 }}>min</span>
                </p>
                <p style={{ fontSize: 10, color: sub, marginTop: 3 }}>Trajet + attente</p>
              </div>
            </div>

            {/* Speed row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
              padding: "8px 12px", borderRadius: 8,
              background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.025)",
              border: `1px solid ${border}`,
            }}>
              <Gauge size={13} color={C.primaryPurple} />
              <span style={{ fontSize: 12, color: text, fontWeight: 600 }}>
                {fmt(data.real_avg_speed_kmh, 1)} km/h
              </span>
              <span style={{ fontSize: 11, color: sub }}>vitesse réelle</span>
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 4,
                background: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)", color: sub,
              }}>
                {data.speed_source}
              </span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: sub }}>
                {data.samples_used} échantillons · {data.data_source}
              </span>
            </div>

            {/* Model quality */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <p style={{ fontSize: 10, color: sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Qualité du modèle — {data.metrics.n_samples} samples
              </p>
              {[
                {
                  label: "R² Score",
                  value: `${fmt(data.metrics.r2, 4)}`,
                  pct: r2Pct,
                  color: quality,
                },
                {
                  label: "MAE",
                  value: `${fmt(data.metrics.mae_minutes, 4)} min`,
                  pct: Math.max(0, 100 - Math.round((data.metrics.mae_minutes ?? 0) * 20)),
                  color: (data.metrics.mae_minutes ?? 0) < 2 ? C.success : C.warning,
                },
                {
                  label: "RMSE",
                  value: `${fmt(data.metrics.rmse, 4)} min`,
                  pct: Math.max(0, 100 - Math.round((data.metrics.rmse ?? 0) * 15)),
                  color: (data.metrics.rmse ?? 0) < 3 ? C.success : C.warning,
                },
                {
                  label: "MAPE",
                  value: `${fmt(mapePct, 2)}%`,
                  pct: Math.max(0, 100 - mapePct),
                  color: mapePct < 5 ? C.success : mapePct < 15 ? C.warning : C.error,
                },
              ].map(({ label, value, pct, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: sub, minWidth: 60 }}>{label}</span>
                  <ProgressBar value={pct} max={100} color={color} dark={dark} />
                  <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 70, textAlign: "right" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ChevronRight size={11} color={sub} />
              <span style={{ fontSize: 10, color: sub }}>
                {data.model_version} · dist {data.input_distance_km} km · h{data.hour_of_day}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Onglet : Overview ────────────────────────────────────────────────────────

function OverviewTab({ dark }: { dark: boolean }) {
  const surface   = dark ? C.darkSurface  : C.lightSurface;
  const border    = dark ? C.darkBorder   : C.lightBorder;
  const text      = dark ? C.darkText     : C.lightText;
  const sub       = dark ? C.gray7B       : C.lightSubtext;
  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B       : C.lightSubtext;

  const { data: kpis,    loading: lKpis, error: eKpis, refetch: rKpis } =
    useMLApi<DashboardKPIs>(API5("/dashboard/kpis"), { refreshInterval: 30_000 });

  const { data: overview, error: eOvw, refetch: rOvw } =
    useMLApi<OverviewKPI>(API2("/intelligence/overview"), { refreshInterval: 30_000 });

  const { data: revData, loading: lRev, error: eRev, refetch: rRev } =
    useMLApi<RevenueForecast>(API2("/revenue/revenue-forecast?days=7"));

  const { data: demData, loading: lDem, error: eDem, refetch: rDem } =
    useMLApi<DemandForecast>(API2("/demand/demand-forecast?hours=24"));

  // Zones dual-source (:8002 primary, :8005 fallback)
  const { data: z8002, loading: lZ8002, error: eZ8002, refetch: rZ8002 } =
    useMLApi<ZonesResponse>(API2("/intelligence/zones"), { refreshInterval: 60_000 });

  const { data: z8005, loading: lZ8005, error: eZ8005, refetch: rZ8005 } =
    useMLApi<ZonesResponse>(API5("/intelligence/zones"), { refreshInterval: 60_000 });

  const zonesData = z8002 ?? z8005;
  const lZones    = lZ8002 && lZ8005;
  const eZones    = !z8002 && !z8005 && eZ8002 && eZ8005 ? eZ8005 : null;

  // FIX: stable refetch callback — deps listed correctly
  const rZones = useCallback(() => {
    rZ8002();
    rZ8005();
  }, [rZ8002, rZ8005]);

  const dynamicSurgeBody = zonesData?.zones?.length
    ? {
        zones: zonesData.zones.map((z) => ({
          zone_id: z.zone_id,
          demand:  z.total_rides_30d || 0,
          supply:  z.unique_drivers  || 0,
        })),
      }
    : { zones: [{ zone_id: "default", demand: 0, supply: 0 }] };

  const { error: eSurge, refetch: rSurge } =
    useAutoPost<PredictSurgeResp>(API5("/predict/surge"), dynamicSurgeBody, {
      refreshInterval: 60_000,
    });

  const top3Zones = (kpis?.top_zones ?? []).slice(0, 3);

  const trendChartData = (kpis?.trend_7_days ?? []).map((d) => ({
    day:       dateLabel(d.day),
    completed: d.completed,
    cancelled: d.cancelled,
    revenue:   d.revenue,
  }));

  const revenueChartData = (revData?.predictions ?? []).map((p) => ({
    week:      dateLabel(p.date),
    day:       p.day_name,
    baseline:  p.baseline_revenue,
    optimized: p.predicted_revenue,
    uplift:    p.uplift_pct,
    weekend:   p.is_weekend,
  }));

  const demandChartData = (demData?.predictions ?? []).slice(0, 12).map((p) => ({
    hour:   hourLabel(p.timestamp),
    demand: p.demand,
    lower:  p.lower,
    upper:  p.upper,
  }));

  const vehicleData = (kpis?.vehicle_breakdown ?? [])
    .filter((v) => v.rides > 0)
    .sort((a, b) => b.rides - a.rides);

  const hasKpis  = !!kpis;
  const kpiCards = hasKpis
    ? [
        {
          label: "Revenue total",
          value: `${(n(kpis.revenue_total_tnd) / 1000).toFixed(1)}k TND`,
          sub2:  `Aujourd'hui: ${n(kpis.revenue_today_tnd).toFixed(1)} TND`,
          trend: overview?.revenue_growth_pct ?? null,
          up:    (overview?.revenue_growth_pct ?? 0) >= 0,
          icon:  DollarSign,
          color: C.success,
        },
        {
          label: "Courses totales",
          value: String(kpis.total_rides),
          sub2:  `Taux completion: ${n(kpis.completion_rate_pct).toFixed(1)}%`,
          trend: overview?.rides_growth_pct ?? null,
          up:    (overview?.rides_growth_pct ?? 0) >= 0,
          icon:  Target,
          color: C.primaryPurple,
        },
        {
          label: "Chauffeurs online",
          value: `${kpis.drivers_online} / ${kpis.total_drivers}`,
          sub2:  `En course: ${kpis.drivers_on_trip}`,
          trend: null,
          up:    true,
          icon:  Users,
          color: kpis.drivers_online > 0 ? C.success : C.warning,
        },
        {
          label: "Note chauffeur",
          value: `${fmt(kpis.avg_driver_rating, 1)} ★`,
          sub2:  `Passager: ${fmt(kpis.avg_passenger_rating, 2)} ★`,
          trend: null,
          up:    true,
          icon:  Activity,
          color: n(kpis.avg_driver_rating) >= 4 ? C.success : C.warning,
        },
      ]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {eKpis  && <ErrorBanner message={`Dashboard KPIs (:8005): ${eKpis}`}  onRetry={rKpis} />}
      {eOvw   && <ErrorBanner message={`Overview (:8002): ${eOvw}`}          onRetry={rOvw} />}
      {eRev   && <ErrorBanner message={`Revenue (:8002): ${eRev}`}           onRetry={rRev} />}
      {eDem   && <ErrorBanner message={`Demand (:8002): ${eDem}`}            onRetry={rDem} />}
      {eZones && <ErrorBanner message={`Zones (:8002+:8005): ${eZones}`}     onRetry={rZones} />}
      {eSurge && <ErrorBanner message={`Surge (:8005): ${eSurge}`}           onRetry={rSurge} />}

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {lKpis
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-4"
                style={{ background: surface, borderColor: border }}>
                <Skeleton h={12} w={80} /><br />
                <Skeleton h={28} w={60} /><br />
                <Skeleton h={10} w={100} />
              </div>
            ))
          : kpiCards.map((c) => (
              <div key={c.label} className="rounded-xl border p-4"
                style={{ background: surface, borderColor: border }}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: dark ? C.iconBgDark : C.iconBgLight }}
                  >
                    <c.icon size={13} color={C.primaryPurple} />
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: sub,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    {c.label}
                  </span>
                  {c.trend !== null && (
                    <span className="ml-auto"><TrendBadge pct={c.trend} /></span>
                  )}
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: c.color, letterSpacing: "-0.5px" }}>
                  {c.value}
                </p>
                <p style={{ fontSize: 11, color: sub, marginTop: 2 }}>{c.sub2}</p>
              </div>
            ))}
      </div>

      {/* Real-time stats bar */}
      {kpis && (
        <div
          className="rounded-xl border px-4 py-3 flex items-center gap-6 flex-wrap"
          style={{ background: surface, borderColor: border }}
        >
          <div className="flex items-center gap-2">
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: C.success, boxShadow: `0 0 6px ${C.success}`, display: "inline-block",
            }} />
            <span style={{ fontSize: 12, color: sub }}>Courses actives</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.success }}>
              {kpis.realtime.active_rides_now}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: sub }}>Complétées /h</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: text }}>
              {kpis.realtime.completed_last_hour}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: sub }}>Annulées /h</span>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: kpis.realtime.cancelled_last_hour > 0 ? C.warning : text,
            }}>
              {kpis.realtime.cancelled_last_hour}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: sub }}>Revenue /h</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: text }}>
              {n(kpis.realtime.revenue_last_hour).toFixed(1)} TND
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span style={{ fontSize: 12, color: sub }}>Annulation</span>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: n(kpis.cancellation_rate_pct) > 20 ? C.error : C.warning,
            }}>
              {fmt(kpis.cancellation_rate_pct, 1)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: sub }}>Fare moyen</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: text }}>
              {fmt(kpis.avg_fare_tnd, 2)} TND
            </span>
          </div>
        </div>
      )}

      {/* Revenue forecast + Demand */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Section
          dark={dark}
          title="Prévision de Revenue (7j)"
          subtitle={
            revData
              ? `Baseline: ${n(revData.daily_average_hist).toFixed(0)} TND/j · Prédit total: ${(n(revData.total_predicted) / 1000).toFixed(1)}k TND · Uplift: +${fmt(revData.total_uplift_pct, 1)}%`
              : "Chargement…"
          }
          icon={TrendingUp}
        >
          {lRev ? (
            <Skeleton h={210} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.gray7B}        stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.gray7B}        stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="week" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                  <Area type="monotone" dataKey="baseline"  name="Baseline"  stroke={C.gray7B}        strokeWidth={2}   fill="url(#baseGrad)" strokeDasharray="4 2" />
                  <Area type="monotone" dataKey="optimized" name="ML Prédit" stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#optGrad)"  dot={{ fill: C.primaryPurple, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {[
                  { label: "Baseline",  color: C.gray7B },
                  { label: "ML Prédit", color: C.primaryPurple },
                ].map(({ label, color }) => (
                  <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 11, color: sub }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </span>
                ))}
                {revData && (
                  <span className="ml-auto" style={{
                    fontSize: 12, fontWeight: 700,
                    color: revData.total_uplift_pct >= 0 ? C.success : C.error,
                  }}>
                    {revData.total_uplift_pct >= 0 ? "+" : ""}
                    {fmt(revData.total_uplift_pct, 1)}% uplift total
                  </span>
                )}
              </div>
              {revData && (
                <p style={{ fontSize: 10, color: sub, marginTop: 4 }}>
                  {revData.training_days} jours d'entraînement · slope {fmt(revData.trend_slope, 2)} TND/j
                </p>
              )}
            </>
          )}
        </Section>

        <Section
          dark={dark}
          title="Demande (12 prochaines h)"
          subtitle={
            demData
              ? `${demData.model_version}${demData.summary ? ` · Pic h${demData.summary.busiest_hour}: ${demData.summary.max_demand} courses` : ""}`
              : "Chargement…"
          }
          icon={Activity}
        >
          {lDem ? (
            <Skeleton h={210} />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={demandChartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="demGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="hour"  tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Area type="monotone" dataKey="upper"  name="IC haut" stroke="none" fill="rgba(168,85,247,.06)" />
                <Area type="monotone" dataKey="lower"  name="IC bas"  stroke="none" fill={dark ? "#0B0B0F" : "#F4F4F8"} />
                <Area type="monotone" dataKey="demand" name="Demande" stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#demGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Section>
      </div>

      {/* Top 3 Zones + ETA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Section
          dark={dark}
          title="Top 3 Zones"
          subtitle={
            kpis
              ? `Source: dashboard KPIs · ${kpis.generated_at ? new Date(kpis.generated_at).toLocaleTimeString("fr-FR") : ""}`
              : "Chargement…"
          }
          icon={Map}
        >
          {lKpis ? (
            <Skeleton h={120} />
          ) : top3Zones.length === 0 ? (
            <p style={{ fontSize: 12, color: sub, padding: "8px 0" }}>Aucune zone disponible</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {top3Zones.map((z, i) => {
                const maxRev     = Math.max(...top3Zones.map((x) => x.revenue));
                const pct        = maxRev > 0 ? Math.round((z.revenue / maxRev) * 100) : 0;
                const rankColors = [C.warning, C.gray7B, "#b87333"];
                return (
                  <div
                    key={z.zone_id}
                    className="rounded-lg px-3 py-2.5"
                    style={{
                      background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
                      border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ fontSize: 11, fontWeight: 700, color: rankColors[i] ?? C.gray7B, minWidth: 18 }}>
                        #{i + 1}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: text, flex: 1 }}>{z.zone}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.success }}>
                        {n(z.revenue).toFixed(1)} TND
                      </span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: C.primaryPurple }} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span style={{ fontSize: 10, color: sub }}>{z.total_rides} courses</span>
                      <span style={{ fontSize: 10, color: sub }}>Surge ×{n(z.avg_surge).toFixed(2)}</span>
                      <span style={{ fontSize: 10, color: sub }}>{z.unique_drivers} chauffeurs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* FIX: ETASection used as a component (not as inline JSX blob) */}
        <ETASection dark={dark} />
      </div>

      {/* Trend 7 days */}
      {trendChartData.length > 0 && (
        <Section dark={dark} title="Tendance 7 derniers jours" subtitle="Courses complétées vs annulées + revenue" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trendChartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip dark={dark} />} />
              <Bar dataKey="completed" name="Complétées" fill={C.success} radius={[3, 3, 0, 0]} />
              <Bar dataKey="cancelled" name="Annulées"   fill={C.error}   radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Zone Intelligence */}
      {!lZones && zonesData && (
        <Section
          dark={dark}
          title="Intelligence Zones"
          subtitle={`${zonesData.total_zones} zones actives · données 30j${!z8002 && z8005 ? " · source :8005" : ""}`}
          icon={Map}
          action={
            <button
              onClick={rZones}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(168,85,247,.1)", color: C.primaryPurple, border: "1px solid rgba(168,85,247,.2)" }}
            >
              <RefreshCw size={11} /> Actualiser
            </button>
          }
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(zonesData.zones.length, 3)},1fr)`,
            gap: 12,
          }}>
            {zonesData.zones.slice(0, 3).map((z) => {
              const cc = coverageColor(z.coverage_status);
              return (
                <div key={z.zone_id} className="rounded-xl border p-3"
                  style={{ background: surface, borderColor: border }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{z.zone}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: cc,
                      background: `${cc}18`, padding: "2px 6px", borderRadius: 4,
                    }}>
                      {z.coverage_status.replace("_", " ")}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {[
                      { label: "Revenue 30j",       value: `${n(z.revenue_total).toFixed(1)} TND` },
                      { label: "Courses 30j",        value: String(z.total_rides_30d) },
                      { label: "Surge moyen",        value: `×${n(z.avg_surge).toFixed(2)}` },
                      { label: "Chauffeurs online",  value: String(z.drivers_online_now) },
                      { label: "En course",          value: String(z.drivers_on_trip) },
                      { label: "Passagers uniques",  value: String(z.unique_passengers) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span style={{ fontSize: 11, color: sub }}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: text }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  {zonesData.heatmap[z.zone] && (
                    <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${border}` }}>
                      <p style={{ fontSize: 10, color: sub, marginBottom: 4 }}>Heures actives</p>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(zonesData.heatmap[z.zone]).map(([h]) => (
                          <span key={h} style={{
                            fontSize: 10, fontWeight: 600, color: C.primaryPurple,
                            background: "rgba(168,85,247,.12)", padding: "1px 5px", borderRadius: 3,
                          }}>
                            {h}h
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Vehicle breakdown */}
      {vehicleData.length > 0 && (
        <Section dark={dark} title="Véhicules actifs" subtitle="Breakdown par type" icon={Activity}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8 }}>
            {vehicleData.map((v) => (
              <div key={v.type} className="rounded-lg border p-3 text-center"
                style={{ background: surface, borderColor: border }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: C.primaryPurple }}>{v.rides}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: text, marginTop: 2 }}>{v.type}</p>
                <p style={{ fontSize: 10, color: sub }}>{v.count} véh.</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Onglet : Demand Forecast ─────────────────────────────────────────────────

function ForecastTab({ dark }: { dark: boolean }) {
  const sub       = dark ? C.gray7B      : C.lightSubtext;
  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B      : C.lightSubtext;
  const surface   = dark ? C.darkSurface : C.lightSurface;
  const border    = dark ? C.darkBorder  : C.lightBorder;

  const [hours, setHours] = useState(24);

  const { data: d8002, loading: l8002, error: e8002, refetch: r8002 } =
    useMLApi<DemandForecast>(API2(`/demand/demand-forecast?hours=${hours}`));

  const { data: d8005, loading: l8005, error: e8005, refetch: r8005 } =
    useMLApi<DemandForecast>(API5(`/predict/demand?hours=${hours}`));

  const raw     = d8002?.predictions ?? d8005?.predictions ?? [];
  const metrics = d8002?.metrics     ?? d8005?.metrics;
  const ver     = d8002?.model_version ?? d8005?.model_version ?? "—";
  const summary = (d8002 as DemandForecast & { summary?: DemandForecast["summary"] })?.summary
    ?? (d8005 as DemandForecast & { summary?: DemandForecast["summary"] })?.summary;

  const chartData = raw.map((p) => ({
    hour:   hourLabel(p.timestamp),
    demand: p.demand,
    lower:  p.lower,
    upper:  p.upper,
    period: p.period ?? "",
  }));

  const peakDemand = raw.length ? Math.max(...raw.map((p) => p.demand)) : 0;
  const avgDemand  = raw.length
    ? Math.round(raw.reduce((a, p) => a + p.demand, 0) / raw.length)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {e8002 && <ErrorBanner message={`Intelligence API (8002) : ${e8002}`} onRetry={r8002} />}
      {e8005 && <ErrorBanner message={`Prediction API (8005) : ${e8005}`}   onRetry={r8005} />}

      {/* Horizon selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ fontSize: 12, color: sub }}>Horizon :</span>
        {[6, 12, 24, 48, 72].map((h) => (
          <button key={h} onClick={() => setHours(h)}
            className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: hours === h
                ? `linear-gradient(135deg,${C.primaryPurple},${C.secondaryPurple})`
                : "transparent",
              color:  hours === h ? "#fff" : sub,
              border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
            }}>
            {h}h
          </button>
        ))}
        {(l8002 || l8005) && <Loader2 size={14} color={C.primaryPurple} className="animate-spin ml-auto" />}
        {d8005 && !d8002 && (
          <span style={{ fontSize: 10, color: C.warning, background: "rgba(255,149,0,.1)", padding: "2px 6px", borderRadius: 4 }}>
            fallback :8005
          </span>
        )}
      </div>

      {/* Main chart */}
      <Section
        dark={dark}
        title="Prévision de demande"
        subtitle={
          metrics
            ? `${ver}${metrics.MAPE != null ? ` · MAPE ${metrics.MAPE}%` : ""}${metrics.RMSE != null ? ` · RMSE ${metrics.RMSE}` : ""}${summary ? ` · Pic: ${summary.max_demand} à h${summary.busiest_hour}` : ""}`
            : "Chargement…"
        }
        icon={TrendingUp}
        action={
          metrics && metrics.MAPE != null ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: "rgba(76,175,80,.1)", border: `1px solid ${C.success}33` }}>
              <CheckCircle2 size={11} color={C.success} />
              <span style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>MAPE {metrics.MAPE}%</span>
            </div>
          ) : undefined
        }
      >
        {l8002 && l8005 ? (
          <Skeleton h={280} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="confBand2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="predGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false}
                label={{ value: "Courses", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 10, dy: 40 }} />
              <Tooltip content={<CustomTooltip dark={dark} />} />
              <Area type="monotone" dataKey="upper"  name="IC haut" stroke="none" fill="url(#confBand2)" />
              <Area type="monotone" dataKey="lower"  name="IC bas"  stroke="none" fill={dark ? "#0B0B0F" : "#F4F4F8"} />
              <Area type="monotone" dataKey="demand" name="Demande" stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#predGrad2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Section>

      {/* Stats */}
      {!l8002 && !l8005 && raw.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { label: "Pic de demande", value: String(peakDemand), color: C.error },
            { label: "Demande moy.",   value: String(avgDemand),  color: C.primaryPurple },
            { label: "MAPE",           value: metrics?.MAPE != null ? `${metrics.MAPE}%` : "—", color: C.success },
            { label: "Horizon",        value: `${hours}h`, color: C.primaryPurple },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-4"
              style={{ background: surface, borderColor: border }}>
              <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                {label}
              </p>
              <p style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      {!l8002 && !l8005 && raw.length > 0 && (
        <Section dark={dark} title="Demande heure par heure" subtitle="Volume de courses prédit" icon={BarChart2}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip dark={dark} />} />
              <Bar dataKey="demand" name="Demande" fill={C.primaryPurple} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 10, color: sub, marginTop: 8, textAlign: "right" }}>
            {d8002 ? ":8002 Intelligence API" : ":8005 Prediction API"} · {ver}
          </p>
        </Section>
      )}
    </div>
  );
}

// ─── Onglet : Anomalies ───────────────────────────────────────────────────────

function AnomaliesTab({ dark }: { dark: boolean }) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const [hours,  setHours]  = useState(24);
  const [source, setSource] = useState<"8002" | "8005">("8005");

  const { data: data8002, loading: l8002, error: e8002, refetch: r8002 } =
    useMLApi<AnomaliesResp>(API2(`/anomalies?hours=${hours}`), { refreshInterval: 30_000 });

  const { data: data8005, loading: l8005, error: e8005, refetch: r8005 } =
    useMLApi<AnomaliesResp>(API5(`/predict/anomalies?hours=${hours}`), { refreshInterval: 30_000 });

  const data    = source === "8002" ? data8002 : data8005;
  const loading = source === "8002" ? l8002    : l8005;
  const error   = source === "8002" ? e8002    : e8005;
  const refetch = source === "8002" ? r8002    : r8005;

  const anomalies = data?.anomalies ?? [];
  const critCount = data?.critical_count ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Status banner */}
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3 flex-wrap"
        style={{
          background:  critCount > 0 ? "rgba(255,59,48,.06)" : "rgba(76,175,80,.06)",
          borderColor: critCount > 0 ? "rgba(255,59,48,.25)" : `${C.success}44`,
        }}
      >
        {critCount > 0
          ? <AlertTriangle size={16} color={C.error} />
          : <CheckCircle2  size={16} color={C.success} />}
        <span style={{ fontSize: 13, fontWeight: 600, color: critCount > 0 ? C.error : C.success }}>
          {loading
            ? "Chargement…"
            : critCount > 0
            ? `${critCount} anomalie(s) critique(s)`
            : `Aucune anomalie critique · total ${data?.total ?? 0}`}
        </span>
        {data?.rides_analyzed != null && (
          <span style={{ fontSize: 11, color: sub }}>{data.rides_analyzed} courses analysées</span>
        )}
        {data?.model_version && (
          <span style={{
            fontSize: 10, color: sub,
            background: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
            padding: "1px 6px", borderRadius: 3,
          }}>
            {data.model_version}
          </span>
        )}
      </div>

      {error && <ErrorBanner message={`Anomalies API :${source} : ${error}`} onRetry={refetch} />}

      {/* Controls */}
      <div className="flex gap-2 items-center flex-wrap">
        <span style={{ fontSize: 12, color: sub }}>Source :</span>
        {(["8002", "8005"] as const).map((s) => (
          <button key={s} onClick={() => setSource(s)}
            className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: source === s
                ? `linear-gradient(135deg,${C.primaryPurple},${C.secondaryPurple})`
                : "transparent",
              color:  source === s ? "#fff" : sub,
              border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
            }}>
            :{s}
          </button>
        ))}
        <span style={{ fontSize: 12, color: sub, marginLeft: 8 }}>Fenêtre :</span>
        {[6, 12, 24, 48].map((h) => (
          <button key={h} onClick={() => setHours(h)}
            className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: hours === h
                ? `linear-gradient(135deg,${C.primaryPurple},${C.secondaryPurple})`
                : "transparent",
              color:  hours === h ? "#fff" : sub,
              border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
            }}>
            {h}h
          </button>
        ))}
        {loading && <Loader2 size={14} color={C.primaryPurple} className="animate-spin ml-1 self-center" />}
      </div>

      {/* Thresholds */}
      {data?.thresholds && Object.keys(data.thresholds).length > 0 && (
        <div className="rounded-xl border px-4 py-3 flex gap-4 flex-wrap"
          style={{ background: surface, borderColor: border }}>
          <span style={{ fontSize: 11, color: sub, fontWeight: 600 }}>Seuils ML :</span>
          {Object.entries(data.thresholds).map(([k, v]) => (
            <span key={k} style={{ fontSize: 11, color: sub }}>
              <span style={{ color: text, fontWeight: 600 }}>{k}</span> = {n(v).toFixed(3)}
            </span>
          ))}
        </div>
      )}

      {/* Anomaly cards */}
      {loading && !data
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
              <Skeleton h={14} w={120} /><br />
              <Skeleton h={12} /><br />
              <Skeleton h={12} w="60%" />
            </div>
          ))
        : anomalies.length === 0
        ? (
          <div className="rounded-xl border p-8 flex flex-col items-center gap-3"
            style={{ background: surface, borderColor: border }}>
            <CheckCircle2 size={32} color={C.success} />
            <p style={{ fontSize: 14, fontWeight: 600, color: text }}>Aucune anomalie détectée</p>
            <p style={{ fontSize: 12, color: sub }}>
              Fenêtre de {hours}h · source :{source} · généré le{" "}
              {data?.generated_at ? new Date(data.generated_at).toLocaleString("fr-FR") : "—"}
            </p>
          </div>
        )
        : anomalies.map((a: AnomalyItem) => (
            <div
              key={a.id}
              className="rounded-xl border p-4"
              style={{
                background:  surface,
                borderColor: normSev(a.severity) === "HIGH" ? `${C.error}44` : border,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={a.severity} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{a.type}</span>
                    <code style={{
                      fontSize: 10, color: sub,
                      background: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                      padding: "1px 5px", borderRadius: 3,
                    }}>
                      {a.ride_id != null
                        ? `ride #${a.ride_id} · driver #${a.driver_id}`
                        : `driver ${String(a.driver_id).slice(0, 8)}…`}
                    </code>
                    <span style={{ fontSize: 11, color: sub, marginLeft: "auto" }}>
                      Conf: <b style={{ color: C.primaryPurple }}>{Math.round(a.confidence * 100)}%</b>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {a.impact && (
                      <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                        style={{ background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)" }}>
                        <TrendingDown size={12} color={C.error} />
                        <span style={{ fontSize: 11, color: text, fontWeight: 600 }}>Impact : {a.impact}</span>
                      </div>
                    )}
                    {a.action && (
                      <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                        style={{ background: "rgba(168,85,247,.08)" }}>
                        <Zap size={12} color={C.primaryPurple} />
                        <span style={{ fontSize: 11, color: C.primaryPurple, fontWeight: 600 }}>
                          Action : {a.action}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg,${C.primaryPurple},${C.secondaryPurple})`,
                    color: "#fff", border: "none",
                  }}
                >
                  Corriger <ChevronRight size={11} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${border}` }}>
                <span style={{ fontSize: 10, color: sub }}>Confiance ML</span>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                  <div style={{
                    width: `${a.confidence * 100}%`, height: "100%", borderRadius: 2,
                    background: a.confidence > 0.9 ? C.error : a.confidence > 0.75 ? C.warning : C.gray7B,
                  }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: a.confidence > 0.9 ? C.error : C.warning }}>
                  {Math.round(a.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
    </div>
  );
}

// ─── Onglet : Model Registry ──────────────────────────────────────────────────

function ModelsTab({ dark }: { dark: boolean }) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const { data, loading, error, refetch } =
    useMLApi<ModelsResp>(API2("/models/"), { refreshInterval: 60_000 });

  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [promoteData,   setPromoteData]   = useState<Record<string, PromoteResp>>({});
  const [checking,      setChecking]      = useState<string | null>(null);

  const handleCheckPromote = useCallback(async (name: string) => {
    setChecking(name);
    try {
      const r = await fetch(API2(`/models/${name}/promote`), {
        headers: { Accept: "application/json" },
      });
      if (r.ok) {
        const d = (await r.json()) as PromoteResp;
        setPromoteData((prev) => ({ ...prev, [name]: d }));
        setExpandedModel(name);
      }
    } finally {
      setChecking(null);
    }
  }, []);

  const models  = data?.data?.models ?? [];
  const summary = data?.data?.summary;

  function primaryMetric(m: ModelEntry): { label: string; value: string; pct: number } {
    const mx = m.metrics;
    if (m.name === "demand_forecast") {
      const v = mx.lstm_r2 ?? mx.ensemble_r2 ?? 0;
      return { label: "LSTM R²",      value: fmt(v, 3),              pct: Math.max(0, Math.round((v + 1) * 50)) };
    }
    if (m.name === "surge_predictor") {
      const v = (mx.within_10pct ?? 0) * 100;
      return { label: "Within 10%",   value: `${fmt(v, 1)}%`,        pct: Math.round(v) };
    }
    if (m.name === "churn_classifier") {
      const v = (mx.cv_auc_roc ?? 0) * 100;
      return { label: "CV AUC-ROC",   value: fmt(mx.cv_auc_roc ?? 0, 3), pct: Math.round(v) };
    }
    if (m.name === "eta_estimator") {
      const mae = mx.mae_minutes ?? 0;
      return { label: "MAE (min)",    value: `${fmt(mae, 2)} min`,   pct: Math.max(0, Math.round(100 - mae * 10)) };
    }
    if (m.name === "fraud_detector") {
      const v = (1 - (mx.anomaly_rate ?? 0)) * 100;
      return { label: "Clean rate",   value: `${fmt(v, 1)}%`,        pct: Math.round(v) };
    }
    if (m.name === "route_optimizer") {
      const v = (mx.dispatch_accuracy ?? 0) * 100;
      return { label: "Dispatch acc.", value: `${fmt(v, 1)}%`,       pct: Math.round(v) };
    }
    const firstKey = Object.keys(mx)[0];
    return firstKey
      ? { label: firstKey, value: fmt(mx[firstKey], 3), pct: Math.round(Math.min(100, Math.abs(mx[firstKey]) * 100)) }
      : { label: "—", value: "—", pct: 0 };
  }

  const barColor = (pct: number, health: string): string =>
    health === "healthy" ? C.success : pct > 60 ? C.warning : C.error;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <ErrorBanner message={`Models API : ${error}`} onRetry={refetch} />}

      {/* Health summary */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { label: "Healthy",  value: summary.healthy  ?? 0, color: C.success },
            { label: "Warning",  value: summary.warning  ?? 0, color: C.warning },
            { label: "Critical", value: summary.critical ?? 0, color: C.error },
            { label: "Unknown",  value: summary.unknown  ?? 0, color: C.gray7B },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border p-3 flex items-center gap-3"
              style={{ background: surface, borderColor: border }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 11, color: sub }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: surface, borderColor: border }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Statut", "Modèle", "Run ID", "Précision", "Métrique", "Thresholds", "Actions"].map((h) => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: sub,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} style={{ padding: "12px 16px" }}><Skeleton h={12} w={60} /></td>
                    ))}
                  </tr>
                ))
              : models.map((m: ModelEntry) => {
                  const pm   = primaryMetric(m);
                  const bc   = barColor(pm.pct, m.health);
                  const isEx = expandedModel === m.name;
                  const pr   = promoteData[m.name];

                  return (
                    // FIX: React.Fragment key was missing the closing tag correctly in original
                    <React.Fragment key={m.name}>
                      <tr
                        onClick={() => setExpandedModel(isEx ? null : m.name)}
                        style={{
                          borderBottom: `1px solid ${border}`,
                          background: m.health === "critical" ? "rgba(255,59,48,.025)" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <td style={{ padding: "12px 16px" }}><HealthDot health={m.health} /></td>
                        <td style={{ padding: "12px 16px", minWidth: 140 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: text, display: "block" }}>
                            {m.name}
                          </span>
                          <span style={{ fontSize: 9, color: sub }}>{m.started?.slice(0, 16)}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <code style={{
                            fontSize: 10, fontFamily: "'DM Mono',monospace",
                            color: C.primaryPurple, background: "rgba(168,85,247,.08)",
                            padding: "2px 6px", borderRadius: 4,
                          }}>
                            {m.run_id}
                          </code>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div className="flex items-center gap-2">
                            <div style={{ width: 56, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                              <div style={{ width: `${pm.pct}%`, height: "100%", borderRadius: 3, background: bc }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: bc, minWidth: 56 }}>{pm.value}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 11, color: sub }}>{pm.label}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                           {Object.entries(m.thresholds ?? {}).map(([metric, [op, thr]]) => {

                              const actual = m.metrics[metric];
                              const passed = op === "gt" ? actual > thr : actual < thr;
                              return (
                                <span key={metric} style={{
                                  fontSize: 10, color: passed ? C.success : C.error,
                                  display: "flex", alignItems: "center", gap: 3,
                                }}>
                                  {passed ? <CheckCircle2 size={9} /> : <XCircle size={9} />}
                                  {metric} {op === "gt" ? ">" : "<"} {thr}
                                  <span style={{ color: sub }}>({fmt(actual, 3)})</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              disabled={checking === m.name}
                              onClick={() => void handleCheckPromote(m.name)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold"
                              style={{
                                background: pr
                                  ? pr.eligible ? "rgba(76,175,80,.12)" : "rgba(255,59,48,.12)"
                                  : "rgba(168,85,247,.12)",
                                color: pr
                                  ? pr.eligible ? C.success : C.error
                                  : C.primaryPurple,
                                border: "none",
                                opacity: checking === m.name ? 0.6 : 1,
                              }}
                            >
                              {checking === m.name ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : pr ? (
                                pr.eligible ? <CheckCircle2 size={10} /> : <XCircle size={10} />
                              ) : (
                                <Target size={10} />
                              )}
                              {pr ? (pr.eligible ? "Eligible" : "Non éligible") : "Promote?"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isEx && (
                        <tr style={{ borderBottom: `1px solid ${border}` }}>
                          <td colSpan={7} style={{ padding: "0 16px 16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 12 }}>
                              {/* All metrics */}
                              <div className="rounded-lg p-3"
                                style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                  Toutes les métriques
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                  {Object.entries(m.metrics).map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between">
                                      <span style={{ fontSize: 11, color: sub }}>{k}</span>
                                      <span style={{ fontSize: 11, fontWeight: 600, color: text, fontFamily: "'DM Mono',monospace" }}>
                                        {fmt(v, 4)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Feature importance */}
                              {Object.keys(m.feat_importance).length > 0 && (
                                <div className="rounded-lg p-3"
                                  style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                    Feature Importance
                                  </p>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    {Object.entries(m.feat_importance)
                                      .sort((a, b) => b[1] - a[1])
                                      .slice(0, 8)
                                      .map(([feat, imp]) => (
                                        <div key={feat} className="flex items-center gap-2">
                                          <span style={{ fontSize: 10, color: sub, minWidth: 110, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                            {feat.replace("feat_imp_", "")}
                                          </span>
                                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                                            <div style={{ width: `${imp * 100}%`, height: "100%", borderRadius: 2, background: C.primaryPurple }} />
                                          </div>
                                          <span style={{ fontSize: 10, fontWeight: 600, color: C.primaryPurple, minWidth: 36, textAlign: "right" }}>
                                            {fmt(imp * 100, 1)}%
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Promote result */}
                              <div className="rounded-lg p-3" style={{
                                background: pr
                                  ? pr.eligible ? "rgba(76,175,80,.05)" : "rgba(255,59,48,.05)"
                                  : dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
                                border: `1px solid ${pr
                                  ? pr.eligible ? `${C.success}44` : `${C.error}33`
                                  : "transparent"}`,
                              }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                  Éligibilité production
                                </p>
                                {pr ? (
                                  <>
                                    <div className="flex items-center gap-2 mb-4">
                                      {pr.eligible
                                        ? <CheckCircle2 size={14} color={C.success} />
                                        : <XCircle     size={14} color={C.error} />}
                                      <span style={{ fontSize: 13, fontWeight: 700, color: pr.eligible ? C.success : C.error }}>
                                        {pr.eligible ? "Éligible" : "Non éligible"}
                                      </span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                      {pr.details.map((d) => (
                                        <div key={d.metric} className="flex items-center gap-2">
                                          {d.passed
                                            ? <CheckCircle2 size={10} color={C.success} />
                                            : <XCircle     size={10} color={C.error} />}
                                          <span style={{ fontSize: 11, color: sub, minWidth: 90 }}>{d.metric}</span>
                                          <span style={{ fontSize: 10, color: sub }}>
                                            {d.op === "gt" ? ">" : "<"} {d.threshold}
                                          </span>
                                          <span style={{ fontSize: 11, fontWeight: 700, color: d.passed ? C.success : C.error, marginLeft: "auto" }}>
                                            {fmt(d.actual, 4)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center gap-2 py-4">
                                    <Target size={20} color={sub} />
                                    <p style={{ fontSize: 11, color: sub, textAlign: "center" }}>
                                      Cliquez sur "Promote?" pour vérifier
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {data?.data && (
        <div className="flex items-center gap-4 px-1 flex-wrap">
          <span style={{ fontSize: 11, color: sub }}>
            Experiment : <b style={{ color: text }}>{data.data.experiment}</b>
          </span>
          <span style={{ fontSize: 11, color: sub }}>
            Généré le : <b style={{ color: text }}>{new Date(data.data.generated_at).toLocaleString("fr-FR")}</b>
          </span>
          {data.cached && (
            <span style={{ fontSize: 10, color: C.warning, background: "rgba(255,149,0,.1)", padding: "2px 8px", borderRadius: 4 }}>
              cached (Redis 60s)
            </span>
          )}
          <button
            onClick={refetch}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(168,85,247,.1)", color: C.primaryPurple, border: "1px solid rgba(168,85,247,.2)" }}
          >
            <RefreshCw size={11} /> Rafraîchir
          </button>
        </div>
      )}
    </div>
  ); // FIX: closing brace was misplaced in original, causing ModelsTab body to be unclosed
     //      and the stray `}}` at the end was closing the wrong scope
}

// ─── Export racine ────────────────────────────────────────────────────────────

export function AIInsightsPage({ dark }: { dark: boolean }) {
  const [activeTab, setActiveTab] = useState<"overview" | "forecast" | "anomalies" | "models">("overview");

  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const tabs = [
    { id: "overview",  label: "Overview",        icon: BarChart2 },
    { id: "forecast",  label: "Demand Forecast",  icon: TrendingUp },
    { id: "anomalies", label: "Anomalies",         icon: AlertTriangle },
    { id: "models",    label: "Model Registry",    icon: Cpu },
  ] as const;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain size={18} color={C.primaryPurple} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: text }}>AI Intelligence Report</h2>
              <span className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: "rgba(168,85,247,.15)", color: C.primaryPurple }}>
                LIVE
              </span>
            </div>
            <p style={{ fontSize: 12, color: sub }}>
              Intelligence API :8002 · Prediction API :8005 · Refresh auto 30s
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: surface, borderColor: border }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-1 justify-center"
              style={{
                background: activeTab === id
                  ? `linear-gradient(135deg,${C.primaryPurple},${C.secondaryPurple})`
                  : "transparent",
                color:  activeTab === id ? "#fff" : sub,
                border: "none",
                transition: "background .2s",
              }}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview"  && <OverviewTab  dark={dark} />}
        {activeTab === "forecast"  && <ForecastTab  dark={dark} />}
        {activeTab === "anomalies" && <AnomaliesTab dark={dark} />}
        {activeTab === "models"    && <ModelsTab    dark={dark} />}
      </div>
    </>
  );
}