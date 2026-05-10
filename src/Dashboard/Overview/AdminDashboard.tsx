/**
 * AdminDashboard.tsx
 * Platform Overview — fully backend-driven, zero hardcoded data.
 */
import { useDashboard } from "./Components/useDashboard";
import KpiCards from "./Components/KpiCards";
import RecentUsersTable from "./Components/RecentUsersTable";
import SupportTicketsTable from "./Components/SupportTicketsTable";

interface AdminDashboardProps {
  dark?: boolean;
}

export default function AdminDashboard({ dark = false }: AdminDashboardProps) {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        height:"100%", gap:"0.75rem",
      }}>
        <div className="animate-spin" style={{
          width:32, height:32, borderRadius:"50%",
          border:"3px solid var(--border)",
          borderTopColor:"#7c3aed",
        }} />
        <p className="ts-muted" style={{ fontSize:"0.875rem" }}>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        height:"100%", gap:"0.75rem",
      }}>
        <p className="ts-page-title" style={{ fontSize:"1.1rem" }}>Failed to load dashboard</p>
        <p className="ts-muted" style={{ fontSize:"0.875rem" }}>{error}</p>
        <button
          onClick={refetch}
          style={{
            marginTop:"0.5rem",
            padding:"0.45rem 1.2rem",
            borderRadius:"0.5rem",
            background:"#7c3aed",
            color:"#fff",
            fontSize:"0.8rem",
            fontWeight:600,
            border:"none",
            cursor:"pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        height:"100%", gap:"0.75rem",
      }}>
        <p className="ts-muted" style={{ fontSize:"0.875rem" }}>No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.85rem" }}>
        <h1 className="ts-page-title" style={{ fontSize:"1.25rem", fontWeight:800, flexShrink:0 }}>
          Platform Overview
        </h1>

        <KpiCards kpis={data.kpis} dark={dark} />

        {/* Tables row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
          <RecentUsersTable users={data.recentUsers} dark={dark} />
          <SupportTicketsTable tickets={data.recentTickets} dark={dark} />
        </div>
      </div>
  );
}
