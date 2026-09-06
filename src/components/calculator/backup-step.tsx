"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatHours } from "@/lib/formatting";

interface Props {
  value: number;
  onChange: (hours: number) => void;
}

const PRESETS = [1, 2, 4, 6];

export function BackupStep({ value, onChange }: Props) {
  const { t } = useI18n();
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState(
    PRESETS.includes(value) ? "" : String(value),
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
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESETS.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => onChange(h)}
            aria-pressed={value === h && !customOpen}
            className={`chip h-14 justify-center text-lg font-semibold ${
              value === h && !customOpen ? "chip-active" : "chip-idle"
            }`}
          >
            {formatHours(h)}
          </button>
        ))}
      </div>

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