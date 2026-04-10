import "../travelsync-design-system.css";
import ArrowBackRoundedIcon     from "@mui/icons-material/ArrowBackRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import type { ClassVehicle } from "../../api/classes";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Available:   { bg: "rgba(16,185,129,.12)",  color: "#10b981" },
  Pending:     { bg: "rgba(245,158,11,.12)",  color: "#f59e0b" },
  On_Trip:     { bg: "rgba(99,102,241,.12)",  color: "#6366f1" },
  Maintenance: { bg: "rgba(239,68,68,.12)",   color: "#ef4444" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: "var(--bg-inner)", color: "var(--text-muted)" };
  return (
    <span style={{
      borderRadius: 9999, padding: "4px 14px",
      fontSize: ".78rem", fontWeight: 700, whiteSpace: "nowrap",
      background: s.bg, color: s.color,
    }}>
      {status === "On_Trip" ? "On Trip" : status}
    </span>
  );
}

function AttrRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: ".55rem .9rem", borderRadius: 8,
      background: "var(--bg-inner)", border: "1px solid var(--border)", gap: ".75rem",
    }}>
      <span style={{ minWidth: 100, fontSize: ".78rem", fontWeight: 600, color: "var(--text-muted)", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: ".88rem", color: "var(--text-body)" }}>{value}</span>
    </div>
  );
}

interface Props {
  vehicle: ClassVehicle;
  onBack: () => void; // goes back to ClassDetailPage
}

export default function ClassVehicleDetailPage({ vehicle: v, onBack }: Props) {
  const thumb = v.photos?.[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <button className="ts-icon-btn" onClick={onBack} title="Back to class">
          <ArrowBackRoundedIcon style={{ fontSize: 18 }} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="ts-page-title" style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
            {v.make} {v.model}
          </h1>
          <p style={{ margin: 0, fontSize: ".82rem", color: "var(--text-muted)" }}>
            Vehicle details
          </p>
        </div>
        <StatusBadge status={v.status} />
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* LEFT: Photo card */}
        <div className="ts-card" style={{
          flex: "0 0 280px", minWidth: 220, padding: "1.25rem",
          display: "flex", flexDirection: "column", gap: ".9rem",
        }}>
          <div style={{
            width: "100%", height: 170, borderRadius: 10, overflow: "hidden",
            background: "var(--bg-inner)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {thumb
              ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <DirectionsCarRoundedIcon style={{ fontSize: 52, color: "var(--text-faint)" }} />
            }
          </div>

          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-h)" }}>
            {v.make} {v.model}
          </div>
          <div style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>{v.year}</div>

          {/* Extra photos strip */}
          {Array.isArray(v.photos) && v.photos.length > 1 && (
            <div>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>
                Photos
              </div>
              <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
                {v.photos.map((src, i) => (
                  <div key={i} style={{
                    width: 52, height: 52, borderRadius: 7, overflow: "hidden",
                    border: "1px solid var(--border)", flexShrink: 0,
                  }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Attributes card */}
        <div className="ts-card" style={{
          flex: 1, minWidth: 260, padding: "1.25rem 1.5rem",
          display: "flex", flexDirection: "column", gap: ".5rem",
        }}>
          <div style={{ fontSize: ".9rem", fontWeight: 800, color: "var(--text-h)", marginBottom: ".4rem" }}>
            Attributes
          </div>

          <AttrRow label="Make"   value={v.make} />
          <AttrRow label="Model"  value={v.model} />
          <AttrRow label="Year"   value={String(v.year)} />
          <AttrRow label="Color"  value={v.color ?? <span style={{ color: "var(--text-faint)" }}>—</span>} />
          <AttrRow
            label="Plate"
            value={
              v.licensePlate
                ? <span style={{ fontFamily: "monospace", background: "var(--bg-page)", border: "1px solid var(--border)", borderRadius: 5, padding: "1px 8px", fontSize: ".84rem" }}>
                    {v.licensePlate}
                  </span>
                : <span style={{ color: "var(--text-faint)" }}>—</span>
            }
          />
          <AttrRow
            label="Status"
            value={<StatusBadge status={v.status} />}
          />
          <AttrRow
            label="Driver"
            value={
              v.driverId
                ? <span style={{ fontWeight: 600, color: "var(--text-body)" }}>Assigned</span>
                : <span style={{ color: "var(--text-faint)" }}>Unassigned</span>
            }
          />
          <AttrRow label="Active" value={v.isActive ? "Yes" : "No"} />
        </div>
      </div>
    </div>
  );
}