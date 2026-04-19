import { useState, useEffect, useCallback } from "react";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { toast } from "sonner";
import { billingApi, type DriverEarningRecord, type CommissionTierRecord, formatId } from "../../../api/billing";
import { driversApi } from "../../../api/drivers";
import { ROWS, ROW_H, TH, TD, Pagination } from "./billing-shared";

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

const INP: React.CSSProperties = {
  padding: "0.3rem 0.55rem", fontSize: "0.78rem", borderRadius: ".35rem",
  border: "1px solid var(--border)", background: "var(--bg-inner)",
  color: "var(--text-h)", outline: "none", width: "100%", boxSizing: "border-box",
};

/* ── Tier Form Row (inline add / edit) ───────────────────────────── */
function TierFormRow({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CommissionTierRecord;
  onSave: (data: { name: string; requiredRides: number; bonusAmount: number; sortOrder: number }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [rides, setRides] = useState(initial?.requiredRides?.toString() ?? "");
  const [bonus, setBonus] = useState(initial?.bonusAmount?.toString() ?? "");
  const [sort, setSort] = useState(initial?.sortOrder?.toString() ?? "0");

  return (
    <tr style={{ background: "var(--bg-inner)" }}>
      <td style={TD}><input style={INP} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bronze" /></td>
      <td style={TD}><input style={INP} type="number" value={rides} onChange={e => setRides(e.target.value)} placeholder="5" /></td>
      <td style={TD}><input style={INP} type="number" value={bonus} onChange={e => setBonus(e.target.value)} placeholder="50" /></td>
      <td style={TD}><input style={{ ...INP, width: 60 }} type="number" value={sort} onChange={e => setSort(e.target.value)} /></td>
      <td style={TD}>
        <div style={{ display: "flex", gap: ".3rem" }}>
          <button className="ts-btn-primary" style={{ padding: ".25rem .55rem", fontSize: ".7rem" }}
            onClick={() => onSave({ name, requiredRides: Number(rides), bonusAmount: Number(bonus), sortOrder: Number(sort) })}>
            Save
          </button>
          <button className="ts-btn-ghost" style={{ padding: ".25rem .55rem", fontSize: ".7rem" }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── Salary Inline Edit Cell ─────────────────────────────────────── */
function SalaryCell({ driverProfileId, salary, onUpdated }: { driverProfileId: string | null; salary: number; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(salary.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!driverProfileId) return;
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0) return;
    setSaving(true);
    try {
      await driversApi.update(driverProfileId, { fixedMonthlySalary: parsed });
      toast.success("Salary updated");
      setEditing(false);
      onUpdated();
    } catch {
      toast.error("Failed to update salary");
    }
    setSaving(false);
  };

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
        <input
          style={{ ...INP, width: 80 }}
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          autoFocus
        />
        <button onClick={handleSave} disabled={saving} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#10b981" }}>
          <CheckRoundedIcon style={{ fontSize: 16 }} />
        </button>
        <button onClick={() => setEditing(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text-faint)" }}>
          <CloseRoundedIcon style={{ fontSize: 16 }} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
      <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#3b82f6" }}>{(salary ?? 0).toLocaleString()} TND</span>
      {driverProfileId && (
        <button onClick={() => { setValue(salary.toString()); setEditing(true); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.5 }}>
          <EditRoundedIcon style={{ fontSize: 13, color: "var(--text-faint)" }} />
        </button>
      )}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */
export default function DriverEarningsTab() {
  const monthOptions = getMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [page, setPage] = useState(1);
  const [earnings, setEarnings] = useState<DriverEarningRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  /* Commission tiers modal */
  const [tiers, setTiers] = useState<CommissionTierRecord[]>([]);
  const [tiersModalOpen, setTiersModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<CommissionTierRecord | null>(null);
  const [addingTier, setAddingTier] = useState(false);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await billingApi.getDriverEarnings({ month: selectedMonth, page, limit: ROWS });
      setEarnings(res.data);
      setTotal(res.total);
    } catch { setEarnings([]); setTotal(0); }
    setLoading(false);
  }, [page, selectedMonth]);

  const fetchTiers = useCallback(async () => {
    try { setTiers(await billingApi.getTiers()); } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);
  useEffect(() => { fetchTiers(); }, [fetchTiers]);

  const totalPages = Math.max(1, Math.ceil(total / ROWS));
  const ghostCount = Math.max(0, ROWS - earnings.length);
  const isCurrentMonth = selectedMonth === monthOptions[0].value;

  const handleLockMonth = async () => {
    if (!window.confirm(`Lock all earnings for ${selectedMonth}? This cannot be undone.`)) return;
    try {
      const res = await billingApi.lockMonth(selectedMonth);
      toast.success(`Locked ${res.locked} earnings for ${selectedMonth}`);
      await fetchEarnings();
    } catch { toast.error("Failed to lock month"); }
  };

  const handleSaveTier = async (data: { name: string; requiredRides: number; bonusAmount: number; sortOrder: number }) => {
    try {
      if (editingTier?.id) {
        await billingApi.updateTier(editingTier.id, data);
        toast.success("Tier updated");
      } else {
        await billingApi.createTier(data);
        toast.success("Tier created");
      }
      setEditingTier(null);
      setAddingTier(false);
      await fetchTiers();
    } catch { toast.error("Failed to save tier"); }
  };

  const handleDeleteTier = async (id: string) => {
    if (!window.confirm("Delete this commission tier?")) return;
    try {
      await billingApi.deleteTier(id);
      toast.success("Tier deleted");
      await fetchTiers();
    } catch { toast.error("Failed to delete tier"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Commission Tiers Modal ─────────────────────────────────── */}
      {tiersModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: ".75rem", width: "min(700px, 95vw)", maxHeight: "80vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div className="ts-toolbar" style={{ borderBottom: "1px solid var(--border)", padding: "1rem 1.25rem", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Commission Tiers</p>
                <span className="ts-chip">{tiers.length} tiers</span>
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                {!addingTier && !editingTier && (
                  <button className="ts-btn-primary" style={{ padding: ".25rem .65rem", fontSize: ".68rem", display: "flex", alignItems: "center", gap: ".25rem" }}
                    onClick={() => setAddingTier(true)}>
                    <AddRoundedIcon style={{ fontSize: 13 }} /> Add Tier
                  </button>
                )}
                <button className="ts-btn-ghost" style={{ padding: ".25rem .65rem", fontSize: ".68rem" }}
                  onClick={() => { setTiersModalOpen(false); setEditingTier(null); setAddingTier(false); }}>
                  Close
                </button>
              </div>
            </div>
            <div style={{ overflowX: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "25%" }} /><col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} /><col style={{ width: "12%" }} />
                  <col style={{ width: "23%" }} />
                </colgroup>
                <thead>
                  <tr>
                    {["Tier Name", "Min Rides", "Bonus (TND)", "Order", "Actions"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tiers.length === 0 && !addingTier ? (
                    <tr style={{ height: ROW_H }}>
                      <td colSpan={5} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                        No tiers configured. Click "+ Add Tier" to create one.
                      </td>
                    </tr>
                  ) : (
                    tiers.map(t =>
                      editingTier?.id === t.id ? (
                        <TierFormRow key={t.id} initial={t} onSave={handleSaveTier} onCancel={() => setEditingTier(null)} />
                      ) : (
                        <tr key={t.id} className="ts-tr" style={{ height: ROW_H }}>
                          <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>{t.name}</span></td>
                          <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-body)" }}>≥ {t.requiredRides} rides</span></td>
                          <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 700, color: "#10b981" }}>+{t.bonusAmount} TND</span></td>
                          <td style={TD}><span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>{t.sortOrder}</span></td>
                          <td style={TD}>
                            <div style={{ display: "flex", gap: ".5rem" }}>
                              <button onClick={() => { setEditingTier(t); setAddingTier(false); }}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                <EditRoundedIcon style={{ fontSize: 15, color: "var(--text-faint)" }} />
                              </button>
                              <button onClick={() => handleDeleteTier(t.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                <DeleteRoundedIcon style={{ fontSize: 15, color: "#ef4444" }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                  {addingTier && (
                    <TierFormRow onSave={handleSaveTier} onCancel={() => setAddingTier(false)} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Earnings Table ─────────────────────────────────────────── */}
      <div className="ts-table-wrap" style={{ display: "flex", flexDirection: "column" }}>
        <div className="ts-toolbar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-h)" }}>Driver Earnings</p>
            <span className="ts-chip">{total} drivers</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
            <button className="ts-btn-ghost" style={{ padding: ".25rem .65rem", fontSize: ".68rem", display: "flex", alignItems: "center", gap: ".25rem" }}
              onClick={() => setTiersModalOpen(true)}>
              Commission Tiers
            </button>
            <select value={selectedMonth} onChange={e => { setSelectedMonth(e.target.value); setPage(1); }}
              style={{ padding: "0.3rem 0.5rem", fontSize: "0.72rem", fontWeight: 600, border: "1px solid var(--border)", borderRadius: "2rem", background: "var(--bg-inner)", color: "var(--text-muted)", cursor: "pointer" }}>
              {monthOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {!isCurrentMonth && (
              <button className="ts-btn-ghost" style={{ padding: ".25rem .7rem", fontSize: ".68rem", display: "flex", alignItems: "center", gap: ".25rem", color: "#ef4444", borderColor: "#ef4444" }}
                onClick={handleLockMonth}>
                <LockRoundedIcon style={{ fontSize: 13 }} /> Lock Month
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "10%" }} /><col style={{ width: "16%" }} /><col style={{ width: "7%" }} />
              <col style={{ width: "14%" }} /><col style={{ width: "8%" }} /><col style={{ width: "12%" }} />
              <col style={{ width: "11%" }} /><col style={{ width: "13%" }} /><col style={{ width: "9%" }} />
            </colgroup>
            <thead>
              <tr>
                {["ID", "Driver", "Trips", "Salary", "Attend.", "Bonuses", "Penalties", "Net Earnings", "Rating"].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: ROW_H }}><td colSpan={9} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>Loading…</td></tr>
              ) : earnings.length === 0 ? (
                <>
                  <tr style={{ height: ROW_H }}>
                    <td colSpan={9} style={{ ...TD, textAlign: "center", color: "var(--text-faint)" }}>
                      No earnings data for this month. Earnings are calculated automatically.
                    </td>
                  </tr>
                  {Array.from({ length: ROWS - 1 }).map((_, i) => (
                    <tr key={`ge-${i}`} style={{ height: ROW_H }}><td colSpan={9} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
                  ))}
                </>
              ) : (
                <>
                  {earnings.map(d => (
                    <tr key={d.id} className="ts-tr" style={{ height: ROW_H }}>
                      <td style={TD}><span className="font-mono" style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>{formatId("ERN", d.id)}</span></td>
                      <td style={TD}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>{d.driverName || "Unknown"}</span>
                          {d.driverEmail && <span style={{ fontSize: ".7rem", color: "var(--text-faint)" }}>{d.driverEmail}</span>}
                        </div>
                      </td>
                      <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-h)" }}>{d.completedTrips}</span></td>
                      <td style={TD}>
                        <SalaryCell driverProfileId={d.driverProfileId ?? null} salary={d.fixedSalary ?? 0} onUpdated={fetchEarnings} />
                      </td>
                      <td style={TD}><span style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>{d.attendance ?? 0}/22</span></td>
                      <td style={TD}><span style={{ fontSize: ".82rem", fontWeight: 600, color: "#10b981" }}>+{(d.totalBonuses ?? 0).toLocaleString()} TND</span></td>
                      <td style={TD}>
                        {(d.totalPenalties ?? 0) > 0
                          ? <span style={{ fontSize: ".82rem", fontWeight: 600, color: "#ef4444" }}>−{d.totalPenalties.toLocaleString()} TND</span>
                          : <span style={{ fontSize: ".78rem", color: "var(--text-faint)" }}>—</span>}
                      </td>
                      <td style={TD}><span style={{ fontSize: ".85rem", fontWeight: 800, color: "var(--text-h)" }}>{(d.netEarnings ?? 0).toLocaleString()} TND</span></td>
                      <td style={TD}><span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>⭐ {(d.avgRating ?? 0).toFixed(1)}</span></td>
                    </tr>
                  ))}
                  {Array.from({ length: ghostCount }).map((_, i) => (
                    <tr key={`g-${i}`} style={{ height: ROW_H }}><td colSpan={9} style={{ borderBottom: "1px solid var(--border)" }} /></tr>
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

