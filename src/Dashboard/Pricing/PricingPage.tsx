import { useState, useCallback } from "react";
import { toast } from "sonner";
import "../travelsync-design-system.css";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import NightlightRoundRoundedIcon from "@mui/icons-material/NightlightRoundRounded";
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded";

import { usePricingConfig } from "../../api/pricing";
import type { PricingConfig } from "../../api/pricing";
import { useVehicleClasses } from "../../api/useVehicleClasses";
import PricingStatCards from "./components/PricingStatCards";
import PricingSectionCard from "./components/PricingSectionCard";
import PricingTableSection from "./components/PricingTableSection";
import PricingCarTypesSection from "./components/PricingCarTypesSection";
import PricingSingleRow from "./components/PricingSingleRow";
import PricingMLTable from "./components/PricingMLTable";
import PricingStatusBanner from "./components/PricingStatusBanner";
import PricingNumInput from "./components/PricingNumInput";

type TabKey = "fare" | "multipliers" | "car" | "events" | "zone" | "weather" | "ml";

const TRAFFIC_LABELS: Record<string, string> = { "1": "Light", "2": "Moderate", "3": "Heavy" };
const WEATHER_DISPLAY: Record<string, string> = {
  "1": "Clear",
  "2": "Rain",
  "3": "Storm",
  "4": "Sirocco",
};

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "fare", label: "Base Fare", icon: <CalculateRoundedIcon style={{ fontSize: 15 }} /> },
  { key: "multipliers", label: "Traffic & Demand", icon: <TuneRoundedIcon style={{ fontSize: 15 }} /> },
  { key: "car", label: "Car Types", icon: <DirectionsCarRoundedIcon style={{ fontSize: 15 }} /> },
  { key: "events", label: "Events", icon: <EventRoundedIcon style={{ fontSize: 15 }} /> },
  { key: "zone", label: "Zones", icon: <LocationOnRoundedIcon style={{ fontSize: 15 }} /> },
  { key: "weather", label: "Weather", icon: <WbSunnyRoundedIcon style={{ fontSize: 15 }} /> },
  { key: "ml", label: "ML Models", icon: <PsychologyRoundedIcon style={{ fontSize: 15 }} /> },
];

const TH: React.CSSProperties = {
  padding: "0.65rem 1.25rem",
  fontSize: ".72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
  background: "var(--bg-thead)",
};

const TD: React.CSSProperties = {
  padding: "0.55rem 1.25rem",
  fontSize: ".82rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

export default function PricingPage() {
  const {
    config,
    status,
    errorMsg,
    fetchConfig,
    saveConfig,
    resetConfig,
    setConfigField,
    setNestedNum,
    setNestedVal,
  } = usePricingConfig();

  const {
    classes,
    status: classesStatus,
    updateMultiplier,
  } = useVehicleClasses();

  const [activeTab, setActiveTab] = useState<TabKey>("fare");
  const [savingClassId, setSavingClassId] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!config) return;
    const ok = await saveConfig(config);
    if (ok) toast.success("Pricing configuration saved");
    else toast.error("Failed to save pricing configuration");
  }, [config, saveConfig]);

  const handleReset = useCallback(async () => {
    const ok = await resetConfig();
    if (ok) toast.success("Pricing configuration reset to defaults");
    else toast.error("Failed to reset pricing configuration");
  }, [resetConfig]);

  const handleClassMultiplierChange = useCallback(
    async (id: string, value: number) => {
      setSavingClassId(id);
      const ok = await updateMultiplier(id, value);
      setSavingClassId(null);
      if (ok) toast.success("Class multiplier saved");
      else toast.error("Failed to save class multiplier");
    },
    [updateMultiplier]
  );

  const isBusy = status === "saving" || status === "loading";

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (status === "loading" && !config) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: ".75rem",
          padding: "6rem 0",
          color: "var(--text-faint)",
          fontSize: ".85rem",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "2px solid var(--border)",
            borderTopColor: "var(--brand-to)",
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>Loading pricing configuration…</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".75rem",
            background: "rgba(239,68,68,.08)",
            border: "1px solid rgba(239,68,68,.2)",
            borderRadius: ".75rem",
            padding: ".75rem 1.25rem",
            color: "#ef4444",
            fontSize: ".82rem",
          }}
        >
          Failed to load config: {errorMsg}
          <button
            onClick={fetchConfig}
            style={{
              marginLeft: 8,
              padding: "4px 12px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: ".72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
            Pricing Configuration
          </h1>
          <p style={{ margin: 0, marginTop: 4, fontSize: ".75rem", color: "var(--text-faint)" }}>
            ML dynamic pricing — synced with pricingConfig.py
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <button
            onClick={handleReset}
            disabled={isBusy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              fontSize: ".78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              cursor: "pointer",
              opacity: isBusy ? 0.5 : 1,
            }}
          >
            <RestartAltRoundedIcon style={{ fontSize: 16 }} />
            Reset
          </button>
          <button
            onClick={fetchConfig}
            disabled={isBusy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              fontSize: ".78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              cursor: "pointer",
              opacity: isBusy ? 0.5 : 1,
            }}
          >
            <SyncRoundedIcon
              style={{
                fontSize: 16,
                animation: isBusy ? "spin .8s linear infinite" : "none",
              }}
            />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={isBusy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              fontSize: ".78rem",
              fontWeight: 700,
              color: "#fff",
              background: status === "saved" ? "#10b981" : isBusy ? "#a5b4fc" : "#7c3aed",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              opacity: isBusy ? 0.7 : 1,
              transition: "background .2s",
            }}
          >
            <SaveRoundedIcon style={{ fontSize: 16 }} />
            {isBusy ? "Saving…" : status === "saved" ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      <PricingStatusBanner status={status} errorMsg={errorMsg} />
      <PricingStatCards config={config} />

      {/* ── Tab Bar ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: ".75rem",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            borderBottom: "1px solid var(--border)",
            padding: "0 .5rem",
            gap: 2,
          }}
        >
          {TABS.map(({ key, label, icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 16px",
                  fontSize: ".82rem",
                  fontWeight: active ? 700 : 600,
                  whiteSpace: "nowrap",
                  border: "none",
                  borderBottom: `2px solid ${active ? "var(--brand-to)" : "transparent"}`,
                  background: active ? "rgba(124,58,237,.06)" : "transparent",
                  color: active ? "var(--brand-to)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all .15s",
                  marginBottom: -1,
                }}
              >
                <span style={{ opacity: active ? 1 : 0.6 }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────────────── */}
        <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: ".85rem" }}>
          {/* BASE FARE */}
          {activeTab === "fare" && (
            <PricingSectionCard
              title="Base Fare & Rates"
              icon={<CalculateRoundedIcon style={{ fontSize: 16 }} />}
              description="Core pricing parameters applied to every trip"
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                  }}
                >
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "40%" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={TH}>Parameter</th>
                      <th style={TH}>Value (TND)</th>
                      <th style={TH}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["BASE_FARE", "Base Fare", "Fixed charge applied at pickup"],
                        ["RATE_PER_KM", "Rate / km", "Charged per kilometre driven"],
                        ["RATE_PER_MIN", "Rate / min", "Charged per minute elapsed"],
                        ["MIN_FARE", "Min Fare", "Floor — applied when total is lower"],
                      ] as [keyof PricingConfig, string, string][]
                    ).map(([key, label, desc]) => (
                      <tr
                        key={key}
                        style={{ transition: "background .12s" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--bg-inner)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>{label}</td>
                        <td style={TD}>
                          <div style={{ maxWidth: 120 }}>
                            <PricingNumInput
                              value={config[key] as number}
                              onChange={(v) => setConfigField(key, v as PricingConfig[typeof key])}
                              step={0.05}
                            />
                          </div>
                        </td>
                        <td style={{ ...TD, fontSize: ".75rem", color: "var(--text-faint)" }}>{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PricingSectionCard>
          )}

          {/* TRAFFIC & DEMAND */}
          {activeTab === "multipliers" && (
            <>
              <PricingSectionCard
                title="Traffic Multipliers"
                icon={<TuneRoundedIcon style={{ fontSize: 16 }} />}
                description="Adjust pricing based on real-time road congestion level"
                enabled={config.ENABLE_TRAFFIC}
                onToggle={(v) => setConfigField("ENABLE_TRAFFIC", v)}
              >
                <PricingTableSection
                  data={config.MULT_TRAFFIC}
                  keyLabel="Level"
                  onChange={(k, v) => setNestedNum("MULT_TRAFFIC", k, v)}
                  keyDisplay={(k) => `Level ${k} — ${TRAFFIC_LABELS[k] ?? ""}`}
                />
              </PricingSectionCard>

              <PricingSectionCard
                title="Demand Multipliers"
                icon={<TuneRoundedIcon style={{ fontSize: 16 }} />}
                description="Scale pricing with current rider demand in the area"
                enabled={config.ENABLE_DEMAND}
                onToggle={(v) => setConfigField("ENABLE_DEMAND", v)}
              >
                <PricingTableSection
                  data={config.MULT_DEMAND}
                  keyLabel="Level"
                  onChange={(k, v) => setNestedNum("MULT_DEMAND", k, v)}
                />
              </PricingSectionCard>

              <PricingSectionCard
                title="Night Multiplier"
                icon={<NightlightRoundRoundedIcon style={{ fontSize: 16 }} />}
                enabled={config.ENABLE_NIGHT}
                onToggle={(v) => setConfigField("ENABLE_NIGHT", v)}
              >
                <PricingSingleRow
                  label="Night Rate"
                  value={config.MULT_NIGHT}
                  onChange={(v) => setConfigField("MULT_NIGHT", v)}
                  note="Applied between 22:00 – 05:00"
                />
              </PricingSectionCard>

              <PricingSectionCard
                title="Friday Jumuah"
                icon={<WeekendRoundedIcon style={{ fontSize: 16 }} />}
                enabled={config.ENABLE_FRIDAY_JUMUAH}
                onToggle={(v) => setConfigField("ENABLE_FRIDAY_JUMUAH", v)}
              >
                <PricingSingleRow
                  label="Jumuah Rate"
                  value={config.MULT_FRIDAY_JUMUAH}
                  onChange={(v) => setConfigField("MULT_FRIDAY_JUMUAH", v)}
                  note="Applied on Friday at noon prayer time"
                />
              </PricingSectionCard>
            </>
          )}

          {/* CAR TYPES */}
          {activeTab === "car" && (
            <PricingSectionCard
              title="Car Type Multipliers"
              icon={<DirectionsCarRoundedIcon style={{ fontSize: 16 }} />}
              description="Per-category pricing modifier based on vehicle class (DB-driven)"
            >
              {classesStatus === "loading" && (
                <div style={{ fontSize: ".85rem", color: "var(--text-faint)", padding: "1rem 0" }}>
                  Loading vehicle classes…
                </div>
              )}
              {classesStatus === "error" && (
                <div style={{ fontSize: ".82rem", color: "#ef4444", padding: "1rem 0" }}>
                  Failed to load vehicle classes
                </div>
              )}
              {classes.length > 0 && (
                <PricingCarTypesSection
                  classes={classes}
                  onChange={handleClassMultiplierChange}
                  savingId={savingClassId}
                />
              )}
            </PricingSectionCard>
          )}

          {/* EVENTS */}
          {activeTab === "events" && (
            <>
              <PricingSectionCard
                title="Special Events"
                icon={<EventRoundedIcon style={{ fontSize: 16 }} />}
                description="Surge pricing for high-demand events and holidays"
                enabled={config.ENABLE_SPECIAL_EVENT}
                onToggle={(v) => setConfigField("ENABLE_SPECIAL_EVENT", v)}
              >
                <PricingTableSection
                  data={config.MULT_SPECIAL_EVENT}
                  keyLabel="Event"
                  onChange={(k, v) => setNestedNum("MULT_SPECIAL_EVENT", k, v)}
                />
              </PricingSectionCard>

              <PricingSectionCard
                title="Ramadan Periods"
                icon={<EventRoundedIcon style={{ fontSize: 16 }} />}
                description="Adjusted rates for different Ramadan time windows"
                enabled={config.ENABLE_RAMADAN}
                onToggle={(v) => setConfigField("ENABLE_RAMADAN", v)}
              >
                <PricingTableSection
                  data={config.MULT_RAMADAN}
                  keyLabel="Period"
                  onChange={(k, v) => setNestedNum("MULT_RAMADAN", k, v)}
                />
              </PricingSectionCard>
            </>
          )}

          {/* ZONES */}
          {activeTab === "zone" && (
            <>
              <PricingSectionCard
                title="Zone Multipliers"
                icon={<LocationOnRoundedIcon style={{ fontSize: 16 }} />}
                description="Geographic pricing modifiers by city zone"
                enabled={config.ENABLE_ZONE}
                onToggle={(v) => setConfigField("ENABLE_ZONE", v)}
              >
                <PricingTableSection
                  data={config.MULT_ZONE}
                  keyLabel="Zone"
                  onChange={(k, v) => setNestedNum("MULT_ZONE", k, v)}
                />
              </PricingSectionCard>

              <PricingSectionCard
                title="Beach Surge"
                icon={<LocationOnRoundedIcon style={{ fontSize: 16 }} />}
                description="Seasonal beach area pricing by period"
                enabled={config.ENABLE_BEACH}
                onToggle={(v) => setConfigField("ENABLE_BEACH", v)}
              >
                <PricingTableSection
                  data={config.MULT_BEACH}
                  keyLabel="Period"
                  onChange={(k, v) => setNestedNum("MULT_BEACH", k, v)}
                />
              </PricingSectionCard>
            </>
          )}

          {/* WEATHER */}
          {activeTab === "weather" && (
            <PricingSectionCard
              title="Weather Multipliers"
              icon={<WbSunnyRoundedIcon style={{ fontSize: 16 }} />}
              description="Dynamic pricing based on current weather conditions"
              enabled={config.ENABLE_WEATHER}
              onToggle={(v) => setConfigField("ENABLE_WEATHER", v)}
            >
              <PricingTableSection
                data={config.MULT_WEATHER}
                keyLabel="Condition"
                onChange={(k, v) => setNestedNum("MULT_WEATHER", k, v)}
                keyDisplay={(k) => WEATHER_DISPLAY[k] ?? `Code ${k}`}
              />
            </PricingSectionCard>
          )}

          {/* ML MODELS */}
          {activeTab === "ml" && (
            <>
              {/* Ensemble Weights */}
              <PricingSectionCard
                title="Ensemble Weights"
                icon={<PsychologyRoundedIcon style={{ fontSize: 16 }} />}
                description="Relative contribution of each model in the pricing ensemble"
              >
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      tableLayout: "fixed",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "40%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th style={TH}>Model</th>
                        <th style={TH}>Weight</th>
                        <th style={TH}>Distribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          ["XGBoost", "W_XGB"],
                          ["LightGBM", "W_LGBM"],
                        ] as [string, keyof PricingConfig][]
                      ).map(([label, key]) => {
                        const total = config.W_XGB + config.W_LGBM;
                        const pct = total > 0 ? ((config[key] as number) / total) * 100 : 0;
                        return (
                          <tr
                            key={key}
                            style={{ transition: "background .12s" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "var(--bg-inner)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>{label}</td>
                            <td style={TD}>
                              <div style={{ width: 110 }}>
                                <PricingNumInput
                                  value={config[key] as number}
                                  onChange={(v) => setConfigField(key, v as PricingConfig[typeof key])}
                                  step={0.05}
                                />
                              </div>
                            </td>
                            <td style={TD}>
                              <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                                <div
                                  style={{
                                    flex: 1,
                                    height: 6,
                                    background: "var(--bg-inner)",
                                    borderRadius: 9999,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      height: "100%",
                                      background: "var(--brand-to)",
                                      borderRadius: 9999,
                                      width: `${pct.toFixed(1)}%`,
                                      transition: "width .3s",
                                    }}
                                  />
                                </div>
                                <span
                                  style={{
                                    fontSize: ".72rem",
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                    width: 40,
                                    textAlign: "right",
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {pct.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Weight validation footer */}
                <div
                  style={{
                    padding: ".6rem 1.25rem",
                    fontSize: ".75rem",
                    fontWeight: 600,
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                    background:
                      parseFloat((config.W_XGB + config.W_LGBM).toFixed(2)) === 1
                        ? "rgba(16,185,129,.06)"
                        : "rgba(245,158,11,.06)",
                    color:
                      parseFloat((config.W_XGB + config.W_LGBM).toFixed(2)) === 1
                        ? "#10b981"
                        : "#f59e0b",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        parseFloat((config.W_XGB + config.W_LGBM).toFixed(2)) === 1
                          ? "#10b981"
                          : "#f59e0b",
                    }}
                  />
                  {parseFloat((config.W_XGB + config.W_LGBM).toFixed(2)) === 1
                    ? `Sum: ${(config.W_XGB + config.W_LGBM).toFixed(2)} — weights are balanced`
                    : `Sum: ${(config.W_XGB + config.W_LGBM).toFixed(2)} — weights must equal 1.0`}
                </div>
              </PricingSectionCard>

              <PricingSectionCard
                title="XGBoost Hyperparameters"
                icon={<PsychologyRoundedIcon style={{ fontSize: 16 }} />}
                description="Fine-tune the gradient boosting model parameters"
              >
                <PricingMLTable
                  title="XGBoost"
                  params={config.XGB_PARAMS}
                  onChange={(k, v) => setNestedVal("XGB_PARAMS", k, v)}
                />
              </PricingSectionCard>

              <PricingSectionCard
                title="LightGBM Hyperparameters"
                icon={<PsychologyRoundedIcon style={{ fontSize: 16 }} />}
                description="Fine-tune the LightGBM model parameters"
              >
                <PricingMLTable
                  title="LightGBM"
                  params={config.LGBM_PARAMS}
                  onChange={(k, v) => setNestedVal("LGBM_PARAMS", k, v)}
                />
              </PricingSectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
