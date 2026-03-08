import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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

/* ─── VALIDATION ──────────────────────────────────────────────────────── */
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

/* ─── FIELD WRAPPER ──────────────────────────────────────────────────── */
function Field({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon: React.ElementType;
  error: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
      <label className="ts-label" style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
        <Icon style={{ fontSize: 13, color: "var(--text-faint)" }} />
        {label}
      </label>
      {children}
      {error && (
        <p style={{ display: "flex", alignItems: "center", gap: ".25rem", fontSize: ".7rem", color: "#ef4444", marginTop: ".1rem" }}>
          <ErrorRoundedIcon style={{ fontSize: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─── SUCCESS STATE ──────────────────────────────────────────────────── */
function SuccessBanner({
  name, isEdit, onBack, onAddAnother,
}: {
  name: string; isEdit: boolean; onBack: () => void; onAddAnother: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "3rem 2rem", textAlign: "center", background: "var(--bg-card)", borderRadius: "1rem", border: "1px solid var(--border)", animation: "tsSettingsIn .3s ease" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckCircleRoundedIcon style={{ fontSize: 30, color: "#059669" }} />
      </div>
      <div>
        <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-h)" }}>{isEdit ? "Changes Saved!" : "Driver Added!"}</p>
        <p style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: ".3rem" }}>
          {name} has been {isEdit ? "updated" : "registered"} successfully.
        </p>
      </div>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <button className="ts-btn-ghost" onClick={onBack}>
          <ArrowBackRoundedIcon style={{ fontSize: 14 }} /> Back to Drivers
        </button>
        {!isEdit && (
          <button className="ts-btn-primary" onClick={onAddAnother}>
            <PersonAddAlt1RoundedIcon style={{ fontSize: 14 }} /> Add Another
          </button>
        )}
      </div>
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
  const [errs,    setErrs]    = useState<ErrState>({ ...EMPTY_ERRS });
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSub]   = useState(false);
  const [success,   setOk]    = useState(false);

  const set = (key: keyof FormState, val: string) => {
    const next = { ...form, [key]: val };
    setForm(next);
    if (submitted || touched[key]) setErrs(validate(next));
  };

  const blur = (key: keyof FormState) => {
    setTouched(t => ({ ...t, [key]: true }));
    setErrs(validate(form));
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
    setOk(true);
  };

  const reset = () => {
    setForm({ ...EMPTY_FORM });
    setErrs({ ...EMPTY_ERRS });
    setTouched({});
    setSub(false);
    setOk(false);
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "100%" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("drivers")} title="Back to Drivers">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.15rem" }}>
            {isEdit ? "Edit Driver" : "Add New Driver"}
          </h1>
          <p className="ts-page-subtitle">
            {isEdit
              ? `Editing profile for ${prefill!.first} ${prefill!.last}`
              : "Register a new driver to your fleet"}
          </p>
        </div>
      </div>

      {success ? (
        <SuccessBanner
          name={fullName}
          isEdit={isEdit}
          onBack={() => onNavigate("drivers")}
          onAddAnother={reset}
        />
      ) : (
        <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

          {/* ── Name row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="First Name" icon={PersonRoundedIcon} error={errs.firstName}>
              <input
                className={`ts-input${errs.firstName ? " ts-input-error" : ""}`}
                placeholder="e.g. John"
                value={form.firstName}
                onChange={e => set("firstName", e.target.value)}
                onBlur={() => blur("firstName")}
              />
            </Field>
            <Field label="Last Name" icon={PersonRoundedIcon} error={errs.lastName}>
              <input
                className={`ts-input${errs.lastName ? " ts-input-error" : ""}`}
                placeholder="e.g. Doe"
                value={form.lastName}
                onChange={e => set("lastName", e.target.value)}
                onBlur={() => blur("lastName")}
              />
            </Field>
          </div>

          {/* ── Phone ── */}
          <Field label="Phone Number" icon={PersonRoundedIcon} error={errs.phone}>
            <PhoneInput
              country={"us"}
              value={form.phone}
              onChange={(phone) => set("phone", phone)}
              onBlur={() => blur("phone")}
              inputStyle={{
                width: "100%",
                height: "2.25rem",
                fontSize: ".85rem",
                borderRadius: "var(--radius, .5rem)",
                border: errs.phone
                  ? "1.5px solid #ef4444"
                  : "1.5px solid var(--border)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-h)",
                paddingLeft: "3rem",
                fontFamily: "inherit",
              }}
              buttonStyle={{
                border: errs.phone
                  ? "1.5px solid #ef4444"
                  : "1.5px solid var(--border)",
                borderRight: "none",
                borderRadius: "var(--radius, .5rem) 0 0 var(--radius, .5rem)",
                background: "var(--bg-input, #fff)",
              }}
              dropdownStyle={{
                borderRadius: ".5rem",
                fontSize: ".82rem",
                zIndex: 999,
              }}
              containerStyle={{ width: "100%" }}
              enableSearch
              searchPlaceholder="Search country..."
            />
          </Field>

          {/* ── Email ── (separate row — gap from phone above) */}
          <Field label="Email Address" icon={EmailRoundedIcon} error={errs.email}>
            <input
              className={`ts-input${errs.email ? " ts-input-error" : ""}`}
              placeholder="driver@email.com"
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              onBlur={() => blur("email")}
            />
          </Field>

          {/* ── Language ── */}
          <Field label="Driver Language" icon={LanguageRoundedIcon} error={errs.language}>
            <select
              className={`ts-input ts-settings-select${errs.language ? " ts-input-error" : ""}`}
              value={form.language}
              onChange={e => set("language", e.target.value)}
              onBlur={() => blur("language")}
              style={{ appearance: "none", cursor: "pointer" }}
            >
              <option value="">Select a language…</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
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
      )}
    </div>
  );
}