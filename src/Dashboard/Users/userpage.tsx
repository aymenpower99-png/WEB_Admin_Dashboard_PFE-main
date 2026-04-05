import { useState, useMemo, useEffect } from "react";
import "../travelsync-design-system.css";
import { usersApi, type AdminUser } from "../../api/users";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import {
  ROLE_MAP, ROLE_BADGE, ROLE_LABEL, STATUS_PILL,
  ROWS_PER_PAGE, ROW_H, TH, TD,
  type FilterTab,
} from "./components/users.types";

import UserKpiCards from "./components/UserKpiCards";
import UsersPagination from "./components/UsersPagination";
import InviteModal from "./components/InviteModal";
import EditModal from "./components/EditModal";
import CompleteDriverProfileModal from "./components/CompleteDriverProfileModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import UsersRowActions from "./components/UsersRowActions";

interface UsersPageProps {
  dark?: boolean;
  onSelectUser?: (name: string) => void;
}

function ProfileCell({ u }: { u: AdminUser }) {
  // Passengers are always "complete"
  if (u.role !== "driver") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: ".3rem",
        padding: ".2rem .6rem", borderRadius: "999px",
        background: "#d1fae5", color: "#065f46",
        fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap",
        border: "1px solid #6ee7b7",
      }}>
        ✓ Complete
      </span>
    );
  }
  if (u.status === "pending") {
    return <span style={{ color: "var(--text-faint)", fontSize: ".75rem" }}>Awaiting invite</span>;
  }
  if (u.profileComplete === false) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: ".3rem",
        padding: ".2rem .6rem", borderRadius: "999px",
        background: "#fff7ed", color: "#ea580c",
        fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap",
        border: "1px solid #fed7aa",
      }}>
        ⚙ Not set up
      </span>
    );
  }
  if (u.profileComplete === true) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: ".3rem",
        padding: ".2rem .6rem", borderRadius: "999px",
        background: "#d1fae5", color: "#065f46",
        fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap",
        border: "1px solid #6ee7b7",
      }}>
        ✓ Complete
      </span>
    );
  }
  return <span style={{ color: "var(--text-faint)", fontSize: ".8rem" }}>—</span>;
}

export default function UsersPage({ onSelectUser }: UsersPageProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"invite" | "edit" | "complete-profile" | "delete" | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [profileTarget, setProfileTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function loadUsers() {
    setLoading(true);
    usersApi.getAll()
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }
  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = useMemo(() => {
    const roleFilter = ROLE_MAP[activeFilter];
    return users.filter(u => {
      const matchRole = roleFilter ? u.role === roleFilter : true;
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchSearch = !search.trim()
        || fullName.includes(search.toLowerCase())
        || u.email.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const ghostCount = ROWS_PER_PAGE - pagedUsers.length;

  async function handleBlock(u: AdminUser) {
    setActionLoading(u.id + "-block");
    try { await usersApi.block(u.id); setUsers(p => p.map(x => x.id === u.id ? { ...x, status: "blocked" } : x)); }
    catch { /* ignore */ } finally { setActionLoading(null); }
  }

  async function handleUnblock(u: AdminUser) {
    setActionLoading(u.id + "-unblock");
    try { await usersApi.unblock(u.id); setUsers(p => p.map(x => x.id === u.id ? { ...x, status: "active" } : x)); }
    catch { /* ignore */ } finally { setActionLoading(null); }
  }

  async function handleResend(u: AdminUser) {
    setActionLoading(u.id + "-resend");
    try { await usersApi.resendInvite(u.id); }
    catch { /* ignore */ } finally { setActionLoading(null); }
  }

  async function handleDelete(u: AdminUser) {
    setActionLoading(u.id + "-delete");
    try {
      await usersApi.deleteUser(u.id);
      setUsers(p => p.filter(x => x.id !== u.id));
      setModal(null); setDeleteTarget(null);
    } catch { /* ignore */ } finally { setActionLoading(null); }
  }

  function handleProfileComplete() {
    if (profileTarget) {
      setUsers(p => p.map(x => x.id === profileTarget.id ? { ...x, profileComplete: true } : x));
    }
    setModal(null);
    setProfileTarget(null);
    loadUsers();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* ── Modals ── */}
      {modal === "invite" && (
        <InviteModal onClose={() => setModal(null)} onSuccess={loadUsers} />
      )}
      {modal === "edit" && editTarget && (
        <EditModal
          user={editTarget}
          onClose={() => setModal(null)}
          onSave={saved => setUsers(p => p.map(x => x.id === saved.id ? saved : x))}
        />
      )}
      {modal === "complete-profile" && profileTarget && (
        <CompleteDriverProfileModal
          userId={profileTarget.id}
          userName={`${profileTarget.firstName} ${profileTarget.lastName}`}
          onClose={() => { setModal(null); setProfileTarget(null); }}
          onSuccess={handleProfileComplete}
        />
      )}
      {modal === "delete" && deleteTarget && (
        <DeleteConfirmModal
          userName={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          loading={actionLoading === deleteTarget.id + "-delete"}
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => { setModal(null); setDeleteTarget(null); }}
        />
      )}

      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <div className="ts-page-title-row">
            <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>Users</h1>
          </div>
        </div>
        <button className="ts-btn-primary" onClick={() => setModal("invite")}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span> Invite User
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <UserKpiCards users={users} />

      {/* ── Filter bar (same layout as Vehicles page) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: ".35rem" }}>
          {(["All", "Riders", "Drivers"] as FilterTab[]).map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setPage(1); }}
              style={{
                padding: ".3rem .85rem",
                borderRadius: "9999px",
                fontSize: ".82rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: activeFilter === f ? "#7c3aed" : "var(--bg-inner)",
                color: activeFilter === f ? "#fff" : "var(--text-muted)",
                transition: "all .15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto" }}>
          <div className="ts-search-bar" style={{ minWidth: 240 }}>
            <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
            <input
              placeholder="Search users…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
            Loading users…
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "18%" }} /> {/* User */}
                <col style={{ width: "20%" }} /> {/* Email */}
                <col style={{ width: "9%" }} />  {/* Role */}
                <col style={{ width: "10%" }} /> {/* Status */}
                <col style={{ width: "12%" }} /> {/* Profile */}
                <col style={{ width: "11%" }} /> {/* Trips (wider) */}
                <col style={{ width: "20%" }} /> {/* Actions (wider) */}
              </colgroup>

              <thead>
                <tr>
                  <th style={TH}>User</th>
                  <th style={TH}>Email</th>
                  <th style={TH}>Role</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Profile</th>
                  <th style={TH}>Trips</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No {activeFilter === "All" ? "users" : activeFilter.toLowerCase()} found
                        {search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS_PER_PAGE - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} />
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
                        <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)" }}>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                            {u.firstName} {u.lastName}
                          </span>
                        </td>

                        <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.email}
                        </td>

                        <td style={TD}>
                          <span style={ROLE_BADGE[u.role] ?? ROLE_BADGE.admin}>
                            {ROLE_LABEL[u.role] ?? u.role}
                          </span>
                        </td>

                        <td style={TD}>
                          <span className={STATUS_PILL[u.status]}>
                            {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                          </span>
                        </td>

                        <td style={TD} onClick={e => e.stopPropagation()}>
                          <ProfileCell u={u} />
                        </td>

                        {/* Trips number in black */}
                        <td style={{ ...TD, fontWeight: 800, color: "#111827" }}>{u.trips ?? 0}</td>

                        <td style={TD} onClick={e => e.stopPropagation()}>
                          <UsersRowActions
                            user={u}
                            actionLoading={actionLoading}
                            onEdit={() => { setEditTarget(u); setModal("edit"); }}
                            onBlock={() => handleBlock(u)}
                            onUnblock={() => handleUnblock(u)}
                            onResend={() => handleResend(u)}
                            onCompleteProfile={() => { setProfileTarget(u); setModal("complete-profile"); }}
                            onDelete={() => { setDeleteTarget(u); setModal("delete"); }}
                          />
                        </td>
                      </tr>
                    ))}
                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}>
                        <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} />
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        <UsersPagination
          page={safePage}
          totalPages={totalPages}
          onPrev={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>
    </div>
  );
}