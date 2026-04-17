import { useState } from "react";
import { helpCenterApi, type HelpArticleRaw } from "../../../api/helpCenter";
import { HELP_CATEGORIES } from "./helpCenterConstants";

interface Props {
  dark: boolean;
  article: HelpArticleRaw | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 16px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-inner)",
  color: "var(--text-h)",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
  textTransform: "uppercase", color: "var(--text-faint)",
  display: "block", marginBottom: 8,
};

export default function ArticleModal({ dark, article, onClose, onSaved }: Props) {
  const isEdit = !!article;
  const [titleEn, setTitleEn] = useState(article?.title?.en || "");
  const [descEn, setDescEn]   = useState(article?.description?.en || "");
  const [catKey, setCatKey]   = useState(article?.categoryKey || "account");
  const [order, setOrder]     = useState(article?.sortOrder ?? 0);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState<string | null>(null);

  async function handleSave() {
    if (!titleEn.trim() || !descEn.trim()) { setErr("Title and description are required"); return; }
    setSaving(true); setErr(null);
    try {
      if (isEdit) {
        await helpCenterApi.update(article!.id, {
          title: { ...article!.title, en: titleEn },
          description: { ...article!.description, en: descEn },
          categoryKey: catKey,
          categoryLabel: {
            ...(article!.categoryLabel || {}),
            en: HELP_CATEGORIES.find(c => c.key === catKey)?.label || catKey,
          },
          sortOrder: order,
        });
      } else {
        await helpCenterApi.create({
          title: titleEn, description: descEn, categoryKey: catKey,
          categoryLabel: HELP_CATEGORIES.find(c => c.key === catKey)?.label || catKey,
          sortOrder: order,
        });
      }
      onSaved(); onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErr(msg || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className={dark ? "dark" : ""}
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-sidebar)",
          borderRadius: 20,
          border: "1px solid var(--border)",
          width: "100%", maxWidth: 480,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        <style>{`
          .hca-input:focus { border-color: var(--brand-to) !important; box-shadow: 0 0 0 3px var(--brand-soft) !important; }
          select option { background: var(--bg-sidebar); color: var(--text-h); }
        `}</style>

        {/* Modal header */}
        <div style={{
          padding: "22px 28px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--bg-inner)",
          borderRadius: "20px 20px 0 0",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--text-h)", letterSpacing: "-.01em" }}>
              {isEdit ? "Edit Article" : "New Article"}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
              Write in English — other languages are auto-translated
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)",
            background: "transparent", cursor: "pointer", color: "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>✕</button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              className="hca-input"
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              placeholder="e.g. How do I reset my password?"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              className="hca-input"
              value={descEn}
              onChange={e => setDescEn(e.target.value)}
              rows={5}
              placeholder="Write the full answer here…"
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 16 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                className="hca-input"
                value={catKey}
                onChange={e => setCatKey(e.target.value)}
                style={inputStyle}
              >
                {HELP_CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input
                className="hca-input"
                type="number"
                value={order}
                onChange={e => setOrder(+e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 11, color: "var(--text-faint)" }}>
            🔄 FR &amp; AR translations are generated automatically after saving.
          </p>

          {err && <div className="ts-alert-error">{err}</div>}
        </div>

        {/* Modal footer */}
        <div style={{
          padding: "16px 28px 22px",
          borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "flex-end", gap: 10,
          background: "var(--bg-inner)",
          borderRadius: "0 0 20px 20px",
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13,
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-muted)", cursor: "pointer", fontWeight: 600,
              fontFamily: "inherit",
            }}
          >Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 22px", borderRadius: 10, fontSize: 13,
              background: saving ? "var(--brand-soft)" : "#7c3aed",
              color: saving ? "var(--text-muted)" : "#fff",
              border: "none", cursor: saving ? "wait" : "pointer",
              fontWeight: 700, fontFamily: "inherit",
            }}
          >
            {saving ? "Saving…" : isEdit ? "Update Article" : "Create Article"}
          </button>
        </div>
      </div>
    </div>
  );
}


