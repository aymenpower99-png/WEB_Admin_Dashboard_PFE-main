import { useState, useEffect, useCallback } from "react";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { billingApi, type TripPaymentRecord, formatId } from "../../../api/billing";
import {
  ROWS, ROW_H, TH, TD,
  PAYMENT_STATUS_STYLE, PAYMENT_STATUS_ICON, PAYMENT_STATUS_LABEL,
  Pagination,
} from "./billing-shared";

export default function TripPaymentsTab() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<TripPaymentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      {/* ── Filter pills (Users-page style) ── */}
      <div style={{ display: "flex", gap: ".35rem", marginBottom: "0.75rem" }}>
        {(["All", "PENDING", "PAID", "REFUNDED"] as const).map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{
              padding: ".3rem .85rem",
              borderRadius: "9999px",
              fontSize: ".82rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: statusFilter === s ? "#7c3aed" : "var(--bg-inner)",
              color: statusFilter === s ? "#fff" : "var(--text-muted)",
              transition: "all .15s",
            }}
          >
            {s === "All" ? "All" : (PAYMENT_STATUS_LABEL as any)[s] ?? s}
          </button>
        ))}
      </div>

      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div className="ts-toolbar">
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Trip Payments</p>
        </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "11%" }} /><col style={{ width: "21%" }} /><col style={{ width: "21%" }} />
            <col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "21%" }} />
          </colgroup>
          <thead>
            <tr>
              {["Ride ID", "Pickup", "Drop-off", "Method", "Amount", "Status"].map((h) => (
                <th key={h} style={{ ...TH }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr style={{ height: ROW_H }}><td colSpan={6} style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)" }}>Loading…</td></tr>
            ) : payments.length === 0 ? (
              <>
                <tr style={{ height: ROW_H }}><td colSpan={6} style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)" }}>No payments found.</td></tr>
                {Array.from({ length: ROWS - 1 }).map((_, i) => <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>)}
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
                  </tr>
                ))}
                {Array.from({ length: ghostCount }).map((_, i) => (
                  <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={6} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
    </div>
    </>
  );
}
