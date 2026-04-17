import { useState, useRef } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import logoLight from "../assets/light.png";
import logoDark  from "../assets/dark.png";

import Sidebar            from "../Dashboard/Sidebar";
import TravelSyncTopNav   from "../Dashboard/TopNavProps";

import AdminDashboard     from "../Dashboard/Overview/AdminDashboard";
import AgencyDashboard    from "../Dashboard/Overview/AgencyDashboard";
import UsersPage          from "../Dashboard/Users/userpage";
import DriversPage        from "../Dashboard/Drivers/DriversPage";
import VehiclesPage       from "../Dashboard/Vehicles/Vehiclespage";
import AddVehiclePage     from "../Dashboard/Vehicles/Addvehiclepage";
import ClassesPage        from "../Dashboard/Classes/ClassesPage";
import AddClassPage       from "../Dashboard/Classes/AddClassPage";
import ClassDetailPage    from "../Dashboard/Classes/ClassDetailPage";
import TripsPage          from "../Dashboard/BookingsPage";
import AgencyPaymentsData from "../Dashboard/billing/AgencyBillingPage";
import HelpCenter         from "../Dashboard/HelpCentre/HelpCenter";
import HelpCenterAdmin    from "../Dashboard/HelpCenter/HelpCenterAdmin";
import Settings           from "../Dashboard/settings/Settings";
import AvailableRidesPage from "../Dashboard/Rides/available-rides/AvailableRidesPage";
import UpcomingRidesPage  from "../Dashboard/Rides/upcoming-rides/UpcomingRidesPage";
import PastRidesPage      from "../Dashboard/Rides/past-rides/PastRidesPage";
import WorkAreasPage      from "../Dashboard/WorkArea/WorkAreasPage";

import type { Vehicle }      from "../Dashboard/Vehicles/Vehiclespage";
import type { VehicleClass } from "../api/classes";

// ── Page order drives the slide direction ─────────────────────────────────
const PAGE_ORDER = [
  "dashboard", "agency-dashboard",
  "users", "drivers",
  "classes", "classes-add", "class-detail",
  "vehicles", "agency-vehicles",
  "trips", "available-rides", "upcoming-rides", "past-rides",
  "payments", "agency-billing",
  "work-area",
  "help", "help-center", "settings", "security",
];

function PlaceholderPage({ title, icon, description }: {
  title: string; icon: string; description: string;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", flex: 1, gap: "0.75rem", padding: "6rem 0",
    }}>
      <div style={{ fontSize: "3rem" }}>{icon}</div>
      <h2 className="ts-page-title">{title}</h2>
      <p className="ts-muted" style={{ fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}

export interface ShellProps {
  dark: boolean;
  onToggleDark: () => void;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  editVehicle: Vehicle | null;
  setEditVehicle: React.Dispatch<React.SetStateAction<Vehicle | null>>;
}

export default function Shell({
  dark, onToggleDark,
  vehicles, setVehicles,
  editVehicle, setEditVehicle,
}: ShellProps) {
  const nav      = useNavigate();
  const location = useLocation();

  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [slideClass,    setSlideClass]    = useState("");
  const prevKeyRef = useRef("dashboard");

  const [editClass,     setEditClass]     = useState<VehicleClass | null>(null);
  const [detailClassId, setDetailClassId] = useState<string>("");

  const toKey      = (path: string) => path.replace(/^\/dashboard\/?/, "") || "dashboard";
  const activePage = toKey(location.pathname);

  // ── Unified navigate — accepts Vehicle | VehicleClass | string | null ────
  const navigate = (page: string, prefill?: Vehicle | VehicleClass | string | null) => {
    const targetPath = page === "dashboard" ? "/dashboard" : `/dashboard/${page}`;
    if (location.pathname === targetPath && prefill === undefined) return;

    // Route-specific state
    if (page === "agency-vehicles") {
      setEditVehicle((prefill as Vehicle | null) ?? null);
    }
    if (page === "classes-add") {
      setEditClass((prefill as VehicleClass | null) ?? null);
    }
    if (page === "class-detail") {
      // prefill can be a plain class UUID string OR a VehicleClass object
      if (typeof prefill === "string") {
        setDetailClassId(prefill);
      } else if (prefill && typeof prefill === "object" && "id" in prefill) {
        setDetailClassId((prefill as VehicleClass).id);
      }
    }

    // Slide animation direction
    const from = PAGE_ORDER.indexOf(prevKeyRef.current);
    const to   = PAGE_ORDER.indexOf(page);
    const dir  = to >= from ? "left" : "right";
    prevKeyRef.current = page;

    setSlideClass(dir === "left" ? "ts-slide-out-left" : "ts-slide-out-right");
    setTimeout(() => {
      nav(targetPath);
      setSlideClass(dir === "left" ? "ts-slide-in-right" : "ts-slide-in-left");
    }, 180);
    setTimeout(() => setSlideClass(""), 360);
  };

  return (
    <div className={dark ? "dark" : ""} style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: "var(--bg-page)", fontFamily: "var(--font)",
    }}>

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <aside style={{
          width: "var(--sidebar-w)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border)",
          overflow: "hidden",
        }}>
          {/* Logo — fixed, never scrolls */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
            padding: "50px 20px", height: "80px", minHeight: "64px",
            flexShrink: 0,
          }}>
            <img
              src={dark ? logoDark : logoLight} alt="Moviroo"
              style={{ height: "80px", width: "80px", objectFit: "contain", flexShrink: 0 }}
            />
            <span style={{
              fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px",
              color: dark ? "#f9fafb" : "#111827", lineHeight: "1", whiteSpace: "nowrap",
            }}>
              Moviroo
            </span>
          </div>

          {/* Nav items scroll independently */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "0.75rem", scrollbarWidth: "none",
          }}>
            <Sidebar
              dark={dark}
              onToggleDark={onToggleDark}
              activePage={activePage}
              onNavigate={navigate}
            />
          </div>
        </aside>
      )}

      {/* ── Main content area ── */}
      <div style={{
        flex: 1, minWidth: 0, display: "flex",
        flexDirection: "column", overflow: "hidden",
      }}>
        <header style={{
          flexShrink: 0, height: "var(--nav-h)",
          background: "var(--bg-nav)", borderBottom: "1px solid var(--border)",
        }}>
          <TravelSyncTopNav
            onToggleSidebar={() => setSidebarOpen(v => !v)}
            dark={dark} onToggleDark={onToggleDark} onNavigate={navigate}
          />
        </header>

        <main style={{
          flex: 1, minHeight: 0, overflow: "auto",
          padding: "1rem 1.5rem", display: "flex", flexDirection: "column",
        }}>
          <div className={slideClass} style={{
            flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
          }}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* ── Overview ── */}
              <Route path="dashboard"        element={<AdminDashboard />} />
              <Route path="agency-dashboard" element={<AgencyDashboard dark={dark} />} />

              {/* ── Users ── */}
              <Route path="users"   element={<UsersPage dark={dark} />} />
              <Route path="drivers" element={<DriversPage />} />

              {/* ── Classes ── */}
              <Route path="classes"      element={<ClassesPage onNavigate={navigate} />} />
              <Route path="classes-add"  element={<AddClassPage prefill={editClass} onNavigate={navigate} />} />
              <Route path="class-detail" element={
                <ClassDetailPage classId={detailClassId} onNavigate={navigate} />
              } />

              {/* ── Vehicles ── */}
              <Route path="vehicles"        element={
                <VehiclesPage vehicles={vehicles} setVehicles={setVehicles} onNavigate={navigate} />
              } />
              <Route path="agency-vehicles" element={
                <AddVehiclePage
                  prefill={editVehicle as Vehicle | null}
                  setVehicles={setVehicles}
                  onNavigate={navigate}
                />
              } />

              {/* ── Trips & Rides ── */}
              <Route path="trips"          element={<TripsPage dark={dark} />} />
              <Route path="available-rides" element={<AvailableRidesPage />} />
              <Route path="upcoming-rides"  element={<UpcomingRidesPage />} />
              <Route path="past-rides"      element={<PastRidesPage />} />

              {/* ── Billing ── */}
              <Route path="payments"      element={<AgencyPaymentsData />} />
              <Route path="agency-billing" element={
                <PlaceholderPage title="Agency Billing" icon="💳"
                  description="View and manage agency billing records." />
              } />

              {/* ── Other ── */}
              <Route path="work-area" element={<WorkAreasPage />} />
              <Route path="help"         element={<HelpCenter dark={dark} />} />
              <Route path="help-center"  element={<HelpCenterAdmin dark={dark} />} />
              <Route path="settings"  element={<Settings dark={dark} onToggleDark={onToggleDark} />} />
              <Route path="security"  element={
                <PlaceholderPage title="Security" icon="🛡️"
                  description="Manage permissions, 2FA and audit logs." />
              } />

              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}