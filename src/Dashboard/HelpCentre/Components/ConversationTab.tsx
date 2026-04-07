import { useState, useRef, useEffect } from "react";
import type { Message } from "./types";

interface ConversationTabProps {
  messages: Message[];
  onSend: (content: string) => void;
  dark: boolean;
}

export default function ConversationTab({ messages, onSend, dark }: ConversationTabProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const muted = dark ? "text-gray-400" : "text-gray-500";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages area — scrollable, grows to fill space */}
      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-5 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2">
            <svg className={`w-10 h-10 ${muted}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className={`text-sm ${muted}`}>No messages yet.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isAdmin = msg.senderType === "admin";
          return (
            <div key={msg.id} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
              <p className={`text-xs mb-1.5 ${muted}`}>
                {msg.sender} · {msg.timestamp}
              </p>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isAdmin
                    ? "text-white rounded-tr-sm"
                    : dark
                    ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}
                style={isAdmin ? { background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" } : {}}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area — fixed at bottom */}
      <div className={`flex-shrink-0 border-t px-4 py-3 ${dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
        <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-colors ${
          dark ? "bg-gray-800 border-gray-700 focus-within:border-violet-500" : "bg-gray-50 border-gray-200 focus-within:border-violet-400 focus-within:bg-white"
        }`}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className={`flex-1 bg-transparent text-sm outline-none ${
              dark ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white disabled:opacity-30 transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className={`text-xs mt-1.5 text-center ${muted}`}>Press Enter to send</p>
      </div>
    </div>
  );
}