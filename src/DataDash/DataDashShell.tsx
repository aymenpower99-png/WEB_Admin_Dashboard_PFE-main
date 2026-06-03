import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "./tokens";
import { NavBar } from "./NavBar";
import { HeatMapCanvas } from "./HeatMapCanvas";
import { RevenueChart } from "./RevenueChart";
import { SupportChart } from "./SupportChart";
import { StatsStrip } from "./StatsStrip";
import { FleetTable } from "./FleetTable";
import { AIStrategyPanel } from "./AIStrategyPanel";
import { IssuesPanel } from "./IssuesPanel";
import { LiveMapPage } from "./Livemappage";
import { AIInsightsPage } from "./Aiinsightspage";
import { Map } from "lucide-react";

interface DataDashShellProps {
  dark?: boolean;
  onToggleDark?: () => void;
}

export default function DataDashShell({ dark: darkProp, onToggleDark }: DataDashShellProps) {
  const navigate = useNavigate();

  // Local dark mode fallback if props not provided
  const [localDark, setLocalDark] = useState<boolean>(true);
  const dark = darkProp ?? localDark;
  const toggleDark = onToggleDark ?? (() => setLocalDark((d) => !d));

  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("datadash-intro-shown");
  });

  const [activeNav, setActiveNav] = useState<string>("Dashboard");
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    if (showIntro) {
      const t = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("datadash-intro-shown", "true");
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [showIntro]);

  const bg = dark ? C.darkBg : C.lightBg;
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;

  const handleGoToAdmin = () => {
    navigate("/dashboard");
  };

  if (showIntro) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          background: "#0F0D1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          animation: "fadeIn 0.6s ease",
        }}
      >
        <img
          src="/DataAnalysis.gif"
          alt="Data Analysis"
          style={{
            width: 500,
            height: 500,
            objectFit: "contain",
            filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))",
          }}
        />
        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.08em",
          }}
        >
          Loading Mobility Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: bg,
        color: text,
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        transition: "background .25s, color .25s",
      }}
    >
      {/* ── Navigation ──────────────────────────────────────────── */}
      <NavBar
        dark={dark}
        onToggle={toggleDark}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onGoToAdmin={handleGoToAdmin}
      />

      {/* ── Page routing ────────────────────────────────────────── */}
      {activeNav === "Live Map" && (
        <div style={{ padding: "20px 24px" }}>
          <LiveMapPage dark={dark} />
        </div>
      )}

      {activeNav === "AI Insights" && (
        <div style={{ padding: "20px 24px" }}>
          <AIInsightsPage dark={dark} />
        </div>
      )}

      {(activeNav === "Dashboard" ||
        activeNav === "Revenue" ||
        activeNav === "Fleet") && (
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* ── Page header ─────────────────────────────────────────── */}
          <div className="flex items-start justify-between">
            <div>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.3px",
                }}
              >
                Mobility OS Overview
              </h1>
              <p style={{ fontSize: 12, color: sub, marginTop: 2 }}>
                Real-time performance metrics and demand intelligence
              </p>
            </div>
          </div>

          {/* ── Map + Right column ──────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 16,
            }}
          >
            {/* Live Heatmap */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{ background: surface, borderColor: border }}
            >
              <div className="flex items-center gap-2 p-3 px-4">
                <Map size={14} color={C.primaryPurple} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: text,
                  }}
                >
                  City Demand Density
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded animate-pulse"
                  style={{
                    background: C.error,
                    color: "#fff",
                    fontSize: 10,
                  }}
                >
                  LIVE
                </span>
                <div className="ml-auto flex gap-3">
                  {[
                    { label: "Low", color: "#4B9FFF" },
                    { label: "Med", color: C.warning },
                    { label: "High", color: C.error },
                  ].map(({ label, color }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1"
                      style={{ fontSize: 11, color: sub }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: color,
                          display: "inline-block",
                        }}
                      />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <HeatMapCanvas dark={dark} />
            </div>

            {/* Issues + AI */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <IssuesPanel dark={dark} />
              <AIStrategyPanel dark={dark} />
            </div>
          </div>

          {/* ── Charts Row ──────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <RevenueChart dark={dark} />
            <SupportChart dark={dark} />
          </div>

          {/* ── Stats Strip ─────────────────────────────────────────── */}
          <StatsStrip dark={dark} />

          {/* ── Fleet Table ─────────────────────────────────────────── */}
          <FleetTable dark={dark} showAll={showAll} setShowAll={setShowAll} />
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-6 py-4 border-t text-xs"
        style={{ borderColor: border, color: sub }}
      >
        <span>Analytics Pro &nbsp;·&nbsp; © 2024 Mobility OS Global</span>
        <div className="flex gap-5">
          {[
            "Privacy Policy",
            "System Status",
            "Documentation",
            "Support",
          ].map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: sub, textDecoration: "none" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = C.primaryPurple)
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = sub)}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
