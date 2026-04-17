import { useState } from "react";
import { TH, TD, ROW_H } from "../../Drivers/components/DriversTypes";
import { HELP_CATEGORIES } from "./helpCenterConstants";
import type { HelpArticleRaw } from "../../../api/helpCenter";
import DriversPagination from "../../Drivers/components/DriversPagination";

/* ─── Shared icon-only action button (matches Drivers page style) ───────── */
const ACTION_BTN_BASE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 30, height: 30, borderRadius: 7, borderWidth: "1px", borderStyle: "solid",
  borderColor: "var(--border)", background: "var(--bg-card)", cursor: "pointer",
  color: "var(--text-muted)", flexShrink: 0, transition: "all .15s", padding: 0,
};

function ActionBtn({ title, onClick, hoverBg, hoverColor, hoverBorder, children }: {
  title: string; onClick: () => void;
  hoverBg: string; hoverColor: string; hoverBorder: string;
  children: React.ReactNode;
}) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick}
      style={{ ...ACTION_BTN_BASE, ...(h ? { background: hoverBg, color: hoverColor, borderColor: hoverBorder } : {}) }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconDelete = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/* ─── Status chip ───────────────────────────────────────────────────────── */
function StatusChip({ status, onClick }: { status: string; onClick: () => void }) {
  const sv = status === "reviewed"
    ? { bg: "var(--active-bg)",  fg: "var(--active-fg)"  }
    : status === "disabled"
    ? { bg: "var(--blocked-bg)", fg: "var(--blocked-fg)" }
    : { bg: "var(--pending-bg)", fg: "var(--pending-fg)" };
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 10px", borderRadius: 99,
      fontSize: 11, fontWeight: 700, cursor: "pointer",
      background: sv.bg, color: sv.fg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface Props {
  articles: HelpArticleRaw[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onEdit: (a: HelpArticleRaw) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (a: HelpArticleRaw) => void;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function ArticleTable({ articles, loading, page, totalPages, onPageChange, onEdit, onDelete, onToggleStatus }: Props) {
  return (
    <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-faint)", fontSize: ".85rem" }}>
          Loading articles…
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "38%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={TH}>Title</th>
                <th style={TH}>Category</th>
                <th style={TH}>Status</th>
                <th style={TH}>Order</th>
                <th style={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr style={{ height: ROW_H }}>
                  <td colSpan={5} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                    No articles found.
                  </td>
                </tr>
              ) : (
                articles.map(a => {
                  const cat = HELP_CATEGORIES.find(c => c.key === a.categoryKey);
                  return (
                    <tr key={a.id} className="ts-tr" style={{ height: ROW_H }}>
                      <td style={{ ...TD, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.title?.en || "—"}
                        {!a.isActive && (
                          <span style={{
                            marginLeft: 8, fontSize: 9, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: ".06em",
                            color: "var(--blocked-fg)", background: "var(--blocked-bg)",
                            padding: "2px 6px", borderRadius: 4,
                          }}>
                            inactive
                          </span>
                        )}
                      </td>
                      <td style={{ ...TD, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat?.label ?? a.categoryKey}
                      </td>
                      <td style={TD}>
                        <StatusChip status={a.status} onClick={() => onToggleStatus(a)} />
                      </td>
                      <td style={{ ...TD, color: "var(--text-muted)" }}>
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          background: "var(--bg-inner)", padding: "3px 8px",
                          borderRadius: 6, display: "inline-block",
                        }}>
                          {a.sortOrder}
                        </span>
                      </td>
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <ActionBtn title="Edit Article" onClick={() => onEdit(a)}
                            hoverBg="#eff6ff" hoverColor="#2563eb" hoverBorder="#bfdbfe">
                            <IconEdit />
                          </ActionBtn>
                          <ActionBtn title="Delete Article" onClick={() => onDelete(a.id)}
                            hoverBg="#fef2f2" hoverColor="#dc2626" hoverBorder="#fecaca">
                            <IconDelete />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      <DriversPagination
        page={page}
        totalPages={totalPages}
        onPrev={() => onPageChange(Math.max(1, page - 1))}
        onNext={() => onPageChange(Math.min(totalPages, page + 1))}
        setPage={onPageChange}
      />
    </div>
  );
}
