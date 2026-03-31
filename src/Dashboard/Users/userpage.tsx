import { useState, useMemo, useEffect } from "react";
import {
  Users, UserCheck, Clock, ShieldOff, Car,
  ChevronLeft, ChevronRight, Edit2, ShieldX, ShieldCheck, Mail,
} from "lucide-react";
import { type UserStatus } from "../constants";
import "../travelsync-design-system.css";
import { usersApi, type AdminUser, type UserRole, type InviteUserPayload, type UpdateUserPayload } from "../../api/users";

interface UsersPageProps {
  dark: boolean;
  onSelectUser?: (name: string) => void;
}

type FilterTab = "All" | "Riders" | "Drivers";

// ── matches backend lowercase values ──────────────────────────────────────────
const ROLE_MAP: Record<FilterTab, UserRole | null> = {
  All:     null,
  Riders:  "rider",
  Drivers: "driver",
};

const STATUS_PILL: Record<UserStatus, string> = {
  active:  "ts-pill ts-pill-active",
  pending: "ts-pill ts-pill-pending",
  blocked: "ts-pill ts-pill-blocked",
};

// Colored role badge styles
const ROLE_BADGE: Record<UserRole, React.CSSProperties> = {
  rider: {
    display: "inline-flex", alignItems: "center",
    padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem",
    fontWeight: 700, letterSpacing: "0.02em",
    background: "#dbeafe", color: "#1d4ed8",   // blue
  },
  driver: {
    display: "inline-flex", alignItems: "center",
    padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem",
    fontWeight: 700, letterSpacing: "0.02em",
    background: "#fce7f3", color: "#be185d",   // pink
  },
  admin: {
    display: "inline-flex", alignItems: "center",
    padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem",
    fontWeight: 700, letterSpacing: "0.02em",
    background: "#ede9fe", color: "#6d28d9",   // purple
  },
};

const ROLE_LABEL: Record<UserRole, string> = {
  rider:  "Rider",
  driver: "Driver",
  admin:  "Admin",
};

const ROWS_PER_PAGE = 5;
const ROW_H = 88;

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ Icon, iconBg, iconFg, label, value }: {
  Icon: React.ElementType; iconBg: string; iconFg: string; label: string; value: string | number;
}) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "0.85rem 1.1rem", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", minHeight: "80px" }}>
      <div style={{ position: "absolute", top: "0.85rem", right: "1.1rem", width: 36, height: 36, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} color={iconFg} strokeWidth={1.75} />
      </div>
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500, paddingRight: "44px" }}>{label}</span>
      <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-h)", lineHeight: 1, marginTop: "0.35rem" }}>{value}</span>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPrev, onNext, setPage }: {
  page: number; totalPages: number; onPrev: () => void; onNext: () => void; setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: "0.375rem", border: "1px solid var(--border)",
    background: active ? "#7c3aed" : disabled ? "transparent" : "var(--bg-card)",
    color: active ? "#fff" : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all .15s",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
      <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 500 }}>Page {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btn(false, page === 1)}><ChevronLeft size={13} strokeWidth={2.5} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => setPage(n)} style={btn(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btn(false, page === totalPages)}><ChevronRight size={13} strokeWidth={2.5} /></button>
      </div>
    </div>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────
interface InviteFormState { firstName: string; lastName: string; email: string; role: "rider" | "driver"; }

function InviteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<InviteFormState>({ firstName: "", lastName: "", email: "", role: "rider" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload: InviteUserPayload = {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        role:      form.role,
      };
      const res = await usersApi.invite(payload);
      setSuccessMsg(res.message ?? `Invitation sent to ${form.email}.`);
      setTimeout(() => { onSuccess(); onClose(); }, 1800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to send invitation. Please try again.";
      setErrors({ form: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ts-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal">
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Invite new user</h2>
            <p className="ts-page-subtitle">An invitation email will be sent to set their password. Status will be set to <strong>Pending</strong>.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body">
          {successMsg && (
            <div style={{ color: "#059669", fontSize: ".85rem", marginBottom: "0.5rem", padding: "0.5rem 0.75rem", background: "#d1fae5", borderRadius: "0.375rem" }}>
              ✓ {successMsg}
            </div>
          )}
          {errors.form && <div style={{ color: "#dc2626", fontSize: ".8rem", marginBottom: "0.5rem" }}>{errors.form}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label className="ts-label">First name</label>
              <input className={`ts-input${errors.firstName ? " ts-input-error" : ""}`} placeholder="Jane"
                value={form.firstName} onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: "" }); }} />
              {errors.firstName && <span className="ts-err">{errors.firstName}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label className="ts-label">Last name</label>
              <input className={`ts-input${errors.lastName ? " ts-input-error" : ""}`} placeholder="Doe"
                value={form.lastName} onChange={(e) => { setForm({ ...form, lastName: e.target.value }); setErrors({ ...errors, lastName: "" }); }} />
              {errors.lastName && <span className="ts-err">{errors.lastName}</span>}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.75rem" }}>
            <label className="ts-label">Email address</label>
            <input className={`ts-input${errors.email ? " ts-input-error" : ""}`} placeholder="jane@example.com" type="email"
              value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.75rem" }}>
            <label className="ts-label">Role</label>
            <select className="ts-input" style={{ cursor: "pointer" }} value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "rider" | "driver" })}>
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={saving || !!successMsg}>
            {saving ? "Sending…" : "Send invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditFormState { firstName: string; lastName: string; email: string; role: "rider" | "driver"; }

function EditModal({ user, onClose, onSave }: { user: AdminUser; onClose: () => void; onSave: (u: AdminUser) => void }) {
  const [form, setForm] = useState<EditFormState>({
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    role:      user.role === "driver" ? "driver" : "rider",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload: UpdateUserPayload = {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        role:      form.role,
      };
      const result = await usersApi.update(user.id, payload);
      onSave(result);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Failed to update user.";
      setErrors({ form: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ts-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal">
        <div className="ts-modal-header">
          <div>
            <h2 className="ts-page-title" style={{ fontSize: "1rem" }}>Edit user</h2>
            <p className="ts-page-subtitle">Update the user's details. Use Block/Unblock to manage access.</p>
          </div>
          <button className="ts-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ts-modal-body">
          {errors.form && <div style={{ color: "#dc2626", fontSize: ".8rem", marginBottom: "0.5rem" }}>{errors.form}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label className="ts-label">First name</label>
              <input className={`ts-input${errors.firstName ? " ts-input-error" : ""}`} placeholder="Jane"
                value={form.firstName} onChange={(e) => { setForm({ ...form, firstName: e.target.value }); setErrors({ ...errors, firstName: "" }); }} />
              {errors.firstName && <span className="ts-err">{errors.firstName}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label className="ts-label">Last name</label>
              <input className={`ts-input${errors.lastName ? " ts-input-error" : ""}`} placeholder="Doe"
                value={form.lastName} onChange={(e) => { setForm({ ...form, lastName: e.target.value }); setErrors({ ...errors, lastName: "" }); }} />
              {errors.lastName && <span className="ts-err">{errors.lastName}</span>}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.75rem" }}>
            <label className="ts-label">Email address</label>
            <input className={`ts-input${errors.email ? " ts-input-error" : ""}`} placeholder="jane@example.com" type="email"
              value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }} />
            {errors.email && <span className="ts-err">{errors.email}</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.75rem" }}>
            <label className="ts-label">Role</label>
            <select className="ts-input" style={{ cursor: "pointer" }} value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "rider" | "driver" })}>
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
            </select>
          </div>
        </div>
        <div className="ts-modal-footer">
          <button className="ts-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ts-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────
const TH: React.CSSProperties = {
  padding: "0.65rem 1rem", fontSize: ".78rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-body)",
  textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
};
const TD: React.CSSProperties = {
  padding: "0 1rem", height: ROW_H, fontSize: ".875rem",
  color: "var(--text-body)", borderBottom: "1px solid var(--border)", verticalAlign: "middle",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage({ onSelectUser }: UsersPageProps) {
  const [users, setUsers]                 = useState<AdminUser[]>([]);
  const [loading, setLoading]             = useState(false);
  const [modal, setModal]                 = useState<"invite" | "edit" | null>(null);
  const [editTarget, setEditTarget]       = useState<AdminUser | null>(null);
  const [activeFilter, setActiveFilter]   = useState<FilterTab>("All");
  const [search, setSearch]               = useState("");
  const [page, setPage]                   = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function loadUsers() {
    setLoading(true);
    usersApi.getAll()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadUsers(); }, []);

  // Filter compares lowercase role values from backend
  const filteredUsers = useMemo(() => {
    const roleFilter = ROLE_MAP[activeFilter]; // null | "rider" | "driver"
    return users.filter((u) => {
      const matchesRole   = roleFilter ? u.role === roleFilter : true;
      const fullName      = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchesSearch = !search.trim()
        || fullName.includes(search.toLowerCase())
        || u.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const ghostCount = ROWS_PER_PAGE - pagedUsers.length;

  async function handleBlock(u: AdminUser) {
    setActionLoading(u.id + "-block");
    try {
      await usersApi.block(u.id);
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: "blocked" } : x));
    } catch { /* ignore */ } finally { setActionLoading(null); }
  }

  async function handleUnblock(u: AdminUser) {
    setActionLoading(u.id + "-unblock");
    try {
      await usersApi.unblock(u.id);
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: "active" } : x));
    } catch { /* ignore */ } finally { setActionLoading(null); }
  }

  async function handleResend(u: AdminUser) {
    setActionLoading(u.id + "-resend");
    try { await usersApi.resendInvite(u.id); }
    catch { /* ignore */ } finally { setActionLoading(null); }
  }

  const kpiCards = [
    { Icon: Users,     iconBg: "#ede9fe", iconFg: "#7c3aed", label: "Total Users",   value: users.length },
    { Icon: Car,       iconBg: "#dbeafe", iconFg: "#2563eb", label: "Total Riders",  value: users.filter((u) => u.role === "rider").length },
    { Icon: UserCheck, iconBg: "#fce7f3", iconFg: "#db2777", label: "Total Drivers", value: users.filter((u) => u.role === "driver").length },
    { Icon: UserCheck, iconBg: "#d1fae5", iconFg: "#059669", label: "Active",        value: users.filter((u) => u.status === "active").length },
    { Icon: Clock,     iconBg: "#fef3c7", iconFg: "#d97706", label: "Pending",       value: users.filter((u) => u.status === "pending").length },
    { Icon: ShieldOff, iconBg: "#fee2e2", iconFg: "#dc2626", label: "Blocked",       value: users.filter((u) => u.status === "blocked").length },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {modal === "invite" && (
        <InviteModal onClose={() => setModal(null)} onSuccess={loadUsers} />
      )}
      {modal === "edit" && editTarget && (
        <EditModal
          user={editTarget}
          onClose={() => setModal(null)}
          onSave={(saved) => setUsers((prev) => prev.map((x) => x.id === saved.id ? saved : x))}
        />
      )}

      {/* Header */}
      <div className="ts-page-header">
        <div>
          <div className="ts-page-title-row">
            <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>Users</h1>
            <span className="ts-chip">{users.length} total</span>
          </div>
          <p className="ts-page-subtitle">Manage riders and drivers.</p>
        </div>
        <button className="ts-btn-primary" onClick={() => setModal("invite")}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span> Invite User
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "0.65rem" }}>
        {kpiCards.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Table */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div className="ts-toolbar">
          <div className="ts-search-bar" style={{ minWidth: 220 }}>
            <span style={{ fontSize: "0.85rem" }}>🔍</span>
            <input
              placeholder="Search users…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {(["All", "Riders", "Drivers"] as FilterTab[]).map((f) => (
              <button
                key={f}
                className={`ts-filter-chip${activeFilter === f ? " ts-active" : ""}`}
                onClick={() => { setActiveFilter(f); setPage(1); }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
            Loading users…
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "20%" }} /><col style={{ width: "22%" }} /><col style={{ width: "11%" }} />
                <col style={{ width: "12%" }} /><col style={{ width: "8%" }} /><col style={{ width: "27%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>User</th><th style={TH}>Email</th><th style={TH}>Role</th>
                  <th style={TH}>Status</th><th style={TH}>Trips</th><th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No {activeFilter === "All" ? "users" : activeFilter.toLowerCase()} found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS_PER_PAGE - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {pagedUsers.map((u, i) => (
                      <tr
                        key={`${u.id}-${i}`}
                        className="ts-tr"
                        style={{ height: ROW_H, cursor: "pointer" }}
                        onClick={() => onSelectUser?.(`${u.firstName} ${u.lastName}`)}
                      >
                        {/* Name */}
                        <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                            {u.firstName} {u.lastName}
                          </span>
                        </td>

                        {/* Email */}
                        <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.email}
                        </td>

                        {/* Role — colored badge */}
                        <td style={TD}>
                          <span style={ROLE_BADGE[u.role] ?? ROLE_BADGE.rider}>
                            {ROLE_LABEL[u.role] ?? u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={TD}>
                          <span className={STATUS_PILL[u.status]}>
                            {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                          </span>
                        </td>

                        {/* Trips */}
                        <td style={{ ...TD, fontWeight: 700, color: "#7c3aed" }}>{u.trips ?? 0}</td>

                        {/* Actions */}
                        <td style={TD} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <button
                              title="Edit user"
                              className="ts-icon-btn"
                              onClick={() => { setEditTarget(u); setModal("edit"); }}
                              style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.375rem" }}
                            >
                              <Edit2 size={13} />
                            </button>

                            {u.status !== "blocked" && (
                              <button
                                title="Block user"
                                className="ts-icon-btn ts-icon-btn-del"
                                disabled={actionLoading === u.id + "-block"}
                                onClick={() => handleBlock(u)}
                                style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.375rem" }}
                              >
                                <ShieldX size={13} />
                              </button>
                            )}

                            {u.status === "blocked" && (
                              <button
                                title="Unblock user"
                                className="ts-icon-btn"
                                disabled={actionLoading === u.id + "-unblock"}
                                onClick={() => handleUnblock(u)}
                                style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.375rem", color: "#059669" }}
                              >
                                <ShieldCheck size={13} />
                              </button>
                            )}

                            {u.status === "pending" && (
                              <button
                                title="Resend invitation"
                                className="ts-icon-btn"
                                disabled={actionLoading === u.id + "-resend"}
                                onClick={() => handleResend(u)}
                                style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.375rem", color: "#d97706" }}
                              >
                                <Mail size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

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