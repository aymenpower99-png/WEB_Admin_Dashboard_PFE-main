import { useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { PastRideDetailsModal } from "./PastRidesModals";
import type { PastRide, RideStatus } from "./PastRidesModals";

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS = 5;
const ROW_H = 96;

/* ─── MOCK DATA ──────────────────────────────────────────────────────── */
const MOCK_PAST: PastRide[] = [
  {
    id: 1,
    rider: "Sara M",
    driver: "John D",
    driverAvatar: "JD",
    driverRating: 4.9,
    vehicle: "Toyota Corolla",
    plate: "TN-1234-A",
    pickup: "Tunis-Carthage Airport",
    drop: "City Center, Tunis",
    vehicleType: "Sedan",
    date: "Mar 8, 2026",
    time: "10:30",
    fare: 28,
    distance: "12 km",
    duration: "22 min",
    passengerCount: 2,
    status: "completed",
    riderRating: 5,
    paymentMethod: "Card",
  },
  {
    id: 2,
    rider: "Omar S",
    driver: "Emily R",
    driverAvatar: "ER",
    driverRating: 4.7,
    vehicle: "Kia Rio",
    plate: "TN-5678-B",
    pickup: "El Mechtel Hotel",
    drop: "Tunis Train Station",
    vehicleType: "Sedan",
    date: "Mar 8, 2026",
    time: "11:15",
    fare: 45,
    distance: "8 km",
    duration: "18 min",
    passengerCount: 4,
    status: "completed",
    riderRating: 4,
    paymentMethod: "Cash",
  },
  {
    id: 3,
    rider: "Lina B",
    driver: "Ahmed K",
    driverAvatar: "AK",
    driverRating: 4.8,
    vehicle: "Mercedes Vito",
    plate: "TN-9012-C",
    pickup: "La Marsa Beach",
    drop: "Bardo Museum",
    vehicleType: "Van",
    date: "Mar 7, 2026",
    time: "09:00",
    fare: 35,
    distance: "18 km",
    duration: "30 min",
    passengerCount: 1,
    status: "cancelled",
    riderRating: null,
    paymentMethod: "Card",
  },
  {
    id: 4,
    rider: "Karim T",
    driver: "Fatima Z",
    driverAvatar: "FZ",
    driverRating: 4.6,
    vehicle: "Hyundai Tucson",
    plate: "TN-3456-D",
    pickup: "Lac Business District",
    drop: "Hammamet Resort",
    vehicleType: "SUV",
    date: "Mar 7, 2026",
    time: "13:45",
    fare: 120,
    distance: "65 km",
    duration: "55 min",
    passengerCount: 6,
    status: "completed",
    riderRating: 5,
    paymentMethod: "Card",
  },
  {
    id: 5,
    rider: "Nadia R",
    driver: "Rami B",
    driverAvatar: "RB",
    driverRating: 4.9,
    vehicle: "BMW 5 Series",
    plate: "TN-7890-E",
    pickup: "Sfax City Center",
    drop: "Sfax Airport",
    vehicleType: "Sedan",
    date: "Mar 6, 2026",
    time: "14:00",
    fare: 22,
    distance: "9 km",
    duration: "15 min",
    passengerCount: 1,
    status: "completed",
    riderRating: 4,
    paymentMethod: "Cash",
  },
  {
    id: 6,
    rider: "Youssef A",
    driver: "John D",
    driverAvatar: "JD",
    driverRating: 4.9,
    vehicle: "Toyota Corolla",
    plate: "TN-1234-A",
    pickup: "Sousse Medina",
    drop: "Port El Kantaoui",
    vehicleType: "Sedan",
    date: "Mar 6, 2026",
    time: "09:00",
    fare: 55,
    distance: "14 km",
    duration: "20 min",
    passengerCount: 3,
    status: "completed",
    riderRating: 5,
    paymentMethod: "Card",
  },
  {
    id: 7,
    rider: "Sara M",
    driver: "Emily R",
    driverAvatar: "ER",
    driverRating: 4.7,
    vehicle: "Kia Rio",
    plate: "TN-5678-B",
    pickup: "City Center, Tunis",
    drop: "Tunis-Carthage Airport",
    vehicleType: "Sedan",
    date: "Mar 5, 2026",
    time: "07:45",
    fare: 30,
    distance: "12 km",
    duration: "25 min",
    passengerCount: 1,
    status: "cancelled",
    riderRating: null,
    paymentMethod: "Card",
  },
  {
    id: 8,
    rider: "Ali K",
    driver: "Ahmed K",
    driverAvatar: "AK",
    driverRating: 4.8,
    vehicle: "Mercedes Vito",
    plate: "TN-9012-C",
    pickup: "Hammamet Resort",
    drop: "Lac Business District",
    vehicleType: "Van",
    date: "Mar 5, 2026",
    time: "16:30",
    fare: 115,
    distance: "63 km",
    duration: "53 min",
    passengerCount: 5,
    status: "completed",
    riderRating: 3,
    paymentMethod: "Cash",
  },
];

/* ─── TABLE STYLES ───────────────────────────────────────────────────── */
const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-muted)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};
const TD: React.CSSProperties = {
  padding: "0 1rem",
  height: ROW_H,
  fontSize: ".85rem",
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border-row)",
  verticalAlign: "middle",
  lineHeight: 1.6,
};

/* ─── STAR DISPLAY ───────────────────────────────────────────────────── */
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".15rem" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarRoundedIcon
          key={i}
          style={{
            fontSize: 12,
            color: i <= rating ? "#f59e0b" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── PAGINATION ─────────────────────────────────────────────────────── */
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
    borderRadius: "var(--r-inner)",
    border: "1px solid var(--border)",
    background: active
      ? "var(--brand-from)"
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
    transition: "all var(--t-fast)",
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

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function PastRidesPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | RideStatus>("All");
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState<PastRide | null>(null);

  const STATUSES: ("All" | RideStatus)[] = ["All", "completed", "cancelled"];

  const filtered = MOCK_PAST.filter((r) => {
    const matchSearch =
      r.rider.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.pickup.toLowerCase().includes(search.toLowerCase()) ||
      r.drop.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  const completed = MOCK_PAST.filter((r) => r.status === "completed");
  const totalFare = completed.reduce((s, r) => s + r.fare, 0);

  const statCards = [
    {
      label: "Total Rides",
      value: MOCK_PAST.length,
      icon: <DirectionsCarRoundedIcon style={{ fontSize: 18 }} />,
      iconBg: "var(--driver-bg)",
      iconFg: "var(--driver-fg)",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: <CheckCircleRoundedIcon style={{ fontSize: 18 }} />,
      iconBg: "var(--active-bg)",
      iconFg: "var(--active-fg)",
    },
    {
      label: "Cancelled",
      value: MOCK_PAST.length - completed.length,
      icon: <CancelRoundedIcon style={{ fontSize: 18 }} />,
      iconBg: "var(--blocked-bg)",
      iconFg: "var(--blocked-fg)",
    },
    {
      label: "Total Revenue",
      value: `$${totalFare}`,
      icon: <TrendingUpRoundedIcon style={{ fontSize: 18 }} />,
      iconBg: "var(--rider-bg)",
      iconFg: "var(--rider-fg)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
      }}
    >
      {detailModal && (
        <PastRideDetailsModal
          ride={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}

      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Past Rides</h1>
          <p className="ts-page-subtitle">
            Completed and cancelled ride history
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: ".75rem",
        }}
      >
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="ts-card ts-stat-card"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: ".75rem",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--r-inner)",
                background: stat.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.iconFg,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="ts-stat-label">{stat.label}</p>
              <p className="ts-stat-value" style={{ fontSize: "1.1rem" }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="ts-filter-bar">
        <div className="ts-search-bar" style={{ flex: 1, maxWidth: 280 }}>
          <SearchRoundedIcon style={{ fontSize: 14 }} />
          <input
            placeholder="Search rider, driver, location…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div style={{ display: "flex", gap: ".25rem" }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`ts-filter-chip${filterStatus === s ? " ts-active" : ""}`}
              onClick={() => {
                setFilterStatus(s);
                setPage(1);
              }}
              style={{ textTransform: "capitalize" }}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ts-record-count">
          {filtered.length} ride{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

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
              <col style={{ width: "11%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "7%" }} />
            </colgroup>
            <thead>
              <tr>
                {[
                  "Rider",
                  "Driver & Vehicle",
                  "Route",
                  "Date & Time",
                  "Fare / Distance",
                  "Rating",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={TH}>
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
                      colSpan={8}
                      style={{
                        ...TD,
                        textAlign: "center",
                        color: "var(--text-faint)",
                      }}
                    >
                      No past rides match your filters.
                    </td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={8}
                        style={{ borderBottom: "1px solid var(--border-row)" }}
                      />
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {paged.map((ride) => (
                    <tr
                      key={ride.id}
                      className="ts-tr"
                      style={{ height: ROW_H }}
                    >
                      {/* ── Rider ── */}
                      <td style={TD}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: ".85rem",
                            color: "var(--text-h)",
                            margin: 0,
                          }}
                        >
                          {ride.rider}
                        </p>
                        <p
                          style={{
                            fontSize: ".72rem",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          <PersonRoundedIcon
                            style={{ fontSize: 10, verticalAlign: "middle" }}
                          />{" "}
                          {ride.passengerCount} pax
                        </p>
                      </td>

                      {/* ── Driver & Vehicle ── */}
                      <td style={TD}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: ".85rem",
                            color: "var(--text-h)",
                            margin: 0,
                          }}
                        >
                          {ride.driver}
                        </p>
                        <p
                          style={{
                            fontSize: ".72rem",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          {ride.vehicle}
                        </p>
                      </td>

                      {/* ── Route ── */}
                      <td style={{ ...TD, overflow: "hidden" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "stretch",
                            gap: ".6rem",
                          }}
                        >
                          {/* Icons + connecting line */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                              paddingTop: ".1rem",
                              paddingBottom: ".1rem",
                            }}
                          >
                            <div
                              style={{
                                width: 11,
                                height: 11,
                                borderRadius: "50%",
                                background: "#7c3aed",
                                border: "2.5px solid #ede9fe",
                                flexShrink: 0,
                              }}
                            />
                            <div
                              style={{
                                width: 1.5,
                                flex: 1,
                                background: "var(--border)",
                                margin: "3px 0",
                              }}
                            />
                            <LocationOnRoundedIcon
                              style={{
                                fontSize: 14,
                                color: "#7c3aed",
                                flexShrink: 0,
                                marginBottom: "-2px",
                              }}
                            />
                          </div>
                          {/* Text */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              gap: ".3rem",
                              overflow: "hidden",
                              flex: 1,
                            }}
                          >
                            <span
                              style={{
                                fontSize: ".73rem",
                                color: "var(--text-body)",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ride.pickup}
                            </span>
                            <span
                              style={{
                                fontSize: ".73rem",
                                color: "var(--text-body)",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {ride.drop}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ── Date & Time ── */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".35rem",
                            marginBottom: ".35rem",
                          }}
                        >
                          <AccessTimeRoundedIcon
                            style={{ fontSize: 13, color: "var(--text-muted)" }}
                          />
                          <span
                            style={{
                              fontSize: ".8rem",
                              fontWeight: 600,
                              color: "var(--text-h)",
                            }}
                          >
                            {ride.time}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: ".72rem",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          {ride.date}
                        </p>
                      </td>

                      {/* ── Fare / Distance ── */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".25rem",
                            marginBottom: ".35rem",
                          }}
                        >
                          <AttachMoneyRoundedIcon
                            style={{ fontSize: 13, color: "var(--active-fg)" }}
                          />
                          <span
                            style={{
                              fontSize: ".82rem",
                              fontWeight: 700,
                              color: "var(--text-h)",
                            }}
                          >
                            ${ride.fare}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".25rem",
                          }}
                        >
                          <RouteRoundedIcon
                            style={{ fontSize: 12, color: "var(--text-faint)" }}
                          />
                          <span
                            style={{
                              fontSize: ".72rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {ride.distance} · {ride.duration}
                          </span>
                        </div>
                      </td>

                      {/* ── Rating ── */}
                      <td style={TD}>
                        {ride.riderRating !== null ? (
                          <StarDisplay rating={ride.riderRating} />
                        ) : (
                          <span
                            style={{
                              fontSize: ".72rem",
                              color: "var(--text-faint)",
                              fontStyle: "italic",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>

                      {/* ── Status ── */}
                      <td style={TD}>
                        <span
                          className={`ts-pill ${ride.status === "completed" ? "ts-pill-active" : "ts-pill-blocked"}`}
                          style={{ textTransform: "capitalize" }}
                        >
                          {ride.status === "completed" ? (
                            <>
                              <CheckCircleRoundedIcon
                                style={{
                                  fontSize: 10,
                                  verticalAlign: "middle",
                                  marginRight: ".2rem",
                                }}
                              />
                              Completed
                            </>
                          ) : (
                            <>
                              <CancelRoundedIcon
                                style={{
                                  fontSize: 10,
                                  verticalAlign: "middle",
                                  marginRight: ".2rem",
                                }}
                              />
                              Cancelled
                            </>
                          )}
                        </span>
                      </td>

                      {/* ── Actions ── */}
                      <td style={TD}>
                        <button
                          className="ts-icon-btn"
                          title="View Details"
                          style={{ width: 30, height: 30 }}
                          onClick={() => setDetailModal(ride)}
                        >
                          <VisibilityRoundedIcon style={{ fontSize: 15 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={8}
                        style={{ borderBottom: "1px solid var(--border-row)" }}
                      />
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
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
