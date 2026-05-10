// ─────────────────────────────────────────────────────────────────────────────
// api.ts  —  Types TypeScript pour Moviroo ML dashboard
// Correspond aux endpoints FastAPI définis dans api/routers/
// ─────────────────────────────────────────────────────────────────────────────

// ── GET /intelligence/overview ────────────────────────────────────────────────

export interface KPICard {
  label: string;          // ex: "Revenue Uplift"
  value: string;          // ex: "+18.4"
  unit: string;           // ex: "%" | "ms" | ""
  trend: number | null;   // delta vs semaine précédente (%)
  status: "good" | "warning" | "bad";
}

export interface OverviewResponse {
  kpis: KPICard[];
  inference_p99_ms: number;
  active_models: number;
  psi_global: number;
  generated_at: string;   // ISO datetime
}

// ── GET /intelligence/overview?section=revenue_opt ───────────────────────────

export interface RevenueWeek {
  week: string;       // ex: "S1"
  baseline: number;   // revenu baseline (€)
  optimized: number;  // revenu ML-optimisé (€)
}

export interface RevenueOptResponse {
  weeks: RevenueWeek[];
  avg_uplift_per_week: number;  // uplift moyen en €
}

// ── GET /intelligence/overview?section=driver_radar ──────────────────────────

export interface RadarPoint {
  subject: string;   // ex: "Safety" | "Speed" | "Rating" | "Efficiency" | "Acceptance" | "Retention"
  top: number;       // score top quartile (0–100)
  avg: number;       // score flotte moyenne (0–100)
}

export interface DriverRadarResponse {
  points: RadarPoint[];
}

// ── GET /demand-forecast?horizon_h={h} ───────────────────────────────────────

export interface ForecastPoint {
  hour: string;              // ex: "08:00"
  actual: number | null;     // null pour les heures futures
  predicted: number;
  confidence_low: number;
  confidence_high: number;
}

export interface DemandForecastResponse {
  horizon_h: number;
  mape: number;              // ex: 5.8
  r2: number;                // ex: 0.97
  zone_lat: number;
  zone_lon: number;
  points: ForecastPoint[];
  generated_at: string;
}

// ── POST /demand-forecast/surge ───────────────────────────────────────────────

export interface SurgeZone {
  zone: string;      // ex: "SOMA"
  risk: number;      // 0–100
  revenue: number;   // revenu potentiel (€)
  drivers: number;   // chauffeurs disponibles
  demand: number;    // score demande 0–100
}

export interface SurgeZonesResponse {
  zones: SurgeZone[];
  generated_at: string;
}

// ── GET /anomalies[?severity=HIGH|MEDIUM|LOW] ────────────────────────────────

export interface AnomalyMetadata {
  impact?: string;   // ex: "$4,200 revenue loss"
  action?: string;   // ex: "Activate backup PSP gateway"
  zone?: string;
  driver_id?: number;
  [key: string]: unknown;
}

export interface AnomalyItem {
  id: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  alert_type: string;     // ex: "Payment Spike"
  description: string;
  score: number;          // 0.0–1.0 (confiance ML)
  detected_at: string;    // ISO datetime
  metadata: AnomalyMetadata;
}

export interface AnomaliesResponse {
  anomalies: AnomalyItem[];
  total: number;
  generated_at: string;
}

// ── GET /anomalies/churn ──────────────────────────────────────────────────────

export interface ChurnDriver {
  driver_id: number;
  name: string;
  churn_risk: number;      // 0–100
  total_trips: number;
  days_active: number;
  last_trip_days_ago: number;
  avg_rating: number;
  acceptance_rate: number; // 0–1
}

export interface ChurnResponse {
  drivers: ChurnDriver[];
  model_accuracy: number;  // ex: 87.5
  auc: number;             // ex: 0.92
  generated_at: string;
}

// ── GET /model-registry ───────────────────────────────────────────────────────

export interface ModelInfo {
  name: string;            // ex: "demand_forecast"
  version: string;         // ex: "4"
  status: "production" | "degraded" | "shadow" | "archived";
  primary_metric: string;  // ex: "MAPE (%)" | "R²" | "CV-Accuracy (%)"
  metric_value: number;    // valeur brute (ex: 5.8 pour MAPE, 94.2 pour accuracy)
  psi_score: number | null;
  last_trained_at: string; // ISO datetime
  algorithm: string;       // ex: "LSTM + Prophet"
}

export interface RegistryResponse {
  models: ModelInfo[];
  generated_at: string;
}

// ── GET /model-registry/drift/report ─────────────────────────────────────────

export interface InfraCard {
  title: string;   // ex: "Data Pipeline"
  value: string;   // ex: "98.7%"
  label: string;   // ex: "Uptime"
  color: string;   // couleur CSS (ex: "#4CAF50")
  detail: string;  // ex: "3.2M events/day · Kafka · Flink"
}

export interface DriftReportResponse {
  infra: InfraCard[];
  psi_by_model: Record<string, number>;
  generated_at: string;
}

// ── POST /model-registry/retrain ─────────────────────────────────────────────

export interface RetrainRequest {
  model_name: string;       // ex: "demand_forecast" | "all"
  lookback_days: number;    // ex: 60
  reason: string;
}

export interface RetrainResponse {
  run_id: string;           // ex: "mlflow-run-abc123"
  model_name: string;
  status: "queued" | "running" | "completed" | "failed";
  estimated_duration_min: number;
  triggered_at: string;     // ISO datetime
}