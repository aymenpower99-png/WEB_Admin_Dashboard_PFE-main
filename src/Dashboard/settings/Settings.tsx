import { useState, type ReactNode, type FC } from "react";
import '../travelsync-design-system.css'
// ── Types ──────────────────────────────────────────────────────────────
interface IconProps { d: string|string[]; size?: number; stroke?: string; sw?: number; }
interface ToggleProps { checked: boolean; onChange: (val: boolean) => void; }
interface InputProps { label?: string; type?: string; value: string; onChange: (val: string) => void; placeholder?: string; hint?: string; rightEl?: ReactNode; }
interface SelectOption { value: string; label: string; }
interface SelectProps { label?: string; value: string; onChange: (val: string) => void; options: SelectOption[]; }
interface SectionHeadProps { title: string; desc?: string; }
interface SaveBtnProps { onClick: () => void; saved: boolean; }
interface TabItem { id: string; label: string; icon: string|string[]; }

// ── Icons ──────────────────────────────────────────────────────────────
const Icon: FC<IconProps> = ({ d, size=18, stroke="currentColor", sw=1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons: Record<string,string|string[]> = {
  user:       ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  lock:       ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  appearance: ["M2 13.5A10 10 0 1010.5 22","M13 2.05A10 10 0 0121.95 11","M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0","M3 3l18 18"],
  currency:   ["M12 1v22","M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"],
  eye:        ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  eyeOff:     ["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94","M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19","M1 1l22 22"],
  check:      "M20 6L9 17l-5-5",
  sun:        ["M12 17a5 5 0 100-10 5 5 0 000 10z","M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42"],
  moon:       "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  palette:    ["M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.657-1.343 3-3 3h-1.5a1.5 1.5 0 000 3 1.5 1.5 0 001.5 1.5c0 1.38-3.134 2.5-7 2.5z","M7 13a1 1 0 100-2 1 1 0 000 2z","M10 9a1 1 0 100-2 1 1 0 000 2z","M14 9a1 1 0 100-2 1 1 0 000 2z","M17 13a1 1 0 100-2 1 1 0 000 2z"],
};

// ── Sub-components ─────────────────────────────────────────────────────
const Toggle: FC<ToggleProps> = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked?"bg-violet-600":"bg-gray-200"}`}>
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${checked?"left-5":"left-0.5"}`} />
  </button>
);

const SettingsInput: FC<InputProps> = ({ label, type="text", value, onChange, placeholder, hint, rightEl }) => (
  <div className="space-y-1.5">
    {label && <label className="ts-label">{label}</label>}
    <div className="relative">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className="ts-input" />
      {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
    {hint && <p className="ts-err">{hint}</p>}
  </div>
);

const SettingsSelect: FC<SelectProps> = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    {label && <label className="ts-label">{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="ts-input ts-settings-select cursor-pointer">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SectionHead: FC<SectionHeadProps> = ({ title, desc }) => (
  <div className="mb-5">
    <h3 className="ts-page-title text-base font-semibold">{title}</h3>
    {desc && <p className="ts-muted text-sm mt-0.5">{desc}</p>}
  </div>
);

const SaveBtn: FC<SaveBtnProps> = ({ onClick, saved }) => (
  <button type="button" onClick={onClick}
    className={`ts-btn-primary ${saved?"!bg-green-500":""}` }
    style={ saved ? { background:"#22c55e" } : {} }>
    {saved ? <><Icon d={icons.check} size={15} sw={2.5} /> Saved!</> : "Save changes"}
  </button>
);

// ── Panels ─────────────────────────────────────────────────────────────
const PersonalPanel: FC = () => {
  const [form, setForm] = useState({ firstName:"Sarah", lastName:"Lee", email:"sarah.lee@travelsync.com", phone:"+1 (555) 234-5678", role:"Agency Manager" });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({...f,[k]:v}));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionHead title="Personal Information" desc="Update your name, contact details, and profile info." />
      <div className="grid grid-cols-2 gap-4">
        <SettingsInput label="First name"        value={form.firstName} onChange={set("firstName")} />
        <SettingsInput label="Last name"         value={form.lastName}  onChange={set("lastName")}  />
        <SettingsInput label="Email address" type="email" value={form.email} onChange={set("email")} />
        <SettingsInput label="Phone number"      value={form.phone}     onChange={set("phone")}     />
        <div className="col-span-2"><SettingsInput label="Job title / Role" value={form.role} onChange={set("role")} /></div>
      </div>
      <div className="mt-6 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

const PasswordPanel: FC = () => {
  const [form, setForm]   = useState({ current:"", next:"", confirm:"" });
  const [show, setShow]   = useState({ current:false, next:false, confirm:false });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({...f,[k]:v}));
  const tog = (k: keyof typeof show) => () => setShow((s) => ({...s,[k]:!s[k]}));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const rules = [
    { label:"At least 8 characters",            test:(p:string)=>p.length>=8             },
    { label:"At least one uppercase letter",     test:(p:string)=>/[A-Z]/.test(p)         },
    { label:"At least one lowercase letter",     test:(p:string)=>/[a-z]/.test(p)         },
    { label:"At least one number",               test:(p:string)=>/[0-9]/.test(p)         },
    { label:"At least one special character",    test:(p:string)=>/[^A-Za-z0-9]/.test(p)  },
  ];
  const passed = rules.filter((r) => r.test(form.next)).length;
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
        <SettingsInput label="Current password" type={show.current?"text":"password"} value={form.current} onChange={set("current")} placeholder="Enter current password" rightEl={eyeBtn("current")} />
        <div className="space-y-2">
          <SettingsInput label="New password" type={show.next?"text":"password"} value={form.next} onChange={set("next")} placeholder="Create a strong password" rightEl={eyeBtn("next")} />
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${form.next&&i<=passed?strengthBg[passed]:"bg-gray-200"}`} />
              ))}
            </div>
            <span className={`text-xs font-medium w-16 text-right ${form.next?strengthFg[passed]:"text-gray-300"}`}>
              {form.next ? strengthLbl[passed] : ""}
            </span>
          </div>
          <div className="ts-card-inner p-3 space-y-1.5">
            {rules.map((r) => {
              const ok = form.next ? r.test(form.next) : false;
              return (
                <div key={r.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${ok?"bg-green-500":"bg-gray-200"}`}>
                    {ok && <Icon d={icons.check} size={10} stroke="white" sw={3} />}
                  </div>
                  <span className={`text-xs transition-colors ${ok?"text-green-700 font-medium":"ts-muted"}`}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <SettingsInput label="Confirm new password" type={show.confirm?"text":"password"} value={form.confirm} onChange={set("confirm")} placeholder="Repeat new password" rightEl={eyeBtn("confirm")}
          hint={form.confirm&&form.next!==form.confirm?"Passwords don't match":undefined} />
      </div>
      <div className="mt-6 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

const CurrencyPanel: FC = () => {
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const currencies: SelectOption[] = [
    {value:"USD",label:"USD — US Dollar ($)"},{value:"EUR",label:"EUR — Euro (€)"},
    {value:"GBP",label:"GBP — British Pound (£)"},{value:"TND",label:"TND — Tunisian Dinar (د.ت)"},
    {value:"JPY",label:"JPY — Japanese Yen (¥)"},{value:"CAD",label:"CAD — Canadian Dollar (CA$)"},
    {value:"AED",label:"AED — UAE Dirham (د.إ)"},{value:"SAR",label:"SAR — Saudi Riyal (﷼)"},
  ];
  const symbols: Record<string,string> = {USD:"$",EUR:"€",GBP:"£",TND:"د.ت",JPY:"¥",CAD:"CA$",AED:"د.إ",SAR:"﷼"};

  return (
    <div>
      <SectionHead title="Currency" desc="Set the default currency used across your agency." />
      <div className="ts-currency-preview">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0">
          <Icon d={icons.currency} size={18} sw={2} />
        </div>
        <div>
          <p className="text-xs text-violet-600 font-medium">Preview</p>
          <p className="text-2xl font-bold text-violet-700" style={{fontFamily:"Georgia,serif"}}>{symbols[currency]??""}{`1,234.56`}</p>
          <p className="text-xs text-violet-500 mt-0.5">Sample amount in your selected currency</p>
        </div>
      </div>
      <div className="max-w-xs">
        <SettingsSelect label="Default currency" value={currency} onChange={setCurrency} options={currencies} />
      </div>
      <div className="mt-6 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

// ── Appearance Panel ───────────────────────────────────────────────────
interface AppearancePanelProps {
  dark: boolean;
  onToggleDark: () => void;
}

const AppearancePanel: FC<AppearancePanelProps> = ({ dark, onToggleDark }) => {
  const [saved, setSaved] = useState(false);

  const current: "light" | "dark" = dark ? "dark" : "light";

  const handleSelect = (id: "light" | "dark") => {
    if (id === current) return;
    onToggleDark();
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionHead title="Appearance" desc="Customize the look and feel of your workspace." />

      {/* Theme label */}
      <p className="ts-section-label mb-4">Theme</p>

      {/* Theme cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>

        {/* Light card */}
        <button
          type="button"
          onClick={() => handleSelect("light")}
          style={{
            flex: 1,
            maxWidth: 200,
            display: "flex",
            flexDirection: "column",
            gap: 0,
            borderRadius: "1rem",
            border: current === "light" ? "2px solid #7c3aed" : "1.5px solid var(--border)",
            background: current === "light" ? "#faf5ff" : "var(--bg-card)",
            cursor: "pointer",
            overflow: "hidden",
            transition: "all .18s",
            boxShadow: current === "light" ? "0 0 0 3px #ede9fe" : "none",
          }}
        >
          {/* Preview mockup */}
          <div style={{
            height: 90,
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Fake topbar */}
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 28, height: 7, borderRadius: 4, background: "#e2e8f0" }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#ddd6fe" }} />
            </div>
            {/* Fake content rows */}
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 40, height: 50, borderRadius: 6, background: "#ede9fe" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
                <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0", width: "80%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#e2e8f0", width: "60%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#e2e8f0", width: "70%" }} />
              </div>
            </div>
          </div>
          {/* Label row */}
          <div style={{
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: current === "light" ? "#7c3aed" : "var(--text-muted)" }}>
                <Icon d={icons.sun} size={15} sw={1.8} />
              </span>
              <span style={{
                fontSize: ".8rem",
                fontWeight: current === "light" ? 700 : 500,
                color: current === "light" ? "#7c3aed" : "var(--text-h)",
              }}>Light</span>
            </div>
            {current === "light" && (
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                background: "#7c3aed",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon d={icons.check} size={9} stroke="white" sw={3} />
              </div>
            )}
          </div>
        </button>

        {/* Dark card */}
        <button
          type="button"
          onClick={() => handleSelect("dark")}
          style={{
            flex: 1,
            maxWidth: 200,
            display: "flex",
            flexDirection: "column",
            gap: 0,
            borderRadius: "1rem",
            border: current === "dark" ? "2px solid #7c3aed" : "1.5px solid var(--border)",
            background: current === "dark" ? "#faf5ff" : "var(--bg-card)",
            cursor: "pointer",
            overflow: "hidden",
            transition: "all .18s",
            boxShadow: current === "dark" ? "0 0 0 3px #ede9fe" : "none",
          }}
        >
          {/* Preview mockup — dark */}
          <div style={{
            height: 90,
            background: "#1e1b2e",
            borderBottom: "1px solid #2d2a40",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            overflow: "hidden",
          }}>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 28, height: 7, borderRadius: 4, background: "#2d2a40" }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#4c1d95" }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 40, height: 50, borderRadius: 6, background: "#3b1f6b" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
                <div style={{ height: 6, borderRadius: 3, background: "#2d2a40", width: "80%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#2d2a40", width: "60%" }} />
                <div style={{ height: 5, borderRadius: 3, background: "#2d2a40", width: "70%" }} />
              </div>
            </div>
          </div>
          {/* Label row */}
          <div style={{
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: current === "dark" ? "#7c3aed" : "var(--text-muted)" }}>
                <Icon d={icons.moon} size={15} sw={1.8} />
              </span>
              <span style={{
                fontSize: ".8rem",
                fontWeight: current === "dark" ? 700 : 500,
                color: current === "dark" ? "#7c3aed" : "var(--text-h)",
              }}>Dark</span>
            </div>
            {current === "dark" && (
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                background: "#7c3aed",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon d={icons.check} size={9} stroke="white" sw={3} />
              </div>
            )}
          </div>
        </button>

      </div>

      {/* Active badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 999,
        background: "#ede9fe",
        marginBottom: "1.5rem",
      }}>
        <span style={{ color: "#7c3aed" }}>
          <Icon d={current === "dark" ? icons.moon : icons.sun} size={12} sw={2} />
        </span>
        <span style={{ fontSize: ".72rem", fontWeight: 600, color: "#7c3aed", letterSpacing: "0.02em" }}>
          {current === "dark" ? "Dark mode active" : "Light mode active"}
        </span>
      </div>

      <div className="flex justify-end">
        <SaveBtn onClick={save} saved={saved} />
      </div>
    </div>
  );
};

// ── Root ───────────────────────────────────────────────────────────────
type TabId = "personal"|"password"|"appearance"|"currency";
const tabs: TabItem[] = [
  {id:"personal",   label:"Personal",   icon:icons.user},
  {id:"password",   label:"Password",   icon:icons.lock},
  {id:"appearance", label:"Appearance", icon:icons.palette},
  {id:"currency",   label:"Currency",   icon:icons.currency},
];

// Accept dark/onToggleDark from the parent (same state used by TopNav)
interface SettingsProps {
  dark: boolean;
  onToggleDark: () => void;
}

const Settings: FC<SettingsProps> = ({ dark, onToggleDark }) => {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const panelMap: Record<TabId, ReactNode> = {
    personal:   <PersonalPanel />,
    password:   <PasswordPanel />,
    appearance: <AppearancePanel dark={dark} onToggleDark={onToggleDark} />,
    currency:   <CurrencyPanel />,
  };

  return (
    <div className="px-6 py-6 h-full overflow-y-auto">
      <div className="mb-5">
        <h1 className="ts-page-title">Settings</h1>
        <p className="ts-page-subtitle">Manage your account, preferences and agency configuration.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b mb-6" style={{borderColor:"var(--border)"}}>
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id as TabId)}
            className={`ts-settings-tab${activeTab===t.id?" ts-active":""}`}>
            <span className={activeTab===t.id?"text-violet-600":"ts-faint"}>
              <Icon d={t.icon} size={15} sw={1.8} />
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="ts-card" style={{padding:"1.5rem", minHeight:460}}>
        <div key={activeTab} className="ts-settings-panel">{panelMap[activeTab]}</div>
      </div>
    </div>
  );
};

export default Settings;