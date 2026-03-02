import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsRow from "./StatsRow";
import UsersTable from "./UsersTable";
import SystemStatus from "./SystemStatus";
import UsersPage from "./userpage";
import AgencyPaymentsData from "./PayData";
import TripsPage from "./BookingsPage";
import HelpCenter from "./HelpCentre";
import SearchBar from "./Settings";
import TravelSyncTopNav from "./TopNavProps";
import AnimatedMail from "./Settings";

const PAGE_ORDER = [
  "dashboard",
  "users",
  "trips",
  "payments",
  "help",
  "settings",
  "security",
];

// Height of your top navbar — adjust this value to match your TravelSyncTopNav height
const TOP_NAV_HEIGHT = 56; // px

interface AdminDashboardProps {
  dark: boolean;
  onToggleDark: () => void;
}

interface PageProps {
  dark: boolean;
  onSelectUser?: (name: string) => void;
  onNavigate?: (page: string) => void;
}

function PlaceholderPage({
  dark,
  title,
  icon,
  description,
}: {
  dark: boolean;
  title: string;
  icon: string;
  description: string;
}) {
  return (
    <div className="flex p-4 flex-col items-center justify-center flex-1 gap-3 py-24">
      <div className="text-5xl">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
        {description}
      </p>
    </div>
  );
}

function renderPage(page: string, props: PageProps) {
  switch (page) {
    case "dashboard":
      return (
        <>
          <Header dark={props.dark} />
          <StatsRow dark={props.dark} />
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "2fr 1.3fr" }}
          >
            <UsersTable dark={props.dark} />
            <SystemStatus dark={props.dark} />
          </div>
        </>
      );
    case "users":
      return <UsersPage dark={props.dark} />;
    case "trips":
      return <TripsPage dark={props.dark} />;
    case "payments":
      return <AgencyPaymentsData dark={props.dark} />;
    case "help":
      return <HelpCenter dark={props.dark} />;
    case "settings":
      return <AnimatedMail />;
    case "security":
      return (
        <PlaceholderPage
          dark={props.dark}
          title="Security"
          icon="🛡"
          description="Manage permissions, 2FA and audit logs."
        />
      );
    default:
      return null;
  }
}

export default function AdminDashboard({
  dark,
  onToggleDark,
}: AdminDashboardProps) {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [displayPage, setDisplayPage] = useState("dashboard");
  const [slideClass, setSlideClass] = useState("");
  const prevPageRef = useRef("dashboard");

  const navigate = (page: string) => {
    if (page === activePage) return;

    const prevIdx = PAGE_ORDER.indexOf(prevPageRef.current);
    const nextIdx = PAGE_ORDER.indexOf(page);
    const direction = nextIdx >= prevIdx ? "left" : "right";

    setSlideClass(
      direction === "left"
        ? "animate-slide-out-left"
        : "animate-slide-out-right",
    );

    setTimeout(() => {
      prevPageRef.current = page;
      setDisplayPage(page);
      setActivePage(page);
      setSelectedUser(null);
      setSlideClass(
        direction === "left"
          ? "animate-slide-in-right"
          : "animate-slide-in-left",
      );
    }, 180);

    setTimeout(() => setSlideClass(""), 360);
  };

  return (
    <>
      <style>{`
        @keyframes slideOutLeft  { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-28px); } }
        @keyframes slideOutRight { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(28px); } }
        @keyframes slideInRight  { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInLeft   { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
        .animate-slide-out-left  { animation: slideOutLeft  0.18s ease forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.18s ease forwards; }
        .animate-slide-in-right  { animation: slideInRight  0.18s ease forwards; }
        .animate-slide-in-left   { animation: slideInLeft   0.18s ease forwards; }
      `}</style>

      <div
        className={`min-h-screen ${dark ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div
          className="fixed top-0 left-0 right-0 z-50"
          style={{ height: TOP_NAV_HEIGHT }}
        >
          <TravelSyncTopNav dark={dark} onSearch={() => {}} />
        </div>

        <div
          className="flex"
          style={{ paddingTop: TOP_NAV_HEIGHT, height: "100vh" }}
        >
          <aside
            className={`fixed left-0 z-40 flex flex-col gap-4 px-3 py-4 border-r w-60 ${
              dark
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-50 border-gray-200"
            }`}
            style={{
              top: TOP_NAV_HEIGHT,
              height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            }}
          >
            <Sidebar
              dark={dark}
              onToggleDark={onToggleDark}
              activePage={activePage}
              onNavigate={navigate}
            />
          </aside>

          <main
            className="flex-1 overflow-y-auto p-6"
            style={{ marginLeft: 240 }}
          >
            <div className={`${slideClass} transition-opacity duration-300`}>
              {renderPage(displayPage, {
                dark,
                onSelectUser: (name) => setSelectedUser(name),
                onNavigate: navigate,
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
