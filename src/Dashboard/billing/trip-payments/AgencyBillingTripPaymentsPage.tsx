import { useState, useEffect, useCallback } from "react";
import { billingApi, type TripPaymentRecord, type RevenueStats } from "../../../api/billing";
import { ROWS, type FilterTab } from "./components/TripPaymentsTypes";
import TripPaymentsKpiCards   from "./components/TripPaymentsKpiCards";
import TripPaymentsFilterPills from "./components/TripPaymentsFilterPills";
import TripPaymentsTable       from "./components/TripPaymentsTable";
import TripPaymentsPagination  from "./components/TripPaymentsPagination";

export default function AgencyBillingTripPaymentsPage() {
  const [filter,   setFilter]   = useState<FilterTab>("All");
  const [page,     setPage]     = useState(1);
  const [payments, setPayments] = useState<TripPaymentRecord[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);

  const [stats,        setStats]        = useState<RevenueStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* ── fetch stats once ── */
  useEffect(() => {
    billingApi.getRevenueStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: ROWS };
      if (filter !== "All") params.status = filter;
      const res = await billingApi.getPayments(params as any);
      setPayments(res.data);
      setTotal(res.total);
    } catch {
      setPayments([]);
      setTotal(0);
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Trip Payments</h1>
          <p className="ts-muted" style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
            All ride payments with status tracking
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <TripPaymentsKpiCards stats={stats} loading={statsLoading} />

      {/* ── Filter pills ── */}
      <TripPaymentsFilterPills
        active={filter}
        onChange={(f) => { setFilter(f); setPage(1); }}
      />

      {/* ── Table card ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div className="ts-toolbar">
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>
            {loading ? "Loading…" : `${total} payment${total !== 1 ? "s" : ""}`}
          </p>
        </div>

        <TripPaymentsTable payments={payments} loading={loading} />

        <TripPaymentsPagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          setPage={setPage}
        />
      </div>

    </div>
  );
}

