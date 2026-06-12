import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { billingApi, type CommissionTierRecord } from "../../api/billing";
import { ROWS, ROW_H, TH, TD } from "./components/CommissionTypes";

import CommissionKpiCards from "./components/CommissionKpiCards";
import CommissionTierModal from "./components/CommissionTierModal";
import {
  CommissionStatusBadge,
  CommissionInlineRowActions,
} from "./Badge_action_buttons/CommissionBadgesActions";

type FilterKey = "all" | "active" | "inactive";

/* ── Numbered pagination ─────────────────────────────────────────── */
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
          <ChevronLeftRoundedIcon style={{ fontSize: 13 }} />
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
          <ChevronRightRoundedIcon style={{ fontSize: 13 }} />
        </button>
      </div>
    </div>
  );
}

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

export default function CommissionTiersPage() {
  const [tiers, setTiers] = useState<CommissionTierRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editTier, setEditTier] = useState<CommissionTierRecord | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CommissionTierRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function loadTiers() {
    setLoading(true);
    billingApi
      .getTiers()
      .then((data) => setTiers(data ?? []))
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTiers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tiers.filter((t) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "active"
            ? t.isActive
            : filter === "inactive"
              ? !t.isActive
              : true;
      const matchQuery = !q || t.name.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [tiers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await billingApi.deleteTier(deleteTarget.id);
      setTiers((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success("Commission tier deleted", {
        style: { background: "#dc2626", color: "#fff", border: "none" },
      });
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete commission tier");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      {/* ── Modals ── */}
      {showCreate && (
        <CommissionTierModal
          mode="create"
          existingTiers={tiers}
          onClose={() => setShowCreate(false)}
          onSaved={(t) => {
            setTiers((prev) => [...prev, t]);
          }}
        />
      )}
      {editTier && (
        <CommissionTierModal
          mode="edit"
          tier={editTier}
          existingTiers={tiers}
          onClose={() => setEditTier(null)}
          onSaved={(updated) => {
            setTiers((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t)),
            );
          }}
        />
      )}

      {deleteTarget && (
        <div className="ts-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div className="ts-modal-header">
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-h)" }}>
                Delete Commission Tier
              </span>
              <button className="ts-icon-btn" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="ts-modal-body">
              <p style={{ fontSize: ".85rem", color: "var(--text-body)" }}>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="ts-modal-footer">
              <button className="ts-btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancel
              </button>
              <button
                className="ts-btn-primary"
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{ background: "#dc2626", borderColor: "#dc2626" }}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {/* ── Page header ── */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Commission Tiers</h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: ".82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Tier
          </button>
        </div>

        {/* ── KPI cards ── */}
        <CommissionKpiCards tiers={tiers} />

        {/* ── Filter + Search ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key);
                  setPage(1);
                }}
                style={{
                  padding: ".3rem .85rem",
                  borderRadius: "9999px",
                  fontSize: ".82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  background: filter === key ? "#7c3aed" : "var(--bg-inner)",
                  color: filter === key ? "#fff" : "var(--text-muted)",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div className="ts-search-bar" style={{ minWidth: 220 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search tier name…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div
          className="ts-table-wrap"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {loading ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--text-faint)",
                fontSize: ".85rem",
              }}
            >
              Loading commission tiers…
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <colgroup>
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "8%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Name</th>
                    <th style={TH}>Required Rides</th>
                    <th style={TH}>Bonus (DT)</th>
                    <th style={TH}>Sort Order</th>
                    <th style={TH}>Status</th>
                    <th style={{ ...TH, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td
                        colSpan={6}
                        style={{
                          ...TD,
                          textAlign: "center",
                          color: "var(--text-faint)",
                        }}
                      >
                        No commission tiers found
                        {search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map((tier) => (
                      <tr
                        key={tier.id}
                        className="ts-tr"
                        style={{ height: ROW_H }}
                      >
                        <td
                          style={{
                            ...TD,
                            fontWeight: 700,
                            color: "var(--text-h)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tier.name}
                        </td>
                        <td
                          style={{
                            ...TD,
                            fontWeight: 800,
                            color: "var(--text-h)",
                          }}
                        >
                          {tier.requiredRides.toLocaleString()}
                        </td>
                        <td
                          style={{ ...TD, color: "#10b981", fontWeight: 700 }}
                        >
                          +{tier.bonusAmount.toLocaleString()} DT
                        </td>
                        <td style={TD}>{tier.sortOrder}</td>
                        <td style={TD}>
                          <CommissionStatusBadge isActive={tier.isActive} />
                        </td>
                        <td style={{ ...TD, textAlign: "center" }}>
                          <CommissionInlineRowActions
                            onEdit={() => setEditTier(tier)}
                            onDelete={() => setDeleteTarget(tier)}
                          />
                        </td>
                      </tr>
                    ))
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
    </>
  );
}
