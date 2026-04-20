import { useState, useEffect, useCallback } from "react";
import {
  billingApi,
  type DriverEarningRecord,
  type CommissionTierRecord,
  formatId,
} from "../../../api/billing";
import { driversApi } from "../../../api/drivers";
import {
  ROWS, ROW_H, TH, TD,
  Pagination, FilterPill,
} from "./billing-shared";

/* ── Month helper ─────────────────────────────────────────────────── */
function getMonthOptions(): { value: string; label: string }[] {
  const opts: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    opts.push({ value, label });
  }
  return opts;
}

export default function DriverEarningsTab() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DriverEarningRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  /* Tier modal state */
  const [showTierModal, setShowTierModal] = useState(false);
  const [tiers, setTiers] = useState<CommissionTierRecord[]>([]);
  const [tierLoading, setTierLoading] = useState(false);
  const [newTier, setNewTier] = useState({ name: "", requiredRides: "", bonusAmount: "" });

  /* Salary edit state */
  const [editingSalary, setEditingSalary] = useState<string | null>(null);
  const [salaryValue, setSalaryValue] = useState("");
  const [salaryLoading, setSalaryLoading] = useState(false);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await billingApi.getDriverEarnings({ month, page, limit: ROWS });
      setData(res.data);
      setTotal(res.total);
    } catch { setData([]); setTotal(0); }
    setLoading(false);
  }, [month, page]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));
  const ghostCount = ROWS - data.length;

  /* ── Salary update ── */
  const handleSalaryEdit = (driver: DriverEarningRecord) => {
    setEditingSalary(driver.driverProfileId);
    setSalaryValue(String(driver.fixedSalary));
  };

  const handleSalarySave = async () => {
    if (!editingSalary) return;
    setSalaryLoading(true);
    try {
      await driversApi.update(editingSalary, { fixedMonthlySalary: Number(salaryValue) });
      setEditingSalary(null);
      await fetchEarnings();
    } catch (e) {
      alert("Failed to update salary");
    }
    setSalaryLoading(false);
  };

  /* ── Tier CRUD ── */
  const fetchTiers = async () => {
    setTierLoading(true);
    try { setTiers(await billingApi.getTiers()); } catch { /* silent */ }
    setTierLoading(false);
  };

  const handleAddTier = async () => {
    if (!newTier.name || !newTier.requiredRides || !newTier.bonusAmount) return;
    try {
      await billingApi.createTier({
        name: newTier.name,
        requiredRides: Number(newTier.requiredRides),
        bonusAmount: Number(newTier.bonusAmount),
      });
      setNewTier({ name: "", requiredRides: "", bonusAmount: "" });
      await fetchTiers();
    } catch { /* silent */ }
  };

  const handleDeleteTier = async (id: string) => {
    if (!window.confirm("Delete this tier?")) return;
    try { await billingApi.deleteTier(id); await fetchTiers(); } catch { /* silent */ }
  };

  const openTierModal = () => {
    setShowTierModal(true);
    fetchTiers();
  };

  const monthOptions = getMonthOptions();

  return (
    <>
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div className="flex items-center gap-2">
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Driver Earnings</p>
            <span className="ts-chip">{total} drivers</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); setPage(1); }}
              style={{
                fontSize: "0.72rem", padding: "0.3rem 0.6rem", borderRadius: "0.5rem",
                border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-h)",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              {monthOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              className="ts-btn-primary"
              style={{ padding: "0.3rem 0.7rem", fontSize: "0.7rem" }}
              onClick={openTierModal}
            >
              + Commission Tiers
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="ts-table">
          <thead>
            <tr>
              <th style={TH}>#</th>
              <th style={TH}>Driver</th>
              <th style={TH}>Rides</th>
              <th style={TH}>Salary</th>
              <th style={TH}>Commission</th>
              <th style={TH}>Net Earnings</th>
              <th style={{ ...TH, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: ROWS }).map((_, i) => (
                <tr key={i} style={{ height: ROW_H }}>
                  <td colSpan={7} style={{ borderBottom: "1px solid var(--border)" }}>
                    <div style={{ height: 14, background: "var(--border)", borderRadius: 4, width: "60%", opacity: 0.5 }} />
                  </td>
                </tr>
              ))
            ) : (
              <>
                {data.map((d, i) => (
                  <tr key={d.driverProfileId} style={{ height: ROW_H }}>
                    <td style={TD}>{(page - 1) * ROWS + i + 1}</td>
                    <td style={TD}>
                      <span style={{ fontWeight: 600 }}>{d.driverName}</span>
                    </td>
                    <td style={TD}>{d.completedTrips}</td>
                    <td style={TD}>
                      {editingSalary === d.driverProfileId ? (
                        <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                          <input
                            type="number"
                            value={salaryValue}
                            onChange={(e) => setSalaryValue(e.target.value)}
                            style={{ width: 70, fontSize: "0.72rem", padding: "0.2rem 0.4rem", border: "1px solid var(--border)", borderRadius: 4 }}
                          />
                          <button
                            onClick={handleSalarySave}
                            disabled={salaryLoading}
                            style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", background: "#10b981", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
                          >
                            {salaryLoading ? "…" : "✓"}
                          </button>
                          <button
                            onClick={() => setEditingSalary(null)}
                            style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", background: "var(--border)", color: "var(--text-h)", border: "none", borderRadius: 4, cursor: "pointer" }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span>{d.fixedSalary.toLocaleString()} DT</span>
                      )}
                    </td>
                    <td style={TD}>
                      <span style={{ color: "#10b981", fontWeight: 600 }}>
                        +{d.totalBonuses.toLocaleString()} DT
                      </span>
                    </td>
                    <td style={TD}>
                      <span style={{ fontWeight: 700 }}>{d.netEarnings.toLocaleString()} DT</span>
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button
                        className="ts-btn-ghost"
                        style={{ padding: "0.2rem 0.5rem", fontSize: "0.65rem" }}
                        onClick={() => handleSalaryEdit(d)}
                      >
                        Edit Salary
                      </button>
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

        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} setPage={setPage} />
      </div>

      {/* ── Commission Tiers Modal ── */}
      {showTierModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999,
        }} onClick={() => setShowTierModal(false)}>
          <div style={{
            background: "var(--bg-card)", borderRadius: "1rem", padding: "1.5rem", width: "95%",
            maxWidth: 500, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-h)" }}>Commission Tiers</h3>
              <button onClick={() => setShowTierModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-faint)" }}>✕</button>
            </div>

            {/* Add new tier form */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <input
                placeholder="Name (e.g. Bronze)"
                value={newTier.name}
                onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                style={{ flex: 1, minWidth: 100, fontSize: "0.75rem", padding: "0.4rem 0.6rem", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-h)" }}
              />
              <input
                placeholder="Rides"
                type="number"
                value={newTier.requiredRides}
                onChange={(e) => setNewTier({ ...newTier, requiredRides: e.target.value })}
                style={{ width: 70, fontSize: "0.75rem", padding: "0.4rem 0.6rem", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-h)" }}
              />
              <input
                placeholder="Bonus DT"
                type="number"
                value={newTier.bonusAmount}
                onChange={(e) => setNewTier({ ...newTier, bonusAmount: e.target.value })}
                style={{ width: 80, fontSize: "0.75rem", padding: "0.4rem 0.6rem", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-h)" }}
              />
              <button className="ts-btn-primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.72rem" }} onClick={handleAddTier}>
                + Add
              </button>
            </div>

            {/* Tier list */}
            {tierLoading ? (
              <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.8rem" }}>Loading...</p>
            ) : tiers.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: "0.8rem" }}>No tiers configured</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {tiers.map((t) => (
                  <div key={t.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.6rem 0.8rem", background: "var(--bg-main)", borderRadius: 8, border: "1px solid var(--border)",
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text-h)" }}>{t.name}</span>
                      <span style={{ marginLeft: 8, fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        ≥{t.requiredRides} rides → +{t.bonusAmount} DT
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTier(t.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

