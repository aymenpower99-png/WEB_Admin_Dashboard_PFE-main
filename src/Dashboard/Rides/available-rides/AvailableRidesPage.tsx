import { useMemo, useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import type { BackendRide } from "../../../api/rides";
import { ridesApi, filterAvailable, passengerName } from "../../../api/rides";

import { ROWS, ROW_H, TH, TD } from "../shared/RideTypes";
import { RideStatusBadge } from "../shared/RideStatusBadge";
import { ActionButton, IconEye, IconDispatch, IconCancel, HOVER } from "../shared/RideActionButtons";
import RidePagination from "../shared/RidePagination";
import RideRouteCell from "../shared/RideRouteCell";

import AvailableRidesKpi from "./components/AvailableRidesKpi";
import { DispatchRideModal, AvailableRideDetailsModal, CreateRideModal } from "./AvailableRidesModals";

/* ─── Filter tabs ────────────────────────────────────────────────────── */
type FilterKey = "all" | "PENDING" | "SCHEDULED" | "SEARCHING_DRIVER";
const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all",              label: "All" },
  { key: "PENDING",          label: "Pending" },
  { key: "SCHEDULED",        label: "Scheduled" },
  { key: "SEARCHING_DRIVER", label: "Searching" },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AvailableRidesPage() {
  const [allRides, setAllRides]   = useState<BackendRide[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<FilterKey>("all");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);

  const [dispatchModal, setDispatchModal] = useState<BackendRide | null>(null);
  const [detailModal, setDetailModal]     = useState<BackendRide | null>(null);
  const [createModal, setCreateModal]     = useState(false);

  /* ── Fetch ───────────────────────────────────────────────────────── */
  const fetchRides = (silent = false) => {
    if (!silent) setLoading(true);
    ridesApi.getAll()
      .then(raw => setAllRides(filterAvailable(raw)))
      .catch(() => { if (!silent) setAllRides([]); })
      .finally(() => { if (!silent) setLoading(false); });
  };

  useEffect(() => { fetchRides(false); }, []);

  // Silent background refresh — updates data without replacing the table with a spinner
  useEffect(() => {
    const id = setInterval(() => fetchRides(true), 12000);
    return () => clearInterval(id);
  }, []);

  /* ── Derived data ────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = allRides;
    if (filter === "PENDING") {
      // Unconfirmed pending only (not yet scheduled)
      list = list.filter(r => r.status === "PENDING" && !r.confirmedAt);
    } else if (filter === "SCHEDULED") {
      // Confirmed future rides waiting for the 30-min dispatch window
      list = list.filter(r => r.status === "PENDING" && !!r.confirmedAt);
    } else if (filter !== "all") {
      list = list.filter(r => r.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        passengerName(r).toLowerCase().includes(q) ||
        r.pickupAddress?.toLowerCase().includes(q) ||
        r.dropoffAddress?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allRides, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  /* ── Handlers────────────────────────────────────────────────────── */
  const handleCancel = async (ride: BackendRide) => {
    try {
      await ridesApi.cancel(ride.id, { cancellation_reason: "Cancelled by admin" });
      fetchRides();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Cancel failed");
    }
  };

  const handleDispatch = (_rideId: string) => {
    setTimeout(fetchRides, 2000);
  };

  const handleCreate = () => {
    fetchRides();
  };

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <>
      {/* Modals */}
      {dispatchModal && (
        <DispatchRideModal
          ride={dispatchModal}
          onClose={() => setDispatchModal(null)}
          onDispatch={handleDispatch}
        />
      )}
      {detailModal && (
        <AvailableRideDetailsModal
          ride={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
      {createModal && (
        <CreateRideModal
          onClose={() => setCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

        {/* Page header */}
        <div className="ts-page-header">
          <div><h1 className="ts-page-title">Available Rides</h1></div>
          <button className="ts-btn-fab" onClick={() => setCreateModal(true)}>
            <span style={{ fontSize: "1.1rem", lineHeight: 1, flexShrink: 0 }}>＋</span>
            <span className="ts-btn-fab-label">New Ride</span>
          </button>
        </div>

        {/* KPI Cards */}
        <AvailableRidesKpi rides={allRides} />

        {/* Filters + Search */}
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
              <input placeholder="Search rider, route…" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              Loading rides…
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Rider</th>
                    <th style={TH}>Route</th>
                    <th style={TH}>Class</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Fare</th>
                    <th style={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={6} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No rides found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map(r => (
                      <tr key={r.id} className="ts-tr" style={{ height: ROW_H }}>
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {passengerName(r)}
                          </td>
                          <td style={TD}>
                            <RideRouteCell pickup={r.pickupAddress} dropoff={r.dropoffAddress} />
                          </td>
                          <td style={TD}>{r.vehicleClass?.name ?? "—"}</td>
                          <td style={TD}><RideStatusBadge status={r.status === "PENDING" && r.confirmedAt ? "SCHEDULED" : r.status} /></td>
                          <td style={{ ...TD, fontWeight: 800, color: "var(--text-h)" }}>
                            {r.priceFinal ? `${r.priceFinal} TND` : "—"}
                          </td>
                          <td style={TD} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <ActionButton title="View" onClick={() => setDetailModal(r)} hoverStyle={HOVER.view}>
                                <IconEye />
                              </ActionButton>
                              {(r.status === "SEARCHING_DRIVER" || (r.status === "PENDING" && r.confirmedAt)) && (
                                <ActionButton title="Force Dispatch" onClick={() => setDispatchModal(r)} hoverStyle={HOVER.dispatch}>
                                  <IconDispatch />
                                </ActionButton>
                              )}
                              <ActionButton title="Cancel" onClick={() => handleCancel(r)} hoverStyle={HOVER.cancel}>
                                <IconCancel />
                              </ActionButton>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <RidePagination page={safePage} totalPages={totalPages}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            setPage={setPage} />
        </div>
      </div>
    </>
  );
}
