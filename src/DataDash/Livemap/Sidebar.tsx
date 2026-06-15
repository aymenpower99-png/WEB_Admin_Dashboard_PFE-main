import { Search } from "lucide-react";
import { C } from "../tokens";
import type { Driver } from "./types";
import { DriverCard } from "./DriverCard";

interface SidebarCounts {
  total: number;
  online: number;
  enRoute: number;
  offline: number;
}

export function Sidebar({
  filtered,
  selectedId,
  search,
  statusFilter,
  counts,
  dark,
  onSelect,
  onSearchChange,
  onStatusFilterChange,
  onDriverClick,
}: {
  filtered: Driver[];
  selectedId: string | null;
  search: string;
  statusFilter: string;
  counts: SidebarCounts;
  dark: boolean;
  onSelect: (id: string | null) => void;
  onSearchChange: (v: string) => void;
  onStatusFilterChange: (v: string) => void;
  onDriverClick: (driver: Driver) => void;
}) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;

  return (
    <div
      style={{
        width: 300,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflowY: "auto",
      }}
    >
      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
        }}
      >
        {[
          { label: "Online", value: counts.online, color: C.success },
          { label: "En Route", value: counts.enRoute, color: C.primaryPurple },
          { label: "Offline", value: counts.offline, color: C.gray7B },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border p-3 text-center"
            style={{ background: surface, borderColor: border }}
          >
            <p style={{ fontSize: 20, fontWeight: 700, color }}>{value}</p>
            <p
              style={{
                fontSize: 10,
                color: sub,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div
        className="rounded-xl border p-3"
        style={{ background: surface, borderColor: border }}
      >
        <div
          className="flex items-center gap-2 rounded-lg px-3 h-8 mb-2"
          style={{ background: dark ? C.darkBorder : C.grayE6 }}
        >
          <Search size={13} color={sub} />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search driver or ID…"
            className="bg-transparent outline-none text-xs w-full"
            style={{ color: text }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["ALL", "ACTIVE", "EN ROUTE", "OFFLINE"].map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className="px-2 py-1 rounded text-xs font-semibold transition-all"
              style={{
                background:
                  statusFilter === s
                    ? C.primaryPurple
                    : dark
                      ? C.darkBorder
                      : C.grayE6,
                color: statusFilter === s ? "#fff" : sub,
                border: "none",
              }}
            >
              {s === "ALL"
                ? "All"
                : s === "ACTIVE"
                  ? "Available"
                  : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Driver list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <p
            style={{
              fontSize: 12,
              color: sub,
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No drivers found
          </p>
        ) : (
          filtered.map((d) => (
            <DriverCard
              key={d.id}
              driver={d}
              selected={d.id === selectedId}
              onClick={() => {
                onSelect(d.id === selectedId ? null : d.id);
                onDriverClick(d);
              }}
              dark={dark}
            />
          ))
        )}
      </div>
    </div>
  );
}
