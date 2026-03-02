import AnimatedMail from "./Settings";

interface TopNavProps {
  onSearch?: (q: string) => void;
  dark: boolean;
}

export default function TravelSyncTopNav({ dark, onSearch }: TopNavProps) {
  const heading = dark ? "text-gray-100" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-400";
  const searchBar = dark
    ? "bg-gray-800 border-gray-700 text-gray-500"
    : "bg-white border-gray-200 text-gray-400";
  const notifBtn = dark
    ? "border-gray-700 text-gray-400 hover:bg-gray-800"
    : "border-gray-200 text-gray-600 hover:bg-gray-50";

  return (
    <nav
      className={`w-full h-16 border-b flex items-center justify-between px-8 shrink-0 z-10 ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-2xl flex items-center justify-center text-white font-bold text-base"
          style={{ background: "#9d73ff" }}
        >
          T
        </div>
        <span className={`text-base font-semibold tracking-tight ${heading}`}>
          TravelSync Agency
        </span>
      </div>

      <div className="flex-1 flex justify-center">
        <div
          className={`w-[420px] h-10 border rounded-full flex items-center px-4 gap-3 text-sm cursor-text ${searchBar}`}
        >
          <span>🔍</span>
          <span>
            <input
              type="text"
              className="bg-transparent outline-none w-full"
              placeholder="Search trips, passengers, or references..."
            />
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        <button
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors overflow-hidden ${notifBtn}`}
        >
          <div className="scale-[0.12] origin-center">
            <AnimatedMail />
          </div>
        </button>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-100">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
              alt="Sarah Lee"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-medium leading-none ${heading}`}>
              Sarah Lee
            </span>
            <span className={`text-xs mt-0.5 ${muted}`}>Agency Manager</span>
          </div>
          <span className={`text-xs ml-1 ${muted}`}>▾</span>
        </div>
      </div>
    </nav>
  );
}
