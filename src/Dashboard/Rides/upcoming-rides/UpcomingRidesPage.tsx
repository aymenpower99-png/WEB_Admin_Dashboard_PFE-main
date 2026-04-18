import { useMemo, useState, useEffect, useCallback } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import type { BackendRide } from "../../../api/rides";
import { ridesApi, filterUpcoming, passengerName, driverName, vehicleLabel, fmtDate, fmtTime } from "../../../api/rides";

import { ROWS, ROW_H, TH, TD } from "../shared/RideTypes";
import { RideStatusBadge } from "../shared/RideStatusBadge";
import { ActionButton, IconEye, IconCancel, IconDelete, HOVER } from "../shared/RideActionButtons";
import RidePagination from "../shared/RidePagination";
import RideRouteCell from "../shared/RideRouteCell";

import UpcomingRidesKpi from "./components/UpcomingRidesKpi";
import { UpcomingRideDetailsModal, CancelRideModal } from "./UpcomingRidesModals";

type FilterKey = "all" | "ASSIGNED" | "EN_ROUTE_TO_PICKUP" | "ARRIVED" | "IN_TRIP";

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all",                label: "All" },
  { key: "ASSIGNED",           label: "Assigned" },
  { key: "EN_ROUTE_TO_PICKUP", label: "En Route" },
  { key: "ARRIVED",            label: "Arrived" },
  { key: "IN_TRIP",            label: "In Trip" },
];

export default function UpcomingRidesPage() {
  const [allRides, setAllRides] = useState<BackendRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState<BackendRide | null>(null);
  const [cancelModal, setCancelModal] = useState<BackendRide | null>(null);
  const [deleting, setDeleting]       = useState<string | null>(null);

  const fetchRides = useCallback(async () => {
    try {
      const rides = await ridesApi.getAll();
      setAllRides(filterUpcoming(rides));
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRides(); }, [fetchRides]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allRides.filter(r => {
      const matchStatus = filter === "all" || r.status === filter;
      const matchSearch = !q
        || passengerName(r).toLowerCase().includes(q)
        || driverName(r).toLowerCase().includes(q)
        || r.pickupAddress.toLowerCase().includes(q)
        || r.dropoffAddress.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [allRides, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const handleCancelConfirm= () => {
    setCancelModal(null);
    fetchRides();
  };

  const handleHardDelete = async (ride: BackendRide) => {
    if (!window.confirm(`Permanently delete this ride?\n${ride.pickupAddress} → ${ride.dropoffAddress}\n\nThis cannot be undone.`)) return;
    setDeleting(ride.id);
    try {
      await ridesApi.hardDelete(ride.id);
      setAllRides(prev => prev.filter(r => r.id !== ride.id));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Failed to delete ride");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      {detailModal && (
        <UpcomingRideDetailsModal
          ride={detailModal}
          onClose={() => setDetailModal(null)}
          onCancel={detailModal.status !== "IN_TRIP" ? () => { setDetailModal(null); setCancelModal(detailModal); } : undefined}
        />
      )}

      {cancelModal && (
        <CancelRideModal
          ride={cancelModal}
          onClose={() => setCancelModal(null)}
          onCancelled={handleCancelConfirm}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

        <div className="ts-page-header">
          <div><h1 className="ts-page-title">Upcoming Rides</h1></div>
        </div>

        <UpcomingRidesKpi rides={allRides} />

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
                placeholder="Search rider, driver…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>

        <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
              Loading rides…
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "13%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Rider</th>
                    <th style={TH}>Driver &amp; Vehicle</th>
                    <th style={TH}>Route</th>
                    <th style={TH}>Schedule</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Fare</th>
                    <th style={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={7} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No rides found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map(ride => (
                      <tr key={ride.id} className="ts-tr" style={{ height: ROW_H }}>
                          <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {passengerName(ride)}
                          </td>
                          <td style={TD}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, color: "var(--text-h)", fontSize: ".85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {driverName(ride)}
                              </p>
                              <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {vehicleLabel(ride)}
                              </p>
                            </div>
                          </td>
                          <td style={TD}>
                            <RideRouteCell pickup={ride.pickupAddress} dropoff={ride.dropoffAddress} />
                          </td>
                          <td style={TD}>
                            <div>
                              <p style={{ margin: 0, fontSize: ".85rem", color: "var(--text-h)" }}>{fmtDate(ride.scheduledAt)}</p>
                              <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)" }}>{fmtTime(ride.scheduledAt)}</p>
                            </div>
                          </td>
                          <td style={TD}>
                            <RideStatusBadge status={ride.status} />
                          </td>
                          <td style={{ ...TD, fontWeight: 800 }}>
                            {ride.priceFinal ? `${ride.priceFinal} TND` : "—"}
                          </td>
                          <td style={TD} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <ActionButton title="View" onClick={() => setDetailModal(ride)} hoverStyle={HOVER.view}>
                                <IconEye />
                              </ActionButton>
                              {ride.status !== "IN_TRIP" && (
                                <ActionButton title="Cancel" onClick={() => setCancelModal(ride)} hoverStyle={HOVER.cancel}>
                                  <IconCancel />
                                </ActionButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <RidePagination
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
