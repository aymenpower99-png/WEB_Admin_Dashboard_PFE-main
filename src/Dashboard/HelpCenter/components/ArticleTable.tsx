import { TH, TD, ROW_H } from "../../Drivers/components/DriversTypes";
import { HELP_CATEGORIES } from "./helpCenterConstants";
import type { HelpArticleRaw } from "../../../api/helpCenter";
import DriversPagination from "../../Drivers/components/DriversPagination";

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

function StatusChip({ status, onClick }: { status: string; onClick: () => void }) {
  const sv = status === "reviewed"
    ? { bg: "var(--active-bg)",  fg: "var(--active-fg)"  }
    : status === "disabled"
    ? { bg: "var(--blocked-bg)", fg: "var(--blocked-fg)" }
    : { bg: "var(--pending-bg)", fg: "var(--pending-fg)" };
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "4px 10px", borderRadius: 99,
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        background: sv.bg, color: sv.fg,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
      {status}
    </span>
  );
}

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
              <col style={{ width: "36%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "8%"  }} />
              <col style={{ width: "26%" }} />
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
                      <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => onEdit(a)}
                            style={{
                              padding: "6px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
                              border: "1px solid var(--border)", background: "var(--bg-inner)",
                              color: "var(--text-body)", cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(a.id)}
                            style={{
                              padding: "6px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
                              border: "1px solid var(--blocked-bg)", background: "var(--blocked-bg)",
                              color: "var(--blocked-fg)", cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
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
              <col style={{ width: "36%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "8%"  }} />
              <col style={{ width: "26%" }} />
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
                      <td style={{ ...TD, fontWeight: 600, color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => onEdit(a)}
                            style={{
                              padding: "6px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
                              border: "1px solid var(--border)", background: "var(--bg-inner)",
                              color: "var(--text-body)", cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(a.id)}
                            style={{
                              padding: "6px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
                              border: "1px solid var(--blocked-bg)", background: "var(--blocked-bg)",
                              color: "var(--blocked-fg)", cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
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
    </div>
  );
}


