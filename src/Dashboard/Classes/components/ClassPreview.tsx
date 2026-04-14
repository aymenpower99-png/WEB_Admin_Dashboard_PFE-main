import WifiRoundedIcon      from "@mui/icons-material/WifiRounded";
import AcUnitRoundedIcon    from "@mui/icons-material/AcUnitRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import LuggageRoundedIcon   from "@mui/icons-material/LuggageRounded";
import type { ClassFormData } from "./ClassFormFields";

export default function ClassPreview({ form }: { form: ClassFormData }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: ".5rem", overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,.06)",
    }}>
      {/* Image area — ✅ empty when no image, no car icon */}
      <div style={{
        height: 140,
        background: form.imageUrl ? "transparent" : "var(--bg-inner)",
        overflow: "hidden", position: "relative",
      }}>
        {form.imageUrl ? (
          <img
            src={form.imageUrl} alt="Class"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : null /* ✅ intentionally empty — no icon */}

        {/* Name overlay always shown */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: form.imageUrl
            ? "linear-gradient(transparent, rgba(0,0,0,.6))"
            : "transparent",
          padding: ".6rem .85rem",
        }}>
          <span style={{
            color: form.imageUrl ? "#fff" : "var(--text-h)",
            fontWeight: 800, fontSize: ".95rem",
          }}>
            {form.name || "Class Name"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: ".85rem" }}>
        {/* Capacity row */}
        <div style={{ display: "flex", gap: ".85rem", marginBottom: ".65rem" }}>
          <span style={{
            display: "flex", alignItems: "center", gap: ".25rem",
            fontSize: ".78rem", color: "var(--text-body)", fontWeight: 600,
          }}>
            <EventSeatRoundedIcon style={{ fontSize: 15, color: "#7c3aed" }} />
            {form.seats}
          </span>
          <span style={{
            display: "flex", alignItems: "center", gap: ".25rem",
            fontSize: ".78rem", color: "var(--text-body)", fontWeight: 600,
          }}>
            <LuggageRoundedIcon style={{ fontSize: 15, color: "#7c3aed" }} />
            {form.bags}
          </span>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem", marginBottom: ".65rem" }}>
          {form.wifi && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".7rem",
              fontWeight: 600, background: "var(--rider-bg)", color: "var(--rider-fg)",
            }}>
              <WifiRoundedIcon style={{ fontSize: 11 }} /> WiFi
            </span>
          )}
          {form.ac && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".7rem",
              fontWeight: 600, background: "var(--pending-bg)", color: "var(--pending-fg)",
            }}>
              <AcUnitRoundedIcon style={{ fontSize: 11 }} /> A/C
            </span>
          )}
          {form.water && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".7rem",
              fontWeight: 600, background: "var(--active-bg)", color: "var(--active-fg)",
            }}>
              <WaterDropRoundedIcon style={{ fontSize: 11 }} /> Water
            </span>
          )}
          {(form.extraFeatures ?? []).filter(f => f.enabled).map((f, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px", borderRadius: "9999px", fontSize: ".7rem",
              fontWeight: 600, background: "var(--bg-inner)", color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}>
              {f.name}
            </span>
          ))}
        </div>

        {/* Service */}
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: ".65rem",
          display: "flex", flexDirection: "column", gap: ".3rem",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: ".75rem", color: "var(--text-muted)",
          }}>
            <span>Free waiting time</span>
            <span style={{ fontWeight: 700, color: "var(--text-h)" }}>
              {form.freeWaitingTime === 0 ? "None" : `${form.freeWaitingTime} min`}
            </span>
          </div>
          {form.doorToDoor && (
            <div style={{ fontSize: ".75rem", color: "var(--active-fg)", fontWeight: 600 }}>
              ✓ Door-to-Door Service
            </div>
          )}
          {form.meetAndGreet && (
            <div style={{ fontSize: ".75rem", color: "var(--active-fg)", fontWeight: 600 }}>
              ✓ Meet &amp; Greet
            </div>
          )}
          {(form.extraServices ?? []).filter(s => s.enabled).map((s, i) => (
            <div key={i} style={{ fontSize: ".75rem", color: "var(--active-fg)", fontWeight: 600 }}>
              ✓ {s.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}