import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { usersApi, type InviteUserPayload } from "../../../api/users";
import "../../travelsync-design-system.css";
import tunisiaFlag from "../../../assets/tunisia.png";

interface Props { onClose: () => void; onSuccess: () => void; }

const COUNTRIES = [
  { code: "+216", flag: tunisiaFlag, name: "Tunisia" },
  // add more: { code: "+213", flag: algeriaFlag, name: "Algeria" },
];

function CountryDropdown({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = COUNTRIES.find(c => c.code === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "0 .75rem",
          border: "1px solid var(--border)",
          borderBottom: open ? "none" : "1px solid var(--border)",
          borderRight: "none",
          borderRadius: open ? ".4rem 0 0 0" : ".4rem 0 0 .4rem",
          background: "var(--bg-card)",
          fontSize: ".85rem",
          color: "var(--text-h)",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          height: "2.25rem",
          boxSizing: "border-box" as const,
          minWidth: "5.5rem",
        }}
      >
        {selected && !imgErrors.has(selected.code) ? (
          <img src={selected.flag} alt={selected.name}
            onError={() => setImgErrors(p => new Set(p).add(selected.code))}
            style={{ width: "1.2rem", height: "auto", display: "block" }} />
        ) : (
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>🌍</span>
        )}
        <span>{value}</span>
        <span style={{ fontSize: ".7rem", color: "var(--text-faint)" }}>▾</span>
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, minWidth: "12rem",
          border: "1px solid var(--border)", borderTop: "none",
          borderRadius: "0 0 .4rem .4rem", background: "var(--bg-card)",
          zIndex: 2147483647, boxShadow: "0 8px 24px rgba(0,0,0,.18)",
        }}>
          {COUNTRIES.map(country => (
            <div
              key={country.code}
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onChange(country.code); setOpen(false); }}
              onMouseEnter={() => setHovered(country.code)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: ".55rem .75rem",
                paddingLeft: hovered === country.code ? "1.1rem" : ".75rem",
                fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".55rem",
                color: hovered === country.code ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === country.code ? "var(--rider-bg)" : "var(--bg-card)",
                cursor: "pointer",
                transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}
            >
              {!imgErrors.has(country.code) ? (
                <img src={country.flag} alt={country.name}
                  onError={() => setImgErrors(p => new Set(p).add(country.code))}
                  style={{ width: "1.2rem", height: "auto", display: "block" }} />
              ) : (
                <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>🌍</span>
              )}
              <span>{country.code}</span>
              <span style={{ color: "var(--text-faint)", marginLeft: ".25rem" }}>{country.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InviteModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    dialCode: "+216", phoneDigits: "",
    role: "passenger" as "passenger" | "driver",
  });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phoneDigits.trim()) e.phone = "Phone number is required";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload: InviteUserPayload = {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     `${form.dialCode}${form.phoneDigits.trim()}`,
        role:      form.role,
      };
      const res = await usersApi.invite(payload);
      setSuccess(res.message ?? `Invitation sent to ${form.email}.`);
      toast.success("User invited successfully");
      setTimeout(() => { onSuccess(); onClose(); }, 1800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to send invitation.";
      setErrors({ form: msg });
      toast.error("Failed to invite user");
    } finally { setSaving(false); }
  }

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 460, overflow: "visible" }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Invite new user</h2>
            <p className="ts-page-subtitle">An invitation email will be sent. Status → <strong>Pending</strong>.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-modal-body" style={{ overflow: "visible" }}>
          {success   && <div style={{ color:"#059669", fontSize:".85rem", marginBottom:".5rem", padding:".5rem .75rem", background:"#d1fae5", borderRadius:".375rem" }}>✓ {success}</div>}
          {errors.form && <div style={{ color:"#dc2626", fontSize:".8rem", marginBottom:".5rem" }}>{errors.form}</div>}

          {/* First + Last name */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
            {(["firstName", "lastName"] as const).map(f => (
              <div key={f} style={{ display:"flex", flexDirection:"column", gap:".25rem" }}>
                <label className="ts-label">{f === "firstName" ? "First name" : "Last name"}</label>
                <input
                  className={`ts-input${errors[f] ? " ts-input-error" : ""}`}
                  placeholder={f === "firstName" ? "Jane" : "Doe"}
                  value={form[f]}
                  onChange={e => { setForm({ ...form, [f]: e.target.value }); setErrors({ ...errors, [f]: "" }); }}
                />
                {errors[f] && <span className="ts-err">{errors[f]}</span>}
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ display:"flex", flexDirection:"column", gap:".25rem", marginTop:".75rem" }}>
            <label className="ts-label">Email address</label>
            <input
              className={`ts-input${errors.email ? " ts-input-error" : ""}`}
              type="email" placeholder="jane@example.com"
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
            />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div style={{ display:"flex", flexDirection:"column", gap:".25rem", marginTop:".75rem" }}>
            <label className="ts-label">Phone number <span style={{ color:"#dc2626" }}>*</span></label>
            <div style={{ display:"flex", height:"2.25rem", width:"100%" }}>
              <CountryDropdown value={form.dialCode} onChange={code => setForm({ ...form, dialCode: code })} />
              <input
                type="tel"
                placeholder="20 123 456"
                value={form.phoneDigits}
                onChange={e => { setForm({ ...form, phoneDigits: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                style={{
                  flex: 1, height: "100%", fontSize: ".85rem",
                  fontFamily: "var(--font)", background: "var(--bg-card)",
                  color: "var(--text-h)",
                  border: `1px solid ${errors.phone ? "#dc2626" : "var(--border)"}`,
                  borderRadius: "0 .4rem .4rem 0",
                  padding: "0 .75rem", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            {errors.phone && <span className="ts-err">{errors.phone}</span>}
          </div>

          {/* Role */}
          <div style={{ display:"flex", flexDirection:"column", gap:".25rem", marginTop:".75rem" }}>
            <label className="ts-label">Role</label>
            <select className="ts-input" style={{ cursor:"pointer" }} value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as "passenger" | "driver" })}>
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