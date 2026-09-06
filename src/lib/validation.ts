/**
 * Validation & normalization (§39).
 *
 * The UI never shows raw numbers straight into the engine — values pass
 * through here first. Issues carry a message key + params so the UI can
 * render friendly copy in the active language. Blocking issues prevent
 * calculation; warnings allow it but are shown to the user.
 */

import { ASSUMPTIONS } from "@/domain/config/assumptions";

export interface ValidationIssue {
  /** Stable code for the issue. */
  code: string;
  /** Message dictionary key. */
  key: string;
  /** Interpolation params for the message. */
  params?: Record<string, string | number>;
  /** True when the value must be fixed before calculating. */
  blocking: boolean;
}

export interface ApplianceEditable {
  watts: number;
  quantity: number;
  hoursPerDay: number;
  typicalWatts?: number;
}

export function validateQuantity(quantity: number): ValidationIssue | null {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return {
      code: "quantity-min",
      key: "err.quantity",
      params: { max: ASSUMPTIONS.maxQuantity },
      blocking: true,
    };
  }
  if (quantity > ASSUMPTIONS.maxQuantity) {
    return {
      code: "quantity-max",
      key: "err.quantity",
      params: { max: ASSUMPTIONS.maxQuantity },
      blocking: true,
    };
  }
  return null;
}

export function validateWatts(a: ApplianceEditable): ValidationIssue | null {
  if (!Number.isFinite(a.watts) || a.watts <= 0) {
    return { code: "watts", key: "err.watts", blocking: true };
  }
  if (a.watts > ASSUMPTIONS.maxWatts) {
    return {
      code: "watts-max",
      key: "err.watts",
      params: { max: ASSUMPTIONS.maxWatts },
      blocking: true,
    };
  }
  return null;
}

export function validateHoursPerDay(hours: number): ValidationIssue | null {
  if (!Number.isFinite(hours) || hours < 0 || hours > ASSUMPTIONS.maxHoursPerDay) {
    return { code: "hours", key: "err.hours", blocking: true };
  }
  return null;
}

export function validateBackupHours(hours: number): ValidationIssue | null {
  if (!Number.isFinite(hours) || hours < 0.5 || hours > ASSUMPTIONS.maxBackupHours) {
    return { code: "backup", key: "err.backup", blocking: true };
  }
  return null;
}

/** All blocking/non-blocking issues for one appliance row. */
export function validateAppliance(
  a: ApplianceEditable,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const q = validateQuantity(a.quantity);
  const w = validateWatts(a);
  const h = validateHoursPerDay(a.hoursPerDay);
  if (q) issues.push(q);
  if (w) issues.push(w);
  if (h) issues.push(h);

  // Unusual-value warnings (§39) — informational, never blocking.
  if (a.typicalWatts && a.typicalWatts > 0 && a.watts > 0) {
    const ratio = a.watts / a.typicalWatts;
    if (ratio > ASSUMPTIONS.unusualWattRatioHigh) {
      issues.push({
        code: "watts-unusual-high",
        key: "warn.unusualHigh",
        params: { value: a.watts },
        blocking: false,
      });
    } else if (ratio < ASSUMPTIONS.unusualWattRatioLow) {
      issues.push({
        code: "watts-unusual-low",
        key: "warn.unusualLow",
        params: { value: a.watts },
        blocking: false,
      });
    }
  }
  return issues;
}

/** Normalize a raw number input (e.g. from a text field). */
export function toNumber(raw: string): number {
  const n = Number(raw.trim().replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}