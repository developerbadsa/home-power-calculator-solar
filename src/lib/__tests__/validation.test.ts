import { describe, expect, it } from "vitest";
import {
  toNumber,
  validateAppliance,
  validateBackupHours,
} from "@/lib/validation";

describe("validateAppliance", () => {
  it("rejects negative quantity", () => {
    const issues = validateAppliance({ watts: 75, quantity: 0, hoursPerDay: 8, typicalWatts: 75 });
    expect(issues.some((i) => i.blocking && i.code === "quantity-min")).toBe(true);
  });

  it("rejects negative or zero watts", () => {
    const issues = validateAppliance({ watts: -5, quantity: 1, hoursPerDay: 8 });
    expect(issues.some((i) => i.blocking && i.code === "watts")).toBe(true);
  });

  it("rejects hours above 24", () => {
    const issues = validateAppliance({ watts: 75, quantity: 1, hoursPerDay: 30 });
    expect(issues.some((i) => i.blocking && i.code === "hours")).toBe(true);
  });

  it("accepts a normal row without issues", () => {
    const issues = validateAppliance({ watts: 75, quantity: 3, hoursPerDay: 8, typicalWatts: 75 });
    expect(issues).toEqual([]);
  });

  it("warns (non-blocking) on unusually high wattage", () => {
    const issues = validateAppliance({ watts: 200, quantity: 1, hoursPerDay: 6, typicalWatts: 9 });
    const warn = issues.find((i) => i.code === "watts-unusual-high");
    expect(warn).toBeDefined();
    expect(warn?.blocking).toBe(false);
  });

  it("warns (non-blocking) on unusually low wattage", () => {
    const issues = validateAppliance({ watts: 1, quantity: 1, hoursPerDay: 6, typicalWatts: 9 });
    const warn = issues.find((i) => i.code === "watts-unusual-low");
    expect(warn).toBeDefined();
    expect(warn?.blocking).toBe(false);
  });
});

describe("validateBackupHours", () => {
  it("rejects values outside 0.5–24", () => {
    expect(validateBackupHours(0.25)?.blocking).toBe(true);
    expect(validateBackupHours(25)?.blocking).toBe(true);
    expect(validateBackupHours(2)).toBeNull();
  });
});

describe("toNumber", () => {
  it("parses plain and comma-grouped numbers", () => {
    expect(toNumber("85")).toBe(85);
    expect(toNumber("1,200")).toBe(1200);
    expect(toNumber("abc")).toBe(0);
  });
});