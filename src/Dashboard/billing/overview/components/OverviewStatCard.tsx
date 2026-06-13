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
        borderRadius: "0.75rem",
        padding: "0.85rem 1.1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        minHeight: 80,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0.85rem",
          right: "1.1rem",
          width: 36,
          height: 36,
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
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          fontWeight: 500,
          paddingRight: 44,
        }}
      >
        {label}
      </span>
      {loading ? (
        <div
          style={{
            height: 24,
            width: 80,
            background: "var(--border)",
            borderRadius: 4,
            opacity: 0.5,
            marginTop: "0.35rem",
          }}
        />
      ) : (
        <span
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "var(--text-h)",
            lineHeight: 1,
            marginTop: "0.35rem",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}