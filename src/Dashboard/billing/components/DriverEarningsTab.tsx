import { useState, useEffect, useCallback } from "react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { billingApi, type DriverEarningRecord } from "../../../api/billing";
import { ROWS, ROW_H, TH, TD, Pagination } from "./billing-shared";

export default function DriverEarningsTab() {
  const [page, setPage] = useState(1);
  const [earnings, setEarnings] = useState<DriverEarningRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await billingApi.getDriverEarnings({ page, limit: ROWS });
      setEarnings(res.data);
      setTotal(res.total);
    } catch { setEarnings([]); setTotal(0); }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));
  const ghostCount = ROWS - earnings.length;

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      await billingApi.calculateEarnings();
      await fetchEarnings();
    } catch { /* silent */ }
    setCalculating(false);
  };

  const modelCards = [
    { emoji: "💰", title: "Fixed Salary",  desc: "Guaranteed monthly base pay per driver. Not affected by ride count — ensures stable income and retention.", color: "#3b82f6" },
    { emoji: "📈", title: "Bonuses",        desc: "Performance-based bonuses: trip volume, high ratings (4.5+), high activity (100+ rides/month).",           color: "#10b981" },
    { emoji: "⚠️", title: "Penalties",     desc: "Deductions for cancellations, late arrivals, or complaints. Fair and transparent calculation.",              color: "#ef4444" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Model info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.875rem" }}>
        {modelCards.map(c => (
          <div key={c.title} className="ts-card" style={{ padding: "1rem 1.25rem", borderLeft: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{c.emoji}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-h)" }}>{c.title}</span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Formula banner */}
      <div className="ts-card" style={{ padding: "0.875rem 1.25rem", background: "var(--bg-inner)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: ".07em" }}>Formula</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Fixed Salary", color: "#3b82f6" },
            { label: "+",            color: "var(--text-faint)" },
            { label: "Bonuses",      color: "#10b981" },
            { label: "−",            color: "var(--text-faint)" },
            { label: "Penalties",    color: "#ef4444" },
            { label: "=",            color: "var(--text-faint)" },
            { label: "Net Earnings", color: "var(--text-h)" },
          ].map((item, i) => (
            <span key={i} style={{
              fontSize: "0.8rem",
              fontWeight: item.label === "Net Earnings" ? 800 : ["+", "=", "−"].includes(item.label) ? 500 : 600,
              color: item.color,
            }}>{item.label}</span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div className="ts-toolbar">
          <div className="flex items-center gap-2">
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Driver Earnings Breakdown</p>
            <span className="ts-chip">{total} drivers</span>
          </div>
          <button className="ts-btn-primary"
            style={{ padding: "0.3rem 0.85rem", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
            onClick={handleCalculate} disabled={calculating}>
            <RefreshRoundedIcon style={{ fontSize: 14 }} />
            {calculating ? "Calculating…" : "Calculate This Month"}
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "14%" }} /><col style={{ width: "10%" }} /><col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} /><col style={{ width: "14%" }} /><col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} /><col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                {["Month", "Trips", "Fixed Salary", "Bonuses", "Penalties", "Net Earnings", "Rating", "Status"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: ROW_H }}><td colSpan={8} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>Loading…</td></tr>
              ) : earnings.length === 0 ? (
                <>
                  <tr style={{ height: ROW_H }}>
                    <td colSpan={8} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                      No earnings data yet. Click "Calculate This Month" to generate.
                    </td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={8} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                  ))}
                </>
              ) : (
                <>
                  {earnings.map(d => (
                    <tr key={d.id} className="ts-tr" style={{ height: ROW_H }}>
                      <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-h)" }}>{d.month}</span></td>
                      <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>{d.completedTrips}</span></td>
                      <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: "#3b82f6" }}>{d.fixedSalary.toLocaleString()} TND</span></td>
                      <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: "#10b981" }}>{d.totalBonuses.toLocaleString()} TND</span></td>
                      <td style={TD}>
                        {d.totalPenalties > 0
                          ? <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#ef4444" }}>−{d.totalPenalties.toLocaleString()} TND</span>
                          : <span style={{ fontSize: ".78rem", color: "var(--text-faint)" }}>—</span>}
                      </td>
                      <td style={TD}><span style={{ fontSize: ".85rem", fontWeight: 800, color: "var(--text-h)" }}>{d.netEarnings.toLocaleString()} TND</span></td>
                      <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>⭐ {d.avgRating.toFixed(1)}</span></td>
                      <td style={TD}>
                        <span className={d.earningStatus === "PAID" ? "ts-pill ts-pill-completed" : "ts-pill ts-pill-pending"} style={{ fontSize: "0.65rem" }}>
                          {d.earningStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={8} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
      </div>
    </div>
  );
}
