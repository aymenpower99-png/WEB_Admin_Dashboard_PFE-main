import { useState } from "react";
import './travelsync-design-system.css'


type UserStatus   = "active"|"inactive"|"suspended";
type AllowedProduct = "Airport transfers"|"City rides"|"Long distance";

interface FormData {
  agencyName: string; agencyCode: string; mainContactName: string;
  contactEmail: string; phoneNumber: string; countryCity: string;
  userRole: string; status: UserStatus;
  allowedProducts: AllowedProduct[]; maxBookingLimit: string;
  sendInviteEmail: boolean;
}

interface CreateAgencyUserProps { dark: boolean; prefillName?: string; onClose: () => void; }

const PRODUCTS: AllowedProduct[] = ["Airport transfers","City rides","Long distance"];
const ROLES    = ["Agency admin","Agent","Viewer"];
const COUNTRIES= ["France — Paris","UK — London","Germany — Berlin","Spain — Madrid"];
const STATUSES: {label:string;value:UserStatus}[] = [
  {label:"Active",value:"active"},{label:"Inactive",value:"inactive"},{label:"Suspended",value:"suspended"},
];

export default function CreateAgencyUser({ dark: _, prefillName, onClose }: CreateAgencyUserProps) {
  const [form, setForm] = useState<FormData>({
    agencyName:"", agencyCode:"", mainContactName:prefillName??"",
    contactEmail:"", phoneNumber:"", countryCity:"",
    userRole:"", status:"active",
    allowedProducts:["Airport transfers","City rides","Long distance"],
    maxBookingLimit:"Unlimited", sendInviteEmail:true,
  });

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm((p) => ({...p,[k]:v}));
  const toggleProduct = (p: AllowedProduct) =>
    set("allowedProducts", form.allowedProducts.includes(p)
      ? form.allowedProducts.filter((x)=>x!==p)
      : [...form.allowedProducts,p]);

  return (
    <div className="ts-shell flex flex-col h-full">
      {/* Header */}
      <div className="ts-modal-header">
        <div>
          <div className="ts-page-title-row">
            <h2 className="ts-page-title text-base font-semibold">Create agency user</h2>
            <span className="ts-pill" style={{background:"#eef2ff",color:"#4f46e5",fontSize:".7rem"}}>Agency management</span>
          </div>
          <p className="ts-page-subtitle">Add a new agency account for managing bookings and payments.</p>
        </div>
        <button className="ts-modal-close" onClick={onClose}>✕</button>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <form id="agency-form" onSubmit={(e)=>{e.preventDefault();console.log(form);}} className="flex flex-col gap-4">

          {/* Agency details */}
          <div className="ts-card" style={{padding:"1rem"}}>
            <h3 className="ts-td-h text-sm font-semibold mb-0.5">Agency details</h3>
            <p className="ts-muted text-xs mb-4">Basic information about the agency and main contact.</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                {label:"Agency name",        key:"agencyName",        required:true,  type:"text", placeholder:"Ex: CityRide Travel Agency"},
                {label:"Agency code",        key:"agencyCode",        required:false, type:"text", placeholder:"Ex: AG-CR-045"},
                {label:"Main contact name",  key:"mainContactName",   required:true,  type:"text", placeholder:"Ex: Sarah Lee"},
                {label:"Contact email",      key:"contactEmail",      required:true,  type:"email",placeholder:"email@agency.com"},
                {label:"Phone number",       key:"phoneNumber",       required:false, type:"tel",  placeholder:"+33 6 12 34 56 78"},
              ].map(({label,key,required,type,placeholder}) => (
                <div key={key}>
                  <label className="ts-label">{label}{required&&<span className="text-red-500 ml-0.5">*</span>}</label>
                  <input type={type} className="ts-input" placeholder={placeholder}
                    value={form[key as keyof FormData] as string}
                    onChange={(e) => set(key as keyof FormData, e.target.value as any)} />
                </div>
              ))}
              <div>
                <label className="ts-label">Country / City</label>
                <select className="ts-input cursor-pointer" value={form.countryCity} onChange={(e) => set("countryCity",e.target.value)}>
                  <option value="">Select country and city</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Access & role */}
          <div className="ts-card" style={{padding:"1rem"}}>
            <h3 className="ts-td-h text-sm font-semibold mb-0.5">Access &amp; role</h3>
            <p className="ts-muted text-xs mb-4">Define what this agency user can see and manage.</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="ts-label">User role <span className="text-red-500">*</span></label>
                <select className="ts-input cursor-pointer" value={form.userRole} onChange={(e) => set("userRole",e.target.value)}>
                  <option value="">Select role</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                <p className="ts-faint text-xs mt-1">Ex: Agency admin, Agent, Viewer...</p>
              </div>
              <div>
                <label className="ts-label">Status</label>
                <select className="ts-input cursor-pointer"
                  value={STATUSES.find((s)=>s.value===form.status)?.label??"Active"}
                  onChange={(e) => { const found=STATUSES.find((s)=>s.label===e.target.value); if(found)set("status",found.value); }}>
                  {STATUSES.map((s) => <option key={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className="ts-label">Allowed products <span className="ts-faint">(multi-select)</span></label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {PRODUCTS.map((p) => {
                    const on = form.allowedProducts.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => toggleProduct(p)}
                        className={`ts-filter-chip border${on?" ts-active":""}`}
                        style={!on?{borderColor:"var(--border)"}:{border:"none"}}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="ts-label">Max booking limit / day</label>
                <input className="ts-input" placeholder="Unlimited" value={form.maxBookingLimit}
                  onChange={(e) => set("maxBookingLimit",e.target.value)} />
              </div>

              <div className="col-span-2 flex items-center justify-between pt-3 border-t" style={{borderColor:"var(--border-inner)"}}>
                <div>
                  <p className="ts-td-h text-sm font-medium">Send invite email</p>
                  <p className="ts-faint text-xs mt-0.5">The new agency user will receive a link to set a password.</p>
                </div>
                <button type="button" onClick={() => set("sendInviteEmail",!form.sendInviteEmail)}
                  className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${form.sendInviteEmail?"bg-emerald-500":"bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${form.sendInviteEmail?"translate-x-4":"translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="ts-modal-footer justify-between px-5 py-3">
        <span className="ts-muted text-xs">Fields marked <span className="text-red-500">*</span> are required.</span>
        <div className="flex items-center gap-2">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" form="agency-form" className="ts-btn-primary">💾 Create agency user</button>
        </div>
      </div>
    </div>
  );
}