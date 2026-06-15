import { useState, useEffect, useRef, useCallback } from "react";
import {
  Cpu, X, AlertTriangle, TrendingUp,
  Zap, Activity, RefreshCw, Sparkles,
} from "lucide-react";

// ── Config ────────────────────────────────────────────────────────────────────

const PROXY_URL   = import.meta.env.VITE_AI_REPORT_URL || import.meta.env.VITE_BACKEND_URL ;
const DEBOUNCE_MS = 10;

// ── Types ─────────────────────────────────────────────────────────────────────

type IssueLevel = "critical" | "warning" | "info";
type AlertLevel = "critical" | "warning" | "normal";
type Status     = "idle" | "loading" | "done" | "rate_limit" | "error";

interface Issue        { level: IssueLevel; text: string; }
interface Prediction   { text: string; bold?: string; }
interface Rec          { num: string; text: string; color: string; }
interface Health       { dot: string; text: string; }

interface Report {
  summary:         string;
  alertLevel:      AlertLevel;
  issues:          Issue[];
  predictions:     Prediction[];
  recommendations: Rec[];
  health:          Health[];
  generatedAt:     string;
  fromCache?:      boolean;
}

// ── Safe fetch — handles all failure modes ────────────────────────────────────

async function fetchReport(force = false): Promise<Report> {
  let res: Response;

  try {
    const token = localStorage.getItem("accessToken");
    res = await fetch(`${PROXY_URL}/report${force ? "?force=true" : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (networkErr) {
    // ERR_FAILED, CORS, backend down
    throw new Error("Cannot reach backend — is it running on port 8009?");
  }

  // Try to parse JSON regardless of status code
  let body: any;
  try {
    body = await res.json();
  } catch {
    // 200 OK but body is not JSON (empty, HTML error page, etc.)
    throw new Error(`Server returned non-JSON response (HTTP ${res.status})`);
  }

  if (res.status === 429) {
    const detail = body?.detail ?? {};
    throw Object.assign(
      new Error("RATE_LIMIT"),
      { retryAfter: detail.retryAfter ?? 60, message: detail.message ?? "Too many requests" }
    );
  }

  if (!res.ok) {
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : body?.detail?.message ?? `HTTP ${res.status}`
    );
  }

  // Validate that required fields exist
  if (!body.summary || !body.alertLevel) {
    throw new Error("Backend returned incomplete report schema");
  }

  return body as Report;
}

// ── Debounce hook ─────────────────────────────────────────────────────────────

function useDebounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    ((...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), ms);
    }) as T,
    [fn, ms]
  );
}

// ── UI constants ──────────────────────────────────────────────────────────────

const LEVEL_STYLE = {
  critical: { color: "#E57373", bg: "rgba(229,115,115,0.07)", border: "rgba(229,115,115,0.2)" },
  warning:  { color: "#FFB74D", bg: "rgba(255,183,77,0.06)",  border: "rgba(255,183,77,0.2)"  },
  info:     { color: "#64B5F6", bg: "rgba(100,181,246,0.06)", border: "rgba(100,181,246,0.2)" },
} as const;

const ALERT_COLOR = { critical: "#E57373", warning: "#FFB74D", normal: "#4CAF50" } as const;
const ALERT_LABEL = {
  critical: "Critical alert — immediate action required",
  warning:  "Warning — platform attention needed",
  normal:   "System operating normally",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ icon, label, children }: {
  icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
        {icon}
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(168,85,247,0.75)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function IssueRow({ level, text }: { level: IssueLevel; text: string }) {
  const s = LEVEL_STYLE[level] ?? LEVEL_STYLE.info;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: s.bg, border: `0.5px solid ${s.border}`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, marginTop: 5, flexShrink: 0 }} />
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{level}</span>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "3px 0 0", lineHeight: 1.7 }}>{text}</p>
      </div>
    </div>
  );
}

function PredictionRow({ p }: { p: Prediction }) {
  const content = p.bold
    ? p.text.split(p.bold).flatMap((part, i, arr) =>
        i < arr.length - 1
          ? [part, <strong key={i} style={{ color: "#fff" }}>{p.bold}</strong>]
          : [part]
      )
    : p.text;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ color: "rgba(168,85,247,0.5)", fontSize: 14, marginTop: 1, flexShrink: 0 }}>→</span>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.75 }}>{content}</p>
    </div>
  );
}

function Skeleton() {
  const bar = (w: string, mb = 8) => (
    <div style={{ height: 12, width: w, background: "rgba(168,85,247,0.07)", borderRadius: 6, marginBottom: mb, animation: "skp 1.6s ease-in-out infinite" }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>{bar("85%")}{bar("70%")}{bar("50%", 0)}</div>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
          {bar("30%", 6)}{bar("78%", 0)}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(168,85,247,0.1)", border: "0.5px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Sparkles size={22} color="#A855F7" />
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>Generate AI Report</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "0 0 28px", maxWidth: 280, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
        Fetches live data from all platform APIs and sends it to Gemini for analysis.
      </p>
      <button
        onClick={onGenerate}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(124,58,237,0.2))", border: "0.5px solid rgba(168,85,247,0.4)", color: "#C084FC", borderRadius: 12, padding: "11px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
      >
        <Sparkles size={15} /> Generate Report
      </button>
    </div>
  );
}

function RateLimitState({ retryAfter, onRetry }: { retryAfter: number; onRetry: () => void }) {
  const [secs, setSecs] = useState(retryAfter);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: "rgba(255,183,77,0.06)", border: "0.5px solid rgba(255,183,77,0.2)", borderRadius: 14, padding: 24, textAlign: "center" }}>
      <p style={{ fontSize: 28, margin: "0 0 12px" }}>⏳</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#FFB74D", margin: "0 0 6px" }}>Rate limited</p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 20px", lineHeight: 1.6 }}>
        {secs > 0 ? `Auto-retry in ${secs}s…` : "Ready to retry."}
      </p>
      <div style={{ width: 160, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, margin: "0 auto 20px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#FFB74D", borderRadius: 2, width: `${(secs / retryAfter) * 100}%`, transition: "width 1s linear" }} />
      </div>
      <button
        onClick={onRetry}
        disabled={secs > 0}
        style={{ background: secs > 0 ? "rgba(255,255,255,0.04)" : "rgba(255,183,77,0.12)", border: `0.5px solid ${secs > 0 ? "rgba(255,255,255,0.08)" : "rgba(255,183,77,0.3)"}`, color: secs > 0 ? "rgba(255,255,255,0.2)" : "#FFB74D", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: secs > 0 ? "not-allowed" : "pointer" }}
      >
        {secs > 0 ? `Wait ${secs}s` : "Retry now"}
      </button>
    </div>
  );
}

// ── AIReportModal ─────────────────────────────────────────────────────────────

export function AIReportModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [visible,    setVisible]    = useState(false);
  const [status,     setStatus]     = useState<Status>("idle");
  const [report,     setReport]     = useState<Report | null>(null);
  const [retryAfter, setRetryAfter] = useState(60);
  const [errorMsg,   setErrorMsg]   = useState("");

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 250); };

  const _generate = async (force = false) => {
    setStatus("loading");
    try {
      const data = await fetchReport(force);
      setReport(data);
      setStatus("done");
    } catch (e: any) {
      if (e.message === "RATE_LIMIT") {
        setRetryAfter(e.retryAfter ?? 60);
        setStatus("rate_limit");
      } else {
        setErrorMsg(e.message ?? "Unknown error");
        setStatus("error");
      }
    }
  };

  const generate = useDebounce(_generate, DEBOUNCE_MS);

  const alertColor = ALERT_COLOR[report?.alertLevel ?? "normal"];

  const dotColor =
    status === "loading"     ? "#A855F7"
    : status === "rate_limit"? "#FFB74D"
    : status === "error"     ? "#E57373"
    : status === "done"      ? "#4CAF50"
    : "rgba(255,255,255,0.15)";

  const statusLabel =
    status === "idle"        ? "Ready · click Generate"
    : status === "loading"   ? "Gemini analyzing data…"
    : status === "rate_limit"? "Rate limited"
    : status === "error"     ? errorMsg
    : report?.fromCache      ? `Cached · ${report.generatedAt}`
    : `Live · ${report?.generatedAt}`;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }}
    >
      <div style={{ background: "#0F0D1A", border: "0.5px solid rgba(168,85,247,0.2)", borderRadius: 20, maxWidth: 700, width: "100%", maxHeight: "88vh", overflowY: "auto", position: "relative", transform: visible ? "translateY(0)" : "translateY(20px)", transition: "transform 0.25s ease, opacity 0.25s ease", opacity: visible ? 1 : 0, scrollbarWidth: "thin" as const, scrollbarColor: "rgba(168,85,247,0.3) transparent" }}>

        {/* Glow */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 300, height: 1, background: "linear-gradient(90deg,transparent,rgba(168,85,247,0.6),transparent)" }} />

        {/* Header */}
        <div style={{ padding: "28px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={14} color="#A855F7" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, animation: status === "loading" ? "blink 1s ease-in-out infinite" : "none" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{statusLabel}</span>
                </div>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.3px" }}>AI Intelligence Report</h2>
              <p style={{ fontSize: 13, color: "rgba(168,85,247,0.7)", margin: 0 }}>Powered by Gemini 2.0 Flash · Live platform data</p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexShrink: 0 }}>
              {status === "done" && (
                <button onClick={() => generate(true)} title="Force refresh" style={{ background: "rgba(168,85,247,0.08)", border: "0.5px solid rgba(168,85,247,0.2)", color: "rgba(168,85,247,0.6)", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RefreshCw size={13} />
                </button>
              )}
              <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {status === "done" && report?.fromCache && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, margin: "10px 0 0", padding: "3px 10px", background: "rgba(168,85,247,0.07)", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: 20 }}>
              <span style={{ fontSize: 10, color: "rgba(168,85,247,0.6)" }}>⚡ Cached · click ↻ to force refresh</span>
            </div>
          )}

          {status === "done" && report && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 0", padding: "8px 14px", background: `${alertColor}12`, border: `0.5px solid ${alertColor}30`, borderRadius: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: alertColor, flexShrink: 0, animation: report.alertLevel === "critical" ? "blink 1.2s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: alertColor }}>{ALERT_LABEL[report.alertLevel]}</span>
            </div>
          )}

          <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "18px 0 0" }} />
        </div>

        {/* Body */}
        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 28 }}>

          {status === "idle"       && <EmptyState onGenerate={() => generate(false)} />}
          {status === "loading"    && <Skeleton />}
          {status === "rate_limit" && <RateLimitState retryAfter={retryAfter} onRetry={() => generate(false)} />}
          {status === "error"      && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "#E57373", fontSize: 13, marginBottom: 16 }}>{errorMsg}</p>
              <button onClick={() => generate(false)} style={{ background: "rgba(168,85,247,0.1)", border: "0.5px solid rgba(168,85,247,0.25)", color: "#A855F7", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>
                Retry
              </button>
            </div>
          )}

          {status === "done" && report && (
            <>
              <Section icon={<Activity size={13} color="#A855F7" />} label="Executive Summary">
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, margin: 0 }}>{report.summary}</p>
              </Section>

              <Section icon={<AlertTriangle size={13} color="#A855F7" />} label="Key Issues">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {report.issues.map((iss, i) => <IssueRow key={i} level={iss.level} text={iss.text} />)}
                </div>
              </Section>

              <Section icon={<TrendingUp size={13} color="#A855F7" />} label="Predictions">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {report.predictions.map((p, i) => <PredictionRow key={i} p={p} />)}
                </div>
              </Section>

              <div style={{ background: "rgba(168,85,247,0.06)", border: "0.5px solid rgba(168,85,247,0.18)", borderRadius: 14, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
                  <Zap size={13} color="#A855F7" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(168,85,247,0.85)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Recommendations</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {report.recommendations.map(rec => (
                    <div key={rec.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: rec.color, minWidth: 20, flexShrink: 0, marginTop: 2 }}>{rec.num}</span>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.75 }}>{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Section icon={<Activity size={13} color="#A855F7" />} label="System Health">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {report.health.map(({ dot, text }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin  { to { transform: rotate(360deg); } }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
          @keyframes skp   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
      </div>
    </div>
  );
}