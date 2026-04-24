import { T } from "./constants";
import type { AdminUser } from "../../../../../api/users";

interface ModalFooterProps {
  phase: "form" | "success";
  loading: boolean;
  selectedPassenger: AdminUser | null;
  onClose: () => void;
  onCreate: () => void;
}

export function ModalFooter({
  phase,
  loading,
  selectedPassenger,
  onClose,
  onCreate,
}: ModalFooterProps) {
  if (phase === "success") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderTop: `1.5px solid ${T.border}`,
        }}
      >
        <p style={{ fontSize: ".72rem", color: T.textFaint, margin: 0 }}>
          Ride is now active in the system
        </p>
        <button
          onClick={onClose}
          style={{
            padding: ".55rem 1.25rem",
            borderRadius: "10px",
            border: "none",
            background: `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
            color: "#fff",
            fontSize: ".82rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: `0 4px 16px ${T.accentGlow}`,
          }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.5rem",
        borderTop: `1.5px solid ${T.border}`,
        gap: "1rem",
      }}
    >
      {/* Left: selected passenger pill */}
      {selectedPassenger ? (
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: ".6rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {(selectedPassenger.firstName?.[0] ?? "").toUpperCase()}
            {(selectedPassenger.lastName?.[0] ?? "").toUpperCase()}
          </div>
          <span
            style={{
              fontSize: ".75rem",
              color: T.textSub,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {selectedPassenger.firstName} {selectedPassenger.lastName}
          </span>
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* Right: action buttons */}
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button
          className="crm-btn-ghost"
          onClick={onClose}
          style={{
            padding: ".55rem 1rem",
            borderRadius: "10px",
            border: `1.5px solid ${T.border}`,
            background: "transparent",
            color: T.textSub,
            fontSize: ".82rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background .15s",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onCreate}
          disabled={loading}
          style={{
            padding: ".55rem 1.25rem",
            borderRadius: "10px",
            border: "none",
            background: loading
              ? "rgba(168,85,247,0.35)"
              : `linear-gradient(135deg, ${T.accent}, #7c22ce)`,
            color: loading ? "rgba(255,255,255,0.6)" : "#fff",
            fontSize: ".82rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: loading ? "none" : `0 4px 16px ${T.accentGlow}`,
            transition: "all .2s",
            display: "flex",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          {loading ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3" />
                <path d="M21 12a9 9 0 01-9 9" />
              </svg>
              Creating…
            </>
          ) : (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Ride
            </>
          )}
        </button>
      </div>
    </div>
  );
}