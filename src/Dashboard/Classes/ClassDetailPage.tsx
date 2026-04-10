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

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_META: Record<string, { pill: string }> = {
  Available:   { pill: "bg-emerald-50 text-emerald-600 border border-emerald-200" },
  Pending:     { pill: "bg-amber-50 text-amber-600 border border-amber-200" },
  On_Trip:     { pill: "bg-indigo-50 text-indigo-500 border border-indigo-200" },
  Maintenance: { pill: "bg-red-50 text-red-500 border border-red-200" },
};

// ── Feature chip ──────────────────────────────────────────────────────────────
function FeatureChip({
  icon,
  label,
  on,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all
        ${on
          ? "bg-violet-50 text-violet-700 border-violet-200"
          : "bg-transparent text-gray-300 border-gray-100 line-through opacity-60"
        }`}
    >
      <span className={`flex items-center ${on ? "text-violet-500" : "text-gray-300"}`}>
        {icon}
      </span>
      {label}
    </span>
  );
}

interface ClassDetailPageProps {
  classId: string;
  onNavigate: (page: string, prefill?: any) => void;
}

// ═════════════════════════════════════════════════════════════════════════════
export default function ClassDetailPage({ classId, onNavigate }: ClassDetailPageProps) {
  const [detail, setDetail] = useState<VehicleClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<ClassVehicle | null>(null);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    setSelectedVehicle(null);
    classesApi
      .getDetail(classId)
      .then(setDetail)
      .catch(() => setError("Failed to load class details."))
      .finally(() => setLoading(false));
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

  // ══════════════════════════════════════════════════════════════════════════
  // VEHICLE DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (selectedVehicle) {
    const v = selectedVehicle;
    const thumb = v.photos?.[0];
    const sm = STATUS_META[v.status] ?? { pill: "bg-gray-100 text-gray-500 border border-gray-200" };

    return (
      <div className="flex flex-col gap-4 p-6 bg-[#f2f2f7] min-h-screen">
        <button
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit font-medium"
          onClick={() => setSelectedVehicle(null)}
        >
          <ArrowBackRoundedIcon style={{ fontSize: 15 }} />
          Back to Class
        </button>

        <div className="flex gap-5 flex-wrap items-start">
          {/* Photo card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 w-72 shrink-0">
            <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
              {thumb ? (
                <img src={thumb} alt="" className="w-full h-full object-cover" />
              ) : (
                <DirectionsCarRoundedIcon className="text-gray-300 !text-5xl" />
              )}
            </div>
            <div className="text-base font-bold text-gray-900">{v.make} {v.model}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Status</span>
              <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${sm.pill}`}>
                {v.status === "On_Trip" ? "On Trip" : v.status}
              </span>
            </div>
          </div>

          {/* Attributes card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 flex-1 min-w-64">
            <div className="text-sm font-bold text-gray-900 mb-2">Attributes</div>
            {(
              [
                { label: "Make", value: v.make },
                { label: "Model", value: v.model },
                { label: "Year", value: String(v.year) },
                { label: "Color", value: v.color ?? "—" },
                {
                  label: "Plate",
                  value: v.licensePlate ? (
                    <span className="font-mono bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs">
                      {v.licensePlate}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  ),
                },
                { label: "Active", value: v.isActive ? "Yes" : "No" },
                {
                  label: "Driver",
                  value: v.driverId ? (
                    <span className="font-semibold text-gray-700">Assigned</span>
                  ) : (
                    <span className="text-gray-300">Unassigned</span>
                  ),
                },
              ] as { label: string; value: React.ReactNode }[]
            ).map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
              >
                <span className="w-20 text-xs font-semibold text-gray-400 shrink-0">{row.label}</span>
                <span className="text-sm text-gray-700">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN CLASS DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-4 p-6 bg-[#f2f2f7] min-h-screen">

      {/* ← Back to Classes */}
      <button
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit font-medium"
        onClick={() => onNavigate("classes")}
      >
        <ArrowBackRoundedIcon style={{ fontSize: 15 }} />
        Back to Classes
      </button>

      {/* Two-column layout */}
      <div className="flex gap-4 items-start flex-wrap">

        {/* ── LEFT: Class Overview — fixed 310px width, auto height ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 w-[310px] shrink-0 self-start">

          <div className="text-base font-bold text-gray-900">Class Overview</div>

          {/* Vehicle image — 155px tall matching screenshot */}
          {detail.imageUrl ? (
            <div className="w-full h-[155px] rounded-xl overflow-hidden border border-gray-100">
              <img
                src={detail.imageUrl}
                alt={detail.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-[155px] rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <DirectionsCarRoundedIcon className="text-gray-300 !text-5xl" />
            </div>
          )}

          {/* Class name */}
          <div className="text-[15px] font-bold text-gray-900">{detail.name}</div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-1.5">
            <FeatureChip
              icon={<AirlineSeatReclineExtraRoundedIcon style={{ fontSize: 12 }} />}
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

        {/* ── RIGHT: Assigned Vehicles — compact/minimized ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 min-w-[300px] overflow-hidden self-start">

          {/* Card header */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">
              Assigned Vehicles ({detail.vehicleCount})
            </span>
            <button
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              onClick={() => onNavigate("agency-vehicles")}
            >
              + Add Vehicle
            </button>
          </div>

          {/* Empty state */}
          {detail.vehicles.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400 flex flex-col items-center gap-3">
              No vehicles assigned to this class yet.
              <button
                className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                onClick={() => onNavigate("agency-vehicles")}
              >
                + Add first vehicle
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Vehicle", "Year", "Color", "Driver", "Status", ""].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-2.5 text-left text-xs font-medium text-gray-400 border-b border-gray-100 whitespace-nowrap bg-transparent"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.vehicles.map((v: ClassVehicle) => (
                  <VehicleRow key={v.id} v={v} onView={() => setSelectedVehicle(v)} />
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Vehicle row — compact, minimized ─────────────────────────────────────────
function VehicleRow({ v, onView }: { v: ClassVehicle; onView: () => void }) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[v.status] ?? { pill: "bg-gray-100 text-gray-500 border border-gray-200" };

  return (
    <tr
      className={`transition-colors duration-100 ${hov ? "bg-gray-50" : "bg-white"}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Vehicle */}
      <td className="px-5 py-2.5 text-sm font-semibold text-gray-900 border-b border-gray-50 whitespace-nowrap">
        {v.make} {v.model}
      </td>

      {/* Year */}
      <td className="px-5 py-2.5 text-sm text-gray-600 border-b border-gray-50">
        {v.year}
      </td>

      {/* Color */}
      <td className="px-5 py-2.5 text-sm text-gray-600 border-b border-gray-50">
        {v.color ?? "—"}
      </td>

      {/* Driver */}
      <td className={`px-5 py-2.5 text-sm border-b border-gray-50 ${v.driverId ? "text-gray-700" : "text-gray-300"}`}>
        {v.driverId ? "Ahmed Hassan" : "Unassigned"}
      </td>

      {/* Status */}
      <td className="px-5 py-2.5 border-b border-gray-50">
        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap ${sm.pill}`}>
          {v.status === "On_Trip" ? "On Trip" : v.status}
        </span>
      </td>

      {/* View icon */}
      <td
        className="px-3 py-2.5 border-b border-gray-50 text-center w-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          title="View vehicle details"
          onClick={onView}
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-transparent text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition-all cursor-pointer border-none"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </td>
    </tr>
  );
}