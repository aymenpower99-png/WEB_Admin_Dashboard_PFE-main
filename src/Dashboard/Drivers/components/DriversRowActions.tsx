import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { Driver } from "../types";

export default function DriversRowActions({
  driver,
  onEdit,
  onDelete,
}: {
  driver: Driver;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
      <button
        title="Edit Driver"
        className="ts-icon-btn"
        onClick={onEdit}
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: ".375rem",
        }}
      >
        <EditRoundedIcon style={{ fontSize: 16 }} />
      </button>

      <button
        title="Remove Driver"
        className="ts-icon-btn ts-icon-btn-del"
        onClick={onDelete}
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: ".375rem",
        }}
      >
        <DeleteOutlineRoundedIcon style={{ fontSize: 16 }} />
      </button>
    </div>
  );
}
