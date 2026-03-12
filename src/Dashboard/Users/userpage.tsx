import { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Clock,
  ShieldOff,
  Car,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react";
import { type UserStatus } from "../constants";
import "../travelsync-design-system.css";

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
type FilterTab = "All" | "Riders" | "Drivers";

const ROLE_MAP: Record<FilterTab, string | null> = {
  All: null,
  Riders: "Rider",
  Drivers: "Driver",
};

const INITIAL_USERS: User[] = [
  {
    name: "Sara Mitchell",
    email: "sara.m@example.com",
    role: "Rider",
    status: "active" as UserStatus,
    trips: 34,
  },
  {
    name: "Omar Sherif",
    email: "omar.s@example.com",
    role: "Driver",
    status: "active" as UserStatus,
    trips: 118,
  },
  {
    name: "Lina Bouzid",
    email: "lina.b@example.com",
    role: "Rider",
    status: "pending" as UserStatus,
    trips: 5,
  },
  {
    name: "Karim Trabelsi",
    email: "karim.t@example.com",
    role: "Driver",
    status: "active" as UserStatus,
    trips: 203,
  },
  {
    name: "Nadia Riahi",
    email: "nadia.r@example.com",
    role: "Rider",
    status: "blocked" as UserStatus,
    trips: 9,
  },
  {
    name: "Aiko Tanaka",
    email: "aiko.t@example.com",
    role: "Driver",
    status: "active" as UserStatus,
    trips: 67,
  },
  {
    name: "Lucas Morel",
    email: "l.morel@example.com",
    role: "Rider",
    status: "active" as UserStatus,
    trips: 14,
  },
  {
    name: "Priya Nair",
    email: "priya.n@example.com",
    role: "Driver",
    status: "pending" as UserStatus,
    trips: 2,
  },
  {
    name: "James Okafor",
    email: "james.o@example.com",
    role: "Rider",
    status: "active" as UserStatus,
    trips: 27,
  },
  {
    name: "Yasmine Elloumi",
    email: "yasmine.e@example.com",
    role: "Driver",
    status: "active" as UserStatus,
    trips: 91,
  },
];

const STATUS_PILL: Record<UserStatus, string> = {
  active: "ts-pill ts-pill-active",
  pending: "ts-pill ts-pill-pending",
  blocked: "ts-pill ts-pill-blocked",
};
const ROLE_PILL: Record<string, string> = {
  Rider: "ts-pill ts-role-rider",
  Driver: "ts-pill ts-role-driver",
};

const ROWS_PER_PAGE = 5;
const ROW_H = 88;

/* ─── KPI Card ────────────────────────────────────────────────────── */
function KpiCard({
  Icon,
  iconBg,
  iconFg,
  label,
  value,
}: {
  Icon: React.ElementType;
  iconBg: string;
  iconFg: string;
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "0.85rem 1.1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        minHeight: "80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "1.1rem",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={iconFg} strokeWidth={1.75} />
      </div>
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          fontWeight: 500,
          paddingRight: "44px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "var(--text-h)",
          lineHeight: 1,
          marginTop: "0.35rem",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Pagination ────────────────────────────────────────────────────── */
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  setPage,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    background: active
      ? "#7c3aed"
      : disabled
        ? "transparent"
        : "var(--bg-card)",
    color: active
      ? "#fff"
      : disabled
        ? "var(--text-faint)"
        : "var(--text-muted)",
    fontWeight: active ? 700 : 500,
    fontSize: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .15s",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 1rem",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--text-faint)",
          fontWeight: 500,
        }}
      >
        Page {page} of {totalPages}
      </span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button
          onClick={onPrev}
          disabled={page === 1}
          style={btn(false, page === 1)}
        >
          <ChevronLeft size={13} strokeWidth={2.5} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={btn(n === page, false)}
          >
            {n}
          </button>
        ))}
        <button
          onClick={onNext}
          disabled={page === totalPages}
          style={btn(false, page === totalPages)}
        >
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Remove Modal ──────────────────────────────────────────────────── */
function RemoveModal({
  name,
  onConfirm,
  onClose,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="ts-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ts-modal ts-modal-sm">
        <div className="ts-modal-header">
          <p
            style={{
              fontWeight: 700,
              fontSize: ".88rem",
              color: "var(--text-h)",
            }}
          >
            Remove User
          </p>
          <button className="ts-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="ts-modal-body">
          <p style={{ fontSize: ".8rem", color: "var(--text-body)" }}>
            Are you sure you want to remove <strong>{name}</strong>? This action
            cannot be undone.
          </p>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="ts-btn-danger" onClick={onConfirm}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add / Edit User Modal ─────────────────────────────────────────── */
function UserModal({
  initial,
  onClose,
  onSave,
}: {
  initial: User | null;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [form, setForm] = useState<User>(
    initial ?? {
      name: "",
      email: "",
      role: "Rider",
      status: "active" as UserStatus,
      trips: 0,
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
    onClose();
  }

  return (
    <div
      className="ts-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ts-modal">
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>
              {initial ? "Edit user" : "Add new user"}
            </h2>
            <p className="ts-page-subtitle">
              {initial
                ? "Update the user's details."
                : "Fill in the details to create a user account."}
            </p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="ts-modal-body">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label className="ts-label">Full name</label>
            <input
              className={`ts-input${errors.name ? " ts-input-error" : ""}`}
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && <span className="ts-err">{errors.name}</span>}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label className="ts-label">Email address</label>
            <input
              className={`ts-input${errors.email ? " ts-input-error" : ""}`}
              placeholder="jane@example.com"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <label className="ts-label">Role</label>
              <select
                className="ts-input"
                style={{ cursor: "pointer" }}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Rider</option>
                <option>Driver</option>
              </select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <label className="ts-label">Status</label>
              <select
                className="ts-input"
                style={{ cursor: "pointer" }}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as UserStatus })
                }
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="ts-btn-primary" onClick={handleSubmit}>
            {initial ? "Save changes" : "Create user"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Table styles ──────────────────────────────────────────────────── */
const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "0 1rem",
  height: ROW_H,
  fontSize: ".875rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function UsersPage({ onSelectUser }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [removeTarget, setRemoveTarget] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const roleFilter = ROLE_MAP[activeFilter];
    return users.filter((u) => {
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, activeFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ROWS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );
  const ghostCount = ROWS_PER_PAGE - pagedUsers.length;

  function handleFilterChange(f: FilterTab) {
    setActiveFilter(f);
    setPage(1);
  }
  function handleSearchChange(v: string) {
    setSearch(v);
    setPage(1);
  }
  function openEdit(u: User) {
    setEditTarget(u);
    setModal("edit");
  }
  function openAdd() {
    setEditTarget(null);
    setModal("add");
  }

  const kpiCards = [
    {
      Icon: Users,
      iconBg: "#ede9fe",
      iconFg: "#7c3aed",
      label: "Total Users",
      value: users.length,
    },
    {
      Icon: Car,
      iconBg: "#dbeafe",
      iconFg: "#2563eb",
      label: "Total Riders",
      value: users.filter((u) => u.role === "Rider").length,
    },
    {
      Icon: UserCheck,
      iconBg: "#fce7f3",
      iconFg: "#db2777",
      label: "Total Drivers",
      value: users.filter((u) => u.role === "Driver").length,
    },
    {
      Icon: UserCheck,
      iconBg: "#d1fae5",
      iconFg: "#059669",
      label: "Active",
      value: users.filter((u) => u.status === "active").length,
    },
    {
      Icon: Clock,
      iconBg: "#fef3c7",
      iconFg: "#d97706",
      label: "Pending",
      value: users.filter((u) => u.status === "pending").length,
    },
    {
      Icon: ShieldOff,
      iconBg: "#fee2e2",
      iconFg: "#dc2626",
      label: "Blocked",
      value: users.filter((u) => u.status === "blocked").length,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* ── Modals ── */}
      {(modal === "add" || modal === "edit") && (
        <UserModal
          initial={modal === "edit" ? editTarget : null}
          onClose={() => setModal(null)}
          onSave={(u) => {
            if (modal === "edit") {
              setUsers((prev) =>
                prev.map((x) => (x.name === editTarget?.name ? u : x)),
              );
            } else {
              setUsers((prev) => [u, ...prev]);
              setPage(1);
            }
          }}
        />
      )}
      {removeTarget && (
        <RemoveModal
          name={removeTarget.name}
          onConfirm={() => {
            setUsers((prev) =>
              prev.filter((u) => u.name !== removeTarget.name),
            );
            setRemoveTarget(null);
          }}
          onClose={() => setRemoveTarget(null)}
        />
      )}

      {/* ── Page header ── */}
      <div className="ts-page-header">
        <div>
          <div className="ts-page-title-row">
            <h1
              className="ts-page-title"
              style={{ fontSize: "1.25rem", fontWeight: 800 }}
            >
              Users
            </h1>
            <span className="ts-chip">{users.length} total</span>
          </div>
          <p className="ts-page-subtitle">Manage riders and drivers.</p>
        </div>
        <button className="ts-btn-primary" onClick={openAdd}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span> Add User
        </button>
      </div>

      {/* ── KPI cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: "0.65rem",
        }}
      >
        {kpiCards.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ── Table card ── */}
      <div
        className="ts-table-wrap"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Toolbar */}
        <div className="ts-toolbar">
          <div className="ts-search-bar" style={{ minWidth: 220 }}>
            <span style={{ fontSize: "0.85rem" }}>🔍</span>
            <input
              placeholder="Search users…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            {(["All", "Riders", "Drivers"] as FilterTab[]).map((f) => (
              <button
                key={f}
                className={`ts-filter-chip${activeFilter === f ? " ts-active" : ""}`}
                onClick={() => handleFilterChange(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "13%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={TH}>User</th>
                <th style={TH}>Email</th>
                <th style={TH}>Role</th>
                <th style={TH}>Status</th>
                <th style={TH}>Trips</th>
                <th style={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <>
                  <tr style={{ height: ROW_H }}>
                    <td
                      colSpan={6}
                      style={{
                        ...TD,
                        textAlign: "center",
                        color: "var(--text-faint)",
                      }}
                    >
                      No{" "}
                      {activeFilter === "All"
                        ? "users"
                        : activeFilter.toLowerCase()}{" "}
                      found
                      {search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                  {Array.from({ length: ROWS_PER_PAGE - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={6}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      />
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {pagedUsers.map((u, i) => (
                    <tr
                      key={`${u.name}-${i}`}
                      className="ts-tr"
                      style={{ height: ROW_H, cursor: "pointer" }}
                      onClick={() => onSelectUser?.(u.name)}
                    >
                      <td
                        style={{
                          ...TD,
                          fontWeight: 600,
                          color: "var(--text-h)",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {u.name}
                        </span>
                      </td>
                      <td
                        style={{
                          ...TD,
                          color: "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.email}
                      </td>
                      <td style={TD}>
                        <span className={ROLE_PILL[u.role] ?? "ts-chip"}>
                          {u.role}
                        </span>
                      </td>
                      <td style={TD}>
                        <span className={STATUS_PILL[u.status]}>
                          {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ ...TD, fontWeight: 700, color: "#7c3aed" }}>
                        {u.trips}
                      </td>
                      <td style={TD} onClick={(e) => e.stopPropagation()}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <button
                            title="Edit user"
                            className="ts-icon-btn"
                            onClick={() => openEdit(u)}
                            style={{
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "0.375rem",
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            title="Remove user"
                            className="ts-icon-btn ts-icon-btn-del"
                            onClick={() => setRemoveTarget(u)}
                            style={{
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "0.375rem",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={6}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      />
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
