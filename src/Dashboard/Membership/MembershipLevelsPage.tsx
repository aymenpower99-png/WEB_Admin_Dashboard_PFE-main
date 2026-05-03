import { useMemo, useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { membershipLevelsApi, type MembershipLevel } from "../../api/membershipLevels";
import { ROWS, ROW_H, TH, TD } from "./components/MembershipTypes";

import MembershipKpiCards                             from "./components/MembershipKpiCards";
import MembershipPagination                           from "./components/MembershipPagination";
import MembershipLevelModal                           from "./components/MembershipLevelModal";
import { MembershipStatusBadge }                      from "./Badge_action_buttons/MembershipBadges";
import { MembershipInlineRowActions }                 from "./Badge_action_buttons/MembershipActionButtons";

type FilterKey = "all" | "active" | "inactive";

export default function MembershipLevelsPage() {
  const [levels,        setLevels]        = useState<MembershipLevel[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [filter,        setFilter]        = useState<FilterKey>("all");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);
  const [editLevel,     setEditLevel]     = useState<MembershipLevel | null>(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function loadLevels() {
    setLoading(true);
    membershipLevelsApi.getAll()
      .then(data => setLevels(data ?? []))
      .catch(() => setLevels([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadLevels(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return levels.filter(l => {
      const matchFilter =
        filter === "all"      ? true :
        filter === "active"   ? l.isActive :
        filter === "inactive" ? !l.isActive :
        true;
      const matchQuery = !q || l.name.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [levels, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);

  async function handleToggle(id: string) {
    setActionLoading(id + "-toggle");
    try {
      const updated = await membershipLevelsApi.toggleActive(id);
      setLevels(prev => prev.map(l => l.id === updated.id ? updated : l));
    } catch {}
    finally { setActionLoading(null); }
  }

  const FILTER_TABS: { key: FilterKey; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "active",   label: "Active"   },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <>
      {showCreate && (
        <MembershipLevelModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSaved={created => {
            setLevels(prev => [...prev, created]);
            setShowCreate(false);
          }}
        />
      )}

      {editLevel && (
        <MembershipLevelModal
          mode="edit"
          level={editLevel}
          onClose={() => setEditLevel(null)}
          onSaved={updated => {
            setLevels(prev => prev.map(l => l.id === updated.id ? updated : l));
            setEditLevel(null);
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

        <div className="ts-page-header">
          <div><h1 className="ts-page-title">Membership Levels</h1></div>
          <button className="ts-btn-primary" onClick={() => setShowCreate(true)}>
            + Add Level
          </button>
        </div>

        <MembershipKpiCards levels={levels} />

        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
            {FILTER_TABS.map(({ key, label }) => (
              <button key={key} onClick={() => { setFilter(key); setPage(1); }} style={{
                padding: ".3rem .85rem", borderRadius: "9999px", fontSize: ".82rem",
                fontWeight: 600, cursor: "pointer", border: "none",
                background: filter === key ? "#7c3aed" : "var(--bg-inner)",
                color:      filter === key ? "#fff"    : "var(--text-muted)",
                transition: "all .15s",
              }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div className="ts-search-bar" style={{ minWidth: 220 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search level name…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>

        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              Loading membership levels…
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Name</th>
                    <th style={TH}>Required Points</th>
                    <th style={TH}>Discount %</th>
                    <th style={TH}>Order</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No membership levels found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map(l => (
                      <tr key={l.id} className="ts-tr" style={{ height: ROW_H }}>
                        <td style={{ ...TD, fontWeight: 700, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {l.name}
                        </td>
                        <td style={{ ...TD, fontWeight: 800, color: "var(--text-h)" }}>
                          {l.requiredPoints.toLocaleString()}
                        </td>
                        <td style={{ ...TD, color: "var(--text-muted)" }}>
                          {Number(l.discountPercentage).toFixed(1)}%
                        </td>
                        <td style={{ ...TD, color: "var(--text-muted)", fontWeight: 700 }}>
                          #{l.order}
                        </td>
                        <td style={TD}>
                          <MembershipStatusBadge isActive={l.isActive} />
                        </td>
                        <td style={TD} onClick={e => e.stopPropagation()}>
                          <MembershipInlineRowActions
                            level={l}
                            actionLoading={actionLoading}
                            onEdit={() => setEditLevel(l)}
                            onToggle={() => handleToggle(l.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <MembershipPagination
            page={safePage} totalPages={totalPages}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}
