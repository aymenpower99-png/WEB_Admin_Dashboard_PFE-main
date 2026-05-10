import { C } from "./tokens";

interface PayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
  dark: boolean;
  prefix?: string;
}

export function CustomTooltip({
  active,
  payload,
  label,
  dark,
  prefix = "",
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-lg"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
        fontSize: 12,
      }}
    >
      <p style={{ color: dark ? C.gray7B : C.lightSubtext, marginBottom: 4 }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? C.gray7B, fontWeight: 600 }}>
          {p.name}: {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}