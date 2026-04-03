import type { ReactNode } from "react";

export interface IconProps {
  d: string | string[];
  size?: number;
  stroke?: string;
  sw?: number;
}

export interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  hint?: string;
  rightEl?: ReactNode;
  readOnly?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
}

export interface SectionHeadProps {
  title: string;
  desc?: string;
}

export interface SaveBtnProps {
  onClick: () => void;
  saved: boolean;
  loading?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  icon: string | string[];
}

export const icons: Record<string, string | string[]> = {
  user: [
    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
    "M12 11a4 4 0 100-8 4 4 0 000 8z",
  ],
  lock: [
    "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z",
    "M7 11V7a5 5 0 0110 0v4",
  ],
  appearance: [
    "M2 13.5A10 10 0 1010.5 22",
    "M13 2.05A10 10 0 0121.95 11",
    "M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0",
    "M3 3l18 18",
  ],
  currency: [
    "M12 1v22",
    "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  ],
  eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 9a3 3 0 100 6 3 3 0 000-6z",
  ],
  eyeOff: [
    "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94",
    "M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19",
    "M1 1l22 22",
  ],
  check: "M20 6L9 17l-5-5",
  mail: [
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    "M22 6l-10 7L2 6",
  ],
  x: "M18 6L6 18M6 6l12 12",
  refresh:
    "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  sun: [
    "M12 17a5 5 0 100-10 5 5 0 000 10z",
    "M12 1v2",
    "M12 21v2",
    "M4.22 4.22l1.42 1.42",
    "M18.36 18.36l1.42 1.42",
    "M1 12h2",
    "M21 12h2",
    "M4.22 19.78l1.42-1.42",
    "M18.36 5.64l1.42-1.42",
  ],
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  palette: [
    "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.657-1.343 3-3 3h-1.5a1.5 1.5 0 000 3 1.5 1.5 0 001.5 1.5c0 1.38-3.134 2.5-7 2.5z",
    "M7 13a1 1 0 100-2 1 1 0 000 2z",
    "M12 8a1 1 0 100-2 1 1 0 000 2z",
    "M17 13a1 1 0 100-2 1 1 0 000 2z",
  ],
};