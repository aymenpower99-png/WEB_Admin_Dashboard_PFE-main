import { useState, useEffect, useMemo } from "react";
import "../travelsync-design-system.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { classesApi } from "../../api/classes";
import type { VehicleClass } from "../../api/classes";
import ClassStatCards   from "./components/ClassStatCards";
import ClassTableRow    from "./components/ClassTableRow";
import DeleteClassModal from "./components/DeleteClassModal";
import Pagination       from "../Vehicles/components/Pagination";

const ROWS_PER_PAGE = 6;
const ROW_H = 64;

const TH: React.CSSProperties = {
  padding: "0.65rem 1rem", fontSize: ".78rem", fontWeight: 800,
  textTransform: "uppercase", letterSpacing: ".06em",
  color: "var(--text-body)", textAlign: "left",
  borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
  background: "var(--bg-thead)",
};

const TH_CENTER: React.CSSProperties = { ...TH, textAlign: "center" };

interface ClassesPageProps {
  onNavigate: (page: string, prefill?: VehicleClass | null) => void;
}

export default function ClassesPage({ onNavigate }: ClassesPageProps) {
  const [classes,       setClasses]       = useState<VehicleClass[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);
  const [deleteTarget,  setDeleteTarget]  = useState<VehicleClass | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  function loadClasses() {
    setLoading(true);
    setError(null);
    classesApi.getAll()
      .then(setClasses)
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadClasses(); }, []);

  const total    = classes.length;
  const active   = classes.filter(c => c.isActive).length;
  const withWifi = classes.filter(c => c.wifi).length;
  const withAc   = classes.filter(c => c.ac).length;

  const filtered = useMemo(() =>
    classes.filter(c => {
      const q = search.toLowerCase();
      return !q || c.name.toLowerCase().includes(q);
    }),
    [classes, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const ghostCount = ROWS_PER_PAGE - paged.length;

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await classesApi.remove(deleteTarget.id);
      setClasses(p => p.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert("Could not delete class. Make sure no vehicles are linked to it.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

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
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
            Classes
          </h1>
          <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-muted)" }}>
            Manage vehicle classes and their features
          </p>
        </div>
        <button className="ts-btn-primary" onClick={() => onNavigate("classes-add", null)}>
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span> Add Class
        </button>
      </div>

      {/* Stat Cards */}
      <ClassStatCards total={total} active={active} withWifi={withWifi} withAc={withAc} />

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <div className="ts-search-bar" style={{ minWidth: 240 }}>
          <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
          <input
            placeholder="Search classes…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
            Loading classes…
          </div>
        ) : error ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444", fontSize: ".85rem" }}>
            {error}{" "}
            <button onClick={loadClasses} style={{
              marginLeft: 8, textDecoration: "underline", cursor: "pointer",
              background: "none", border: "none", color: "inherit",
            }}>Retry</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              {/* ✅ Balanced equal-ish column widths */}
              <colgroup>
                <col style={{ width: "20%" }} /> {/* Class     */}
                <col style={{ width: "10%" }} /> {/* Seats     */}
                <col style={{ width: "10%" }} /> {/* Bags      */}
                <col style={{ width: "26%" }} /> {/* Features  */}
                <col style={{ width: "10%" }} /> {/* Wait      */}
                <col style={{ width: "12%" }} /> {/* Status    */}
                <col style={{ width: "12%" }} /> {/* Actions   */}
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Class</th>
                  <th style={TH_CENTER}>Seats</th>
                  <th style={TH_CENTER}>Bags</th>
                  <th style={TH}>Features</th>
                  <th style={TH_CENTER}>Wait</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={7} style={{
                        padding: "0 1rem", height: ROW_H, textAlign: "center",
                        color: "var(--text-faint)", borderBottom: "1px solid var(--border)",
                      }}>
                        No classes found{search ? ` matching "${search}"` : ""}.
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
                    {paged.map(c => (
                      <ClassTableRow
                        key={c.id}
                        cls={c}
                        onEdit={cls => onNavigate("classes-add", cls)}
                        onDelete={cls => setDeleteTarget(cls)}
                      />
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
        <Pagination
          page={safePage} totalPages={totalPages}
          onPrev={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>
    </div>
  );
}