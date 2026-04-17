import { useMemo, useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import type { DriverProfile } from "../../api/drivers";
import { driversApi } from "../../api/drivers";
import { ROWS, ROW_H, TH, TD } from "./components/DriversTypes";

import DriverKpiCards             from "./components/DriverKpiCards";
import DriversPagination          from "./components/DriversPagination";
import DeleteDriverModal          from "./components/DeleteDriverModal";
import EditDriverModal            from "./components/EditDriverModal";
import DriverSetupInfoModal       from "./components/DriverSetupInfoModal";
import { DriverStatusBadge }      from "./Badge_action_buttons/DriversBadges";
import { DriverInlineRowActions } from "./Badge_action_buttons/DriversActionButtons";

type FilterKey = "all" | "pending" | "setup_required" | "offline" | "online";

interface DriversPageProps {
  // ✅ optional — ShellRoutes no longer needs to pass it
  onNavigate?: (page: string, prefill?: DriverProfile | null) => void;
}

export default function DriversPage({ onNavigate: _onNavigate }: DriversPageProps) {
  const [drivers,       setDrivers]       = useState<DriverProfile[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [filter,        setFilter]        = useState<FilterKey>("all");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);
  const [removeId,      setRemoveId]      = useState<string | null>(null);
  const [editDriver,    setEditDriver]    = useState<DriverProfile | null>(null);
  const [infoDriver,    setInfoDriver]    = useState<DriverProfile | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  function loadDrivers() {
    setLoading(true);
    driversApi.getAll()
      .then(res => setDrivers(res.data ?? []))
      .catch(() => setDrivers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadDrivers(); }, []);

  const counts = useMemo(() => ({
    all:            drivers.length,
    pending:        drivers.filter(d => d.availabilityStatus === "pending").length,
    setup_required: drivers.filter(d => d.availabilityStatus === "setup_required").length,
    online:         drivers.filter(d => d.availabilityStatus === "online").length,
    offline:        drivers.filter(d => d.availabilityStatus === "offline").length,
  }), [drivers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return drivers.filter(d => {
      const matchStatus = filter === "all" || d.availabilityStatus === filter;
      const fullName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.toLowerCase();
      const matchQuery = !q
        || fullName.includes(q)
        || (d.email ?? "").toLowerCase().includes(q)
        || (d.vehicle ? `${d.vehicle.make} ${d.vehicle.model}`.toLowerCase().includes(q) : false);
      return matchStatus && matchQuery;
    });
  }, [drivers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  async function handleDelete(id: string) {
    setActionLoading(id + "-delete");
    try {
      await driversApi.remove(id);
      setDrivers(prev => prev.filter(d => d.id !== id));
      setRemoveId(null);
    } catch { }
    finally { setActionLoading(null); }
  }

  const FILTER_TABS: { key: FilterKey; label: string }[] = [
    { key: "all",            label: `All ` },
    { key: "pending",        label: `Pending ` },
    { key: "setup_required", label: `Setup Required ` },
    { key: "offline",        label: `Offline ` },
    { key: "online",         label: `Online ` },
  ];

  return (
    <>
      {removeId !== null && (
        <DeleteDriverModal
          onConfirm={() => handleDelete(removeId)}
          onClose={() => setRemoveId(null)}
        />
      )}

      {editDriver && (
        <EditDriverModal
          driver={editDriver}
          onClose={() => setEditDriver(null)}
          onSaved={updated => {
            setDrivers(prev => prev.map(d => d.id === updated.id ? updated : d));
            setEditDriver(null);
          }}
        />
      )}

      {infoDriver && (
        <DriverSetupInfoModal
          driver={infoDriver}
          onClose={() => setInfoDriver(null)}
          onGoEdit={() => setEditDriver(infoDriver)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

        <div className="ts-page-header">
          <div><h1 className="ts-page-title">Drivers</h1></div>
        </div>

        <DriverKpiCards drivers={drivers} />

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
            <div className="ts-search-bar" style={{ minWidth: 240 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search name, email or vehicle…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>

        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              Loading drivers…
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "22%" }} /><col style={{ width: "22%" }} />
                  <col style={{ width: "16%" }} /><col style={{ width: "18%" }} />
                  <col style={{ width: "8%"  }} /><col style={{ width: "14%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Driver</th>
                    <th style={TH}>Email</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Vehicle</th>
                    <th style={TH}>Trips</th>
                    <th style={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No drivers found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map(d => (
                      <tr key={d.id} className="ts-tr" style={{ height: ROW_H }}>
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {d.firstName} {d.lastName}
                          </td>
                          <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {d.email ?? "—"}
                          </td>
                          <td style={TD}>
                            <DriverStatusBadge status={d.availabilityStatus} />
                          </td>
                          <td style={{ ...TD, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {d.vehicle
                              ? `${d.vehicle.make} ${d.vehicle.model}`
                              : <span style={{ color: "var(--text-faint)" }}>—</span>}
                          </td>
                          <td style={{ ...TD, fontWeight: 800, color: "var(--text-h)" }}>
                            {d.totalTrips ?? 0}
                          </td>
                          <td style={TD} onClick={e => e.stopPropagation()}>
                            <DriverInlineRowActions
                              driver={d}
                              actionLoading={actionLoading}
                              onEdit={() => setEditDriver(d)}
                              onDelete={() => setRemoveId(d.id)}
                              onInfo={() => setInfoDriver(d)}
                            />
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <DriversPagination
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