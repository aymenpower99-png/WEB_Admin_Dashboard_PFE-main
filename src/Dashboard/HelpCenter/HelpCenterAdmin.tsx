import { useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { helpCenterApi, type HelpArticleRaw } from "../../api/helpCenter";
import HelpStatsBar from "./components/HelpStatsBar";
import ArticleTable from "./components/ArticleTable";
import ArticleModal from "./components/ArticleModal";
import { HELP_CATEGORIES } from "./components/helpCenterConstants";

const PAGE_SIZE = 5;

interface Props { dark: boolean; }

const FILTER_TABS = [
  { key: "all", label: "All" },
  ...HELP_CATEGORIES.map(c => ({ key: c.key, label: c.label })),
];

export default function HelpCenterAdmin({ dark }: Props) {
  const [articles, setArticles] = useState<HelpArticleRaw[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [editArticle, setEditArticle] = useState<HelpArticleRaw | null>(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);

  function loadArticles() {
    setLoading(true);
    helpCenterApi.listAll()
      .then(setArticles)
      .catch(() => setError("Failed to load articles"))
      .finally(() => setLoading(false));
  }
  useEffect(() => { loadArticles(); }, []);

  function handleDelete(id: string) {
    if (!confirm("Permanently delete this article? This cannot be undone.")) return;
    helpCenterApi.delete(id).then(loadArticles);
  }
  function handleToggleStatus(article: HelpArticleRaw) {
    const newStatus = article.status === "reviewed" ? "auto" : "reviewed";
    helpCenterApi.update(article.id, { status: newStatus }).then(loadArticles);
  }

  const reviewed = articles.filter(a => a.status === "reviewed").length;
  const auto     = articles.filter(a => a.status === "auto").length;

  const filtered = articles
    .filter(a => filter === "all" || a.categoryKey === filter)
    .filter(a => !search || (a.title?.en || "").toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(key: string) { setFilter(key); setPage(1); }
  function handleSearchChange(val: string) { setSearch(val); setPage(1); }

  return (
    <div className={dark ? "dark" : ""} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      <div className="ts-page-header">
        <div><h1 className="ts-page-title">Help Center</h1></div>
        <button
          onClick={() => { setEditArticle(null); setShowModal(true); }}
          style={{
            background: "#7c3aed", color: "#fff", border: "none",
            borderRadius: 8, padding: "8px 18px", fontSize: ".82rem",
            fontWeight: 600, cursor: "pointer",
          }}
        >
          + Add Article
        </button>
      </div>

      <HelpStatsBar total={articles.length} reviewed={reviewed} auto={auto} />

      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
          {FILTER_TABS.map(({ key, label }) => (
            <button key={key} onClick={() => handleFilterChange(key)} style={{
              padding: ".3rem .85rem", borderRadius: "9999px", fontSize: ".82rem",
              fontWeight: 600, cursor: "pointer", border: "none",
              background: filter === key ? "#7c3aed" : "var(--bg-inner)",
              color:      filter === key ? "#fff"    : "var(--text-muted)",
              transition: "all .15s",
            }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div className="ts-search-bar" style={{ minWidth: 240 }}>
            <SearchRoundedIcon style={{ fontSize: 15, flexShrink: 0 }} />
            <input
              placeholder="Search articles…"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="ts-alert-error">{error}</div>}

      <ArticleTable
        articles={paged}
        loading={loading}
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={a => { setEditArticle(a); setShowModal(true); }}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {showModal && (
        <ArticleModal
          dark={dark}
          article={editArticle}
          onClose={() => { setShowModal(false); setEditArticle(null); }}
          onSaved={loadArticles}
        />
      )}
    </div>
  );
}