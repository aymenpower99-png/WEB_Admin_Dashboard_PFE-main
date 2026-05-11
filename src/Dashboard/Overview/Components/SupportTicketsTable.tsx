import { useState } from "react";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import type { DashboardTicket } from "./types";
import { StatusBadge } from "../Badge_action_buttons/StatusBadges";

interface SupportTicketsTableProps {
  tickets: DashboardTicket[];
  dark: boolean;
}

const TICKETS_PER_PAGE = 5;

const TH: React.CSSProperties = {
  padding: "0.65rem 1rem",
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

const TD: React.CSSProperties = {
  padding: "0 1rem",
  height: 72,
  fontSize: ".875rem",
  fontWeight: 600,
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

export default function SupportTicketsTable({ tickets, dark }: SupportTicketsTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tickets.length / TICKETS_PER_PAGE));
  const paged = tickets.slice((page - 1) * TICKETS_PER_PAGE, page * TICKETS_PER_PAGE);

  const iconColor = dark ? "#9ca3af" : "#6b7280";

  return (
    <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <div className="ts-toolbar" style={{ flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MessageSquare size={14} color={iconColor} strokeWidth={2} />
          <p className="ts-page-title" style={{ fontSize: "0.825rem" }}>Support Tickets</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>

        <thead>
          <tr>
            <th style={TH}>User</th>
            <th style={TH}>Issue</th>
            <th style={TH}>Status</th>
          </tr>
        </thead>

        <tbody>
          {paged.length === 0 ? (
            <tr style={{ height: 72 }}>
              <td colSpan={3} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                No tickets found.
              </td>
            </tr>
          ) : (
            paged.map((t) => (
              <tr key={t.id} style={{ height: 72 }}>
                <td style={TD}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {t.user}
                  </span>
                </td>
                <td style={TD}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {t.issue}
                  </span>
                </td>
                <td style={TD}>
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onPrev, onNext }: {
  page: number; totalPages: number; onPrev: () => void; onNext: () => void;
}) {
  const btnBase: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 24, height: 24, borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    fontWeight: 500, fontSize: "0.68rem",
    cursor: "pointer", transition: "all .15s",
  };
  const numBtn = (n: number): React.CSSProperties => ({
    ...btnBase,
    background: n === page ? "#7c3aed" : "var(--bg-card)",
    color: n === page ? "#fff" : "var(--text-muted)",
    fontWeight: n === page ? 700 : 500,
  });
  const arrowBtn = (disabled: boolean): React.CSSProperties => ({
    ...btnBase,
    background: disabled ? "transparent" : "var(--bg-card)",
    color: disabled ? "var(--text-faint)" : "var(--text-muted)",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.45rem 0.75rem",
      borderTop: "1px solid var(--border)",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: "0.68rem", color: "var(--text-faint)", fontWeight: 500 }}>
        Page {page} of {totalPages}
      </span>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={arrowBtn(page === 1)}>
          <ChevronLeft size={12} strokeWidth={2.5} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => { if (n !== page) n < page ? onPrev() : onNext(); }} style={numBtn(n)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={arrowBtn(page === totalPages)}>
          <ChevronRight size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
