import { useState, useEffect, useCallback } from "react";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { billingApi, type TripPaymentRecord, formatId } from "../../../api/billing";
import {
  ROWS, ROW_H, TH, TD,
  PAYMENT_STATUS_STYLE, PAYMENT_STATUS_ICON, PAYMENT_STATUS_LABEL,
  Pagination, FilterPill,
} from "./billing-shared";

export default function TripPaymentsTab({ onRefresh }: { onRefresh: () => void }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<TripPaymentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: ROWS };
      if (statusFilter !== "All") params.status = statusFilter;
      const res = await billingApi.getPayments(params);
      setPayments(res.data);
      setTotal(res.total);
    } catch { setPayments([]); setTotal(0); }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));
  const ghostCount = ROWS - payments.length;

  const handleConfirmCash = async (id: string) => {
    setActionLoading(id);
    try { await billingApi.confirmCashPayment(id); await fetchPayments(); onRefresh(); } catch { /* silent */ }
    setActionLoading(null);
  };



  return (
    <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="flex items-center gap-2">
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Trip Payments</p>
          <span className="ts-chip">{total} trips</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontWeight: 600 }}>Status:</span>
          {(["All", "PENDING", "PAID", "REFUNDED"] as const).map(s => (
            <FilterPill
              key={s}
              label={s === "All" ? "All" : (PAYMENT_STATUS_LABEL as any)[s] ?? s}
              active={statusFilter === s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            />
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "10%" }} /><col style={{ width: "18%" }} /><col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} /><col style={{ width: "10%" }} /><col style={{ width: "12%" }} /><col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr>
              {["Ride ID", "Pickup", "Drop-off", "Method", "Amount", "Status", "Actions"].map((h, i) => (
                <th key={h} style={{ ...TH, textAlign: i === 6 ? "center" : "left" as any }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr style={{ height: ROW_H }}><td colSpan={7} style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)" }}>Loading…</td></tr>
            ) : payments.length === 0 ? (
              <>
                <tr style={{ height: ROW_H }}><td colSpan={7} style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)" }}>No payments found.</td></tr>
                {Array.from({ length: ROWS - 1 }).map((_, i) => <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
              </>
            ) : (
              <>
                {payments.map(p => (
                  <tr key={p.id} className="ts-tr" style={{ height: ROW_H }}>
                    <td style={TD}><span className="ts-td-h font-mono font-semibold" style={{ fontSize: ".78rem" }}>{formatId("TRP", p.rideId)}</span></td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <NearMeRoundedIcon style={{ fontSize: 13, color: "#7c3aed", flexShrink: 0 }} />
                        <span style={{ fontSize: ".78rem", color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {(p as any).ride?.pickupAddress ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                        <PlaceRoundedIcon style={{ fontSize: 13, color: "#10b981", flexShrink: 0 }} />
                        <span style={{ fontSize: ".78rem", color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {(p as any).ride?.dropoffAddress ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td style={TD}><span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>{p.paymentMethod ?? "—"}</span></td>
                    <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>{p.amount.toFixed(2)} TND</span></td>
                    <td style={TD}>
                      <span className={(PAYMENT_STATUS_STYLE as any)[p.paymentStatus] ?? "ts-pill"} style={{ fontSize: "0.7rem", display: "inline-flex", alignItems: "center" }}>
                        {(PAYMENT_STATUS_ICON as any)[p.paymentStatus]}
                        {(PAYMENT_STATUS_LABEL as any)[p.paymentStatus] ?? p.paymentStatus}
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign: "center" as const }}>
                      <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                        {p.paymentStatus === "PENDING" && (
                          <button className="ts-btn-primary" style={{ padding: "0.22rem 0.6rem", fontSize: "0.65rem" }}
                            onClick={() => handleConfirmCash(p.id)} disabled={actionLoading === p.id}>
                            {actionLoading === p.id ? "…" : "Confirm Cash"}
                          </button>
                        )}
                        {p.paymentStatus === "PAID" && (
                          <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 600 }}>✓ Paid</span>
                        )}
                        {(p.paymentStatus === "REFUNDED" || p.paymentStatus === "FAILED") && (
                          <span style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {Array.from({ length: ghostCount }).map((_, i) => (
                  <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
    </div>
  );
}
