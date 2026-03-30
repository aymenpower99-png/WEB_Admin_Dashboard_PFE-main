import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginWithIntro from "./auth/LoginWithIntro";
import Shell from "./routes/ShellRoutes";

import { INITIAL_DRIVERS } from "./Dashboard/Drivers & Vehicles/DriversPage";
import { INITIAL_VEHICLES } from "./Dashboard/Drivers & Vehicles/Vehiclespage";
import { INITIAL_AREAS, INITIAL_DRIVERS as INITIAL_WORK_AREA_DRIVERS } from "./Dashboard/WorkArea/WorkAreasPage";

import type { Driver }  from "./Dashboard/Drivers & Vehicles/DriversPage";
import type { Vehicle } from "./Dashboard/Drivers & Vehicles/Vehiclespage";
import type { WorkArea, Driver as WorkAreaDriver } from "./Dashboard/WorkArea/WorkAreasPage";

import "./App.css";
import "./Dashboard/travelsync-design-system.css";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("dark") === "true");

  const [drivers,        setDrivers]        = useState<Driver[]>(INITIAL_DRIVERS);
  const [editDriver,     setEditDriver]      = useState<Driver | null>(null);
  const [vehicles,       setVehicles]        = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [editVehicle,    setEditVehicle]     = useState<Vehicle | null>(null);
  const [areas,          setAreas]           = useState<WorkArea[]>(INITIAL_AREAS);
  const [workAreaDrivers, setWorkAreaDrivers] = useState<WorkAreaDriver[]>(INITIAL_WORK_AREA_DRIVERS);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("dark", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginWithIntro />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Shell
                  dark={dark}
                  onToggleDark={toggleDark}
                  drivers={drivers}         setDrivers={setDrivers}
                  editDriver={editDriver}   setEditDriver={setEditDriver}
                  vehicles={vehicles}       setVehicles={setVehicles}
                  editVehicle={editVehicle} setEditVehicle={setEditVehicle}
                  areas={areas}             setAreas={setAreas}
                  workAreaDrivers={workAreaDrivers} setWorkAreaDrivers={setWorkAreaDrivers}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}