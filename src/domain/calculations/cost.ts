/**
 * Approximate Bangladesh market cost estimation (2025).
 *
 * Prices are ranges in BDT (Bangladeshi Taka) and serve as rough guides.
 * The calculator shows ranges, never exact prices.
 *
 * Sources: popular retail sites, bsl-battery.com, local market surveys.
 */

/** Battery cost per Ah (12V lead-acid, mid-range brand) in BDT */
const BATTERY_PER_AH = { min: 12, max: 20 };

/** IPS/inverter cost per VA (mid-range brand) in BDT */
const INVERTER_PER_VA = { min: 4, max: 7 };

/** Solar panel cost per watt (mid-range polycrystalline/monocrystalline) in BDT */
const SOLAR_PER_WATT = { min: 50, max: 80 };

export interface CostRange {
  min: number;
  max: number;
}

export interface CostEstimate {
  battery: CostRange;
  inverter: CostRange;
  solar: CostRange;
  total: CostRange;
}

function roundBDT(n: number): number {
  // Round to nearest 500 BDT for clean numbers
  return Math.round(n / 500) * 500;
}

export function estimateCost(params: {
  batteryAh: number;
  batteryVoltage: number;
  inverterVA: number;
  solarWatts: number;
}): CostEstimate {
  const { batteryAh, batteryVoltage, inverterVA, solarWatts } = params;

  const numBatteries = Math.ceil(batteryVoltage / 12);
  const totalBatteryAh = batteryAh * numBatteries;

  const batteryCost = {
    min: roundBDT(totalBatteryAh * BATTERY_PER_AH.min),
    max: roundBDT(totalBatteryAh * BATTERY_PER_AH.max),
  };

  const inverterCost = {
    min: roundBDT(inverterVA * INVERTER_PER_VA.min),
    max: roundBDT(inverterVA * INVERTER_PER_VA.max),
  };

  const solarCost = {
    min: roundBDT(solarWatts * SOLAR_PER_WATT.min),
    max: roundBDT(solarWatts * SOLAR_PER_WATT.max),
  };

  const total = {
    min: batteryCost.min + inverterCost.min + solarCost.min,
    max: batteryCost.max + inverterCost.max + solarCost.max,
  };

  return { battery: batteryCost, inverter: inverterCost, solar: solarCost, total };
}

/** Format a BDT range for display — "৳8,000 – ৳12,000" */
export function formatBDT(range: CostRange): string {
  const fmt = (n: number) => n.toLocaleString("en-BD");
  if (range.min === range.max) return `৳${fmt(range.min)}`;
  return `৳${fmt(range.min)} – ৳${fmt(range.max)}`;
}

/** Format a single BDT value */
export function formatBDTSingle(n: number): string {
  return `৳${n.toLocaleString("en-BD")}`;
}
