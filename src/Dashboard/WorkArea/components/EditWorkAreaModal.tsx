import { useState } from "react";
import { toast } from "sonner";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { workAreasApi, type WorkAreaItem } from "../../../api/workAreas";
import { COUNTRIES, TUNISIA_VILLES } from "./WorkAreaTypes";
import {
  Field,
  PlainDropdown,
} from "../../Vehicles/AddvehicleComponents/Field";

interface Props {
  area: WorkAreaItem;
  onClose: () => void;
  onSaved: (area: WorkAreaItem) => void;
}

export default function EditWorkAreaModal({ area, onClose, onSaved }: Props) {
  const [country, setCountry] = useState(area.country);
  const [ville, setVille] = useState(area.ville);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!ville) {
      setError("Please select a ville.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await workAreasApi.update(area.id, { country, ville });
      onSaved(updated);
      toast.success("Work area updated successfully");
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update work area.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
      toast.error("Failed to update work area");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="ts-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ts-modal" style={{ maxWidth: 400 }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              Edit Work Area
            </h2>
            <p className="ts-page-subtitle">Update the service zone details.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 16 }} />
          </button>
        </div>

        <div
          className="ts-modal-body"
          style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
        >
          {error && <div className="ts-alert-error">{error}</div>}

          <Field label="Country" error="">
            <PlainDropdown
              value={country}
              onChange={(v) => {
                setCountry(v);
                setVille("");
              }}
              options={COUNTRIES}
            />
          </Field>

          <Field label="Ville" error="">
            <PlainDropdown
              value={ville}
              onChange={(v) => setVille(v)}
              options={TUNISIA_VILLES.map((v) => ({ value: v, label: v }))}
              placeholder="SELECT VILLE"
            />
          </Field>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="ts-btn-primary"
            onClick={handleSave}
            disabled={saving || !ville}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
