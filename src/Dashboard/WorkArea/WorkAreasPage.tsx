import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "../travelsync-design-system.css";

import {
  workAreasApi,
  type WorkAreaItem,
  type WorkAreaDriver,
} from "../../api/workAreas";
import { ROWS, ROW_H, TH, TD } from "./components/WorkAreaTypes";
import WorkAreaStatCards from "./components/WorkAreaStatCards";
import WorkAreaPagination from "./components/WorkAreaPagination";
import AddWorkAreaModal from "./components/AddWorkAreaModal";
import EditWorkAreaModal from "./components/EditWorkAreaModal";
import AssignWorkAreaModal from "./components/AssignWorkAreaModal";
import DeleteWorkAreaModal from "./components/DeleteWorkAreaModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { WorkAreaRowActions } from "./components/WorkAreaActionButtons";

type FilterKey = "all" | "assigned" | "unassigned";

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "assigned", label: "Assigned" },
  { key: "unassigned", label: "No Ville" },
];

export default function WorkAreasPage() {
  const [areas, setAreas] = useState<WorkAreaItem[]>([]);
  const [drivers, setDrivers] = useState<WorkAreaDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddArea, setShowAddArea] = useState(false);
  const [editArea, setEditArea] = useState<WorkAreaItem | null>(null);
  const [assignTarget, setAssignTarget] = useState<WorkAreaDriver | null>(null);
  const [showDeleteAreaModal, setShowDeleteAreaModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<WorkAreaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadAll() {
    setLoading(true);
    Promise.all([workAreasApi.getAll(), workAreasApi.getDrivers()])
      .then(([a, d]) => {
        setAreas(a);
        setDrivers(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return drivers.filter((d) => {
      const mF =
        filter === "all"
          ? true
          : filter === "assigned"
            ? !!d.workAreaId
            : !d.workAreaId;
      const mQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.vehicle ?? "").toLowerCase().includes(q) ||
        (d.workArea?.ville ?? "").toLowerCase().includes(q) ||
        (d.workArea?.country ?? "").toLowerCase().includes(q);
      return mF && mQ;
    });
  }, [drivers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);

  return (
    <>
      {showAddArea && (
        <AddWorkAreaModal
          onClose={() => setShowAddArea(false)}
          onCreated={(area) => setAreas((prev) => [...prev, area])}
        />
      )}
      {editArea && (
        <EditWorkAreaModal
          area={editArea}
          onClose={() => setEditArea(null)}
          onSaved={(updated) => {
            setAreas((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a)),
            );
            setEditArea(null);
          }}
        />
      )}
      {assignTarget && (
        <AssignWorkAreaModal
          driver={assignTarget}
          areas={areas}
          onClose={() => setAssignTarget(null)}
          onSaved={(updated) => {
            setDrivers((prev) =>
              prev.map((d) => (d.id === updated.id ? updated : d)),
            );
            setAssignTarget(null);
          }}
        />
      )}
      {showDeleteAreaModal && (
        <DeleteWorkAreaModal
          areas={areas}
          onClose={() => setShowDeleteAreaModal(false)}
          onAreaSelected={(area) => {
            setAreaToDelete(area);
            setShowConfirmDelete(true);
          }}
        />
      )}
      {showConfirmDelete && areaToDelete && (
        <ConfirmDeleteModal
          isOpen={showConfirmDelete}
          itemName={`${areaToDelete.ville}, ${areaToDelete.country}`}
          onConfirm={async () => {
            setDeleting(true);
            try {
              await workAreasApi.remove(areaToDelete.id);
              setAreas((prev) => prev.filter((a) => a.id !== areaToDelete.id));
              setDrivers((prev) =>
                prev.map((d) =>
                  d.workAreaId === areaToDelete.id
                    ? { ...d, workAreaId: null, workArea: null }
                    : d,
                ),
              );
              setShowConfirmDelete(false);
              setAreaToDelete(null);
              toast.success("Work area deleted successfully", {
                style: { background: "#dc2626", color: "#fff", border: "none" },
              });
            } catch (err: any) {
              toast.error(
                err?.response?.data?.message ?? "Failed to delete work area.",
              );
            } finally {
              setDeleting(false);
            }
          }}
          onCancel={() => {
            setShowConfirmDelete(false);
            setAreaToDelete(null);
          }}
          loading={deleting}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {/* Header */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Work Areas</h1>
            <p className="ts-page-subtitle">
              Assign each driver to their service zone
            </p>
          </div>
          <button
            onClick={() => setShowAddArea(true)}
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
            + Add Work Area
          </button>
        </div>

        {/* Stat cards */}
        <WorkAreaStatCards drivers={drivers} areas={areas} />

        {/* ── Drivers table ── */}

        {/* Filter + Search */}
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
                placeholder="Search driver, vehicle, ville…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Drivers table */}
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
              Loading…
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
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "16%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={TH}>Driver</th>
                    <th style={TH}>Vehicle</th>
                    <th style={TH}>Ville</th>
                    <th style={TH}>Assignment</th>
                    <th style={TH}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr style={{ height: ROW_H }}>
                      <td
                        colSpan={5}
                        style={{
                          ...TD,
                          textAlign: "center",
                          color: "var(--text-faint)",
                        }}
                      >
                        No drivers found{search ? ` matching "${search}"` : ""}.
                      </td>
                    </tr>
                  ) : (
                    paged.map((driver) => (
                      <tr
                        key={driver.id}
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
                          {driver.name || "—"}
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
                          {driver.vehicle ? (
                            driver.vehicle
                          ) : (
                            <span
                              style={{
                                color: "var(--text-faint)",
                                fontStyle: "italic",
                              }}
                            >
                              No vehicle
                            </span>
                          )}
                        </td>
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
                          {driver.workArea ? (
                            driver.workArea.ville
                          ) : (
                            <span
                              style={{
                                color: "var(--text-faint)",
                                fontStyle: "italic",
                                fontWeight: 400,
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                        <td style={TD}>
                          {driver.workAreaId ? (
                            <span
                              style={{
                                fontSize: ".78rem",
                                color: "#059669",
                                fontWeight: 600,
                              }}
                            >
                              Assigned
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: ".78rem",
                                color: "#d97706",
                                fontWeight: 600,
                              }}
                            >
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td style={TD}>
                          <WorkAreaRowActions
                            hasWorkArea={!!driver.workAreaId}
                            onEdit={() => setAssignTarget(driver)}
                            onDelete={() => setShowDeleteAreaModal(true)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <WorkAreaPagination
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
