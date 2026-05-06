import React from "react";

interface OverviewStatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  loading?: boolean;
}

export default function OverviewStatCard({
  label,
  value,
  icon,
  iconBg,
  loading,
}: OverviewStatCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: ".75rem",
        padding: "1.1rem 1.3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minWidth: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: ".78rem",
            color: "var(--text-muted)",
            fontWeight: 500,
            marginBottom: ".3rem",
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
          {label}
        </p>
        {loading ? (
          <div
            style={{
              height: 28,
              width: 80,
              background: "var(--border)",
              borderRadius: 4,
              opacity: 0.5,
            }}
          />
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: "1.45rem",
              fontWeight: 800,
              color: "var(--text-h)",
              lineHeight: 1,
            }}
          >
            {value}
          </p>
        )}
      </div>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  );
}
