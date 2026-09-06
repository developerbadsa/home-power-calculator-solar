"use client";

/**
 * Interactive unit-converter tool for the SEO converter pages (§31–32).
 * English-only by design — these are English content pages (the sitewide
 * EN/Bangla toggle stays as-is for the app chrome). All math comes from the
 * pure engine functions in `@/domain/calculations/converters`.
 */
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  ampsToWatts,
  vaToWatts,
  wattsToAmps,
} from "@/domain/calculations/converters";
import { formatNumber } from "@/lib/formatting";

type Mode = "wattToAmp" | "ampToWatt" | "vaToWatt";

const CONFIG: Record<
  Mode,
  {
    valueLabel: string;
    valuePlaceholder: string;
    resultLabel: string;
    showVolts: boolean;
    showPf: boolean;
    result: (value: number, volts: number, pf: number) => number;
    explain: (result: number, value: number, volts: number, pf: number) => string;
  }
> = {
  wattToAmp: {
    valueLabel: "Power (watts)",
    valuePlaceholder: "e.g. 1000",
    resultLabel: "Current draw",
    showVolts: true,
    showPf: true,
    result: (v, volts, pf) => wattsToAmps({ value: v, volts, powerFactor: pf }),
    explain: (r, v, volts, pf) =>
      `${formatNumber(v)}W at ${formatNumber(volts)}V with power factor ${pf} draws about ${formatNumber(r, 2)}A.`,
  },
  ampToWatt: {
    valueLabel: "Current (amps)",
    valuePlaceholder: "e.g. 5",
    resultLabel: "Power",
    showVolts: true,
    showPf: true,
    result: (v, volts, pf) => ampsToWatts({ value: v, volts, powerFactor: pf }),
    explain: (r, v, volts, pf) =>
      `${formatNumber(v)}A at ${formatNumber(volts)}V with power factor ${pf} delivers about ${formatNumber(Math.round(r))}W.`,
  },
  vaToWatt: {
    valueLabel: "Rating (VA)",
    valuePlaceholder: "e.g. 1000",
    resultLabel: "Real power",
    showVolts: false,
    showPf: true,
    result: (v, _volts, pf) => vaToWatts(v, pf),
    explain: (r, v, _volts, pf) =>
      `A ${formatNumber(v)}VA device delivers about ${formatNumber(Math.round(r))}W of real power at power factor ${pf}.`,
  },
};

interface Props {
  mode: Mode;
  /** e.g. "Convert watts to amps" */
  toolTitle: string;
}

export function UnitConverterTool({ mode, toolTitle }: Props) {
  const cfg = CONFIG[mode];
  const [value, setValue] = useState("");
  const [volts, setVolts] = useState("220");
  const [pf, setPf] = useState("0.8");

  const v = Number(value);
  const vo = Number(volts);
  const p = Number(pf);
  const ready = Number.isFinite(v) && v > 0 && Number.isFinite(p) && p > 0;
  const voltsReady = !cfg.showVolts || (Number.isFinite(vo) && vo > 0);
  const result = ready && voltsReady ? cfg.result(v, vo, p) : null;

  return (
    <div className="mx-auto max-w-lg">
      <div className="card space-y-4">
        <h2 className="text-lg font-medium text-slate-900">{toolTitle}</h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 flex flex-col gap-1">
            <span className="field-label">{cfg.valueLabel}</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              placeholder={cfg.valuePlaceholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="field-input"
            />
          </label>

          {cfg.showVolts ? (
            <label className="flex flex-col gap-1">
              <span className="field-label">Voltage (V)</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="220"
                value={volts}
                onChange={(e) => setVolts(e.target.value)}
                className="field-input"
              />
              <span className="text-xs text-slate-400">
                Bangladesh homes use 220V
              </span>
            </label>
          ) : null}

          {cfg.showPf ? (
            <label className="flex flex-col gap-1">
              <span className="field-label">Power factor</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={1}
                step={0.05}
                placeholder="0.8"
                value={pf}
                onChange={(e) => setPf(e.target.value)}
                className="field-input"
              />
              <span className="text-xs text-slate-400">
                Use 1 for bulbs & heaters
              </span>
            </label>
          ) : null}
        </div>

        <div
          aria-live="polite"
          className={`flex items-center gap-3 rounded-[4px] border px-4 py-3 ${
            result != null
              ? "border-slate-200 bg-slate-50"
              : "border-dashed border-slate-200 bg-white"
          }`}
        >
          {result != null ? (
            <>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-slate-400"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {cfg.resultLabel}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(result, result < 10 ? 2 : 1)}
                  <span className="ml-1 text-sm font-medium text-slate-500">
                    {mode === "wattToAmp" ? "A" : "W"}
                  </span>
                </p>
                <p className="text-xs text-slate-500">{cfg.explain(result, v, vo, p)}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Enter a value above to see the result.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}