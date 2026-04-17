import { useState, useEffect } from "react";
import { helpCenterApi, type HelpArticleRaw } from "../../api/helpCenter";

interface Props {
  dark: boolean;
}

const CATEGORIES = [
  { key: "account",  label: "Account" },
  { key: "payments", label: "Payments" },
  { key: "trips",    label: "Trips" },
  { key: "safety",   label: "Safety" },
  { key: "app",      label: "App & Settings" },
];

export default function HelpCenterAdmin({ dark }: Props) {
  const [articles, setArticles] = useState<HelpArticleRaw[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editArticle, setEditArticle] = useState<HelpArticleRaw | null>(null);
  const [filter, setFilter]     = useState("all");

  function loadArticles() {
    setLoading(true);
    helpCenterApi.listAll()
      .then(setArticles)
      .catch(() => setError("Failed to load articles"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadArticles(); }, []);

  const filtered = filter === "all"
    ? articles
    : articles.filter(a => a.categoryKey === filter);

  function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    helpCenterApi.delete(id).then(loadArticles);
  }

  function handleToggleStatus(article: HelpArticleRaw) {
    const newStatus = article.status === "reviewed" ? "auto" : "reviewed";
    helpCenterApi.update(article.id, { status: newStatus }).then(loadArticles);
  }

  const cardBg    = dark ? "#1e1e2e" : "#fff";
  const borderClr = dark ? "#2d2d3d" : "#e5e7eb";
  const textH     = dark ? "#e2e2e8" : "#1a1a2e";
  const textMuted = dark ? "#8888a0" : "#6b7280";
  const inputBg   = dark ? "#161622" : "#f9fafb";

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: textH, margin: 0 }}>Help Center</h1>
          <p style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>
            Manage FAQ articles for drivers and passengers
          </p>
        </div>
        <button
          onClick={() => { setEditArticle(null); setShowModal(true); }}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6366f1)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Article
        </button>
      </div>

      {/* Category filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ key: "all", label: "All" }, ...CATEGORIES].map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: `1px solid ${filter === c.key ? "#7c3aed" : borderClr}`,
              background: filter === c.key ? "linear-gradient(135deg, #7c3aed, #6366f1)" : cardBg,
              color: filter === c.key ? "#fff" : textMuted,
              cursor: "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: textMuted }}>Loading articles…</div>
      )}
      {error && <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>}

      {/* Articles table */}
      {!loading && !error && (
        <div style={{
          background: cardBg, borderRadius: 14,
          border: `1px solid ${borderClr}`, overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderClr}` }}>
                {["Title (EN)", "Category", "Status", "Order", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                    color: textMuted, textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 32, textAlign: "center", color: textMuted, fontSize: 13 }}>
                    No articles found
                  </td>
                </tr>
              )}
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: `1px solid ${borderClr}` }}>
                  <td style={{ padding: "12px 16px", color: textH, fontSize: 13, fontWeight: 600, maxWidth: 300 }}>
                    {a.title?.en || "—"}
                    {!a.isActive && (
                      <span style={{ fontSize: 10, color: "#ef4444", marginLeft: 8 }}>DELETED</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: textMuted }}>
                    {a.categoryLabel?.en || a.categoryKey}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      onClick={() => handleToggleStatus(a)}
                      style={{
                        padding: "3px 10px", borderRadius: 12,
                        fontSize: 11, fontWeight: 600, cursor: "pointer",
                        display: "inline-block",
                        background: a.status === "reviewed" ? "#dcfce7" : a.status === "disabled" ? "#fee2e2" : "#fef9c3",
                        color: a.status === "reviewed" ? "#166534" : a.status === "disabled" ? "#991b1b" : "#854d0e",
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: textMuted }}>
                    {a.sortOrder}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => { setEditArticle(a); setShowModal(true); }}
                        style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 11,
                          border: `1px solid ${borderClr}`, background: cardBg,
                          color: textH, cursor: "pointer", fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        style={{
                          padding: "5px 12px", borderRadius: 8, fontSize: 11,
                          border: "1px solid #fee2e2", background: dark ? "#2d1515" : "#fef2f2",
                          color: "#ef4444", cursor: "pointer", fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <ArticleModal
          dark={dark}
          article={editArticle}
          onClose={() => { setShowModal(false); setEditArticle(null); }}
          onSaved={loadArticles}
          cardBg={cardBg}
          borderClr={borderClr}
          textH={textH}
          textMuted={textMuted}
          inputBg={inputBg}
        />
      )}
    </div>
  );
}

// ── Article Create/Edit Modal ──────────────────────────────────────

interface ModalProps {
  dark: boolean;
  article: HelpArticleRaw | null;
  onClose: () => void;
  onSaved: () => void;
  cardBg: string;
  borderClr: string;
  textH: string;
  textMuted: string;
  inputBg: string;
}

function ArticleModal({ dark, article, onClose, onSaved, cardBg, borderClr, textH, textMuted, inputBg }: ModalProps) {
  const isEdit = !!article;
  const [title, setTitle]       = useState(article?.title?.en || "");
  const [desc, setDesc]         = useState(article?.description?.en || "");
  const [catKey, setCatKey]     = useState(article?.categoryKey || "account");
  const [order, setOrder]       = useState(article?.sortOrder ?? 0);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim() || !desc.trim()) { setErr("Title and description required"); return; }
    setSaving(true); setErr(null);
    try {
      if (isEdit) {
        await helpCenterApi.update(article!.id, {
          title: { ...article!.title, en: title },
          description: { ...article!.description, en: desc },
          categoryKey: catKey,
          categoryLabel: { ...(article!.categoryLabel || {}), en: CATEGORIES.find(c => c.key === catKey)?.label || catKey },
          sortOrder: order,
        });
      } else {
        await helpCenterApi.create({
          title,
          description: desc,
          categoryKey: catKey,
          categoryLabel: CATEGORIES.find(c => c.key === catKey)?.label || catKey,
          sortOrder: order,
        });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "10px 14px", borderRadius: 10,
    border: `1px solid ${borderClr}`,
    background: inputBg, color: textH,
    fontSize: 13, fontFamily: "inherit",
    outline: "none",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: cardBg, borderRadius: 16,
          border: `1px solid ${borderClr}`,
          width: 520, maxHeight: "90vh", overflow: "auto",
          padding: 28,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: textH, marginBottom: 20 }}>
          {isEdit ? "Edit Article" : "New Article"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: textMuted, display: "block", marginBottom: 6 }}>
              Title (English)
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="How to reset my password?"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: textMuted, display: "block", marginBottom: 6 }}>
              Description / Answer (English)
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={5}
              placeholder="Enter the full answer or explanation…"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMuted, display: "block", marginBottom: 6 }}>
                Category
              </label>
              <select
                value={catKey}
                onChange={e => setCatKey(e.target.value)}
                style={inputStyle}
              >
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMuted, display: "block", marginBottom: 6 }}>
                Sort Order
              </label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(+e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {err && <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>{err}</p>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px", borderRadius: 10, fontSize: 13,
                border: `1px solid ${borderClr}`, background: cardBg,
                color: textMuted, cursor: "pointer", fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "9px 20px", borderRadius: 10, fontSize: 13,
                background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                color: "#fff", border: "none",
                cursor: saving ? "wait" : "pointer", fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
