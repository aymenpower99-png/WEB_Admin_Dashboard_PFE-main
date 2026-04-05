import StarRoundedIcon from "@mui/icons-material/StarRounded";

export default function DriverStars({ rating }: { rating: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".2rem",
        fontSize: ".82rem",
        color: "#f59e0b",
        fontWeight: 700,
      }}
    >
      <StarRoundedIcon style={{ fontSize: 16 }} />
      {rating}
    </span>
  );
}