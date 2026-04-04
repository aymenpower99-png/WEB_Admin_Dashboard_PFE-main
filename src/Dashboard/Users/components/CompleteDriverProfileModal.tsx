import { useState } from "react";
import apiClient from "../../../api/apiClient";
import "../../travelsync-design-system.css";

interface Props { userId: string; userName: string; onClose: () => void; onSuccess: () => void; }

const EMPTY = { driverLicenseNumber:"", driverLicenseExpiry:"", driverLicenseFrontUrl:"", driverLicenseBackUrl:"", language:"English" as "English"|"French"|"Arabic", phone:"" };

export default function CompleteDriverProfileModal({ userId, userName, onClose, onSuccess }: Props) {
  const [form, setForm]     = useState(EMPTY);
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);

  const set = (f: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(p => ({...p, [f]: e.target.value}));

  async function handleSubmit() {
    setError("");
    if (!form.driverLicenseNumber || !form.driverLicenseExpiry || !form.driverLicenseFrontUrl || !form.driverLicenseBackUrl || !form.phone) {
      setError("All fields are required."); return;
    }
    setSaving(true);
    try {
      await apiClient.post("/drivers", { userId, ...form });
      onSuccess(); onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to complete profile.";
      setError(msg);
    } finally { setSaving(false); }
  }

  return (
    <div className="ts-overlay" style={{ zIndex:9999 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth:480, width:"100%" }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize:"1rem" }}>Complete Driver Profile</h2>
            <p className="ts-page-subtitle">{userName}</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body" style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
          {error && <div style={{ background:"#fee2e2", color:"#991b1b", borderRadius:6, padding:".5rem .75rem", fontSize:".8rem" }}>{error}</div>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".6rem" }}>
            <label style={{ display:"flex", flexDirection:"column", gap:".3rem", fontSize:".8rem", color:"var(--text-body)" }}>
              License Number * <input className="ts-input" value={form.driverLicenseNumber} onChange={set("driverLicenseNumber")} placeholder="DL-2024-001" />
            </label>
            <label style={{ display:"flex", flexDirection:"column", gap:".3rem", fontSize:".8rem", color:"var(--text-body)" }}>
              Expiry * <input className="ts-input" type="date" value={form.driverLicenseExpiry} onChange={set("driverLicenseExpiry")} />
            </label>
          </div>
          <label style={{ display:"flex", flexDirection:"column", gap:".3rem", fontSize:".8rem", color:"var(--text-body)" }}>
            License Front URL * <input className="ts-input" value={form.driverLicenseFrontUrl} onChange={set("driverLicenseFrontUrl")} placeholder="https://..." />
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:".3rem", fontSize:".8rem", color:"var(--text-body)" }}>
            License Back URL * <input className="ts-input" value={form.driverLicenseBackUrl} onChange={set("driverLicenseBackUrl")} placeholder="https://..." />
          </label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".6rem" }}>
            <label style={{ display:"flex", flexDirection:"column", gap:".3rem", fontSize:".8rem", color:"var(--text-body)" }}>
              Phone * <input className="ts-input" value={form.phone} onChange={set("phone")} placeholder="+213661234567" />
            </label>
            <label style={{ display:"flex", flexDirection:"column", gap:".3rem", fontSize:".8rem", color:"var(--text-body)" }}>
              Language *
              <select className="ts-input" value={form.language} onChange={set("language")}>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Arabic">Arabic</option>
              </select>
            </label>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving…" : "Complete Profile"}</button>
        </div>
      </div>
    </div>
  );
}