import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import AirlineSeatReclineNormalRoundedIcon from "@mui/icons-material/AirlineSeatReclineNormalRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { Vehicle } from "./Vehiclespage";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
export interface AddVehiclePageProps {
  prefill: Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate: (page: string) => void;
}

interface FormState {
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  type: string;
  vehicleClass: string;
  seats: string;
  driver: string;
}

interface ErrState {
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  type: string;
  vehicleClass: string;
  seats: string;
  driver: string;
}

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const VEHICLE_TYPES   = ["sedan", "suv", "van", "truck"] as const;
const CURRENT_YEAR    = new Date().getFullYear();
const YEARS           = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

const VEHICLE_CLASSES = [
  {
    key: "economy",
    label: "Economy",
    examples: ["Skoda Octavia", "Toyota Prius", "Hyundai Ioniq", "Caddy Volkswagen"],
  },
  {
    key: "standard",
    label: "Standard (Business/Executive)",
    examples: ["Mercedes-Benz E-Class", "BMW 5 Series", "Cadillac XTS"],
  },
  {
    key: "first_class",
    label: "First Class",
    examples: ["Mercedes-Benz S-Class", "BMW 7 Series", "Audi A8"],
  },
  {
    key: "standard_van",
    label: "Standard Van",
    examples: ["Mercedes-Benz Vito", "Ford Custom", "Chevrolet Suburban", "Toyota Alphard"],
  },
  {
    key: "suv_first_class_van",
    label: "SUV / First Class Van",
    examples: ["Mercedes-Benz V-Class", "Cadillac Escalade"],
  },
] as const;

const ACCEPTED_VEHICLES = [
  "Mercedes-Benz E-Class", "Mercedes-Benz S-Class", "Mercedes-Benz V-Class",
  "Mercedes-Vito", "Mercedes Viano", "Mercedes Sprinter",
  "Mercedes-Benz Metris", "Mercedes-Benz GLS (only in black)",
  "Ford Transit", "Ford Tourneo Custom", "VW-T5/T6 Multivan / Caravelle",
  "Range Rover", "Tesla Model S", "Tesla Model X",
  "BMW 5-Series", "BMW 7-Series", "Audi A6 / A7", "Audi A8",
  "Jaguar", "Jaguar XF", "Lincoln Navigator", "Lincoln Continental",
  "Cadillac OT6", "Cadillac XTS", "Cadillac Escalade", "Cadillac Escalade ESV",
  "GMC Yukon Denali", "Chevrolet Suburban", "Toyota Crown",
  "Toyota Alphard/Vellfire", "Mercedes C-Class (Economy Sedan)",
  "Skoda Octavia (Economy Sedan)", "Toyota Prius (Economy Sedan)",
  "Other vehicles subject to verification",
];

const EMPTY_FORM: FormState = {
  make: "", model: "", year: "", plate: "",
  color: "", type: "", vehicleClass: "", seats: "", driver: "",
};

const EMPTY_ERRS: ErrState = {
  make: "", model: "", year: "", plate: "",
  color: "", type: "", vehicleClass: "", seats: "", driver: "",
};

/* ─── VALIDATION ─────────────────────────────────────────────────────── */
function validate(f: FormState): ErrState {
  const e: ErrState = { ...EMPTY_ERRS };
  if (!f.make.trim())         e.make         = "Make is required.";
  if (!f.model.trim())        e.model        = "Model is required.";
  if (!f.year)                e.year         = "Year is required.";
  if (!f.plate.trim())        e.plate        = "Plate number is required.";
  if (!f.color.trim())        e.color        = "Color is required.";
  if (!f.type)                e.type         = "Vehicle type is required.";
  if (!f.vehicleClass)        e.vehicleClass = "Vehicle class is required.";
  if (!f.seats || isNaN(Number(f.seats)) || Number(f.seats) < 1 || Number(f.seats) > 20)
    e.seats = "Enter a valid seat count (1–20).";
  return e;
}

const hasErrors = (e: ErrState): boolean => Object.values(e).some(Boolean);

/* ─── FIELD WRAPPER ──────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  icon: React.ElementType;
  error: string;
  children: React.ReactNode;
}

function Field({ label, icon: Icon, error, children }: FieldProps) {
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

/* ─── SUCCESS BANNER ─────────────────────────────────────────────────── */
interface SuccessBannerProps {
  name: string;
  isEdit: boolean;
  onBack: () => void;
  onAddAnother: () => void;
}

function SuccessBanner({ name, isEdit, onBack, onAddAnother }: SuccessBannerProps) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "1rem", padding: "3rem 2rem",
      textAlign: "center", background: "var(--bg-card)",
      borderRadius: "1rem", border: "1px solid var(--border)",
      animation: "tsSettingsIn .3s ease",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "#d1fae5", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <CheckCircleRoundedIcon style={{ fontSize: 30, color: "#059669" }} />
      </div>
      <div>
        <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-h)" }}>
          {isEdit ? "Changes Saved!" : "Vehicle Added!"}
        </p>
        <p style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: ".3rem" }}>
          {name} has been {isEdit ? "updated" : "registered"} successfully.
        </p>
      </div>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <button className="ts-btn-ghost" onClick={onBack}>
          <ArrowBackRoundedIcon style={{ fontSize: 14 }} /> Back to Vehicles
        </button>
        {!isEdit && (
          <button className="ts-btn-primary" onClick={onAddAnother}>
            <AddRoundedIcon style={{ fontSize: 14 }} /> Add Another
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function AddVehiclePage({ prefill, setVehicles, onNavigate }: AddVehiclePageProps) {
  const isEdit = !!prefill;

  const [form, setForm] = useState<FormState>(
    prefill
      ? {
          make:         prefill.make,
          model:        prefill.model,
          year:         String(prefill.year),
          plate:        prefill.plate,
          color:        prefill.color,
          type:         prefill.type,
          vehicleClass: (prefill as any).vehicleClass ?? "",
          seats:        String(prefill.seats),
          driver:       prefill.driver,
        }
      : { ...EMPTY_FORM }
  );

  const [errs,      setErrs]    = useState<ErrState>({ ...EMPTY_ERRS });
  const [touched,   setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSub]     = useState<boolean>(false);
  const [success,   setOk]      = useState<boolean>(false);

  const set = (key: keyof FormState, val: string): void => {
    const next = { ...form, [key]: val };
    setForm(next);
    if (submitted || touched[key]) setErrs(validate(next));
  };

  const blur = (key: keyof FormState): void => {
    setTouched(t => ({ ...t, [key]: true }));
    setErrs(validate(form));
  };

  const handleSubmit = (): void => {
    setSub(true);
    const e = validate(form);
    setErrs(e);
    if (hasErrors(e)) return;

    if (isEdit && prefill) {
      setVehicles(prev => prev.map(v =>
        v.id === prefill.id
          ? {
              ...v,
              make:         form.make,
              model:        form.model,
              year:         Number(form.year),
              plate:        form.plate,
              color:        form.color,
              type:         form.type as Vehicle["type"],
              vehicleClass: form.vehicleClass,
              seats:        Number(form.seats),
              driver:       form.driver,
            } as any
          : v
      ));
    } else {
      const newVehicle = {
        id:           Date.now(),
        make:         form.make,
        model:        form.model,
        year:         Number(form.year),
        plate:        form.plate,
        color:        form.color,
        type:         form.type as Vehicle["type"],
        vehicleClass: form.vehicleClass,
        status:       "inactive" as const,
        seats:        Number(form.seats),
        driver:       form.driver,
        // kept for type compat
        fuel:    "petrol" as const,
        mileage: 0,
      };
      setVehicles(prev => [...prev, newVehicle]);
    }

    setOk(true);
  };

  const reset = (): void => {
    setForm({ ...EMPTY_FORM });
    setErrs({ ...EMPTY_ERRS });
    setTouched({});
    setSub(false);
    setOk(false);
  };

  const displayName =
    form.make && form.model
      ? `${form.year} ${form.make} ${form.model}`.trim()
      : "Vehicle";

  const selectCls = (err: string) =>
    `ts-input ts-settings-select${err ? " ts-input-error" : ""}`;

  // Find examples for currently selected class
  const selectedClassObj = VEHICLE_CLASSES.find(c => c.key === form.vehicleClass);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "100%" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("vehicles")} title="Back to Vehicles">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.15rem" }}>
            {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
          </h1>
          <p className="ts-page-subtitle">
            {isEdit
              ? `Editing ${prefill!.year} ${prefill!.make} ${prefill!.model}`
              : "Register a new vehicle to your fleet"}
          </p>
        </div>
      </div>

      {success ? (
        <SuccessBanner
          name={displayName}
          isEdit={isEdit}
          onBack={() => onNavigate("vehicles")}
          onAddAnother={reset}
        />
      ) : (
        <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

          {/* ── Make & Model ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Make" icon={DirectionsCarRoundedIcon} error={errs.make}>
              <input
                className={`ts-input${errs.make ? " ts-input-error" : ""}`}
                placeholder="e.g. Mercedes-Benz, Toyota, BMW…"
                value={form.make}
                onChange={e => set("make", e.target.value)}
                onBlur={() => blur("make")}
              />
            </Field>
            <Field label="Model" icon={DirectionsCarRoundedIcon} error={errs.model}>
              <input
                className={`ts-input${errs.model ? " ts-input-error" : ""}`}
                placeholder="e.g. E-Class, Corolla, 5 Series…"
                value={form.model}
                onChange={e => set("model", e.target.value)}
                onBlur={() => blur("model")}
              />
            </Field>
          </div>

          {/* ── Accepted vehicles hint ── */}
          <div style={{
            background: "var(--bg-main, #f8f9fb)",
            border: "1px solid var(--border)",
            borderRadius: ".6rem",
            padding: ".85rem 1rem",
          }}>
            <p style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Accepted vehicles
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: ".2rem .5rem",
            }}>
              {ACCEPTED_VEHICLES.map(v => (
                <span key={v} style={{ fontSize: ".75rem", color: "var(--text-body)", display: "flex", alignItems: "center", gap: ".3rem" }}>
                  <span style={{ color: "var(--text-faint)", fontSize: ".6rem" }}>•</span> {v}
                </span>
              ))}
            </div>
          </div>

          {/* ── Vehicle Class ── */}
          <Field label="Vehicle Class" icon={StarRoundedIcon} error={errs.vehicleClass}>
            <select
              className={selectCls(errs.vehicleClass)}
              value={form.vehicleClass}
              onChange={e => set("vehicleClass", e.target.value)}
              onBlur={() => blur("vehicleClass")}
              style={{ appearance: "none", cursor: "pointer" }}
            >
              <option value="">Select class…</option>
              {VEHICLE_CLASSES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            {/* Show examples for selected class */}
            {selectedClassObj && (
              <div style={{
                display: "flex", alignItems: "center", gap: ".4rem",
                flexWrap: "wrap", marginTop: ".2rem",
              }}>
                <span style={{ fontSize: ".72rem", color: "var(--text-faint)", fontWeight: 600 }}>e.g.</span>
                {selectedClassObj.examples.map(ex => (
                  <span key={ex} style={{
                    fontSize: ".72rem", color: "var(--text-muted)",
                    background: "var(--bg-main, #f3f4f6)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px", padding: ".1rem .4rem",
                  }}>{ex}</span>
                ))}
                <span style={{ fontSize: ".72rem", color: "var(--text-faint)" }}>or similar</span>
              </div>
            )}
          </Field>

          {/* ── Year & Plate ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Year" icon={CalendarTodayRoundedIcon} error={errs.year}>
              <select
                className={selectCls(errs.year)}
                value={form.year}
                onChange={e => set("year", e.target.value)}
                onBlur={() => blur("year")}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                <option value="">Select year…</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Plate Number" icon={ConfirmationNumberRoundedIcon} error={errs.plate}>
              <input
                className={`ts-input${errs.plate ? " ts-input-error" : ""}`}
                placeholder="e.g. ABC-1234"
                value={form.plate}
                onChange={e => set("plate", e.target.value.toUpperCase())}
                onBlur={() => blur("plate")}
                style={{ fontFamily: "monospace", letterSpacing: ".05em" }}
              />
            </Field>
          </div>

          {/* ── Color & Type ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Color" icon={ColorLensRoundedIcon} error={errs.color}>
              <input
                className={`ts-input${errs.color ? " ts-input-error" : ""}`}
                placeholder="e.g. White"
                value={form.color}
                onChange={e => set("color", e.target.value)}
                onBlur={() => blur("color")}
              />
            </Field>
            <Field label="Vehicle Type" icon={CategoryRoundedIcon} error={errs.type}>
              <select
                className={selectCls(errs.type)}
                value={form.type}
                onChange={e => set("type", e.target.value)}
                onBlur={() => blur("type")}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                <option value="">Select type…</option>
                {VEHICLE_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* ── Seats ── */}
          <Field label="Seat Count" icon={AirlineSeatReclineNormalRoundedIcon} error={errs.seats}>
            <input
              className={`ts-input${errs.seats ? " ts-input-error" : ""}`}
              placeholder="e.g. 5"
              type="number"
              min={1}
              max={20}
              value={form.seats}
              onChange={e => set("seats", e.target.value)}
              onBlur={() => blur("seats")}
            />
          </Field>

          {/* ── Assigned Driver (optional) ── */}
          <Field label="Assigned Driver (optional)" icon={PersonRoundedIcon} error={errs.driver}>
            <input
              className="ts-input"
              placeholder="e.g. John Doe"
              value={form.driver}
              onChange={e => set("driver", e.target.value)}
              onBlur={() => blur("driver")}
            />
          </Field>

          {/* ── Footer buttons ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
            <button className="ts-btn-ghost" onClick={() => onNavigate("vehicles")}>
              Cancel
            </button>
            <button className="ts-btn-primary" onClick={handleSubmit}>
              {isEdit
                ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</>
                : <><AddRoundedIcon  style={{ fontSize: 14 }} /> Add Vehicle</>
              }
            </button>
          </div>

        </div>
      )}
    </div>
  );
}