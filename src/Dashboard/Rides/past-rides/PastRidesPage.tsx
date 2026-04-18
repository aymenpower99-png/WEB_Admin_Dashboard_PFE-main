import { useMemo, useState, useEffect, useCallback } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import type { BackendRide } from "../../../api/rides";
import {
  ridesApi,
  filterPast,
  passengerName,
  driverName,
  fmtDate,
  fmtTime,
} from "../../../api/rides";

import { ROWS, ROW_H, TH, TD } from "../shared/RideTypes";
import { RideStatusBadge } from "../shared/RideStatusBadge";
import {
  ActionButton,
  IconEye,
  IconDelete,
  HOVER,
} from "../shared/RideActionButtons";
import RidePagination from "../shared/RidePagination";
import RideRouteCell from "../shared/RideRouteCell";

import PastRidesKpi from "./components/PastRidesKpi";
import { PastRideDetailsModal, DeleteConfirmModal } from "./PastRidesModals";

type FilterKey = "all" | "COMPLETED" | "CANCELLED";

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function PastRidesPage() {
  const [allRides, setAllRides] = useState<BackendRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState<BackendRide | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BackendRide | null>(null);

  const fetchRides = useCallback(async () => {
    try {
      const rides = await ridesApi.getAll();
      setAllRides(filterPast(rides));
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handleHardDelete = (ride: BackendRide) => {
    setDeleteTarget(ride);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const ride = deleteTarget;
    setDeleteTarget(null);
    setDeleting(ride.id);
    try {
      await ridesApi.hardDelete(ride.id);
      setAllRides((prev) => prev.filter((r) => r.id !== ride.id));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Failed to delete ride");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allRides.filter((r) => {
      const matchStatus = filter === "all" || r.status === filter;
      const matchSearch =
        !q ||
        passengerName(r).toLowerCase().includes(q) ||
        driverName(r).toLowerCase().includes(q) ||
        r.pickupAddress.toLowerCase().includes(q) ||
        r.dropoffAddress.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [allRides, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  return (
    <>
      {detailModal && (
        <PastRideDetailsModal
          ride={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          ride={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          deleting={!!deleting}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Past Rides</h1>
          </div>
        </div>

        <PastRidesKpi rides={allRides} />

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
            <div className="ts-search-bar" style={{ minWidth: 240 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search rider, driver…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

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
              Loading rides…
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
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Rider</th>
                    <th style={TH}>Driver</th>
                    <th style={TH}>Route</th>
                    <th style={TH}>Date &amp; Time</th>
                    <th style={TH}>Fare</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td
                        colSpan={7}
                        style={{
                          ...TD,
                          textAlign: "center",
                          color: "var(--text-faint)",
                        }}
                      >
                        No rides found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map((ride) => (
                      <tr
                        key={ride.id}
                        className="ts-tr"
                        style={{ height: ROW_H }}
                      >
                        <td
                          style={{
                            ...TD,
                            fontWeight: 600,
                            color: "var(--text-h)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {passengerName(ride)}
                        </td>
                        <td
                          style={{
                            ...TD,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {driverName(ride)}
                        </td>
                        <td style={TD}>
                          <RideRouteCell
                            pickup={ride.pickupAddress}
                            dropoff={ride.dropoffAddress}
                          />
                        </td>
                        <td style={TD}>
                          <div
                            style={{ fontWeight: 600, color: "var(--text-h)" }}
                          >
                            {fmtDate(ride.scheduledAt)}
                          </div>
                          <div
                            style={{
                              fontSize: ".75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {fmtTime(ride.scheduledAt)}
                          </div>
                        </td>
                        <td
                          style={{
                            ...TD,
                            fontWeight: 800,
                            color: "var(--text-h)",
                          }}
                        >
                          {ride.priceFinal ? `${ride.priceFinal} TND` : "—"}
                        </td>
                        <td style={TD}>
                          <RideStatusBadge status={ride.status} />
                        </td>
                        <td style={TD} onClick={(e) => e.stopPropagation()}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <ActionButton
                              title="View"
                              onClick={() => setDetailModal(ride)}
                              hoverStyle={HOVER.view}
                            >
                              <IconEye />
                            </ActionButton>

                            <ActionButton
                              title="Delete"
                              onClick={() => handleHardDelete(ride)}
                              hoverStyle={HOVER.delete}
                            >
                              <IconDelete />
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
          <RidePagination
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
