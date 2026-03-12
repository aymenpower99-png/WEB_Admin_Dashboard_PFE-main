import { useState, useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import type { Driver } from "./DriversPage";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
export interface AddDriverPageProps {
  prefill: Driver | null;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  onNavigate: (page: string) => void;
}

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const LANGUAGES = ["English", "Arabic", "French", "Spanish", "German", "Italian"] as const;

interface FormState { firstName: string; lastName: string; phone: string; email: string; language: string; }
interface ErrState  { firstName: string; lastName: string; phone: string; email: string; language: string; }

const EMPTY_FORM: FormState = { firstName: "", lastName: "", phone: "", email: "", language: "" };
const EMPTY_ERRS: ErrState  = { firstName: "", lastName: "", phone: "", email: "", language: "" };

/* ─── VALIDATION ─────────────────────────────────────────────────────── */
function validate(f: FormState): ErrState {
  const e = { ...EMPTY_ERRS };
  if (!f.firstName.trim())                               e.firstName = "First name is required.";
  if (!f.lastName.trim())                                e.lastName  = "Last name is required.";
  if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 7)
                                                         e.phone     = "Enter a valid phone number.";
  if (!f.email.trim())                                   e.email     = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email     = "Enter a valid email address.";
  if (!f.language)                                       e.language  = "Please select a language.";
  return e;
}
const hasErrors = (e: ErrState) => Object.values(e).some(Boolean);

/* ─── DROPDOWN ───────────────────────────────────────────────────────── */
interface DropdownOption { value: string; label: string; }

interface PlainDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  error?: string;
  placeholder?: string;
}

function PlainDropdown({ value, onChange, options, error, placeholder = "SELECT" }: PlainDropdownProps) {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: ".55rem .75rem",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderBottom: open ? "none" : `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
          background: "var(--bg-card)",
          fontSize: ".82rem",
          color: selected ? "var(--text-h)" : "var(--text-faint)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {selected ? selected.label : placeholder}
      </div>

      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)",
          zIndex: 999,
          overflow: "hidden",
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem",
                paddingLeft: hovered === opt.value ? "1.1rem" : ".75rem",
                fontSize: ".82rem",
                color: hovered === opt.value ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.value ? "var(--rider-bg)" : "transparent",
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

/* ─── FIELD WRAPPER ──────────────────────────────────────────────────── */
function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
      <label className="ts-label">{label}</label>
      {children}
      {error && (
        <p className="ts-err" style={{ display: "flex", alignItems: "center", gap: ".25rem", marginTop: ".1rem" }}>
          <ErrorRoundedIcon style={{ fontSize: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function AddDriverPage({ prefill, setDrivers, onNavigate }: AddDriverPageProps) {
  const isEdit = !!prefill;

  const [form, setForm] = useState<FormState>(
    prefill
      ? { firstName: prefill.first, lastName: prefill.last, phone: prefill.phone, email: prefill.email, language: prefill.lang }
      : { ...EMPTY_FORM }
  );
  const [errs,      setErrs] = useState<ErrState>({ ...EMPTY_ERRS });
  const [submitted, setSub]  = useState(false);

  const set = (key: keyof FormState, val: string) => {
    const next = { ...form, [key]: val };
    setForm(next);
    if (submitted) setErrs(validate(next));
  };

  const handleSubmit = () => {
    setSub(true);
    const e = validate(form);
    setErrs(e);
    if (hasErrors(e)) return;

    if (isEdit && prefill) {
      setDrivers(prev => prev.map(d => d.id === prefill.id
        ? { ...d, first: form.firstName, last: form.lastName, phone: form.phone, email: form.email, lang: form.language }
        : d
      ));
    } else {
      const newDriver: Driver = {
        id:       Date.now(),
        first:    form.firstName,
        last:     form.lastName,
        phone:    form.phone,
        email:    form.email,
        lang:     form.language,
        status:   "offline",
        vehicle:  "—",
        plate:    "—",
        trips:    0,
        earnings: 0,
        rating:   5.0,
        seed:     form.firstName + form.lastName,
      };
      setDrivers(prev => [...prev, newDriver]);
    }
    onNavigate("drivers");
  };

  const languageOptions: DropdownOption[] = LANGUAGES.map(l => ({ value: l, label: l }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "100%" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("drivers")} title="Back to Drivers">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title">{isEdit ? "Edit Driver" : "Add New Driver"}</h1>
          <p className="ts-page-subtitle">
            {isEdit
              ? `Editing profile for ${prefill!.first} ${prefill!.last}`
              : "Register a new driver to your fleet"}
          </p>
        </div>
      </div>

      <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

        {/* ── Name row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="First Name" error={errs.firstName}>
            <input
              className={`ts-input${errs.firstName ? " ts-input-error" : ""}`}
              placeholder="e.g. John"
              value={form.firstName}
              onChange={e => set("firstName", e.target.value)}
            />
          </Field>
          <Field label="Last Name" error={errs.lastName}>
            <input
              className={`ts-input${errs.lastName ? " ts-input-error" : ""}`}
              placeholder="e.g. Doe"
              value={form.lastName}
              onChange={e => set("lastName", e.target.value)}
            />
          </Field>
        </div>

        {/* ── Phone ── */}
        <Field label="Phone Number" error={errs.phone}>
          <PhoneInput
            country={"us"}
            value={form.phone}
            onChange={(phone) => set("phone", phone)}
            inputStyle={{
              width: "100%",
              height: "2.25rem",
              fontSize: ".85rem",
              borderRadius: "var(--r-inner)",
              border: errs.phone
                ? "1.5px solid var(--blocked-fg)"
                : "1.5px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-h)",
              paddingLeft: "3rem",
              fontFamily: "var(--font)",
            }}
            buttonStyle={{
              border: errs.phone
                ? "1.5px solid var(--blocked-fg)"
                : "1.5px solid var(--border)",
              borderRight: "none",
              borderRadius: "var(--r-inner) 0 0 var(--r-inner)",
              background: "var(--bg-card)",
            }}
            dropdownStyle={{
              borderRadius: "var(--r-inner)",
              fontSize: ".82rem",
              zIndex: 999,
            }}
            containerStyle={{ width: "100%" }}
            enableSearch
            searchPlaceholder="Search country..."
          />
        </Field>

        {/* ── Email ── */}
        <Field label="Email Address" error={errs.email}>
          <input
            className={`ts-input${errs.email ? " ts-input-error" : ""}`}
            placeholder="driver@email.com"
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
          />
        </Field>

        {/* ── Language ── */}
        <Field label="Driver Language" error={errs.language}>
          <PlainDropdown
            value={form.language}
            onChange={v => set("language", v)}
            options={languageOptions}
            error={errs.language}
            placeholder="Select a language…"
          />
        </Field>

        {/* ── Footer buttons ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
          <button className="ts-btn-ghost" onClick={() => onNavigate("drivers")}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit}>
            {isEdit
              ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</>
              : <><PersonAddAlt1RoundedIcon style={{ fontSize: 14 }} /> Add Driver</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}