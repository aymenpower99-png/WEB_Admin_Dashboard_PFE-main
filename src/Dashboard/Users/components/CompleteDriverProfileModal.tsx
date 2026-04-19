import { useState, useRef, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import "../../travelsync-design-system.css";

// ─── Flag image imports ───────────────────────────────────────────────────────
import tunisiaFlag from "../../../assets/tunisia.png";
// Add more flag imports here as needed:
// import algeriaFlag from "/assets/algeria.png";
// import moroccoFlag from "/assets/morocco.png";

interface Props {
  userId:    string;
  userName:  string;
  onClose:   () => void;
  onSuccess: () => void;
}

type Language = "English" | "French" | "Arabic";

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: "English", label: "English" },
  { value: "French",  label: "French"  },
  { value: "Arabic",  label: "Arabic"  },
];

/* ─── Countries with dial codes and flags ────────────────────────────── */
const COUNTRIES = [
  { code: "+216", flag: tunisiaFlag, name: "Tunisia" },
  // Add more countries later like:
  // { code: "+213", flag: algeriaFlag, name: "Algeria" },
  // { code: "+212", flag: moroccoFlag, name: "Morocco" },
];

/* ─── Language Dropdown ─────────────────────────────────────────────── */
function LangDropdown({
  value,
  onChange,
}: {
  value: Language | "";
  onChange: (v: Language) => void;
}) {
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = LANG_OPTIONS.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "0 .75rem",
          border: "1px solid var(--border)",
          borderBottom: open ? "none" : "1px solid var(--border)",
          borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
          background: "var(--bg-card)",
          fontSize: ".85rem",
          color: selected ? "var(--text-h)" : "var(--text-faint)",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          height: "2.25rem",
          boxSizing: "border-box" as const,
        }}
      >
        {selected
          ? <span>{selected.label}</span>
          : <span>Select a language…</span>
        }
        <span style={{ marginLeft: "auto", fontSize: ".7rem", color: "var(--text-faint)" }}>▾</span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)",
          zIndex: 2147483647,
          boxShadow: "0 8px 24px rgba(0,0,0,.18)",
          overflow: "visible",
        }}>
          {LANG_OPTIONS.map(opt => (
            <div
              key={opt.value}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem",
                paddingLeft: hovered === opt.value ? "1.1rem" : ".75rem",
                fontSize: ".85rem",
                display: "flex",
                alignItems: "center",
                gap: ".55rem",
                color: hovered === opt.value ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.value ? "var(--rider-bg)" : "var(--bg-card)",
                cursor: "pointer",
                transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Country Dropdown ─────────────────────────────────────────────── */
function CountryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = COUNTRIES.find(c => c.code === value);

  const handleImgError = (code: string) => {
    setImgErrors(prev => new Set(prev).add(code));
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "0 .75rem",
          border: "1px solid var(--border)",
          borderBottom: open ? "none" : "1px solid var(--border)",
          borderRight: "none",
          borderRadius: open ? ".4rem 0 0 0" : ".4rem 0 0 .4rem",
          background: "var(--bg-card)",
          fontSize: ".85rem",
          color: "var(--text-h)",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          height: "2.25rem",
          boxSizing: "border-box" as const,
          minWidth: "5.5rem",
        }}
      >
        {selected && !imgErrors.has(selected.code) ? (
          <img
            src={selected.flag}
            alt={selected.name}
            onError={() => handleImgError(selected.code)}
            style={{
              width: "1.2rem",
              height: "auto",
              display: "block",
            }}
          />
        ) : (
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>🌍</span>
        )}
        <span>{value}</span>
        <span style={{ fontSize: ".7rem", color: "var(--text-faint)" }}>▾</span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          minWidth: "12rem",
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)",
          zIndex: 2147483647,
          boxShadow: "0 8px 24px rgba(0,0,0,.18)",
          overflow: "visible",
        }}>
          {COUNTRIES.map(country => (
            <div
              key={country.code}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
                onChange(country.code);
                setOpen(false);
              }}
              onMouseEnter={() => setHovered(country.code)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem",
                paddingLeft: hovered === country.code ? "1.1rem" : ".75rem",
                fontSize: ".85rem",
                display: "flex",
                alignItems: "center",
                gap: ".55rem",
                color: hovered === country.code ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === country.code ? "var(--rider-bg)" : "var(--bg-card)",
                cursor: "pointer",
                transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}
            >
              {!imgErrors.has(country.code) ? (
                <img
                  src={country.flag}
                  alt={country.name}
                  onError={() => handleImgError(country.code)}
                  style={{
                    width: "1.2rem",
                    height: "auto",
                    display: "block",
                  }}
                />
              ) : (
                <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>🌍</span>
              )}
              <span>{country.code}</span>
              <span style={{ color: "var(--text-faint)", marginLeft: ".25rem" }}>{country.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────────── */
export default function CompleteDriverProfileModal({ userId, userName, onClose, onSuccess }: Props) {
  const [dialCode,    setDialCode]    = useState("+216");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [language,    setLanguage]    = useState<Language | "">("");
  const [salary,      setSalary]      = useState("");
  const [error,       setError]       = useState("");
  const [saving,      setSaving]      = useState(false);

  async function handleSubmit() {
    setError("");
    setSaving(true);
    const fullPhone = phoneDigits.trim() ? `${dialCode}${phoneDigits.trim()}` : "";
    try {
      await apiClient.post("/drivers", {
        userId,
        ...(fullPhone ? { phone: fullPhone } : {}),
        ...(language  ? { language }         : {}),
        ...(salary.trim() ? { fixedMonthlySalary: Number(salary) } : {}),
      });
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to setup driver profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="ts-overlay"
      style={{ zIndex: 9999 }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ts-modal"
        style={{ maxWidth: 420, width: "100%", overflow: "visible" }}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Setup Driver Profile</h2>
            <p className="ts-page-subtitle" style={{ marginTop: 2 }}>{userName}</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.1rem", overflow: "visible" }}>

          {error && (
            <div style={{
              background: "#fee2e2", color: "#991b1b",
              borderRadius: 6, padding: ".5rem .75rem", fontSize: ".8rem",
            }}>
              {error}
            </div>
          )}

          {/* ── Phone: country dropdown + digit input ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label className="ts-label">Phone Number</label>
            <div style={{ display: "flex", height: "2.25rem", width: "100%" }}>

              {/* Country code dropdown */}
              <CountryDropdown value={dialCode} onChange={setDialCode} />

              {/* Phone digits input */}
              <input
                type="tel"
                placeholder="Phone number"
                value={phoneDigits}
                onChange={e => setPhoneDigits(e.target.value)}
                style={{
                  flex: 1,
                  height: "100%",
                  fontSize: ".85rem",
                  fontFamily: "var(--font)",
                  background: "var(--bg-card)",
                  color: "var(--text-h)",
                  border: "1px solid var(--border)",
                  borderRadius: "0 .4rem .4rem 0",
                  padding: "0 .75rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* ── Language ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", position: "relative", zIndex: 10 }}>
            <label className="ts-label">Driver Language</label>
            <LangDropdown value={language} onChange={setLanguage} />
          </div>

          {/* ── Fixed Monthly Salary ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label className="ts-label">Fixed Monthly Salary (TND)</label>
            <input
              type="number"
              placeholder="e.g. 800"
              min="0"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              style={{
                height: "2.25rem",
                fontSize: ".85rem",
                fontFamily: "var(--font)",
                background: "var(--bg-card)",
                color: "var(--text-h)",
                border: "1px solid var(--border)",
                borderRadius: ".4rem",
                padding: "0 .75rem",
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : "Setup Driver"}
          </button>
        </div>

      </div>
    </div>
  );
}