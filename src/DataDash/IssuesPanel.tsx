import { useEffect, useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import { C } from "./tokens";
import { fetchSupportTickets, type SupportTicket } from "./mockData";

interface IssuesPanelProps {
  dark: boolean;
}

export function IssuesPanel({ dark }: IssuesPanelProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportTickets("open")
      .then((data) => setTickets(data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  const categoryIcon = (cat: string) =>
    cat === "payment" ? AlertTriangle : MapPin;

  const categoryColor = (cat: string) =>
    cat === "payment" ? C.error : C.warning;

  return (
    <div className="rounded-xl border p-4" style={{ background: surface, borderColor: border }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Critical Issues</span>
        {!loading && tickets.length > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: C.error, color: "#fff", fontSize: 10 }}>
            {tickets.length} OPEN
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ padding: "16px 0", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: sub }}>Loading tickets…</span>
        </div>
      ) : tickets.length === 0 ? (
        <p style={{ fontSize: 12, color: sub, fontStyle: "italic" }}>No open critical issues.</p>
      ) : (
        tickets.map((t) => {
          const Icon  = categoryIcon(t.category);
          const color = categoryColor(t.category);
          return (
            <div key={t.id} className="rounded-lg p-3 mb-2"
              style={{ background: `${color}0F`, border: `1px solid ${color}33` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={13} color={color} />
                <span style={{ fontSize: 12, fontWeight: 600, color }}>{t.category.toUpperCase()}</span>
                <span className="ml-auto px-1.5 py-0.5 rounded text-xs font-semibold"
                  style={{ background: `${color}22`, color, fontSize: 9 }}>
                  {t.status.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 11, color: sub, lineHeight: 1.5 }}>{t.subject}</p>
              {t.created_at && (
                <p style={{ fontSize: 10, color: dark ? "rgba(255,255,255,.2)" : "rgba(0,0,0,.25)", marginTop: 4 }}>
                  {new Date(t.created_at).toLocaleString()}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}