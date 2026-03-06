import { useState, useRef } from "react";
import logoLight from "../assets/light.png";
import logoDark from "../assets/dark.png";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsRow from "./StatsRow";
import UsersTable from "./UsersTable";
import SystemStatus from "./SystemStatus";
import UsersPage from "./userpage";
import AgencyPaymentsData from "./PayData";
import TripsPage from "./BookingsPage";
import HelpCenter from "./HelpCentre";
import AnimatedMail from "./Settings";
import './travelsync-design-system.css';

const PAGE_ORDER = ["dashboard","users","trips","payments","help","settings","security"];

interface AdminDashboardProps { dark: boolean; onToggleDark: () => void; }
interface PageProps { dark: boolean; onNavigate?: (page: string) => void; }

function PlaceholderPage({ title, icon, description }: { dark: boolean; title: string; icon: string; description: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "0.75rem", padding: "6rem 0" }}>
      <div style={{ fontSize: "3rem" }}>{icon}</div>
      <h2 className="ts-page-title">{title}</h2>
      <p className="ts-muted" style={{ fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}

function renderPage(page: string, props: PageProps) {
  switch (page) {
    case "dashboard":
      return (
        <>
          <Header dark={props.dark} />
          <StatsRow dark={props.dark} />
          <div className="ts-grid-2-13">
            <UsersTable dark={props.dark} />
            <SystemStatus dark={props.dark} />
          </div>
        </>
      );
    case "users":    return <UsersPage dark={props.dark} />;
    case "trips":    return <TripsPage dark={props.dark} />;
    case "payments": return <AgencyPaymentsData dark={props.dark} />;
    case "help":     return <HelpCenter dark={props.dark} />;
    case "settings": return <AnimatedMail />;
    case "security": return <PlaceholderPage dark={props.dark} title="Security" icon="🛡" description="Manage permissions, 2FA and audit logs." />;
    default: return null;
  }
}

export default function AdminDashboard({ dark, onToggleDark }: AdminDashboardProps) {
  const [activePage, setActivePage]   = useState("dashboard");
  const [displayPage, setDisplayPage] = useState("dashboard");
  const [slideClass, setSlideClass]   = useState("");
  const prevPageRef = useRef("dashboard");

  const navigate = (page: string) => {
    if (page === activePage) return;
    const prevIdx = PAGE_ORDER.indexOf(prevPageRef.current);
    const nextIdx = PAGE_ORDER.indexOf(page);
    const dir     = nextIdx >= prevIdx ? "left" : "right";

    setSlideClass(dir === "left" ? "ts-slide-out-left" : "ts-slide-out-right");
    setTimeout(() => {
      prevPageRef.current = page;
      setDisplayPage(page);
      setActivePage(page);
      setSlideClass(dir === "left" ? "ts-slide-in-right" : "ts-slide-in-left");
    }, 180);
    setTimeout(() => setSlideClass(""), 360);
  };

  return (
    <div
      className={dark ? "dark" : ""}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-page)",
        fontFamily: "var(--font)",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          position: "fixed",
          left: 0, top: 0, bottom: 0,
          width: "var(--sidebar-w)",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border)",
          zIndex: 50,
          overflowY: "auto",
        }}
      >
        {/* ── LOGO AREA ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "50px 20px",
            height: "80px",
            minHeight: "64px",
            flexShrink: 0,
          }}
        >
          <img
            src={dark ? logoDark : logoLight}
            alt="Moviroo"
            style={{
              height: "80px",
              width: "80px",
              objectFit: "contain",
              display: "block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "22px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              color: dark ? "#f9fafb" : "#111827",
              lineHeight: "1",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            Moviroo
          </span>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "0.75rem" }}>
          <Sidebar
            dark={dark}
            onToggleDark={onToggleDark}
            activePage={activePage}
            onNavigate={navigate}
          />
        </div>
      </aside>

      {/* ── RIGHT SIDE ── */}
      <div
        style={{
          marginLeft: "var(--sidebar-w)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Top nav */}
        <header
          style={{
            position: "sticky",
            top: 0, zIndex: 40,
            height: "var(--nav-h)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            background: "var(--bg-nav)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Left — hamburger */}
          <button
            style={{
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", background: "transparent",
              cursor: "pointer", color: "var(--text-muted)",
              borderRadius: "0.5rem", fontSize: "1.25rem",
            }}
          >
            ☰
          </button>

          {/* Center — search */}
          <div className="ts-search-bar" style={{ width: 400 }}>
            <span style={{ color: "var(--text-faint)", fontSize: "0.875rem" }}>🔍</span>
            <input placeholder="Search trips, passengers, or references..." />
          </div>

          {/* Right — bell + divider + flag + avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="ts-icon-btn" style={{ width: 36, height: 36, position: "relative", fontSize: "1.125rem" }}>
              🔔
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 7, height: 7, borderRadius: "50%",
                background: "#ef4444", border: "2px solid var(--bg-nav)",
              }} />
            </button>

            <div style={{ width: 1, height: 28, background: "var(--border)" }} />

            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              cursor: "pointer", padding: "0.25rem 0.5rem",
              borderRadius: "0.625rem",
            }}>
              <span style={{ fontSize: "1.1rem" }}>🇬🇧</span>
              <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: "#e9d5ff", flexShrink: 0 }}>
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                  alt="Sarah"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-h)", whiteSpace: "nowrap" }}>
                Sarah Lee (Agency Manager)
              </span>
              <span style={{ color: "var(--text-faint)", fontSize: "0.75rem" }}>▾</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className={slideClass}>
            {renderPage(displayPage, { dark, onNavigate: navigate })}
          </div>
        </main>
      </div>
    </div>
  );
}