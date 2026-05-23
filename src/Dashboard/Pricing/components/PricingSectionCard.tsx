import PricingToggle from "./PricingToggle";

interface PricingSectionCardProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  enabled?: boolean;
  onToggle?: (v: boolean) => void;
}

export default function PricingSectionCard({ title, icon, description, children, enabled, onToggle }: PricingSectionCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: ".75rem",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        opacity: enabled !== undefined && !enabled ? 0.55 : 1,
        transition: "opacity .2s",
      }}
    >
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: ".6rem",
        }}
      >
        <span style={{ color: "var(--text-faint)", display: "flex", alignItems: "center" }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: ".85rem",
              fontWeight: 700,
              color: "var(--text-h)",
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              style={{
                margin: 0,
                marginTop: 2,
                fontSize: ".72rem",
                color: "var(--text-faint)",
              }}
            >
              {description}
            </p>
          )}
        </div>
        {onToggle && (
          <PricingToggle
            enabled={enabled ?? true}
            onChange={onToggle}
          />
        )}
      </div>
      {children}
    </div>
  );
}
