/**
 * Energy calculations (§17, §18): daily consumption and backup energy.
 * The engine works internally in watt-hours (Wh).
 */

import type { ApplianceInput, CalculationSettings } from "./types";

/** Daily energy consumption: Σ(watts × quantity × hoursPerDay). */
export function dailyEnergyWh(appliances: ApplianceInput[]): number {
  return appliances.reduce(
    (sum, a) => sum + a.watts * a.quantity * a.hoursPerDay,
    0,
  );
}

/**
 * Energy the battery must deliver (AC side) for the requested backup at the
 * running load: load × backupHours.
 */
export function backupEnergyWh(
  appliances: ApplianceInput[],
  backupHours: number,
): number {
  const load = appliances.reduce((s, a) => s + a.watts * a.quantity, 0);
  return load * backupHours;
}

/**
 * DC-side energy that must be stored in the battery after accounting for
 * inverter and battery round-trip losses (§18): AC energy ÷ (invEff × battEff).
 */
export function batteryEnergyWh(
  appliances: ApplianceInput[],
  backupHours: number,
  settings: Pick<CalculationSettings, "inverterEfficiency" | "batteryEfficiency">,
): number {
  const ac = backupEnergyWh(appliances, backupHours);
  const efficiency = settings.inverterEfficiency * settings.batteryEfficiency;
  if (efficiency <= 0) return 0;
  return ac / efficiency;
}