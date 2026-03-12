import { useState, useRef, useLayoutEffect } from "react";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import "./travelsync-design-system.css";

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard:        <DashboardRoundedIcon       style={{ fontSize: 20 }} />,
  people:           <PeopleAltRoundedIcon       style={{ fontSize: 20 }} />,
  payments:         <PaymentsRoundedIcon        style={{ fontSize: 20 }} />,
  manage_accounts:  <ManageAccountsRoundedIcon  style={{ fontSize: 20 }} />,
  directions_car:   <DirectionsCarRoundedIcon   style={{ fontSize: 20 }} />,
  person:           <PersonRoundedIcon          style={{ fontSize: 20 }} />,
  map:              <MapRoundedIcon             style={{ fontSize: 20 }} />,
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
        page: "drivers-parent",
        children: [
          { label: "Drivers",    page: "drivers" },
          { label: "Add Driver", page: "agency-drivers" },
        ],
      },
      {
        label: "Vehicles",
        icon: "directions_car",
        page: "vehicles-parent",
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
      {
        label: "Rides",
        icon: "directions_car",
        page: "rides-parent",
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
      { label: "Agency Billing", icon: "payments", page: "payments" },
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
        page: "settings-parent",
        children: [
          { label: "Help Center", page: "help" },
          { label: "Settings",    page: "settings" },
        ],
      },
    ],
  },
];

/* ───────────────────────────────────────────────
   Animated collapse wrapper
   overflow:hidden only on the height dimension so
   the gradient pill is never clipped horizontally.
─────────────────────────────────────────────── */
function AnimatedDropdown({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (innerRef.current) {
      setHeight(isOpen ? innerRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        height,
        overflow: "hidden",            /* clips the slide animation */
        transition: "height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   Child nav button — self-contained so its
   width:100% is relative to its own container,
   never the full sidebar.
─────────────────────────────────────────────── */
function ChildNavButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const bg = isActive
    ? "linear-gradient(135deg, var(--brand-from), var(--brand-to))"
    : hovered
    ? "var(--bg-inner)"
    : "transparent";

  const color = isActive ? "#fff" : hovered ? "var(--text-h)" : "var(--text-muted)";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",           /* fills the indented container only */
        boxSizing: "border-box",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "0.8125rem",
        fontWeight: isActive ? 600 : 500,
        fontFamily: "var(--font)",
        lineHeight: 1.5,
        color,
        background: bg,
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 150ms ease, color 150ms ease",
        transform: "none",       /* no scale — keep inside indented lane */
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

/* ───────────────────────────────────────────────
   Main Sidebar
─────────────────────────────────────────────── */
interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const getInitialExpanded = () => {
    const result: Record<string, boolean> = {};
    for (const group of NAV_GROUPS)
      for (const item of group.items)
        if (item.children?.some((c) => c.page === activePage))
          result[item.label] = true;
    return result;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded);
  const toggle = (label: string) =>
    setExpanded((p) => ({ [label]: !p[label] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.section} style={{ marginBottom: "1.25rem" }}>

            {/* ── Section label ── */}
            <div
              className="ts-section-label"
              style={{ marginBottom: 6, fontSize: "0.65rem", letterSpacing: "0.07em" }}
            >
              {group.section}
            </div>

            {/* ── Nav items ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {group.items.map((item) => {
                const hasChildren    = !!item.children?.length;
                const isExp          = !!expanded[item.label];
                const isChildActive  = item.children?.some((c) => c.page === activePage) ?? false;
                const isParentActive = activePage === item.page && !isChildActive;

                return (
                  <div key={item.label}>

                    {/* Parent button */}
                    <button
                      onClick={() =>
                        hasChildren ? toggle(item.label) : onNavigate(item.page)
                      }
                      className={`ts-nav-item${isParentActive ? " ts-nav-active" : ""}`}
                      style={{
                        justifyContent: "space-between",
                        fontSize: "0.9375rem",
                        paddingTop: 9,
                        paddingBottom: 9,
                        ...(isChildActive && !isParentActive
                          ? { color: "var(--brand-to)" }
                          : {}),
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <span style={{ display: "flex", alignItems: "center", width: 22, height: 22 }}>
                          {ICON_MAP[item.icon]}
                        </span>
                        {item.label}
                      </span>
                      {hasChildren && (
                        <ExpandMoreRoundedIcon
                          style={{
                            fontSize: 18,
                            color: isChildActive
                              ? "var(--brand-to)"
                              : isParentActive
                              ? "rgba(255,255,255,0.7)"
                              : "var(--text-faint)",
                            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
                            transform: isExp ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      )}
                    </button>

                    {/* ── Indented children ── */}
                    {hasChildren && (
                      <AnimatedDropdown isOpen={isExp}>
                        {/*
                          KEY: use padding-left (NOT margin-left) so that
                          child buttons' width:100% resolves to THIS box width.
                          margin-left would make width:100% still reference
                          the sidebar width → pill overflow bug.
                        */}
                        <div
                          style={{
                            paddingTop: 4,
                            paddingBottom: 4,
                            paddingLeft: "3.5rem",    /* aligns with parent label text */
                            paddingRight: "0.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            position: "relative",
                          }}
                        >
                          {/* Decorative left accent line */}
                          <span
                            style={{
                              position: "absolute",
                              left: "2.625rem",
                              top: 8,
                              bottom: 8,
                              width: 1,
                              background: "var(--border)",
                              borderRadius: 1,
                              pointerEvents: "none",
                            }}
                          />
                          {item.children!.map((child) => (
                            <ChildNavButton
                              key={child.page}
                              label={child.label}
                              isActive={activePage === child.page}
                              onClick={() => onNavigate(child.page)}
                            />
                          ))}
                        </div>
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