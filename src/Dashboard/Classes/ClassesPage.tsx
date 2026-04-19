import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import "../travelsync-design-system.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { classesApi } from "../../api/classes";
import type { VehicleClass } from "../../api/classes";
import ClassStatCards from "./components/ClassStatCards";
import ClassTableRow from "./components/ClassTableRow";
import DeleteClassModal from "./components/DeleteClassModal";
import Pagination from "../Vehicles/components/Pagination";

const ROWS_PER_PAGE = 5;
const ROW_H = 88;

const TH: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
  background: "var(--bg-thead)",
};
const TH_CENTER: React.CSSProperties = { ...TH, textAlign: "center" };

interface ClassesPageProps {
  onNavigate: (page: string, prefill?: VehicleClass | null | string) => void;
}

export default function ClassesPage({ onNavigate }: ClassesPageProps) {
  const [classes, setClasses] = useState<VehicleClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<VehicleClass | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadClasses() {
    setLoading(true);
    setError(null);
    classesApi
      .getAll()
      .then(setClasses)
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const total = classes.length;
  const active = classes.filter((c) => c.isActive).length;
  const withWifi = classes.filter((c) => c.wifi).length;
  const withAc = classes.filter((c) => c.ac).length;

  const filtered = useMemo(
    () =>
      classes.filter((c) => {
        const q = search.toLowerCase();
        return !q || c.name.toLowerCase().includes(q);
      }),
    [classes, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await classesApi.remove(deleteTarget.id);
      setClasses((p) => p.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Class deleted");
    } catch {
      toast.error("Failed to delete class");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Delete modal */}
      {deleteTarget && (
        <DeleteClassModal
          cls={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="ts-page-header">
        <div>
          <h1
            className="ts-page-title"
            style={{ fontSize: "1.25rem", fontWeight: 800 }}
          >
            Classes
          </h1>
        </div>
        <button
          onClick={() => onNavigate("classes-add", null)}
          style={{
            background: "#7c3aed", color: "#fff", border: "none",
            borderRadius: 8, padding: "8px 18px", fontSize: ".82rem",
            fontWeight: 600, cursor: "pointer",
          }}
        >
          + Add Class
        </button>
      </div>

      <ClassStatCards
        total={total}
        active={active}
        withWifi={withWifi}
        withAc={withAc}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <div className="ts-search-bar" style={{ minWidth: 240 }}>
          <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
          <input
            placeholder="Search classes…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div
        className="ts-table-wrap"
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
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
            Loading classes…
          </div>
        ) : error ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#ef4444",
              fontSize: ".85rem",
            }}
          >
            {error}{" "}
            <button
              onClick={loadClasses}
              style={{
                marginLeft: 8,
                textDecoration: "underline",
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "inherit",
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "17%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "23%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Class</th>
                  <th style={TH_CENTER}>Seats</th>
                  <th style={TH_CENTER}>Bags</th>
                  <th style={TH}>Features</th>
                  <th style={TH_CENTER}>Wait</th>
                  <th style={TH_CENTER}>Vehicles</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr style={{ height: ROW_H }}>
                    <td
                      colSpan={8}
                      style={{
                        padding: "0 1.25rem",
                        height: ROW_H,
                        textAlign: "center",
                        color: "var(--text-faint)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      No classes found{search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                ) : (
                  paged.map((c) => (
                    <ClassTableRow
                      key={c.id}
                      cls={c}
                      vehicleCount={c.vehicleCount}
                      onEdit={(cls) => onNavigate("classes-add", cls)}
                      onDelete={(cls) => setDeleteTarget(cls)}
                      onView={(cls) => onNavigate("class-detail", cls.id)}
                    />
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
  );
}
