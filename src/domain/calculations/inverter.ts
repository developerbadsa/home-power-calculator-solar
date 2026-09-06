/**
 * IPS / inverter / UPS sizing (§20, §21).
 *
 * The headline size comes from the running load with a safety margin,
 * converted to VA and rounded up to a standard commercial class. Starting
 * currents never silently upsize the recommendation — they produce a clear
 * advisory so the user (or an advanced flow) can choose a surge-capable unit.
 */

import type {
  ApplianceInput,
  CalculationSettings,
  InverterRecommendation,
} from "./types";
import { peakLoadW, totalLoadW } from "./load";
import { INVERTER_VA_CLASSES } from "@/data/inverters";

/** Next standard VA class ≥ value (never below). */
export function nextVaClass(va: number): number {
  return INVERTER_VA_CLASSES.find((c) => c >= va) ?? INVERTER_VA_CLASSES[INVERTER_VA_CLASSES.length - 1];
}

export function sizeInverter(
  appliances: ApplianceInput[],
  settings: CalculationSettings,
): InverterRecommendation {
  const loadW = totalLoadW(appliances);
  const peakW = peakLoadW(appliances);

  const runningVA = (loadW * settings.safetyMargin) / settings.powerFactor;
  const recommendedVA = nextVaClass(runningVA);
  const peakVA = peakW / settings.powerFactor;

  const surgeAdvised = peakVA > recommendedVA;
  const surgeSuggestedVA = surgeAdvised ? nextVaClass(peakVA) : undefined;

  return {
    runningVA,
    recommendedVA,
    label: `${recommendedVA}VA`,
    peakLoadW: peakW,
    peakVA,
    surgeAdvised,
    surgeSuggestedVA,
  };
}