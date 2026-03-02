import { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import TruckLoader from "./carsloginanimation";

export default function LoginAdmin({ onLogin }: { onLogin: (dark: boolean) => void }) {
  // const [dark, setDark] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const savedDark = localStorage.getItem("dark") === "false";
    const [dark, setDark] = useState(savedDark);

    const navigate = useNavigate();
  
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onLogin(dark);

      navigate("/dashboard");
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const t = {
    pageBg:        dark ? "#030712"                : "#f3f4f6",   
    leftBorder:    dark ? "rgba(168,85,247,0.15)"  : "rgba(168,85,247,0.12)",
    rightBg:       dark ? "#111827"                : "#ffffff",  
    heading:       dark ? "#f3f4f6"                : "#111827",   
    sub:           dark ? "#6b7280"                : "#6b7280",
    label:         dark ? "#6b7280"                : "#6b7280",
    inputBg:       dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    inputBorder:   dark ? "rgba(168,85,247,0.2)"   : "rgba(168,85,247,0.25)",
    inputColor:    dark ? "#f3f4f6"                : "#111827",
    inputFocusBg:  dark ? "rgba(168,85,247,0.06)"  : "rgba(168,85,247,0.05)",
    checkBorder:   dark ? "rgba(255,255,255,0.15)"  : "rgba(0,0,0,0.15)",
    securityBg:    dark ? "rgba(168,85,247,0.05)"   : "rgba(168,85,247,0.04)",
    securityBd:    dark ? "rgba(168,85,247,0.15)"   : "rgba(168,85,247,0.15)",
    securityTxt:   dark ? "#9ca3af"                : "#6b7280",
    divider:       dark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)",
    dividerTxt:    dark ? "#4b5563"                : "#9ca3af",
    googleBg:      dark ? "rgba(255,255,255,0.03)"  : "rgba(0,0,0,0.03)",
    googleBd:      dark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.10)",
    googleTxt:     dark ? "#9ca3af"                : "#6b7280",
    googleHoverBg: dark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.06)",
    googleHoverTxt:dark ? "#f3f4f6"                : "#111827",
    footerTxt:     dark ? "#374151"                : "#9ca3af",
    kpiBg0:        dark ? "rgba(168,85,247,0.06)"   : "rgba(168,85,247,0.04)",
    kpiBg1:        dark ? "rgba(168,85,247,0.03)"   : "rgba(168,85,247,0.02)",
    kpiBorder:     dark ? "rgba(168,85,247,0.15)"   : "rgba(168,85,247,0.12)",
    kpiVal:        dark ? "#f3f4f6"                : "#111827",
    kpiLbl:        dark ? "#6b7280"                : "#6b7280",
    glowL:         dark ? "rgba(168,85,247,0.14)"   : "rgba(168,85,247,0.08)",
    glowR:         dark ? "rgba(124,58,237,0.12)"   : "rgba(124,58,237,0.06)",
    toggleBg:      dark ? "rgba(168,85,247,0.08)"   : "rgba(168,85,247,0.08)",
    toggleBd:      dark ? "rgba(168,85,247,0.25)"   : "rgba(168,85,247,0.25)",
    accent:        "#a855f7",
    accentGrad:    "linear-gradient(135deg, #a855f7, #7c3aed)",
  };

  return (
    <div
      className={`min-h-screen flex relative overflow-hidden transition-colors duration-300 ${dark ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"}`}
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />
      {/* Glow TL */}
      <div className="absolute rounded-full pointer-events-none" style={{
        top: -160, left: -160, width: 520, height: 520,
        background: `radial-gradient(circle, ${t.glowL} 0%, transparent 70%)`,
      }} />
      {/* Glow BR */}
      <div className="absolute rounded-full pointer-events-none" style={{
        bottom: -120, right: 100, width: 380, height: 380,
        background: `radial-gradient(circle, ${t.glowR} 0%, transparent 70%)`,
      }} />

      {/* ── Left panel ── */}
      <div className="flex-1 flex flex-col justify-between transition-colors duration-300"
        style={{ padding: "52px 72px", borderRight: `1px solid ${t.leftBorder}` }}>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-32 h-32 "
              >
                
               <img src={logo} alt="Logo" className="w-72 mx-auto" />

            </div>
            <div>
              <div className="font-extrabold text-4xl" style={{ color: t.heading, letterSpacing: "-0.5px" }}>
                Moviroo
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: t.sub }}>
                Operations Console
              </div>
            </div>
          </div>

          
        
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
            style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#a855f7" }}>
              SYSTEM OPERATIONAL
            </span>
          </div>

          <h1 className="font-black  leading-none mb-5 transition-colors duration-300"
            style={{ fontSize: 52, letterSpacing: "-2.5px", color: t.heading }}>
            Transport
            <span className="p-2" style={{
              background: "linear-gradient(135deg, #a855f7 20%, #7c3aed 80%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Command</span>
            Center.
          </h1>

          <p className="text-sm leading-relaxed max-w-sm transition-colors duration-300" style={{ color: t.sub }}>
            Real-time fleet oversight, driver management, and route optimization — built for professionals.
          </p>

          {/* KPI row */}
          <div className="flex mt-12 rounded-2xl overflow-hidden transition-colors duration-300"
            style={{ border: `1px solid ${t.kpiBorder}` }}>
            {[
              { value: "312", label: "Active Vehicles" },
              { value: "98.2%", label: "On-Time Rate" },
              { value: "4.8K", label: "Trips Today" },
            ].map((s, i) => (
              <div key={s.label} className="flex-1 p-5 transition-colors duration-300" style={{
                background: i % 2 === 0 ? t.kpiBg0 : t.kpiBg1,
                borderRight: i < 2 ? `1px solid ${t.kpiBorder}` : "none",
              }}>
                <div className="text-lg mb-1"></div>
                <div className="text-xl font-extrabold transition-colors duration-300"
                  style={{ color: t.kpiVal, letterSpacing: "-0.5px" }}>{s.value}</div>
                <div className="text-xs mt-1 tracking-wide transition-colors duration-300"
                  style={{ color: t.kpiLbl }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs transition-colors duration-300" style={{ color: t.footerTxt }}>
          © {new Date().getFullYear()} moviroo Inc. — All rights reserved.
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="w-[480px] flex items-center justify-center transition-colors duration-300"
        style={{ padding: "48px 56px", background: t.rightBg }}>
        <div className="w-full">
  <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 m-6 rounded-full absolute top-0 right-0  px-3 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              background: t.toggleBg,
              border: `1px solid ${t.toggleBd}`,
              color: t.sub,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <span className=" text-sm">            {dark ? "☀" : ""}
</span>
                        {dark ? "" : "🌙"}

            <div className="relative rounded-full flex-shrink-0 transition-colors duration-300"
      ><div className="max-w-16 max-h-16"></div>
              <div className="absolute top-0.5 rounded-full bg-white shadow transition-all duration-300"
               />
            </div>
          </button>
          <div className="mb-10">
            <h2 className="font-extrabold mb-2 transition-colors duration-300"
              style={{ fontSize: 28, color: t.heading, letterSpacing: "-1px" }}>Sign in</h2>
            <p className="text-sm transition-colors duration-300" style={{ color: t.sub }}>
              Access restricted to authorized personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-300"
                style={{ color: t.label }}>Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                  style={{ color: t.dividerTxt }}>✉</span>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@moviroo.io"
                  className="w-full rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    padding: "13px 16px 13px 42px",
                    border: `1px solid ${t.inputBorder}`,
                    background: t.inputBg, color: t.inputColor,
                    fontFamily: "inherit", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#a855f7"; e.target.style.background = t.inputFocusBg; }}
                  onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.background = t.inputBg; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-300"
                style={{ color: t.label }}>Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                  style={{ color: t.dividerTxt }}>🔒</span>
                <input
                  type={showPass ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    padding: "13px 46px 13px 42px",
                    border: `1px solid ${t.inputBorder}`,
                    background: t.inputBg, color: t.inputColor,
                    fontFamily: "inherit", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#a855f7"; e.target.style.background = t.inputFocusBg; }}
                  onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.background = t.inputBg; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 leading-none text-base"
                  style={{ color: t.sub }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setRemember(!remember)}>
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    border: `2px solid ${remember ? "#a855f7" : t.checkBorder}`,
                    background: remember ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "transparent",
                  }}>
                  {remember && <span className="text-white font-bold" style={{ fontSize: 10, lineHeight: 1 }}>✓</span>}
                </div>
                <span className="text-sm transition-colors duration-300" style={{ color: t.sub }}>Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium" style={{ color: "#a855f7", textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl font-bold text-sm text-white transition-all duration-200"
              style={{
                padding: "15px",
                background: loading ? "rgba(168,85,247,0.3)" : "linear-gradient(135deg, #a855f7, #7c3aed)",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", letterSpacing: "0.3px",
                boxShadow: loading ? "none" : "0 4px 24px rgba(168,85,247,0.35)",
              }} >

<Link to="/dashboard">
</Link>
              {loading ? "Authenticating..." : "Sign in to Dash"}
            </button>
          </form>

          {/* Security note */}
          <div className="flex items-start gap-2 mt-7 rounded-xl p-4 transition-colors duration-300"
            style={{ background: t.securityBg, border: `1px solid ${t.securityBd}` }}>
            <span className="text-base flex-shrink-0 mt-0.5">🛡</span>
            <p className="text-xs leading-relaxed m-0 transition-colors duration-300" style={{ color: t.securityTxt }}>
              This system is monitored. Unauthorized access attempts are logged and reported.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-px transition-colors duration-300" style={{ background: t.divider }} />
            <span className="text-xs tracking-widest transition-colors duration-300" style={{ color: t.dividerTxt }}>OR</span>
            <div className="flex-1 h-px transition-colors duration-300" style={{ background: t.divider }} />
          </div>

          {/* Google */}
          <button
            className="mt-4 w-full flex items-center justify-center gap-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              padding: "13px", border: `1px solid ${t.googleBd}`,
              background: t.googleBg, color: t.googleTxt,
              cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = t.googleHoverBg; e.currentTarget.style.color = t.googleHoverTxt; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = t.googleBg; e.currentTarget.style.color = t.googleTxt; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M21.6 12.227c0-.868-.075-1.703-.216-2.506H12v4.737h5.381a4.6 4.6 0 01-1.995 3.018v2.508h3.23c1.892-1.742 2.984-4.306 2.984-7.757z" fill="#4285F4"/>
              <path d="M12 22c2.7 0 4.965-.895 6.616-2.416l-3.23-2.508c-.896.6-2.042.954-3.386.954-2.604 0-4.81-1.76-5.6-4.122H3.07v2.59A9.996 9.996 0 0012 22z" fill="#34A853"/>
              <path d="M6.4 13.908A6.008 6.008 0 016.085 12c0-.664.114-1.31.315-1.908V7.502H3.07A9.996 9.996 0 002 12c0 1.614.387 3.14 1.07 4.498l3.33-2.59z" fill="#FBBC05"/>
              <path d="M12 5.97c1.467 0 2.783.505 3.817 1.496l2.862-2.862C16.96 2.99 14.696 2 12 2 8.337 2 5.19 4.07 3.07 7.502l3.33 2.59C7.19 7.729 9.396 5.97 12 5.97z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}