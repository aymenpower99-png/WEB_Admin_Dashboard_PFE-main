import { useMemo, useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { billingApi, type CommissionTierRecord } from "../../api/billing";
import { ROWS, ROW_H, TH, TD }                   from "./components/CommissionTypes";

import CommissionKpiCards                            from "./components/CommissionKpiCards";
import CommissionTierModal                           from "./components/CommissionTierModal";
import { CommissionStatusBadge, CommissionInlineRowActions } from "./Badge_action_buttons/CommissionBadgesActions";

type FilterKey = "all" | "active" | "inactive";

/* ── Simple pagination ─────────────────────────────────────────── */
function Pagination({
  page, totalPages, onPrev, onNext, setPage,
}: { page: number; totalPages: number; onPrev: () => void; onNext: () => void; setPage: (n: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".75rem 1.25rem", borderTop: "1px solid var(--border)" }}>
      <span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>
        Page {page} of {totalPages}
      </span>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <button className="ts-btn-ghost" onClick={onPrev} disabled={page <= 1}
          style={{ padding: ".3rem .6rem", fontSize: ".72rem" }}>← Prev</button>
        <button className="ts-btn-ghost" onClick={onNext} disabled={page >= totalPages}
          style={{ padding: ".3rem .6rem", fontSize: ".72rem" }}>Next →</button>
      </div>
    </div>
  );
}

export default function CommissionTiersPage() {
  const [tiers,         setTiers]         = useState<CommissionTierRecord[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [filter,        setFilter]        = useState<FilterKey>("all");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);
  const [editTier,      setEditTier]      = useState<CommissionTierRecord | null>(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function loadTiers() {
    setLoading(true);
    billingApi.getTiers()
      .then(data => setTiers(data ?? []))
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadTiers(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tiers.filter(t => {
      const matchFilter =
        filter === "all"      ? true :
        filter === "active"   ? t.isActive :
        filter === "inactive" ? !t.isActive :
        true;
      const matchQuery = !q || t.name.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [tiers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this commission tier?")) return;
    setActionLoading(id + "-delete");
    try {
      await billingApi.deleteTier(id);
      setTiers(prev => prev.filter(t => t.id !== id));
    } catch {}
    finally { setActionLoading(null); }
  }

  const FILTER_KEYS: FilterKey[] = ["all", "active", "inactive"];
  const FILTER_LABELS: Record<FilterKey, string> = { all: "All", active: "Active", inactive: "Inactive" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem" }}>
        <div>
          <h1 className="ts-page-title" style={{ marginBottom: ".2rem" }}>Commission Tiers</h1>
          <p className="ts-muted" style={{ fontSize: ".85rem" }}>
            Configure driver bonus tiers based on completed rides.
          </p>
        </div>
        <button className="ts-btn-primary" style={{ fontSize: ".82rem" }} onClick={() => setShowCreate(true)}>
          + Add Tier
        </button>
      </div>

      {/* ── KPI cards ── */}
      <CommissionKpiCards tiers={tiers} />

      {/* ── Filter pills ── */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {FILTER_KEYS.map(k => (
          <button
            key={k}
            onClick={() => { setFilter(k); setPage(1); }}
            style={{
              padding: ".35rem .85rem", borderRadius: "999px", fontSize: ".78rem",
              fontWeight: 700, cursor: "pointer", border: "1px solid",
              borderColor: filter === k ? "var(--brand-to)" : "var(--border)",
              background:   filter === k ? "var(--brand-to)" : "transparent",
              color:        filter === k ? "#fff"            : "var(--text-muted)",
              transition: "all .15s",
            }}
          >
            {FILTER_LABELS[k]}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div className="ts-toolbar">
          <p style={{ fontSize: ".875rem", fontWeight: 700, color: "var(--text-h)" }}>
            Commission Tiers
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <div style={{ position: "relative" }}>
              <SearchRoundedIcon style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                fontSize: 16, color: "var(--text-faint)",
              }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search tiers…"
                className="ts-search-input"
                style={{ paddingLeft: 32 }}
              />
            </div>
          </div>
        </div>

        <table className="ts-table">
          <thead>
            <tr>
              <th style={TH}>#</th>
              <th style={TH}>Name</th>
              <th style={TH}>Required Rides</th>
              <th style={TH}>Bonus (DT)</th>
              <th style={TH}>Sort Order</th>
              <th style={TH}>Status</th>
              <th style={{ ...TH, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: ROWS }).map((_, i) => (
                <tr key={i} style={{ height: ROW_H }}>
                  <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }}>
                    <div style={{ height: 14, background: "var(--border)", borderRadius: 4, width: "60%", opacity: 0.5 }} />
                  </td>
                </tr>
              ))
            ) : (
              <>
                {paged.map((tier, i) => (
                  <tr key={tier.id} style={{ height: ROW_H }}>
                    <td style={TD}>{(safePage - 1) * ROWS + i + 1}</td>
                    <td style={TD}>
                      <span style={{ fontWeight: 700 }}>{tier.name}</span>
                    </td>
                    <td style={TD}>{tier.requiredRides.toLocaleString()}</td>
                    <td style={TD}>
                      <span style={{ color: "#10b981", fontWeight: 700 }}>
                        +{tier.bonusAmount.toLocaleString()} DT
                      </span>
                    </td>
                    <td style={TD}>{tier.sortOrder}</td>
                    <td style={TD}><CommissionStatusBadge isActive={tier.isActive} /></td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <CommissionInlineRowActions
                        tier={tier}
                        actionLoading={actionLoading}
                        onEdit={() => setEditTier(tier)}
                        onDelete={() => handleDelete(tier.id)}
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

        <Pagination
          page={safePage} totalPages={totalPages}
          onPrev={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <CommissionTierModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSaved={(t) => { setTiers(prev => [...prev, t]); }}
        />
      )}
      {editTier && (
        <CommissionTierModal
          mode="edit"
          tier={editTier}
          onClose={() => setEditTier(null)}
          onSaved={(updated) => {
            setTiers(prev => prev.map(t => t.id === updated.id ? updated : t));
          }}
        />
      )}
    </div>
  );
}
