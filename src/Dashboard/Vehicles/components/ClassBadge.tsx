interface VehicleClassObj {
  id: string;
  name: string;
  seats: number;
  bags: number;
  wifi: boolean;
  ac: boolean;
}

export default function ClassBadge({
  vehicleClass,
}: {
  vehicleClass?: VehicleClassObj | string | null;
}) {
  // Accept either the full object (new) or a plain string (legacy)
  const key =
    typeof vehicleClass === "object" && vehicleClass !== null
      ? vehicleClass.name
      : (vehicleClass ?? "");

  const color = "#7c3aed";
  const label = key || "—";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: ".2rem .65rem",
        borderRadius: "9999px",
        background: `${color}22`,
        color: color,
        fontSize: ".78rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}
