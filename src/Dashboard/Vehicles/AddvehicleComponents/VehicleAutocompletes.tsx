import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "../../../api/apiClient";
import type { MakeOption, ModelOption } from "./types";

/* ── Shared input styles ── */
const baseInput: React.CSSProperties = {
  width: "100%",
  padding: ".55rem .75rem",
  border: "1px solid var(--border)",
  borderRadius: ".4rem",
  background: "var(--bg-card)",
  fontSize: ".82rem",
  color: "var(--text-h)",
  outline: "none",
  boxShadow: "none",
  boxSizing: "border-box",
};

const errorInput: React.CSSProperties = {
  ...baseInput,
  border: "1px solid #ef4444",
};

/* ── Hardcoded model list — no external API, instant, always works ── */
const MODELS_BY_MAKE_NAME: Record<string, string[]> = {
  "Toyota":        ["Auris","Avensis","Camry","Corolla","C-HR","Fortuner","Hiace","Highlander","Hilux","Land Cruiser","Prius","RAV4","Supra","Verso","Yaris"],
  "Honda":         ["Accord","Civic","CR-V","CR-Z","HR-V","Jazz","Legend","NSX","Odyssey","Pilot","Ridgeline"],
  "Ford":          ["Edge","Escape","Explorer","F-150","Fiesta","Focus","Fusion","Galaxy","Kuga","Mondeo","Mustang","Ranger","S-Max","Transit"],
  "Hyundai":       ["Accent","Elantra","i10","i20","i30","i40","Ioniq","Kona","Santa Fe","Sonata","Tucson","Veloster"],
  "Kia":           ["Ceed","EV6","K5","Niro","Optima","Picanto","ProCeed","Rio","Sorento","Soul","Sportage","Stinger","Stonic","Telluride"],
  "Chevrolet":     ["Blazer","Camaro","Colorado","Corvette","Equinox","Express","Impala","Malibu","Silverado","Spark","Suburban","Tahoe","Trailblazer","Traverse","Trax"],
  "Nissan":        ["Altima","Armada","Frontier","GT-R","Juke","Leaf","Maxima","Micra","Murano","Navara","Note","Pathfinder","Qashqai","Rogue","Sentra","Titan","Versa","X-Trail"],
  "Volkswagen":    ["Arteon","Atlas","Golf","ID.3","ID.4","Jetta","Passat","Polo","Sharan","T-Cross","T-Roc","Tiguan","Touareg","Touran","Up"],
  "Mercedes-Benz": ["A-Class","B-Class","C-Class","CLA","CLS","E-Class","EQA","EQC","G-Class","GLA","GLB","GLC","GLE","GLS","S-Class","SL","SLC","Vito"],
  "BMW":           ["1 Series","2 Series","3 Series","4 Series","5 Series","6 Series","7 Series","8 Series","i3","i4","iX","iX3","M2","M3","M4","M5","X1","X2","X3","X4","X5","X6","X7","Z4"],
  "Audi":          ["A1","A2","A3","A4","A5","A6","A7","A8","e-tron","Q2","Q3","Q4 e-tron","Q5","Q7","Q8","R8","RS3","RS6","S3","S4","S5","TT"],
  "Renault":       ["Arkana","Captur","Clio","Espace","Fluence","Kadjar","Kangoo","Koleos","Laguna","Megane","Scenic","Symbol","Talisman","Trafic","Zoe"],
  "Peugeot":       ["107","108","2008","206","207","208","3008","306","307","308","4008","407","408","5008","508","Boxer","Expert","Partner","Rifter","Traveller"],
  "Citroën":       ["Berlingo","C-Crosser","C-Elysée","C1","C2","C3","C3 Aircross","C4","C4 Cactus","C4 Picasso","C5","C5 Aircross","C5 X","DS3","DS4","DS5","Dispatch","Jumper","Jumpy","SpaceTourer"],
  "Opel":          ["Adam","Agila","Astra","Cascada","Corsa","Crossland","Grandland","Insignia","Meriva","Mokka","Omega","Signum","Vectra","Vivaro","Zafira"],
  "Mazda":         ["2","3","5","6","CX-3","CX-30","CX-5","CX-60","CX-9","MX-5","RX-8"],
  "Subaru":        ["BRZ","Forester","Impreza","Legacy","Levorg","Outback","Solterra","WRX","XV"],
  "Suzuki":        ["Alto","Baleno","Celerio","Ertiga","Grand Vitara","Ignis","Jimny","S-Cross","SX4","Swift","Vitara"],
  "Mitsubishi":    ["ASX","Colt","Eclipse Cross","Galant","L200","Lancer","Outlander","Pajero","Space Star"],
  "Lexus":         ["CT","ES","GS","GX","IS","LC","LM","LS","LX","NX","RC","RX","UX"],
  "Infiniti":      ["FX35","FX50","G37","Q30","Q50","Q60","Q70","QX30","QX50","QX55","QX60","QX70","QX80"],
  "Jeep":          ["Cherokee","Compass","Gladiator","Grand Cherokee","Patriot","Renegade","Wrangler"],
  "Dodge":         ["Challenger","Charger","Dart","Durango","Grand Caravan","Journey","Neon","Ram 1500","Viper"],
  "Chrysler":      ["300","300C","Grand Voyager","Pacifica","Sebring","Town & Country","Voyager"],
  "Volvo":         ["C30","C40","C70","S40","S60","S80","S90","V40","V60","V70","V90","XC40","XC60","XC70","XC90"],
  "Skoda":         ["Citigo","Enyaq","Fabia","Kamiq","Karoq","Kodiaq","Octavia","Rapid","Scala","Superb","Yeti"],
  "SEAT":          ["Arona","Ateca","Cordoba","Ibiza","Leon","Mii","Tarraco","Toledo"],
  "Fiat":          ["124 Spider","500","500L","500X","Bravo","Doblò","Ducato","Fullback","Grande Punto","Idea","Multipla","Panda","Punto","Qubo","Scudo","Tipo"],
  "Alfa Romeo":    ["147","156","159","166","4C","Brera","Giulia","Giulietta","GT","MiTo","Stelvio","Tonale"],
  "Porsche":       ["718 Boxster","718 Cayman","911","Cayenne","Macan","Panamera","Taycan"],
  "Tesla":         ["Cybertruck","Model 3","Model S","Model X","Model Y","Roadster"],
  "Land Rover":    ["Defender","Discovery","Discovery Sport","Freelander","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar"],
  "Jaguar":        ["E-Pace","E-Type","F-Pace","F-Type","I-Pace","S-Type","X-Type","XE","XF","XJ"],
  "Mini":          ["Cabrio","Clubman","Convertible","Countryman","Coupe","Hatch","Paceman","Roadster"],
  "Dacia":         ["Duster","Jogger","Logan","Lodgy","Sandero","Spring","Stepway"],
  "Isuzu":         ["D-Max","MU-7","MU-X","Trooper"],
  "Iveco":         ["Daily","Eurocargo","S-Way","Stralis","Trakker"],
};

/* ── Shared dropdown list ── */
function DropList({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", top: "100%", left: 0, right: 0,
      maxHeight: "14rem", overflowY: "auto",
      border: "1px solid var(--border)",
      borderTop: "none",
      borderRadius: "0 0 .4rem .4rem",
      background: "var(--bg-card)",
      zIndex: 999,
    }}>
      {children}
    </div>
  );
}

function DropItem({ active, children, onMouseDown, onMouseEnter, onMouseLeave }: {
  active: boolean;
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        padding: ".55rem .75rem",
        fontSize: ".82rem",
        color: active ? "#7c3aed" : "var(--text-body)",
        background: active ? "#ede9fe" : "transparent",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        borderBottom: "1px solid var(--border)",
        transition: "background var(--t-fast), color var(--t-fast)",
      }}
    >
      {children}
    </div>
  );
}

/* ── MakeAutocomplete ── */
export function MakeAutocomplete({ value, error, onSelect }: {
  value: string; error?: string; onSelect: (name: string, id: number | null) => void;
}) {
  const [inputVal,    setInputVal]   = useState(value);
  const [suggestions, setSuggests]  = useState<MakeOption[]>([]);
  const [open,        setOpen]       = useState(false);
  const [activeIdx,   setActiveIdx]  = useState(-1);
  const [hovered,     setHovered]    = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputVal(value); }, [value]);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fetchMakes = useCallback(async (q: string) => {
    try {
      const ep = q.trim().length > 0
        ? `/vehicles/makes/search?q=${encodeURIComponent(q.trim())}`
        : `/vehicles/makes`;
      const res = await apiClient.get<MakeOption[]>(ep);
      setSuggests(res.data); setOpen(true); setActiveIdx(-1);
    } catch { /**/ }
  }, []);

  const pick = (opt: MakeOption) => {
    setInputVal(opt.name); onSelect(opt.name, opt.id); setOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if      (e.key === "ArrowDown")               { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        style={error ? errorInput : baseInput}
        placeholder="e.g. Mercedes-Benz, Toyota, BMW…"
        value={inputVal}
        onChange={e => {
          setInputVal(e.target.value); onSelect(e.target.value, null);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => fetchMakes(e.target.value), 250);
        }}
        onFocus={() => { if (suggestions.length === 0) fetchMakes(inputVal); else setOpen(true); }}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <DropList>
          {suggestions.map((opt, i) => (
            <DropItem
              key={opt.id}
              active={hovered === opt.id || activeIdx === i}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }}
              onMouseLeave={() => setHovered(null)}
            >
              {opt.name}
            </DropItem>
          ))}
        </DropList>
      )}
    </div>
  );
}

/* ── ModelAutocomplete — uses local hardcoded list, no API call ── */
export function ModelAutocomplete({ value, makeId, error, onChange, makeName }: {
  value: string; makeId: number | null; error?: string; onChange: (v: string) => void; makeName?: string;
}) {
  const [open,      setOpen]      = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hovered,   setHovered]   = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Get models from local list using makeName
  const allModels: ModelOption[] = (() => {
    if (!makeName) return [];
    const list = MODELS_BY_MAKE_NAME[makeName];
    if (list) return list.map((name, i) => ({ id: i + 1, name }));
    // fuzzy fallback: try partial match
    const key = Object.keys(MODELS_BY_MAKE_NAME).find(k =>
      k.toLowerCase().includes(makeName.toLowerCase()) ||
      makeName.toLowerCase().includes(k.toLowerCase())
    );
    if (key) return MODELS_BY_MAKE_NAME[key].map((name, i) => ({ id: i + 1, name }));
    return [];
  })();

  const filtered = value.trim()
    ? allModels.filter(m => m.name.toLowerCase().includes(value.toLowerCase()))
    : allModels;

  const pick = (opt: ModelOption) => { onChange(opt.name); setOpen(false); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if      (e.key === "ArrowDown")               { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp")                 { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(filtered[activeIdx]); }
    else if (e.key === "Escape")                    setOpen(false);
  };

  const hasModels = allModels.length > 0;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        style={{
          ...(error ? errorInput : baseInput),
          color: !makeId ? "var(--text-faint)" : "var(--text-h)",
          cursor: !makeId ? "not-allowed" : "text",
        }}
        placeholder={!makeId ? "Select a Make first" : hasModels ? "e.g. E-Class, Corolla…" : "Type a model name…"}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => { if (makeId) setOpen(true); }}
        onKeyDown={handleKey}
        disabled={!makeId}
        autoComplete="off"
      />
      {open && makeId && (
        <DropList>
          {filtered.length === 0 ? (
            <div style={{ padding: ".65rem .75rem", fontSize: ".82rem", color: "var(--text-faint)" }}>
              No models found — type to enter manually
            </div>
          ) : filtered.map((opt, i) => (
            <DropItem
              key={opt.id}
              active={hovered === opt.id || activeIdx === i}
              onMouseDown={e => { e.preventDefault(); pick(opt); }}
              onMouseEnter={() => { setHovered(opt.id); setActiveIdx(i); }}
              onMouseLeave={() => setHovered(null)}
            >
              {opt.name}
            </DropItem>
          ))}
        </DropList>
      )}
    </div>
  );
}