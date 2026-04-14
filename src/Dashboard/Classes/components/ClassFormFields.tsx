import { useRef, useState } from "react";
import WifiRoundedIcon        from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon      from "@mui/icons-material/AcUnitRounded";
import WaterDropRoundedIcon   from "@mui/icons-material/WaterDropRounded";
import AddRoundedIcon         from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon        from "@mui/icons-material/EditRounded";
import { Field, PlainDropdown } from "../../Vehicles/AddvehicleComponents/Field";
import type { ExtraFeatureItem } from "../../../api/classes";

export type { ExtraFeatureItem };

export interface ClassFormData {
  name: string;
  imageUrl: string;
  imageFile: File | null;
  seats: number;
  bags: number;
  wifi: boolean;
  ac: boolean;
  water: boolean;
  freeWaitingTime: number;
  doorToDoor: boolean;
  meetAndGreet: boolean;
  extraFeatures: ExtraFeatureItem[];
  extraServices: ExtraFeatureItem[];
}

export const DEFAULT_FORM: ClassFormData = {
  name: "",
  imageUrl: "",
  imageFile: null,
  seats: 4,
  bags: 2,
  wifi: false,
  ac: true,
  water: false,
  freeWaitingTime: 5,
  doorToDoor: true,
  meetAndGreet: false,
  extraFeatures: [],
  extraServices: [],
};

const SEAT_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => ({
  value: String(n), label: String(n),
}));

const BAG_OPTIONS = [0,1,2,3,4,5,6,7,8,9,10].map(n => ({
  value: String(n), label: String(n),
}));

const WAIT_OPTIONS = [0,2,3,5,7,10,15,20,30,45,60].map(n => ({
  value: String(n), label: n === 0 ? "No free waiting" : `${n} min`,
}));

function ToggleSwitch({
  value, onChange, icon, label, onDelete, onEdit,
}: {
  value: boolean; onChange: (v: boolean) => void;
  icon?: React.ReactNode; label: string;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: ".55rem .75rem", borderRadius: ".4rem",
      border: "1px solid var(--border)", background: "var(--bg-card)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            title="Remove"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-faint)", display: "flex", padding: 2,
              borderRadius: ".25rem", transition: "color .15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-faint)")}
          >
            <DeleteOutlineRoundedIcon style={{ fontSize: 16 }} />
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit name"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-faint)", display: "flex", padding: 2,
              borderRadius: ".25rem", transition: "color .15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#7c3aed")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-faint)")}
          >
            <EditRoundedIcon style={{ fontSize: 14 }} />
          </button>
        )}
        {icon && (
          <span style={{ color: value ? "#7c3aed" : "var(--text-faint)", display: "flex" }}>
            {icon}
          </span>
        )}
        <span style={{ fontSize: ".82rem", color: "var(--text-h)", fontWeight: 500 }}>{label}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 40, height: 22, borderRadius: 9999, border: "none", cursor: "pointer",
          background: value
            ? "linear-gradient(135deg, var(--brand-from, #7c3aed), var(--brand-to, #a855f7))"
            : "var(--border)",
          position: "relative", transition: "background .2s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: value ? 20 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }} />
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      margin: "0 0 .6rem", fontSize: ".78rem", fontWeight: 700,
      color: "var(--text-h)", letterSpacing: ".01em",
    }}>
      {children}
    </p>
  );
}

export default function ClassFormFields({
  form,
  onChange,
  nameError,
}: {
  form: ClassFormData;
  onChange: (field: keyof ClassFormData, value: string | number | boolean | File | null | ExtraFeatureItem[]) => void;
  nameError?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    form.imageUrl && !form.imageUrl.startsWith("blob:") ? form.imageUrl : null
  );
  const [fileName, setFileName] = useState<string>("No file chosen");

  // ── Inline-add state ─────────────────────────────────────────────────────
  const [newFeatureName, setNewFeatureName] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState<string | null>(null);

  // ── Inline-edit state ────────────────────────────────────────────────────
  const [editingFeatureIdx, setEditingFeatureIdx] = useState<number | null>(null);
  const [editingFeatureValue, setEditingFeatureValue] = useState("");
  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null);
  const [editingServiceValue, setEditingServiceValue] = useState("");

  function handleFile(file: File) {
    onChange("imageFile", file);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange("imageUrl", url);
  }

  // ── Dynamic feature/service helpers ──────────────────────────────────────
  function commitFeature() {
    const name = (newFeatureName ?? "").trim();
    if (!name) { setNewFeatureName(null); return; }
    onChange("extraFeatures", [...form.extraFeatures, { name, enabled: true }]);
    setNewFeatureName(null);
  }

  function commitService() {
    const name = (newServiceName ?? "").trim();
    if (!name) { setNewServiceName(null); return; }
    onChange("extraServices", [...form.extraServices, { name, enabled: true }]);
    setNewServiceName(null);
  }

  function toggleExtraFeature(idx: number, enabled: boolean) {
    const updated = form.extraFeatures.map((f, i) => i === idx ? { ...f, enabled } : f);
    onChange("extraFeatures", updated);
  }

  function removeExtraFeature(idx: number) {
    onChange("extraFeatures", form.extraFeatures.filter((_, i) => i !== idx));
  }

  function toggleExtraService(idx: number, enabled: boolean) {
    const updated = form.extraServices.map((s, i) => i === idx ? { ...s, enabled } : s);
    onChange("extraServices", updated);
  }

  function removeExtraService(idx: number) {
    onChange("extraServices", form.extraServices.filter((_, i) => i !== idx));
  }

  function saveFeatureEdit(idx: number) {
    const name = editingFeatureValue.trim();
    if (!name) { setEditingFeatureIdx(null); return; }
    onChange("extraFeatures", form.extraFeatures.map((f, i) => i === idx ? { ...f, name } : f));
    setEditingFeatureIdx(null);
  }

  function saveServiceEdit(idx: number) {
    const name = editingServiceValue.trim();
    if (!name) { setEditingServiceIdx(null); return; }
    onChange("extraServices", form.extraServices.map((s, i) => i === idx ? { ...s, name } : s));
    setEditingServiceIdx(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

      {/* ── Class Name ── */}
      <Field label="Class Name *" error={nameError ?? ""}>
        <input
          value={form.name}
          placeholder="e.g. Business Class"
          onChange={e => onChange("name", e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: ".55rem .75rem", borderRadius: ".4rem",
            border: `1px solid ${nameError ? "#ef4444" : "var(--border)"}`,
            background: "var(--bg-card)", color: "var(--text-h)",
            fontSize: ".82rem", outline: "none", fontFamily: "var(--font)",
          }}
        />
      </Field>

      {/* ── Class Image — native file input style ── */}
      <div>
        <SectionTitle>Class Image</SectionTitle>

        {/* Hidden real input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {/* ✅ Styled to look exactly like native "Choose File | No file chosen" */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            display: "flex", alignItems: "stretch",
            border: "1px solid var(--border)", borderRadius: ".4rem",
            overflow: "hidden", cursor: "pointer",
            background: "var(--bg-card)",
            fontSize: ".82rem",
          }}
        >
          {/* "Choose File" button part */}
          <span style={{
            padding: ".45rem .85rem",
            background: "var(--bg-inner)",
            borderRight: "1px solid var(--border)",
            color: "var(--text-h)",
            fontWeight: 500,
            whiteSpace: "nowrap",
            userSelect: "none",
            display: "flex", alignItems: "center",
          }}>
            Choose File
          </span>
          {/* File name part */}
          <span style={{
            padding: ".45rem .75rem",
            color: fileName === "No file chosen" ? "var(--text-faint)" : "var(--text-body)",
            display: "flex", alignItems: "center",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {fileName}
          </span>
        </div>

        {/* Preview thumbnail */}
        {preview && (
          <div style={{ marginTop: ".5rem" }}>
            <img
              src={preview} alt="preview"
              style={{
                height: 80, borderRadius: ".4rem", objectFit: "cover",
                border: "1px solid var(--border)", display: "block",
              }}
              onError={() => setPreview(null)}
            />
          </div>
        )}
      </div>

      {/* ── Capacity ── */}
      <div>
        <SectionTitle>Capacity</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          <Field label="Seats" error="">
            <PlainDropdown
              value={String(form.seats)}
              onChange={v => onChange("seats", +v)}
              options={SEAT_OPTIONS}
            />
          </Field>
          <Field label="Bags" error="">
            <PlainDropdown
              value={String(form.bags)}
              onChange={v => onChange("bags", +v)}
              options={BAG_OPTIONS}
            />
          </Field>
        </div>
      </div>

      {/* ── Features ── */}
      <div>
        <SectionTitle>Features</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
          <ToggleSwitch
            value={form.wifi} onChange={v => onChange("wifi", v)}
            icon={<WifiRoundedIcon style={{ fontSize: 18 }} />} label="WiFi"
          />
          <ToggleSwitch
            value={form.ac} onChange={v => onChange("ac", v)}
            icon={<AcUnitRoundedIcon style={{ fontSize: 18 }} />} label="Air Conditioning (A/C)"
          />
          <ToggleSwitch
            value={form.water} onChange={v => onChange("water", v)}
            icon={<WaterDropRoundedIcon style={{ fontSize: 18 }} />} label="Water Included"
          />

          {/* Dynamic extra features */}
          {form.extraFeatures.map((feat, idx) =>
            editingFeatureIdx === idx ? (
              <div key={idx} style={{
                display: "flex", alignItems: "center", gap: ".45rem",
                padding: ".55rem .75rem", borderRadius: ".4rem",
                border: "1px dashed var(--brand-from, #7c3aed)", background: "var(--bg-card)",
              }}>
                <input
                  autoFocus
                  value={editingFeatureValue}
                  onChange={e => setEditingFeatureValue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveFeatureEdit(idx); if (e.key === "Escape") setEditingFeatureIdx(null); }}
                  placeholder="Feature name…"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: ".82rem", color: "var(--text-h)", fontFamily: "var(--font)",
                  }}
                />
                <button type="button" onClick={() => saveFeatureEdit(idx)}
                  style={{ fontSize: ".75rem", fontWeight: 700, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingFeatureIdx(null)}
                  style={{ fontSize: ".75rem", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                  ✕
                </button>
              </div>
            ) : (
              <ToggleSwitch
                key={idx}
                value={feat.enabled}
                onChange={v => toggleExtraFeature(idx, v)}
                label={feat.name}
                onDelete={() => removeExtraFeature(idx)}
                onEdit={() => { setEditingFeatureIdx(idx); setEditingFeatureValue(feat.name); }}
              />
            )
          )}

          {/* Inline add input */}
          {newFeatureName !== null ? (
            <div style={{
              display: "flex", alignItems: "center", gap: ".45rem",
              padding: ".55rem .75rem", borderRadius: ".4rem",
              border: "1px dashed var(--brand-from, #7c3aed)", background: "var(--bg-card)",
            }}>
              <input
                autoFocus
                value={newFeatureName}
                onChange={e => setNewFeatureName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") commitFeature(); if (e.key === "Escape") setNewFeatureName(null); }}
                placeholder="Feature name…"
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontSize: ".82rem", color: "var(--text-h)", fontFamily: "var(--font)",
                }}
              />
              <button type="button" onClick={commitFeature}
                style={{ fontSize: ".75rem", fontWeight: 700, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                Save
              </button>
              <button type="button" onClick={() => setNewFeatureName(null)}
                style={{ fontSize: ".75rem", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setNewFeatureName("")}
              style={{
                display: "flex", alignItems: "center", gap: ".35rem",
                padding: ".45rem .75rem", borderRadius: ".4rem",
                border: "1px dashed var(--border)", background: "none",
                color: "var(--text-faint)", fontSize: ".8rem", fontWeight: 600,
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.color = "#7c3aed"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-faint)"; }}
            >
              <AddRoundedIcon style={{ fontSize: 15 }} /> Add Feature
            </button>
          )}
        </div>
      </div>

      {/* ── Service Features ── */}
      <div>
        <SectionTitle>Service Features</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
          <Field label="Free Waiting Time" error="">
            <PlainDropdown
              value={String(form.freeWaitingTime)}
              onChange={v => onChange("freeWaitingTime", +v)}
              options={WAIT_OPTIONS}
            />
          </Field>
          <ToggleSwitch
            value={form.doorToDoor} onChange={v => onChange("doorToDoor", v)}
            label="Door-to-Door Service"
          />
          <ToggleSwitch
            value={form.meetAndGreet} onChange={v => onChange("meetAndGreet", v)}
            label="Meet & Greet"
          />

          {/* Dynamic extra services */}
          {form.extraServices.map((svc, idx) =>
            editingServiceIdx === idx ? (
              <div key={idx} style={{
                display: "flex", alignItems: "center", gap: ".45rem",
                padding: ".55rem .75rem", borderRadius: ".4rem",
                border: "1px dashed var(--brand-from, #7c3aed)", background: "var(--bg-card)",
              }}>
                <input
                  autoFocus
                  value={editingServiceValue}
                  onChange={e => setEditingServiceValue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveServiceEdit(idx); if (e.key === "Escape") setEditingServiceIdx(null); }}
                  placeholder="Service name…"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: ".82rem", color: "var(--text-h)", fontFamily: "var(--font)",
                  }}
                />
                <button type="button" onClick={() => saveServiceEdit(idx)}
                  style={{ fontSize: ".75rem", fontWeight: 700, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingServiceIdx(null)}
                  style={{ fontSize: ".75rem", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                  ✕
                </button>
              </div>
            ) : (
              <ToggleSwitch
                key={idx}
                value={svc.enabled}
                onChange={v => toggleExtraService(idx, v)}
                label={svc.name}
                onDelete={() => removeExtraService(idx)}
                onEdit={() => { setEditingServiceIdx(idx); setEditingServiceValue(svc.name); }}
              />
            )
          )}

          {/* Inline add input */}
          {newServiceName !== null ? (
            <div style={{
              display: "flex", alignItems: "center", gap: ".45rem",
              padding: ".55rem .75rem", borderRadius: ".4rem",
              border: "1px dashed var(--brand-from, #7c3aed)", background: "var(--bg-card)",
            }}>
              <input
                autoFocus
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") commitService(); if (e.key === "Escape") setNewServiceName(null); }}
                placeholder="Service name…"
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontSize: ".82rem", color: "var(--text-h)", fontFamily: "var(--font)",
                }}
              />
              <button type="button" onClick={commitService}
                style={{ fontSize: ".75rem", fontWeight: 700, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                Save
              </button>
              <button type="button" onClick={() => setNewServiceName(null)}
                style={{ fontSize: ".75rem", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setNewServiceName("")}
              style={{
                display: "flex", alignItems: "center", gap: ".35rem",
                padding: ".45rem .75rem", borderRadius: ".4rem",
                border: "1px dashed var(--border)", background: "none",
                color: "var(--text-faint)", fontSize: ".8rem", fontWeight: 600,
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.color = "#7c3aed"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-faint)"; }}
            >
              <AddRoundedIcon style={{ fontSize: 15 }} /> Add Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}