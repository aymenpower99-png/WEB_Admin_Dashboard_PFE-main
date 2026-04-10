export const YEARS       = Array.from({ length: 11 }, (_, i) => 2016 + i).reverse();
export const COLORS      = ["White", "Black", "Silver"] as const;
export const VEHICLE_CLASSES = [
  { key: "Economy",     label: "Economy",     examples: ["Skoda Octavia",    "Toyota Prius",       "Hyundai Ioniq"]        },
  { key: "Standard",    label: "Standard",    examples: ["Mercedes E-Class", "BMW 5 Series",       "Cadillac XTS"]         },
  { key: "Comfort",     label: "Comfort",     examples: ["Mercedes C-Class", "Audi A6",            "Lexus ES"]             },
  { key: "First Class", label: "First Class", examples: ["Mercedes S-Class", "BMW 7 Series",       "Audi A8"]              },
  { key: "Van",         label: "Van",         examples: ["Mercedes Vito",    "Ford Custom",        "Chevrolet Suburban"]   },
  { key: "Mini Bus",    label: "Mini Bus",    examples: ["Mercedes Sprinter","Volkswagen Crafter", "Iveco Daily"]          },
] as const;

export interface FormState    { make: string; model: string; year: string; color: string; vehicleClass: string; driver: string; }
export interface ErrState     { make: string; model: string; year: string; color: string; vehicleClass: string; driver: string; }
export interface DropdownOption { value: string; label: string; }
export interface MakeOption     { id: number;   name: string;  }
export interface ModelOption    { id: number;   name: string;  }
export interface DriverOption   { id: string;   firstName: string; lastName: string; status?: string; }

export const EMPTY_FORM: FormState = { make:"", model:"", year:"", color:"", vehicleClass:"", driver:"" };
export const EMPTY_ERRS: ErrState  = { make:"", model:"", year:"", color:"", vehicleClass:"", driver:"" };

export function validate(f: FormState): ErrState {
  const e = { ...EMPTY_ERRS };
  if (!f.make.trim())  e.make         = "Make is required.";
  if (!f.model.trim()) e.model        = "Model is required.";
  if (!f.year)         e.year         = "Year is required.";
  if (!f.color)        e.color        = "Color is required.";
  if (!f.vehicleClass) e.vehicleClass = "Vehicle class is required.";
  return e;
}
export const hasErrors = (e: ErrState) => Object.values(e).some(Boolean);