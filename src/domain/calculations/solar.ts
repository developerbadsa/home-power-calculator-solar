/**
 * Solar sizing (§22, §23).
 *
 * Solar is sized to cover the daily energy requirement, and additionally to be
 * able to recharge the battery after a full outage in about one good-sun day.
 * Losses (dust, temperature, wiring, controller) are accounted for via
 * `solarDerating`. Peak sun hours default to Bangladesh's ~4.7h/day (§68).
 *
 * The headline number is a rounded practical figure; the engine also returns
 * real panel combinations from the panel catalog (§23) — never pretend
 * combos are electrically interchangeable, they are example options.
 */

import type {
  ApplianceInput,
  CalculationSettings,
  SolarCombo,
  SolarRecommendation,
} from "./types";
import { dailyEnergyWh, batteryEnergyWh } from "./energy";
import { SOLAR_PANEL_WATTS } from "@/data/solarPanels";

function solarPowerForEnergy(energyWh: number, settings: CalculationSettings): number {
  const denominator = settings.peakSunHours * settings.solarDerating;
  if (denominator <= 0) return 0;
  return energyWh / denominator;
}

/** Round a target up to a friendly headline number (nearest 50W). */
export function roundUpSolarWatts(target: number): number {
  if (target <= 0) return 0;
  return Math.max(50, Math.ceil(target / 50) * 50);
}

/** Best single-size combination of panels covering target (least waste). */
function bestComboForSize(target: number, panelWatts: number): SolarCombo | undefined {
  const panels = Math.ceil(target / panelWatts);
  if (panels > 20) return undefined;
  return { panels, panelWatts, totalWatts: panels * panelWatts };
}

/**
 * Example panel combinations (§23): the globally best option plus the best
 * option per common panel size, de-duplicated, up to 3 total.
 */
export function panelCombinations(target: number): SolarCombo[] {
  if (target <= 0) return [];
  const candidates: SolarCombo[] = [];
  for (const size of SOLAR_PANEL_WATTS) {
    const combo = bestComboForSize(target, size);
    if (combo) candidates.push(combo);
  }
  // Best overall: least waste, then fewest panels.
  candidates.sort((a, b) => {
    const wasteA = a.totalWatts - target;
    const wasteB = b.totalWatts - target;
    if (wasteA !== wasteB) return wasteA - wasteB;
    return a.panels - b.panels;
  });

  const result: SolarCombo[] = [];
  const seen = new Set<string>();
  const push = (c: SolarCombo | undefined) => {
    if (!c) return;
    const key = `${c.panels}×${c.panelWatts}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(c);
  };

  // Prefer showing combos with different panel sizes (§23 example style).
  const preferredSizes = [300, 150, 450, 200, 100, 330, 400, 550];
  const best = candidates[0];
  push(best);
  if (best) {
    for (const size of preferredSizes) {
      if (result.length >= 3) break;
      if (size === best.panelWatts) continue;
      const bySize = candidates.find((c) => c.panelWatts === size);
      push(bySize);
    }
  }
  // Fill remaining slots with the next best candidates.
  for (const c of candidates) {
    if (result.length >= 3) break;
    push(c);
  }
  return result;
}

export function sizeSolar(
  appliances: ApplianceInput[],
  backupHours: number,
  settings: CalculationSettings,
): SolarRecommendation {
  const daily = dailyEnergyWh(appliances);
  const backup = batteryEnergyWh(appliances, backupHours, settings); // DC stored energy

  const dailySolar = solarPowerForEnergy(daily, settings);
  const rechargeSolar = solarPowerForEnergy(backup, settings);

  const targetWatts = Math.max(dailySolar, rechargeSolar);
  const recommendedWatts = roundUpSolarWatts(targetWatts);

  return {
    targetWatts,
    recommendedWatts,
    combos: panelCombinations(targetWatts),
  };
}