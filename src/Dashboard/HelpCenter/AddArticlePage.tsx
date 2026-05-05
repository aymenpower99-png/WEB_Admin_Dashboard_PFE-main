import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import ArrowBackRoundedIcon  from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import AddRoundedIcon        from "@mui/icons-material/AddRounded";
import SaveRoundedIcon       from "@mui/icons-material/SaveRounded";
import "../travelsync-design-system.css";
import { helpCenterApi, type HelpArticleRaw, type StepInput } from "../../api/helpCenter";
import { HELP_CATEGORIES } from "./components/helpCenterConstants";

// ── Local step shape used in the form ────────────────────────────────────────
interface LocalStep {
  id: string; // ephemeral key for React list rendering
  title: string;
  description: string;
}

function makeStep(): LocalStep {
  return { id: crypto.randomUUID(), title: "", description: "" };
}

// ── Category label map ────────────────────────────────────────────────────────
const CAT_LABELS: Record<string, string> = Object.fromEntries(
  HELP_CATEGORIES.map(c => [c.key, c.label])
);

// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  prefill?: HelpArticleRaw | null;
  onNavigate: (page: string) => void;
}

export default function AddArticlePage({ prefill, onNavigate }: Props) {
  const isEdit = !!prefill;

  // ── Basic info ──
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [categoryKey, setCategoryKey] = useState(HELP_CATEGORIES[0].key);
  const [status,      setStatus]      = useState<"auto" | "reviewed">("auto");
  const [sortOrder,   setSortOrder]   = useState(0);

  // ── Steps ──
  const [steps, setSteps] = useState<LocalStep[]>([]);

  // ── UI state ──
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ── Drag-and-drop refs ──
  const dragIdx = useRef<number | null>(null);
  const overIdx = useRef<number | null>(null);

  // ── Prefill on edit ──
  useEffect(() => {
    if (prefill) {
      setTitle(prefill.title?.en ?? "");
      setDescription(prefill.description?.en ?? "");
      setCategoryKey(prefill.categoryKey ?? HELP_CATEGORIES[0].key);
      setStatus(prefill.status === "reviewed" ? "reviewed" : "auto");
      setSortOrder(prefill.sortOrder ?? 0);
      setSteps(
        (prefill.steps ?? []).map(s => ({
          id: crypto.randomUUID(),
          title: s.title?.en ?? "",
          description: s.description?.en ?? "",
        }))
      );
    } else {
      setTitle(""); setDescription("");
      setCategoryKey(HELP_CATEGORIES[0].key);
      setStatus("auto"); setSortOrder(0);
      setSteps([]);
    }
    setApiError(null);
  }, [prefill]);

  // ── Steps helpers ──
  function addStep() {
    setSteps(prev => [...prev, makeStep()]);
  }

  function removeStep(id: string) {
    setSteps(prev => prev.filter(s => s.id !== id));
  }

  function updateStep(id: string, field: "title" | "description", value: string) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  // ── Drag-and-drop handlers ──
  function onDragStart(idx: number) { dragIdx.current = idx; }
  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault(); overIdx.current = idx;
  }
  function onDrop() {
    const from = dragIdx.current; const to = overIdx.current;
    if (from === null || to === null || from === to) return;
    setSteps(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    dragIdx.current = null; overIdx.current = null;
  }

  // ── Save ──
  async function handleSave() {
    if (!title.trim()) {
      setApiError("Title is required.");
      return;
    }

    setSaving(true);
    setApiError(null);

    const stepsPayload: StepInput[] = steps.map((s, i) => ({
      order: i + 1,
      title: s.title.trim(),
      description: s.description.trim(),
    }));

    try {
      if (isEdit && prefill) {
        await helpCenterApi.update(prefill.id, {
          title:       { en: title.trim() },
          description: { en: description.trim() },
          categoryKey,
          categoryLabel: { en: CAT_LABELS[categoryKey] ?? categoryKey },
          status,
          sortOrder,
          steps: stepsPayload,
        });
        toast.success("Article updated successfully ✓");
      } else {
        await helpCenterApi.create({
          title:        title.trim(),
          description:  description.trim(),
          categoryKey,
          categoryLabel: CAT_LABELS[categoryKey] ?? categoryKey,
          status,
          sortOrder,
          steps: stepsPayload,
        });
        toast.success("Article created successfully ✓");
      }
      onNavigate("help-center");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to save article.";
      setApiError(Array.isArray(msg) ? msg.join(" · ") : String(msg));
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  // ── Shared input style ──
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 11px", fontSize: ".875rem",
    border: "1px solid var(--border)", borderRadius: "6px",
    background: "var(--bg-inner)", color: "var(--text)",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: ".78rem", fontWeight: 600,
    color: "var(--text-muted)", marginBottom: "4px", display: "block",
  };
  const fieldStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: "4px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", width: "100%" }}>

      {/* ── Header / Breadcrumb ── */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={() => onNavigate("help-center")} title="Back">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div>
          <h1 className="ts-page-title">{isEdit ? "Edit Article" : "New Article"}</h1>
          <p className="ts-page-subtitle">
            Help Center &rarr; {isEdit ? "Edit Article" : "New Article"}
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="ts-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.6rem" }}>

        {/* ── Section 1 — Basic Info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ margin: 0, fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: ".06em", color: "var(--text-muted)" }}>
            Basic Info
          </p>

          {/* Title */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Title <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              style={inputStyle}
              placeholder='e.g. "How do I reset my password?"'
              value={title}
              onChange={e => { setTitle(e.target.value); setApiError(null); }}
            />
          </div>

          {/* Short Description */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Short Description</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              placeholder="A brief intro describing this article…"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Category + Status side-by-side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Category</label>
              <select
                style={inputStyle}
                value={categoryKey}
                onChange={e => setCategoryKey(e.target.value)}
              >
                {HELP_CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
                {/* Extra categories beyond the sidebar filter */}
                <option value="technical">Technical Issues</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select
                style={inputStyle}
                value={status}
                onChange={e => setStatus(e.target.value as "auto" | "reviewed")}
              >
                <option value="reviewed">Published</option>
                <option value="auto">Draft</option>
              </select>
            </div>
          </div>

          {/* Sort Order */}
          <div style={{ ...fieldStyle, maxWidth: 180 }}>
            <label style={labelStyle}>Sort Order</label>
            <input
              type="number"
              style={inputStyle}
              min={0}
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: "1px solid var(--border)" }} />

        {/* ── Section 2 — Steps Builder ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ margin: 0, fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: ".06em", color: "var(--text-muted)" }}>
            Answer Steps
          </p>

          {steps.length === 0 && (
            <p style={{ fontSize: ".82rem", color: "var(--text-muted)", margin: 0 }}>
              No steps yet. Click "+ Add Step" to add step-by-step instructions.
            </p>
          )}

          {steps.map((step, idx) => (
            <div
              key={step.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={e => onDragOver(e, idx)}
              onDrop={onDrop}
              style={{
                border: "1px solid var(--border)", borderRadius: 8,
                padding: "1rem", display: "flex", gap: ".75rem", alignItems: "flex-start",
                background: "var(--bg-inner)", cursor: "grab",
              }}
            >
              {/* Drag handle */}
              <div style={{ paddingTop: 6, color: "var(--text-muted)", flexShrink: 0 }}>
                <DragIndicatorRoundedIcon style={{ fontSize: 18 }} />
              </div>

              {/* Step number badge */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#7c3aed", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".75rem", fontWeight: 700, flexShrink: 0, marginTop: 4,
              }}>
                {idx + 1}
              </div>

              {/* Fields */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".6rem" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Step Title</label>
                  <input
                    style={inputStyle}
                    placeholder="Short step title…"
                    value={step.title}
                    onChange={e => updateStep(step.id, "title", e.target.value)}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Step Description</label>
                  <textarea
                    style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                    placeholder="Detailed explanation for this step…"
                    value={step.description}
                    onChange={e => updateStep(step.id, "description", e.target.value)}
                  />
                </div>
              </div>

              {/* Delete */}
              <button
                className="ts-icon-btn"
                style={{ marginTop: 4, color: "#ef4444", flexShrink: 0 }}
                onClick={() => removeStep(step.id)}
                title="Remove step"
              >
                <DeleteOutlineRoundedIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          ))}

          {/* Add Step */}
          <button
            onClick={addStep}
            style={{
              alignSelf: "flex-start",
              padding: "7px 16px", fontSize: ".82rem", fontWeight: 600,
              border: "1.5px solid #7c3aed", borderRadius: 7,
              background: "transparent", color: "#7c3aed",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <AddRoundedIcon style={{ fontSize: 16 }} />
            Add Step
          </button>
        </div>

        {/* ── Error ── */}
        {apiError && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: ".4rem", padding: "8px 14px",
            color: "#ef4444", fontSize: ".875rem",
          }}>
            {apiError}
          </div>
        )}

        {/* ── Actions ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingTop: ".25rem" }}>
          <button
            className="ts-btn-ghost"
            onClick={() => onNavigate("help-center")}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="ts-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : isEdit
              ? <><SaveRoundedIcon style={{ fontSize: 14 }} /> Save Changes</>
              : <><AddRoundedIcon  style={{ fontSize: 14 }} /> Create Article</>
            }
          </button>
        </div>
      </div>

    </div>
  );
}
