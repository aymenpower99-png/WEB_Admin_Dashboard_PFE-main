import { T, labelStyle } from "./constants";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { AdminUser } from "../../../../../api/users";

interface PassengerSelectorProps {
  passengers: AdminUser[];
  passengerId: string;
  passengerSearch: string;
  error?: string;
  onPassengerIdChange: (id: string) => void;
  onSearchChange: (value: string) => void;
  onClearError: () => void;
}

export function PassengerSelector({
  passengers,
  passengerId,
  passengerSearch,
  error,
  onPassengerIdChange,
  onSearchChange,
  onClearError,
}: PassengerSelectorProps) {
  const filteredPassengers = passengers.filter((p) => {
    const q = passengerSearch.toLowerCase();
    return (
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <label style={labelStyle}>Passenger *</label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          border: `1.5px solid ${T.border}`,
          borderRadius: T.rSm,
          padding: ".55rem .85rem",
          background: T.bg,
          marginBottom: ".5rem",
          transition: "border-color .2s, box-shadow .2s",
        }}
        onFocus={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = T.accent;
          el.style.boxShadow = `0 0 0 3px ${T.accentGlow}`;
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = T.border;
          el.style.boxShadow = "none";
        }}
      >
        <SearchRoundedIcon
          style={{
            fontSize: 14,
            color: T.textFaint,
            flexShrink: 0,
          }}
        />
        <input
          placeholder="Search by name or email…"
          value={passengerSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: ".82rem",
            flex: 1,
            color: T.textH,
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Passenger list */}
      <div
        className="crm-scroll"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".3rem",
          maxHeight: 148,
          overflowY: "auto",
          border: `1.5px solid ${error ? T.red : T.border}`,
          borderRadius: T.rSm,
          padding: ".4rem",
          background: T.surface,
        }}
      >
        {filteredPassengers.slice(0, 20).map((p) => {
          const isSel = passengerId === p.id;
          return (
            <div
              key={p.id}
              className={isSel ? "" : "crm-passenger-row"}
              onClick={() => {
                onPassengerIdChange(p.id);
                onClearError();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
                padding: ".5rem .65rem",
                borderRadius: T.rInner,
                cursor: "pointer",
                background: isSel ? T.violetLight : "transparent",
                border: `1.5px solid ${isSel ? T.accent : "transparent"}`,
                transition: "all .15s",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: isSel
                    ? `linear-gradient(135deg, ${T.accent}, #7c22ce)`
                    : "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: ".62rem",
                  color: isSel ? "#fff" : T.textSub,
                }}
              >
                {(p.firstName?.[0] ?? "").toUpperCase()}
                {(p.lastName?.[0] ?? "").toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: ".8rem",
                    color: T.textH,
                  }}
                >
                  {p.firstName} {p.lastName}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: ".67rem",
                    color: T.textFaint,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.email}
                </p>
              </div>
              {isSel && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.accent}
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          );
        })}
        {filteredPassengers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: T.textFaint,
              fontSize: ".78rem",
              padding: ".75rem 0",
            }}
          >
            No passengers found
          </div>
        )}
      </div>
      {error && (
        <span
          style={{
            color: T.red,
            fontSize: ".68rem",
            marginTop: ".3rem",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
