"use client";

import { useState } from "react";
import { X, Clock, Zap, Battery, BatteryFull } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatHours } from "@/lib/formatting";

interface Props {
  value: number;
  onChange: (hours: number) => void;
}

const PRESETS = [
  { hours: 1, icon: Clock, label: "1h", desc: { en: "Quick backup", bn: "দ্রুত ব্যাকআপ" } },
  { hours: 2, icon: Zap, label: "2h", desc: { en: "Most popular", bn: "সবচেয়ে জনপ্রিয়" } },
  { hours: 4, icon: Battery, label: "4h", desc: { en: "Extended backup", bn: "বর্ধিত ব্যাকআপ" } },
  { hours: 6, icon: BatteryFull, label: "6h", desc: { en: "Full evening", bn: "পুরো সন্ধ্যা" } },
];

export function BackupStep({ value, onChange }: Props) {
  const { lang, t } = useI18n();
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState(
    PRESETS.some(p => p.hours === value) ? "" : String(value),
  );

  const valid = Number.isFinite(value) && value >= 0.5 && value <= 24;

  const chooseCustom = () => {
    const n = Number(customValue);
    if (Number.isFinite(n) && n >= 0.5 && n <= 24) {
      onChange(n);
      setCustomOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{t("backup.hint")}</p>
      
      {/* Preset buttons with descriptions */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = value === preset.hours && !customOpen;
          return (
            <button
              key={preset.hours}
              type="button"
              onClick={() => onChange(preset.hours)}
              aria-pressed={isActive}
              className={`flex flex-col items-center justify-center gap-1 rounded-[4px] p-3 transition-all active:scale-[0.98] ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg"
                  : "border border-slate-200 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-slate-300" : "text-slate-400"}`} strokeWidth={2} />
              <span className="text-lg font-bold">{preset.label}</span>
              <span className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                {lang === "bn" ? preset.desc.bn : preset.desc.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom hours input */}
      <div className="rounded-[4px] border border-dashed border-slate-300 bg-slate-50 p-3">
        {!customOpen ? (
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="btn-ghost w-full"
          >
            {t("backup.custom")}
          </button>
        ) : (
          <div className="flex items-end gap-2">
            <label className="flex flex-1 flex-col gap-1">
              <span className="field-label">{t("backup.customPlaceholder")}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0.5}
                max={24}
                step={0.5}
                autoFocus
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  const n = Number(e.target.value);
                  if (Number.isFinite(n) && n >= 0.5 && n <= 24) onChange(n);
                }}
                className="field-input"
              />
            </label>
            <button
              type="button"
              onClick={chooseCustom}
              className="btn-primary h-9 px-4"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setCustomOpen(false)}
              className="btn-secondary h-9 px-3"
              aria-label={t("back")}
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      {!valid ? (
        <p className="text-xs text-rose-600" role="alert">
          {t("backup.err")}
        </p>
      ) : null}
    </div>
  );
}
