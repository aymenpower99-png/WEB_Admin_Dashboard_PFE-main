import { useState, useMemo, useEffect, useCallback } from "react";
import { billingApi, type TransactionRecord, type TransactionType, formatId } from "../../../api/billing";
import {
  ROWS, ROW_H, TH, TD,
  PAYMENT_STATUS_STYLE, PAYMENT_STATUS_ICON, PAYMENT_STATUS_LABEL,
  Pagination, FilterPill,
} from "./billing-shared";

export default function TransactionsTab() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>("All");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: ROWS };
      if (typeFilter !== "All") params.type = typeFilter;
      const res = await billingApi.getTransactions(params);
      setTransactions(res.data);
      setTotal(res.total);
    } catch { setTransactions([]); setTotal(0); }
    setLoading(false);
  }, [page, typeFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filtered = useMemo(() => {
    if (!search) return transactions;
    return transactions.filter(t => t.id.toLowerCase().includes(search.toLowerCase()));
  }, [transactions, search]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));
  const ghostCount = ROWS - filtered.length;

  const TYPE_COLOR: Record<string, string> = {
    RIDE_PAYMENT: "var(--text-h)",
    REFUND:       "#ef4444",
    ADJUSTMENT:   "#f59e0b",
  };

  return (
    <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="flex items-center gap-2">
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Transactions</p>
          <span className="ts-chip">{total} entries</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              padding: "0.3rem 0.75rem", fontSize: "0.75rem", borderRadius: "2rem",
              border: "1px solid var(--border)", background: "var(--bg-inner)",
              color: "var(--text-body)", outline: "none", width: 140,
            }}
          />
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value as any); setPage(1); }}
            style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem", fontWeight: 600, border: "1px solid var(--border)", borderRadius: "2rem", background: "var(--bg-inner)", color: "var(--text-muted)", cursor: "pointer" }}>
            {["All", "RIDE_PAYMENT", "REFUND", "ADJUSTMENT"].map(s => (
              <option key={s} value={s}>{s === "All" ? "All Types" : PAYMENT_STATUS_LABEL[s] ?? s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "20%" }} /><col style={{ width: "18%" }} /><col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} /><col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr>{["Transaction ID", "Date", "Type", "Amount", "Status"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr style={{ height: ROW_H }}><td colSpan={5} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <>
                <tr style={{ height: ROW_H }}><td colSpan={5} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>No transactions found.</td></tr>
                {Array.from({ length: ROWS - 1 }).map((_, i) => <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={5} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            ) : (
              <>
                {filtered.map(t => (
                  <tr key={t.id} className="ts-tr" style={{ height: ROW_H }}>
                    <td style={TD}><span className="ts-td-h font-mono font-semibold" style={{ fontSize: ".78rem" }}>{formatId("TXN", t.id)}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>{new Date(t.createdAt).toLocaleDateString()}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: TYPE_COLOR[t.transactionType] ?? "var(--text-h)" }}>{PAYMENT_STATUS_LABEL[t.transactionType] ?? t.transactionType}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 700, color: t.amount < 0 ? "#ef4444" : "var(--text-h)" }}>{t.amount < 0 ? `-${Math.abs(t.amount).toFixed(2)}` : `${t.amount.toFixed(2)}`} TND</span></td>
                    <td style={TD}>
                      <span className={PAYMENT_STATUS_STYLE[t.transactionStatus] ?? "ts-pill"} style={{ fontSize: "0.7rem", display: "inline-flex", alignItems: "center" }}>
                        {PAYMENT_STATUS_ICON[t.transactionStatus]}{PAYMENT_STATUS_LABEL[t.transactionStatus] ?? t.transactionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {Array.from({ length: ghostCount }).map((_, i) => <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={5} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
    </div>
  );
}
