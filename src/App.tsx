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
import logoDark from "./assets/dark.png";

// ── Auth / Intro ──────────────────────────────────────────────────────────────
import LoginAdmin from "./auth/login";
import IntroLoader from "./into/IntroLoader";

// ── Sidebar & TopNav ──────────────────────────────────────────────────────────
import Sidebar from "./Dashboard/Sidebar";
import TravelSyncTopNav from "./Dashboard/TopNavProps";

// ── Pages ─────────────────────────────────────────────────────────────────────
import AdminDashboard from "./Dashboard/Overview/AdminDashboard";
import AgencyDashboard from "./Dashboard/Overview/AgencyDashboard";
import UsersPage from "./Dashboard/Users/userpage";
import DriversPage, { INITIAL_DRIVERS } from "./Dashboard/Drivers & Vehicles/DriversPage";
import AddDriverPage from "./Dashboard/Drivers & Vehicles/AddDriverPage";
import VehiclesPage, { INITIAL_VEHICLES } from "./Dashboard/Drivers & Vehicles/Vehiclespage";
import AddVehiclePage from "./Dashboard/Drivers & Vehicles/Addvehiclepage";
import TripsPage from "./Dashboard/BookingsPage";
import AgencyPaymentsData from "./Dashboard/billing/AgencyBillingPage";
import HelpCenter from "./Dashboard/HelpCentre";
import Settings from "./Dashboard/settings/Settings";
import AvailableRidesPage from "./Dashboard/Rides/AvailableRides";
import UpcomingRidesPage from "./Dashboard/Rides/UpcomingRides";
import PastRidesPage from "./Dashboard/Rides/PastRides";
import WorkAreasPage, {
  INITIAL_AREAS,
  INITIAL_DRIVERS as INITIAL_WORK_AREA_DRIVERS,
} from "./Dashboard/WorkArea/WorkAreasPage";
import type { Driver } from "./Dashboard/Drivers & Vehicles/DriversPage";
import type { Vehicle } from "./Dashboard/Drivers & Vehicles/Vehiclespage";
import type {
  WorkArea,
  Driver as WorkAreaDriver,
} from "./Dashboard/WorkArea/WorkAreasPage";

import "./App.css";
import "./Dashboard/travelsync-design-system.css";

/* ─── Page transition order ─────────────────────────────────────────────────── */
const PAGE_ORDER = [
  "dashboard",
  "agency-dashboard",
  "users",
  "drivers",
  "agency-drivers",
  "vehicles",
  "agency-vehicles",
  "trips",
  "available-rides",
  "upcoming-rides",
  "past-rides",
  "payments",
  "agency-billing",
  "work-area",
  "help",
  "settings",
  "security",
];

/* ─── Placeholder ────────────────────────────────────────────────────────────── */
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
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  editDriver: Driver | null;
  setEditDriver: React.Dispatch<React.SetStateAction<Driver | null>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  editVehicle: Vehicle | null;
  setEditVehicle: React.Dispatch<React.SetStateAction<Vehicle | null>>;
  areas: WorkArea[];
  setAreas: React.Dispatch<React.SetStateAction<WorkArea[]>>;
  workAreaDrivers: WorkAreaDriver[];
  setWorkAreaDrivers: React.Dispatch<React.SetStateAction<WorkAreaDriver[]>>;
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
  areas,
  setAreas,
  workAreaDrivers,
  setWorkAreaDrivers,
}: ShellProps) {
  const nav = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [slideClass, setSlideClass] = useState("");
  const prevKeyRef = useRef("dashboard");

  const toKey = (path: string) =>
    path.replace(/^\/dashboard\/?/, "") || "dashboard";
  const activePage = toKey(location.pathname);

  const navigate = (page: string, prefill?: Driver | Vehicle | null) => {
    const targetPath =
      page === "dashboard" ? "/dashboard" : `/dashboard/${page}`;
    if (location.pathname === targetPath && prefill === undefined) return;

    if (page === "agency-drivers")
      setEditDriver(prefill !== undefined ? (prefill as Driver | null) : null);
    if (page === "agency-vehicles")
      setEditVehicle(
        prefill !== undefined ? (prefill as Vehicle | null) : null,
      );

    const fromIdx = PAGE_ORDER.indexOf(prevKeyRef.current);
    const toIdx = PAGE_ORDER.indexOf(page);
    const dir = toIdx >= fromIdx ? "left" : "right";

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
      {/* ── Sidebar ── */}
      {sidebarOpen && (
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
          <div style={{ flex: 1, padding: "0.75rem" }}>
            <Sidebar
              dark={dark}
              onToggleDark={onToggleDark}
              activePage={activePage}
              onNavigate={navigate}
            />
          </div>
        </aside>
      )}

      {/* ── Main area ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            flexShrink: 0,
            height: "var(--nav-h)",
            background: "var(--bg-nav)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <TravelSyncTopNav
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            dark={dark}
            onToggleDark={onToggleDark}
            onNavigate={navigate}
          />
        </header>

        {/* Page area */}
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
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="agency-dashboard" element={<AgencyDashboard dark={dark} />} />
              <Route path="users" element={<UsersPage dark={dark} />} />
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
                    prefill={editVehicle as Vehicle | null}
                    setVehicles={setVehicles}
                    onNavigate={navigate}
                  />
                }
              />
              <Route path="trips" element={<TripsPage dark={dark} />} />
              <Route path="available-rides" element={<AvailableRidesPage />} />
              <Route path="upcoming-rides" element={<UpcomingRidesPage dark={false} />} />
              <Route path="past-rides" element={<PastRidesPage />} />
              <Route path="payments" element={<AgencyPaymentsData />} />
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
              <Route
                path="work-area"
                element={
                  <WorkAreasPage
                    areas={areas}
                    setAreas={setAreas}
                    drivers={workAreaDrivers}
                    setDrivers={setWorkAreaDrivers}
                  />
                }
              />
              <Route path="help" element={<HelpCenter dark={dark} />} />

              {/* ✅ Settings now receives dark + onToggleDark — theme toggle works */}
              <Route
                path="settings"
                element={<Settings dark={dark} onToggleDark={onToggleDark} />}
              />

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
  // ✅ Initialize from localStorage so dark mode persists across refreshes
  const [dark, setDark] = useState(
    () => localStorage.getItem("dark") === "true",
  );

  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [areas, setAreas] = useState<WorkArea[]>(INITIAL_AREAS);
  const [workAreaDrivers, setWorkAreaDrivers] = useState<WorkAreaDriver[]>(
    INITIAL_WORK_AREA_DRIVERS,
  );

  // ✅ ONE toggle handler — owns the DOM class + React state + localStorage
  function toggleDark() {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("dark", String(next));
      // DOM class drives CSS variables — must stay in sync with React state
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWithIntro />} />
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
              areas={areas}
              setAreas={setAreas}
              workAreaDrivers={workAreaDrivers}
              setWorkAreaDrivers={setWorkAreaDrivers}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}