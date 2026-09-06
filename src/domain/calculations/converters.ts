/**
 * Unit-conversion math for the SEO converter tools (§72 easy wins).
 * Pure functions — no UI. Inputs that are missing/zero return 0 rather than
 * throwing so the UI can treat empty fields as "no result yet".
 */

export interface AcInput {
  value: number;
  volts: number;
  /** Power factor (0–1). 1.0 for resistive loads, ~0.7–0.9 for others. */
  powerFactor: number;
}

function safe(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Single-phase AC: A = W ÷ (V × PF). */
export function wattsToAmps({ value, volts, powerFactor }: AcInput): number {
  const denominator = safe(volts) * safe(powerFactor);
  return denominator > 0 ? safe(value) / denominator : 0;
}

/** Single-phase AC: W = A × V × PF. */
export function ampsToWatts({ value, volts, powerFactor }: AcInput): number {
  return safe(value) * safe(volts) * safe(powerFactor);
}

/** W = VA × PF (IPS/inverter labels are in VA). */
export function vaToWatts(value: number, powerFactor: number): number {
  return safe(value) * safe(powerFactor);
}

/** VA = W ÷ PF — useful for "what VA class do I need". */
export function wattsToVa(value: number, powerFactor: number): number {
  const pf = safe(powerFactor);
  return pf > 0 ? safe(value) / pf : 0;
}