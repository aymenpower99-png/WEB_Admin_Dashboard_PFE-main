import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

export default function RideRouteCell({ pickup, dropoff }: { pickup: string; dropoff: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".6rem", minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
        <div style={{ width: 1, height: 18, borderLeft: "2px dashed #d1d5db" }} />
        <LocationOnRoundedIcon style={{ fontSize: 14, color: "#7c3aed" }} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          margin: 0, fontSize: ".8rem", fontWeight: 600, color: "var(--text-h)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {pickup}
        </p>
        <p style={{
          margin: 0, fontSize: ".75rem", color: "var(--text-muted)", marginTop: 2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {dropoff}
        </p>
      </div>
    </div>
  );
}
