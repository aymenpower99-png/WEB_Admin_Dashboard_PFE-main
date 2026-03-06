import { useState } from "react";
import { USERS } from "./constants";
import './travelsync-design-system.css'

interface UsersTableProps { dark: boolean; }

interface User {
  name: string; email: string; role: string;
  status: "active" | "pending" | "blocked"; trips: number;
}

const STATUS_PILL: Record<string, string> = {
  active:  "ts-pill ts-pill-active",
  pending: "ts-pill ts-pill-pending",
  blocked: "ts-pill ts-pill-blocked",
};

const ROWS_PER_PAGE = 10;

export default function UsersTable({ dark: _ }: UsersTableProps) {
  const [page, setPage] = useState(1);
  const users = USERS as User[];

  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);
  const paginated = users.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const rows = [
    ...paginated,
    ...Array(ROWS_PER_PAGE - paginated.length).fill(null),
  ];

  const GRID = "1.6fr 1.5fr 0.8fr 0.7fr 0.4fr";
  const BORDER = { borderColor: "var(--border-row)" };

  return (
    <div className="ts-card overflow-hidden" style={{ padding: "1.5rem" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="ts-td-h text-sm font-semibold">Recent users</div>
          <div className="ts-faint text-xs">Last signups &amp; status</div>
        </div>
        <button className="ts-link">View all</button>
      </div>

      {/* Column labels */}
      <div
        className="grid text-xs font-medium pb-2 border-b ts-faint"
        style={{ gridTemplateColumns: GRID, ...BORDER }}
      >
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Trips</span>
      </div>

      {/* Rows — fixed height container so last page never collapses */}
      <div className="flex flex-col" style={{ minHeight: `${ROWS_PER_PAGE * 41}px` }}>
        {rows.map((user, i) => (
          <div
            key={i}
            className={`grid text-xs py-2.5 items-center rounded-lg px-1${user ? " ts-tr-hover" : ""}${i > 0 ? " border-t" : ""}`}
            style={{ gridTemplateColumns: GRID, ...BORDER }}
          >
            {user ? (
              <>
                <span className="ts-td-h flex items-center gap-1.5 font-medium">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-5 h-5 rounded-full bg-violet-100 shrink-0"
                  />
                  {user.name}
                </span>
                <span className="ts-muted">{user.email}</span>
                <span><span className="ts-chip">{user.role}</span></span>
                <span>
                  <span className={STATUS_PILL[user.status]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </span>
                <span className="ts-td-h font-medium">{user.trips}</span>
              </>
            ) : (
              // Ghost row — 5 empty cells to preserve grid height
              <>
                <span>&nbsp;</span>
                <span />
                <span />
                <span />
                <span />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination footer */}
      <div
        className="flex items-center justify-between mt-4 pt-3 border-t ts-faint text-xs"
        style={BORDER}
      >
        <span>
          Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, users.length)} of {users.length} entries
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded ts-link disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="w-6 h-6 rounded text-xs font-medium flex items-center justify-center"
              style={{
                background: n === page ? "var(--accent)" : "transparent",
                color: n === page ? "#fff" : "inherit",
              }}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded ts-link disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}