"use client";

import { Minus, Plus, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatNumber, formatWatts } from "@/lib/formatting";
import { ASSUMPTIONS } from "@/domain/config/assumptions";
import type { WizardItem } from "./calculator-wizard";

interface Props {
  item: WizardItem;
  name: string;
  invalid?: boolean;
  onChange: (uid: string, patch: Partial<WizardItem>) => void;
  onRemove: (uid: string) => void;
  unusual?: "high" | "low" | null;
}

export function ApplianceRow({ item, name, invalid, onChange, onRemove, unusual }: Props) {
  const { t } = useI18n();

  const isTypical = item.typicalWatts != null && item.watts === item.typicalWatts;
  const inputClass = invalid
    ? "field-input border-rose-500 focus:border-rose-500 focus:ring-rose-500"
    : "field-input";

  return (
    <li className="card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          {item.surgeCategory ? (
            <p className="mt-0.5 text-xs text-amber-700">{t("warn.surgeRow")}</p>
          ) : null}
          {unusual ? (
            <p className="mt-0.5 text-xs text-amber-700">
              {t(unusual === "high" ? "warn.unusualHigh" : "warn.unusualLow", {
                value: formatNumber(item.watts),
              })}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.uid)}
          aria-label={t("row.remove")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr] items-end gap-3">
        {/* Quantity stepper */}
        <div className="flex flex-col items-center gap-1">
          <span className="field-label">{t("row.quantity")}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="stepper-btn"
              aria-label="−"
              disabled={item.quantity <= 1}
              onClick={() =>
                onChange(item.uid, {
                  quantity: Math.max(1, item.quantity - 1),
                })
              }
            >
              <Minus className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <span
              className="w-9 text-center text-base font-semibold"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              className="stepper-btn"
              aria-label="+"
              disabled={item.quantity >= ASSUMPTIONS.maxQuantity}
              onClick={() =>
                onChange(item.uid, {
                  quantity: Math.min(ASSUMPTIONS.maxQuantity, item.quantity + 1),
                })
              }
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Watts */}
        <label className="flex flex-col gap-1">
          <span className="field-label">
            {t("row.wattsLabel")}{" "}
            <span className="font-normal text-slate-400">
              {isTypical && item.typicalWatts
                ? `(${t("row.wattsTypical", { watts: formatWatts(item.typicalWatts) })})`
                : ""}
            </span>
          </span>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={ASSUMPTIONS.maxWatts}
              value={item.watts}
              onChange={(e) =>
                onChange(item.uid, { watts: Number(e.target.value) || 0 })
              }
              className={`${inputClass} pr-8`}
              aria-label={t("row.wattsLabel")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              W
            </span>
          </div>
        </label>

        {/* Hours */}
        <label className="flex flex-col gap-1">
          <span className="field-label">{t("row.hoursLabel")}</span>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={24}
              step={0.5}
              value={item.hoursPerDay}
              onChange={(e) =>
                onChange(item.uid, { hoursPerDay: Number(e.target.value) || 0 })
              }
              className={`${inputClass} pr-8`}
              aria-label={t("row.hoursLabel")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              h
            </span>
          </div>
        </label>
      </div>
    </li>
  );
}