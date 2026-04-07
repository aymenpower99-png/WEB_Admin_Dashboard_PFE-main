import { useState } from "react";
import type { InternalNote } from "./types";

interface InternalNotesTabProps {
  notes: InternalNote[];
  onAddNote: (content: string) => void;
  dark: boolean;
}

function InitialAvatar({ name, dark }: { name: string; dark: boolean }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
      dark ? "bg-violet-800 text-violet-200" : "bg-violet-100 text-violet-700"
    }`}>
      {initials}
    </div>
  );
}

const GRADIENT = "linear-gradient(135deg,#8b5cf6,#6d28d9)";

export default function InternalNotesTab({ notes, onAddNote, dark }: InternalNotesTabProps) {
  const [input, setInput] = useState("");
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const noteCard = dark ? "bg-gray-800 border-gray-700" : "bg-amber-50 border-amber-100";
  const inputCls = dark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-violet-500"
    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400";

  function handleAdd() {
    if (!input.trim()) return;
    onAddNote(input.trim());
    setInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Admin-only label */}
      <div className={`flex items-center gap-1.5 text-xs ${muted}`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Visible to admins only — not shown to users</span>
      </div>

      {/* Notes list */}
      <div className="flex flex-col gap-3">
        {notes.length === 0 && (
          <p className={`text-xs text-center py-4 ${muted}`}>No internal notes yet.</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className={`rounded-xl border p-3 ${noteCard}`}>
            <div className="flex items-center gap-2 mb-2">
              <InitialAvatar name={note.adminName} dark={dark} />
              <div>
                <p className={`text-xs font-semibold ${dark ? "text-gray-200" : "text-gray-800"}`}>
                  {note.adminName}
                </p>
                <p className={`text-xs ${muted}`}>{note.timestamp}</p>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${dark ? "text-gray-300" : "text-gray-700"}`}>
              {note.content}
            </p>
          </div>
        ))}
      </div>

      {/* Add note input */}
      <div>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add an internal note for your team…"
          className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none resize-none transition-colors ${inputCls}`}
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="mt-2 w-full py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          style={{ background: GRADIENT }}
        >
          Add Note
        </button>
      </div>
    </div>
  );
}