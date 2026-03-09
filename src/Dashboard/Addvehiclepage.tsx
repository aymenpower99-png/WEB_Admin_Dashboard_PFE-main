import { useState, useRef, useEffect } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import type { Vehicle } from "./Vehiclespage";

export interface AddVehiclePageProps {
  prefill: Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate: (page: string) => void;
}

interface FormState {
  make: string; model: string; year: string; plate: string;
  color: string; type: string; vehicleClass: string; seats: string; driver: string; status: string;
}

interface ErrState {
  make: string; model: string; year: string; plate: string;
  color: string; type: string; vehicleClass: string; seats: string; driver: string; status: string;
}

const VEHICLE_TYPES = ["sedan", "suv", "van", "truck"] as const;
const YEARS         = Array.from({ length: 11 }, (_, i) => 2016 + i).reverse();
const COLORS        = ["White", "Black", "Silver"] as const;
const SEAT_COUNTS   = [2, 3, 4, 5, 6, 7, 8] as const;
const STATUSES      = [
  { value: "active",       label: "Active" },
  { value: "inactive",     label: "Inactive" },
  { value: "Disponible",   label: "Disponible" },
  { value: "Maintenance",  label: "Maintenance" },
] as const;

const VEHICLE_CLASSES = [
  { key: "economy",         label: "Economy Sedan",                     examples: ["Skoda Octavia", "Toyota Prius", "Hyundai Ioniq"] },
  { key: "standard",        label: "Standard (Executive/Business)",     examples: ["Mercedes-Benz E-Class", "BMW 5 Series", "Cadillac XTS"] },
  { key: "first_class",     label: "First Class",                       examples: ["Mercedes-Benz S-Class", "BMW 7 Series", "Audi A8"] },
  { key: "standard_van",    label: "Standard Van (up to 8 passengers)", examples: ["Mercedes-Benz Vito", "Ford Custom", "Chevrolet Suburban"] },
  { key: "first_class_van", label: "First Class Van",                   examples: ["Mercedes-Benz V-Class", "Cadillac Escalade", "GMC Yukon"] },
  { key: "minibus_12",      label: "Minibus (12 passengers)",           examples: ["Mercedes-Benz Sprinter", "Ford Transit"] },
  { key: "minibus_16",      label: "Minibus (16 passengers)",           examples: ["Volkswagen Crafter", "Iveco Daily"] },
] as const;

const EMPTY_FORM: FormState = { make: "", model: "", year: "", plate: "", color: "", type: "", vehicleClass: "", seats: "", driver: "", status: "" };
const EMPTY_ERRS: ErrState  = { make: "", model: "", year: "", plate: "", color: "", type: "", vehicleClass: "", seats: "", driver: "", status: "" };

function validate(f: FormState): ErrState {
  const e: ErrState = { ...EMPTY_ERRS };
  if (!f.make.trim())       e.make         = "Make is required.";
  if (!f.model.trim())      e.model        = "Model is required.";
  if (!f.year)              e.year         = "Year is required.";
  if (!f.plate.trim())      e.plate        = "Plate number is required.";
  if (!f.color)             e.color        = "Color is required.";
  if (!f.type)              e.type         = "Vehicle type is required.";
  if (!f.vehicleClass)      e.vehicleClass = "Vehicle class is required.";
  if (!f.seats)             e.seats        = "Seat count is required.";
  if (!f.status)            e.status       = "Status is required.";
  return e;
}

const hasErrors = (e: ErrState): boolean => Object.values(e).some(Boolean);

// ─── Dropdown ────────────────────────────────────────────────────────────────
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

  const selected    = options.find(o => o.value === value);
  const borderColor = error ? "#ef4444" : "var(--border, #d1d5db)";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: ".55rem .75rem",
          border: `1px solid ${borderColor}`,
          borderBottom: open ? "none" : `1px solid ${borderColor}`,
          borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
          background: "#fff",
          fontSize: ".82rem",
          color: selected ? "#111827" : "#6b7280",
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
          border: `1px solid ${borderColor}`,
          borderTop: "none",
          borderRadius: "0 0 .4rem .4rem",
          background: "#fff",
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
                color: hovered === opt.value ? "#1d4ed8" : "#374151",
                background: hovered === opt.value ? "#eff6ff" : "transparent",
                cursor: "pointer",
                transition: "background .15s ease, color .15s ease, padding-left .15s ease",
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
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
      <label className="ts-label">{label}</label>
      {children}
      {error && (
        <p style={{ display: "flex", alignItems: "center", gap: ".25rem", fontSize: ".7rem", color: "#ef4444", marginTop: ".1rem" }}>
          <ErrorRoundedIcon style={{ fontSize: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

function VehicleClassGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", border: "1px solid var(--border)", borderRadius: ".6rem", overflow: "hidden", marginTop: ".4rem" }}>
      {VEHICLE_CLASSES.slice(0, 5).map((cls, i) => (
        <div key={cls.key} style={{ padding: ".6rem .75rem", borderRight: i < 4 ? "1px solid var(--border)" : "none", background: "var(--bg-main, #f8f9fb)" }}>
          <p style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: ".35rem" }}>
            {cls.label}
          </p>
          {cls.examples.map(ex => (
            <p key={ex} style={{ fontSize: ".7rem", color: "var(--text-body)", lineHeight: 1.65 }}>{ex}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AddVehiclePage({ prefill, setVehicles, onNavigate }: AddVehiclePageProps) {
  const isEdit = !!prefill;

  const [form, setForm] = useState<FormState>(
    prefill
      ? {
          make: prefill.make,
          model: prefill.model,
          year: String(prefill.year),
          plate: prefill.plate,
          color: prefill.color,
          type: prefill.type,
          vehicleClass: (prefill as any).vehicleClass ?? "",
          seats: String(prefill.seats),
          driver: prefill.driver,
          status: prefill.status ?? "",
        }
      : { ...EMPTY_FORM }
  );

  const [errs,      setErrs] = useState<ErrState>({ ...EMPTY_ERRS });
  const [submitted, setSub]  = useState<boolean>(false);

  const set = (key: keyof FormState, val: string): void => {
    const next = { ...form, [key]: val };
    setForm(next);
    if (submitted) setErrs(validate(next));
  };

  const handleSubmit = (): void => {
    setSub(true);
    const e = validate(form);
    setErrs(e);
    if (hasErrors(e)) return;

    if (isEdit && prefill) {
      setVehicles(prev => prev.map(v =>
        v.id === prefill.id
          ? { ...v, make: form.make, model: form.model, year: Number(form.year), plate: form.plate, color: form.color, type: form.type as Vehicle["type"], vehicleClass: form.vehicleClass, seats: Number(form.seats), driver: form.driver, status: form.status as Vehicle["status"] } as any
          : v
      ));
    } else {
      setVehicles(prev => [...prev, {
        id: Date.now(), make: form.make, model: form.model, year: Number(form.year),
        plate: form.plate, color: form.color, type: form.type as Vehicle["type"],
        vehicleClass: form.vehicleClass, status: form.status as "active" | "inactive",
        seats: Number(form.seats), driver: form.driver,
        fuel: "petrol" as const, mileage: 0,
      }]);
    }
    onNavigate("vehicles");
  };

  const displayName = form.make && form.model ? `${form.year} ${form.make} ${form.model}`.trim() : "Vehicle";

  const yearOptions:   DropdownOption[] = YEARS.map(y => ({ value: String(y), label: String(y) }));
  const typeOptions:   DropdownOption[] = VEHICLE_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }));
  const classOptions:  DropdownOption[] = VEHICLE_CLASSES.map(c => ({ value: c.key, label: c.label }));
  const colorOptions:  DropdownOption[] = COLORS.map(c => ({ value: c, label: c }));
  const seatOptions:   DropdownOption[] = SEAT_COUNTS.map(s => ({ value: String(s), label: `${s} seats` }));
  const statusOptions: DropdownOption[] = STATUSES.map(s => ({ value: s.value, label: s.label }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "100%", height: "100%", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexShrink: 0 }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("vehicles")} title="Back to Vehicles">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title" style={{ fontSize: "1.15rem" }}>{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</h1>
          <p className="ts-page-subtitle">{isEdit ? `Editing ${prefill!.year} ${prefill!.make} ${prefill!.model}` : "Register a new vehicle to your fleet"}</p>
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ overflowY: "auto", flex: 1, paddingRight: ".25rem" }}>
        <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

          {/* Make & Model */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Make" error={errs.make}>
              <input className={`ts-input${errs.make ? " ts-input-error" : ""}`} placeholder="e.g. Mercedes-Benz, Toyota, BMW…" value={form.make} onChange={e => set("make", e.target.value)} />
            </Field>
            <Field label="Model" error={errs.model}>
              <input className={`ts-input${errs.model ? " ts-input-error" : ""}`} placeholder="e.g. E-Class, Corolla, 5 Series…" value={form.model} onChange={e => set("model", e.target.value)} />
            </Field>
          </div>

          {/* Vehicle Class */}
          <Field label="Vehicle Class" error={errs.vehicleClass}>
            <PlainDropdown value={form.vehicleClass} onChange={v => set("vehicleClass", v)} options={classOptions} error={errs.vehicleClass} />
            <VehicleClassGrid />
          </Field>

          {/* Year & Plate */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Year" error={errs.year}>
              <PlainDropdown value={form.year} onChange={v => set("year", v)} options={yearOptions} error={errs.year} />
            </Field>
            <Field label="Plate Number" error={errs.plate}>
              <input className={`ts-input${errs.plate ? " ts-input-error" : ""}`} placeholder="e.g. ABC-1234" value={form.plate} onChange={e => set("plate", e.target.value.toUpperCase())} style={{ fontFamily: "monospace", letterSpacing: ".05em" }} />
            </Field>
          </div>

          {/* Color & Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Color" error={errs.color}>
              <PlainDropdown value={form.color} onChange={v => set("color", v)} options={colorOptions} error={errs.color} />
            </Field>
            <Field label="Vehicle Type" error={errs.type}>
              <PlainDropdown value={form.type} onChange={v => set("type", v)} options={typeOptions} error={errs.type} />
            </Field>
          </div>

          {/* Seats & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Seat Count" error={errs.seats}>
              <PlainDropdown value={form.seats} onChange={v => set("seats", v)} options={seatOptions} error={errs.seats} />
            </Field>
            <Field label="Status" error={errs.status}>
              <PlainDropdown value={form.status} onChange={v => set("status", v)} options={statusOptions} error={errs.status} placeholder="SELECT STATUS" />
            </Field>
          </div>

          {/* Driver */}
          <Field label="Assigned Driver (optional)" error={errs.driver}>
            <input className="ts-input" placeholder="e.g. John Doe" value={form.driver} onChange={e => set("driver", e.target.value)} />
          </Field>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
            <button className="ts-btn-ghost" onClick={() => onNavigate("vehicles")}>Cancel</button>
            <button className="ts-btn-primary" onClick={handleSubmit}>
              {isEdit ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</> : <><AddRoundedIcon style={{ fontSize: 14 }} /> Add Vehicle</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}