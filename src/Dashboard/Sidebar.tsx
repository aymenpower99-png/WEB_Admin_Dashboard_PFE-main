import { useState, useRef, useLayoutEffect } from "react";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import "./travelsync-design-system.css";

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard:        <DashboardRoundedIcon       style={{ fontSize: 22 }} />,
  people:           <PeopleAltRoundedIcon       style={{ fontSize: 22 }} />,
  flight:           <FlightTakeoffRoundedIcon   style={{ fontSize: 22 }} />,
  payments:         <PaymentsRoundedIcon        style={{ fontSize: 22 }} />,
  headset_mic:      <HeadsetMicRoundedIcon      style={{ fontSize: 22 }} />,
  manage_accounts:  <ManageAccountsRoundedIcon  style={{ fontSize: 22 }} />,
  directions_car:   <DirectionsCarRoundedIcon   style={{ fontSize: 22 }} />,
  person:           <PersonRoundedIcon          style={{ fontSize: 22 }} />,
  map:              <MapRoundedIcon             style={{ fontSize: 22 }} />,
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
      { label: "Dashboard",        icon: "dashboard", page: "dashboard" },
      { label: "Agency Dashboard", icon: "dashboard", page: "agency-dashboard" },
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
          { label: "Drivers",    page: "drivers" },
          { label: "Add Driver", page: "agency-drivers" },
        ],
      },
      {
        label: "Vehicles",
        icon: "directions_car",
        page: "vehicles",
        children: [
          { label: "Vehicles",    page: "vehicles" },
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
          { label: "Upcoming Rides",  page: "upcoming-rides" },
          { label: "Past Rides",      page: "past-rides" },
        ],
      },
    ],
  },
  {
    section: "BILLING",
    items: [
      { label: "Payments",       icon: "payments", page: "payments" },
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
      {
        label: "Settings",
        icon: "manage_accounts",
        page: "settings",
        children: [
          { label: "Help Center", page: "help" },
          { label: "Settings",    page: "settings" },
        ],
      },
    ],
  },
];

// Animated dropdown container
function AnimatedDropdown({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // useLayoutEffect runs synchronously after DOM mutations but before paint,
  // which avoids the "setState in effect" cascading-render lint warning while
  // still correctly measuring scrollHeight before the browser paints.
  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(isOpen ? ref.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: height,
        // Fix: was two separate `transition` keys (duplicate) — merged into one value
        transition: "height 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={ref}>
        <div
          style={{
            marginLeft: "2.25rem",
            marginTop: 6,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            borderLeft: "1px solid var(--border)",
            paddingLeft: "1.125rem",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const getInitialExpanded = () => {
    const result: Record<string, boolean> = {};
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (item.children?.some((c) => c.page === activePage)) {
          result[item.label] = true;
        }
      }
    }
    return result;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded);

  // Accordion: only one open at a time
  const toggle = (label: string) =>
    setExpanded((p) => ({ [label]: !p[label] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", flex: 1 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.section}>
            <div className="ts-section-label">{group.section}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((item) => {
                const hasChildren    = !!item.children?.length;
                const isExp          = !!expanded[item.label];
                const isChildActive  = item.children?.some((c) => c.page === activePage) ?? false;
                const isParentActive = activePage === item.page && !isChildActive;

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggle(item.label);
                        } else {
                          onNavigate(item.page);
                        }
                      }}
                      className={`ts-nav-item${isParentActive ? " ts-nav-active" : ""}`}
                      style={{
                        justifyContent: "space-between",
                        ...(isChildActive
                          ? { background: "var(--brand-soft)", color: "#7c3aed" }
                          : {}),
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <span style={{ display: "flex", alignItems: "center", width: 24, height: 24 }}>
                          {ICON_MAP[item.icon]}
                        </span>
                        {item.label}
                      </span>
                      {hasChildren && (
                        <ExpandMoreRoundedIcon
                          style={{
                            fontSize: 20,
                            color: isChildActive
                              ? "#7c3aed"
                              : isParentActive
                              ? "rgba(255,255,255,0.7)"
                              : "var(--text-faint)",
                            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: isExp ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      )}
                    </button>

                    {hasChildren && (
                      <AnimatedDropdown isOpen={isExp}>
                        {item.children!.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => onNavigate(child.page)}
                            className={`ts-nav-item${activePage === child.page ? " ts-nav-active" : ""}`}
                            style={{ fontSize: "0.9375rem" }}
                          >
                            {child.label}
                          </button>
                        ))}
                      </AnimatedDropdown>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}