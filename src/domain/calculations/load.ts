/**
 * Load calculations (§17): running load and momentary peak load including
 * starting currents. Pure functions — no UI, no imports from React.
 */

import type { ApplianceInput } from "./types";
import { ASSUMPTIONS } from "@/domain/config/assumptions";

/** Total running load: Σ(watts × quantity). */
export function totalLoadW(appliances: ApplianceInput[]): number {
  return appliances.reduce((sum, a) => sum + a.watts * a.quantity, 0);
}

/**
 * Surge factor for an appliance: explicit override, else category default.
 */
export function surgeFactorFor(appliance: ApplianceInput): number {
  if (appliance.surgeFactor != null && appliance.surgeFactor > 0) {
    return appliance.surgeFactor;
  }
  if (appliance.surgeCategory) {
    return ASSUMPTIONS.surgeFactors[appliance.surgeCategory];
  }
  return 1;
}

/**
 * Estimated momentary (starting) peak load in watts. Non-surge appliances
 * count at their running watts; surge appliances count at watts × surgeFactor.
 */
export function peakLoadW(appliances: ApplianceInput[]): number {
  return appliances.reduce((sum, a) => {
    const factor = surgeFactorFor(a);
    return sum + a.watts * a.quantity * factor;
  }, 0);
}

/** True when any selected appliance draws starting current. */
export function hasSurgeAppliances(appliances: ApplianceInput[]): boolean {
  return appliances.some((a) => a.surgeCategory != null);
}

/** Names of the surge appliances (for warning cards). */
export function surgeApplianceNames(appliances: ApplianceInput[]): string[] {
  return appliances
    .filter((a) => a.surgeCategory != null)
    .map((a) => a.name);
}