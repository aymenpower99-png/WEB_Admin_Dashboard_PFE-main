import { useState, useMemo } from "react";
import { Users, UserCheck, Clock, ShieldOff } from "lucide-react";
import { USERS, type UserStatus } from "./constants";
import "./travelsync-design-system.css";

interface UsersPageProps {
  dark: boolean;
  onSelectUser?: (name: string) => void;
}

type User = {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  trips: number;
};
type FilterTab = "All" | "Riders" | "Drivers" | "Admins";

const ROLE_MAP: Record<FilterTab, string | null> = {
  All: null, Riders: "Rider", Drivers: "Driver", Admins: "Admin",
};

const INITIAL_USERS: User[] = [
  ...USERS,
  { name: "Aiko Tanaka",  email: "aiko.t@example.com",  role: "Driver", status: "active"  as UserStatus, trips: 67 },
  { name: "Lucas Morel",  email: "l.morel@example.com",  role: "Rider",  status: "active"  as UserStatus, trips: 14 },
  { name: "Priya Nair",   email: "priya.n@example.com",  role: "Driver", status: "pending" as UserStatus, trips: 2  },
];

const STATUS_PILL: Record<UserStatus, string> = {
  active:  "ts-pill ts-pill-active",
  pending: "ts-pill ts-pill-pending",
  blocked: "ts-pill ts-pill-blocked",
};
const ROLE_PILL: Record<string, string> = {
  Rider:  "ts-pill ts-role-rider",
  Driver: "ts-pill ts-role-driver",
  Admin:  "ts-pill ts-role-admin",
};

const ROWS_PER_PAGE = 10;
const ROW_HEIGHT    = 45;

/* ─── Stat card config ────────────────────────────────────────────────── */
const statCards = (users: User[]) => [
  {
    label: "Total users",
    value: users.length,
    Icon: Users,
    iconBg: "var(--brand-soft)",
    iconFg: "var(--brand-from)",
  },
  {
    label: "Active",
    value: users.filter(u => u.status === "active").length,
    Icon: UserCheck,
    iconBg: "var(--brand-soft)",
    iconFg: "var(--brand-from)",
  },
  {
    label: "Pending",
    value: users.filter(u => u.status === "pending").length,
    Icon: Clock,
    iconBg: "var(--brand-soft)",
    iconFg: "var(--brand-from)",
  },
  {
    label: "Blocked",
    value: users.filter(u => u.status === "blocked").length,
    Icon: ShieldOff,
    iconBg: "var(--brand-soft)",
    iconFg: "var(--brand-from)",
  },
];

/* ─── Add User Modal ──────────────────────────────────────────────────── */
function AddUserModal({ dark: _, onClose, onAdd }: {
  dark: boolean; onClose: () => void; onAdd: (u: User) => void;
}) {
  const [form, setForm]     = useState({ name: "", email: "", role: "Rider", status: "active" as UserStatus });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = "Name is required";
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
    <div className="ts-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal">
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Add new user</h2>
            <p className="ts-page-subtitle">Fill in the details to create a user account.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ts-modal-body">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name || "new"}`}
              alt="preview"
              className="w-12 h-12 rounded-full bg-violet-100"
            />
            <div>
              <p className="ts-td-h" style={{ fontSize: ".875rem" }}>{form.name  || "Full name"}</p>
              <p className="ts-muted" style={{ fontSize: ".75rem"  }}>{form.email || "email@example.com"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="ts-label">Full name</label>
            <input
              className={`ts-input${errors.name ? " ts-input-error" : ""}`}
              placeholder="Jane Doe"
              value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
            />
            {errors.name && <span className="ts-err">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="ts-label">Email address</label>
            <input
              className={`ts-input${errors.email ? " ts-input-error" : ""}`}
              placeholder="jane@example.com"
              type="email"
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
            />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="ts-label">Role</label>
              <select className="ts-input cursor-pointer" value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}>
                <option>Rider</option><option>Driver</option><option>Admin</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="ts-label">Status</label>
              <select className="ts-input cursor-pointer" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as UserStatus })}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="ts-modal-footer">
          <button className="ts-btn-ghost"   onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit}>Create user</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function UsersPage({ dark, onSelectUser }: UsersPageProps) {
  const [users,        setUsers]        = useState<User[]>(INITIAL_USERS);
  const [showModal,    setShowModal]    = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [search,       setSearch]       = useState("");
  const [page,         setPage]         = useState(1);

  const filteredUsers = useMemo(() => {
    const roleFilter = ROLE_MAP[activeFilter];
    return users.filter(u => {
      const matchesRole   = roleFilter ? u.role === roleFilter : true;
      const matchesSearch = !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filteredUsers.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const rows: (User | null)[] = [...paginated, ...Array<null>(ROWS_PER_PAGE - paginated.length).fill(null)];

  const GRID   = "2fr 2fr 1fr 1fr 0.7fr 0.5fr";
  const BORDER = { borderColor: "var(--border-row)" };

  function handleFilterChange(f: FilterTab) { setActiveFilter(f); setPage(1); }
  function handleSearchChange(v: string)    { setSearch(v);       setPage(1); }

  return (
    <div className="flex flex-col gap-5">
      {showModal && (
        <AddUserModal
          dark={dark}
          onClose={() => setShowModal(false)}
          onAdd={user => { setUsers(prev => [user, ...prev]); setPage(1); }}
        />
      )}

      {/* Header */}
      <div className="ts-page-header">
        <div>
          <div className="ts-page-title-row">
            <h1 className="ts-page-title">Users</h1>
            <span className="ts-chip">{users.length} total</span>
          </div>
          <p className="ts-page-subtitle">Manage riders, drivers and admins.</p>
        </div>
        <button className="ts-btn-fab" onClick={() => setShowModal(true)}>
          <span style={{ fontSize: "1.125rem", lineHeight: 1 }}>＋</span>
          <span className="ts-btn-fab-label">Add User</span>
        </button>
      </div>

      {/* Stat cards — Transferoo style: label top-left, value bottom-left, icon top-right */}
      <div className="ts-grid-4">
        {statCards(users).map(({ label, value, Icon, iconBg, iconFg }) => (
          <div
            key={label}
            className="ts-card"
            style={{
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "6rem",
            }}
          >
            {/* Top row: label + icon */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span className="ts-stat-label">{label}</span>
              <div
                style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "50%",
                  background: iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: iconFg,
                  flexShrink: 0,
                }}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>
            </div>
            {/* Bottom: big number */}
            <span className="ts-stat-value">{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="ts-table-wrap">
        {/* Toolbar */}
        <div className="ts-toolbar">
          <div className="ts-search-bar" style={{ width: 192 }}>
            <span>🔍</span>
            <input
              placeholder="Search users…"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(["All", "Riders", "Drivers", "Admins"] as FilterTab[]).map(f => (
              <button
                key={f}
                className={`ts-filter-chip${activeFilter === f ? " ts-active" : ""}`}
                onClick={() => handleFilterChange(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid px-4 py-2 border-b ts-faint"
          style={{ gridTemplateColumns: GRID, borderColor: "var(--border)", fontSize: ".625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}
        >
          <span>Name</span><span>Email</span><span>Role</span>
          <span>Status</span><span>Trips</span><span />
        </div>

        {/* Rows */}
        <div>
          {filteredUsers.length === 0 ? (
            <>
              <div className="flex items-center justify-center ts-muted" style={{ height: `${ROW_HEIGHT}px`, fontSize: ".75rem" }}>
                No {activeFilter === "All" ? "users" : activeFilter.toLowerCase()} found{search ? ` matching "${search}"` : ""}.
              </div>
              {Array<null>(ROWS_PER_PAGE - 1).fill(null).map((_, i) => (
                <div key={`ghost-${i}`} className="border-t" style={{ height: `${ROW_HEIGHT}px`, ...BORDER }} />
              ))}
            </>
          ) : (
            rows.map((user, i) => (
              <div
                key={i}
                onClick={() => user && onSelectUser?.(user.name)}
                className={`grid px-4 items-center${user ? " cursor-pointer ts-tr-hover" : ""}${i > 0 ? " border-t" : ""}`}
                style={{ gridTemplateColumns: GRID, height: `${ROW_HEIGHT}px`, ...BORDER }}
              >
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-6 h-6 rounded-full bg-violet-100 shrink-0"
                      />
                      <span className="ts-td-h" style={{ fontSize: ".75rem" }}>{user.name}</span>
                    </div>
                    <span className="ts-muted" style={{ fontSize: ".75rem" }}>{user.email}</span>
                    <span><span className={ROLE_PILL[user.role] ?? "ts-chip"}>{user.role}</span></span>
                    <span><span className={STATUS_PILL[user.status]}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></span>
                    <span className="ts-td-h" style={{ fontSize: ".75rem" }}>{user.trips}</span>
                    <button className="ts-link" style={{ fontSize: ".75rem" }}>View →</button>
                  </>
                ) : (
                  <><span /><span /><span /><span /><span /><span /></>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t ts-faint" style={{ borderColor: "var(--border)", fontSize: ".75rem" }}>
          <span>
            {filteredUsers.length === 0
              ? "No entries"
              : `Showing ${(safePage - 1) * ROWS_PER_PAGE + 1}–${Math.min(safePage * ROWS_PER_PAGE, filteredUsers.length)} of ${filteredUsers.length} entries`}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
              className="px-2 py-1 rounded ts-link disabled:opacity-30 disabled:cursor-not-allowed">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className="flex items-center justify-center rounded"
                style={{ width: "1.5rem", height: "1.5rem", fontSize: ".75rem", fontWeight: 500,
                  background: n === safePage ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))" : "transparent",
                  color: n === safePage ? "#fff" : "inherit" }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="px-2 py-1 rounded ts-link disabled:opacity-30 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}