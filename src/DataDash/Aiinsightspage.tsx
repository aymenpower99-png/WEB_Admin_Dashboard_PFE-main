// // import { useState } from "react";
// // import {
// //   AreaChart, Area, LineChart, Line, BarChart, Bar,
// //   RadarChart, Radar, PolarGrid, PolarAngleAxis,
// //   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// //   ScatterChart, Scatter, ZAxis,
// // } from "recharts";
// // import {
// //   Brain, TrendingUp, TrendingDown, AlertTriangle,
// //   Zap, Target, BarChart2, ChevronRight, RefreshCw,
// //   Cpu, Activity, ArrowUpRight, ArrowDownRight,
// //   Clock, Users, DollarSign, Map, Star,
// //   CheckCircle2, XCircle, Info,
// // } from "lucide-react";
// // import { C } from "./tokens";
// // import { CustomTooltip } from "./CustomTooltip";

// // // ─── ML Data ─────────────────────────────────────────────────────────────────

// // const demandForecast = [
// //   { hour: "00:00", actual: 120,  predicted: 118, lower: 98,  upper: 138 },
// //   { hour: "02:00", actual: 65,   predicted: 70,  lower: 55,  upper: 85  },
// //   { hour: "04:00", actual: 45,   predicted: 48,  lower: 38,  upper: 58  },
// //   { hour: "06:00", actual: 210,  predicted: 195, lower: 175, upper: 215 },
// //   { hour: "08:00", actual: 680,  predicted: 660, lower: 630, upper: 690 },
// //   { hour: "10:00", actual: 520,  predicted: 540, lower: 510, upper: 570 },
// //   { hour: "12:00", actual: 490,  predicted: 480, lower: 455, upper: 505 },
// //   { hour: "14:00", actual: 440,  predicted: 460, lower: 435, upper: 485 },
// //   { hour: "16:00", actual: 710,  predicted: 690, lower: 660, upper: 720 },
// //   { hour: "18:00", actual: 920,  predicted: 900, lower: 870, upper: 930 },
// //   { hour: "20:00", actual: 760,  predicted: 780, lower: 750, upper: 810 },
// //   { hour: "22:00", actual: null, predicted: 540, lower: 510, upper: 570 },
// // ];

// // const surgeZones = [
// //   { zone: "SOMA",        risk: 87, revenue: 4200, drivers: 12, demand: 89 },
// //   { zone: "Mission",     risk: 74, revenue: 3800, drivers: 18, demand: 76 },
// //   { zone: "Castro",      risk: 62, revenue: 2900, drivers: 22, demand: 58 },
// //   { zone: "Tenderloin",  risk: 91, revenue: 5100, drivers: 8,  demand: 94 },
// //   { zone: "Nob Hill",    risk: 45, revenue: 1800, drivers: 30, demand: 41 },
// //   { zone: "Marina",      risk: 58, revenue: 2400, drivers: 25, demand: 55 },
// // ];

// // const driverPerformance = [
// //   { subject: "Safety",     A: 92, B: 78, fullMark: 100 },
// //   { subject: "Speed",      A: 85, B: 91, fullMark: 100 },
// //   { subject: "Rating",     A: 97, B: 82, fullMark: 100 },
// //   { subject: "Efficiency", A: 88, B: 74, fullMark: 100 },
// //   { subject: "Acceptance", A: 79, B: 88, fullMark: 100 },
// //   { subject: "Retention",  A: 94, B: 69, fullMark: 100 },
// // ];

// // const churnRisk = [
// //   { name: "Marcus C.",  risk: 12, trips: 1204, days: 340 },
// //   { name: "Elena R.",   risk: 34, trips: 876,  days: 210 },
// //   { name: "James P.",   risk: 8,  trips: 2341, days: 580 },
// //   { name: "Sofia D.",   risk: 67, trips: 654,  days: 95  },
// //   { name: "Amir H.",    risk: 5,  trips: 3102, days: 720 },
// //   { name: "Carlos V.",  risk: 82, trips: 289,  days: 60  },
// //   { name: "Priya N.",   risk: 45, trips: 421,  days: 140 },
// //   { name: "Yuki T.",    risk: 19, trips: 1567, days: 390 },
// // ];

// // const anomalies = [
// //   {
// //     id: "A1", severity: "HIGH",   type: "Payment Spike",
// //     desc: "Stripe API latency caused 23% failure uplift in Region 4 between 14:00–15:30.",
// //     impact: "$4,200 revenue loss", confidence: 97, action: "Activate backup PSP gateway",
// //   },
// //   {
// //     id: "A2", severity: "MEDIUM", type: "Driver Density Gap",
// //     desc: "E. Market St corridor has 8× more demand than supply for the past 40 minutes.",
// //     impact: "+12 min avg wait", confidence: 89, action: "Relocate 4 idle drivers from Castro",
// //   },
// //   {
// //     id: "A3", severity: "LOW",    type: "Rating Drift",
// //     desc: "Average rating in Tenderloin dropped 0.3 points this week — correlates with new drivers.",
// //     impact: "−0.3 avg rating", confidence: 74, action: "Assign senior mentors to 3 drivers",
// //   },
// //   {
// //     id: "A4", severity: "HIGH",   type: "Surge Mismatch",
// //     desc: "SOMA surge multiplier set to 1.2× but ML model recommends 2.4× based on current demand.",
// //     impact: "$8,100 missed revenue", confidence: 93, action: "Approve surge increase immediately",
// //   },
// // ];

// // const modelMetrics = [
// //   { model: "Demand Forecast",   accuracy: 94.2, mae: 18.4, rmse: 24.1, r2: 0.97, status: "healthy"  },
// //   { model: "Surge Predictor",   accuracy: 91.8, mae: 0.12, rmse: 0.18, r2: 0.94, status: "healthy"  },
// //   { model: "Churn Classifier",  accuracy: 87.5, mae: null, rmse: null,  r2: null, status: "warning"  },
// //   { model: "ETA Estimator",     accuracy: 96.1, mae: 2.1,  rmse: 3.4,  r2: 0.98, status: "healthy"  },
// //   { model: "Fraud Detector",    accuracy: 99.2, mae: null, rmse: null,  r2: null, status: "healthy"  },
// //   { model: "Route Optimizer",   accuracy: 88.9, mae: 4.8,  rmse: 6.2,  r2: 0.91, status: "critical" },
// // ];

// // const revenueOptimization = [
// //   { week: "W1",  baseline: 88000,  optimized: 94000  },
// //   { week: "W2",  baseline: 91000,  optimized: 98000  },
// //   { week: "W3",  baseline: 85000,  optimized: 97000  },
// //   { week: "W4",  baseline: 96000,  optimized: 108000 },
// //   { week: "W5",  baseline: 102000, optimized: 118000 },
// //   { week: "W6",  baseline: 99000,  optimized: 114000 },
// //   { week: "W7",  baseline: 107000, optimized: 124000 },
// //   { week: "W8",  baseline: 112000, optimized: 131000 },
// // ];

// // // ─── Helpers ─────────────────────────────────────────────────────────────────

// // function SeverityBadge({ severity }: { severity: string }) {
// //   const cfg = {
// //     HIGH:   { bg: "rgba(255,59,48,.12)",  color: C.error,   icon: XCircle      },
// //     MEDIUM: { bg: "rgba(255,149,0,.12)",  color: C.warning, icon: AlertTriangle },
// //     LOW:    { bg: "rgba(75,159,255,.12)", color: "#4B9FFF", icon: Info          },
// //   }[severity] ?? { bg: "rgba(123,123,133,.12)", color: C.gray7B, icon: Info };

// //   const Icon = cfg.icon;
// //   return (
// //     <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 700 }}>
// //       <Icon size={10} />
// //       {severity}
// //     </span>
// //   );
// // }

// // function ModelStatusDot({ status }: { status: string }) {
// //   const color = { healthy: C.success, warning: C.warning, critical: C.error }[status] ?? C.gray7B;
// //   return <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />;
// // }

// // // ─── Section wrapper ─────────────────────────────────────────────────────────

// // function Section({ title, subtitle, icon: Icon, children, dark, action }: {
// //   title: string;
// //   subtitle?: string;
// //   icon: React.ElementType;
// //   children: React.ReactNode;
// //   dark: boolean;
// //   action?: React.ReactNode;
// // }) {
// //   const surface = dark ? C.darkSurface : C.lightSurface;
// //   const border = dark ? C.darkBorder : C.lightBorder;
// //   const text = dark ? C.darkText : C.lightText;
// //   const sub = dark ? C.gray7B : C.lightSubtext;

// //   return (
// //     <div className="rounded-xl border" style={{ background: surface, borderColor: border }}>
// //       <div className="flex items-start justify-between p-4 pb-3">
// //         <div className="flex items-center gap-2.5">
// //           <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
// //             <Icon size={15} color={C.primaryPurple} />
// //           </div>
// //           <div>
// //             <p style={{ fontSize: 13, fontWeight: 600, color: text }}>{title}</p>
// //             {subtitle && <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>{subtitle}</p>}
// //           </div>
// //         </div>
// //         {action}
// //       </div>
// //       <div className="px-4 pb-4">{children}</div>
// //     </div>
// //   );
// // }

// // // ─── Main AIInsightsPage ──────────────────────────────────────────────────────

// // export function AIInsightsPage({ dark }: { dark: boolean }) {
// //   const [activeTab, setActiveTab] = useState<"overview" | "models" | "anomalies" | "forecast">("overview");

// //   const surface = dark ? C.darkSurface : C.lightSurface;
// //   const border = dark ? C.darkBorder : C.lightBorder;
// //   const text = dark ? C.darkText : C.lightText;
// //   const sub = dark ? C.gray7B : C.lightSubtext;
// //   const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
// //   const tickColor = dark ? C.gray7B : C.lightSubtext;

// //   const tabs = [
// //     { id: "overview",  label: "Overview",      icon: BarChart2  },
// //     { id: "forecast",  label: "Demand Forecast",icon: TrendingUp },
// //     { id: "anomalies", label: "Anomalies",      icon: AlertTriangle },
// //     { id: "models",    label: "Model Registry", icon: Cpu        },
// //   ] as const;

// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

// //       {/* ── Header ──────────────────────────────────────────────── */}
// //       <div className="flex items-start justify-between">
// //         <div>
// //           <div className="flex items-center gap-2 mb-1">
// //             <Brain size={18} color={C.primaryPurple} />
// //             <h2 style={{ fontSize: 18, fontWeight: 700, color: text }}>AI Intelligence Report</h2>
// //             <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(168,85,247,.15)", color: C.primaryPurple }}>
// //               ML v3.4.1
// //             </span>
// //           </div>
// //           <p style={{ fontSize: 12, color: sub }}>
// //             Powered by 6 production ML models · Last retrained 2h ago · 94.2% avg accuracy
// //           </p>
// //         </div>
// //         <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
// //           style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`, color: "#fff", border: "none" }}>
// //           <RefreshCw size={11} /> Retrain Models
// //         </button>
// //       </div>

// //       {/* ── Tab bar ─────────────────────────────────────────────── */}
// //       <div className="flex gap-1 p-1 rounded-xl border" style={{ background: surface, borderColor: border }}>
// //         {tabs.map(({ id, label, icon: Icon }) => (
// //           <button
// //             key={id}
// //             onClick={() => setActiveTab(id)}
// //             className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-1 justify-center transition-all"
// //             style={{
// //               background: activeTab === id
// //                 ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
// //                 : "transparent",
// //               color: activeTab === id ? "#fff" : sub,
// //               border: "none",
// //             }}
// //           >
// //             <Icon size={12} />
// //             {label}
// //           </button>
// //         ))}
// //       </div>

// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {/* TAB: OVERVIEW                                             */}
// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {activeTab === "overview" && (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

// //           {/* Top KPIs */}
// //           <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
// //             {[
// //               { label: "Revenue Uplift",   value: "+18.4%",  sub: "vs baseline",     color: C.success,       icon: DollarSign, up: true  },
// //               { label: "Demand Accuracy",  value: "94.2%",   sub: "MAPE 5.8%",       color: C.primaryPurple, icon: Target,     up: true  },
// //               { label: "Surge Efficiency", value: "87.3%",   sub: "capture rate",    color: C.warning,       icon: Zap,        up: true  },
// //               { label: "Churn Rate",       value: "3.1%",    sub: "−0.8% vs last mo",color: C.error,         icon: Users,      up: false },
// //             ].map(({ label, value, sub: s, color, icon: Icon, up }) => (
// //               <div key={label} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
// //                 <div className="flex items-center gap-2 mb-3">
// //                   <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
// //                     <Icon size={14} color={C.primaryPurple} />
// //                   </div>
// //                   <span style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
// //                 </div>
// //                 <p style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
// //                 <div className="flex items-center gap-1 mt-1">
// //                   {up ? <ArrowUpRight size={11} color={C.success} /> : <ArrowDownRight size={11} color={C.error} />}
// //                   <span style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext }}>{s}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Revenue Optimization chart */}
// //           <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
// //             <Section dark={dark} title="Revenue Optimization" subtitle="Baseline vs ML-optimized strategy (8 weeks)" icon={TrendingUp}>
// //               <ResponsiveContainer width="100%" height={200}>
// //                 <AreaChart data={revenueOptimization} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
// //                   <defs>
// //                     <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="0%" stopColor={C.gray7B} stopOpacity={0.2} />
// //                       <stop offset="100%" stopColor={C.gray7B} stopOpacity={0} />
// //                     </linearGradient>
// //                     <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="0%" stopColor={C.primaryPurple} stopOpacity={0.3} />
// //                       <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
// //                     </linearGradient>
// //                   </defs>
// //                   <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
// //                   <XAxis dataKey="week" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
// //                   <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
// //                   <Tooltip content={<CustomTooltip dark={dark} prefix="$" />} />
// //                   <Area type="monotone" dataKey="baseline"  name="Baseline"   stroke={C.gray7B}        strokeWidth={2} fill="url(#baseGrad)" strokeDasharray="4 2" />
// //                   <Area type="monotone" dataKey="optimized" name="Optimized"  stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#optGrad)" dot={{ fill: C.primaryPurple, r: 3 }} />
// //                 </AreaChart>
// //               </ResponsiveContainer>
// //               <div className="flex items-center gap-4 mt-2">
// //                 {[{ label: "Baseline",  color: C.gray7B }, { label: "ML Optimized", color: C.primaryPurple }].map(({ label, color }) => (
// //                   <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 11, color: sub }}>
// //                     <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
// //                     {label}
// //                   </span>
// //                 ))}
// //                 <span className="ml-auto" style={{ fontSize: 12, fontWeight: 700, color: C.success }}>
// //                   +$18,200 avg uplift/week
// //                 </span>
// //               </div>
// //             </Section>

// //             {/* Surge Zone risk table */}
// //             <Section dark={dark} title="Surge Zone Scores" subtitle="ML risk × revenue potential" icon={Map}>
// //               <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
// //                 {surgeZones.map((z) => (
// //                   <div key={z.zone} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
// //                     <span style={{ fontSize: 12, fontWeight: 600, color: text, minWidth: 80 }}>{z.zone}</span>
// //                     <div style={{ flex: 1, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
// //                       <div style={{ width: `${z.risk}%`, height: "100%", borderRadius: 3, background: z.risk > 80 ? C.error : z.risk > 60 ? C.warning : C.primaryPurple, transition: "width .6s" }} />
// //                     </div>
// //                     <span style={{ fontSize: 11, fontWeight: 700, minWidth: 28, color: z.risk > 80 ? C.error : z.risk > 60 ? C.warning : C.primaryPurple }}>{z.risk}%</span>
// //                     <span style={{ fontSize: 10, color: sub, minWidth: 50, textAlign: "right" }}>${(z.revenue / 1000).toFixed(1)}k</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </Section>
// //           </div>

// //           {/* Driver performance radar + churn */}
// //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
// //             <Section dark={dark} title="Driver Performance Radar" subtitle="Top quartile vs average fleet" icon={Activity}>
// //               <ResponsiveContainer width="100%" height={220}>
// //                 <RadarChart data={driverPerformance}>
// //                   <PolarGrid stroke={dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"} />
// //                   <PolarAngleAxis dataKey="subject" tick={{ fill: tickColor, fontSize: 10 }} />
// //                   <Radar name="Top Drivers" dataKey="A" stroke={C.primaryPurple} fill={C.primaryPurple} fillOpacity={0.2} strokeWidth={2} />
// //                   <Radar name="Avg Fleet"   dataKey="B" stroke={C.warning}       fill={C.warning}       fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
// //                   <Tooltip content={<CustomTooltip dark={dark} />} />
// //                 </RadarChart>
// //               </ResponsiveContainer>
// //               <div className="flex gap-4 justify-center mt-1">
// //                 {[{ label: "Top Drivers", color: C.primaryPurple }, { label: "Avg Fleet", color: C.warning }].map(({ label, color }) => (
// //                   <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 11, color: sub }}>
// //                     <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
// //                     {label}
// //                   </span>
// //                 ))}
// //               </div>
// //             </Section>

// //             <Section dark={dark} title="Driver Churn Risk Model" subtitle="XGBoost classifier · 87.5% accuracy" icon={Users}>
// //               <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
// //                 {churnRisk.sort((a, b) => b.risk - a.risk).map((d) => (
// //                   <div key={d.name} className="flex items-center gap-3 rounded-lg px-3 py-2 border transition-all" style={{ background: dark ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.02)", borderColor: d.risk > 60 ? `${C.error}33` : "transparent" }}>
// //                     <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
// //                       style={{ background: d.risk > 60 ? C.error : d.risk > 40 ? C.warning : C.success, fontSize: 9 }}>
// //                       {d.name.split(" ").map((n) => n[0]).join("")}
// //                     </div>
// //                     <span style={{ fontSize: 12, fontWeight: 500, color: text, minWidth: 72 }}>{d.name}</span>
// //                     <div style={{ flex: 1, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
// //                       <div style={{ width: `${d.risk}%`, height: "100%", borderRadius: 3, background: d.risk > 60 ? C.error : d.risk > 40 ? C.warning : C.success }} />
// //                     </div>
// //                     <span style={{ fontSize: 11, fontWeight: 700, minWidth: 36, color: d.risk > 60 ? C.error : d.risk > 40 ? C.warning : C.success }}>{d.risk}%</span>
// //                     <span style={{ fontSize: 10, color: sub, minWidth: 52, textAlign: "right" }}>{d.trips} trips</span>
// //                     {d.risk > 60 && <span style={{ fontSize: 9, fontWeight: 700, color: C.error, background: "rgba(255,59,48,.1)", padding: "2px 5px", borderRadius: 4 }}>AT RISK</span>}
// //                   </div>
// //                 ))}
// //               </div>
// //             </Section>
// //           </div>
// //         </div>
// //       )}

// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {/* TAB: DEMAND FORECAST                                      */}
// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {activeTab === "forecast" && (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// //           <Section dark={dark} title="24-Hour Demand Forecast" subtitle="LSTM + Prophet ensemble · Confidence intervals shown" icon={TrendingUp}
// //             action={
// //               <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(76,175,80,.1)", border: `1px solid ${C.success}33` }}>
// //                 <CheckCircle2 size={11} color={C.success} />
// //                 <span style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>Model Healthy · MAPE 5.8%</span>
// //               </div>
// //             }
// //           >
// //             <ResponsiveContainer width="100%" height={280}>
// //               <AreaChart data={demandForecast} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
// //                 <defs>
// //                   <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
// //                     <stop offset="0%" stopColor={C.primaryPurple} stopOpacity={0.08} />
// //                     <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0.02} />
// //                   </linearGradient>
// //                   <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
// //                     <stop offset="0%" stopColor={C.primaryPurple} stopOpacity={0.2} />
// //                     <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
// //                   </linearGradient>
// //                 </defs>
// //                 <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
// //                 <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
// //                 <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Ride Requests", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 10, dy: 50 }} />
// //                 <Tooltip content={<CustomTooltip dark={dark} />} />
// //                 <Area type="monotone" dataKey="upper"     name="Upper CI"  stroke="none"           fill="url(#confBand)" />
// //                 <Area type="monotone" dataKey="lower"     name="Lower CI"  stroke="none"           fill={dark ? "#0B0B0F" : "#F4F4F8"} />
// //                 <Area type="monotone" dataKey="predicted" name="Predicted" stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#predGrad)" strokeDasharray="6 3" dot={false} />
// //                 <Line type="monotone" dataKey="actual"    name="Actual"    stroke={C.success}      strokeWidth={2.5} dot={{ fill: C.success, r: 3 }} connectNulls={false} />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //             <div className="flex gap-6 mt-3">
// //               {[
// //                 { label: "Actual Demand",    color: C.success,       dash: false },
// //                 { label: "ML Prediction",    color: C.primaryPurple, dash: true  },
// //                 { label: "Confidence Band",  color: C.primaryPurple, dash: false, opacity: 0.3 },
// //               ].map(({ label, color, dash, opacity }) => (
// //                 <span key={label} className="flex items-center gap-2" style={{ fontSize: 11, color: sub }}>
// //                   <span style={{ width: 20, height: 2, background: color, opacity: opacity ?? 1, display: "inline-block", borderRadius: 2 }} />
// //                   {label}
// //                 </span>
// //               ))}
// //             </div>
// //           </Section>

// //           {/* Hourly breakdown bar chart */}
// //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
// //             <Section dark={dark} title="Prediction Error by Hour" subtitle="MAE per hourly slot" icon={BarChart2}>
// //               <ResponsiveContainer width="100%" height={180}>
// //                 <BarChart
// //                   data={demandForecast.filter((d) => d.actual !== null).map((d) => ({
// //                     hour: d.hour,
// //                     error: Math.abs((d.actual ?? 0) - d.predicted),
// //                     pct: Math.round(Math.abs(((d.actual ?? 0) - d.predicted) / (d.actual ?? 1)) * 100),
// //                   }))}
// //                   margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
// //                   barSize={16}
// //                 >
// //                   <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
// //                   <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
// //                   <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
// //                   <Tooltip content={<CustomTooltip dark={dark} />} />
// //                   <Bar dataKey="error" name="MAE" fill={C.primaryPurple} radius={[3, 3, 0, 0]} />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </Section>

// //             {/* Forecast stats */}
// //             <Section dark={dark} title="Forecast Performance Metrics" subtitle="Rolling 30-day evaluation" icon={Target}>
// //               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
// //                 {[
// //                   { label: "MAE",       value: "18.4",  unit: "rides",    color: C.primaryPurple },
// //                   { label: "RMSE",      value: "24.1",  unit: "rides",    color: C.primaryPurple },
// //                   { label: "MAPE",      value: "5.8%",  unit: "",         color: C.success        },
// //                   { label: "R² Score",  value: "0.974", unit: "",         color: C.success        },
// //                   { label: "Bias",      value: "+2.1",  unit: "rides",    color: C.warning        },
// //                   { label: "Coverage",  value: "94.2%", unit: "CI",       color: C.success        },
// //                 ].map(({ label, value, unit, color }) => (
// //                   <div key={label} className="rounded-lg p-3" style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
// //                     <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</p>
// //                     <p style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: "-0.3px" }}>{value}</p>
// //                     {unit && <p style={{ fontSize: 10, color: sub }}>{unit}</p>}
// //                   </div>
// //                 ))}
// //               </div>
// //             </Section>
// //           </div>
// //         </div>
// //       )}

// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {/* TAB: ANOMALIES                                            */}
// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {activeTab === "anomalies" && (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
// //           <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: "rgba(255,59,48,.06)", borderColor: "rgba(255,59,48,.25)" }}>
// //             <AlertTriangle size={16} color={C.error} />
// //             <span style={{ fontSize: 13, fontWeight: 600, color: C.error }}>
// //               {anomalies.filter((a) => a.severity === "HIGH").length} high-severity anomalies detected
// //             </span>
// //             <span style={{ fontSize: 12, color: sub, marginLeft: "auto" }}>Auto-detected by Isolation Forest + LSTM residuals</span>
// //           </div>

// //           {anomalies.map((a) => (
// //             <div
// //               key={a.id}
// //               className="rounded-xl border p-4"
// //               style={{
// //                 background: dark ? C.darkSurface : C.lightSurface,
// //                 borderColor: a.severity === "HIGH" ? `${C.error}44` : dark ? C.darkBorder : C.lightBorder,
// //               }}
// //             >
// //               <div className="flex items-start gap-3">
// //                 <div className="flex flex-col gap-2 flex-1">
// //                   <div className="flex items-center gap-2 flex-wrap">
// //                     <SeverityBadge severity={a.severity} />
// //                     <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{a.type}</span>
// //                     <span style={{ fontSize: 11, color: sub, marginLeft: "auto" }}>
// //                       Confidence: <b style={{ color: C.primaryPurple }}>{a.confidence}%</b>
// //                     </span>
// //                   </div>
// //                   <p style={{ fontSize: 12, color: sub, lineHeight: 1.6 }}>{a.desc}</p>
// //                   <div className="flex items-center gap-4 flex-wrap">
// //                     <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)" }}>
// //                       <TrendingDown size={12} color={C.error} />
// //                       <span style={{ fontSize: 11, color: text, fontWeight: 600 }}>Impact: {a.impact}</span>
// //                     </div>
// //                     <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(168,85,247,.08)" }}>
// //                       <Zap size={12} color={C.primaryPurple} />
// //                       <span style={{ fontSize: 11, color: C.primaryPurple, fontWeight: 600 }}>Action: {a.action}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <button
// //                   className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
// //                   style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`, color: "#fff", border: "none" }}
// //                 >
// //                   Apply Fix <ChevronRight size={11} />
// //                 </button>
// //               </div>

// //               {/* Confidence bar */}
// //               <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${dark ? C.darkBorder : C.lightBorder}` }}>
// //                 <span style={{ fontSize: 10, color: sub }}>ML Confidence</span>
// //                 <div style={{ flex: 1, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
// //                   <div style={{ width: `${a.confidence}%`, height: "100%", background: a.confidence > 90 ? C.error : a.confidence > 75 ? C.warning : C.gray7B, borderRadius: 2 }} />
// //                 </div>
// //                 <span style={{ fontSize: 10, fontWeight: 700, color: a.confidence > 90 ? C.error : C.warning }}>{a.confidence}%</span>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {/* TAB: MODEL REGISTRY                                       */}
// //       {/* ══════════════════════════════════════════════════════════ */}
// //       {activeTab === "models" && (
// //         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// //           <div className="rounded-xl border overflow-hidden" style={{ background: surface, borderColor: border }}>
// //             <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //               <thead>
// //                 <tr style={{ borderBottom: `1px solid ${border}` }}>
// //                   {["Status", "Model", "Accuracy", "MAE", "RMSE", "R²", "Actions"].map((h) => (
// //                     <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: sub }}>
// //                       {h}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {modelMetrics.map((m, i) => (
// //                   <tr
// //                     key={m.model}
// //                     style={{
// //                       borderBottom: i < modelMetrics.length - 1 ? `1px solid ${border}` : "none",
// //                       background: m.status === "critical" ? "rgba(255,59,48,.03)" : "transparent",
// //                     }}
// //                   >
// //                     <td style={{ padding: "12px 16px" }}>
// //                       <ModelStatusDot status={m.status} />
// //                     </td>
// //                     <td style={{ padding: "12px 16px" }}>
// //                       <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{m.model}</span>
// //                     </td>
// //                     <td style={{ padding: "12px 16px" }}>
// //                       <div className="flex items-center gap-2">
// //                         <div style={{ width: 60, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
// //                           <div style={{ width: `${m.accuracy}%`, height: "100%", background: m.accuracy > 93 ? C.success : m.accuracy > 88 ? C.warning : C.error, borderRadius: 3 }} />
// //                         </div>
// //                         <span style={{ fontSize: 12, fontWeight: 700, color: m.accuracy > 93 ? C.success : m.accuracy > 88 ? C.warning : C.error }}>{m.accuracy}%</span>
// //                       </div>
// //                     </td>
// //                     <td style={{ padding: "12px 16px", fontSize: 12, color: m.mae ? text : sub }}>{m.mae ?? "N/A"}</td>
// //                     <td style={{ padding: "12px 16px", fontSize: 12, color: m.rmse ? text : sub }}>{m.rmse ?? "N/A"}</td>
// //                     <td style={{ padding: "12px 16px", fontSize: 12, color: m.r2 ? text : sub }}>{m.r2 ?? "N/A"}</td>
// //                     <td style={{ padding: "12px 16px" }}>
// //                       <div className="flex items-center gap-1.5">
// //                         <button className="px-2.5 py-1 rounded text-xs font-semibold" style={{ background: "rgba(168,85,247,.12)", color: C.primaryPurple, border: "none" }}>
// //                           Details
// //                         </button>
// //                         {m.status === "critical" && (
// //                           <button className="px-2.5 py-1 rounded text-xs font-semibold" style={{ background: "rgba(255,59,48,.12)", color: C.error, border: "none" }}>
// //                             Retrain
// //                           </button>
// //                         )}
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Model cards */}
// //           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
// //             {[
// //               { title: "Data Pipeline",   value: "98.7%",  label: "Uptime",         color: C.success,       detail: "3.2M events/day · Kafka · Flink" },
// //               { title: "Feature Store",   value: "847",    label: "Active Features", color: C.primaryPurple, detail: "Redis · Feast · 12ms p99 latency" },
// //               { title: "Serving Infra",   value: "8.4ms",  label: "P99 Latency",    color: C.warning,       detail: "Triton · K8s · A100 cluster" },
// //               { title: "Training Jobs",   value: "24/24",  label: "Passed Today",   color: C.success,       detail: "Airflow DAGs · MLflow tracking" },
// //               { title: "Model Drift",     value: "0.023",  label: "PSI Score",      color: C.success,       detail: "Below 0.1 threshold · Stable" },
// //               { title: "Shadow Models",   value: "3",      label: "A/B Testing",    color: C.primaryPurple, detail: "Demand v4, Surge v2, ETA v5" },
// //             ].map(({ title, value, label, color, detail }) => (
// //               <div key={title} className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
// //                 <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{title}</p>
// //                 <p style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
// //                 <p style={{ fontSize: 11, color: sub, marginTop: 2 }}>{label}</p>
// //                 <p style={{ fontSize: 10, color: dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{detail}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// /**
//  * AIInsightsPage.connected.tsx
//  *
//  * Version "connectée" du dashboard AI Insights.
//  * Remplace toutes les données statiques par des appels réels
//  * aux endpoints FastAPI définis dans api/routers/.
//  *
//  * Changements vs la version statique :
//  *  - Données chargées via useMLApi / useMLPost
//  *  - Skeletons affichés pendant le chargement
//  *  - Bandeaux d'erreur avec bouton "Réessayer"
//  *  - Rafraîchissement automatique toutes les 30 s (overview + anomalies)
//  *  - Bouton "Retrain Models" déclenche POST /model-registry/retrain
//  */
// import { useState, useCallback } from "react";
// import {
//   AreaChart, Area, LineChart, Line, BarChart, Bar,
//   RadarChart, Radar, PolarGrid, PolarAngleAxis,
//   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from "recharts";
// import {
//   Brain, TrendingUp, TrendingDown, AlertTriangle,
//   Zap, Target, BarChart2, ChevronRight, RefreshCw,
//   Cpu, Activity, ArrowUpRight, ArrowDownRight,
//   Users, DollarSign, Map,
//   CheckCircle2, XCircle, Info, WifiOff, Loader2,
// } from "lucide-react";

// import { C } from "./tokens";
// import { CustomTooltip } from "./CustomTooltip";
// import { useMLApi, useMLPost } from "./useMLApi";
// import type {
//   OverviewResponse,
//   DemandForecastResponse,
//   AnomaliesResponse,
//   RegistryResponse,
//   RetrainRequest,
//   RetrainResponse,
//   KPICard,
//   AnomalyItem,
//   ModelInfo,
//   ForecastPoint,
// } from "./api";

// // ═══════════════════════════════════════════════════════════════════════════════
// // HELPERS UI
// // ═══════════════════════════════════════════════════════════════════════════════

// function SeverityBadge({ severity }: { severity: string }) {
//   const cfg: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
//     HIGH:   { bg: "rgba(255,59,48,.12)",  color: C.error,   icon: XCircle      },
//     MEDIUM: { bg: "rgba(255,149,0,.12)",  color: C.warning, icon: AlertTriangle },
//     LOW:    { bg: "rgba(75,159,255,.12)", color: "#4B9FFF", icon: Info          },
//   };
//   const { bg, color, icon: Icon } = cfg[severity] ?? { bg: "rgba(123,123,133,.12)", color: C.gray7B, icon: Info };
//   return (
//     <span className="flex items-center gap-1 px-2 py-0.5 rounded-md"
//       style={{ background: bg, color, fontSize: 10, fontWeight: 700 }}>
//       <Icon size={10} />
//       {severity}
//     </span>
//   );
// }

// function ModelStatusDot({ status }: { status: string }) {
//   const color = ({ healthy: C.success, warning: C.warning, critical: C.error } as Record<string, string>)[status] ?? C.gray7B;
//   return (
//     <span style={{
//       width: 7, height: 7, borderRadius: "50%",
//       background: color, display: "inline-block",
//       boxShadow: `0 0 6px ${color}`,
//     }} />
//   );
// }

// function Skeleton({ h = 16, w = "100%", radius = 6 }: { h?: number; w?: number | string; radius?: number }) {
//   return (
//     <div style={{
//       height: h, width: w, borderRadius: radius,
//       background: "linear-gradient(90deg, rgba(128,128,128,.1) 25%, rgba(128,128,128,.2) 50%, rgba(128,128,128,.1) 75%)",
//       backgroundSize: "200% 100%",
//       animation: "shimmer 1.4s infinite",
//     }} />
//   );
// }

// function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
//   return (
//     <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
//       style={{ background: "rgba(255,59,48,.06)", borderColor: "rgba(255,59,48,.25)" }}>
//       <WifiOff size={16} color={C.error} />
//       <span style={{ fontSize: 13, color: C.error, fontWeight: 600 }}>{message}</span>
//       <button onClick={onRetry}
//         className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
//         style={{ background: "rgba(255,59,48,.15)", color: C.error, border: "none" }}>
//         <RefreshCw size={11} /> Réessayer
//       </button>
//     </div>
//   );
// }

// function Section({ title, subtitle, icon: Icon, children, dark, action }: {
//   title: string; subtitle?: string; icon: React.ElementType;
//   children: React.ReactNode; dark: boolean; action?: React.ReactNode;
// }) {
//   const surface = dark ? C.darkSurface : C.lightSurface;
//   const border  = dark ? C.darkBorder  : C.lightBorder;
//   const text    = dark ? C.darkText    : C.lightText;
//   const sub     = dark ? C.gray7B      : C.lightSubtext;
//   return (
//     <div className="rounded-xl border" style={{ background: surface, borderColor: border }}>
//       <div className="flex items-start justify-between p-4 pb-3">
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-lg flex items-center justify-center"
//             style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
//             <Icon size={15} color={C.primaryPurple} />
//           </div>
//           <div>
//             <p style={{ fontSize: 13, fontWeight: 600, color: text }}>{title}</p>
//             {subtitle && <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>{subtitle}</p>}
//           </div>
//         </div>
//         {action}
//       </div>
//       <div className="px-4 pb-4">{children}</div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ONGLET OVERVIEW
// // ═══════════════════════════════════════════════════════════════════════════════

// function OverviewTab({ dark }: { dark: boolean }) {
//   const surface   = dark ? C.darkSurface : C.lightSurface;
//   const border    = dark ? C.darkBorder  : C.lightBorder;
//   const sub       = dark ? C.gray7B      : C.lightSubtext;

//   const { data: overview, loading, error, refetch } =
//     useMLApi<OverviewResponse>("/api/intelligence/overview", { refreshInterval: 30_000 });

//   const kpiIcons = [DollarSign, Target, Zap, Users];
//   const kpiUp    = [true, true, true, false];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {error && <ErrorBanner message={`Overview : ${error}`} onRetry={refetch} />}

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
//               <Skeleton h={12} w={80} /><br />
//               <Skeleton h={28} w={60} /><br />
//               <Skeleton h={10} w={100} />
//             </div>
//           ))
//           : (overview?.kpis ?? []).map((kpi: KPICard, i: number) => {
//             const Icon  = kpiIcons[i] ?? DollarSign;
//             const up    = kpiUp[i] ?? true;
//             const color = kpi.status === "good" ? C.success
//               : kpi.status === "warning" ? C.warning : C.error;
//             return (
//               <div key={kpi.label} className="rounded-xl border p-4"
//                 style={{ background: surface, borderColor: border }}>
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-8 h-8 rounded-lg flex items-center justify-center"
//                     style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
//                     <Icon size={14} color={C.primaryPurple} />
//                   </div>
//                   <span style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.06em" }}>
//                     {kpi.label}
//                   </span>
//                 </div>
//                 <p style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: "-0.5px" }}>
//                   {kpi.unit === "%" ? `${kpi.value}%` : `${kpi.value}${kpi.unit}`}
//                 </p>
//                 <div className="flex items-center gap-1 mt-1">
//                   {up
//                     ? <ArrowUpRight  size={11} color={C.success} />
//                     : <ArrowDownRight size={11} color={C.error}  />}
//                   {kpi.trend !== null && (
//                     <span style={{ fontSize: 11, color: sub }}>
//                       {kpi.trend > 0 ? "+" : ""}{kpi.trend}% vs sem. préc.
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         }
//       </div>

//       {overview && (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
//           {[
//             { label: "Latence p99",    value: `${overview.inference_p99_ms} ms`, color: overview.inference_p99_ms < 10 ? C.success : C.warning },
//             { label: "Modèles actifs", value: String(overview.active_models),    color: C.primaryPurple },
//             { label: "PSI global",     value: String(overview.psi_global),       color: overview.psi_global < 0.1 ? C.success : C.error },
//           ].map(({ label, value, color }) => (
//             <div key={label} className="rounded-xl border p-3"
//               style={{ background: surface, borderColor: border }}>
//               <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>
//               <p style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ONGLET DEMAND FORECAST
// // ═══════════════════════════════════════════════════════════════════════════════

// function ForecastTab({ dark }: { dark: boolean }) {
//   const sub       = dark ? C.gray7B      : C.lightSubtext;
//   const gridColor = dark ? "rgba(34,34,40,.7)"   : "rgba(229,231,235,.8)";
//   const tickColor = dark ? C.gray7B               : C.lightSubtext;

//   const [horizonH, setHorizonH] = useState(24);

//   // ── correct path: /api/demand-forecast (no trailing slash) ──────────────────
//   const { data, loading, error, refetch } =
//     useMLApi<DemandForecastResponse>(`/api/demand-forecast?horizon_h=${horizonH}`);

//   const chartPoints = (data?.points ?? []).map((p: ForecastPoint) => ({
//     hour:      p.hour,
//     actual:    p.actual,
//     predicted: p.predicted,
//     lower:     p.confidence_low,
//     upper:     p.confidence_high,
//   }));

//   const mae = data
//     ? data.points
//         .filter(p => p.actual !== null)
//         .reduce((acc, p) => acc + Math.abs((p.actual ?? 0) - p.predicted), 0) /
//       (data.points.filter(p => p.actual !== null).length || 1)
//     : 0;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {error && <ErrorBanner message={`Forecast : ${error}`} onRetry={refetch} />}

//       <div className="flex items-center gap-3">
//         <span style={{ fontSize: 12, color: sub }}>Horizon :</span>
//         {[6, 12, 24, 48].map(h => (
//           <button key={h} onClick={() => setHorizonH(h)}
//             className="px-3 py-1 rounded-lg text-xs font-semibold"
//             style={{
//               background: horizonH === h
//                 ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
//                 : "transparent",
//               color: horizonH === h ? "#fff" : sub,
//               border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
//             }}>
//             {h}h
//           </button>
//         ))}
//         {loading && <Loader2 size={14} color={C.primaryPurple} className="animate-spin ml-auto" />}
//       </div>

//       <Section dark={dark} title="Prévision de demande 24h"
//         subtitle={`LSTM + Prophet · MAPE ${data?.mape ?? "…"}% · R² ${data?.r2 ?? "…"}`}
//         icon={TrendingUp}
//         action={
//           data && (
//             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
//               style={{ background: "rgba(76,175,80,.1)", border: `1px solid ${C.success}33` }}>
//               <CheckCircle2 size={11} color={C.success} />
//               <span style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>
//                 Modèle sain · MAPE {data.mape}%
//               </span>
//             </div>
//           )
//         }
//       >
//         {loading
//           ? <Skeleton h={280} />
//           : (
//             <ResponsiveContainer width="100%" height={280}>
//               <AreaChart data={chartPoints} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
//                 <defs>
//                   <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor={C.primaryPurple} stopOpacity={0.08} />
//                     <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0.02} />
//                   </linearGradient>
//                   <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor={C.primaryPurple} stopOpacity={0.2} />
//                     <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//                 <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false}
//                   label={{ value: "Courses", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 10, dy: 40 }} />
//                 <Tooltip content={<CustomTooltip dark={dark} />} />
//                 <Area type="monotone" dataKey="upper"     name="IC haut"  stroke="none" fill="url(#confBand)" />
//                 <Area type="monotone" dataKey="lower"     name="IC bas"   stroke="none" fill={dark ? "#0B0B0F" : "#F4F4F8"} />
//                 <Area type="monotone" dataKey="predicted" name="Prédit"
//                   stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#predGrad)" strokeDasharray="6 3" dot={false} />
//                 <Line type="monotone" dataKey="actual" name="Réel"
//                   stroke={C.success} strokeWidth={2.5}
//                   dot={{ fill: C.success, r: 3 }} connectNulls={false} />
//               </AreaChart>
//             </ResponsiveContainer>
//           )
//         }
//       </Section>

//       {data && (
//         <Section dark={dark} title="Métriques de performance" subtitle="Évaluation glissante 30 jours" icon={Target}>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
//             {[
//               { label: "MAPE",     value: `${data.mape}%`,          color: C.success       },
//               { label: "R² Score", value: data.r2.toFixed(3),       color: C.success       },
//               { label: "MAE",      value: mae.toFixed(1),           color: C.primaryPurple },
//               { label: "Horizon",  value: `${data.horizon_h}h`,     color: C.primaryPurple },
//               { label: "Zone lat", value: data.zone_lat.toFixed(4), color: sub             },
//               { label: "Zone lon", value: data.zone_lon.toFixed(4), color: sub             },
//             ].map(({ label, value, color }) => (
//               <div key={label} className="rounded-lg p-3"
//                 style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
//                 <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</p>
//                 <p style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: "-0.3px" }}>{value}</p>
//               </div>
//             ))}
//           </div>
//         </Section>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ONGLET ANOMALIES
// // ═══════════════════════════════════════════════════════════════════════════════

// function AnomaliesTab({ dark }: { dark: boolean }) {
//   const surface = dark ? C.darkSurface : C.lightSurface;
//   const border  = dark ? C.darkBorder  : C.lightBorder;
//   const text    = dark ? C.darkText    : C.lightText;
//   const sub     = dark ? C.gray7B      : C.lightSubtext;

//   const [severity, setSeverity] = useState<"" | "HIGH" | "MEDIUM" | "LOW">("");

//   // ── correct path: /api/anomalies (no trailing slash) ────────────────────────
//   const apiPath = `/api/anomalies${severity ? `?severity=${severity}` : ""}`;
//   const { data, loading, error, refetch } =
//     useMLApi<AnomaliesResponse>(apiPath, { refreshInterval: 30_000 });

//   const highCount = (data?.anomalies ?? []).filter(a => a.severity === "HIGH").length;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//       {error && <ErrorBanner message={`Anomalies : ${error}`} onRetry={refetch} />}

//       <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
//         style={{ background: "rgba(255,59,48,.06)", borderColor: "rgba(255,59,48,.25)" }}>
//         <AlertTriangle size={16} color={C.error} />
//         <span style={{ fontSize: 13, fontWeight: 600, color: C.error }}>
//           {loading ? "Chargement…" : `${highCount} anomalie(s) HIGH détectée(s)`}
//         </span>
//         <span style={{ fontSize: 12, color: sub, marginLeft: "auto" }}>
//           Isolation Forest + résidus LSTM
//         </span>
//       </div>

//       <div className="flex gap-2">
//         {(["", "HIGH", "MEDIUM", "LOW"] as const).map(s => (
//           <button key={s} onClick={() => setSeverity(s)}
//             className="px-3 py-1 rounded-lg text-xs font-semibold"
//             style={{
//               background: severity === s
//                 ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
//                 : "transparent",
//               color: severity === s ? "#fff" : sub,
//               border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
//             }}>
//             {s || "Toutes"}
//           </button>
//         ))}
//         {loading && <Loader2 size={14} color={C.primaryPurple} className="animate-spin ml-1 self-center" />}
//       </div>

//       {loading && !data
//         ? Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
//             <Skeleton h={14} w={120} /><br />
//             <Skeleton h={12} /><br />
//             <Skeleton h={12} w="60%" />
//           </div>
//         ))
//         : (data?.anomalies ?? []).map((a: AnomalyItem, i: number) => (
//           <div key={i} className="rounded-xl border p-4"
//             style={{
//               background: surface,
//               borderColor: a.severity === "HIGH" ? `${C.error}44` : border,
//             }}>
//             <div className="flex items-start gap-3">
//               <div className="flex flex-col gap-2 flex-1">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <SeverityBadge severity={a.severity} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{a.alert_type}</span>
//                   <span style={{ fontSize: 11, color: sub, marginLeft: "auto" }}>
//                     Score : <b style={{ color: C.primaryPurple }}>{(a.score * 100).toFixed(0)}%</b>
//                   </span>
//                 </div>
//                 <p style={{ fontSize: 12, color: sub, lineHeight: 1.6 }}>{a.description}</p>
//                 <div className="flex items-center gap-4 flex-wrap">
//                   {a.metadata.impact && (
//                     <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
//                       style={{ background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)" }}>
//                       <TrendingDown size={12} color={C.error} />
//                       <span style={{ fontSize: 11, color: text, fontWeight: 600 }}>
//                         Impact : {a.metadata.impact}
//                       </span>
//                     </div>
//                   )}
//                   {a.metadata.action && (
//                     <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
//                       style={{ background: "rgba(168,85,247,.08)" }}>
//                       <Zap size={12} color={C.primaryPurple} />
//                       <span style={{ fontSize: 11, color: C.primaryPurple, fontWeight: 600 }}>
//                         Action : {a.metadata.action}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
//                 style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`, color: "#fff", border: "none" }}>
//                 Corriger <ChevronRight size={11} />
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mt-3 pt-3"
//               style={{ borderTop: `1px solid ${border}` }}>
//               <span style={{ fontSize: 10, color: sub }}>Confiance ML</span>
//               <div style={{ flex: 1, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
//                 <div style={{
//                   width: `${a.score * 100}%`, height: "100%", borderRadius: 2,
//                   background: a.score > 0.9 ? C.error : a.score > 0.75 ? C.warning : C.gray7B,
//                 }} />
//               </div>
//               <span style={{ fontSize: 10, fontWeight: 700, color: a.score > 0.9 ? C.error : C.warning }}>
//                 {(a.score * 100).toFixed(0)}%
//               </span>
//             </div>
//           </div>
//         ))
//       }
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ONGLET MODEL REGISTRY
// // ═══════════════════════════════════════════════════════════════════════════════

// function ModelsTab({ dark }: { dark: boolean }) {
//   const surface = dark ? C.darkSurface : C.lightSurface;
//   const border  = dark ? C.darkBorder  : C.lightBorder;
//   const text    = dark ? C.darkText    : C.lightText;
//   const sub     = dark ? C.gray7B      : C.lightSubtext;

//   // ── correct path: /api/model-registry (no trailing slash) ───────────────────
//   const { data, loading, error, refetch } =
//     useMLApi<RegistryResponse>("/api/model-registry");

//   // ── correct path: /api/model-registry/retrain ───────────────────────────────
//   const { loading: retraining, post: triggerRetrain } =
//     useMLPost<RetrainResponse>("/api/model-registry/retrain");

//   const [retrainResult, setRetrainResult] = useState<RetrainResponse | null>(null);

//   const handleRetrain = useCallback(async (modelName: string) => {
//     const body: RetrainRequest = {
//       model_name:    modelName,
//       lookback_days: 60,
//       reason:        "Déclenché depuis le dashboard",
//     };
//     const res = await triggerRetrain(body);
//     if (res) setRetrainResult(res);
//   }, [triggerRetrain]);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {error && <ErrorBanner message={`Registry : ${error}`} onRetry={refetch} />}

//       {retrainResult && (
//         <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
//           style={{ background: "rgba(76,175,80,.06)", borderColor: `${C.success}44` }}>
//           <CheckCircle2 size={16} color={C.success} />
//           <span style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>
//             Ré-entraînement lancé · run_id : <code>{retrainResult.run_id}</code>
//           </span>
//           <button onClick={() => setRetrainResult(null)}
//             style={{ marginLeft: "auto", background: "none", border: "none", color: sub, cursor: "pointer" }}>
//             ✕
//           </button>
//         </div>
//       )}

//       <div className="rounded-xl border overflow-hidden" style={{ background: surface, borderColor: border }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ borderBottom: `1px solid ${border}` }}>
//               {["Statut", "Modèle", "Version", "Précision", "Métrique", "PSI", "Actions"].map(h => (
//                 <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: sub }}>
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading
//               ? Array.from({ length: 5 }).map((_, i) => (
//                 <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
//                   {Array.from({ length: 7 }).map((__, j) => (
//                     <td key={j} style={{ padding: "12px 16px" }}><Skeleton h={12} w={60} /></td>
//                   ))}
//                 </tr>
//               ))
//               : (data?.models ?? []).map((m: ModelInfo, i: number) => {
//                 const uiStatus  = m.status === "production" ? "healthy"
//                   : m.status === "degraded" ? (m.metric_value < 88 ? "critical" : "warning")
//                   : "warning";
//                 const isDegraded = m.status === "degraded";

//                 return (
//                   <tr key={m.name}
//                     style={{
//                       borderBottom: i < (data?.models.length ?? 0) - 1 ? `1px solid ${border}` : "none",
//                       background: isDegraded ? "rgba(255,59,48,.03)" : "transparent",
//                     }}>
//                     <td style={{ padding: "12px 16px" }}><ModelStatusDot status={uiStatus} /></td>
//                     <td style={{ padding: "12px 16px" }}>
//                       <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{m.name}</span>
//                     </td>
//                     <td style={{ padding: "12px 16px", fontSize: 11, color: sub }}>v{m.version}</td>
//                     <td style={{ padding: "12px 16px" }}>
//                       <div className="flex items-center gap-2">
//                         <div style={{ width: 60, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
//                           <div style={{
//                             width: `${m.metric_value > 1 ? m.metric_value : m.metric_value * 100}%`,
//                             height: "100%",
//                             background: m.metric_value > 93 ? C.success : m.metric_value > 88 ? C.warning : C.error,
//                             borderRadius: 3,
//                           }} />
//                         </div>
//                         <span style={{ fontSize: 12, fontWeight: 700, color: m.metric_value > 93 ? C.success : m.metric_value > 88 ? C.warning : C.error }}>
//                           {m.metric_value}{m.primary_metric.includes("%") ? "%" : ""}
//                         </span>
//                       </div>
//                     </td>
//                     <td style={{ padding: "12px 16px", fontSize: 11, color: sub }}>{m.primary_metric}</td>
//                     <td style={{ padding: "12px 16px", fontSize: 12, color: m.psi_score && m.psi_score > 0.1 ? C.error : C.success }}>
//                       {m.psi_score?.toFixed(3) ?? "N/A"}
//                     </td>
//                     <td style={{ padding: "12px 16px" }}>
//                       <div className="flex items-center gap-1.5">
//                         <button className="px-2.5 py-1 rounded text-xs font-semibold"
//                           style={{ background: "rgba(168,85,247,.12)", color: C.primaryPurple, border: "none" }}>
//                           Détails
//                         </button>
//                         {isDegraded && (
//                           <button
//                             onClick={() => handleRetrain(m.name)}
//                             disabled={retraining}
//                             className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold"
//                             style={{ background: "rgba(255,59,48,.12)", color: C.error, border: "none", opacity: retraining ? 0.6 : 1 }}>
//                             {retraining ? <Loader2 size={10} className="animate-spin" /> : null}
//                             Retrain
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             }
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // COMPOSANT PRINCIPAL
// // ═══════════════════════════════════════════════════════════════════════════════

// export function AIInsightsPage({ dark }: { dark: boolean }) {
//   const [activeTab, setActiveTab] =
//     useState<"overview" | "forecast" | "anomalies" | "models">("overview");

//   const surface = dark ? C.darkSurface : C.lightSurface;
//   const border  = dark ? C.darkBorder  : C.lightBorder;
//   const text    = dark ? C.darkText    : C.lightText;
//   const sub     = dark ? C.gray7B      : C.lightSubtext;

//   // ── correct path: /api/model-registry/retrain ───────────────────────────────
//   const { loading: retrainAll, post: triggerRetrainAll } =
//     useMLPost<RetrainResponse>("/api/model-registry/retrain");

//   const handleRetrainAll = useCallback(() => {
//     triggerRetrainAll({
//       model_name:    "demand-forecast",
//       lookback_days: 60,
//       reason:        "Full retrain from dashboard",
//     });
//   }, [triggerRetrainAll]);

//   const tabs = [
//     { id: "overview",  label: "Overview",        icon: BarChart2     },
//     { id: "forecast",  label: "Demand Forecast",  icon: TrendingUp    },
//     { id: "anomalies", label: "Anomalies",         icon: AlertTriangle },
//     { id: "models",    label: "Model Registry",    icon: Cpu           },
//   ] as const;

//   return (
//     <>
//       <style>{`
//         @keyframes shimmer {
//           0%   { background-position: -200% 0; }
//           100% { background-position:  200% 0; }
//         }
//         .animate-spin { animation: spin 1s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>

//       <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <Brain size={18} color={C.primaryPurple} />
//               <h2 style={{ fontSize: 18, fontWeight: 700, color: text }}>AI Intelligence Report</h2>
//               <span className="px-2 py-0.5 rounded text-xs font-bold"
//                 style={{ background: "rgba(168,85,247,.15)", color: C.primaryPurple }}>
//                 ML v3.4.1
//               </span>
//             </div>
//             <p style={{ fontSize: 12, color: sub }}>
//               6 modèles ML en production · Rafraîchissement automatique 30 s
//             </p>
//           </div>
//           <button
//             onClick={handleRetrainAll}
//             disabled={retrainAll}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
//             style={{
//               background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
//               color: "#fff", border: "none", opacity: retrainAll ? 0.7 : 1,
//             }}>
//             {retrainAll ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
//             Retrain Models
//           </button>
//         </div>

//         <div className="flex gap-1 p-1 rounded-xl border" style={{ background: surface, borderColor: border }}>
//           {tabs.map(({ id, label, icon: Icon }) => (
//             <button key={id} onClick={() => setActiveTab(id)}
//               className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-1 justify-center"
//               style={{
//                 background: activeTab === id
//                   ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
//                   : "transparent",
//                 color:  activeTab === id ? "#fff" : sub,
//                 border: "none",
//                 transition: "background .2s",
//               }}>
//               <Icon size={12} />
//               {label}
//             </button>
//           ))}
//         </div>

//         {activeTab === "overview"  && <OverviewTab  dark={dark} />}
//         {activeTab === "forecast"  && <ForecastTab  dark={dark} />}
//         {activeTab === "anomalies" && <AnomaliesTab dark={dark} />}
//         {activeTab === "models"    && <ModelsTab    dark={dark} />}
//       </div>
//     </>
//   );
// }
import { useState, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle,
  Zap, Target, BarChart2, ChevronRight, RefreshCw,
  Cpu, Activity, ArrowUpRight, ArrowDownRight,
  Users, DollarSign, Map,
  CheckCircle2, XCircle, Info, WifiOff, Loader2,
} from "lucide-react";

import { C } from "./tokens";
import { CustomTooltip } from "./CustomTooltip";
import { useMLApi, useMLPost } from "./useMLApi";
import type {
  OverviewResponse, DemandForecastResponse, AnomaliesResponse,
  RegistryResponse, ChurnResponse, SurgeZonesResponse,
  DriverRadarResponse, RevenueOptResponse,
  RetrainRequest, RetrainResponse,
  KPICard, AnomalyItem, ModelInfo, ForecastPoint,
  ChurnDriver, SurgeZone,
} from "./api";

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const cfg: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
    HIGH:   { bg: "rgba(255,59,48,.12)",  color: C.error,   icon: XCircle      },
    MEDIUM: { bg: "rgba(255,149,0,.12)",  color: C.warning, icon: AlertTriangle },
    LOW:    { bg: "rgba(75,159,255,.12)", color: "#4B9FFF", icon: Info          },
  };
  const { bg, color, icon: Icon } = cfg[severity] ?? { bg: "rgba(123,123,133,.12)", color: C.gray7B, icon: Info };
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: bg, color, fontSize: 10, fontWeight: 700 }}>
      <Icon size={10} />{severity}
    </span>
  );
}

function ModelStatusDot({ status }: { status: string }) {
  const color = ({ healthy: C.success, warning: C.warning, critical: C.error } as Record<string, string>)[status] ?? C.gray7B;
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />;
}

function Skeleton({ h = 16, w = "100%", radius = 6 }: { h?: number; w?: number | string; radius?: number }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: radius,
      background: "linear-gradient(90deg,rgba(128,128,128,.1) 25%,rgba(128,128,128,.2) 50%,rgba(128,128,128,.1) 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
    }} />
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
      style={{ background: "rgba(255,59,48,.06)", borderColor: "rgba(255,59,48,.25)" }}>
      <WifiOff size={16} color={C.error} />
      <span style={{ fontSize: 13, color: C.error, fontWeight: 600 }}>{message}</span>
      <button onClick={onRetry}
        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
        style={{ background: "rgba(255,59,48,.15)", color: C.error, border: "none" }}>
        <RefreshCw size={11} /> Réessayer
      </button>
    </div>
  );
}

function Section({ title, subtitle, icon: Icon, children, dark, action }: {
  title: string; subtitle?: string; icon: React.ElementType;
  children: React.ReactNode; dark: boolean; action?: React.ReactNode;
}) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;
  return (
    <div className="rounded-xl border" style={{ background: surface, borderColor: border }}>
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
            <Icon size={15} color={C.primaryPurple} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: text }}>{title}</p>
            {subtitle && <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────
// Endpoints used:
//   GET /intelligence/overview                       → KPIs, inference_p99_ms, active_models, psi_global
//   GET /intelligence/overview?section=revenue_opt  → revenue optimisation weeks + avg_uplift_per_week
//   GET /intelligence/overview?section=driver_radar → radar points {subject, top, avg}
//   GET /demand-forecast/surge                       → surge zones {zone, risk, revenue, drivers, demand}
//   GET /anomalies/churn                             → churn drivers {driver_id, name, churn_risk, total_trips}

function OverviewTab({ dark }: { dark: boolean }) {
  const surface   = dark ? C.darkSurface : C.lightSurface;
  const border    = dark ? C.darkBorder  : C.lightBorder;
  const text      = dark ? C.darkText    : C.lightText;
  const sub       = dark ? C.gray7B      : C.lightSubtext;
  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B            : C.lightSubtext;

  const { data: overview,  loading: loadOv,  error: errOv,  refetch: retOv  } =
    useMLApi<OverviewResponse>("/api/intelligence/overview", { refreshInterval: 30_000 });

  const { data: revData,   loading: loadRv,  error: errRv,  refetch: retRv  } =
    useMLApi<RevenueOptResponse>("/api/intelligence/overview?section=revenue_opt");

  const { data: radarData, loading: loadRd,  error: errRd,  refetch: retRd  } =
    useMLApi<DriverRadarResponse>("/api/intelligence/overview?section=driver_radar");

  const { data: surgeData, loading: loadSg,  error: errSg,  refetch: retSg  } =
    useMLApi<SurgeZonesResponse>("/api/demand-forecast/surge");

  const { data: churnData, loading: loadCh,  error: errCh,  refetch: retCh  } =
    useMLApi<ChurnResponse>("/api/anomalies/churn");

  const kpiIcons = [DollarSign, Target, Zap, Users];
  const kpiUp    = [true, true, true, false];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {errOv && <ErrorBanner message={`Overview : ${errOv}`} onRetry={retOv} />}
      {errRv && <ErrorBanner message={`Revenue : ${errRv}`}  onRetry={retRv} />}
      {errSg && <ErrorBanner message={`Surge : ${errSg}`}    onRetry={retSg} />}
      {errCh && <ErrorBanner message={`Churn : ${errCh}`}    onRetry={retCh} />}

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {loadOv
          ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
              <Skeleton h={12} w={80} /><br /><Skeleton h={28} w={60} /><br /><Skeleton h={10} w={100} />
            </div>
          ))
          : (overview?.kpis ?? []).map((kpi: KPICard, i: number) => {
            const Icon  = kpiIcons[i] ?? DollarSign;
            const up    = kpiUp[i] ?? true;
            const color = kpi.status === "good" ? C.success : kpi.status === "warning" ? C.warning : C.error;
            return (
              <div key={kpi.label} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: dark ? C.iconBgDark : C.iconBgLight }}>
                    <Icon size={14} color={C.primaryPurple} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {kpi.label}
                  </span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: "-0.5px" }}>
                  {kpi.unit === "%" ? `${kpi.value}%` : `${kpi.value}${kpi.unit}`}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {up ? <ArrowUpRight size={11} color={C.success} /> : <ArrowDownRight size={11} color={C.error} />}
                  {kpi.trend !== null && (
                    <span style={{ fontSize: 11, color: sub }}>
                      {kpi.trend > 0 ? "+" : ""}{kpi.trend}% vs sem. préc.
                    </span>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Inference / models / PSI */}
      {overview && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "Latence p99",    value: `${overview.inference_p99_ms} ms`, color: overview.inference_p99_ms < 10 ? C.success : C.warning },
            { label: "Modèles actifs", value: String(overview.active_models),    color: C.primaryPurple },
            { label: "PSI global",     value: String(overview.psi_global),       color: overview.psi_global < 0.1 ? C.success : C.error },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
              <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Revenue optimisation + Surge zones */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <Section dark={dark} title="Revenue Optimization"
          subtitle="Baseline vs ML-optimized (8 semaines)" icon={TrendingUp}>
          {loadRv
            ? <Skeleton h={200} />
            : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revData?.weeks ?? []} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.gray7B}        stopOpacity={0.2} />
                        <stop offset="100%" stopColor={C.gray7B}        stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="week" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip dark={dark} prefix="$" />} />
                    <Area type="monotone" dataKey="baseline"  name="Baseline"
                      stroke={C.gray7B}        strokeWidth={2}   fill="url(#baseGrad)" strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="optimized" name="Optimized"
                      stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#optGrad)"
                      dot={{ fill: C.primaryPurple, r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2">
                  {[{ label: "Baseline", color: C.gray7B }, { label: "ML Optimized", color: C.primaryPurple }].map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 11, color: sub }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                      {label}
                    </span>
                  ))}
                  {revData?.avg_uplift_per_week && (
                    <span className="ml-auto" style={{ fontSize: 12, fontWeight: 700, color: C.success }}>
                      +${revData.avg_uplift_per_week.toLocaleString()} moy./semaine
                    </span>
                  )}
                </div>
              </>
            )
          }
        </Section>

        <Section dark={dark} title="Surge Zone Scores" subtitle="Risque ML × potentiel revenu" icon={Map}>
          {loadSg
            ? <Skeleton h={160} />
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(surgeData?.zones ?? []).map((z: SurgeZone) => (
                  <div key={z.zone} className="flex items-center gap-3 rounded-lg px-3 py-2"
                    style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: text, minWidth: 80 }}>{z.zone}</span>
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                      <div style={{
                        width: `${z.risk}%`, height: "100%", borderRadius: 3,
                        background: z.risk > 80 ? C.error : z.risk > 60 ? C.warning : C.primaryPurple,
                      }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, minWidth: 28, color: z.risk > 80 ? C.error : z.risk > 60 ? C.warning : C.primaryPurple }}>
                      {z.risk}%
                    </span>
                    <span style={{ fontSize: 10, color: sub, minWidth: 50, textAlign: "right" }}>
                      ${(z.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </Section>
      </div>

      {/* Driver radar + churn */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
        <Section dark={dark} title="Driver Performance Radar"
          subtitle="Top quartile vs flotte moyenne" icon={Activity}>
          {loadRd
            ? <Skeleton h={220} />
            : (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData?.points ?? []}>
                  <PolarGrid stroke={dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: tickColor, fontSize: 10 }} />
                  <Radar name="Top Drivers" dataKey="top" stroke={C.primaryPurple} fill={C.primaryPurple} fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Avg Fleet"   dataKey="avg" stroke={C.warning}       fill={C.warning}       fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
                  <Tooltip content={<CustomTooltip dark={dark} />} />
                </RadarChart>
              </ResponsiveContainer>
            )
          }
          <div className="flex gap-4 justify-center mt-1">
            {[{ label: "Top Drivers", color: C.primaryPurple }, { label: "Avg Fleet", color: C.warning }].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 11, color: sub }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>
        </Section>

        <Section dark={dark} title="Driver Churn Risk Model"
          subtitle="Random Forest + SMOTE · 87.5% accuracy · AUC 0.92" icon={Users}>
          {loadCh
            ? <Skeleton h={200} />
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {(churnData?.drivers ?? [])
                  .slice()
                  .sort((a: ChurnDriver, b: ChurnDriver) => b.churn_risk - a.churn_risk)
                  .map((d: ChurnDriver) => (
                    <div key={d.driver_id} className="flex items-center gap-3 rounded-lg px-3 py-2 border"
                      style={{
                        background: dark ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.02)",
                        borderColor: d.churn_risk > 60 ? `${C.error}33` : "transparent",
                      }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: d.churn_risk > 60 ? C.error : d.churn_risk > 40 ? C.warning : C.success, fontSize: 9, fontWeight: 700 }}>
                        {d.name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: text, minWidth: 72 }}>{d.name}</span>
                      <div style={{ flex: 1, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                        <div style={{
                          width: `${d.churn_risk}%`, height: "100%", borderRadius: 3,
                          background: d.churn_risk > 60 ? C.error : d.churn_risk > 40 ? C.warning : C.success,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, minWidth: 36, color: d.churn_risk > 60 ? C.error : d.churn_risk > 40 ? C.warning : C.success }}>
                        {d.churn_risk}%
                      </span>
                      <span style={{ fontSize: 10, color: sub, minWidth: 52, textAlign: "right" }}>{d.total_trips} trips</span>
                      {d.churn_risk > 60 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: C.error, background: "rgba(255,59,48,.1)", padding: "2px 5px", borderRadius: 4 }}>
                          AT RISK
                        </span>
                      )}
                    </div>
                  ))
                }
              </div>
            )
          }
        </Section>
      </div>
    </div>
  );
}

// ── Tab: Demand Forecast ──────────────────────────────────────────────────────
// Endpoints used:
//   GET /demand-forecast?horizon_h={h}  → points, mape, r2, horizon_h, zone_lat, zone_lon

function ForecastTab({ dark }: { dark: boolean }) {
  const sub       = dark ? C.gray7B      : C.lightSubtext;
  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B            : C.lightSubtext;

  const [horizonH, setHorizonH] = useState(24);

  const { data, loading, error, refetch } =
    useMLApi<DemandForecastResponse>(`/api/demand-forecast?horizon_h=${horizonH}`);

  const chartPoints = (data?.points ?? []).map((p: ForecastPoint) => ({
    hour: p.hour, actual: p.actual, predicted: p.predicted,
    lower: p.confidence_low, upper: p.confidence_high,
  }));

  const mae = data
    ? data.points.filter(p => p.actual !== null)
        .reduce((acc, p) => acc + Math.abs((p.actual ?? 0) - p.predicted), 0) /
      (data.points.filter(p => p.actual !== null).length || 1)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <ErrorBanner message={`Forecast : ${error}`} onRetry={refetch} />}

      <div className="flex items-center gap-3">
        <span style={{ fontSize: 12, color: sub }}>Horizon :</span>
        {[6, 12, 24, 48].map(h => (
          <button key={h} onClick={() => setHorizonH(h)}
            className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: horizonH === h
                ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
                : "transparent",
              color: horizonH === h ? "#fff" : sub,
              border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
            }}>
            {h}h
          </button>
        ))}
        {loading && <Loader2 size={14} color={C.primaryPurple} className="animate-spin ml-auto" />}
      </div>

      <Section dark={dark} title="Prévision de demande"
        subtitle={`LSTM + Prophet · MAPE ${data?.mape ?? "…"}% · R² ${data?.r2 ?? "…"}`}
        icon={TrendingUp}
        action={data && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(76,175,80,.1)", border: `1px solid ${C.success}33` }}>
            <CheckCircle2 size={11} color={C.success} />
            <span style={{ fontSize: 11, color: C.success, fontWeight: 600 }}>
              Modèle sain · MAPE {data.mape}%
            </span>
          </div>
        )}>
        {loading
          ? <Skeleton h={280} />
          : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartPoints} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.primaryPurple} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false}
                  label={{ value: "Courses", angle: -90, position: "insideLeft", fill: tickColor, fontSize: 10, dy: 40 }} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Area type="monotone" dataKey="upper"     name="IC haut" stroke="none" fill="url(#confBand)" />
                <Area type="monotone" dataKey="lower"     name="IC bas"  stroke="none" fill={dark ? "#0B0B0F" : "#F4F4F8"} />
                <Area type="monotone" dataKey="predicted" name="Prédit"
                  stroke={C.primaryPurple} strokeWidth={2.5} fill="url(#predGrad)" strokeDasharray="6 3" dot={false} />
                <Line type="monotone" dataKey="actual" name="Réel"
                  stroke={C.success} strokeWidth={2.5}
                  dot={{ fill: C.success, r: 3 }} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          )
        }
      </Section>

      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Section dark={dark} title="Erreur de prédiction par heure" subtitle="MAE par créneau horaire" icon={BarChart2}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={data.points.filter(p => p.actual !== null).map(p => ({
                  hour:  p.hour,
                  error: Math.abs((p.actual ?? 0) - p.predicted),
                }))}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="hour" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Bar dataKey="error" name="MAE" fill={C.primaryPurple} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section dark={dark} title="Métriques de performance" subtitle="Évaluation glissante 30 jours" icon={Target}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                { label: "MAPE",     value: `${data.mape}%`,          color: C.success       },
                { label: "R² Score", value: data.r2.toFixed(3),       color: C.success       },
                { label: "MAE",      value: mae.toFixed(1),           color: C.primaryPurple },
                { label: "Horizon",  value: `${data.horizon_h}h`,     color: C.primaryPurple },
                { label: "Zone lat", value: data.zone_lat.toFixed(4), color: sub             },
                { label: "Zone lon", value: data.zone_lon.toFixed(4), color: sub             },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg p-3"
                  style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
                  <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: "-0.3px" }}>{value}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

// ── Tab: Anomalies ────────────────────────────────────────────────────────────
// Endpoints used:
//   GET /anomalies[?severity=HIGH|MEDIUM|LOW]  → anomalies list

function AnomaliesTab({ dark }: { dark: boolean }) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const [severity, setSeverity] = useState<"" | "HIGH" | "MEDIUM" | "LOW">("");

  const { data, loading, error, refetch } =
    useMLApi<AnomaliesResponse>(
      `/api/anomalies${severity ? `?severity=${severity}` : ""}`,
      { refreshInterval: 30_000 }
    );

  const highCount = (data?.anomalies ?? []).filter(a => a.severity === "HIGH").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <ErrorBanner message={`Anomalies : ${error}`} onRetry={refetch} />}

      <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{ background: "rgba(255,59,48,.06)", borderColor: "rgba(255,59,48,.25)" }}>
        <AlertTriangle size={16} color={C.error} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.error }}>
          {loading ? "Chargement…" : `${highCount} anomalie(s) HIGH détectée(s)`}
        </span>
        <span style={{ fontSize: 12, color: sub, marginLeft: "auto" }}>
          IsolationForest + résidus LSTM
        </span>
      </div>

      <div className="flex gap-2">
        {(["", "HIGH", "MEDIUM", "LOW"] as const).map(s => (
          <button key={s} onClick={() => setSeverity(s)}
            className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: severity === s
                ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
                : "transparent",
              color: severity === s ? "#fff" : sub,
              border: `1px solid ${dark ? C.darkBorder : C.lightBorder}`,
            }}>
            {s || "Toutes"}
          </button>
        ))}
        {loading && <Loader2 size={14} color={C.primaryPurple} className="animate-spin ml-1 self-center" />}
      </div>

      {loading && !data
        ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
            <Skeleton h={14} w={120} /><br /><Skeleton h={12} /><br /><Skeleton h={12} w="60%" />
          </div>
        ))
        : (data?.anomalies ?? []).map((a: AnomalyItem, i: number) => (
          <div key={i} className="rounded-xl border p-4"
            style={{ background: surface, borderColor: a.severity === "HIGH" ? `${C.error}44` : border }}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={a.severity} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{a.alert_type}</span>
                  <span style={{ fontSize: 11, color: sub, marginLeft: "auto" }}>
                    Score : <b style={{ color: C.primaryPurple }}>{(a.score * 100).toFixed(0)}%</b>
                  </span>
                </div>
                <p style={{ fontSize: 12, color: sub, lineHeight: 1.6 }}>{a.description}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {a.metadata.impact && (
                    <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                      style={{ background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)" }}>
                      <TrendingDown size={12} color={C.error} />
                      <span style={{ fontSize: 11, color: text, fontWeight: 600 }}>Impact : {a.metadata.impact}</span>
                    </div>
                  )}
                  {a.metadata.action && (
                    <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                      style={{ background: "rgba(168,85,247,.08)" }}>
                      <Zap size={12} color={C.primaryPurple} />
                      <span style={{ fontSize: 11, color: C.primaryPurple, fontWeight: 600 }}>Action : {a.metadata.action}</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`, color: "#fff", border: "none" }}>
                Corriger <ChevronRight size={11} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: 10, color: sub }}>Confiance ML</span>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                <div style={{
                  width: `${a.score * 100}%`, height: "100%", borderRadius: 2,
                  background: a.score > 0.9 ? C.error : a.score > 0.75 ? C.warning : C.gray7B,
                }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: a.score > 0.9 ? C.error : C.warning }}>
                {(a.score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── Tab: Model Registry ───────────────────────────────────────────────────────
// Endpoints used:
//   GET  /model-registry               → models list
//   GET  /model-registry/drift/report  → infra cards array
//   POST /model-registry/retrain       → trigger retrain

function ModelsTab({ dark }: { dark: boolean }) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const { data,            loading,     error,   refetch    } = useMLApi<RegistryResponse>("/api/model-registry");
  const { data: driftData, loading: loadDrift                } = useMLApi<{ infra: Array<{ title: string; value: string; label: string; color: string; detail: string }> }>("/api/model-registry/drift/report");
  const { loading: retraining, post: triggerRetrain          } = useMLPost<RetrainResponse>("/api/model-registry/retrain");

  const [retrainResult, setRetrainResult] = useState<RetrainResponse | null>(null);

  const handleRetrain = useCallback(async (modelName: string) => {
    const res = await triggerRetrain({ model_name: modelName, lookback_days: 60, reason: "Déclenché depuis le dashboard" } as RetrainRequest);
    if (res) setRetrainResult(res);
  }, [triggerRetrain]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <ErrorBanner message={`Registry : ${error}`} onRetry={refetch} />}

      {retrainResult && (
        <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{ background: "rgba(76,175,80,.06)", borderColor: `${C.success}44` }}>
          <CheckCircle2 size={16} color={C.success} />
          <span style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>
            Ré-entraînement lancé · run_id : <code>{retrainResult.run_id}</code>
          </span>
          <button onClick={() => setRetrainResult(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: sub, cursor: "pointer" }}>✕</button>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: surface, borderColor: border }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Statut","Modèle","Version","Précision","Métrique","PSI","Actions"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: sub }}>
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
              : (data?.models ?? []).map((m: ModelInfo, i: number) => {
                const uiStatus   = m.status === "production" ? "healthy"
                  : m.status === "degraded" ? (m.metric_value < 88 ? "critical" : "warning")
                  : "warning";
                const isDegraded = m.status === "degraded";
                return (
                  <tr key={m.name}
                    style={{
                      borderBottom: i < (data?.models.length ?? 0) - 1 ? `1px solid ${border}` : "none",
                      background: isDegraded ? "rgba(255,59,48,.03)" : "transparent",
                    }}>
                    <td style={{ padding: "12px 16px" }}><ModelStatusDot status={uiStatus} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{m.name}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 11, color: sub }}>v{m.version}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 60, height: 5, borderRadius: 3, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
                          <div style={{
                            width: `${m.metric_value > 1 ? m.metric_value : m.metric_value * 100}%`, height: "100%",
                            background: m.metric_value > 93 ? C.success : m.metric_value > 88 ? C.warning : C.error,
                            borderRadius: 3,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: m.metric_value > 93 ? C.success : m.metric_value > 88 ? C.warning : C.error }}>
                          {m.metric_value}{m.primary_metric.includes("%") ? "%" : ""}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 11, color: sub }}>{m.primary_metric}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: m.psi_score && m.psi_score > 0.1 ? C.error : C.success }}>
                      {m.psi_score?.toFixed(3) ?? "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-1.5">
                        <button className="px-2.5 py-1 rounded text-xs font-semibold"
                          style={{ background: "rgba(168,85,247,.12)", color: C.primaryPurple, border: "none" }}>
                          Détails
                        </button>
                        {isDegraded && (
                          <button onClick={() => handleRetrain(m.name)} disabled={retraining}
                            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold"
                            style={{ background: "rgba(255,59,48,.12)", color: C.error, border: "none", opacity: retraining ? 0.6 : 1 }}>
                            {retraining && <Loader2 size={10} className="animate-spin" />}
                            Retrain
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

      {/* Infra cards from drift/report */}
      {loadDrift
        ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
                <Skeleton h={60} />
              </div>
            ))}
          </div>
        )
        : driftData?.infra && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {driftData.infra.map(({ title, value, label, color, detail }) => (
              <div key={title} className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
                <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{title}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
                <p style={{ fontSize: 11, color: sub, marginTop: 2 }}>{label}</p>
                <p style={{ fontSize: 10, color: dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function AIInsightsPage({ dark }: { dark: boolean }) {
  const [activeTab, setActiveTab] =
    useState<"overview" | "forecast" | "anomalies" | "models">("overview");

  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const { loading: retrainAll, post: triggerRetrainAll } =
    useMLPost<RetrainResponse>("/api/model-registry/retrain");

  const handleRetrainAll = useCallback(() => {
    triggerRetrainAll({ model_name: "all", lookback_days: 60, reason: "Full retrain from dashboard" } as RetrainRequest);
  }, [triggerRetrainAll]);

  const tabs = [
    { id: "overview",  label: "Overview",       icon: BarChart2     },
    { id: "forecast",  label: "Demand Forecast", icon: TrendingUp    },
    { id: "anomalies", label: "Anomalies",        icon: AlertTriangle },
    { id: "models",    label: "Model Registry",   icon: Cpu           },
  ] as const;

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain size={18} color={C.primaryPurple} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: text }}>AI Intelligence Report</h2>
              <span className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: "rgba(168,85,247,.15)", color: C.primaryPurple }}>ML v3.4.1</span>
            </div>
            <p style={{ fontSize: 12, color: sub }}>
              6 modèles ML en production · Rafraîchissement automatique 30 s
            </p>
          </div>
          <button onClick={handleRetrainAll} disabled={retrainAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
              color: "#fff", border: "none", opacity: retrainAll ? 0.7 : 1,
            }}>
            {retrainAll ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            Retrain Models
          </button>
        </div>

        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: surface, borderColor: border }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-1 justify-center"
              style={{
                background: activeTab === id
                  ? `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`
                  : "transparent",
                color: activeTab === id ? "#fff" : sub,
                border: "none", transition: "background .2s",
              }}>
              <Icon size={12} />{label}
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