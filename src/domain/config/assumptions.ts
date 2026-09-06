/**
 * Central engineering assumptions (spec §44).
 *
 * Every default below lives here and nowhere else. The calculation engine
 * reads from this single source; the "Advanced settings" UI writes overrides
 * on top of it.
 *
 * NOTE: These values are reasonable starting points for a Bangladesh-market
 * home power tool, but they must be validated against the product's chosen
 * engineering sources before production use. They are intentionally
 * documented and versioned so every result stays reproducible.
 */

export const ASSUMPTIONS = {
  /** Version of this assumptions block — bump when values change (§45). */
  assumptionsVersion: "1.0.0",

  /** Efficiency of the IPS/inverter converting DC (battery) to AC (home). */
  inverterEfficiency: 0.9,

  /** Round-trip efficiency of the battery (charge + discharge losses). */
  batteryEfficiency: 0.85,

  /**
   * Maximum share of battery capacity that should be discharged on a normal
   * backup run (Depth of Discharge). We never size the battery to be drained
   * past this point.
   */
  depthOfDischarge: 0.8,

  /** Safety margin applied when sizing the IPS/inverter above the running load. */
  safetyMargin: 1.2,

  /** Assumed power factor used when converting watts → VA for IPS sizing. */
  powerFactor: 0.8,

  /**
   * Battery system voltage. null = let the engine pick the most practical
   * voltage (12V for small systems, 24V/48V as the required capacity grows).
   */
  systemVoltage: null as number | null,

  /**
   * Typical peak sun hours for Bangladesh (~4.5–5h/day). Bangladesh-market
   * default per §68.
   */
  peakSunHours: 4.7,

  /**
   * Solar system efficiency — accounts for dust, temperature, wiring losses
   * and MPPT/controller losses.
   */
  solarDerating: 0.75,

  /** Default hours/day when an appliance spec has no explicit default. */
  defaultHoursPerDay: 6,

  /** Default surge factors by surge category (starting/startup current). */
  surgeFactors: {
    motor: 3,
    compressor: 4,
    heater: 1.3,
  } as Record<string, number>,

  /** Warning thresholds. */
  largeSystemLoadW: 3000, // total load above this → recommend a professional check
  veryLargeSystemAh: 800, // theoretical battery Ah above this → "very large system" warning
  unusualWattRatioHigh: 3, // user-edited watts above typical×this → unusual-value warning
  unusualWattRatioLow: 0.25, // user-edited watts below typical×this → unusual-value warning

  /** Battery voltage selection tiers: pick the lowest voltage whose practical
   *  capacity requirement fits, so small systems stay at familiar 12V. */
  batteryVoltageTiers: [
    { voltage: 12, maxAh: 260 },
    { voltage: 24, maxAh: 500 },
    { voltage: 48, maxAh: 1200 },
  ],

  /** Input limits (§39). */
  maxQuantity: 50,
  maxWatts: 50000,
  maxBackupHours: 24,
  maxHoursPerDay: 24,

  /** Engine version — bump when formulas change (§45). */
  engineVersion: "1.0.0",
} as const;

export type Assumptions = typeof ASSUMPTIONS;
export type SurgeCategory = keyof Assumptions["surgeFactors"];