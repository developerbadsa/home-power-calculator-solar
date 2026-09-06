/**
 * Recommendation engine (§43): the single entry point that runs the full
 * pipeline — load → energy → battery → inverter → solar — and collects
 * warnings. The UI never calls the individual calculators directly.
 */

import { ASSUMPTIONS } from "@/domain/config/assumptions";
import type {
  CalculationInput,
  CalculationResult,
  CalculationSettings,
  Warning,
} from "./types";
import { totalLoadW, hasSurgeAppliances, surgeApplianceNames } from "./load";
import { dailyEnergyWh, batteryEnergyWh } from "./energy";
import { sizeBattery } from "./battery";
import { sizeInverter } from "./inverter";
import { sizeSolar } from "./solar";

/** Merge user overrides (from Advanced settings) with the central defaults. */
export function resolveSettings(overrides?: Partial<CalculationSettings>): CalculationSettings {
  return {
    systemVoltage: overrides?.systemVoltage ?? ASSUMPTIONS.systemVoltage,
    depthOfDischarge: overrides?.depthOfDischarge ?? ASSUMPTIONS.depthOfDischarge,
    inverterEfficiency: overrides?.inverterEfficiency ?? ASSUMPTIONS.inverterEfficiency,
    batteryEfficiency: overrides?.batteryEfficiency ?? ASSUMPTIONS.batteryEfficiency,
    safetyMargin: overrides?.safetyMargin ?? ASSUMPTIONS.safetyMargin,
    powerFactor: overrides?.powerFactor ?? ASSUMPTIONS.powerFactor,
    peakSunHours: overrides?.peakSunHours ?? ASSUMPTIONS.peakSunHours,
    solarDerating: overrides?.solarDerating ?? ASSUMPTIONS.solarDerating,
  };
}

export function defaultSettings(): CalculationSettings {
  return resolveSettings();
}

function collectWarnings(input: CalculationInput, result: {
  totalLoadW: number;
  battery: ReturnType<typeof sizeBattery>;
  inverter: ReturnType<typeof sizeInverter>;
}): Warning[] {
  const warnings: Warning[] = [];

  if (hasSurgeAppliances(input.appliances)) {
    warnings.push({
      code: "surge",
      severity: "warning",
      applianceNames: surgeApplianceNames(input.appliances),
      data: {
        suggestedVA: result.inverter.surgeSuggestedVA ?? result.inverter.recommendedVA,
      },
    });
  }

  if (input.appliances.some((a) => a.typicalWatts != null && a.watts > 0)) {
    for (const a of input.appliances) {
      if (a.typicalWatts == null) continue;
      const ratio = a.watts / a.typicalWatts;
      if (ratio > ASSUMPTIONS.unusualWattRatioHigh) {
        warnings.push({
          code: "unusual-wattage",
          severity: "info",
          applianceNames: [a.name],
          data: { direction: "high", value: a.watts },
        });
      } else if (ratio < ASSUMPTIONS.unusualWattRatioLow) {
        warnings.push({
          code: "unusual-wattage",
          severity: "info",
          applianceNames: [a.name],
          data: { direction: "low", value: a.watts },
        });
      }
    }
  }

  if (result.totalLoadW > ASSUMPTIONS.largeSystemLoadW) {
    warnings.push({
      code: "large-system",
      severity: "caution",
      data: { load: result.totalLoadW },
    });
  }

  if (result.battery.theoreticalAh > ASSUMPTIONS.veryLargeSystemAh) {
    warnings.push({
      code: "very-large-system",
      severity: "caution",
      data: { ah: result.battery.theoreticalAh },
    });
  }

  return warnings;
}

export function calculate(input: CalculationInput): CalculationResult {
  const settings = resolveSettings(input.settings);

  const appliances = input.appliances;
  const load = totalLoadW(appliances);
  const daily = dailyEnergyWh(appliances);
  const backup = batteryEnergyWh(appliances, input.backupHours, settings);

  const battery = sizeBattery(appliances, input.backupHours, input.tier, settings);
  const inverter = sizeInverter(appliances, settings);
  const solar = sizeSolar(appliances, input.backupHours, settings);

  const warnings = collectWarnings(input, { totalLoadW: load, battery, inverter });

  return {
    input,
    engineVersion: ASSUMPTIONS.engineVersion,
    assumptionsVersion: ASSUMPTIONS.assumptionsVersion,
    tier: input.tier,
    totalLoadW: load,
    dailyEnergyWh: daily,
    backupEnergyWh: backup,
    battery,
    inverter,
    solar,
    warnings,
    usedSettings: settings,
  };
}

export type {
  BackupTier,
  CalculationInput,
  CalculationResult,
  CalculationSettings,
} from "./types";