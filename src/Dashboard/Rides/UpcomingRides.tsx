import { useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import TripOriginRoundedIcon from "@mui/icons-material/TripOriginRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import {
  ReassignDriverModal,
  EditTimeModal,
  UpcomingRideDetailsModal,
} from "./UpcomingRidesModals";
import type { UpcomingRide, AvailableDriver } from "./UpcomingRidesModals";

import NewBookingModal from "../NewBookingModal";
import type { NewBooking } from "../NewBookingModal";

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ROWS = 5;
const ROW_H = 96;

/* ─── HELPERS ────────────────────────────────────────────────────────── */
function fmt12(t: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function fmtDate(d: string) {
  if (!d) return "—";
  try {
    return new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

/* ─── MOCK DATA ──────────────────────────────────────────────────────── */
const MOCK_UPCOMING: UpcomingRide[] = [
  {
    id: 1,
    rider: "Lina B",
    driver: "John D",
    driverRating: 4.9,
    driverAvatar: "JD",
    vehicle: "Toyota Corolla",
    plate: "TN-1234-A",
    pickup: "Tunis-Carthage Airport",
    drop: "City Center, Tunis",
    vehicleType: "Sedan",
    date: "14 Mar 2025",
    time: "14:30",
    fare: 28,
    distance: "12 km",
    duration: "22 min",
    passengerCount: 1,
  },
  {
    id: 2,
    rider: "Ali K",
    driver: "Emily R",
    driverRating: 4.7,
    driverAvatar: "ER",
    vehicle: "Kia Rio",
    plate: "TN-5678-B",
    pickup: "City Mall, Tunis",
    drop: "La Marsa Beach",
    vehicleType: "Sedan",
    date: "16 Mar 2025",
    time: "16:00",
    fare: 32,
    distance: "15 km",
    duration: "28 min",
    passengerCount: 2,
  },
  {
    id: 3,
    rider: "Sara M",
    driver: "Ahmed K",
    driverRating: 4.8,
    driverAvatar: "AK",
    vehicle: "Mercedes Vito",
    plate: "TN-9012-C",
    pickup: "Bardo Museum",
    drop: "Hammamet Resort",
    vehicleType: "Van",
    date: "18 Mar 2025",
    time: "17:15",
    fare: 110,
    distance: "62 km",
    duration: "52 min",
    passengerCount: 5,
  },
  {
    id: 4,
    rider: "Karim T",
    driver: "Fatima Z",
    driverRating: 4.6,
    driverAvatar: "FZ",
    vehicle: "Hyundai Tucson",
    plate: "TN-3456-D",
    pickup: "Lac Business District",
    drop: "Sfax City Center",
    vehicleType: "SUV",
    date: "20 Mar 2025",
    time: "09:00",
    fare: 95,
    distance: "50 km",
    duration: "45 min",
    passengerCount: 3,
  },
  {
    id: 5,
    rider: "Nadia R",
    driver: "Rami B",
    driverRating: 4.9,
    driverAvatar: "RB",
    vehicle: "BMW 5 Series",
    plate: "TN-7890-E",
    pickup: "Sousse Medina",
    drop: "Port El Kantaoui",
    vehicleType: "Sedan",
    date: "21 Mar 2025",
    time: "11:30",
    fare: 55,
    distance: "14 km",
    duration: "20 min",
    passengerCount: 1,
  },
  {
    id: 6,
    rider: "Youssef A",
    driver: "John D",
    driverRating: 4.9,
    driverAvatar: "JD",
    vehicle: "Toyota Corolla",
    plate: "TN-1234-A",
    pickup: "Sfax Airport",
    drop: "El Mechtel Hotel",
    vehicleType: "Sedan",
    date: "22 Mar 2025",
    time: "14:00",
    fare: 42,
    distance: "9 km",
    duration: "15 min",
    passengerCount: 2,
  },
];

const VEHICLE_MODELS: Record<string, string> = {
  "Business Sedan": "Mercedes E-Class",
  "Luxury Van": "V-Class",
  "Premium SUV": "Range Rover",
};

let nextId = 100;

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
export default function UpcomingRidesPage({ dark }: { dark: boolean }) {
  const [rides, setRides] = useState<UpcomingRide[]>(MOCK_UPCOMING);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("All");
  const [page, setPage] = useState(1);
  const [reassignModal, setReassignModal] = useState<UpcomingRide | null>(null);
  const [editModal, setEditModal] = useState<UpcomingRide | null>(null);
  const [detailModal, setDetailModal] = useState<UpcomingRide | null>(null);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReassign = (rideId: number, driver: AvailableDriver) => {
    setRides((prev) =>
      prev.map((r) =>
        r.id === rideId
          ? {
              ...r,
              driver: driver.name,
              driverAvatar: driver.avatar,
              vehicle: driver.vehicle,
              plate: driver.plate,
              driverRating: driver.rating,
            }
          : r,
      ),
    );
    showToast(`Driver reassigned to ${driver.name}`);
  };

  const handleEditTime = (rideId: number, date: string, time: string) => {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, date, time } : r)),
    );
    showToast("Schedule updated successfully");
  };

  const handleCancel = (rideId: number) => {
    setRides((prev) => prev.filter((r) => r.id !== rideId));
    showToast("Ride cancelled");
  };

  const handleNewBooking = (nb: NewBooking) => {
    const newRide: UpcomingRide = {
      id: nextId++,
      rider: nb.passengerName,
      driver: nb.driver,
      driverRating: 4.8,
      driverAvatar: nb.driver.slice(0, 2).toUpperCase(),
      vehicle: VEHICLE_MODELS[nb.vehicle] ?? nb.vehicle,
      plate: "TN-NEW-X",
      pickup: nb.from,
      drop: nb.to,
      vehicleType: nb.vehicle,
      date: fmtDate(nb.date),
      time: nb.time,
      fare: 0,
      distance: "—",
      duration: "—",
      passengerCount: 1,
    };
    setRides((prev) => [newRide, ...prev]);
    showToast("New booking added successfully");
  };

  const DATES = ["All", "Today", "Tomorrow"];

  const filtered = rides.filter((r) => {
    const matchSearch =
      r.rider.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.pickup.toLowerCase().includes(search.toLowerCase()) ||
      r.drop.toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate === "All" || r.date === filterDate;
    return matchSearch && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ROWS, safePage * ROWS);
  const ghostCount = ROWS - paged.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
      }}
    >
      {/* ── Modals ── */}
      {showNewBooking && (
        <NewBookingModal
          dark={dark}
          onClose={() => setShowNewBooking(false)}
          onAdd={handleNewBooking}
        />
      )}
      {reassignModal && (
        <ReassignDriverModal
          ride={reassignModal}
          onClose={() => setReassignModal(null)}
          onReassign={handleReassign}
        />
      )}
      {editModal && (
        <EditTimeModal
          ride={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleEditTime}
        />
      )}
      {detailModal && (
        <UpcomingRideDetailsModal
          ride={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}

      {/* ── Page header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Upcoming Rides</h1>
          <p className="ts-page-subtitle">
            Scheduled trips with assigned drivers
          </p>
        </div>
        <button className="ts-btn-fab" onClick={() => setShowNewBooking(true)}>
          <span style={{ fontSize: "1.1rem", lineHeight: 1, flexShrink: 0 }}>
            ＋
          </span>
          <span className="ts-btn-fab-label">New Trip</span>
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="ts-filter-bar">
        <div className="ts-search-bar" style={{ flex: 1, maxWidth: 280 }}>
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
          {DATES.map((d) => (
            <button
              key={d}
              className={`ts-filter-chip${filterDate === d ? " ts-active" : ""}`}
              onClick={() => {
                setFilterDate(d);
                setPage(1);
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="ts-record-count">
          {filtered.length} ride{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
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
              <col style={{ width: "15%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr>
                {[
                  "Rider",
                  "Driver & Vehicle",
                  "Route",
                  "Schedule",
                  "Status",
                  "Fare / Distance",
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
                      colSpan={7}
                      style={{
                        ...TD,
                        textAlign: "center",
                        color: "var(--text-faint)",
                      }}
                    >
                      No upcoming rides match your filters.
                    </td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={7}
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".3rem",
                          }}
                        >
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
                          <StarRoundedIcon
                            style={{ fontSize: 10, color: "#f59e0b" }}
                          />
                          <span
                            style={{
                              fontSize: ".68rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {ride.driverRating}
                          </span>
                        </div>
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
                                fontSize: ".75rem",
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
                                fontSize: ".75rem",
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

                      {/* ── Schedule ── */}
                      <td style={TD}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: ".85rem",
                            color: "var(--text-h)",
                            margin: "0 0 .2rem",
                          }}
                        >
                          {ride.date}
                        </p>
                        <p
                          style={{
                            fontSize: ".72rem",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          {fmt12(ride.time)}
                        </p>
                      </td>

                      {/* ── Status ── */}
                      <td style={TD}>
                        <span className="ts-pill ts-pill-active">
                          Scheduled
                        </span>
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

                      {/* ── Actions ── */}
                      <td style={TD}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".35rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="ts-btn-primary"
                            style={{
                              fontSize: ".7rem",
                              padding: ".3rem .7rem",
                            }}
                            onClick={() => setReassignModal(ride)}
                          >
                            <SwapHorizRoundedIcon style={{ fontSize: 12 }} />{" "}
                            Reassign
                          </button>
                          <button
                            className="ts-icon-btn"
                            title="Edit Schedule"
                            style={{ width: 30, height: 30 }}
                            onClick={() => setEditModal(ride)}
                          >
                            <EditRoundedIcon style={{ fontSize: 15 }} />
                          </button>
                          <button
                            className="ts-icon-btn"
                            title="View Details"
                            style={{ width: 30, height: 30 }}
                            onClick={() => setDetailModal(ride)}
                          >
                            <VisibilityRoundedIcon style={{ fontSize: 15 }} />
                          </button>
                          <button
                            className="ts-icon-btn ts-icon-btn-del"
                            title="Cancel Ride"
                            style={{ width: 30, height: 30 }}
                            onClick={() => handleCancel(ride.id)}
                          >
                            <CancelRoundedIcon style={{ fontSize: 15 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}>
                      <td
                        colSpan={7}
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

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 100,
            padding: ".625rem 1rem",
            borderRadius: "var(--r-inner)",
            background: "var(--bg-card)",
            color: "var(--text-h)",
            border: "1px solid var(--border)",
            fontSize: ".78rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            boxShadow: "var(--shadow-modal)",
            animation: "tsSettingsIn .25s ease",
          }}
        >
          <CheckRoundedIcon
            style={{ fontSize: 14, color: "var(--active-fg)" }}
          />{" "}
          {toast}
        </div>
      )}
    </div>
  );
}
