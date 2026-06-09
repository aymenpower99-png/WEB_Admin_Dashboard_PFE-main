import { useState, useEffect } from "react";
import "../travelsync-design-system.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import AirlineSeatReclineExtraRoundedIcon from "@mui/icons-material/AirlineSeatReclineExtraRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import { classesApi } from "../../api/classes";
import type { VehicleClassDetail, ClassVehicle } from "../../api/classes";

// ── Table header styles — mirrors ClassesPage exactly ────────────────────────
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

const ROW_H = 64;

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_META: Record<string, { pill: string }> = {
  Available: {
    pill: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  Pending: { pill: "bg-amber-50 text-amber-600 border border-amber-200" },
  On_Trip: { pill: "bg-indigo-50 text-indigo-500 border border-indigo-200" },
  Maintenance: { pill: "bg-red-50 text-red-500 border border-red-200" },
};

// ── Feature chip — only rendered when on=true ─────────────────────────────────
function FeatureChip({
  icon,
  label,
  on,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
}) {
  if (!on) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-violet-50 text-violet-700 border-violet-200">
      <span className="flex items-center text-violet-500">{icon}</span>
      {label}
    </span>
  );
}

interface ClassDetailPageProps {
  classId: string;
  onNavigate: (page: string, prefill?: any) => void;
}

// ═════════════════════════════════════════════════════════════════════════════
export default function ClassDetailPage({
  classId,
  onNavigate,
}: ClassDetailPageProps) {
  const [detail, setDetail] = useState<VehicleClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadDetail() {
    if (!classId) return;
    setLoading(true);
    setError(null);
    classesApi
      .getDetail(classId)
      .then(setDetail)
      .catch(() => setError("Failed to load class details."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDetail();
  }, [classId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-400">
        Loading class details…
      </div>
    );

  if (error || !detail)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sm text-red-500 gap-3">
        {error ?? "Class not found."}
        <button
          className="text-gray-500 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          onClick={() => onNavigate("classes")}
        >
          ← Back to Classes
        </button>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* ← Back */}
      <button
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit font-medium"
        onClick={() => onNavigate("classes")}
      >
        <ArrowBackRoundedIcon style={{ fontSize: 15 }} />
        Back to Classes
      </button>

      {/* Two-column layout */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* ── LEFT: Class Overview ── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 shrink-0 self-start"
          style={{ width: 400, minHeight: 450 }}
        >
          <div className="text-base font-bold text-gray-900">
            Class Overview
          </div>

          {detail.imageUrl ? (
            <div
              className="w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center"
              style={{ minHeight: 240 }}
            >
              <img
                src={detail.imageUrl}
                alt={detail.name}
                className="w-full h-full object-contain"
                style={{ maxHeight: 280 }}
              />
            </div>
          ) : (
            <div
              className="w-full rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"
              style={{ minHeight: 240 }}
            >
              <DirectionsCarRoundedIcon className="text-gray-300 !text-5xl" />
            </div>
          )}

          <div className="text-[15px] font-bold text-gray-900">
            {detail.name}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FeatureChip
              icon={
                <AirlineSeatReclineExtraRoundedIcon style={{ fontSize: 12 }} />
              }
              label={`${detail.features.seats} Seats`}
              on={true}
            />
            <FeatureChip
              icon={<LuggageRoundedIcon style={{ fontSize: 12 }} />}
              label={`${detail.features.bags} Bags`}
              on={true}
            />
            <FeatureChip
              icon={<WifiRoundedIcon style={{ fontSize: 12 }} />}
              label="Wifi"
              on={detail.features.wifi}
            />
            <FeatureChip
              icon={<AcUnitRoundedIcon style={{ fontSize: 12 }} />}
              label="A/C"
              on={detail.features.ac}
            />
            <FeatureChip
              icon={<WaterDropRoundedIcon style={{ fontSize: 12 }} />}
              label="Water"
              on={detail.features.water}
            />
            <FeatureChip
              icon={<AccessTimeRoundedIcon style={{ fontSize: 12 }} />}
              label={`${detail.features.freeWaitingTime}min Wait`}
              on={true}
            />
            <FeatureChip
              icon={<DoorFrontRoundedIcon style={{ fontSize: 12 }} />}
              label="Door-to-Door"
              on={detail.features.doorToDoor}
            />
            <FeatureChip
              icon={<EmojiPeopleRoundedIcon style={{ fontSize: 12 }} />}
              label="Meet & Greet"
              on={detail.features.meetAndGreet}
            />
          </div>
        </div>

        {/* ── RIGHT: Assigned Vehicles — proper table ── */}
        <div
          className="ts-table-wrap"
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "0.75rem 1.25rem",
              fontWeight: 700,
              fontSize: ".9rem",
              color: "var(--text-heading, #111)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            Assigned Vehicles ({detail.vehicleCount})
          </div>

          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "24%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>Vehicle</th>
                  <th style={TH}>Year</th>
                  <th style={TH}>Color</th>
                  <th style={TH}>Driver</th>
                  <th style={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {detail.vehicles.length === 0 ? (
                  <tr style={{ height: ROW_H }}>
                    <td
                      colSpan={5}
                      style={{
                        height: ROW_H,
                        textAlign: "center",
                        color: "var(--text-faint)",
                        borderBottom: "1px solid var(--border)",
                        fontSize: ".85rem",
                      }}
                    >
                      No vehicles assigned to this class yet.
                    </td>
                  </tr>
                ) : (
                  detail.vehicles.map((v: ClassVehicle) => (
                    <VehicleRow key={v.id} v={v} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Vehicle table row ─────────────────────────────────────────────────────────
function VehicleRow({ v }: { v: ClassVehicle }) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[v.status] ?? {
    pill: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  const isOnTrip = v.status === "On_Trip";
  const statusLabel = isOnTrip ? "On Trip" : v.status;

  const TD: React.CSSProperties = {
    padding: "0 1.25rem",
    height: ROW_H,
    fontSize: ".85rem",
    color: "var(--text-body)",
    borderBottom: "1px solid var(--border)",
    background: hov ? "var(--bg-row-hover, #f9f9fb)" : "transparent",
    transition: "background 120ms",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Vehicle */}
      <td
        style={{ ...TD, fontWeight: 700, color: "var(--text-heading, #111)" }}
      >
        {v.make} {v.model}
      </td>

      {/* Year */}
      <td style={TD}>{v.year}</td>

      {/* Color */}
      <td
        style={{
          ...TD,
          color: v.color ? "var(--text-body)" : "var(--text-faint)",
        }}
      >
        {v.color ?? "—"}
      </td>

      {/* Driver — real name from backend */}
      <td
        style={{
          ...TD,
          color: v.driverName ? "var(--text-body)" : "var(--text-faint)",
          fontWeight: v.driverName ? 500 : undefined,
        }}
      >
        {v.driverName ?? "Unassigned"}
      </td>

      {/* Status */}
      <td style={TD}>
        <span
          className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap ${sm.pill}`}
        >
          {statusLabel}
        </span>
      </td>
    </tr>
  );
}
