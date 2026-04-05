// ============================================================
// FILE: AddVehiclePage.tsx
// PATH: src/Dashboard/Drivers & Vehicles/vehicles/AddVehiclePage.tsx
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import ArrowBackRoundedIcon         from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon                from "@mui/icons-material/AddRounded";
import SaveRoundedIcon               from "@mui/icons-material/SaveRounded";
import ErrorRoundedIcon              from "@mui/icons-material/ErrorRounded";
import AddPhotoAlternateRoundedIcon  from "@mui/icons-material/AddPhotoAlternateRounded";
import InsertDriveFileRoundedIcon    from "@mui/icons-material/InsertDriveFileRounded";
import CloseRoundedIcon              from "@mui/icons-material/CloseRounded";
import apiClient from "../../api/apiClient";
import { mapBackendVehicle } from "./types";
import type { Vehicle, AddVehiclePageProps } from "./types";

export type { AddVehiclePageProps };

const YEARS       = Array.from({ length: 11 }, (_, i) => 2016 + i).reverse();
const COLORS      = ["White", "Black", "Silver"] as const;
const SEAT_COUNTS = [2, 3, 4, 5, 6, 7, 8] as const;
const VEHICLE_CLASSES = [
  { key: "Economy",     label: "Economy",     examples: ["Skoda Octavia",    "Toyota Prius",       "Hyundai Ioniq"]        },
  { key: "Standard",    label: "Standard",    examples: ["Mercedes E-Class", "BMW 5 Series",       "Cadillac XTS"]         },
  { key: "Comfort",     label: "Comfort",     examples: ["Mercedes C-Class", "Audi A6",            "Lexus ES"]             },
  { key: "First Class", label: "First Class", examples: ["Mercedes S-Class", "BMW 7 Series",       "Audi A8"]              },
  { key: "Van",         label: "Van",         examples: ["Mercedes Vito",    "Ford Custom",        "Chevrolet Suburban"]   },
  { key: "Mini Bus",    label: "Mini Bus",    examples: ["Mercedes Sprinter","Volkswagen Crafter", "Iveco Daily"]          },
] as const;

interface FormState { make: string; model: string; year: string; color: string; vehicleClass: string; seats: string; driver: string; }
interface ErrState  { make: string; model: string; year: string; color: string; vehicleClass: string; seats: string; driver: string; }
interface DropdownOption { value: string; label: string; }
interface MakeOption     { id: number;   name: string;  }
interface ModelOption    { id: number;   name: string;  }

const EMPTY_FORM: FormState = { make:"", model:"", year:"", color:"", vehicleClass:"", seats:"", driver:"" };
const EMPTY_ERRS: ErrState  = { make:"", model:"", year:"", color:"", vehicleClass:"", seats:"", driver:"" };

function validate(f: FormState): ErrState {
  const e = { ...EMPTY_ERRS };
  if (!f.make.trim())  e.make         = "Make is required.";
  if (!f.model.trim()) e.model        = "Model is required.";
  if (!f.year)         e.year         = "Year is required.";
  if (!f.color)        e.color        = "Color is required.";
  if (!f.vehicleClass) e.vehicleClass = "Vehicle class is required.";
  if (!f.seats)        e.seats        = "Seat count is required.";
  return e;
}
const hasErrors = (e: ErrState) => Object.values(e).some(Boolean);

/* ── PlainDropdown ── */
function PlainDropdown({ value, onChange, options, error, placeholder = "SELECT" }:
  { value: string; onChange: (v: string) => void; options: DropdownOption[]; error?: string; placeholder?: string; }
) {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: ".55rem .75rem",
        border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
        borderBottom: open ? "none" : `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
        borderRadius: open ? ".4rem .4rem 0 0" : ".4rem",
        background: "var(--bg-card)", fontSize: ".82rem",
        color: selected ? "var(--text-h)" : "var(--text-faint)",
        cursor: "pointer", userSelect: "none",
      }}>
        {selected ? selected.label : placeholder}
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, maxHeight: "13rem", overflowY: "auto",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none", borderRadius: "0 0 .4rem .4rem", background: "var(--bg-card)", zIndex: 999,
        }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              onMouseEnter={() => setHovered(opt.value)} onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem", paddingLeft: hovered === opt.value ? "1.1rem" : ".75rem",
                fontSize: ".82rem",
                color: hovered === opt.value ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.value ? "var(--rider-bg)" : "transparent",
                cursor: "pointer", transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}>{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── MakeAutocomplete ── */
function MakeAutocomplete({ value, error, onSelect }:
  { value: string; error?: string; onSelect: (name: string, id: number | null) => void; }
) {
  const [inputVal, setInputVal]    = useState(value);
  const [suggestions, setSuggests] = useState<MakeOption[]>([]);
  const [open, setOpen]            = useState(false);
  const [activeIdx, setActiveIdx]  = useState(-1);
  const [hovered, setHovered]      = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setInputVal(value); }, [value]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const fetchMakes = useCallback(async (q: string) => {
    try {
      const ep = q.trim().length > 0 ? `/vehicles/makes/search?q=${encodeURIComponent(q.trim())}` : `/vehicles/makes`;
      const res = await apiClient.get<MakeOption[]>(ep);
      setSuggests(res.data); setOpen(true); setActiveIdx(-1);
    } catch { /**/ }
  }, []);
  const pick = (opt: MakeOption) => { setInputVal(opt.name); onSelect(opt.name, opt.id); setOpen(false); };
  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if      (e.key === "ArrowDown")               { e.preventDefault(); setActiveIdx(i => Math.min(i+1, suggestions.length-1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i-1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input className={`ts-input${error ? " ts-input-error" : ""}`}
        placeholder="e.g. Mercedes-Benz, Toyota, BMW…" value={inputVal}
        onChange={e => { setInputVal(e.target.value); onSelect(e.target.value, null); if (debounceRef.current) clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => fetchMakes(e.target.value), 300); }}
        onFocus={() => { if (suggestions.length === 0) fetchMakes(inputVal); else setOpen(true); }}
        onKeyDown={handleKey} autoComplete="off" />
      {open && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, maxHeight: "14rem", overflowY: "auto",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none", borderRadius: "0 0 .4rem .4rem", background: "var(--bg-card)", zIndex: 999,
        }}>
          {suggestions.map((opt, i) => (
            <div key={opt.id} onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }} onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem", paddingLeft: hovered === opt.id || activeIdx === i ? "1.1rem" : ".75rem",
                fontSize: ".82rem",
                color: hovered === opt.id || activeIdx === i ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === opt.id || activeIdx === i ? "var(--rider-bg)" : "transparent",
                cursor: "pointer", transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}>{opt.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── ModelAutocomplete ── */
function ModelAutocomplete({ value, makeId, error, onChange }:
  { value: string; makeId: number | null; error?: string; onChange: (v: string) => void; }
) {
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
      .then(res => setModels(res.data)).catch(() => setModels([])).finally(() => setLoading(false));
  }, [makeId]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = models.filter(m => m.name.toLowerCase().includes(value.toLowerCase()));
  const pick = (opt: ModelOption) => { onChange(opt.name); setOpen(false); };
  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if      (e.key === "ArrowDown")               { e.preventDefault(); setActiveIdx(i => Math.min(i+1, filtered.length-1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i-1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(filtered[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input className={`ts-input${error ? " ts-input-error" : ""}`}
        placeholder={!makeId ? "Select a Make first" : loading ? "Loading…" : "e.g. E-Class, Corolla…"}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => { if (makeId) setOpen(true); }}
        onKeyDown={handleKey} disabled={!makeId} autoComplete="off" />
      {open && makeId && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, maxHeight: "14rem", overflowY: "auto",
          border: `1px solid ${error ? "var(--blocked-fg)" : "var(--border)"}`,
          borderTop: "none", borderRadius: "0 0 .4rem .4rem", background: "var(--bg-card)", zIndex: 999,
        }}>
          {loading
            ? <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>Loading…</div>
            : filtered.length === 0
              ? <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>No models found</div>
              : filtered.map((opt, i) => (
                <div key={opt.id} onMouseDown={e => { e.preventDefault(); pick(opt); }}
                  onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }} onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: ".55rem .75rem", paddingLeft: hovered === opt.id || activeIdx === i ? "1.1rem" : ".75rem",
                    fontSize: ".82rem",
                    color: hovered === opt.id || activeIdx === i ? "var(--rider-fg)" : "var(--text-body)",
                    background: hovered === opt.id || activeIdx === i ? "var(--rider-bg)" : "transparent",
                    cursor: "pointer", transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
                  }}>{opt.name}</div>
              ))
          }
        </div>
      )}
    </div>
  );
}

/* ── Field ── */
function Field({ label, error, hint, children }: { label: string; error: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
      <label className="ts-label">
        {label}
        {hint && <span style={{ marginLeft: ".4rem", fontWeight: 400, color: "var(--text-faint)", fontSize: ".72rem" }}>{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="ts-err" style={{ display: "flex", alignItems: "center", gap: ".25rem", marginTop: ".05rem" }}>
          <ErrorRoundedIcon style={{ fontSize: 12 }} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── VehicleClassGrid ── */
function VehicleClassGrid() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      border: "1px solid var(--border)", borderRadius: "var(--r-inner)",
      overflow: "hidden", marginTop: ".35rem",
    }}>
      {VEHICLE_CLASSES.map((cls, i) => (
        <div key={cls.key} style={{
          padding: ".45rem .65rem",
          borderRight: i % 3 < 2 ? "1px solid var(--border)" : "none",
          borderBottom: i < 3    ? "1px solid var(--border)" : "none",
          background: "var(--bg-inner)",
        }}>
          <p className="ts-section-label" style={{ marginBottom: ".2rem" }}>{cls.label}</p>
          {cls.examples.map(ex => <p key={ex} style={{ margin: 0, fontSize: ".68rem", lineHeight: 1.5, color: "var(--text-body)" }}>{ex}</p>)}
        </div>
      ))}
    </div>
  );
}

/* ── PhotoAttachment ── */
function PhotoAttachment({ photos, previews, onAdd, onRemove }:
  { photos: File[]; previews: string[]; onAdd: (f: FileList | null) => void; onRemove: (i: number) => void; }
) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".45rem", flexWrap: "wrap" }}>
      {/* Add button tile */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); onAdd(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        title="Add photos"
        style={{
          width: 52, height: 52, flexShrink: 0,
          border: "2px dashed var(--border)", borderRadius: ".45rem",
          background: "var(--bg-inner)", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".1rem",
          transition: "border-color var(--t-fast), background var(--t-fast)",
        }}
      >
        <AddPhotoAlternateRoundedIcon style={{ fontSize: 18, color: "var(--text-faint)" }} />
        <span style={{ fontSize: ".58rem", color: "var(--text-faint)", lineHeight: 1 }}>Add</span>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => onAdd(e.target.files)} />
      </div>

      {/* Thumbnail tiles */}
      {photos.map((file, i) => (
        <div key={i} style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          {previews[i]
            ? <img src={previews[i]} alt={file.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: ".45rem", border: "1px solid var(--border)", display: "block" }} />
            : <div style={{ width: 52, height: 52, borderRadius: ".45rem", border: "1px solid var(--border)", background: "var(--bg-inner)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <InsertDriveFileRoundedIcon style={{ fontSize: 20, color: "var(--text-faint)" }} />
              </div>
          }
          <button
            onClick={() => onRemove(i)}
            title="Remove"
            style={{
              position: "absolute", top: -5, right: -5,
              width: 16, height: 16, padding: 0,
              borderRadius: "50%", border: "1px solid var(--border)",
              background: "var(--bg-card)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-faint)",
            }}
          >
            <CloseRoundedIcon style={{ fontSize: 10 }} />
          </button>
        </div>
      ))}

      {photos.length === 0 && (
        <span style={{ fontSize: ".73rem", color: "var(--text-faint)" }}>JPG · PNG · WEBP · Multiple files</span>
      )}
    </div>
  );
}

/* ── Main ── */
export default function AddVehiclePage({ prefill, setVehicles, onNavigate }: AddVehiclePageProps) {
  const isEdit = !!prefill;
  const [form, setForm] = useState<FormState>(
    prefill ? {
      make: prefill.make, model: prefill.model, year: String(prefill.year),
      color: COLORS.includes(prefill.color as any) ? (prefill.color ?? "") : "",
      vehicleClass: prefill.vehicleClass ?? "", seats: String(prefill.seats ?? ""), driver: prefill.driver ?? "",
    } : { ...EMPTY_FORM }
  );
  const [errs,          setErrs]          = useState<ErrState>({ ...EMPTY_ERRS });
  const [submitted,     setSub]           = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [apiError,      setApiError]      = useState<string | null>(null);
  const [makeId,        setMakeId]        = useState<number | null>(null);
  const [photoFiles,    setPhotoFiles]    = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const set = (key: keyof FormState, val: string) => {
    const next = { ...form, [key]: val }; setForm(next);
    if (submitted) setErrs(validate(next));
  };
  const handleMakeSelect = (name: string, id: number | null) => {
    const next = { ...form, make: name, model: id !== makeId ? "" : form.model };
    setForm(next); setMakeId(id);
    if (submitted) setErrs(validate(next));
  };
  const handleAddPhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    setPhotoFiles(prev => [...prev, ...arr]);
    arr.forEach(f => { const r = new FileReader(); r.onload = e => setPhotoPreviews(prev => [...prev, e.target!.result as string]); r.readAsDataURL(f); });
  };
  const handleRemovePhoto = (i: number) => {
    setPhotoFiles(prev => prev.filter((_, idx) => idx !== i));
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setSub(true);
    const e = validate(form); setErrs(e);
    if (hasErrors(e)) return;
    setSubmitting(true); setApiError(null);

    let photoUrls: string[] | undefined;
    if (photoFiles.length > 0) {
      photoUrls = await Promise.all(
        photoFiles.map(f => new Promise<string>((res, rej) => {
          const r = new FileReader(); r.onload = ev => res(ev.target!.result as string); r.onerror = rej; r.readAsDataURL(f);
        }))
      );
    }

    const payload: Record<string, unknown> = {
      make: form.make, model: form.model, year: Number(form.year),
      color: form.color || undefined, vehicleType: form.vehicleClass || undefined,
      seats: form.seats ? Number(form.seats) : undefined,
      ...(photoUrls ? { photos: photoUrls } : {}),
    };

    try {
      if (isEdit) {
        const res = await apiClient.patch<any>(`/vehicles/${prefill!.id}`, payload);
        setVehicles(prev => prev.map(v => v.id === prefill!.id ? mapBackendVehicle(res.data) : v));
      } else {
        const res = await apiClient.post<any>("/vehicles", payload);
        setVehicles(prev => [...prev, mapBackendVehicle(res.data)]);
      }
      onNavigate("vehicles");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to save vehicle.";
      setApiError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally { setSubmitting(false); }
  };

  const yearOptions  = YEARS.map(y => ({ value: String(y), label: String(y) }));
  const classOptions = VEHICLE_CLASSES.map(c => ({ value: c.key, label: c.label }));
  const colorOptions = COLORS.map(c => ({ value: c, label: c }));
  const seatOptions  = SEAT_COUNTS.map(s => ({ value: String(s), label: `${s} seats` }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexShrink: 0 }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("vehicles")} title="Back">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title">{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</h1>
          <p className="ts-page-subtitle">{isEdit ? `Editing ${prefill!.year} ${prefill!.make} ${prefill!.model}` : "Register a new vehicle to your fleet"}</p>
        </div>
      </div>

      {/* Form — no scroll */}
      <div className="ts-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflow: "hidden" }}>

        {/* Row 1 — Make / Model */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
          <Field label="Make" error={errs.make}>
            <MakeAutocomplete value={form.make} error={errs.make} onSelect={handleMakeSelect} />
          </Field>
          <Field label="Model" error={errs.model}>
            <ModelAutocomplete value={form.model} makeId={makeId} error={errs.model} onChange={v => set("model", v)} />
          </Field>
        </div>

        {/* Row 2 — Vehicle Class (full width, with grid) */}
        <Field label="Vehicle Class" error={errs.vehicleClass}>
          <PlainDropdown value={form.vehicleClass} onChange={v => set("vehicleClass", v)} options={classOptions} error={errs.vehicleClass} />
          <VehicleClassGrid />
        </Field>

        {/* Row 3 — Year (full width) */}
        <Field label="Year" error={errs.year}>
          <PlainDropdown value={form.year} onChange={v => set("year", v)} options={yearOptions} error={errs.year} />
        </Field>

        {/* Row 4 — Color / Seats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
          <Field label="Color" error={errs.color}>
            <PlainDropdown value={form.color} onChange={v => set("color", v)} options={colorOptions} error={errs.color} />
          </Field>
          <Field label="Seat Count" error={errs.seats}>
            <PlainDropdown value={form.seats} onChange={v => set("seats", v)} options={seatOptions} error={errs.seats} />
          </Field>
        </div>

        {/* Row 5 — Driver + Photos side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem", alignItems: "start" }}>
          <Field label="Assigned Driver" error={errs.driver}>
            <input className="ts-input" placeholder="e.g. John Doe" value={form.driver} onChange={e => set("driver", e.target.value)} />
          </Field>
          <Field label="Vehicle Photos" error="">
            <PhotoAttachment photos={photoFiles} previews={photoPreviews} onAdd={handleAddPhotos} onRemove={handleRemovePhoto} />
          </Field>
        </div>

        {/* API error */}
        {apiError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "8px", padding: "8px 14px", color: "#ef4444", fontSize: ".875rem" }}>
            {apiError}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", marginTop: "auto", paddingTop: ".25rem" }}>
          <button className="ts-btn-ghost" onClick={() => onNavigate("vehicles")} disabled={submitting}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isEdit
              ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</>
              : <><AddRoundedIcon  style={{ fontSize: 14 }} /> Add Vehicle</>}
          </button>
        </div>

      </div>
    </div>
  );
}