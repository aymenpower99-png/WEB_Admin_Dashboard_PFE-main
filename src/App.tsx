import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginWithIntro from "./auth/LoginWithIntro";
import VerifyEmailChange from "./auth/VerifyEmailChange";
import Shell from "./routes/ShellRoutes";

import { INITIAL_VEHICLES } from "./Dashboard/Vehicles/Vehiclespage";
import type { Vehicle } from "./Dashboard/Vehicles/Vehiclespage";

import "./App.css";
import "./Dashboard/travelsync-design-system.css";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("dark") === "true");

  // ── Vehicles
  const [vehicles,    setVehicles]    = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("dark", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginWithIntro />} />
          <Route path="/verify-email-change" element={<VerifyEmailChange />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Shell
                  dark={dark}
                  onToggleDark={toggleDark}
                  vehicles={vehicles}
                  setVehicles={setVehicles}
                  editVehicle={editVehicle}
                  setEditVehicle={setEditVehicle}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}