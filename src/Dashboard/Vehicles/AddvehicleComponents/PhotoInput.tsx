import { useRef } from "react";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CloseRoundedIcon      from "@mui/icons-material/CloseRounded";

export function PhotoInput({ file, onSet, onClear }: {
  file: File | null;
  onSet: (f: FileList | null) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>

      {/* "Choose File" button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          padding: ".55rem .9rem",
          background: "var(--bg-inner)",
          border: "1px solid var(--border)",
          borderRight: "none",
          borderRadius: ".4rem 0 0 .4rem",
          fontSize: ".82rem", fontWeight: 600,
          color: "var(--text-h)",
          cursor: "pointer", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: ".35rem",
          transition: "background var(--t-fast)",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--rider-bg)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-inner)")}
      >
        <AttachFileRoundedIcon style={{ fontSize: 14 }} />
        Choose File
      </button>

      {/* "No file chosen" / filename display */}
      <div style={{
        flex: 1, padding: ".55rem .75rem",
        border: "1px solid var(--border)",
        borderRadius: "0 .4rem .4rem 0",
        background: "var(--bg-card)",
        fontSize: ".82rem",
        color: file ? "var(--text-h)" : "var(--text-faint)",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file ? file.name : "No file chosen"}
        </span>

        {/* Clear ✕ */}
        {file && (
          <button
            type="button"
            onClick={onClear}
            title="Remove"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", color: "var(--text-faint)",
              marginLeft: ".4rem", flexShrink: 0,
            }}
          >
            <CloseRoundedIcon style={{ fontSize: 14 }} />
          </button>
        )}
      </div>

      {/* Hidden real input */}
      <input
        ref={inputRef} type="file" accept="image/*"
        style={{ display: "none" }}
        onChange={e => onSet(e.target.files)}
      />
    </div>
  );
}