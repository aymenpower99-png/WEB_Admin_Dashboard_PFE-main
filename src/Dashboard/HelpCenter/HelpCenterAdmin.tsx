import { useState, useEffect } from "react";
import { helpCenterApi, type HelpArticleRaw } from "../../api/helpCenter";
import HelpStatsBar from "./components/HelpStatsBar";
import CategoryFilter from "./components/CategoryFilter";
import ArticleTable from "./components/ArticleTable";
import ArticleModal from "./components/ArticleModal";

interface Props { dark: boolean; }



export default function HelpCenterAdmin({ dark }: Props) {
  const [articles, setArticles] = useState<HelpArticleRaw[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [editArticle, setEditArticle] = useState<HelpArticleRaw | null>(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");

  function loadArticles() {
    setLoading(true);
    helpCenterApi.listAll()
      .then(setArticles)
      .catch(() => setError("Failed to load articles"))
      .finally(() => setLoading(false));
  }
  useEffect(() => { loadArticles(); }, []);

  function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
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

  return (
    <div
      className={dark ? "dark" : ""}
      style={{ minHeight: "100vh", background: "var(--bg-page)", padding: "36px 32px", color: "var(--text-h)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .hca-root * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        .hca-add-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
      `}</style>

      <div className="hca-root" style={{ maxWidth: 1160, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, var(--brand-from), var(--brand-to))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, boxShadow: "0 6px 20px var(--brand-soft)",
              }}>💬</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", color: "var(--text-h)" }}>
                Help Center
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", paddingLeft: 52 }}>
              Manage FAQ articles for drivers and passengers
            </p>
          </div>

          <button
            className="hca-add-btn"
            onClick={() => { setEditArticle(null); setShowModal(true); }}
            style={{
              background: "linear-gradient(135deg, var(--brand-from), var(--brand-to))",
              color: "#fff", border: "none", borderRadius: 12,
              padding: "11px 22px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 6px 20px var(--brand-soft)", transition: "all .2s",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Article
          </button>
        </div>

        <HelpStatsBar total={articles.length} reviewed={reviewed} auto={auto} />
        <CategoryFilter filter={filter} onFilter={setFilter} search={search} onSearch={setSearch} />

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontSize: 13 }}>
            Loading articles…
          </div>
        )}
        {error && <div className="ts-alert-error" style={{ marginTop: 16 }}>{error}</div>}

        {!loading && !error && (
          <>
            <ArticleTable
              articles={articles}
              filter={filter}
              search={search}
              dark={dark}
              onEdit={a => { setEditArticle(a); setShowModal(true); }}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
            <p style={{ textAlign: "right", fontSize: 11, color: "var(--text-faint)", marginTop: 12 }}>
              Showing {filtered.length} of {articles.length} articles
            </p>
          </>
        )}
      </div>

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