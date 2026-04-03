import { useState, type FC, type ReactNode } from "react";
import apiClient from "../../api/apiClient";
import { Icon, SettingsInput, SectionHead, SaveBtn } from "./SettingsComponents";
import { icons } from "./settingsTypes";

const PasswordPanel: FC = () => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const tog = (k: keyof typeof show) => () => setShow(s => ({ ...s, [k]: !s[k] }));

  const save = async () => {
    setError("");
    if (form.next !== form.confirm) { setError("New passwords do not match."); return; }
    setLoading(true);
    try {
      await apiClient.patch("/auth/me/password", {
        currentPassword: form.current,
        newPassword:     form.next,
      });
      setSaved(true);
      setForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const rules = [
    { label: "At least 8 characters",         test: (p: string) => p.length >= 8            },
    { label: "At least one uppercase letter",  test: (p: string) => /[A-Z]/.test(p)          },
    { label: "At least one lowercase letter",  test: (p: string) => /[a-z]/.test(p)          },
    { label: "At least one number",            test: (p: string) => /[0-9]/.test(p)          },
    { label: "At least one special character", test: (p: string) => /[^A-Za-z0-9]/.test(p)  },
  ];
  const passed      = rules.filter(r => r.test(form.next)).length;
  const strengthBg  = ["bg-gray-200","bg-red-400","bg-red-400","bg-amber-400","bg-blue-400","bg-green-500"];
  const strengthLbl = ["","Very weak","Weak","Fair","Good","Strong"];
  const strengthFg  = ["","text-red-500","text-red-500","text-amber-500","text-blue-500","text-green-600"];

  const eyeBtn = (k: keyof typeof show): ReactNode => (
    <button type="button" onClick={tog(k)} className="ts-muted hover:ts-h transition-colors">
      <Icon d={show[k] ? icons.eyeOff : icons.eye} size={16} sw={1.8} />
    </button>
  );

  return (
    <div>
      <SectionHead title="Change Password" desc="Choose a strong password to keep your account secure." />
      <div className="space-y-4 max-w-md">
        <SettingsInput label="Current password" type={show.current ? "text" : "password"}
          value={form.current} onChange={set("current")} placeholder="Enter current password"
          rightEl={eyeBtn("current")} />

        <div className="space-y-2">
          <SettingsInput label="New password" type={show.next ? "text" : "password"}
            value={form.next} onChange={set("next")} placeholder="Create a strong password"
            rightEl={eyeBtn("next")} />

          {/* Strength bar */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${form.next && i <= passed ? strengthBg[passed] : "bg-gray-200"}`} />
              ))}
            </div>
            <span className={`text-xs font-medium w-16 text-right ${form.next ? strengthFg[passed] : "text-gray-300"}`}>
              {form.next ? strengthLbl[passed] : ""}
            </span>
          </div>

          {/* Rules checklist */}
          <div className="ts-card-inner p-3 space-y-1.5">
            {rules.map(r => {
              const ok = form.next ? r.test(form.next) : false;
              return (
                <div key={r.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${ok ? "bg-green-500" : "bg-gray-200"}`}>
                    {ok && <Icon d={icons.check} size={10} stroke="white" sw={3} />}
                  </div>
                  <span className={`text-xs transition-colors ${ok ? "text-green-700 font-medium" : "ts-muted"}`}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <SettingsInput label="Confirm new password" type={show.confirm ? "text" : "password"}
          value={form.confirm} onChange={set("confirm")} placeholder="Repeat new password"
          rightEl={eyeBtn("confirm")}
          hint={form.confirm && form.next !== form.confirm ? "Passwords don't match" : undefined} />
      </div>
      {error && <p className="ts-err mt-2">{error}</p>}
      <div className="mt-6 flex justify-end">
        <SaveBtn onClick={save} saved={saved} loading={loading} />
      </div>
    </div>
  );
};

export default PasswordPanel;