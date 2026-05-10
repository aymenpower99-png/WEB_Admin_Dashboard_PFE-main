
// ── AIStrategyPanel ───────────────────────────────────────────────────────────

import { Cpu } from "lucide-react";
import { useState } from "react";
import { aiInsights } from "./mockData";
import { C } from "./tokens";
import {  AIReportModal } from "./AIReportModalProps";
interface AIStrategyPanelProps {
  dark: boolean;
}



export function AIStrategyPanel({ dark: _dark }: AIStrategyPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-xl p-4"
        style={{ background: `linear-gradient(135deg, ${C.secondaryPurple}, ${C.primaryPurple})` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={16} color="rgba(255,255,255,.9)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>AI Strategy</span>
        </div>

        {aiInsights.map((insight: string, i: number) => (
          <p key={i} className="mb-2 pl-3 italic" style={{ fontSize: 11, color: "rgba(255,255,255,.85)", borderLeft: "2px solid rgba(255,255,255,.3)", lineHeight: 1.6 }}>
            "{insight}"
          </p>
        ))}

        <button
          onClick={() => setOpen(true)}
          className="w-full mt-2 py-2 rounded-lg font-semibold transition-all hover:bg-white/20"
          style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", fontSize: 12, cursor: "pointer" }}
        >
          View Full Analysis →
        </button>
      </div>

{open && <AIReportModal onClose={() => setOpen(false)} />}
    </>
  );
}