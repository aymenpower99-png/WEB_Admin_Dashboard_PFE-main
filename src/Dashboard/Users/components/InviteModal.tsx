import { useState } from "react";
import { usersApi, type InviteUserPayload } from "../../../api/users";
import "../../travelsync-design-system.css";

interface Props { onClose: () => void; onSuccess: () => void; }

export default function InviteModal({ onClose, onSuccess }: Props) {
  const [form, setForm]       = useState({ firstName:"", lastName:"", email:"", role:"passenger" as "passenger"|"driver" });
  const [errors, setErrors]   = useState<Record<string,string>>({});
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState<string|null>(null);

  function validate() {
    const e: Record<string,string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload: InviteUserPayload = { firstName:form.firstName, lastName:form.lastName, email:form.email, role:form.role };
      const res = await usersApi.invite(payload);
      setSuccess(res.message ?? `Invitation sent to ${form.email}.`);
      setTimeout(() => { onSuccess(); onClose(); }, 1800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to send invitation.";
      setErrors({ form: msg });
    } finally { setSaving(false); }
  }

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal">
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize:"1rem" }}>Invite new user</h2>
            <p className="ts-page-subtitle">An invitation email will be sent. Status → <strong>Pending</strong>.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body">
          {success  && <div style={{ color:"#059669", fontSize:".85rem", marginBottom:".5rem", padding:".5rem .75rem", background:"#d1fae5", borderRadius:".375rem" }}>✓ {success}</div>}
          {errors.form && <div style={{ color:"#dc2626", fontSize:".8rem", marginBottom:".5rem" }}>{errors.form}</div>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
            {(["firstName","lastName"] as const).map(f => (
              <div key={f} style={{ display:"flex", flexDirection:"column", gap:".25rem" }}>
                <label className="ts-label">{f === "firstName" ? "First name" : "Last name"}</label>
                <input className={`ts-input${errors[f] ? " ts-input-error" : ""}`} placeholder={f === "firstName" ? "Jane" : "Doe"}
                  value={form[f]} onChange={e => { setForm({...form,[f]:e.target.value}); setErrors({...errors,[f]:""}); }} />
                {errors[f] && <span className="ts-err">{errors[f]}</span>}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:".25rem", marginTop:".75rem" }}>
            <label className="ts-label">Email address</label>
            <input className={`ts-input${errors.email ? " ts-input-error" : ""}`} type="email" placeholder="jane@example.com"
              value={form.email} onChange={e => { setForm({...form,email:e.target.value}); setErrors({...errors,email:""}); }} />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:".25rem", marginTop:".75rem" }}>
            <label className="ts-label">Role</label>
            <select className="ts-input" style={{ cursor:"pointer" }} value={form.role}
              onChange={e => setForm({...form, role: e.target.value as "passenger"|"driver"})}>
              <option value="passenger">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={saving || !!success}>
            {saving ? "Sending…" : "Send invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}