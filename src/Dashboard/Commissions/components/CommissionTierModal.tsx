import { useState, useEffect } from "react";
import { toast } from "sonner";
import { billingApi, type CommissionTierRecord } from "../../../api/billing";

interface Props {
  mode: "create" | "edit";
  tier?: CommissionTierRecord;
  existingTiers: CommissionTierRecord[];
  onClose: () => void;
  onSaved: (t: CommissionTierRecord) => void;
}

const LABEL: React.CSSProperties = {
  display: "block", fontSize: ".78rem", fontWeight: 700,
  color: "var(--text-muted)", textTransform: "uppercase",
  letterSpacing: ".05em", marginBottom: ".35rem",
};

export default function CommissionTierModal({ mode, tier, existingTiers, onClose, onSaved }: Props) {
  const [name,          setName]          = useState(tier?.name            ?? "");
  const [requiredRides, setRequiredRides] = useState(String(tier?.requiredRides ?? ""));
  const [bonusAmount,   setBonusAmount]   = useState(String(tier?.bonusAmount   ?? ""));
  const [sortOrder,     setSortOrder]     = useState(String(tier?.sortOrder     ?? "0"));
  const [isActive,      setIsActive]      = useState(tier?.isActive ?? true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSave() {
    setError(null);
    const rides  = Number(requiredRides);
    const bonus  = Number(bonusAmount);
    const order  = Number(sortOrder);
    const trimmedName = name.trim();

    if (!trimmedName)                    return setError("Name is required.");
    if (isNaN(rides) || rides < 0)       return setError("Required rides must be a non-negative number.");
    if (isNaN(bonus) || bonus < 0)       return setError("Bonus amount must be a non-negative number.");

    // Duplicate check — name
    const duplicateName = existingTiers.find(
      (t) => t.name.trim().toLowerCase() === trimmedName.toLowerCase() && t.id !== tier?.id,
    );
    if (duplicateName) {
      return setError(`A commission tier named "${duplicateName.name}" already exists.`);
    }

    // Duplicate check — sort order
    const duplicateOrder = existingTiers.find(
      (t) => t.sortOrder === order && t.id !== tier?.id,
    );
    if (duplicateOrder) {
      return setError(`Sort order ${order} is already used by "${duplicateOrder.name}".`);
    }

    // Duplicate check — required rides
    const duplicateRides = existingTiers.find(
      (t) => t.requiredRides === rides && t.id !== tier?.id,
    );
    if (duplicateRides) {
      return setError(`Required rides ${rides} are already used by "${duplicateRides.name}".`);
    }

    setSaving(true);
    try {
      const result = mode === "create"
        ? await billingApi.createTier({ name: trimmedName, requiredRides: rides, bonusAmount: bonus, sortOrder: order })
        : await billingApi.updateTier(tier!.id, { name: trimmedName, requiredRides: rides, bonusAmount: bonus, sortOrder: order, isActive });
      onSaved(result);
      toast.success(mode === "create" ? "Commission tier created" : "Commission tier updated");
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save. Please try again.";
      setError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
      toast.error("Failed to save commission tier");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ts-overlay" onClick={onClose}>
      <div className="ts-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>

        <div className="ts-modal-header">
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-h)" }}>
            {mode === "create" ? "Add Commission Tier" : "Edit Commission Tier"}
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
            <label style={LABEL}>Tier Name</label>
            <input
              className="ts-input"
              placeholder="e.g. Bronze, Silver, Gold"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* Rides + Bonus side by side */}
          <div style={{ display: "flex", gap: ".75rem" }}>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>Required Rides</label>
              <input
                className="ts-input"
                type="number" min="0"
                placeholder="e.g. 50"
                value={requiredRides}
                onChange={e => setRequiredRides(e.target.value)}
                disabled={saving}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={LABEL}>Bonus Amount (DT)</label>
              <input
                className="ts-input"
                type="number" min="0" step="0.01"
                placeholder="e.g. 100"
                value={bonusAmount}
                onChange={e => setBonusAmount(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label style={LABEL}>Sort Order</label>
            <input
              className="ts-input"
              type="number" min="0"
              placeholder="e.g. 1"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* Status toggle (edit only) */}
          {mode === "edit" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--text-body)" }}>Active</span>
              <button
                onClick={() => setIsActive(v => !v)}
                disabled={saving}
                style={{
                  width: 40, height: 22, borderRadius: 999, border: "none",
                  background: isActive ? "#3b82f6" : "var(--border)",
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
          )}

        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create Tier" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
