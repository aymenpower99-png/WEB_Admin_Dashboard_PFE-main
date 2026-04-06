import { useState, useRef } from "react";
import CloseRoundedIcon             from "@mui/icons-material/CloseRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import apiClient from "../../api/apiClient";
import { mapBackendVehicle } from "./types";
import type { Vehicle } from "./types";

const MAX_MB  = 5;
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
      if (!ctx) { reject(new Error("Canvas context unavailable")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function UpdatePhotoModal({ vehicle, onClose, onUploaded }: {
  vehicle: Vehicle;
  onClose: () => void;
  onUploaded: (updated: Vehicle) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files,     setFiles]     = useState<File[]>([]);
  const [previews,  setPreviews]  = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [err,       setErr]       = useState<string | null>(null);

  const addFiles = (picked: FileList | null) => {
    if (!picked) return;
    const arr = Array.from(picked).filter(f => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    const oversize = arr.filter(f => f.size > MAX_MB * 1024 * 1024);
    setErr(oversize.length > 0
      ? `${oversize.length} file(s) exceed ${MAX_MB} MB — will be compressed automatically.`
      : null
    );
    setFiles(prev => [...prev, ...arr]);
    arr.forEach(f => {
      const r = new FileReader();
      r.onload = e => setPreviews(prev => [...prev, e.target!.result as string]);
      r.readAsDataURL(f);
    });
  };

  const removeFile = (i: number) => {
    setFiles(prev    => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (files.length === 0) { setErr("Please select at least one photo."); return; }
    setUploading(true); setErr(null);
    try {
      const photoUrls = await Promise.all(files.map(f => compressImage(f)));
      // ✅ REPLACE — send only new photos (not accumulate with old ones)
      const res = await apiClient.patch<any>(`/vehicles/${vehicle.id}`, { photos: photoUrls });

      // ✅ Preserve existing driver name — mapBackendVehicle loses it without a driverMap
      // Build a single-entry map from the current vehicle so the name is kept
      const driverMap = vehicle.driverId && vehicle.driver
        ? new Map([[vehicle.driverId, vehicle.driver]])
        : undefined;

      onUploaded(mapBackendVehicle(res.data, driverMap));
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Upload failed.";
      setErr(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ts-overlay">
      <div className="ts-modal" style={{ maxWidth: 480 }}>
        <div className="ts-modal-header">
          <p style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--text-h)" }}>
            Add Photos — {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <button className="ts-modal-close" onClick={onClose} disabled={uploading}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            onDragOver={e => e.preventDefault()}
            style={{
              border: "2px dashed var(--border)", borderRadius: ".6rem",
              padding: "1.75rem 1rem", textAlign: "center", cursor: "pointer",
              background: "var(--bg-inner)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: ".35rem",
            }}
          >
            <AddPhotoAlternateRoundedIcon style={{ fontSize: 32, color: "var(--text-faint)" }} />
            <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Click or drag &amp; drop photos
            </p>
            <p style={{ margin: 0, fontSize: ".72rem", color: "var(--text-faint)" }}>
              JPG · PNG · WEBP · Multiple — auto-compressed
            </p>
            <input ref={inputRef} type="file" accept="image/*" multiple
              style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
              {previews.map((src, i) => (
                <div key={i} style={{
                  position: "relative", width: 76, height: 76,
                  borderRadius: ".4rem", overflow: "hidden", border: "1px solid var(--border)",
                }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => removeFile(i)} style={{
                    position: "absolute", top: 2, right: 2, width: 18, height: 18,
                    borderRadius: "50%", background: "rgba(0,0,0,.55)",
                    border: "none", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CloseRoundedIcon style={{ fontSize: 11 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {err && <p style={{ margin: 0, fontSize: ".8rem", color: "#ef4444" }}>{err}</p>}
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Uploading…" : <><AddPhotoAlternateRoundedIcon style={{ fontSize: 14 }} /> Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
}