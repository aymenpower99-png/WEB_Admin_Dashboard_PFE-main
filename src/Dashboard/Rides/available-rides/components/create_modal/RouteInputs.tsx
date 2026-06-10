import { T, labelStyle, inputBase } from "./constants";
import MapboxAutocomplete from "../MapboxAutocomplete";

interface RouteInputsProps {
  pickupAddress: string;
  dropoffAddress: string;
  pickupError?: string;
  dropoffError?: string;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onPickupSelect: (place: {
    fullAddress: string;
    lat: number;
    lng: number;
  }) => void;
  onDropoffSelect: (place: {
    fullAddress: string;
    lat: number;
    lng: number;
  }) => void;
  onClearPickupError: () => void;
  onClearDropoffError: () => void;
}

export function RouteInputs({
  pickupAddress,
  dropoffAddress,
  pickupError,
  dropoffError,
  onPickupChange,
  onDropoffChange,
  onPickupSelect,
  onDropoffSelect,
  onClearPickupError,
  onClearDropoffError,
}: RouteInputsProps) {
  return (
    <div>
      <label style={labelStyle}>Route</label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        {/* Pickup */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: ".85rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.accent,
              boxShadow: `0 0 8px ${T.accentGlow}`,
              zIndex: 1,
            }}
          />
          <MapboxAutocomplete
            value={pickupAddress}
            onChange={(v) => {
              onPickupChange(v);
              onClearPickupError();
            }}
            onSelect={(place) => {
              onPickupSelect(place);
              onClearPickupError();
            }}
            placeholder="Pickup address"
            inputClassName="crm-input"
            inputStyle={{
              ...inputBase,
              paddingLeft: "2rem",
              borderColor: pickupError ? T.red : T.border,
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = T.accent;
              (e.target as HTMLInputElement).style.boxShadow =
                `0 0 0 3px ${T.accentGlow}`;
            }}
            onBlur={(e) => {
              if (e?.target) {
                (e.target as HTMLInputElement).style.borderColor = pickupError
                  ? T.red
                  : T.border;
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }
            }}
          />
        </div>
        {pickupError && (
          <span style={{ color: T.red, fontSize: ".68rem" }}>
            {pickupError}
          </span>
        )}

        {/* Connector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            padding: "0 .85rem",
          }}
        >
          <div
            style={{
              width: 1,
              height: 14,
              background: `linear-gradient(to bottom, ${T.accent}, ${T.red})`,
              marginLeft: 3,
            }}
          />
          <span style={{ fontSize: ".65rem", color: T.textFaint }}>
            direct route
          </span>
        </div>

        {/* Dropoff */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: ".85rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              borderRadius: "2px",
              background: T.violet,
              boxShadow: `0 0 8px ${T.violet}55`,
              zIndex: 1,
            }}
          />
          <MapboxAutocomplete
            value={dropoffAddress}
            onChange={(v) => {
              onDropoffChange(v);
              onClearDropoffError();
            }}
            onSelect={(place) => {
              onDropoffSelect(place);
              onClearDropoffError();
            }}
            placeholder="Drop-off address"
            inputClassName="crm-input"
            inputStyle={{
              ...inputBase,
              paddingLeft: "2rem",
              borderColor: dropoffError ? T.red : T.border,
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = T.accent;
              (e.target as HTMLInputElement).style.boxShadow =
                `0 0 0 3px ${T.accentGlow}`;
            }}
            onBlur={(e) => {
              if (e?.target) {
                (e.target as HTMLInputElement).style.borderColor = dropoffError
                  ? T.red
                  : T.border;
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }
            }}
          />
        </div>
        {dropoffError && (
          <span style={{ color: T.red, fontSize: ".68rem" }}>
            {dropoffError}
          </span>
        )}
      </div>
    </div>
  );
}
