import { useState, useEffect, useCallback } from "react";
import { billingApi, type DriverEarningRecord } from "../../../api/billing";
import { ROWS, currentMonth }          from "./components/DriverEarningsTypes";
import DriverEarningsKpiCards          from "./components/DriverEarningsKpiCards";
import DriverEarningsMonthPicker       from "./components/DriverEarningsMonthPicker";
import DriverEarningsTable             from "./components/DriverEarningsTable";
import DriverEarningsPagination        from "./components/DriverEarningsPagination";

export default function AgencyBillingDriverEarningsPage() {
  const [month,    setMonth]    = useState(currentMonth);
  const [page,     setPage]     = useState(1);
  const [data,     setData]     = useState<DriverEarningRecord[]>([]);
  const [allData,  setAllData]  = useState<DriverEarningRecord[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    try {
      /* paginated fetch for the table */
      const res = await billingApi.getDriverEarnings({ month, page, limit: ROWS });
      setData(res.data);
      setTotal(res.total);

      /* full-month fetch for KPI card totals */
      const all = await billingApi.getDriverEarnings({ month, page: 1, limit: 9999 });
      setAllData(all.data);
    } catch {
      setData([]);
      setAllData([]);
      setTotal(0);
    }
    setLoading(false);
  }, [month, page]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* ── Header ── */}
      <div className="ts-page-header">
        <div>
          <h1 className="ts-page-title">Driver Earnings</h1>
          <p className="ts-muted" style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
            Monthly driver salary and commission breakdown
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <DriverEarningsKpiCards drivers={allData} total={total} loading={loading} />

      {/* ── Table card ── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>

        {/* Toolbar: title + month picker */}
        <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>
            Driver Earnings
          </p>
          <DriverEarningsMonthPicker
            value={month}
            onChange={(m) => { setMonth(m); setPage(1); }}
          />
        </div>

        <DriverEarningsTable
          data={data}
          loading={loading}
          page={page}
          onRefresh={fetchEarnings}
        />

        <DriverEarningsPagination
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

