import { useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";


import type { Driver, DriversPageProps } from "./types";
import { ROWS, ROW_H, TH, TD, STATUS_CFG } from "./components/DriversTypes";

import DriverKpiCards from "./components/DriverKpiCards";
import DriverStatusPill from "./components/DriverStatusPill";
import DriverStars from "./components/DriverStars";
import DriversPagination from "./components/DriversPagination";
import DeleteDriverModal from "./components/DeleteDriverModal";
import DriversRowActions from "./components/DriversRowActions";
type FilterKey = "all" | Driver["status"];

export default function DriversPage({
  drivers,
  setDrivers,
  onNavigate,
}: DriversPageProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [removeId, setRemoveId] = useState<number | null>(null);

  const counts = useMemo(
    () => ({
      all: drivers.length,
      online: drivers.filter((d) => d.status === "online").length,
      busy: drivers.filter((d) => d.status === "busy").length,
      offline: drivers.filter((d) => d.status === "offline").length,
    }),
    [drivers],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return drivers.filter((d) => {
      const matchStatus = filter === "all" || d.status === filter;
      const matchQuery =
        !q ||
        `${d.first} ${d.last}`.toLowerCase().includes(q) ||
        d.vehicle.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [drivers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  return (
    <>
      {removeId !== null && (
        <DeleteDriverModal
          onConfirm={() => {
            setDrivers((prev) => prev.filter((d) => d.id !== removeId));
            setRemoveId(null);
          }}
          onClose={() => setRemoveId(null)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {/* Header */}
        <div className="ts-page-header">
          <div>
            <h1 className="ts-page-title">Drivers</h1>
            <p className="ts-page-subtitle">
              {drivers.length} registered · {counts.online} online ·{" "}
              {counts.busy} busy
            </p>
          </div>
          <button
            className="ts-btn-primary"
            onClick={() => onNavigate("agency-drivers", null)}
          >
            <PersonAddAlt1RoundedIcon style={{ fontSize: 15 }} /> Add Driver
          </button>
        </div>

        {/* KPI Cards (like Vehicles) */}
        <DriverKpiCards drivers={drivers} />

        {/* Filter + Search (like Vehicles/Users) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: ".35rem" }}>
            {(["all", "online", "busy", "offline"] as const).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setFilter(k);
                  setPage(1);
                }}
                style={{
                  padding: ".3rem .85rem",
                  borderRadius: "9999px",
                  fontSize: ".82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  background: filter === k ? "#7c3aed" : "var(--bg-inner)",
                  color: filter === k ? "#fff" : "var(--text-muted)",
                  transition: "all .15s",
                }}
              >
                {k === "all"
                  ? `All (${counts.all})`
                  : `${STATUS_CFG[k].label} (${counts[k]})`}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto" }}>
            <div className="ts-search-bar" style={{ minWidth: 240 }}>
              <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
              <input
                placeholder="Search name, email or vehicle…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="ts-table-wrap"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "18%" }} /> {/* Driver */}
                <col style={{ width: "12%" }} /> {/* Status */}
                <col style={{ width: "18%" }} /> {/* Vehicle */}
                <col style={{ width: "12%" }} /> {/* Language */}
                <col style={{ width: "8%" }} /> {/* Trips */}
                <col style={{ width: "12%" }} /> {/* Earnings */}
                <col style={{ width: "10%" }} /> {/* Rating */}
                <col style={{ width: "10%" }} /> {/* Actions */}
              </colgroup>

              <thead>
                <tr>
                  <th style={TH}>Driver</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Language</th>
                  <th style={TH}>Trips</th>
                  <th style={TH}>Earnings</th>
                  <th style={TH}>Rating</th>
                  <th style={TH}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paged.length === 0 ? (
                  <>
                    <tr style={{ height: ROW_H }}>
                      <td
                        colSpan={8}
                        style={{
                          ...TD,
                          textAlign: "center",
                          color: "var(--text-faint)",
                        }}
                      >
                        No drivers match your search.
                      </td>
                    </tr>
                    {Array.from({ length: ROWS - 1 }).map((_, i) => (
                      <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                        <td
                          colSpan={8}
                          style={{ borderBottom: "1px solid var(--border)" }}
                        />
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {paged.map((d) => (
                      <tr
                        key={d.id}
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
                          {d.first} {d.last}
                        </td>

                        <td style={TD}>
                          <DriverStatusPill status={d.status} />
                        </td>

                        <td
                          style={{
                            ...TD,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.vehicle}
                        </td>

                        <td style={{ ...TD, color: "var(--text-muted)" }}>
                          {d.lang}
                        </td>

                        <td
                          style={{ ...TD, fontWeight: 700, color: "#111827" }}
                        >
                          {d.trips}
                        </td>

                        <td
                          style={{ ...TD, fontWeight: 700, color: "#7c3aed" }}
                        >
                          ${d.earnings}
                        </td>

                        <td style={TD}>
                          <DriverStars rating={d.rating} />
                        </td>

                        <td style={TD}>
                          <DriversRowActions
                            driver={d}
                            onEdit={() => onNavigate("agency-drivers", d)}
                            onDelete={() => setRemoveId(d.id)}
                          />
                        </td>
                      </tr>
                    ))}

                    {Array.from({ length: ghostCount }).map((_, i) => (
                      <tr key={`g-${i}`} style={{ height: ROW_H }}>
                        <td
                          colSpan={8}
                          style={{ borderBottom: "1px solid var(--border)" }}
                        />
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <DriversPagination
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
