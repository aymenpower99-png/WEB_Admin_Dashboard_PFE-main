import { useState } from "react";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import "./travelsync-design-system.css";

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <DashboardRoundedIcon style={{ fontSize: 18 }} />,
  people: <PeopleAltRoundedIcon style={{ fontSize: 18 }} />,
  flight: <FlightTakeoffRoundedIcon style={{ fontSize: 18 }} />,
  payments: <PaymentsRoundedIcon style={{ fontSize: 18 }} />,
  headset_mic: <HeadsetMicRoundedIcon style={{ fontSize: 18 }} />,
  tune: <TuneRoundedIcon style={{ fontSize: 18 }} />,
  shield: <ShieldRoundedIcon style={{ fontSize: 18 }} />,
  directions_car: <DirectionsCarRoundedIcon style={{ fontSize: 18 }} />,
  badge: <BadgeRoundedIcon style={{ fontSize: 18 }} />,
  business_center: <BusinessCenterRoundedIcon style={{ fontSize: 18 }} />,
  person: <PersonRoundedIcon style={{ fontSize: 18 }} />,
  map: <MapRoundedIcon style={{ fontSize: 18 }} />,
};

interface NavItem {
  label: string;
  icon: string;
  page: string;
  children?: { label: string; page: string }[];
}

const NAV_GROUPS: { section: string; items: NavItem[] }[] = [
  {
    section: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: "dashboard", page: "dashboard" },
      {
        label: "Agency Dashboard",
        icon: "dashboard",
        page: "agency-dashboard",
      },
    ],
  },

  {
    section: "USERS",
    items: [{ label: "Users", icon: "people", page: "users" }],
  },

  {
    section: "DRIVERS & VEHICLES",
    items: [
      {
        label: "Drivers",
        icon: "person",
        page: "drivers",
        children: [
          { label: "Drivers", page: "drivers" },
          { label: "Add Driver", page: "agency-drivers" },
        ],
      },
      {
        label: "Vehicles",
        icon: "directions_car",
        page: "vehicles",
        children: [
          { label: "Vehicles", page: "vehicles" },
          { label: "Add Vehicle", page: "agency-vehicles" },
        ],
      },
    ],
  },

  {
    section: "RIDES",
    items: [
      { label: "Trips", icon: "flight", page: "trips" },
      {
        label: "Rides",
        icon: "directions_car",
        page: "rides",
        children: [
          { label: "Available Rides", page: "available-rides" },
          { label: "Past Rides", page: "past-rides" },
        ],
      },
    ],
  },

  {
    section: "BILLING",
    items: [
      { label: "Payments", icon: "payments", page: "payments" },
      { label: "Agency Billing", icon: "payments", page: "agency-billing" },
    ],
  },

  {
    section: "AGENCY",
    items: [{ label: "Work Area", icon: "map", page: "work-area" }],
  },

  {
    section: "SUPPORT & SETTINGS",
    items: [
      { label: "Help center", icon: "headset_mic", page: "help" },
      { label: "Settings", icon: "tune", page: "settings" },
      { label: "Security", icon: "shield", page: "security" },
    ],
  },
];

interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({
  dark,
  onToggleDark,
  activePage,
  onNavigate,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (label: string) =>
    setExpanded((p) => ({ ...p, [label]: !p[label] }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 0,
      }}
    >
      {/* ── Nav groups ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          flex: 1,
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.section}>
            <div className="ts-section-label">{group.section}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isExp = !!expanded[item.label];
                const isChildActive =
                  item.children?.some((c) => c.page === activePage) ?? false;
                // Parent gets solid active style only when on its own page AND no child is selected
                const isParentActive =
                  activePage === item.page && !isChildActive;

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        onNavigate(item.page);
                        if (hasChildren) toggle(item.label);
                      }}
                      className={`ts-nav-item${isParentActive ? " ts-nav-active" : ""}`}
                      style={{
                        justifyContent: "space-between",
                        ...(isChildActive
                          ? {
                              background: "var(--brand-soft)",
                              color: "#7c3aed",
                            }
                          : {}),
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: 20,
                            height: 20,
                          }}
                        >
                          {ICON_MAP[item.icon]}
                        </span>
                        {item.label}
                      </span>
                      {hasChildren && (
                        <ExpandMoreRoundedIcon
                          style={{
                            fontSize: 16,
                            color: isChildActive
                              ? "#7c3aed"
                              : isParentActive
                                ? "rgba(255,255,255,0.7)"
                                : "var(--text-faint)",
                            transition: "transform .2s",
                            transform: isExp
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      )}
                    </button>

                    {/* Sub-menu — only renders when expanded */}
                    {hasChildren && isExp && (
                      <div
                        style={{
                          marginLeft: "1.75rem",
                          marginTop: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          borderLeft: "1px solid var(--border)",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        {item.children!.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => onNavigate(child.page)}
                            className={`ts-nav-item${activePage === child.page ? " ts-nav-active" : ""}`}
                            style={{ fontSize: "0.8125rem" }}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── User footer ── */}
      <div className="ts-sidebar-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="ts-sidebar-avatar">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Alex"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="ts-td-h"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Alex Martin
            </div>
            <div className="ts-faint" style={{ fontSize: "0.75rem" }}>
              Super admin
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onToggleDark} className="ts-sidebar-util">
              {dark ? "☀" : "🌙"}
            </button>
            <button
              onClick={() => window.history.back()}
              className="ts-sidebar-util"
            >
              ↩
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}