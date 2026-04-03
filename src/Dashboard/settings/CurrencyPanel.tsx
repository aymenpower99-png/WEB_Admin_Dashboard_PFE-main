import { useState, type FC } from "react";
import { Icon, SettingsSelect, SectionHead, SaveBtn } from "./SettingsComponents";
import { icons } from "../settings/settingsTypes";
import type { SelectOption } from "../settings/settingsTypes";

const currencies: SelectOption[] = [
  { value: "USD", label: "USD — US Dollar ($)"         },
  { value: "EUR", label: "EUR — Euro (€)"              },
  { value: "GBP", label: "GBP — British Pound (£)"     },
  { value: "TND", label: "TND — Tunisian Dinar (د.ت)"  },
  { value: "JPY", label: "JPY — Japanese Yen (¥)"      },
  { value: "CAD", label: "CAD — Canadian Dollar (CA$)" },
  { value: "AED", label: "AED — UAE Dirham (د.إ)"      },
  { value: "SAR", label: "SAR — Saudi Riyal (﷼)"       },
];
const symbols: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", TND: "د.ت",
  JPY: "¥", CAD: "CA$", AED: "د.إ", SAR: "﷼",
};

const CurrencyPanel: FC = () => {
  const [currency, setCurrency] = useState("USD");
  const [saved,    setSaved]    = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionHead title="Currency" desc="Set the default currency used across your agency." />
      <div className="ts-currency-preview">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0">
          <Icon d={icons.currency} size={18} sw={2} />
        </div>
        <div>
          <p className="text-xs text-violet-600 font-medium">Preview</p>
          <p className="text-2xl font-bold text-violet-700" style={{ fontFamily: "Georgia,serif" }}>
            {symbols[currency] ?? ""}1,234.56
          </p>
          <p className="text-xs text-violet-500 mt-0.5">Sample amount in your selected currency</p>
        </div>
      </div>
      <div className="max-w-xs">
        <SettingsSelect label="Default currency" value={currency} onChange={setCurrency} options={currencies} />
      </div>
      <div className="mt-6 flex justify-end">
        <SaveBtn onClick={save} saved={saved} />
      </div>
    </div>
  );
};

export default CurrencyPanel;