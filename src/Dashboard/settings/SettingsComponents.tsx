import type { FC } from "react";
import type {
  IconProps,
  ToggleProps,
  InputProps,
  SelectProps,
  SelectOption,
  SectionHeadProps,
  SaveBtnProps,
} from "../settings/settingsTypes";
import { icons } from "../settings/settingsTypes";

export const Icon: FC<IconProps> = ({ d, size = 18, stroke = "currentColor", sw = 1.6 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);

export const Toggle: FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
      checked ? "bg-violet-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
        checked ? "left-5" : "left-0.5"
      }`}
    />
  </button>
);

export const SettingsInput: FC<InputProps> = ({
  label, type = "text", value, onChange,
  placeholder, hint, rightEl, readOnly,
}) => (
  <div className="space-y-1.5">
    {label && <label className="ts-label">{label}</label>}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`ts-input${readOnly ? " opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    {hint && <p className="ts-err">{hint}</p>}
  </div>
);

export const SettingsSelect: FC<SelectProps> = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    {label && <label className="ts-label">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ts-input ts-settings-select cursor-pointer"
    >
      {options.map((o: SelectOption) => (   // ← explicit type fixes the 'any' error
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export const SectionHead: FC<SectionHeadProps> = ({ title, desc }) => (
  <div className="mb-5">
    <h3 className="ts-page-title text-base font-semibold">{title}</h3>
    {desc && <p className="ts-muted text-sm mt-0.5">{desc}</p>}
  </div>
);

export const SaveBtn: FC<SaveBtnProps> = ({ onClick, saved, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`ts-btn-primary ${saved ? "!bg-green-500" : ""}`}
    style={saved ? { background: "#22c55e" } : {}}
  >
    {saved ? (
      <><Icon d={icons.check} size={15} sw={2.5} /> Saved!</>
    ) : loading ? (
      "Saving..."
    ) : (
      "Save changes"
    )}
  </button>
);