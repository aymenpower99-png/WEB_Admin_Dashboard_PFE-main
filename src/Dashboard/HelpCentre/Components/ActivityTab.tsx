import type { ActivityEvent } from "./types";

interface ActivityTabProps {
  events: ActivityEvent[];
  dark: boolean;
}

const EVENT_CONFIG: Record<ActivityEvent["type"], { dot: string; label: string }> = {
  created:       { dot: "bg-blue-500",    label: "Ticket Created" },
  status_change: { dot: "bg-amber-500",   label: "User Replied"   },
  admin_reply:   { dot: "bg-violet-500",  label: "Admin Replied"  },
  resolved:      { dot: "bg-emerald-500", label: "Resolved"       },
  escalated:     { dot: "bg-red-500",     label: "Escalated"      },
};

const EVENT_COLOR: Record<ActivityEvent["type"], string> = {
  created:       "text-blue-600",
  status_change: "text-amber-600",
  admin_reply:   "text-violet-600",
  resolved:      "text-emerald-600",
  escalated:     "text-red-600",
};

export default function ActivityTab({ events, dark }: ActivityTabProps) {
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const line  = dark ? "bg-gray-700"   : "bg-gray-200";

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 py-16">
        <svg className={`w-10 h-10 ${muted}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <p className={`text-sm ${muted}`}>No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {events.map((event, i) => {
        const cfg = EVENT_CONFIG[event.type];
        return (
          <div key={event.id} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
              <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ring-2 ${
                dark ? "ring-gray-900" : "ring-white"
              } ${cfg.dot}`} />
              {i < events.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[32px] my-1 ${line}`} />
              )}
            </div>

            {/* Content card */}
            <div className={`flex-1 ${i === events.length - 1 ? "pb-0" : "pb-5"}`}>
              <div className={`rounded-xl p-3.5 ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={`text-xs font-bold uppercase tracking-wide ${EVENT_COLOR[event.type]}`}>
                    {cfg.label}
                  </p>
                  <span className={`text-xs flex-shrink-0 ${muted}`}>{event.timestamp}</span>
                </div>
                <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>
                  {event.description}
                </p>
                {event.actor && (
                  <p className={`text-xs mt-1 ${muted}`}>by {event.actor}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}