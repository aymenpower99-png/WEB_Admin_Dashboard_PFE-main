import { useState, type ReactNode, type FC } from "react";
import './travelsync-design-system.css'
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
  user:     ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  lock:     ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  bell:     ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  currency: ["M12 1v22","M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"],
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  eyeOff:   ["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94","M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19","M1 1l22 22"],
  check:    "M20 6L9 17l-5-5",
  camera:   ["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z","M12 17a4 4 0 100-8 4 4 0 000 8z"],
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

const Divider: FC = () => <hr className="ts-divider" />;

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
      <div className="flex items-center gap-5 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-200">SL</div>
          <button type="button" className="ts-modal-close absolute -bottom-1 -right-1 w-7 h-7 border-2 bg-white border-gray-100 shadow hover:text-violet-600">
            <Icon d={icons.camera} size={13} sw={2} />
          </button>
        </div>
        <div>
          <p className="ts-td-h text-sm font-medium">Profile photo</p>
          <p className="ts-faint text-xs mt-0.5">JPG or PNG. Max 2MB.</p>
          <button type="button" className="mt-2 text-xs text-violet-600 font-medium hover:underline">Upload new photo</button>
        </div>
      </div>
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

const NotificationsPanel: FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    newBooking:true, tripReminder:true, paymentReceived:true, paymentFailed:true,
    agentActivity:false, systemAlerts:true, weeklyReport:false, marketingEmails:false,
    smsAlerts:true, pushNotifs:false,
  });
  type K = keyof typeof settings;
  const set = (k: K) => (v: boolean) => setSettings((s) => ({...s,[k]:v}));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const groups: { label: string; items: { key: K; label: string; desc: string }[] }[] = [
    { label:"Bookings & Trips", items:[
      {key:"newBooking",   label:"New booking",   desc:"When a new trip is created or assigned to you"},
      {key:"tripReminder", label:"Trip reminders", desc:"24h before departure or check-in"},
    ]},
    { label:"Payments", items:[
      {key:"paymentReceived", label:"Payment received", desc:"When a client payment is confirmed"},
      {key:"paymentFailed",   label:"Payment failed",   desc:"When a payment attempt fails"},
    ]},
    { label:"System", items:[
      {key:"agentActivity",   label:"Agent activity",    desc:"Actions taken by team members"},
      {key:"systemAlerts",    label:"System alerts",     desc:"Downtime, updates, or critical notices"},
      {key:"weeklyReport",    label:"Weekly summary",    desc:"Digest of your week every Monday"},
      {key:"marketingEmails", label:"Product updates",   desc:"New features and announcements"},
    ]},
    { label:"Delivery channels", items:[
      {key:"smsAlerts",  label:"SMS alerts",          desc:"Send critical alerts via text message"},
      {key:"pushNotifs", label:"Push notifications",  desc:"Browser and mobile push"},
    ]},
  ];

  return (
    <div>
      <SectionHead title="Notification Preferences" desc="Choose what you want to be notified about and how." />
      {groups.map((g) => (
        <div key={g.label} className="mb-5">
          <p className="ts-section-label mb-2">{g.label}</p>
          <div className="ts-card-inner overflow-hidden divide-y" style={{borderColor:"var(--border-inner)"}}>
            {g.items.map(({key,label,desc}) => (
              <div key={key} className="flex items-center justify-between p-4 ts-tr-hover">
                <div>
                  <p className="ts-td-h text-sm font-medium">{label}</p>
                  <p className="ts-faint text-xs mt-0.5">{desc}</p>
                </div>
                <Toggle checked={settings[key]} onChange={set(key)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-2 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

// ── Root ───────────────────────────────────────────────────────────────
type TabId = "personal"|"password"|"notifications"|"currency";
const tabs: TabItem[] = [
  {id:"personal",      label:"Personal",      icon:icons.user},
  {id:"password",      label:"Password",      icon:icons.lock},
  {id:"notifications", label:"Notifications", icon:icons.bell},
  {id:"currency",      label:"Currency",      icon:icons.currency},
];

const TravelSyncSettings: FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const panelMap: Record<TabId,ReactNode> = {
    personal:      <PersonalPanel />,
    password:      <PasswordPanel />,
    notifications: <NotificationsPanel />,
    currency:      <CurrencyPanel />,
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

export default TravelSyncSettings;