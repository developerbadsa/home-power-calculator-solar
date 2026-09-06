"use client";

import { RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { defaultSettings } from "@/domain/calculations/recommendations";
import type { CalculationSettings } from "@/domain/calculations/types";

interface Props {
  settings: CalculationSettings;
  onChange: (patch: Partial<CalculationSettings>) => void;
}

interface NumField {
  key: keyof CalculationSettings;
  labelKey: "advanced.dod" | "advanced.invEff" | "advanced.battEff" | "advanced.margin" | "advanced.psh" | "advanced.pf" | "advanced.solarDerating";
  min: number;
  max: number;
  step: number;
}

const NUM_FIELDS: NumField[] = [
  { key: "depthOfDischarge", labelKey: "advanced.dod", min: 0.1, max: 0.95, step: 0.05 },
  { key: "inverterEfficiency", labelKey: "advanced.invEff", min: 0.5, max: 0.98, step: 0.01 },
  { key: "batteryEfficiency", labelKey: "advanced.battEff", min: 0.5, max: 0.95, step: 0.01 },
  { key: "safetyMargin", labelKey: "advanced.margin", min: 1, max: 2, step: 0.05 },
  { key: "peakSunHours", labelKey: "advanced.psh", min: 1, max: 8, step: 0.1 },
  { key: "powerFactor", labelKey: "advanced.pf", min: 0.5, max: 1, step: 0.05 },
  { key: "solarDerating", labelKey: "advanced.solarDerating", min: 0.4, max: 0.95, step: 0.05 },
];

export function AdvancedSettings({ settings, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-slate-600">{t("advanced.voltage")}</h3>
        <select
          value={settings.systemVoltage ?? "auto"}
          onChange={(e) =>
            onChange({
              systemVoltage:
                e.target.value === "auto" ? null : Number(e.target.value),
            })
          }
          className="field-input w-40"
        >
          <option value="auto">{t("advanced.voltage.auto")}</option>
          <option value={12}>12V</option>
          <option value={24}>24V</option>
          <option value={48}>48V</option>
        </select>
      </div>

      {NUM_FIELDS.map((f) => (
        <div key={f.key} className="flex items-center justify-between gap-3">
          <label htmlFor={`adv-${f.key}`} className="text-sm font-medium text-slate-600">
            {t(f.labelKey)}
          </label>
          <input
            id={`adv-${f.key}`}
            type="number"
            inputMode="decimal"
            min={f.min}
            max={f.max}
            step={f.step}
            value={settings[f.key] as number}
            onChange={(e) =>
              onChange({ [f.key]: Number(e.target.value) } as Partial<CalculationSettings>)
            }
            className="field-input w-24 text-right"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange(defaultSettings())}
        className="btn-ghost w-full"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        {t("advanced.reset")}
      </button>
    </div>
  );
}