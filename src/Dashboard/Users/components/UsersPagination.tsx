import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number; totalPages: number;
  onPrev: () => void; onNext: () => void; setPage: (n: number) => void;
}

export default function UsersPagination({ page, totalPages, onPrev, onNext, setPage }: Props) {
  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    display:"flex", alignItems:"center", justifyContent:"center",
    width:26, height:26, borderRadius:"0.375rem", border:"1px solid var(--border)",
    background: active ? "#7c3aed" : disabled ? "transparent" : "var(--bg-card)",
    color:      active ? "#fff"    : disabled ? "var(--text-faint)" : "var(--text-muted)",
    fontWeight: active ? 700 : 500, fontSize:"0.75rem",
    cursor: disabled ? "not-allowed" : "pointer", transition:"all .15s",
  });
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 1rem", borderTop:"1px solid var(--border)", flexShrink:0 }}>
      <span style={{ fontSize:"0.75rem", color:"var(--text-faint)", fontWeight:500 }}>Page {page} of {totalPages}</span>
      <div style={{ display:"flex", gap:"0.3rem" }}>
        <button onClick={onPrev} disabled={page === 1} style={btn(false, page === 1)}><ChevronLeft size={13} strokeWidth={2.5} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => setPage(n)} style={btn(n === page, false)}>{n}</button>
        ))}
        <button onClick={onNext} disabled={page === totalPages} style={btn(false, page === totalPages)}><ChevronRight size={13} strokeWidth={2.5} /></button>
      </div>
    </div>
  );
}