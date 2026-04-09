import { useState, useEffect } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon       from "@mui/icons-material/AddRounded";
import SaveRoundedIcon      from "@mui/icons-material/SaveRounded";
import "../travelsync-design-system.css";
import { classesApi } from "../../api/classes";
import type { VehicleClass } from "../../api/classes";
import ClassFormFields, { DEFAULT_FORM } from "./components/ClassFormFields";
import type { ClassFormData } from "./components/ClassFormFields";
import ClassPreview from "./components/ClassPreview";

interface AddClassPageProps {
  prefill?: VehicleClass | null;
  onNavigate: (page: string) => void;
}

export default function AddClassPage({ prefill, onNavigate }: AddClassPageProps) {
  const isEdit = !!prefill;

  const [form,      setForm]      = useState<ClassFormData>(DEFAULT_FORM);
  const [nameError, setNameError] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [apiError,  setApiError]  = useState<string | null>(null);

  useEffect(() => {
    if (prefill) {
      setForm({
        name:            prefill.name,
        imageUrl:        prefill.imageUrl ?? "",
        imageFile:       null,
        seats:           prefill.seats,
        bags:            prefill.bags,
        wifi:            prefill.wifi,
        ac:              prefill.ac,
        water:           prefill.water,
        freeWaitingTime: prefill.freeWaitingTime,
        doorToDoor:      prefill.doorToDoor,
        meetAndGreet:    prefill.meetAndGreet,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setNameError("");
    setApiError(null);
  }, [prefill]);

  function handleChange(
    field: keyof ClassFormData,
    value: string | number | boolean | File | null,
  ) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "name") setNameError("");
    setApiError(null);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setNameError("Class name is required.");
      return;
    }

    setSaving(true);
    setApiError(null);

    try {
      // 1. Upload image if a new file was selected
      let finalImageUrl = form.imageUrl;
      if (form.imageFile) {
        try {
          const res = await classesApi.uploadImage(form.imageFile);
          finalImageUrl = res.url;
        } catch {
          // If no upload endpoint yet, use object URL as fallback
          // (replace with real upload endpoint when ready)
        }
      }

      const payload = {
        name:            form.name.trim(),
        imageUrl:        finalImageUrl || undefined,
        seats:           form.seats,
        bags:            form.bags,
        wifi:            form.wifi,
        ac:              form.ac,
        water:           form.water,
        freeWaitingTime: form.freeWaitingTime,
        doorToDoor:      form.doorToDoor,
        meetAndGreet:    form.meetAndGreet,
      };

      if (isEdit && prefill) {
        await classesApi.update(prefill.id, payload);
      } else {
        await classesApi.create(payload);
      }

      onNavigate("classes");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to save class.";
      setApiError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", width: "100%" }}>

      {/* ── Header (back + title only, no top buttons) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("classes")} title="Back">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title">{isEdit ? "Edit Class" : "Add New Class"}</h1>
          <p className="ts-page-subtitle">
            {isEdit ? `Editing "${prefill?.name}"` : "Create a new vehicle class for your fleet"}
          </p>
        </div>
      </div>

      {/* ── Main card ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1rem", alignItems: "start" }}>

        {/* Form card */}
        <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>

          <ClassFormFields form={form} onChange={handleChange} nameError={nameError} />

          {/* API Error */}
          {apiError && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: ".4rem", padding: "8px 14px",
              color: "#ef4444", fontSize: ".875rem",
            }}>
              {apiError}
            </div>
          )}

          {/* ── Actions at bottom ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
            <button
              className="ts-btn-ghost"
              onClick={() => onNavigate("classes")}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="ts-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : isEdit
                ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</>
                : <><AddRoundedIcon  style={{ fontSize: 14 }} /> Create Class</>
              }
            </button>
          </div>
        </div>

        {/* Live Preview — sticky */}
        <div style={{ position: "sticky", top: "1rem" }}>
          <p style={{
            margin: "0 0 .45rem", fontSize: ".78rem", fontWeight: 700,
            color: "var(--text-h)", letterSpacing: ".01em",
          }}>
            LIVE PREVIEW
          </p>
          <ClassPreview form={form} />
          <p style={{
            margin: ".4rem 0 0", fontSize: ".72rem",
            color: "var(--text-faint)", textAlign: "center",
          }}>
            This is how the class appears in the app
          </p>
        </div>
      </div>
    </div>
  );
}