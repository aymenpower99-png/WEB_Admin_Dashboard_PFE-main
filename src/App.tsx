import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./Dashboard/AdminDashboard";
import LoginAdmin from "./auth/login";
import "./App.css";
import IntroLoader from "./into/IntroLoader";

function LoginWithIntro() {
  const [showIntro, setShowIntro] = useState(true);
  
  if (showIntro) {
    return <IntroLoader onDone={() => setShowIntro(false)} onFinish={() => setShowIntro(false)} dark={false} />;
  }

  return <LoginAdmin onLogin={() => {}} />;
}

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  function toggleDark() {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("dark", String(next));
      return next;
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWithIntro />} />
        <Route
          path="/dashboard"
          element={
            <AdminDashboard
              dark={dark}
              onToggleDark={toggleDark}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}