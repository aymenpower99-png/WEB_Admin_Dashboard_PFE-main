import { useState, useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import apiClient from "../../../api/apiClient";
import "../../travelsync-design-system.css";

interface Props {
  userId:    string;
  userName:  string;
  onClose:   () => void;
  onSuccess: () => void;
}

type Language = "English" | "French" | "Arabic";

const LANG_OPTIONS: { value: Language; flag: string; label: string }[] = [
  { value: "English", flag: "🇬🇧", label: "English" },
  { value: "French",  flag: "🇫🇷", label: "French"  },
  { value: "Arabic",  flag: "🇸🇦", label: "Arabic"  },
];

/* ─── Language Dropdown — same PlainDropdown style as AddDriverPage ───────── */
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

      {/* Trigger — same style as AddDriverPage PlainDropdown */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: ".55rem .75rem",
          border: `1px solid var(--border)`,
          borderBottom: open ? "none" : "1px solid var(--border)",
          borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
          background: "var(--bg-card)",
          fontSize: ".82rem",
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
          ? <><span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{selected.flag}</span>{selected.label}</>
          : <span>Select a language…</span>
        }
      </div>

      {/* List — rendered INSIDE the div (not portal), above everything */}
      {open && (
        <div style={{
          position: "absolute",
          top: "100%", left: 0, right: 0,
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)",
          zIndex: 999999,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,.12)",
        }}>
          {LANG_OPTIONS.map(opt => (
            <div
              key={opt.value}
              onMouseDown={e => {
                // use onMouseDown so it fires before the overlay's onClick blur
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
                fontSize: ".82rem",
                display: "flex",
                alignItems: "center",
                gap: ".55rem",
                color: hovered === opt.value ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.value ? "var(--rider-bg)" : "transparent",
                cursor: "pointer",
                transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}
            >
              {/* flag ONLY — no "GB" / "FR" text */}
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{opt.flag}</span>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */
export default function CompleteDriverProfileModal({ userId, userName, onClose, onSuccess }: Props) {
  const [phone,    setPhone]    = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [error,    setError]    = useState("");
  const [saving,   setSaving]   = useState(false);

  async function handleSubmit() {
    setError("");
    setSaving(true);
    try {
      await apiClient.post("/drivers", {
        userId,
        ...(phone    ? { phone: `+${phone}` } : {}),
        ...(language ? { language }            : {}),
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
    /* ── Overlay: only close when clicking the dark backdrop itself ── */
    <div
      className="ts-overlay"
      style={{ zIndex: 9999 }}
      onMouseDown={e => {
        // close only when the backdrop (not the modal card) is clicked
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Modal card: stop ALL events from bubbling to overlay ── */}
      <div
        className="ts-modal"
        style={{ maxWidth: 420, width: "100%" }}
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
        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

          {error && (
            <div style={{
              background: "#fee2e2", color: "#991b1b",
              borderRadius: 6, padding: ".5rem .75rem", fontSize: ".8rem",
            }}>
              {error}
            </div>
          )}

          {/* Phone — exact same PhoneInput config as AddDriverPage */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label className="ts-label">Phone Number</label>
            <PhoneInput
              country="dz"
              value={phone}
              onChange={val => setPhone(val)}
              inputStyle={{
                width: "100%",
                height: "2.25rem",
                fontSize: ".85rem",
                borderRadius: "var(--r-inner)",
                border: "1.5px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-h)",
                paddingLeft: "3rem",
                fontFamily: "var(--font)",
              }}
              buttonStyle={{
                border: "1.5px solid var(--border)",
                borderRight: "none",
                borderRadius: "var(--r-inner) 0 0 var(--r-inner)",
                background: "var(--bg-card)",
              }}
              dropdownStyle={{
                borderRadius: "var(--r-inner)",
                fontSize: ".82rem",
                zIndex: 999999,
              }}
              containerStyle={{ width: "100%" }}
              enableSearch
              searchPlaceholder="Search country…"
            />
          </div>

          {/* Language */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label className="ts-label">Driver Language</label>
            <LangDropdown value={language} onChange={setLanguage} />
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