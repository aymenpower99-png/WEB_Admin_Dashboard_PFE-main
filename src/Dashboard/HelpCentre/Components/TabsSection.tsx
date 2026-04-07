import { useState } from "react";
import type { Ticket } from "./types";
import InternalNotesTab from "./InternalNotesTab";
import ConversationTab from "./ConversationTab";
import ActivityTab from "./ActivityTab";

interface TabsSectionProps {
  ticket: Ticket;
  onAddNote: (content: string) => void;
  onSendMessage: (content: string) => void;
  dark: boolean;
}

type Tab = "notes" | "conversation" | "activity";

const TABS: { id: Tab; label: string }[] = [
  { id: "notes", label: "Internal Notes" },
  { id: "conversation", label: "Conversation" },
  { id: "activity", label: "Activity" },
];

export default function TabsSection({ ticket, onAddNote, onSendMessage, dark }: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const tabInactive = dark
    ? "text-gray-400 hover:text-gray-200"
    : "text-gray-500 hover:text-gray-700";
  const countBadge = dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500";

  return (
    <div>
      {/* Tab bar */}
      <div className={`flex border-b mb-4 ${dark ? "border-gray-800" : "border-gray-200"}`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-violet-500 text-violet-600"
                : `border-transparent ${tabInactive}`
            }`}
          >
            {tab.label}
            {tab.id === "notes" && ticket.notes.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${countBadge}`}>
                {ticket.notes.length}
              </span>
            )}
            {tab.id === "conversation" && ticket.messages.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${countBadge}`}>
                {ticket.messages.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "notes" && (
        <InternalNotesTab notes={ticket.notes} onAddNote={onAddNote} dark={dark} />
      )}
      {activeTab === "conversation" && (
        <ConversationTab messages={ticket.messages} onSend={onSendMessage} dark={dark} />
      )}
      {activeTab === "activity" && (
        <ActivityTab events={ticket.activity} dark={dark} />
      )}
    </div>
  );
}