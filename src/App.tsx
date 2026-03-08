import { useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import logoLight from "./assets/light.png";
import logoDark  from "./assets/dark.png";

// ── Auth / Intro ──────────────────────────────────────────────────────────────
import LoginAdmin  from "./auth/login";
import IntroLoader from "./into/IntroLoader";

// ── Sidebar ───────────────────────────────────────────────────────────────────
import Sidebar from "./Dashboard/Sidebar";

// ── Pages ─────────────────────────────────────────────────────────────────────
import AdminDashboard     from "./Dashboard/AdminDashboard";
import AgencyDashboard    from "./Dashboard/AgencyDashboard";
import UsersPage          from "./Dashboard/userpage";
import DriversPage,
      { INITIAL_DRIVERS } from "./Dashboard/DriversPage";
import AddDriverPage      from "./Dashboard/AddDriverPage";
import VehiclesPage,
      { INITIAL_VEHICLES } from "./Dashboard/Vehiclespage";
import AddVehiclePage     from "./Dashboard/Addvehiclepage";
import TripsPage          from "./Dashboard/BookingsPage";
import AgencyPaymentsData from "./Dashboard/PayData";
import HelpCenter         from "./Dashboard/HelpCentre";
import AnimatedMail       from "./Dashboard/Settings";
import type { Driver }    from "./Dashboard/DriversPage";
import type { Vehicle }   from "./Dashboard/Vehiclespage";

import "./App.css";
import "./Dashboard/travelsync-design-system.css";

/* ─── Page transition order ─────────────────────────────────────────────────── */
const PAGE_ORDER = [
  "dashboard", "agency-dashboard",
  "users",
  "drivers", "agency-drivers",
  "vehicles", "agency-vehicles",
  "trips", "available-rides", "past-rides",
  "payments", "agency-billing",
  "work-area",
  "help", "settings", "security",
];

/* ─── Placeholder for unbuilt pages ─────────────────────────────────────────── */
function PlaceholderPage({
  title,
  icon,
  description,
}: {
  title: string;
  icon: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: "0.75rem",
        padding: "6rem 0",
      }}
    >
      <div style={{ fontSize: "3rem" }}>{icon}</div>
      <h2 className="ts-page-title">{title}</h2>
      <p className="ts-muted" style={{ fontSize: "0.875rem" }}>
        {description}
      </p>
    </div>
  );
}

/* ─── Login + Intro ──────────────────────────────────────────────────────────── */
function LoginWithIntro() {
  const [showIntro, setShowIntro] = useState(true);
  if (showIntro) {
    return (
      <IntroLoader
        onDone={() => setShowIntro(false)}
        onFinish={() => setShowIntro(false)}
        dark={false}
      />
    );
  }
  return <LoginAdmin onLogin={() => {}} />;
}

/* ─── Shell props ────────────────────────────────────────────────────────────── */
interface ShellProps {
  dark: boolean;
  onToggleDark: () => void;
  // drivers
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  editDriver: Driver | null;
  setEditDriver: React.Dispatch<React.SetStateAction<Driver | null>>;
  // vehicles
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  editVehicle: Vehicle | null;
  setEditVehicle: React.Dispatch<React.SetStateAction<Vehicle | null>>;
}

/* ─── Shell ──────────────────────────────────────────────────────────────────── */
function Shell({
  dark,
  onToggleDark,
  drivers,
  setDrivers,
  editDriver,
  setEditDriver,
  vehicles,
  setVehicles,
  editVehicle,
  setEditVehicle,
}: ShellProps) {
  const nav      = useNavigate();
  const location = useLocation();

  const [slideClass, setSlideClass] = useState("");
  const prevKeyRef = useRef("dashboard");

  const toKey = (path: string) =>
    path.replace(/^\/dashboard\/?/, "") || "dashboard";

  const activePage = toKey(location.pathname);

  const navigate = (page: string, prefill?: Driver | Vehicle | null) => {
    const targetPath =
      page === "dashboard" ? "/dashboard" : `/dashboard/${page}`;

    if (location.pathname === targetPath && prefill === undefined) return;

    // ── driver edit state ──
    if (page === "agency-drivers") {
      setEditDriver(prefill !== undefined ? (prefill as Driver | null) : null);
    }

    // ── vehicle edit state ──
    if (page === "agency-vehicles") {
      setEditVehicle(prefill !== undefined ? (prefill as Vehicle | null) : null);
    }

    const fromIdx = PAGE_ORDER.indexOf(prevKeyRef.current);
    const toIdx   = PAGE_ORDER.indexOf(page);
    const dir     = toIdx >= fromIdx ? "left" : "right";

    setSlideClass(dir === "left" ? "ts-slide-out-left" : "ts-slide-out-right");

    setTimeout(() => {
      prevKeyRef.current = page;
      nav(targetPath);
      setSlideClass(dir === "left" ? "ts-slide-in-right" : "ts-slide-in-left");
    }, 180);

    setTimeout(() => setSlideClass(""), 360);
  };

  return (
    <div
      className={dark ? "dark" : ""}
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-page)",
        fontFamily: "var(--font)",
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: "var(--sidebar-w)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border)",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
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
            }}
          >
            Moviroo
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "0.75rem" }}>
          <Sidebar
            dark={dark}
            onToggleDark={onToggleDark}
            activePage={activePage}
            onNavigate={navigate}
          />
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header
          style={{
            flexShrink: 0,
            height: "var(--nav-h)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            background: "var(--bg-nav)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <button
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-muted)",
              borderRadius: "0.5rem",
              fontSize: "1.25rem",
            }}
          >
            ☰
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.625rem",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🇬🇧</span>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#e9d5ff",
                flexShrink: 0,
              }}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                alt="Sarah"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-h)",
                whiteSpace: "nowrap",
              }}
            >
              Sarah Lee (Agency Manager)
            </span>
            <span style={{ color: "var(--text-faint)", fontSize: "0.75rem" }}>
              ▾
            </span>
          </div>
        </header>

        {/* Animated page area */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className={slideClass}
            style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
          >
            <Routes>

              {/* ── Overview ──────────────────────────────────────────────── */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"        element={<AdminDashboard  dark={dark} />} />
              <Route path="agency-dashboard" element={<AgencyDashboard dark={dark} />} />

              {/* ── Users ─────────────────────────────────────────────────── */}
              <Route path="users" element={<UsersPage dark={dark} />} />

              {/* ── Drivers ───────────────────────────────────────────────── */}
              <Route
                path="drivers"
                element={
                  <DriversPage
                    drivers={drivers}
                    setDrivers={setDrivers}
                    onNavigate={navigate}
                  />
                }
              />
              <Route
                path="agency-drivers"
                element={
                  <AddDriverPage
                    prefill={editDriver}
                    setDrivers={setDrivers}
                    onNavigate={navigate}
                  />
                }
              />

              {/* ── Vehicles ──────────────────────────────────────────────── */}
              <Route
                path="vehicles"
                element={
                  <VehiclesPage
                    vehicles={vehicles}
                    setVehicles={setVehicles}
                    onNavigate={navigate}
                  />
                }
              />
           <Route
  path="agency-vehicles"
  element={
    <AddVehiclePage
      prefill={editVehicle as Vehicle | null}  // explicit cast
      setVehicles={setVehicles}
      onNavigate={navigate}
    />
  }
/>

              {/* ── Rides ─────────────────────────────────────────────────── */}
              <Route path="trips" element={<TripsPage dark={dark} />} />
              <Route
                path="available-rides"
                element={
                  <PlaceholderPage
                    title="Available Rides"
                    icon="🚖"
                    description="Browse currently available rides."
                  />
                }
              />
              <Route
                path="past-rides"
                element={
                  <PlaceholderPage
                    title="Past Rides"
                    icon="📋"
                    description="Review completed ride history."
                  />
                }
              />

              {/* ── Billing ───────────────────────────────────────────────── */}
              <Route path="payments" element={<AgencyPaymentsData dark={dark} />} />
              <Route
                path="agency-billing"
                element={
                  <PlaceholderPage
                    title="Agency Billing"
                    icon="💳"
                    description="View and manage agency billing records."
                  />
                }
              />

              {/* ── Agency ────────────────────────────────────────────────── */}
              <Route
                path="work-area"
                element={
                  <PlaceholderPage
                    title="Work Area"
                    icon="🗺️"
                    description="Define and manage driver work zones."
                  />
                }
              />

              {/* ── Support & Settings ────────────────────────────────────── */}
              <Route path="help"     element={<HelpCenter dark={dark} />} />
              <Route path="settings" element={<AnimatedMail />} />
              <Route
                path="security"
                element={
                  <PlaceholderPage
                    title="Security"
                    icon="🛡️"
                    description="Manage permissions, 2FA and audit logs."
                  />
                }
              />

              {/* ── Fallback ──────────────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />

            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Root App ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("dark") === "true"
  );

  // Driver state
  const [drivers,    setDrivers]    = useState<Driver[]>(INITIAL_DRIVERS);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);

  // Vehicle state
  const [vehicles,    setVehicles]    = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  function toggleDark() {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem("dark", String(next));
      return next;
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ──────────────────────────────────────────────────── */}
        <Route path="/"      element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWithIntro />} />

        {/* ── Dashboard shell ─────────────────────────────────────────── */}
        <Route
          path="/dashboard/*"
          element={
            <Shell
              dark={dark}
              onToggleDark={toggleDark}
              drivers={drivers}
              setDrivers={setDrivers}
              editDriver={editDriver}
              setEditDriver={setEditDriver}
              vehicles={vehicles}
              setVehicles={setVehicles}
              editVehicle={editVehicle}
              setEditVehicle={setEditVehicle}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}