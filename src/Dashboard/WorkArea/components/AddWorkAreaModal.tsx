import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { workAreasApi, type WorkAreaItem } from "../../../api/workAreas";
import { COUNTRIES, TUNISIA_VILLES } from "./WorkAreaTypes";

interface Props {
  onClose: () => void;
  onCreated: (area: WorkAreaItem) => void;
}

export default function AddWorkAreaModal({ onClose, onCreated }: Props) {
  const [country, setCountry] = useState("Tunisia");
  const [ville,   setVille]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSave() {
    if (!ville) { setError("Please select a ville."); return; }
    setSaving(true); setError(null);
    try {
      const created = await workAreasApi.create({ country, ville });
      onCreated(created);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create work area.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally { setSaving(false); }
  }

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 400 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Add Work Area</h2>
            <p className="ts-page-subtitle">Define a new service zone for driver assignment.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 8, padding: "8px 14px", color: "#ef4444", fontSize: ".875rem",
            }}>
              {error}
            </div>
          )}

          {/* Country */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label className="ts-label">Country</label>
            <select className="ts-input" value={country} onChange={e => { setCountry(e.target.value); setVille(""); }} style={{ cursor: "pointer" }}>
              {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Ville */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <label className="ts-label">Ville</label>
            <select className="ts-input" value={ville} onChange={e => setVille(e.target.value)} style={{ cursor: "pointer" }}>
              <option value="">— Select a ville —</option>
              {TUNISIA_VILLES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSave} disabled={saving || !ville}>
            {saving ? "Saving…" : "Add Work Area"}
          </button>
        </div>
      </div>
    </div>
  );
}