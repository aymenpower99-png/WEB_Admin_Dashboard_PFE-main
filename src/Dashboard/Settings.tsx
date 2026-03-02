import { useState, type ReactNode, type FC } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface IconProps {
  d: string | string[];
  size?: number;
  stroke?: string;
  sw?: number;
}

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  hint?: string;
  rightEl?: ReactNode;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
}

interface SectionHeadProps {
  title: string;
  desc?: string;
}

interface SaveBtnProps {
  onClick: () => void;
  saved: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: string | string[];
}

interface TabItem {
  id: string;
  label: string;
  icon: string | string[];
}


// ── Icons ──────────────────────────────────────────────────────────────────
const Icon: FC<IconProps> = ({ d, size = 18, stroke = "currentColor", sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p: string, i: number) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons: Record<string, string | string[]> = {
  dashboard: ["M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"],
  users: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75", "M9 7a4 4 0 100 8 4 4 0 000-8z"],
  trips: ["M3 17l2-10 5 4 4-8 5 14", "M3 21h18"],
  payments: ["M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z", "M1 10h22"],
  help: ["M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3", "M12 17h.01"],
  settings: ["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
  security: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  lock: ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z", "M7 11V7a5 5 0 0110 0v4"],
  bell: ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
  currency: ["M12 1v22", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
  eyeOff: ["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94", "M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19", "M1 1l22 22"],
  check: "M20 6L9 17l-5-5",
  camera: ["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z", "M12 17a4 4 0 100-8 4 4 0 000 8z"],
  logout: ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"],
};

// ── Toggle ─────────────────────────────────────────────────────────────────
const Toggle: FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-violet-600" : "bg-gray-200"}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${checked ? "left-5" : "left-0.5"}`} />
  </button>
);

// ── Input ──────────────────────────────────────────────────────────────────
const Input: FC<InputProps> = ({ label, type = "text", value, onChange, placeholder, hint, rightEl }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
      />
      {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
    {hint && <p className="text-xs text-red-400">{hint}</p>}
  </div>
);

// ── Select ─────────────────────────────────────────────────────────────────
const Select: FC<SelectProps> = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all appearance-none cursor-pointer"
    >
      {options.map((o: SelectOption) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

// ── Section header ─────────────────────────────────────────────────────────
const SectionHead: FC<SectionHeadProps> = ({ title, desc }) => (
  <div className="mb-5">
    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
  </div>
);

const Divider: FC = () => <div className="border-t border-gray-100 my-6" />;

// ── Save button ────────────────────────────────────────────────────────────
const SaveBtn: FC<SaveBtnProps> = ({ onClick, saved }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${saved ? "bg-green-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}
  >
    {saved ? <><Icon d={icons.check} size={15} sw={2.5} /> Saved!</> : "Save changes"}
  </button>
);

// ══════════════════════════════════════════════════════════════════════
// PANELS
// ══════════════════════════════════════════════════════════════════════

interface PersonalForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

const PersonalPanel: FC = () => {
  const [form, setForm] = useState<PersonalForm>({
    firstName: "Sarah", lastName: "Lee",
    email: "sarah.lee@travelsync.com", phone: "+1 (555) 234-5678",
    role: "Agency Manager",
  });
  const [saved, setSaved] = useState<boolean>(false);
  const set = (k: keyof PersonalForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionHead title="Personal Information" desc="Update your name, contact details, and profile info." />
      <div className="flex items-center gap-5 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-200">SL</div>
          <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow text-gray-600 hover:text-violet-600 transition-colors">
            <Icon d={icons.camera} size={13} sw={2} />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Profile photo</p>
          <p className="text-xs text-gray-400 mt-0.5">JPG or PNG. Max 2MB.</p>
          <button type="button" className="mt-2 text-xs text-violet-600 font-medium hover:underline">Upload new photo</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="First name" value={form.firstName} onChange={set("firstName")} />
        <Input label="Last name" value={form.lastName} onChange={set("lastName")} />
        <Input label="Email address" type="email" value={form.email} onChange={set("email")} />
        <Input label="Phone number" value={form.phone} onChange={set("phone")} />
        <div className="col-span-2">
          <Input label="Job title / Role" value={form.role} onChange={set("role")} />
        </div>

      </div>
      <div className="mt-6 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

// ── Password ───────────────────────────────────────────────────────────────
interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

interface ShowState {
  current: boolean;
  next: boolean;
  confirm: boolean;
}

interface PasswordRule {
  label: string;
  test: (p: string) => boolean;
}

const PasswordPanel: FC = () => {
  const [form, setForm] = useState<PasswordForm>({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState<ShowState>({ current: false, next: false, confirm: false });
  const [saved, setSaved] = useState<boolean>(false);
  const set = (k: keyof PasswordForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const tog = (k: keyof ShowState) => () => setShow(s => ({ ...s, [k]: !s[k] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const rules: PasswordRule[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "At least one uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "At least one lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
    { label: "At least one number (0–9)", test: (p) => /[0-9]/.test(p) },
    { label: "At least one special character (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const passedCount: number = rules.filter(r => r.test(form.next)).length;
  const strengthColors: string[] = ["bg-gray-200", "bg-red-400", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"];
  const strengthLabels: string[] = ["", "Very weak", "Weak", "Fair", "Good", "Strong"];
  const strengthTextColors: string[] = ["", "text-red-500", "text-red-500", "text-amber-500", "text-blue-500", "text-green-600"];

  const eyeBtn = (k: keyof ShowState): ReactNode => (
    <button type="button" onClick={tog(k)} className="text-gray-400 hover:text-gray-600 transition-colors">
      <Icon d={show[k] ? icons.eyeOff : icons.eye} size={16} sw={1.8} />
    </button>
  );

  return (
    <div>
      <SectionHead title="Change Password" desc="Choose a strong password to keep your account secure." />
      <div className="space-y-4 max-w-md">
        <Input
          label="Current password"
          type={show.current ? "text" : "password"}
          value={form.current}
          onChange={set("current")}
          placeholder="Enter current password"
          rightEl={eyeBtn("current")}
        />
        <div className="space-y-2">
          <Input
            label="New password"
            type={show.next ? "text" : "password"}
            value={form.next}
            onChange={set("next")}
            placeholder="Create a strong password"
            rightEl={eyeBtn("next")}
          />
          {/* Strength bar — always visible once user starts typing */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4, 5].map((i: number) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${form.next && i <= passedCount ? strengthColors[passedCount] : "bg-gray-200"}`} />
              ))}
            </div>
            <span className={`text-xs font-medium w-16 text-right ${form.next ? strengthTextColors[passedCount] : "text-gray-300"}`}>
              {form.next ? strengthLabels[passedCount] : ""}
            </span>
          </div>
          {/* Requirements checklist — always shown */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-1.5">
            {rules.map((r: PasswordRule) => {
              const ok: boolean = form.next ? r.test(form.next) : false;
              return (
                <div key={r.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${ok ? "bg-green-500" : "bg-gray-200"}`}>
                    {ok && <Icon d={icons.check} size={10} stroke="white" sw={3} />}
                  </div>
                  <span className={`text-xs transition-colors duration-200 ${ok ? "text-green-700 font-medium" : "text-gray-400"}`}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Input
          label="Confirm new password"
          type={show.confirm ? "text" : "password"}
          value={form.confirm}
          onChange={set("confirm")}
          placeholder="Repeat new password"
          rightEl={eyeBtn("confirm")}
          hint={form.confirm && form.next !== form.confirm ? "Passwords don't match" : undefined}
        />
      </div>
      <div className="mt-6 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

// ── Currency ───────────────────────────────────────────────────────────────
const CurrencyPanel: FC = () => {
  const [saved, setSaved] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("USD");
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const currencies: SelectOption[] = [
    { value: "USD", label: "USD — US Dollar ($)" },
    { value: "EUR", label: "EUR — Euro (€)" },
    { value: "GBP", label: "GBP — British Pound (£)" },
    { value: "TND", label: "TND — Tunisian Dinar (د.ت)" },
    { value: "JPY", label: "JPY — Japanese Yen (¥)" },
    { value: "CAD", label: "CAD — Canadian Dollar (CA$)" },
    { value: "AED", label: "AED — UAE Dirham (د.إ)" },
    { value: "SAR", label: "SAR — Saudi Riyal (﷼)" },
  ];

  const symbols: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", TND: "د.ت", JPY: "¥", CAD: "CA$", AED: "د.إ", SAR: "﷼",
  };
  const preview: string = `${symbols[currency] ?? ""}1,234.56`;

  return (
    <div>
      <SectionHead title="Currency" desc="Set the default currency used across your agency." />
      <div className="mb-6 p-4 rounded-xl bg-violet-50 border border-violet-100 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0">
          <Icon d={icons.currency} size={18} sw={2} />
        </div>
        <div>
          <p className="text-xs text-violet-600 font-medium">Preview</p>
          <p className="text-2xl font-bold text-violet-700" style={{ fontFamily: "Georgia, serif" }}>{preview}</p>
          <p className="text-xs text-violet-500 mt-0.5">Sample amount in your selected currency</p>
        </div>
      </div>
      <div className="max-w-xs">
        <Select label="Default currency" value={currency} onChange={setCurrency} options={currencies} />
      </div>
      <div className="mt-6 flex justify-end"><SaveBtn onClick={save} saved={saved} /></div>
    </div>
  );
};

// ── Notifications ──────────────────────────────────────────────────────────
interface NotifSettings {
  newBooking: boolean;
  tripReminder: boolean;
  paymentReceived: boolean;
  paymentFailed: boolean;
  agentActivity: boolean;
  systemAlerts: boolean;
  weeklyReport: boolean;
  marketingEmails: boolean;
  smsAlerts: boolean;
  pushNotifs: boolean;
}

interface NotifItem {
  key: keyof NotifSettings;
  label: string;
  desc: string;
}

interface NotifGroup {
  label: string;
  items: NotifItem[];
}

const NotificationsPanel: FC = () => {
  const [saved, setSaved] = useState<boolean>(false);
  const [settings, setSettings] = useState<NotifSettings>({
    newBooking: true, tripReminder: true, paymentReceived: true, paymentFailed: true,
    agentActivity: false, systemAlerts: true, weeklyReport: false, marketingEmails: false,
    smsAlerts: true, pushNotifs: false,
  });
  const set = (k: keyof NotifSettings) => (v: boolean) => setSettings(s => ({ ...s, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const groups: NotifGroup[] = [
    {
      label: "Bookings & Trips", items: [
        { key: "newBooking", label: "New booking", desc: "When a new trip is created or assigned to you" },
        { key: "tripReminder", label: "Trip reminders", desc: "24h before departure or check-in" },
      ],
    },
    {
      label: "Payments", items: [
        { key: "paymentReceived", label: "Payment received", desc: "When a client payment is confirmed" },
        { key: "paymentFailed", label: "Payment failed", desc: "When a payment attempt fails" },
      ],
    },
    {
      label: "System", items: [
        { key: "agentActivity", label: "Agent activity", desc: "Actions taken by team members" },
        { key: "systemAlerts", label: "System alerts", desc: "Downtime, updates, or critical notices" },
        { key: "weeklyReport", label: "Weekly summary", desc: "Digest of your week every Monday" },
        { key: "marketingEmails", label: "Product updates", desc: "New features and announcements" },
      ],
    },
    {
      label: "Delivery channels", items: [
        { key: "smsAlerts", label: "SMS alerts", desc: "Send critical alerts via text message" },
        { key: "pushNotifs", label: "Push notifications", desc: "Browser and mobile push" },
      ],
    },
  ];

  return (
    <div>
      <SectionHead title="Notification Preferences" desc="Choose what you want to be notified about and how." />
      {groups.map((g: NotifGroup) => (
        <div key={g.label} className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{g.label}</p>
          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {g.items.map(({ key, label, desc }: NotifItem) => (
              <div key={key} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
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


const tabs: TabItem[] = [
  { id: "personal", label: "Personal", icon: icons.user },
  { id: "password", label: "Password", icon: icons.lock },
  { id: "notifications", label: "Notifications", icon: icons.bell },
  { id: "currency", label: "Currency", icon: icons.currency },
];

// ══════════════════════════════════════════════════════════════════════
// ROOT — renders INSIDE existing dashboard layout (no sidebar/header)
// ══════════════════════════════════════════════════════════════════════

type TabId = "personal" | "password" | "notifications" | "currency";

const TravelSyncSettings: FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const panelMap: Record<TabId, ReactNode> = {
    personal: <PersonalPanel />,
    password: <PasswordPanel />,
    notifications: <NotificationsPanel />,
    currency: <CurrencyPanel />,
  };

  return (
    <>
      <style>{`
        @keyframes settingsSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .settings-panel { animation: settingsSlideIn .22s ease; }
        .settings-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px !important;
        }
      `}</style>

      <div className="px-6 py-6 h-full overflow-y-auto">
        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your account, preferences and agency configuration.
          </p>
        </div>

        {/* Horizontal top tab bar */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map((t: TabItem) => {
            const active: boolean = t.id === activeTab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as TabId)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative -mb-px ${ 
                  active
                    ? "text-violet-600 border-b-2 border-violet-600"
                    : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent"
                }`}
              >
                <span className={active ? "text-violet-600" : "text-gray-400"}>
                  <Icon d={t.icon} size={15} sw={1.8} />
                </span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[460px]">
          <div key={activeTab} className="settings-panel">
            {panelMap[activeTab]}
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelSyncSettings;