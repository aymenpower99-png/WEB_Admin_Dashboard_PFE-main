import { type HelpArticleRaw } from "../../../api/helpCenter";
import { HELP_CATEGORIES } from "./helpCenterConstants";

interface Props {
  articles: HelpArticleRaw[];
  filter: string;
  search: string;
  dark: boolean;
  onEdit: (a: HelpArticleRaw) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (a: HelpArticleRaw) => void;
}

function statusVars(status: string): { bg: string; fg: string } {
  if (status === "reviewed") return { bg: "var(--active-bg)",  fg: "var(--active-fg)" };
  if (status === "disabled") return { bg: "var(--blocked-bg)", fg: "var(--blocked-fg)" };
  return { bg: "var(--pending-bg)", fg: "var(--pending-fg)" };
}

export default function ArticleTable({ articles, filter, search, dark, onEdit, onDelete, onToggleStatus }: Props) {
  const filtered = articles
    .filter(a => filter === "all" || a.categoryKey === filter)
    .filter(a => !search || (a.title?.en || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={dark ? "dark" : ""}>
      <style>{`
        .hca-row:hover { background: var(--bg-inner) !important; }
        .hca-edit-btn:hover { background: var(--brand-soft-hover) !important; color: var(--brand-to) !important; border-color: var(--brand-to) !important; }
        .hca-del-btn:hover { background: var(--blocked-bg) !important; color: var(--blocked-fg) !important; }
        .hca-chip:hover { opacity: 0.85; }
      `}</style>

      <div style={{
        background: "var(--bg-sidebar)",
        borderRadius: 18,
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2.5fr 1fr 100px 70px 140px",
          padding: "13px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-inner)",
        }}>
          {["Title", "Category", "Status", "Order", "Actions"].map(h => (
            <span key={h} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
              textTransform: "uppercase", color: "var(--text-faint)",
            }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            No articles found
          </div>
        )}

        {filtered.map((a, idx) => {
          const sv = statusVars(a.status);
          const cat = HELP_CATEGORIES.find(c => c.key === a.categoryKey);
          return (
            <div
              key={a.id}
              className="hca-row"
              style={{
                display: "grid",
                gridTemplateColumns: "2.5fr 1fr 100px 70px 140px",
                padding: "16px 24px",
                alignItems: "center",
                borderBottom: idx < filtered.length - 1 ? "1px solid var(--border-row)" : "none",
                transition: "background .15s",
              }}
            >
              {/* Title */}
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "var(--text-h)", lineHeight: 1.4 }}>
                  {a.title?.en || "—"}
                  {!a.isActive && (
                    <span style={{
                      marginLeft: 8, fontSize: 9, fontWeight: 700, letterSpacing: ".08em",
                      textTransform: "uppercase", color: "var(--blocked-fg)",
                      background: "var(--blocked-bg)", padding: "2px 6px", borderRadius: 4,
                    }}>deleted</span>
                  )}
                </p>
              </div>

              {/* Category */}
              <div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {cat?.icon} {a.categoryLabel?.en || a.categoryKey}
                </span>
              </div>

              {/* Status */}
              <div>
                <span
                  className="hca-chip"
                  onClick={() => onToggleStatus(a)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 99,
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    background: sv.bg, color: sv.fg,
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                  {a.status}
                </span>
              </div>

              {/* Sort order */}
              <div>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "var(--text-muted)",
                  background: "var(--bg-inner)", padding: "3px 8px", borderRadius: 6, display: "inline-block",
                }}>{a.sortOrder}</span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="hca-edit-btn"
                  onClick={() => onEdit(a)}
                  style={{
                    padding: "6px 13px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    border: "1.5px solid var(--border)", background: "var(--bg-sidebar)",
                    color: "var(--text-body)", cursor: "pointer", transition: "all .15s",
                    fontFamily: "inherit",
                  }}
                >Edit</button>
                <button
                  className="hca-del-btn"
                  onClick={() => onDelete(a.id)}
                  style={{
                    padding: "6px 13px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    border: "1.5px solid var(--blocked-bg)",
                    background: "var(--blocked-bg)",
                    color: "var(--blocked-fg)", cursor: "pointer", transition: "all .15s",
                    fontFamily: "inherit",
                  }}
                >Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
