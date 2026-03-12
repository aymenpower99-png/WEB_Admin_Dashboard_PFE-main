import { useState, useMemo } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import ViewTripModal from "../ViewTripModal";
import type { TripPayment, PayStatus } from "../ViewTripModal";
import "../travelsync-design-system.css";

/* ─── Static Data ───────────────────────────────────────────────────────── */
const ALL_PAYMENTS: TripPayment[] = [
  {
    id: "TRP1024",
    rider: "Sara Mitchell",
    riderSeed: "Sara",
    pickup: "Airport",
    drop: "Hotel Downtown",
    amount: "$32.00",
    amountNum: 32,
    method: "Card",
    status: "Paid",
    date: "today",
    distance: "12 km",
    duration: "22 min",
    time: "10:30",
  },
  {
    id: "TRP1026",
    rider: "Lina Becker",
    riderSeed: "Lina",
    pickup: "Train Station",
    drop: "Airport",
    amount: "$27.50",
    amountNum: 27.5,
    method: "Card",
    status: "Pending",
    date: "today",
    distance: "18 km",
    duration: "30 min",
    time: "12:00",
  },
  {
    id: "TRP1027",
    rider: "James Liu",
    riderSeed: "James",
    pickup: "University",
    drop: "Business Park",
    amount: "$41.00",
    amountNum: 41,
    method: "Card",
    status: "Paid",
    date: "week",
    distance: "9 km",
    duration: "18 min",
    time: "13:45",
  },
  {
    id: "TRP1029",
    rider: "David Chen",
    riderSeed: "David",
    pickup: "Hotel Grand",
    drop: "Convention Ctr",
    amount: "$22.00",
    amountNum: 22,
    method: "Card",
    status: "Paid",
    date: "week",
    distance: "7 km",
    duration: "14 min",
    time: "15:20",
  },
  {
    id: "TRP1030",
    rider: "Amara Diallo",
    riderSeed: "Amara",
    pickup: "Airport T2",
    drop: "City Center",
    amount: "$38.50",
    amountNum: 38.5,
    method: "Card",
    status: "Paid",
    date: "month",
    distance: "16 km",
    duration: "28 min",
    time: "08:10",
  },
  {
    id: "TRP1032",
    rider: "Sophie Martin",
    riderSeed: "Sophie",
    pickup: "Museum",
    drop: "Old Town",
    amount: "$19.50",
    amountNum: 19.5,
    method: "Card",
    status: "Paid",
    date: "month",
    distance: "5 km",
    duration: "11 min",
    time: "14:55",
  },
  {
    id: "TRP1034",
    rider: "Mia Tanaka",
    riderSeed: "Mia",
    pickup: "City Center",
    drop: "Airport T1",
    amount: "$44.00",
    amountNum: 44,
    method: "Card",
    status: "Pending",
    date: "week",
    distance: "20 km",
    duration: "35 min",
    time: "17:05",
  },
  {
    id: "TRP1036",
    rider: "Carlos Reyes",
    riderSeed: "Carlos",
    pickup: "Harbor",
    drop: "Financial Dist",
    amount: "$29.00",
    amountNum: 29,
    method: "Card",
    status: "Paid",
    date: "today",
    distance: "11 km",
    duration: "20 min",
    time: "09:15",
  },
  {
    id: "TRP1038",
    rider: "Priya Nair",
    riderSeed: "Priya",
    pickup: "Tech Campus",
    drop: "Downtown",
    amount: "$33.00",
    amountNum: 33,
    method: "Card",
    status: "Paid",
    date: "month",
    distance: "14 km",
    duration: "25 min",
    time: "18:30",
  },
  {
    id: "TRP1039",
    rider: "Felix Müller",
    riderSeed: "Felix",
    pickup: "Central Park",
    drop: "East District",
    amount: "$26.00",
    amountNum: 26,
    method: "Card",
    status: "Pending",
    date: "month",
    distance: "10 km",
    duration: "19 min",
    time: "07:45",
  },
  {
    id: "TRP1040",
    rider: "Ines Ferreira",
    riderSeed: "Ines",
    pickup: "West Terminal",
    drop: "Stadium",
    amount: "$21.50",
    amountNum: 21.5,
    method: "Card",
    status: "Paid",
    date: "today",
    distance: "6 km",
    duration: "13 min",
    time: "16:00",
  },
];

const STATUS_STYLE: Record<PayStatus, string> = {
  Paid: "ts-pill ts-pill-completed",
  Pending: "ts-pill ts-pill-pending",
};

const STATUS_ICON: Record<PayStatus, React.ReactNode> = {
  Paid: (
    <CheckCircleRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />
  ),
  Pending: (
    <HourglassTopRoundedIcon style={{ fontSize: 13, marginRight: ".2rem" }} />
  ),
};

const ROWS = 5;
const ROW_H = 76;

/* ─── Pagination ────────────────────────────────────────────────────────── */
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  setPage,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  setPage: (n: number) => void;
}) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    background: active
      ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))"
      : disabled
        ? "transparent"
        : "var(--bg-card)",
    color: active
      ? "#fff"
      : disabled
        ? "var(--text-faint)"
        : "var(--text-muted)",
    fontWeight: active ? 700 : 500,
    fontSize: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .15s",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 1rem",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--text-faint)",
          fontWeight: 500,
        }}
      >
        Page {page} of {totalPages}
      </span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button
          onClick={onPrev}
          disabled={page === 1}
          style={btn(false, page === 1)}
        >
          <ChevronLeftRoundedIcon style={{ fontSize: 14 }} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={btn(n === page, false)}
          >
            {n}
          </button>
        ))}
        <button
          onClick={onNext}
          disabled={page === totalPages}
          style={btn(false, page === totalPages)}
        >
          <ChevronRightRoundedIcon style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}

/* ─── Filter Pill ───────────────────────────────────────────────────────── */
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.3rem 0.875rem",
        fontSize: "0.7rem",
        fontWeight: 600,
        border: active ? "none" : "1px solid var(--border)",
        borderRadius: "2rem",
        cursor: "pointer",
        background: active
          ? "linear-gradient(135deg,var(--brand-from),var(--brand-to))"
          : "var(--bg-inner)",
        color: active ? "#fff" : "var(--text-muted)",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </button>
  );
}

/* ─── Table styles ──────────────────────────────────────────────────────── */
const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "0 1.1rem",
  height: ROW_H,
  fontSize: ".85rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
  lineHeight: 1.6,
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function AgencyBillingPage() {
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month">(
    "today",
  );
  const [page, setPage] = useState(1);
  const [viewTrip, setViewTrip] = useState<TripPayment | null>(null);

  const filtered = useMemo(() => {
    return ALL_PAYMENTS.filter((p) => {
      const dateMatch =
        dateFilter === "today"
          ? p.date === "today"
          : dateFilter === "week"
            ? p.date === "today" || p.date === "week"
            : true;
      return dateMatch;
    });
  }, [dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  const stats = [
    { label: "Today's Payments", value: "$1,240" },
    { label: "This Week", value: "$6,820" },
    { label: "This Month", value: "$24,300" },
    { label: "Pending Payments", value: "$1,100" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Agency Billing</h1>
          <p className="ts-page-subtitle">
            Card payments overview and recent trip transactions.
          </p>
        </div>
        <button className="ts-btn-ghost">↓ Export Report</button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="ts-grid-4">
        {stats.map((s) => (
          <div key={s.label} className="ts-card ts-stat-card">
            <span className="ts-stat-label">{s.label}</span>
            <span className="ts-stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Trip Payments Table ── */}
      <div
        className="ts-table-wrap"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Toolbar */}
        <div
          className="ts-toolbar"
          style={{ flexWrap: "wrap", gap: "0.75rem" }}
        >
          <div className="flex items-center gap-2">
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--text-h)",
              }}
            >
              Trip Payments
            </p>
            <span className="ts-chip">{filtered.length} trips</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--text-faint)",
                fontWeight: 600,
              }}
            >
              Period:
            </span>
            {(["today", "week", "month"] as const).map((d) => (
              <FilterPill
                key={d}
                label={
                  d === "today"
                    ? "Today"
                    : d === "week"
                      ? "Last 7 Days"
                      : "This Month"
                }
                active={dateFilter === d}
                onClick={() => {
                  setDateFilter(d);
                  setPage(1);
                }}
              />
            ))}
            <button
              className="ts-btn-ghost"
              style={{ padding: "0.25rem 0.75rem", marginLeft: "0.25rem" }}
            >
              ↓ Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>

            <thead>
              <tr>
                {[
                  "Trip ID",
                  "Rider",
                  "Pickup",
                  "Drop-off",
                  "Amount",
                  "Status",
                  "Action",
                ].map((h, i) => (
                  <th
                    key={h}
                    style={{ ...TH, textAlign: i === 6 ? "center" : "left" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paged.length === 0 ? (
                <>
                  <tr style={{ height: ROW_H }}>
                    <td
                      colSpan={7}
                      style={{
                        ...TD,
                        textAlign: "center",
                        color: "var(--text-faint)",
                      }}
                    >
                      No payments match the selected filters.
                    </td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={7}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      />
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {paged.map((p) => (
                    <tr key={p.id} className="ts-tr" style={{ height: ROW_H }}>
                      {/* Trip ID */}
                      <td style={TD}>
                        <span
                          className="ts-td-h font-mono font-semibold"
                          style={{ fontSize: ".78rem" }}
                        >
                          {p.id}
                        </span>
                      </td>

                      {/* Rider */}
                      <td style={TD}>
                        <span
                          className="ts-td-h"
                          style={{ fontSize: ".82rem", fontWeight: 600 }}
                        >
                          {p.rider}
                        </span>
                      </td>

                      {/* Pickup */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".4rem",
                          }}
                        >
                          <NearMeRoundedIcon
                            style={{
                              fontSize: 13,
                              color: "#7c3aed",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: ".78rem",
                              color: "var(--text-body)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.pickup}
                          </span>
                        </div>
                      </td>

                      {/* Drop */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".4rem",
                          }}
                        >
                          <PlaceRoundedIcon
                            style={{
                              fontSize: 13,
                              color: "#10b981",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: ".78rem",
                              color: "var(--text-body)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.drop}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={TD}>
                        <span
                          style={{
                            fontSize: ".82rem",
                            fontWeight: 700,
                            color: "var(--text-h)",
                          }}
                        >
                          {p.amount}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={TD}>
                        <span
                          className={STATUS_STYLE[p.status]}
                          style={{
                            fontSize: "0.7rem",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {STATUS_ICON[p.status]}
                          {p.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ ...TD, textAlign: "center" }}>
                        <button
                          className="ts-btn-primary"
                          style={{
                            padding: "0.28rem 0.7rem",
                            fontSize: "0.7rem",
                          }}
                          onClick={() => setViewTrip(p)}
                        >
                          View Trip
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Ghost rows */}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={7}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      />
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>

      {/* View Trip Modal */}
      {viewTrip && (
        <ViewTripModal trip={viewTrip} onClose={() => setViewTrip(null)} />
      )}
    </div>
  );
}
