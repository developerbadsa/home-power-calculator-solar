/**
 * Battery sizing (§18, §19, §46).
 *
 * Pipeline:
 *   AC backup energy → DC stored energy (÷ invEff × battEff)
 *   → purchased capacity ÷ depthOfDischarge
 *   → pick a practical system voltage (12V/24V/48V)
 *   → round up to real, buyable battery configurations from the catalog.
 *
 * The theoretical value is always preserved internally; the headline answer
 * is always a practical configuration.
 */

import type {
  ApplianceInput,
  BackupTier,
  BatteryRecommendation,
  CalculationSettings,
  PracticalBattery,
} from "./types";
import { batteryEnergyWh } from "./energy";
import { totalLoadW } from "./load";
import { ASSUMPTIONS } from "@/domain/config/assumptions";
import { BATTERY_CAPACITIES_AH } from "@/data/batteries";

/** How much of the requested backup each tier should aim to deliver (§25). */
const TIER_MULTIPLIERS: Record<BackupTier, number> = {
  budget: 0.7,
  recommended: 1,
  heavy: 1.3,
};

/** Pick the most practical system voltage for a required purchased capacity. */
export function pickSystemVoltage(
  purchasedAhAt12V: number,
  settings: CalculationSettings,
): number {
  if (settings.systemVoltage != null) return settings.systemVoltage;
  const tiers = ASSUMPTIONS.batteryVoltageTiers;
  for (const tier of tiers) {
    // Capacity at this voltage equals purchasedAhAt12V × (12 / voltage).
    const ahAtThisVoltage = (purchasedAhAt12V * 12) / tier.voltage;
    if (ahAtThisVoltage <= tier.maxAh) return tier.voltage;
  }
  return tiers[tiers.length - 1].voltage;
}

/** Build a practical configuration from a battery size. */
function makeConfig(
  voltage: number,
  count: number,
  sizeAh: number,
  loadW: number,
  settings: CalculationSettings,
): PracticalBattery {
  const capacityAh = count * sizeAh;
  const estimatedBackupHours =
    (capacityAh *
      voltage *
      settings.depthOfDischarge *
      settings.inverterEfficiency *
      settings.batteryEfficiency) /
    (loadW || 1);
  const configuration =
    count === 1
      ? `1 × ${sizeAh}Ah`
      : `${count} × ${sizeAh}Ah parallel`;
  return {
    label: `${voltage}V ${capacityAh}Ah`,
    capacityAh,
    configuration,
    estimatedBackupHours,
  };
}

/** Smallest single battery ≥ target (nearest commercial size, rounded up). */
function smallestSingle(targetAh: number): number | undefined {
  return BATTERY_CAPACITIES_AH.find((size) => size >= targetAh);
}

/**
 * Best parallel combination of identical batteries covering targetAh with the
 * least waste, using the largest practical battery sizes so string count stays
 * low. Returns undefined when nothing fits.
 */
function bestParallel(
  targetAh: number,
  maxStrings: number,
): { sizeAh: number; count: number } | undefined {
  // Only use realistically stocked battery sizes for parallel banks, and
  // prefer the fewest strings (least waste, then fewest units).
  const usable = BATTERY_CAPACITIES_AH.filter((size) => size >= 100);
  let best: { sizeAh: number; count: number; waste: number } | undefined;
  for (const size of usable) {
    const count = Math.ceil(targetAh / size);
    if (count > maxStrings) continue;
    const waste = count * size - targetAh;
    const better =
      !best ||
      waste < best.waste ||
      (waste === best.waste && count < best.count);
    if (better) best = { sizeAh: size, count, waste };
  }
  return best ? { sizeAh: best.sizeAh, count: best.count } : undefined;
}

export function sizeBattery(
  appliances: ApplianceInput[],
  backupHours: number,
  tier: BackupTier,
  settings: CalculationSettings,
): BatteryRecommendation {
  const loadW = totalLoadW(appliances);
  const backupWh = batteryEnergyWh(appliances, backupHours, settings); // DC stored energy
  const purchasedWh = backupWh / settings.depthOfDischarge; // capacity to buy (÷ DoD)

  const purchasedAhAt12V = purchasedWh / 12;
  const systemVoltage = pickSystemVoltage(purchasedAhAt12V, settings);
  const theoreticalAh = purchasedWh / systemVoltage;
  const theoreticalWh = purchasedWh;

  const targetAh = theoreticalAh * TIER_MULTIPLIERS[tier];

  // Practical configuration.
  const single = smallestSingle(targetAh);
  let practical: PracticalBattery;
  let alternatives: PracticalBattery[] = [];

  if (single) {
    practical = makeConfig(systemVoltage, 1, single, loadW, settings);
    // Alternative: one step bigger (extra reserve).
    const bigger = BATTERY_CAPACITIES_AH.find(
      (size) => size > single,
    );
    if (bigger) {
      alternatives.push(makeConfig(systemVoltage, 1, bigger, loadW, settings));
    }
    // Alternative: a parallel pair when it still makes sense (only for
    // medium targets where two smaller units are a real shop option).
    const pairSize = BATTERY_CAPACITIES_AH.find(
      (size) => 2 * size >= targetAh && 2 * size > single,
    );
    if (pairSize && pairSize * 2 >= targetAh && 2 * pairSize <= single * 2.2) {
      alternatives.push(makeConfig(systemVoltage, 2, pairSize, loadW, settings));
    }
  } else {
    const parallel = bestParallel(targetAh, 6);
    if (parallel) {
      practical = makeConfig(
        systemVoltage,
        parallel.count,
        parallel.sizeAh,
        loadW,
        settings,
      );
      // Alternative: one more string of the same size (heavy reserve).
      alternatives.push(
        makeConfig(
          systemVoltage,
          parallel.count + 1,
          parallel.sizeAh,
          loadW,
          settings,
        ),
      );
    } else {
      // Extreme fallback: clamp to the largest catalog option.
      const sizeAh = BATTERY_CAPACITIES_AH[BATTERY_CAPACITIES_AH.length - 1];
      practical = makeConfig(systemVoltage, 6, sizeAh, loadW, settings);
    }
  }

  // De-duplicate alternatives.
  const seen = new Set<string>([practical.label]);
  alternatives = alternatives.filter((a) => {
    if (seen.has(a.label)) return false;
    seen.add(a.label);
    return true;
  });

  return {
    systemVoltage,
    theoreticalAh,
    theoreticalWh,
    practical,
    alternatives,
  };
}