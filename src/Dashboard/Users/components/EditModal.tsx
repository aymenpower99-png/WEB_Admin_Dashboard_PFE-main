import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { usersApi, type AdminUser, type UpdateUserPayload } from "../../../api/users";
import "../../travelsync-design-system.css";
import tunisiaFlag from "../../../assets/tunisia.png";

interface Props { user: AdminUser; onClose: () => void; onSave: (u: AdminUser) => void; }

const COUNTRIES = [
  { code: "+216", flag: tunisiaFlag, name: "Tunisia" },
];

function CountryDropdown({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen]     = useState(false);
  const [hovered, setHov]   = useState<string | null>(null);
  const [imgErr, setImgErr] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = COUNTRIES.find(c => c.code === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: "0 .75rem", border: "1px solid var(--border)",
        borderBottom: open ? "none" : "1px solid var(--border)",
        borderRight: "none",
        borderRadius: open ? ".4rem 0 0 0" : ".4rem 0 0 .4rem",
        background: "var(--bg-card)", fontSize: ".85rem", color: "var(--text-h)",
        cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center",
        gap: ".5rem", height: "2.25rem", boxSizing: "border-box" as const, minWidth: "5.5rem",
      }}>
        {selected && !imgErr.has(selected.code) ? (
          <img src={selected.flag} alt={selected.name}
            onError={() => setImgErr(p => new Set(p).add(selected.code))}
            style={{ width: "1.2rem", height: "auto", display: "block" }} />
        ) : <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>🌍</span>}
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
          {COUNTRIES.map(c => (
            <div key={c.code}
              onMouseDown={e => { e.preventDefault(); onChange(c.code); setOpen(false); }}
              onMouseEnter={() => setHov(c.code)} onMouseLeave={() => setHov(null)}
              style={{
                padding: ".55rem .75rem", paddingLeft: hovered === c.code ? "1.1rem" : ".75rem",
                fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".55rem",
                color: hovered === c.code ? "var(--rider-fg)" : "var(--text-body)",
                background: hovered === c.code ? "var(--rider-bg)" : "var(--bg-card)",
                cursor: "pointer", transition: "background var(--t-fast), color var(--t-fast), padding-left var(--t-fast)",
              }}>
              {!imgErr.has(c.code)
                ? <img src={c.flag} alt={c.name} onError={() => setImgErr(p => new Set(p).add(c.code))} style={{ width: "1.2rem", height: "auto" }} />
                : <span style={{ fontSize: "1.2rem" }}>🌍</span>}
              <span>{c.code}</span>
              <span style={{ color: "var(--text-faint)", marginLeft: ".25rem" }}>{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Parse stored phone "+216XXXXXXXX" → { dialCode: "+216", digits: "XXXXXXXX" }
function parsePhone(raw: string): { dialCode: string; digits: string } {
  for (const c of COUNTRIES) {
    if (raw.startsWith(c.code)) return { dialCode: c.code, digits: raw.slice(c.code.length) };
  }
  return { dialCode: "+216", digits: raw };
}

export default function EditModal({ user, onClose, onSave }: Props) {
  const parsed = parsePhone(user.phone ?? "");
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    dialCode:  parsed.dialCode,
    phoneDigits: parsed.digits,
    role: (user.role === "driver" ? "driver" : "passenger") as "passenger" | "driver",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving]  = useState(false);

  function validate() {
    const e: Record<string, string> = {};
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
      const phone = form.phoneDigits.trim()
        ? `${form.dialCode}${form.phoneDigits.trim()}`
        : undefined;
      const payload: UpdateUserPayload = {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        role:      form.role,
        phone,
      };
      const result = await usersApi.update(user.id, payload);
      toast.success("User updated successfully");
      onSave(result); onClose();
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message ?? "Failed to update user.";
      setErrors({ form: msg });
      toast.error("Failed to update user");
    } finally { setSaving(false); }
  }

  return (
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal" style={{ maxWidth: 460, overflow: "visible" }}>
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Edit user</h2>
            <p className="ts-page-subtitle">Update details. Use Block/Unblock to manage access.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body" style={{ overflow: "visible" }}>
          {errors.form && <div style={{ color: "#dc2626", fontSize: ".8rem", marginBottom: ".5rem" }}>{errors.form}</div>}

          {/* First / Last */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
            {(["firstName", "lastName"] as const).map(f => (
              <div key={f} style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
                <label className="ts-label">{f === "firstName" ? "First name" : "Last name"}</label>
                <input className={`ts-input${errors[f] ? " ts-input-error" : ""}`}
                  placeholder={f === "firstName" ? "Jane" : "Doe"} value={form[f]}
                  onChange={e => { setForm({ ...form, [f]: e.target.value }); setErrors({ ...errors, [f]: "" }); }} />
                {errors[f] && <span className="ts-err">{errors[f]}</span>}
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".25rem", marginTop: ".75rem" }}>
            <label className="ts-label">Email address</label>
            <input className={`ts-input${errors.email ? " ts-input-error" : ""}`}
              type="email" placeholder="jane@example.com" value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>

          {/* Phone — same style as InviteModal */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".25rem", marginTop: ".75rem" }}>
            <label className="ts-label">Phone number</label>
            <div style={{ display: "flex", height: "2.25rem", width: "100%" }}>
              <CountryDropdown value={form.dialCode} onChange={code => setForm({ ...form, dialCode: code })} />
              <input
                type="tel" placeholder="20 123 456"
                value={form.phoneDigits}
                onChange={e => setForm({ ...form, phoneDigits: e.target.value })}
                style={{
                  flex: 1, height: "100%", fontSize: ".85rem",
                  fontFamily: "var(--font)", background: "var(--bg-card)", color: "var(--text-h)",
                  border: "1px solid var(--border)", borderRadius: "0 .4rem .4rem 0",
                  padding: "0 .75rem", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".25rem", marginTop: ".75rem" }}>
            <label className="ts-label">Role</label>
            <select className="ts-input" style={{ cursor: "pointer" }} value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as "passenger" | "driver" })}>
              <option value="passenger">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}