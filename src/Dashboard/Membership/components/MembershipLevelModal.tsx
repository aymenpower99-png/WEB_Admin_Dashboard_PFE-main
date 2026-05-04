import { useState, useEffect } from "react";
import {
  membershipLevelsApi,
  type MembershipLevel,
  type CreateMembershipLevelPayload,
} from "../../../api/membershipLevels";

interface Props {
  mode: "create" | "edit";
  level?: MembershipLevel;
  onClose: () => void;
  onSaved: (l: MembershipLevel) => void;
}

const LABEL: React.CSSProperties = {
  display: "block", fontSize: ".78rem", fontWeight: 700,
  color: "var(--text-muted)", textTransform: "uppercase",
  letterSpacing: ".05em", marginBottom: ".35rem",
};

export default function MembershipLevelModal({ mode, level, onClose, onSaved }: Props) {
  const [name,       setName]       = useState(level?.name              ?? "");
  const [points,     setPoints]     = useState(String(level?.requiredPoints    ?? ""));
  const [discount,   setDiscount]   = useState(String(level?.discountPercentage ?? ""));
  const [levelNum,   setLevelNum]   = useState(String(level?.level              ?? "1"));
  const [isActive,   setIsActive]   = useState(level?.isActive ?? true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    // Prevent background scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSave() {
    setError(null);
    const reqPoints = Number(points);
    const disc      = Number(discount);

    if (!name.trim())           return setError("Name is required.");
    if (isNaN(reqPoints) || reqPoints < 0) return setError("Required points must be a non-negative number.");
    if (isNaN(disc) || disc < 0 || disc > 100) return setError("Discount must be between 0 and 100.");

    setSaving(true);
    try {
      const payload: CreateMembershipLevelPayload = {
        name: name.trim(),
        requiredPoints: reqPoints,
        discountPercentage: disc,
        level: Number(levelNum),
        isActive,
      };
      const result = mode === "create"
        ? await membershipLevelsApi.create(payload)
        : await membershipLevelsApi.update(level!.id, payload);
      onSaved(result);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save. Please try again.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ts-overlay" onClick={onClose}>
      <div className="ts-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>

        <div className="ts-modal-header">
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-h)" }}>
            {mode === "create" ? "Add Membership Level" : "Edit Membership Level"}
          </span>
          <button className="ts-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ts-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: ".5rem", padding: ".6rem .85rem",
              fontSize: ".82rem", color: "#dc2626", fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label style={LABEL}>Level Name</label>
            <input
              className="ts-input"
              placeholder="e.g. VIP, Max, Elite"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* Points + Order (side by side) */}
          <div style={{ display: "flex", gap: ".75rem" }}>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>Required Points</label>
              <input
                className="ts-input"
                type="number" min="0"
                placeholder="e.g. 1000"
                value={points}
                onChange={e => setPoints(e.target.value)}
                disabled={saving}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>Level (1–10)</label>
              <select
                className="ts-input"
                value={levelNum}
                onChange={e => setLevelNum(e.target.value)}
                disabled={saving}
                style={{ cursor: "pointer" }}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label style={LABEL}>Discount Percentage (%)</label>
            <input
              className="ts-input"
              type="number" min="0" max="100" step="0.01"
              placeholder="e.g. 10"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* Status toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--text-body)" }}>
              Active
            </span>
            <button
              onClick={() => setIsActive(v => !v)}
              disabled={saving}
              style={{
                width: 40, height: 22, borderRadius: 999, border: "none",
                background: isActive ? "#7c3aed" : "var(--border)",
                cursor: "pointer", position: "relative", transition: "background .2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%",
                background: "#fff", transition: "left .2s",
                left: isActive ? 21 : 3,
              }} />
            </button>
          </div>

        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="ts-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create Level" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
