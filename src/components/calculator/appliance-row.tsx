"use client";

import { useState } from "react";
import { Minus, Plus, X, Pencil, Check, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatNumber, formatWatts } from "@/lib/formatting";
import { ASSUMPTIONS } from "@/domain/config/assumptions";
import type { WizardItem } from "./calculator-wizard";
import { PcPowerEstimator } from "./pc-power-estimator";

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
  const [editing, setEditing] = useState(false);
  const [showPcEstimator, setShowPcEstimator] = useState(false);
  const isDesktop = item.applianceId === "desktop-computer";

  const summary = t("row.summary", {
    watts: formatWatts(item.watts),
    hours: formatNumber(item.hoursPerDay, 1),
  });
  const inputClass = invalid
    ? "field-input border-rose-500 focus:border-rose-500 focus:ring-rose-500"
    : "field-input";

  return (
    <li className="card space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-medium text-slate-900">{name}</p>
        <button
          type="button"
          onClick={() => onRemove(item.uid)}
          aria-label={t("row.remove")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Quantity stepper — the primary interaction (§37) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="stepper-btn"
            aria-label="−"
            disabled={item.quantity <= 1}
            onClick={() => onChange(item.uid, { quantity: Math.max(1, item.quantity - 1) })}
          >
            <Minus className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <span className="w-10 text-center text-xl font-semibold" aria-live="polite">
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

        {/* Caption + edit */}
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm text-slate-600">{summary}</span>
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
            {editing ? t("row.done") : t("row.edit")}
          </button>
        </div>
      </div>

      {item.surgeCategory ? (
        <p className="text-xs text-amber-700">{t("warn.surgeRow")}</p>
      ) : null}
      {unusual ? (
        <p className="text-xs text-amber-700">
          {t(unusual === "high" ? "warn.unusualHigh" : "warn.unusualLow", {
            value: formatNumber(item.watts),
          })}
        </p>
      ) : null}

      {/* Desktop PC estimator toggle */}
      {isDesktop && !editing ? (
        <div className="space-y-2">
          {!showPcEstimator ? (
            <button
              type="button"
              onClick={() => setShowPcEstimator(true)}
              className="flex w-full items-center gap-2 rounded-[4px] border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:border-amber-400"
            >
              <Cpu className="h-4 w-4" />
              {t("row.pcEstimator")}
            </button>
          ) : (
            <PcPowerEstimator
              onSelect={(watts) => {
                onChange(item.uid, { watts });
                setShowPcEstimator(false);
              }}
              onSkip={() => setShowPcEstimator(false)}
            />
          )}
        </div>
      ) : null}

      {editing ? (
        <div className="grid grid-cols-2 gap-3 rounded-[4px] border border-slate-200 bg-slate-50 p-3">
          <label className="flex flex-col gap-1">
            <span className="field-label">{t("row.wattsLabel")} (W)</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={ASSUMPTIONS.maxWatts}
              value={item.watts}
              onChange={(e) => onChange(item.uid, { watts: Number(e.target.value) || 0 })}
              className={inputClass}
              aria-label={t("row.wattsLabel")}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="field-label">{t("row.hoursLabel")}</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={24}
              step={0.5}
              value={item.hoursPerDay}
              onChange={(e) => onChange(item.uid, { hoursPerDay: Number(e.target.value) || 0 })}
              className={inputClass}
              aria-label={t("row.hoursLabel")}
            />
          </label>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="btn-secondary col-span-2"
          >
            <Check className="h-4 w-4" strokeWidth={1.75} />
            {t("row.done")}
          </button>
        </div>
      ) : null}
    </li>
  );
}