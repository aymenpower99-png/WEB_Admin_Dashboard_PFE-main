import { useState, useEffect } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon        from "@mui/icons-material/AddRounded";
import SaveRoundedIcon       from "@mui/icons-material/SaveRounded";
import apiClient             from "../../api/apiClient";
import { classesApi }        from "../../api/classes";
import { mapBackendVehicle } from "./types";
import type { Vehicle, AddVehiclePageProps } from "./types";

import {
  YEARS, COLORS,
  EMPTY_FORM, EMPTY_ERRS,
  validate, hasErrors,
} from "./AddvehicleComponents/types";
import type { FormState } from "./AddvehicleComponents/types";

import { Field, PlainDropdown, VehicleClassGrid } from "./AddvehicleComponents/Field";
import { MakeAutocomplete, ModelAutocomplete }    from "./AddvehicleComponents/VehicleAutocompletes";
import { DriverPicker }                           from "./AddvehicleComponents/DriverPicker";
import { VehiclePhotosSection }                   from "./AddvehicleComponents/VehiclePhotosSection";

export type { AddVehiclePageProps };

export default function AddVehiclePage({ prefill, setVehicles, onNavigate }: AddVehiclePageProps) {
  const isEdit = !!prefill;

  const [form, setForm] = useState<FormState>(
    prefill ? {
      make:         prefill.make,
      model:        prefill.model,
      year:         String(prefill.year),
      color:        COLORS.includes(prefill.color as any) ? (prefill.color ?? "") : "",
      // ✅ FIX: always resolve the class ID — first from the relation, then from classId
      vehicleClass: prefill.vehicleClass?.id ?? prefill.classId ?? "",
      driver:       prefill.driver ?? "",
    } : { ...EMPTY_FORM }
  );
  const [errs,       setErrs]       = useState({ ...EMPTY_ERRS });
  const [submitted,  setSub]        = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [makeId,     setMakeId]     = useState<number | null>(null);

  // Keep driverId + driverName in sync
  const [driverId,   setDriverId]   = useState<string | null>(prefill?.driverId ?? null);
  const [driverName, setDriverName] = useState<string>(prefill?.driver ?? "");

  // ── Load classes ────────────────────────────────────────────────────────────
  const [classOptions,   setClassOptions]   = useState<{ value: string; label: string }[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  // Full class objects so we can rebuild vehicleClass after save
  const [classMap, setClassMap] = useState<Map<string, { id: string; name: string; seats: number; bags: number; wifi: boolean; ac: boolean }>>(new Map());

  useEffect(() => {
    setClassesLoading(true);
    classesApi.getAll()
      .then(classes => {
        setClassOptions(classes.map(c => ({ value: c.id, label: c.name })));
        // Build a map: classId → class object
        const m = new Map<string, any>();
        for (const c of classes) {
          m.set(c.id, { id: c.id, name: c.name, seats: c.seats, bags: c.bags, wifi: c.wifi, ac: c.ac });
        }
        setClassMap(m);
      })
      .catch(() => {
        setClassOptions([
          { value: "Economy",     label: "Economy"     },
          { value: "Standard",    label: "Standard"    },
          { value: "Comfort",     label: "Comfort"     },
          { value: "First Class", label: "First Class" },
          { value: "Van",         label: "Van"         },
          { value: "Mini Bus",    label: "Mini Bus"    },
        ]);
      })
      .finally(() => setClassesLoading(false));
  }, []);

  const set = (key: keyof FormState, val: string) => {
    const next = { ...form, [key]: val };
    setForm(next);
    if (submitted) setErrs(validate(next));
  };

  const handleMakeSelect = (name: string, id: number | null) => {
    const next = { ...form, make: name, model: "" };
    setForm(next);
    setMakeId(id);
    if (submitted) setErrs(validate(next));
  };

  const handleSubmit = async () => {
    setSub(true);
    const e = validate(form);
    setErrs(e);
    if (hasErrors(e)) return;
    setSubmitting(true);
    setApiError(null);

    const payload: Record<string, unknown> = {
      make:     form.make,
      model:    form.model,
      year:     Number(form.year),
      color:    form.color          || undefined,
      // ✅ FIX: always include classId when a class is selected
      classId:  form.vehicleClass   || undefined,
      driverId: driverId            || undefined,
    };

    try {
      if (isEdit) {
        // ✅ FIX: Use the PATCH response directly — the backend update() method
        //    already re-fetches the vehicle with relations: ['vehicleClass'],
        //    so the response always contains the full updated vehicleClass object.
        //    No need for a second GET call.
        const res = await apiClient.patch<any>(`/vehicles/${prefill!.id}`, payload);

        // Build driverMap from the name we already know
        const driverMapLocal = new Map<string, string>();
        const resolvedDriverId: string | null = res.data?.driverId ?? null;
        const resolvedName = driverName || prefill?.driver || "";
        if (resolvedDriverId && resolvedName) {
          driverMapLocal.set(resolvedDriverId, resolvedName);
        }

        // ✅ FIX: If vehicleClass is still missing from the PATCH response,
        //    inject it from classMap using form.vehicleClass (the NEW class the
        //    user just selected) — NOT rawData.classId which could be stale.
        const rawData = { ...res.data };
        if (!rawData.vehicleClass && form.vehicleClass && classMap.has(form.vehicleClass)) {
          rawData.vehicleClass = classMap.get(form.vehicleClass);
        }
        // Also ensure classId is up-to-date in rawData
        if (form.vehicleClass) {
          rawData.classId = form.vehicleClass;
        }

        const updated = mapBackendVehicle(rawData, driverMapLocal);
        setVehicles((prev: Vehicle[]) =>
          prev.map(v => v.id === prefill!.id ? updated : v)
        );
      } else {
        const res = await apiClient.post<any>("/vehicles", payload);

        const rawData = { ...res.data };
        if (!rawData.vehicleClass && rawData.classId && classMap.has(rawData.classId)) {
          rawData.vehicleClass = classMap.get(rawData.classId);
        }

        const driverMapLocal = new Map<string, string>();
        if (driverId && driverName) driverMapLocal.set(driverId, driverName);

        setVehicles((prev: Vehicle[]) => [
          ...prev,
          mapBackendVehicle(rawData, driverMapLocal),
        ]);
      }
      onNavigate("vehicles");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to save vehicle.";
      setApiError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const yearOptions  = YEARS.map(y => ({ value: String(y), label: String(y) }));
  const colorOptions = COLORS.map(c => ({ value: c, label: c }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", width: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("vehicles")} title="Back">
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

      <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>

        {/* Row 1 — Make / Model */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
          <Field label="Make" error={errs.make}>
            <MakeAutocomplete value={form.make} error={errs.make} onSelect={handleMakeSelect} />
          </Field>
          <Field label="Model" error={errs.model}>
            <ModelAutocomplete
              value={form.model} makeId={makeId} makeName={form.make}
              error={errs.model} onChange={v => set("model", v)}
            />
          </Field>
        </div>

        {/* Row 2 — Vehicle Class */}
        <Field label="Vehicle Class" error={errs.vehicleClass}>
          {classesLoading ? (
            <div style={{
              padding: ".55rem .75rem", border: "1px solid var(--border)",
              borderRadius: ".4rem", fontSize: ".82rem", color: "var(--text-faint)",
            }}>
              Loading classes…
            </div>
          ) : (
            <PlainDropdown
              value={form.vehicleClass}
              onChange={v => set("vehicleClass", v)}
              options={classOptions}
              error={errs.vehicleClass}
              placeholder="SELECT CLASS"
            />
          )}
          <VehicleClassGrid />
        </Field>

        {/* Row 3 — Year */}
        <Field label="Year" error={errs.year}>
          <PlainDropdown value={form.year} onChange={v => set("year", v)} options={yearOptions} error={errs.year} />
        </Field>

        {/* Row 4 — Color */}
        <Field label="Color" error={errs.color}>
          <PlainDropdown value={form.color} onChange={v => set("color", v)} options={colorOptions} error={errs.color} />
        </Field>

        {/* Row 5 — Assigned Driver */}
        <Field label="Assigned Driver" error={errs.driver}>
          <DriverPicker
            value={form.driver}
            error={errs.driver}
            onSelect={({ id, fullName }) => {
              setDriverId(id);
              setDriverName(fullName);   // ✅ keep in sync for driverMap
              set("driver", fullName);
            }}
          />
        </Field>

        {/* Row 6 — Photos (edit only) */}
        {isEdit && (
          <VehiclePhotosSection
            vehicleId={prefill!.id}
            currentPhotos={prefill!.photos ?? []}
            onPhotosUpdated={newPhotos => {
              setVehicles(prev => prev.map(v =>
                v.id === prefill!.id ? { ...v, photos: newPhotos } : v
              ));
            }}
          />
        )}

        {/* API error */}
        {apiError && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: "8px", padding: "8px 14px",
            color: "#ef4444", fontSize: ".875rem",
          }}>
            {apiError}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
          <button className="ts-btn-ghost" onClick={() => onNavigate("vehicles")} disabled={submitting}>
            Cancel
          </button>
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