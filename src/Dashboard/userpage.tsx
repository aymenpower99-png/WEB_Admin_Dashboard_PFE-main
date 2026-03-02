import { useEffect, useState, useMemo } from "react";
import { USERS, STATUS_STYLES, type UserStatus } from "./constants";

interface UsersPageProps {
  dark: boolean;
  onSelectUser?: (name: string) => void;
}

const ROLE_STYLES: Record<string, string> = {
  Rider:  "bg-blue-100 text-blue-700",
  Driver: "bg-violet-100 text-violet-700",
  Admin:  "bg-gray-200 text-gray-700",
};

type User = {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  trips: number;
};

type FilterTab = "All" | "Riders" | "Drivers" | "Admins";

const ROLE_MAP: Record<FilterTab, string | null> = {
  All:     null,
  Riders:  "Rider",
  Drivers: "Driver",
  Admins:  "Admin",
};

const INITIAL_USERS: User[] = [
  ...USERS,
  { name: "Aiko Tanaka", email: "aiko.t@example.com",  role: "Driver", status: "active"  as UserStatus, trips: 67 },
  { name: "Lucas Morel", email: "l.morel@example.com",  role: "Rider",  status: "active"  as UserStatus, trips: 14 },
  { name: "Priya Nair",  email: "priya.n@example.com",  role: "Driver", status: "pending" as UserStatus, trips: 2  },
];

// ─── Add User Modal ────────────────────────────────────────────────────────────

interface AddUserModalProps {
  dark: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
}

function AddUserModal({ dark, onClose, onAdd }: AddUserModalProps) {
  const [form, setForm] = useState({ name: "", email: "", role: "Rider", status: "active" as UserStatus });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bg       = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const heading  = dark ? "text-gray-100"               : "text-gray-900";
  const muted    = dark ? "text-gray-400"               : "text-gray-500";
  const labelCls = dark ? "text-gray-400"               : "text-gray-600";
  const divider  = dark ? "border-gray-800"             : "border-gray-200";
  const inputCls = dark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-violet-500"
    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400";

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({ ...form, trips: 0 });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${bg}`}
        style={{ animation: "modalIn 0.2s ease" }}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${divider}`}>
          <div>
            <h2 className={`text-base font-semibold ${heading}`}>Add new user</h2>
            <p className={`text-xs mt-0.5 ${muted}`}>Fill in the details to create a user account.</p>
          </div>
          <button onClick={onClose}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors ${dark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
            ✕
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name || "new"}`}
              alt="preview" className="w-12 h-12 rounded-full bg-violet-100" />
            <div>
              <p className={`text-sm font-medium ${heading}`}>{form.name || "Full name"}</p>
              <p className={`text-xs ${muted}`}>{form.email || "email@example.com"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={`text-xs font-medium ${labelCls}`}>Full name</label>
            <input className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputCls} ${errors.name ? "border-red-400" : ""}`}
              placeholder="Jane Doe" value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }} />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={`text-xs font-medium ${labelCls}`}>Email address</label>
            <input className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${inputCls} ${errors.email ? "border-red-400" : ""}`}
              placeholder="jane@example.com" type="email" value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-medium ${labelCls}`}>Role</label>
              <select className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors cursor-pointer ${inputCls}`}
                value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>Rider</option><option>Driver</option><option>Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-xs font-medium ${labelCls}`}>Status</label>
              <select className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors cursor-pointer ${inputCls}`}
                value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-2 px-6 py-4 border-t ${divider}`}>
          <button onClick={onClose}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${dark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-4 py-2 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
            Create user
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function UsersPage({ dark, onSelectUser }: UsersPageProps) {
  const [users, setUsers]           = useState<User[]>(INITIAL_USERS);
  const [showModal, setShowModal]   = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [search, setSearch]         = useState("");

  // Filtered list derived from state — updates instantly on tab or search change
  const filteredUsers = useMemo(() => {
    const roleFilter = ROLE_MAP[activeFilter];
    return users.filter((u) => {
      const matchesRole   = roleFilter ? u.role === roleFilter : true;
      const matchesSearch = search.trim() === ""
        ? true
        : u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, activeFilter, search]);

  const card    = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const heading = dark ? "text-gray-100"               : "text-gray-900";
  const muted   = dark ? "text-gray-400"               : "text-gray-500";
  const divider = dark ? "border-gray-800"             : "border-gray-200";
  const chip    = dark ? "bg-gray-800 text-gray-300"   : "bg-gray-100 text-gray-500";
  const rowHover = dark ? "hover:bg-gray-800"          : "hover:bg-violet-50";

  const filterInactive = dark
    ? "text-gray-400 hover:bg-gray-800"
    : "text-gray-500 hover:bg-gray-100";

  const searchBar = dark
    ? "bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-600"
    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400";

  return (
    <div className="flex flex-col gap-5">
      {showModal && (
        <AddUserModal
          dark={dark}
          onClose={() => setShowModal(false)}
          onAdd={(user) => setUsers((prev) => [user, ...prev])}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-semibold ${heading}`}>Users</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${chip}`}>
              {users.length} total
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${muted}`}>Manage riders, drivers and admins.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center overflow-hidden
                     w-10 hover:w-36 focus:w-36
                     transition-all duration-300 ease-in-out
                     px-3 py-2 rounded-full text-white text-sm font-medium
                     bg-gradient-to-r from-purple-500 to-purple-700"
        >
          <span className="text-lg leading-none">＋</span>
          <span className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
            Add User
          </span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total users", value: users.length,                                          sub: "+12 this week"   },
          { label: "Active",      value: users.filter((u) => u.status === "active").length,     sub: `${Math.round((users.filter((u) => u.status === "active").length / users.length) * 100)}% of total` },
          { label: "Pending",     value: users.filter((u) => u.status === "pending").length,    sub: "Awaiting review" },
          { label: "Blocked",     value: users.filter((u) => u.status === "blocked").length,    sub: "Requires action" },
        ].map((s) => (
          <div key={s.label} className={`rounded-3xl border p-5 flex flex-col gap-1 shadow-sm transition-all duration-300 ${card}`}>
            <span className={`text-xs ${muted}`}>{s.label}</span>
            <span className={`text-xl font-semibold ${heading}`}>{s.value}</span>
            <span className={`text-xs ${muted}`}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className={`rounded-3xl border shadow-sm transition-all duration-300 ${card}`}>
        {/* Toolbar */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${divider}`}>
          {/* Search — now functional */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs w-48 ${searchBar}`}>
            <span>🔍</span>
            <input
              className="bg-transparent outline-none w-full placeholder-inherit"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter tabs — now functional */}
          <div className="flex items-center gap-1.5">
            {(["All", "Riders", "Drivers", "Admins"] as FilterTab[]).map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    isActive ? "text-white" : filterInactive
                  }`}
                  style={isActive ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)" } : {}}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column headers */}
        <div
          className={`grid text-xs font-medium px-4 py-2 border-b ${muted} ${divider}`}
          style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 0.7fr 0.5fr" }}
        >
          <span>Name</span><span>Email</span><span>Role</span>
          <span>Status</span><span>Trips</span><span></span>
        </div>

        {/* Rows */}
        {filteredUsers.length === 0 ? (
          <div className={`text-xs text-center py-10 ${muted}`}>
            No {activeFilter === "All" ? "users" : activeFilter.toLowerCase()} found
            {search ? ` matching "${search}"` : ""}.
          </div>
        ) : (
          filteredUsers.map((user, i) => (
            <div
              key={`${user.name}-${i}`}
              onClick={() => onSelectUser?.(user.name)}
              className={`grid px-4 py-3 text-xs items-center cursor-pointer transition-colors ${rowHover} ${i > 0 ? `border-t ${divider}` : ""}`}
              style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 0.7fr 0.5fr" }}
            >
              <div className="flex items-center gap-2">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name} className="w-6 h-6 rounded-full bg-violet-100 shrink-0" />
                <span className={`font-medium ${heading}`}>{user.name}</span>
              </div>
              <span className={muted}>{user.email}</span>
              <span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                  {user.role}
                </span>
              </span>
              <span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[user.status]}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </span>
              <span className={`font-medium ${heading}`}>{user.trips}</span>
              <button className="text-violet-500 hover:text-violet-400 text-xs">View →</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}