import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface TopNavProps {
  onToggleSidebar?: () => void;
  dark?: boolean;
  onToggleDark?: () => void;
  onSearch?: (q: string) => void;
  onNavigate?: (page: string) => void;
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function TravelSyncTopNav({ onToggleSidebar, dark, onToggleDark, onNavigate }: TopNavProps) {
  const [open, setOpen] = useState(false);
  const popRef     = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin"
    : "Admin";
  const displayRole = "Super Admin";

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

  const handleLogout = async () => {
    setOpen(false);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch {
      // ignore network errors — still clear session locally
    }
    logout();
  };

  return (
    <>
      <style>{`
        @keyframes ts-pop-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .topnav-trigger:hover        { background: rgba(168,85,247,0.10) !important; }
        .dark-toggle-pill:hover      { background: rgba(168,85,247,0.10) !important; }
        .pop-item                    { transition: background 0.12s; cursor: pointer; }
        .pop-item:hover              { background: var(--brand-soft-hover) !important; }
        .pop-logout:hover            { background: rgba(239,68,68,0.1) !important; }
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
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem", position:"relative" }}>

          {/* Dark / Light toggle pill — shows CURRENT mode, click switches to the other */}
          <button
            className="dark-toggle-pill"
            onClick={onToggleDark}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display:"flex", alignItems:"center", gap:"0.4rem",
              padding:"0.375rem 0.75rem",
              borderRadius:"9999px",
              border:"1px solid rgba(168,85,247,0.25)",
              background:"rgba(168,85,247,0.05)",
              color: dark ? "#fbbf24" : "#7c3aed",
              cursor:"pointer",
              fontSize:"0.75rem",
              fontWeight:600,
              fontFamily:"inherit",
              transition:"background 0.2s, color 0.2s",
              letterSpacing:"0.02em",
            }}
          >
            {dark ? <MoonIcon /> : <SunIcon />}
            <span>{dark ? "Dark" : "Light"}</span>
          </button>

          {/* Profile trigger */}
          <button
            ref={triggerRef}
            className="topnav-trigger"
            onClick={() => setOpen(v => !v)}
            style={{
              display:"flex", alignItems:"center", gap:"0.5rem",
              cursor:"pointer", padding:"0.25rem 0.375rem",
              borderRadius:"0.5rem",
              border:"none",
              background:"transparent",
              transition:"background 0.15s",
            }}
          >
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
              <span style={{
                fontSize:"0.8125rem", fontWeight:700,
                color:"var(--text-h)", whiteSpace:"nowrap", lineHeight:1.2,
              }}>
                {displayName}
              </span>
              <span style={{ fontSize:"0.65rem", color:"#a855f7", fontWeight:600, letterSpacing:"0.02em" }}>
                {displayRole}
              </span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(168,85,247,0.6)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                transition:"transform 0.2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink:0,
              }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Profile popover */}
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
                padding:"0.875rem 1rem", borderBottom:"1px solid var(--border)",
                background:"var(--bg-card)",
              }}>
                <div style={{ fontSize:"0.875rem", fontWeight:700, color:"var(--text-h)" }}>{displayName}</div>
                <div style={{ fontSize:"0.75rem", color:"#a855f7", fontWeight:600, marginTop:"0.1rem" }}>{displayRole}</div>
              </div>

              <div style={{ padding:"0.375rem", background:"var(--bg-card)" }}>

                {/* Settings */}
                <button className="pop-item" onClick={() => handleNavigate("settings")}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:"0.625rem",
                    padding:"0.5rem 0.625rem", borderRadius:"0.5rem",
                    border:"none", background:"transparent",
                    color:"var(--text-h)", fontSize:"0.8125rem", fontWeight:500,
                    textAlign:"left", cursor:"pointer",
                  }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Settings
                </button>

                <div style={{ height:1, background:"var(--border)", margin:"0.25rem 0" }} />

                {/* Log out */}
                <button className="pop-item pop-logout" onClick={handleLogout}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:"0.625rem",
                    padding:"0.5rem 0.625rem", borderRadius:"0.5rem",
                    border:"none", background:"transparent",
                    color:"#ef4444", fontSize:"0.8125rem", fontWeight:500,
                    textAlign:"left", cursor:"pointer",
                  }}>
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