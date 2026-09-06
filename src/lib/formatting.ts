/**
 * Formatting helpers (§17, §46): the engine returns raw numbers; the UI
 * formats them. Numbers use plain Western digits with simple grouping —
 * familiar in Bangladesh for technical values — while labels stay localized.
 */

/** 1234.56 → "1,235" */
export function formatNumber(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
}

/** Watts — always an integer for display. */
export function formatWatts(w: number): string {
  return `${formatNumber(Math.round(w))} W`;
}

/** Energy: Wh for smaller values, kWh for larger (§17). */
export function formatEnergy(wh: number): string {
  if (wh >= 1000) {
    const kwh = wh / 1000;
    return `${formatNumber(kwh, kwh >= 100 ? 0 : 1)} kWh`;
  }
  return `${formatNumber(Math.round(wh))} Wh`;
}

/** Ah — one decimal when fractional. */
export function formatAh(ah: number): string {
  return `${formatNumber(ah, ah < 10 && ah % 1 !== 0 ? 1 : 0)} Ah`;
}

/** VA — integer. */
export function formatVa(va: number): string {
  return `${formatNumber(va)} VA`;
}

/** Hours — friendly decimals (0.5, 1.5…). */
export function formatHours(h: number): string {
  return `${formatNumber(h, h % 1 === 0 ? 0 : 1)}h`;
}