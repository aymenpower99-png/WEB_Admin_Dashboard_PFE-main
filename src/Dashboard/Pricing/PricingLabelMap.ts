export interface LabelEntry {
  label: string;
  desc?: string;
}

export const LABEL_MAP: Record<string, LabelEntry> = {
  BASE_FARE:              { label: "Base Fare",         desc: "Fixed charge applied at pickup" },
  RATE_PER_KM:            { label: "Rate / km",         desc: "Charged per kilometre driven" },
  RATE_PER_MIN:           { label: "Rate / min",        desc: "Charged per minute elapsed" },
  MIN_FARE:               { label: "Min Fare",          desc: "Floor — applied when total is lower" },
  W_XGB:                  { label: "XGBoost Weight",    desc: "Ensemble contribution of XGBoost" },
  W_LGBM:                 { label: "LightGBM Weight",   desc: "Ensemble contribution of LightGBM" },
  TRAFFIC:                { label: "Traffic",           desc: "Adjust pricing based on real-time road congestion level" },
  WEATHER:                { label: "Weather",           desc: "Dynamic pricing based on current weather conditions" },
  DEMAND:                 { label: "Demand",            desc: "Scale pricing with current rider demand in the area" },
  NIGHT:                  { label: "Night",             desc: "Applied between 22:00 – 05:00" },
  FRIDAY_JUMUAH:          { label: "Friday Jumuah",     desc: "Applied on Friday at noon prayer time" },
  RAMADAN:                { label: "Ramadan",           desc: "Adjusted rates for Ramadan time windows" },
  BEACH:                  { label: "Beach",             desc: "Seasonal beach area pricing by period" },
  ZONE:                   { label: "Zone",              desc: "Geographic pricing modifiers by city zone" },
  SPECIAL_EVENT:          { label: "Special Event",     desc: "Surge pricing for high-demand events and holidays" },
  SEASON:                 { label: "Season",            desc: "Base seasonal pricing adjustment" },
  CAR:                    { label: "Car Type",          desc: "Per-category pricing modifier based on vehicle class" },
};

export function friendlyLabel(key: string): string {
  return LABEL_MAP[key]?.label ?? key;
}

export function friendlyDesc(key: string): string | undefined {
  return LABEL_MAP[key]?.desc;
}
