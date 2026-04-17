import { HELP_CATEGORIES } from "./helpCenterConstants";

interface Props {
  filter: string;
  onFilter: (k: string) => void;
  search: string;
  onSearch: (s: string) => void;
}

const ALL_CHIPS = [{ key: "all", label: "All", icon: "🗂️" }, ...HELP_CATEGORIES];

export default function CategoryFilter({ filter, onFilter, search, onSearch }: Props) {
  return (
    <>
      <style>{`
        .hca-filter-btn { transition: all .15s; }
        .hca-filter-btn:hover { border-color: var(--brand-to) !important; color: var(--brand-to) !important; }
      `}</style>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
          {ALL_CHIPS.map(c => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                className="hca-filter-btn"
                onClick={() => onFilter(c.key)}
                style={{
                  padding: "7px 15px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${active ? "var(--brand-to)" : "var(--border)"}`,
                  background: active
                    ? "linear-gradient(135deg, var(--brand-from), var(--brand-to))"
                    : "var(--bg-sidebar)",
                  color: active ? "#fff" : "var(--text-muted)",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                  boxShadow: active ? "0 4px 14px var(--brand-soft)" : "none",
                }}
              >
                <span style={{ fontSize: 13 }}>{c.icon}</span> {c.label}
              </button>
            );
          })}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-sidebar)", border: "1.5px solid var(--border)",
          borderRadius: 10, padding: "8px 14px", minWidth: 220,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="hca-input"
            placeholder="Search articles…"
            value={search}
            onChange={e => onSearch(e.target.value)}
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 12, color: "var(--text-h)", fontFamily: "inherit", flex: 1,
            }}
          />
        </div>
      </div>
    </>
  );
}
