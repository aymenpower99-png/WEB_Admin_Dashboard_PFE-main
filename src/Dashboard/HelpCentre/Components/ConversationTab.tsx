import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import type { Message } from "./types";

interface ConversationTabProps {
  messages: Message[];
  ticketStatus?: string;
  ticketCreatedAt?: string; // Full ISO timestamp from ticket for date reference
  onSend: (content: string) => void;
  onEditMessage?: (messageId: string, content: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  dark: boolean;
}

// Helper function to format timestamp as relative time (Today, Yesterday, or date)
function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return ""; // Invalid date - return empty

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (messageDate.getTime() === today.getTime()) {
    // Today
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    // Yesterday
    return "Yesterday";
  } else {
    // Older - show date
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

// Helper function to format time from timestamp
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Helper: check if two ISO timestamps fall on the same calendar day
function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return true; // treat invalid as same
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

// Date separator shown between messages of different days
function DateSeparator({ label, dark }: { label: string; dark: boolean }) {
  return (
    <div className="flex items-center justify-center my-2">
      <span
        className={`text-xs px-3 py-1 rounded-full ${
          dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function ConversationTab({
  messages,
  ticketStatus,
  ticketCreatedAt,
  onSend,
  onEditMessage,
  onDeleteMessage,
  dark,
}: ConversationTabProps) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const isResolved = ticketStatus === "Resolved";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (isResolved) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function startEdit(msg: Message) {
    setEditingId(msg.id);
    setEditValue(msg.content);
    setMenuOpenId(null);
  }

  function saveEdit(id: string) {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    onEditMessage?.(id, trimmed);
    setEditingId(null);
    setEditValue("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function confirmDelete(id: string) {
    setMenuOpenId(null);
    if (window.confirm("Delete this message? This cannot be undone.")) {
      onDeleteMessage?.(id);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area — scrollable, grows to fill space */}
      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-5 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2">
            <svg
              className={`w-10 h-10 ${muted}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className={`text-sm ${muted}`}>No messages yet.</p>
          </div>
        )}

        {messages.flatMap((msg, i) => {
          const isAdmin = msg.senderType === "admin";
          const isMine = isAdmin && msg.senderId === user?.id;
          const isEditing = editingId === msg.id;

          // Determine the ISO basis for date comparison
          const msgDate = msg.createdAt ?? ticketCreatedAt ?? "";
          const prevDate =
            i > 0 ? (messages[i - 1].createdAt ?? ticketCreatedAt ?? "") : "";

          // Insert a date separator before the first message of a new day
          const showSeparator =
            i === 0 || (msgDate && prevDate && !isSameDay(msgDate, prevDate));
          const separatorLabel = msgDate ? formatRelativeTime(msgDate) : "";

          const items: React.ReactNode[] = [];
          if (showSeparator && separatorLabel) {
            items.push(
              <DateSeparator
                key={`sep-${i}`}
                label={separatorLabel}
                dark={dark}
              />,
            );
          }

          items.push(
            <div
              key={msg.id}
              className={`flex flex-col ${isAdmin ? "items-end" : "items-start"} group`}
            >
              {/* Three-dot menu — only on admin's own messages when edit/delete handlers are provided */}
              {isMine && !isEditing && (onEditMessage || onDeleteMessage) && (
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === msg.id ? null : msg.id)
                    }
                    className={`p-1 rounded-md hover:bg-gray-200 ${dark ? "hover:bg-gray-700" : ""}`}
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {menuOpenId === msg.id && (
                    <div
                      className={`absolute right-0 top-full mt-1 w-28 rounded-lg shadow-lg border z-10 overflow-hidden ${
                        dark
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => startEdit(msg)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${dark ? "hover:bg-gray-700 text-gray-200" : "text-gray-700"}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(msg.id)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 ${dark ? "hover:bg-red-900/30" : ""}`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isEditing ? (
                <div
                  className={`max-w-[70%] w-full px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
                    dark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className={`w-full bg-transparent outline-none resize-none text-sm ${dark ? "text-gray-200 placeholder-gray-500" : "text-gray-800 placeholder-gray-400"}`}
                    rows={2}
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={cancelEdit}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(msg.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                      style={{
                        background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isAdmin
                      ? "text-white rounded-tr-sm"
                      : dark
                        ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                  style={
                    isAdmin
                      ? {
                          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                        }
                      : {}
                  }
                >
                  {msg.content}
                </div>
              )}

              {/* Timestamp below the message bubble — time only */}
              <p className={`text-xs ${muted} mt-1`}>
                {msg.sender} · {formatTime(msg.timestamp)}
                {msg.updatedAt ? " · edited" : ""}
              </p>
            </div>,
          );

          return items;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area — fixed at bottom */}
      {isResolved ? (
        <div
          className={`flex-shrink-0 border-t px-4 py-3 text-center ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            This ticket is resolved. No further messages can be sent.
          </div>
        </div>
      ) : (
        <div
          className={`flex-shrink-0 border-t px-4 py-3 ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}
        >
          <div
            className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-colors ${
              dark
                ? "bg-gray-800 border-gray-700 focus-within:border-violet-500"
                : "bg-gray-50 border-gray-200 focus-within:border-violet-400 focus-within:bg-white"
            }`}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className={`flex-1 bg-transparent text-sm outline-none ${
                dark
                  ? "text-gray-200 placeholder-gray-500"
                  : "text-gray-700 placeholder-gray-400"
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white disabled:opacity-30 transition-all hover:opacity-90 flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className={`text-xs mt-1.5 text-center ${muted}`}>
            Press Enter to send
          </p>
        </div>
      )}
    </div>
  );
}
