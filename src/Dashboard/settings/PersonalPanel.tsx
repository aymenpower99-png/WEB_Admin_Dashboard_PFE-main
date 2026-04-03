import { useState, useEffect, type FC } from "react";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { Icon, SettingsInput, SectionHead, SaveBtn } from "./SettingsComponents";
import { icons } from "./settingsTypes";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  passenger:   "Rider",
  driver:      "Driver",
};

const PersonalPanel: FC = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName:  user?.lastName  ?? "",
    email:     user?.email     ?? "",
    phone:     (user?.phone    ?? "") as string,
  });

  const [pendingEmail,       setPendingEmail]       = useState<string | null>(null);
  const [emailChangePending, setEmailChangePending] = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [error,         setError]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg,     setResendMsg]     = useState("");

  // ── On mount: fetch fresh /auth/me from backend ──────────────────────────
  // This is the KEY fix: if the user confirmed their email in another tab,
  // the backend already has the new email. We fetch it and sync into context.
  useEffect(() => {
    apiClient.get("/auth/me").then(res => {
      const data = res.data;

      // Sync fresh data into AuthContext + localStorage
      updateUser({
        email:     data.email,
        firstName: data.firstName,
        lastName:  data.lastName,
        phone:     data.phone,
        role:      data.role,
      });

      // Populate form with latest values from backend
      setForm({
        firstName: data.firstName ?? "",
        lastName:  data.lastName  ?? "",
        email:     data.email     ?? "",
        phone:     data.phone     ?? "",
      });

      // Check if there's still a pending email change
      if (data.emailChangePending && data.pendingEmail) {
        setEmailChangePending(true);
        setPendingEmail(data.pendingEmail);
      } else {
        setEmailChangePending(false);
        setPendingEmail(null);
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← runs once on mount, intentionally not re-running on user change

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true);
    setError("");
    setSaved(false);

    const currentEmail = user?.email ?? "";
    const emailChanged = form.email.trim() !== "" && form.email.trim() !== currentEmail;

    try {
      const payload: Record<string, string> = {
        firstName: form.firstName,
        lastName:  form.lastName,
        phone:     form.phone,
      };
      if (emailChanged) payload.email = form.email.trim();

      const res = await apiClient.patch("/auth/me", payload);

      if (emailChanged) {
        // Email change requested → backend sent verification email
        setEmailChangePending(true);
        setPendingEmail(res.data.pendingEmail ?? form.email.trim());
        setForm(f => ({ ...f, email: currentEmail }));
        // Only update name/phone in context — email stays until verified
        updateUser({ firstName: form.firstName, lastName: form.lastName, phone: form.phone });
      } else {
        // Name/phone only → update context + show Saved!
        updateUser({ firstName: form.firstName, lastName: form.lastName, phone: form.phone });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      await apiClient.post("/auth/email-change/resend");
      setResendMsg("Verification email resent! Check your inbox.");
    } catch (err: any) {
      setResendMsg(err?.response?.data?.message ?? "Failed to resend.");
    } finally {
      setResendLoading(false);
    }
  };

  const cancelEmailChange = async () => {
    try {
      await apiClient.delete("/auth/email-change");
      setEmailChangePending(false);
      setPendingEmail(null);
      setResendMsg("");
      setForm(f => ({ ...f, email: user?.email ?? f.email }));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to cancel.");
    }
  };

  const roleLabel = ROLE_LABEL[user?.role ?? ""] ?? (user?.role ?? "—");

  return (
    <div>
      <SectionHead title="Personal Information" desc="Update your name, contact details, and profile info." />

      {/* ── Pending email change banner ──────────────────────────── */}
      {emailChangePending && pendingEmail && (
        <div style={{
          background: "#F0FDF4", border: "1px solid #86EFAC",
          borderRadius: 10, padding: "14px 16px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ color: "#16A34A", marginTop: 1 }}>
              <Icon d={icons.mail} size={16} sw={2} />
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#15803D" }}>
                ✅ Verification required
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#166534", lineHeight: 1.5 }}>
                We sent a confirmation link to <strong>{pendingEmail}</strong>.<br />
                Please verify to complete your email update.
              </p>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6 }}>
                Current: <strong style={{ color: "#374151" }}>{user?.email}</strong>
                &nbsp;→&nbsp;
                Pending: <strong style={{ color: "#7C3AED" }}>{pendingEmail}</strong>
              </div>
              {resendMsg && (
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#16A34A", fontWeight: 600 }}>
                  {resendMsg}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={resendVerification} disabled={resendLoading} style={{
                  fontSize: 12, color: "#7C3AED", fontWeight: 600, background: "none",
                  border: "1px solid #C4B5FD", borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Icon d={icons.refresh} size={11} stroke="#7C3AED" sw={2} />
                  {resendLoading ? "Sending..." : "Resend email"}
                </button>
                <button onClick={cancelEmailChange} style={{
                  fontSize: 12, color: "#6B7280", fontWeight: 600, background: "none",
                  border: "1px solid #D1D5DB", borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Icon d={icons.x} size={11} stroke="#6B7280" sw={2} />
                  Cancel change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <SettingsInput label="First name"  value={form.firstName} onChange={set("firstName")} />
        <SettingsInput label="Last name"   value={form.lastName}  onChange={set("lastName")}  />
        <SettingsInput
          label="Email address" type="email"
          value={form.email} onChange={set("email")}
          readOnly={emailChangePending}
          hint={emailChangePending
            ? "Email locked until pending change is verified or cancelled."
            : undefined}
        />
        <SettingsInput label="Phone number" value={form.phone} onChange={set("phone")} placeholder="+1 234 567 890" />

        {/* Role — read-only */}
        <div className="col-span-2 space-y-1.5">
          <label className="ts-label">Job title / Role</label>
          <div
            className="ts-input flex items-center gap-2"
            style={{ opacity: 0.7, cursor: "not-allowed", background: "var(--input-bg, #f9fafb)" }}
          >
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
              {roleLabel}
            </span>
            <span className="text-xs ts-muted">Role is managed by your system administrator.</span>
          </div>
        </div>
      </div>

      {error && <p className="ts-err mt-2">{error}</p>}
      <div className="mt-6 flex justify-end">
        <SaveBtn onClick={save} saved={saved} loading={loading} />
      </div>
    </div>
  );
};

export default PersonalPanel;