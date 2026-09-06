/**
 * Domain types for the calculation engine (§43).
 *
 * The engine consumes plain, normalized numbers — never UI state. The UI is
 * responsible for turning user interaction into an `CalculationInput`.
 */

import type { SurgeCategory } from "@/domain/config/assumptions";

/** One appliance instance as seen by the engine. */
export interface ApplianceInput {
  /** Appliance catalog id, or a synthetic id for custom appliances. */
  id: string;
  /** Display name (already localized by the UI layer). */
  name: string;
  /** Running power in watts. */
  watts: number;
  /** Quantity (1..maxQuantity). */
  quantity: number;
  /** Average running hours per day (0..24). */
  hoursPerDay: number;
  /** Typical wattage for this appliance (used for "unusual value" checks). */
  typicalWatts?: number;
  /** Whether this appliance draws starting/startup current. */
  surgeCategory?: SurgeCategory;
  /** Per-appliance surge factor override (falls back to the category default). */
  surgeFactor?: number;
}

/** Technical settings — defaults come from ASSUMPTIONS (§44). */
export interface CalculationSettings {
  /** null = engine picks the most practical battery voltage automatically. */
  systemVoltage: number | null;
  depthOfDischarge: number;
  inverterEfficiency: number;
  batteryEfficiency: number;
  safetyMargin: number;
  powerFactor: number;
  peakSunHours: number;
  solarDerating: number;
}

export type BackupTier = "budget" | "recommended" | "heavy";

/** The single entry input for the whole engine. */
export interface CalculationInput {
  appliances: ApplianceInput[];
  backupHours: number;
  tier: BackupTier;
  settings: CalculationSettings;
}

/** A practical, buyable battery configuration. */
export interface PracticalBattery {
  /** Human label, e.g. "12V 150Ah" or "12V 300Ah (2 × 150Ah parallel)". */
  label: string;
  /** Total capacity in Ah at the system voltage. */
  capacityAh: number;
  /** Number of battery units and connection, e.g. "2 × 150Ah parallel". */
  configuration: string;
  /** Estimated backup hours this configuration delivers at the running load. */
  estimatedBackupHours: number;
}

export interface BatteryRecommendation {
  systemVoltage: number;
  /** Theoretical requirement (never shown as the headline — §19/§46). */
  theoreticalAh: number;
  theoreticalWh: number;
  /** Practical, commercially available size — the user-facing answer. */
  practical: PracticalBattery;
  /** Alternative configurations (e.g. one step bigger / parallel option). */
  alternatives: PracticalBattery[];
}

export interface InverterRecommendation {
  /** Running load converted to VA with safety margin, before rounding. */
  runningVA: number;
  /** Practical IPS/inverter size (standard VA class, §20). */
  recommendedVA: number;
  /** Human label, e.g. "1000VA". */
  label: string;
  /** Estimated momentary load including starting currents (watts). */
  peakLoadW: number;
  peakVA: number;
  /** True when surge appliances may need a larger/surge-rated inverter. */
  surgeAdvised: boolean;
  /** Suggested minimum VA class when surge is advised. */
  surgeSuggestedVA?: number;
}

export interface SolarCombo {
  panels: number;
  panelWatts: number;
  totalWatts: number;
}

export interface SolarRecommendation {
  /** Theoretical requirement in watts (kept internally, §46). */
  targetWatts: number;
  /** Practical, rounded headline number. */
  recommendedWatts: number;
  /** Example panel combinations from the panel catalog (§23). */
  combos: SolarCombo[];
}

export type WarningSeverity = "info" | "warning" | "caution";

export interface Warning {
  code: "surge" | "large-system" | "very-large-system" | "unusual-wattage";
  severity: WarningSeverity;
  /** Appliance names involved (localized by the UI layer). */
  applianceNames?: string[];
  /** Extra structured data the UI may need to render the warning. */
  data?: Record<string, string | number>;
}

export interface CalculationResult {
  /** Normalized input snapshot — kept so results stay auditable (§45). */
  input: CalculationInput;
  engineVersion: string;
  assumptionsVersion: string;
  tier: BackupTier;

  totalLoadW: number;
  dailyEnergyWh: number;
  /** Energy the battery must deliver for the requested backup (§18). */
  backupEnergyWh: number;

  battery: BatteryRecommendation;
  inverter: InverterRecommendation;
  solar: SolarRecommendation;

  warnings: Warning[];
  /** The settings actually used for this run (defaults + overrides). */
  usedSettings: CalculationSettings;
}