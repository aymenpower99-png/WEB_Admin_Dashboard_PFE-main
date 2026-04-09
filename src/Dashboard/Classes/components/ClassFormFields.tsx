import { useRef, useState } from "react";
import WifiRoundedIcon        from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon      from "@mui/icons-material/AcUnitRounded";
import WaterDropRoundedIcon   from "@mui/icons-material/WaterDropRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { Field, PlainDropdown } from "../../Vehicles/AddvehicleComponents/Field";

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
};

const SEAT_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => ({
  value: String(n), label: `${n} seat${n > 1 ? "s" : ""}`,
}));

const BAG_OPTIONS = [0,1,2,3,4,5,6,7,8,9,10].map(n => ({
  value: String(n), label: `${n} bag${n !== 1 ? "s" : ""}`,
}));

const WAIT_OPTIONS = [0,2,3,5,7,10,15,20,30,45,60].map(n => ({
  value: String(n), label: n === 0 ? "No free waiting" : `${n} min`,
}));

function ToggleSwitch({
  value, onChange, icon, label,
}: {
  value: boolean; onChange: (v: boolean) => void;
  icon?: React.ReactNode; label: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: ".55rem .75rem", borderRadius: ".4rem",
      border: "1px solid var(--border)", background: "var(--bg-card)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
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
  onChange: (field: keyof ClassFormData, value: string | number | boolean | File | null) => void;
  nameError?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(form.imageUrl || null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    onChange("imageFile", file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange("imageUrl", url); // used by preview panel
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
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

      {/* ── Class Image (file upload) ── */}
      <div>
        <SectionTitle>Class Image</SectionTitle>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? "#7c3aed" : "var(--border)"}`,
            borderRadius: ".4rem", padding: "1.25rem",
            background: dragging ? "#ede9fe22" : "var(--bg-inner)",
            cursor: "pointer", textAlign: "center", transition: "all .15s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem",
          }}
        >
          {preview ? (
            <>
              <img
                src={preview} alt="preview"
                style={{
                  maxHeight: 120, maxWidth: "100%", borderRadius: ".4rem",
                  objectFit: "cover", border: "1px solid var(--border)",
                }}
                onError={() => setPreview(null)}
              />
              <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
                Click or drag to replace
              </span>
            </>
          ) : (
            <>
              <CloudUploadRoundedIcon style={{ fontSize: 32, color: "var(--text-faint)" }} />
              <span style={{ fontSize: ".82rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Click or drag &amp; drop an image
              </span>
              <span style={{ fontSize: ".72rem", color: "var(--text-faint)" }}>
                PNG, JPG, WEBP — max 5 MB
              </span>
            </>
          )}
        </div>
        <input
          ref={fileRef} type="file" accept="image/*"
          style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
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
        </div>
      </div>
    </div>
  );
}