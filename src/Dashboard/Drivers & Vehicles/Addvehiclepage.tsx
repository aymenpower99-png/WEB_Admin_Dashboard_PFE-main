import { useState, useRef, useEffect, useCallback } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import apiClient from "../../api/apiClient";
import type { Vehicle } from "./Vehiclespage";

export interface AddVehiclePageProps {
  prefill: Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onNavigate: (page: string) => void;
}

interface FormState {
  make: string; model: string; year: string; plate: string;
  color: string; vehicleClass: string; seats: string; driver: string; status: string;
}

interface ErrState {
  make: string; model: string; year: string; plate: string;
  color: string; vehicleClass: string; seats: string; driver: string; status: string;
}

const YEARS       = Array.from({ length: 11 }, (_, i) => 2016 + i).reverse();
const COLORS      = ["White", "Black", "Silver"] as const;
const SEAT_COUNTS = [2, 3, 4, 5, 6, 7, 8] as const;
const STATUSES    = [
  { value: "Pending",     label: "Pending"     },
  { value: "Approved",    label: "Approved"    },
  { value: "Disponible",  label: "Disponible"  },
  { value: "Maintenance", label: "Maintenance" },
] as const;

// Keys match backend VehicleType enum exactly
const VEHICLE_CLASSES = [
  { key: "Economy",     label: "Economy",     examples: ["Skoda Octavia", "Toyota Prius", "Hyundai Ioniq"] },
  { key: "Standard",    label: "Standard",    examples: ["Mercedes-Benz E-Class", "BMW 5 Series", "Cadillac XTS"] },
  { key: "Comfort",     label: "Comfort",     examples: ["Mercedes-Benz C-Class", "Audi A6", "Lexus ES"] },
  { key: "First Class", label: "First Class", examples: ["Mercedes-Benz S-Class", "BMW 7 Series", "Audi A8"] },
  { key: "Van",         label: "Van",         examples: ["Mercedes-Benz Vito", "Ford Custom", "Chevrolet Suburban"] },
  { key: "Mini Bus",    label: "Mini Bus",    examples: ["Mercedes-Benz Sprinter", "Volkswagen Crafter", "Iveco Daily"] },
] as const;

const EMPTY_FORM: FormState = {
  make: "", model: "", year: "", plate: "", color: "",
  vehicleClass: "", seats: "", driver: "", status: "",
};
const EMPTY_ERRS: ErrState = {
  make: "", model: "", year: "", plate: "", color: "",
  vehicleClass: "", seats: "", driver: "", status: "",
};

function validate(f: FormState): ErrState {
  const e: ErrState = { ...EMPTY_ERRS };
  if (!f.make.trim())  e.make         = "Make is required.";
  if (!f.model.trim()) e.model        = "Model is required.";
  if (!f.year)         e.year         = "Year is required.";
  if (!f.plate.trim()) e.plate        = "Plate number is required.";
  if (!f.color)        e.color        = "Color is required.";
  if (!f.vehicleClass) e.vehicleClass = "Vehicle class is required.";
  if (!f.seats)        e.seats        = "Seat count is required.";
  if (!f.status)       e.status       = "Status is required.";
  return e;
}

const hasErrors = (e: ErrState): boolean => Object.values(e).some(Boolean);

/* ─── Types ───────────────────────────────────────────────────────────── */
interface DropdownOption { value: string; label: string; }
interface MakeOption     { id: number; name: string; }
interface ModelOption    { id: number; name: string; }

/* ─── PlainDropdown ──────────────────────────────────────────────────── */
interface PlainDropdownProps {
  value: string; onChange: (val: string) => void;
  options: DropdownOption[]; error?: string; placeholder?: string;
}
function PlainDropdown({ value, onChange, options, error, placeholder = "SELECT" }: PlainDropdownProps) {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
          background: "var(--bg-card)", fontSize: ".82rem",
          color: selected ? "var(--text-h)" : "var(--text-faint)",
          cursor: "pointer", userSelect: "none",
        }}
      >
        {selected ? selected.label : placeholder}
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          maxHeight: "14rem", overflowY: "auto",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none", borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)", zIndex: 999,
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

/* ─── MakeAutocomplete ───────────────────────────────────────────────── */
interface MakeAutocompleteProps {
  value: string; error?: string;
  onSelect: (name: string, id: number | null) => void;
}
function MakeAutocomplete({ value, error, onSelect }: MakeAutocompleteProps) {
  const [inputVal, setInputVal]    = useState(value);
  const [suggestions, setSuggests] = useState<MakeOption[]>([]);
  const [open, setOpen]            = useState(false);
  const [activeIdx, setActiveIdx]  = useState(-1);
  const [hovered, setHovered]      = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref         = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputVal(value); }, [value]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fetchMakes = useCallback(async (q: string) => {
    try {
      const endpoint = q.trim().length > 0
        ? `/vehicles/makes/search?q=${encodeURIComponent(q.trim())}`
        : `/vehicles/makes`;
      const res = await apiClient.get<MakeOption[]>(endpoint);
      setSuggests(res.data);
      setOpen(true);
      setActiveIdx(-1);
    } catch { /* silent */ }
  }, []);

  const handleChange = (val: string) => {
    setInputVal(val);
    onSelect(val, null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchMakes(val), 300);
  };

  const pick = (opt: MakeOption) => {
    setInputVal(opt.name);
    onSelect(opt.name, opt.id);
    setOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown")                    { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        className={`ts-input${error ? " ts-input-error" : ""}`}
        placeholder="e.g. Mercedes-Benz, Toyota, BMW…"
        value={inputVal}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (suggestions.length === 0) fetchMakes(inputVal); else setOpen(true); }}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          maxHeight: "14rem", overflowY: "auto",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none", borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)", zIndex: 999,
        }}>
          {suggestions.map((opt, i) => (
            <div
              key={opt.id}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem",
                paddingLeft: hovered === opt.id || activeIdx === i ? "1.1rem" : ".75rem",
                fontSize: ".82rem",
                color: hovered === opt.id || activeIdx === i ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.id || activeIdx === i ? "var(--rider-bg)" : "transparent",
                cursor: "pointer",
                transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ModelAutocomplete ──────────────────────────────────────────────── */
interface ModelAutocompleteProps {
  value: string; makeId: number | null; error?: string;
  onChange: (val: string) => void;
}
function ModelAutocomplete({ value, makeId, error, onChange }: ModelAutocompleteProps) {
  const [models, setModels]       = useState<ModelOption[]>([]);
  const [loading, setLoading]     = useState(false);
  const [open, setOpen]           = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hovered, setHovered]     = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!makeId) { setModels([]); return; }
    setLoading(true);
    apiClient.get<ModelOption[]>(`/vehicles/makes/${makeId}/models`)
      .then(res => setModels(res.data))
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, [makeId]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = models.filter(m => m.name.toLowerCase().includes(value.toLowerCase()));
  const pick = (opt: ModelOption) => { onChange(opt.name); setOpen(false); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown")                    { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(filtered[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        className={`ts-input${error ? " ts-input-error" : ""}`}
        placeholder={!makeId ? "Select a Make first" : loading ? "Loading models…" : "e.g. E-Class, Corolla…"}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => { if (makeId) setOpen(true); }}
        onKeyDown={handleKey}
        disabled={!makeId}
        autoComplete="off"
      />
      {open && makeId && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          maxHeight: "14rem", overflowY: "auto",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none", borderRadius: "0 0 .4rem .4rem",
          background: "var(--bg-card)", zIndex: 999,
        }}>
          {loading ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
              Loading models…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
              No models found
            </div>
          ) : filtered.map((opt, i) => (
            <div
              key={opt.id}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem",
                paddingLeft: hovered === opt.id || activeIdx === i ? "1.1rem" : ".75rem",
                fontSize: ".82rem",
                color: hovered === opt.id || activeIdx === i ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.id || activeIdx === i ? "var(--rider-bg)" : "transparent",
                cursor: "pointer",
                transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Field ─────────────────────────────────���────────────────────────── */
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

/* ─── Vehicle Class Reference Grid ───────────────────────────────────── */
function VehicleClassGrid() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      border: "1px solid var(--border)", borderRadius: "var(--r-inner)",
      overflow: "hidden", marginTop: ".4rem",
    }}>
      {VEHICLE_CLASSES.map((cls, i) => (
        <div key={cls.key} style={{
          padding: ".6rem .75rem",
          borderRight: i % 3 < 2 ? "1px solid var(--border)" : "none",
          borderBottom: i < 3 ? "1px solid var(--border)" : "none",
          background: "var(--bg-inner)",
        }}>
          <p className="ts-section-label" style={{ marginBottom: ".35rem" }}>{cls.label}</p>
          {cls.examples.map(ex => (
            <p key={ex} className="ts-body" style={{ fontSize: ".7rem", lineHeight: 1.65 }}>{ex}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
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
          vehicleClass: (prefill as any).vehicleClass ?? "",
          seats:        String(prefill.seats),
          driver:       prefill.driver,
          status:       prefill.status ?? "",
        }
      : { ...EMPTY_FORM }
  );

  const [errs,       setErrs]       = useState<ErrState>({ ...EMPTY_ERRS });
  const [submitted,  setSub]        = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [makeId,     setMakeId]     = useState<number | null>(null);

  const set = (key: keyof FormState, val: string): void => {
    const next = { ...form, [key]: val };
    setForm(next);
    if (submitted) setErrs(validate(next));
  };

  const handleMakeSelect = (name: string, id: number | null) => {
    const next = { ...form, make: name, model: id !== makeId ? "" : form.model };
    setForm(next);
    setMakeId(id);
    if (submitted) setErrs(validate(next));
  };

  const handleSubmit = async (): Promise<void> => {
    setSub(true);
    const e = validate(form);
    setErrs(e);
    if (hasErrors(e)) return;

    setSubmitting(true);
    setApiError(null);

    const payload = {
      make:         form.make,
      model:        form.model,
      year:         Number(form.year),
      color:        form.color,
      licensePlate: form.plate,
      vehicleType:  form.vehicleClass,
      seats:        Number(form.seats),
    };

    try {
      if (isEdit && (prefill as any).backendId) {
        await apiClient.patch(`/vehicles/${(prefill as any).backendId}`, payload);
        setVehicles(prev => prev.map(v =>
          v.id === prefill!.id
            ? {
                ...v,
                make:         form.make,
                model:        form.model,
                year:         Number(form.year),
                plate:        form.plate,
                color:        form.color,
                vehicleClass: form.vehicleClass,
                seats:        Number(form.seats),
                driver:       form.driver,
                status:       form.status as Vehicle["status"],
              } as any
            : v
        ));
      } else {
        const res     = await apiClient.post<any>("/vehicles", payload);
        const created = res.data;
        setVehicles(prev => [...prev, {
          id:           created.id ?? Date.now(),
          make:         created.make,
          model:        created.model,
          year:         created.year,
          plate:        created.licensePlate ?? form.plate,
          color:        created.color,
          type:         "sedan" as const,
          vehicleClass: created.vehicleType,
          status:       "active" as const,
          seats:        created.seats ?? Number(form.seats),
          driver:       form.driver,
          fuel:         "petrol" as const,
          mileage:      0,
        }]);
      }
      onNavigate("vehicles");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to save vehicle.";
      setApiError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const yearOptions:   DropdownOption[] = YEARS.map(y => ({ value: String(y), label: String(y) }));
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
          <h1 className="ts-page-title">{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</h1>
          <p className="ts-page-subtitle">
            {isEdit
              ? `Editing ${prefill!.year} ${prefill!.make} ${prefill!.model}`
              : "Register a new vehicle to your fleet"}
          </p>
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ overflowY: "auto", flex: 1, paddingRight: ".25rem" }}>
        <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

          {/* Make & Model */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Make" error={errs.make}>
              <MakeAutocomplete value={form.make} error={errs.make} onSelect={handleMakeSelect} />
            </Field>
            <Field label="Model" error={errs.model}>
              <ModelAutocomplete value={form.model} makeId={makeId} error={errs.model} onChange={v => set("model", v)} />
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
              <input
                className={`ts-input${errs.plate ? " ts-input-error" : ""}`}
                placeholder="e.g. ABC-1234"
                value={form.plate}
                onChange={e => set("plate", e.target.value.toUpperCase())}
                style={{ fontFamily: "monospace", letterSpacing: ".05em" }}
              />
            </Field>
          </div>

          {/* Color & Seats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Color" error={errs.color}>
              <PlainDropdown value={form.color} onChange={v => set("color", v)} options={colorOptions} error={errs.color} />
            </Field>
            <Field label="Seat Count" error={errs.seats}>
              <PlainDropdown value={form.seats} onChange={v => set("seats", v)} options={seatOptions} error={errs.seats} />
            </Field>
          </div>

          {/* Status & Driver */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Status" error={errs.status}>
              <PlainDropdown value={form.status} onChange={v => set("status", v)} options={statusOptions} error={errs.status} placeholder="SELECT STATUS" />
            </Field>
            <Field label="Assigned Driver (optional)" error={errs.driver}>
              <input
                className="ts-input"
                placeholder="e.g. John Doe"
                value={form.driver}
                onChange={e => set("driver", e.target.value)}
              />
            </Field>
          </div>

          {/* API error banner */}
          {apiError && (
            <div style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: "8px", padding: "10px 14px",
              color: "#ef4444", fontSize: ".875rem",
            }}>
              {apiError}
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
            <button className="ts-btn-ghost" onClick={() => onNavigate("vehicles")} disabled={submitting}>
              Cancel
            </button>
            <button className="ts-btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? "Saving…"
                : isEdit
                  ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</>
                  : <><AddRoundedIcon  style={{ fontSize: 14 }} /> Add Vehicle</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}