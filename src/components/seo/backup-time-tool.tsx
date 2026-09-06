"use client";

/**
 * Backup-time calculator (§64 long-tail: "150ah battery koto ghonta
 * backup dey" / "কত ঘণ্টা ব্যাকআপ পেতে কত ব্যাটারি লাগবে"). English SEO
 * content page tool — uses the same efficiency assumptions as the engine
 * (`ASSUMPTIONS`) so answers stay consistent with the main calculator.
 */
import { useState } from "react";
import { Clock } from "lucide-react";
import { ASSUMPTIONS } from "@/domain/config/assumptions";
import { formatNumber } from "@/lib/formatting";

const VOLTAGES = [12, 24, 48];

export function BackupTimeTool() {
  const [load, setLoad] = useState("400");
  const [ah, setAh] = useState("150");
  const [voltage, setVoltage] = useState(12);

  const l = Number(load);
  const a = Number(ah);

  const usableWh =
    a * voltage * ASSUMPTIONS.depthOfDischarge * ASSUMPTIONS.inverterEfficiency * ASSUMPTIONS.batteryEfficiency;
  const hours = Number.isFinite(l) && l > 0 && Number.isFinite(a) && a > 0 ? usableWh / l : null;

  return (
    <div className="mx-auto max-w-lg">
      <div className="card space-y-4">
        <h2 className="text-lg font-medium text-slate-900">
          How long will a battery run my load?
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="field-label">Your load (watts)</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              placeholder="e.g. 400"
              value={load}
              onChange={(e) => setLoad(e.target.value)}
              className="field-input"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="field-label">Battery size (Ah)</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              placeholder="e.g. 150"
              value={ah}
              onChange={(e) => setAh(e.target.value)}
              className="field-input"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="field-label">Battery voltage</span>
            <div className="flex gap-1.5" role="group" aria-label="Battery voltage">
              {VOLTAGES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVoltage(v)}
                  aria-pressed={voltage === v}
                  className={`chip flex-1 justify-center ${voltage === v ? "chip-active" : "chip-idle"}`}
                >
                  {v}V
                </button>
              ))}
            </div>
          </label>
        </div>

        <div
          aria-live="polite"
          className={`flex items-center gap-3 rounded-[4px] border px-4 py-3 ${
            hours != null
              ? "border-slate-200 bg-slate-50"
              : "border-dashed border-slate-200 bg-white"
          }`}
        >
          {hours != null ? (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-slate-900 text-white">
                <Clock className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Estimated backup time</p>
                <p className="text-2xl font-bold text-slate-900">
                  ≈ {formatNumber(hours, hours < 10 ? 1 : 0)} hours
                </p>
                <p className="text-xs text-slate-500">
                  {formatNumber(a)}Ah {voltage}V battery at {formatNumber(l)}W load, using
                  typical discharge and efficiency assumptions.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Enter a load and battery size above to see the backup time.
            </p>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Based on an 80% depth of discharge and typical inverter (90%) and
          battery (85%) efficiencies — the same assumptions used across this
          calculator. Real results vary with battery age and temperature.
        </p>
      </div>
    </div>
  );
}