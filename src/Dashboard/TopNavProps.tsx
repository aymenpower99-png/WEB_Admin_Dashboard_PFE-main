import React, { useState, useRef, useEffect } from "react";

interface TopNavProps {
  onToggleSidebar?: () => void;
  dark?: boolean;
  onToggleDark?: () => void;
  onSearch?: (q: string) => void;
  onNavigate?: (page: string) => void;
}

/* ── Icons outside component to avoid "created during render" error ── */
function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22"  y1="4.22"   x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36"  x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78"  x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"   x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function TravelSyncTopNav({ onToggleSidebar, dark, onToggleDark, onNavigate }: TopNavProps) {
  const [open, setOpen] = useState(false);
  const popRef     = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popRef.current     && !popRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleNavigate = (page: string) => {
    setOpen(false);
    onNavigate?.(page);
  };

  return (
    <>
      <style>{`
        @keyframes ts-pop-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .topnav-trigger:hover   { background: var(--brand-soft-hover) !important; }
        .dark-toggle-btn:hover  { background: var(--bg-inner) !important; }
        .pop-item               { transition: background 0.12s; cursor: pointer; }
        .pop-item:hover         { background: var(--brand-soft-hover) !important; }
        .pop-logout:hover       { background: rgba(239,68,68,0.1) !important; }
      `}</style>

      <nav style={{
        width:"100%", height:"100%",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 1.5rem", position:"relative", boxSizing:"border-box",
      }}>

        {/* LEFT — hamburger */}
        <button onClick={onToggleSidebar} style={{
          width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
          border:"none", background:"transparent", cursor:"pointer", borderRadius:"0.5rem",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* RIGHT */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", position:"relative" }}>

          {/* ── Sun / Moon toggle ── */}
          <button
            className="dark-toggle-btn"
            onClick={onToggleDark}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width:36, height:36, borderRadius:"50%",
              border:"1px solid var(--border)",
              background:"var(--bg-inner)",
              color: dark ? "#fbbf24" : "#6b7280",
              cursor:"pointer",
              transition:"background 0.2s, color 0.2s, border-color 0.2s",
              flexShrink:0,
            }}
          >
            {dark ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* ── Profile trigger ── */}
          <button
            ref={triggerRef}
            className="topnav-trigger"
            onClick={() => setOpen(v => !v)}
            style={{
              display:"flex", alignItems:"center", gap:"0.5rem",
              cursor:"pointer", padding:"0.375rem 0.625rem",
              borderRadius:"0.625rem", border:"none",
              background: open ? "var(--brand-soft)" : "transparent",
              transition:"background 0.15s",
            }}
          >
            <span style={{ fontSize:"1.1rem" }}>🇬🇧</span>
            <div style={{ width:30, height:30, borderRadius:"50%", overflow:"hidden", background:"#e9d5ff", flexShrink:0 }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Lee"
                style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <span style={{ fontSize:"0.8125rem", fontWeight:600, color:"var(--text-h)", whiteSpace:"nowrap" }}>
              Sarah Lee (Agency Manager)
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink:0 }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* ── Profile popover — uses CSS vars so dark mode works ── */}
          {open && (
            <div ref={popRef} style={{
              position:"absolute", top:"calc(100% + 10px)", right:0,
              width:240,
              background:"var(--bg-card)",
              border:"1px solid var(--border)",
              borderRadius:"0.875rem",
              boxShadow:"0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
              zIndex:9999, overflow:"hidden", animation:"ts-pop-in 0.15s ease",
            }}>

              {/* Header */}
              <div style={{
                padding:"1rem", borderBottom:"1px solid var(--border)",
                display:"flex", alignItems:"center", gap:"0.75rem",
                background:"var(--bg-card)",
              }}>
                <div style={{ width:44, height:44, borderRadius:"50%", overflow:"hidden", background:"#e9d5ff", flexShrink:0, border:"2px solid #c4b5fd" }}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Lee"
                    style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
                <div>
                  <div style={{ fontSize:"0.875rem", fontWeight:600, color:"var(--text-h)" }}>Sarah Lee</div>
                  <div style={{ fontSize:"0.75rem", color:"var(--text-faint)" }}>Agency Manager</div>
                </div>
              </div>

              <div style={{ padding:"0.375rem", background:"var(--bg-card)" }}>

                {/* Appearance toggle row */}
                <button className="pop-item"
                  onClick={() => { onToggleDark?.(); setOpen(false); }}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.625rem", padding:"0.5rem 0.625rem", borderRadius:"0.5rem", border:"none", background:"transparent", color:"var(--text-h)", fontSize:"0.8125rem", fontWeight:500, textAlign:"left", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
                    <span style={{ color:"var(--text-muted)", display:"flex" }}>
                      {dark ? <MoonIcon /> : <SunIcon />}
                    </span>
                    {dark ? "Light Mode" : "Dark Mode"}
                  </div>
                  <span style={{
                    fontSize:"0.65rem", fontWeight:700, padding:"0.15rem 0.5rem", borderRadius:"9999px",
                    background: dark ? "rgba(251,191,36,0.15)" : "var(--bg-inner)",
                    color: dark ? "#fbbf24" : "var(--text-faint)",
                  }}>
                    {dark ? "DARK" : "LIGHT"}
                  </span>
                </button>

                <div style={{ height:1, background:"var(--border)", margin:"0.25rem 0" }} />

                {/* Profile */}
                <button className="pop-item" onClick={() => handleNavigate("profile")}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.625rem", padding:"0.5rem 0.625rem", borderRadius:"0.5rem", border:"none", background:"transparent", color:"var(--text-h)", fontSize:"0.8125rem", fontWeight:500, textAlign:"left", cursor:"pointer" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profile
                </button>

                {/* Settings */}
                <button className="pop-item" onClick={() => handleNavigate("settings")}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.625rem", padding:"0.5rem 0.625rem", borderRadius:"0.5rem", border:"none", background:"transparent", color:"var(--text-h)", fontSize:"0.8125rem", fontWeight:500, textAlign:"left", cursor:"pointer" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Settings
                </button>

                {/* Security */}
                <button className="pop-item" onClick={() => handleNavigate("security")}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.625rem", padding:"0.5rem 0.625rem", borderRadius:"0.5rem", border:"none", background:"transparent", color:"var(--text-h)", fontSize:"0.8125rem", fontWeight:500, textAlign:"left", cursor:"pointer" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Security
                </button>

                <div style={{ height:1, background:"var(--border)", margin:"0.25rem 0" }} />

                {/* Log out */}
                <button className="pop-item pop-logout" onClick={() => setOpen(false)}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.625rem", padding:"0.5rem 0.625rem", borderRadius:"0.5rem", border:"none", background:"transparent", color:"#ef4444", fontSize:"0.8125rem", fontWeight:500, textAlign:"left", cursor:"pointer" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log out
                </button>

              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}