import { useState, useRef } from "react";
import CloseRoundedIcon             from "@mui/icons-material/CloseRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import apiClient from "../../../api/apiClient";

const MAX_DIM = 1200;
const QUALITY = 0.75;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width >= height) { height = Math.round((height / width) * MAX_DIM); width = MAX_DIM; }
        else                 { width  = Math.round((width / height) * MAX_DIM); height = MAX_DIM; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("no ctx")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = reject;
    img.src = url;
  });
}

interface Props {
  vehicleId:       string;
  currentPhotos:   string[];
  onPhotosUpdated: (newPhotos: string[]) => void;
}

export function VehiclePhotosSection({ vehicleId, currentPhotos, onPhotosUpdated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  // ✅ Single photo mode — take only the first photo if multiple exist
  const [photo,  setPhoto]  = useState<string | null>(currentPhotos[0] ?? null);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState<string | null>(null);

  const save = async (newPhotos: string[]) => {
    setSaving(true); setErr(null);
    try {
      await apiClient.patch(`/vehicles/${vehicleId}`, { photos: newPhotos });
      onPhotosUpdated(newPhotos);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Failed to save photo.";
      setErr(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally { setSaving(false); }
  };

  const removePhoto = () => {
    setPhoto(null);
    save([]);
  };

  const addFile = async (picked: FileList | null) => {
    const file = picked?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setSaving(true); setErr(null);
    try {
      // ✅ Compress + REPLACE (single photo)
      const compressed = await compressImage(file);
      setPhoto(compressed);
      await apiClient.patch(`/vehicles/${vehicleId}`, { photos: [compressed] });
      onPhotosUpdated([compressed]);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Upload failed.";
      setErr(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally { setSaving(false); }
  };

  const THUMB: React.CSSProperties = {
    position: "relative", width: 72, height: 72,
    borderRadius: ".4rem", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <span style={{ fontSize: ".8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>
          Vehicle Photo
        </span>
        {saving && (
          <span style={{ fontSize: ".75rem", color: "var(--text-faint)", fontStyle: "italic" }}>Saving…</span>
        )}
      </div>

      <div style={{ display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
        {/* Current photo */}
        {photo && (
          <div style={THUMB}>
            <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={removePhoto}
              disabled={saving}
              style={{
                position: "absolute", top: 2, right: 2, width: 18, height: 18,
                borderRadius: "50%", background: "rgba(220,38,38,.85)",
                border: "none", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CloseRoundedIcon style={{ fontSize: 11 }} />
            </button>
          </div>
        )}

        {/* ✅ Add/Replace tile — always shown, replaces current */}
        <div
          onClick={() => !saving && inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); addFile(e.dataTransfer.files); }}
          onDragOver={e => e.preventDefault()}
          style={{
            width: 72, height: 72, borderRadius: ".4rem", flexShrink: 0,
            border: "2px dashed var(--border)", background: "var(--bg-inner)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: ".2rem", cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
          }}
          title={photo ? "Replace photo" : "Add photo"}
        >
          <AddPhotoAlternateRoundedIcon style={{ fontSize: 20, color: "var(--text-faint)" }} />
          <span style={{ fontSize: ".65rem", color: "var(--text-faint)", fontWeight: 600 }}>
            {photo ? "Replace" : "Add"}
          </span>
          {/* ✅ no multiple — single photo only */}
          <input ref={inputRef} type="file" accept="image/*"
            style={{ display: "none" }} onChange={e => addFile(e.target.files)} />
        </div>
      </div>

      {!photo && !saving && (
        <p style={{ margin: 0, fontSize: ".78rem", color: "var(--text-faint)", fontStyle: "italic" }}>
          No photo yet — required to activate the vehicle.
        </p>
      )}

      {err && <p style={{ margin: 0, fontSize: ".78rem", color: "#ef4444" }}>{err}</p>}
    </div>
  );
}