import { useState } from "react";

type UserStatus = "active" | "inactive" | "suspended";
type AllowedProduct = "Airport transfers" | "City rides" | "Long distance";

interface FormData {
  agencyName: string;
  agencyCode: string;
  mainContactName: string;
  contactEmail: string;
  phoneNumber: string;
  countryCity: string;
  userRole: string;
  status: UserStatus;
  allowedProducts: AllowedProduct[];
  maxBookingLimit: string;
  sendInviteEmail: boolean;
}

interface CreateAgencyUserProps {
  dark: boolean;
  prefillName?: string;
  onClose: () => void;
}

const PRODUCTS: AllowedProduct[] = ["Airport transfers", "City rides", "Long distance"];
const ROLES = ["Agency admin", "Agent", "Viewer"];
const COUNTRIES = ["France — Paris", "UK — London", "Germany — Berlin", "Spain — Madrid"];
const STATUSES: { label: string; value: UserStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

function FieldLabel({ children, required, hint, dark }: { children: React.ReactNode; required?: boolean; hint?: string; dark?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className={`text-xs font-medium ${dark ? "text-gray-300" : "text-gray-800"}`}>
        {children}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );
}

function TextInput({ label, required, hint, dark, ...rest }: { label: string; required?: boolean; hint?: string; dark?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const cls = `w-full px-3 py-2 rounded-lg border text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400 transition ${
    dark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
  }`;
  return (
    <div>
      <FieldLabel required={required} hint={hint} dark={dark}>{label}</FieldLabel>
      <input className={cls} {...rest} />
    </div>
  );
}

function SelectInput({ label, required, hint, placeholder, options, dark, ...rest }: { label: string; required?: boolean; hint?: string; placeholder?: string; options: string[]; dark?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const cls = `w-full px-3 py-2 rounded-lg border text-sm outline-none appearance-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400 transition pr-8 ${
    dark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
  }`;
  return (
    <div>
      <FieldLabel required={required} hint={hint} dark={dark}>{label}</FieldLabel>
      <div className="relative">
        <select className={cls} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-emerald-500" : "bg-gray-300"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function CreateAgencyUser({ dark, prefillName, onClose }: CreateAgencyUserProps) {
  const [form, setForm] = useState<FormData>({
    agencyName: "",
    agencyCode: "",
    mainContactName: prefillName ?? "",
    contactEmail: "",
    phoneNumber: "",
    countryCity: "",
    userRole: "",
    status: "active",
    allowedProducts: ["Airport transfers", "City rides", "Long distance"],
    maxBookingLimit: "Unlimited",
    sendInviteEmail: true,
  });

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleProduct = (p: AllowedProduct) =>
    set("allowedProducts", form.allowedProducts.includes(p)
      ? form.allowedProducts.filter((x) => x !== p)
      : [...form.allowedProducts, p]);

  const card = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const divider = dark ? "border-gray-800" : "border-gray-100";

  return (
    <div className={`flex flex-col h-full ${dark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className={`px-5 pt-5 pb-4 flex items-start justify-between border-b ${divider}`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Create agency user</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
              Agency management
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Add a new agency account for managing bookings and payments.
          </p>
        </div>
        <button onClick={onClose}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors ${dark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
          ✕
        </button>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <form id="agency-form" onSubmit={(e) => { e.preventDefault(); console.log(form); }}
          className="flex flex-col gap-4">

          {/* Agency details */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <h3 className="text-sm font-semibold mb-0.5">Agency details</h3>
            <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>Basic information about the agency and main contact.</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <TextInput dark={dark} label="Agency name" required placeholder="Ex: CityRide Travel Agency"
                value={form.agencyName} onChange={(e) => set("agencyName", e.target.value)} />
              <TextInput dark={dark} label="Agency code" hint="Optional" placeholder="Ex: AG-CR-045"
                value={form.agencyCode} onChange={(e) => set("agencyCode", e.target.value)} />
              <TextInput dark={dark} label="Main contact name" required placeholder="Ex: Sarah Lee"
                value={form.mainContactName} onChange={(e) => set("mainContactName", e.target.value)} />
              <TextInput dark={dark} label="Contact email" required type="email" placeholder="email@agency.com"
                value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
              <TextInput dark={dark} label="Phone number" type="tel" placeholder="+33 6 12 34 56 78"
                value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />
              <SelectInput dark={dark} label="Country / City" placeholder="Select country and city"
                options={COUNTRIES} value={form.countryCity}
                onChange={(e) => set("countryCity", e.target.value)} />
            </div>
          </div>

          {/* Access & role */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <h3 className="text-sm font-semibold mb-0.5">Access &amp; role</h3>
            <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>Define what this agency user can see and manage.</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <SelectInput dark={dark} label="User role" required placeholder="Select role"
                  options={ROLES} value={form.userRole}
                  onChange={(e) => set("userRole", e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Ex: Agency admin, Agent, Viewer...</p>
              </div>
              <SelectInput dark={dark} label="Status"
                options={STATUSES.map((s) => s.label)}
                value={STATUSES.find((s) => s.value === form.status)?.label ?? "Active"}
                onChange={(e) => {
                  const found = STATUSES.find((s) => s.label === e.target.value);
                  if (found) set("status", found.value);
                }} />

              <div>
                <FieldLabel hint="Multi-select" dark={dark}>Allowed products</FieldLabel>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {PRODUCTS.map((p) => {
                    const on = form.allowedProducts.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => toggleProduct(p)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${on
                          ? "bg-violet-100 border-violet-300 text-violet-700"
                          : dark ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                          : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"}`}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <TextInput dark={dark} label="Max booking limit / day" placeholder="Unlimited"
                value={form.maxBookingLimit} onChange={(e) => set("maxBookingLimit", e.target.value)} />

              <div className={`col-span-2 flex items-center justify-between pt-3 border-t ${divider}`}>
                <div>
                  <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>Send invite email</p>
                  <p className="text-xs text-gray-400 mt-0.5">The new agency user will receive a link to set a password.</p>
                </div>
                <Toggle checked={form.sendInviteEmail} onChange={(v) => set("sendInviteEmail", v)} />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky footer */}
      <div className={`px-5 py-3 border-t flex items-center justify-between ${divider} ${dark ? "bg-gray-900" : "bg-white"}`}>
        <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
          Fields marked with <span className="text-red-500">*</span> are required.
        </span>
        <div className="flex items-center gap-2">
          <button onClick={onClose}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${dark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            Cancel
          </button>
          <button type="submit" form="agency-form"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
            💾 Create agency user
          </button>
        </div>
      </div>
    </div>
  );
}