import type React from "react";

export const ROWS  = 5;
export const ROW_H = 88;

// Matches DriversTypes.ts exactly for consistent look across pages
export const TH: React.CSSProperties = {
  padding: "0.75rem 1.25rem",
  fontSize: ".78rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "var(--text-body)",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
  background: "var(--bg-thead)",
};

export const TD: React.CSSProperties = {
  padding: "0 1.25rem",
  height: ROW_H,
  fontSize: ".85rem",
  fontWeight: 600,
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

// All villes in Tunisia grouped — for the dropdown
export const TUNISIA_VILLES: string[] = [
  "Tunis", "Ariana", "Ben Arous", "Manouba",
  "Nabeul", "Zaghouan", "Bizerte", "Béja",
  "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan",
  "Kasserine", "Sidi Bouzid", "Gabès", "Medenine",
  "Tataouine", "Gafsa", "Tozeur", "Kébili",
  "Hammamet", "La Marsa", "Carthage", "Sidi Bou Saïd",
  "Djerba", "Zarzis", "Dougga",
].sort();

export const COUNTRIES = [
  { value: "Tunisia", label: "Tunisia 🇹🇳" },
];