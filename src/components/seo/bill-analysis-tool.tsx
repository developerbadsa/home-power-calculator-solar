"use client";

import { useMemo, useState } from "react";
import { FileText, Calculator, BatteryCharging, Plug, Sun, Info, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatWatts, formatEnergy, formatNumber } from "@/lib/formatting";
import { calculate, defaultSettings } from "@/domain/calculations/recommendations";
import { estimateCost, formatBDT } from "@/domain/calculations/cost";

/**
 * Bill Analysis Tool
 *
 * User enters 1–6 months of electricity bill kWh readings.
 * The tool calculates:
 *  - Average monthly consumption (kWh)
 *  - Average daily consumption (kWh/day)
 *  - Average load (W)
 *
 * Then feeds that load into the recommendation engine
 * to suggest IPS/battery/solar size.
 */

const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_BN = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

interface BillEntry {
  kWh: string;
}

export function BillAnalysisTool() {
  const { lang, t } = useI18n();
  const [bills, setBills] = useState<BillEntry[]>([
    { kWh: "" },
    { kWh: "" },
    { kWh: "" },
  ]);
  const [backupHours, setBackupHours] = useState(2);

  const addMonth = () => {
    if (bills.length < 6) setBills([...bills, { kWh: "" }]);
  };

  const removeMonth = (idx: number) => {
    if (bills.length > 1) setBills(bills.filter((_, i) => i !== idx));
  };

  const updateKwh = (idx: number, val: string) => {
    const next = [...bills];
    next[idx] = { kWh: val };
    setBills(next);
  };

  // Calculate averages
  const analysis = useMemo(() => {
    const validBills = bills
      .map((b) => parseFloat(b.kWh))
      .filter((n) => Number.isFinite(n) && n > 0);

    if (validBills.length === 0) return null;

    const totalKwh = validBills.reduce((s, v) => s + v, 0);
    const months = validBills.length;
    const avgMonthlyKwh = totalKwh / months;
    const avgDailyKwh = avgMonthlyKwh / 30;
    const avgLoadW = (avgDailyKwh * 1000) / 24;

    return {
      totalKwh,
      months,
      avgMonthlyKwh,
      avgDailyKwh,
      avgLoadW,
    };
  }, [bills]);

  // Recommendation based on average load
  const recommendation = useMemo(() => {
    if (!analysis) return null;

    const avgW = Math.round(analysis.avgLoadW);

    // Create a single-appliance load matching the average consumption
    const result = calculate({
      appliances: [
        {
          id: "custom",
          name: lang === "bn" ? "গড় বিদ্যুৎ খরচ" : "Average electricity use",
          watts: avgW,
          quantity: 1,
          hoursPerDay: 24,
        },
      ],
      backupHours,
      tier: "recommended",
      settings: defaultSettings(),
    });

    const battery = result.battery.practical;
    const inverter = result.inverter;
    const solar = result.solar;
    const cost = estimateCost({
      batteryAh: battery.capacityAh,
      batteryVoltage: result.usedSettings.systemVoltage ?? 12,
      inverterVA: inverter.recommendedVA,
      solarWatts: solar.recommendedWatts,
    });

    return { result, battery, inverter, solar, cost, avgW };
  }, [analysis, backupHours, lang]);

  const hasInput = bills.some((b) => parseFloat(b.kWh) > 0);

  return (
    <div className="space-y-6">
      {/* Bill inputs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-500" strokeWidth={2} />
          <p className="text-sm font-medium text-slate-700">
            {t("bill.enterKwh")}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {bills.map((bill, idx) => {
            const monthLabel =
              idx < 12
                ? lang === "bn"
                  ? MONTH_NAMES_BN[(new Date().getMonth() - idx + 12) % 12]
                  : MONTH_NAMES_EN[(new Date().getMonth() - idx + 12) % 12]
                : `${lang === "bn" ? "মাস" : "Month"} ${idx + 1}`;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="field-label">{monthLabel}</label>
                  {bills.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeMonth(idx)}
                      className="text-xs text-slate-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={1}
                    value={bill.kWh}
                    onChange={(e) => updateKwh(idx, e.target.value)}
                    placeholder="kWh"
                    className="field-input pr-10"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    kWh
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {bills.length < 6 ? (
          <button
            type="button"
            onClick={addMonth}
            className="btn-ghost w-full border border-dashed border-slate-300 text-sm"
          >
            + {t("bill.addMonth")}
          </button>
        ) : null}

        <p className="text-xs text-slate-400">{t("bill.kwhHint")}</p>
      </div>

      {/* Analysis results */}
      {analysis ? (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[4px] border border-slate-200 bg-white p-3 text-center">
              <p className="text-xs font-medium text-slate-500">{t("bill.avgMonthly")}</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(analysis.avgMonthlyKwh, 0)} kWh
              </p>
            </div>
            <div className="rounded-[4px] border border-slate-200 bg-white p-3 text-center">
              <p className="text-xs font-medium text-slate-500">{t("bill.avgDaily")}</p>
              <p className="text-xl font-bold text-slate-900">
                {formatNumber(analysis.avgDailyKwh, 1)} kWh
              </p>
            </div>
            <div className="rounded-[4px] border border-slate-900 bg-slate-900 p-3 text-center text-white">
              <p className="text-xs font-medium text-slate-400">{t("bill.avgLoad")}</p>
              <p className="text-xl font-bold">
                {formatWatts(Math.round(analysis.avgLoadW))}
              </p>
            </div>
          </div>

          {/* Backup time selector */}
          <div className="space-y-2">
            <p className="field-label">{t("bill.backupHint")}</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 6].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setBackupHours(h)}
                  className={`flex h-12 items-center justify-center rounded-[4px] text-sm font-semibold transition-colors active:scale-[0.98] ${
                    backupHours === h
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-900 hover:border-slate-900"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          {recommendation ? (
            <div className="space-y-4">
              {/* Main recommendation card */}
              <div className="rounded-[4px] border border-slate-900 bg-slate-900 p-5 text-white">
                <p className="mb-3 text-center text-sm font-medium text-slate-300">
                  {t("bill.youNeed")}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <BillValue
                    icon={BatteryCharging}
                    value={recommendation.battery.label}
                    sub={recommendation.battery.configuration}
                    label={t("result.batteryLabel")}
                  />
                  <BillValue
                    icon={Plug}
                    value={recommendation.inverter.label}
                    label={t("result.ipsLabel")}
                  />
                  <BillValue
                    icon={Sun}
                    value={formatWatts(recommendation.solar.recommendedWatts)}
                    label={t("result.solarLabel")}
                  />
                </div>
                <div className="mt-3 border-t border-slate-700 pt-3 text-center text-sm text-slate-300">
                  {t("bill.basedOn", {
                    kwh: formatNumber(analysis.avgMonthlyKwh, 0),
                    load: formatWatts(recommendation.avgW),
                  })}
                </div>
              </div>

              {/* Cost estimate */}
              <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4">
                <p className="mb-2 text-sm font-semibold text-amber-900">
                  {t("cost.title")}
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-amber-800">
                    <span>{t("cost.battery")}</span>
                    <span className="font-medium">{formatBDT(recommendation.cost.battery)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>{t("cost.inverter")}</span>
                    <span className="font-medium">{formatBDT(recommendation.cost.inverter)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>{t("cost.solar")}</span>
                    <span className="font-medium">{formatBDT(recommendation.cost.solar)}</span>
                  </div>
                  <div className="border-t border-amber-200 pt-1.5">
                    <div className="flex justify-between font-bold text-amber-900">
                      <span>{t("cost.total")}</span>
                      <span>{formatBDT(recommendation.cost.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly cost comparison */}
              <div className="rounded-[4px] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">
                  💡 {t("bill.savings")}
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  {t("bill.savingsDesc", {
                    solar: formatWatts(recommendation.solar.recommendedWatts),
                    kwh: formatNumber(analysis.avgMonthlyKwh, 0),
                  })}
                </p>
              </div>

              {/* How we calculated */}
              <details className="rounded-[4px] border border-slate-200 bg-white p-4 group">
                <summary className="flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-900">
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1.75} />
                  {t("bill.howCalc")}
                </summary>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>{t("bill.step1")}</li>
                    <li>{t("bill.step2")}</li>
                    <li>{t("bill.step3")}</li>
                    <li>{t("bill.step4")}</li>
                  </ul>
                  <p className="text-xs text-slate-400">{t("result.estimates")}</p>
                </div>
              </details>
            </div>
          ) : null}
        </div>
      ) : hasInput ? null : (
        <div className="flex flex-col items-center rounded-[4px] border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <div className="mb-3 rounded-[4px] bg-slate-100 p-3">
            <FileText className="h-6 w-6 text-slate-400" strokeWidth={1.25} />
          </div>
          <p className="mb-1 text-base font-medium text-slate-900">
            {t("bill.emptyTitle")}
          </p>
          <p className="max-w-sm text-sm text-slate-500">
            {t("bill.emptyHint")}
          </p>
        </div>
      )}
    </div>
  );
}

function BillValue({
  icon: Icon,
  value,
  sub,
  label,
}: {
  icon: typeof Plug;
  value: string;
  sub?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-slate-700/70 text-slate-100">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      {label ? <span className="text-xs font-medium text-slate-400">{label}</span> : null}
      <span className="text-lg font-bold leading-tight">{value}</span>
      {sub ? <span className="text-xs text-slate-300">{sub}</span> : null}
    </div>
  );
}
