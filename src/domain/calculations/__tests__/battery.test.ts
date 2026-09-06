import { describe, expect, it } from "vitest";
import { sizeBattery } from "@/domain/calculations/battery";
import { defaultSettings } from "@/domain/calculations/recommendations";
import type { ApplianceInput } from "@/domain/calculations/types";

const appliance = (over: Partial<ApplianceInput> = {}): ApplianceInput => ({
  id: "x",
  name: "X",
  watts: 100,
  quantity: 1,
  hoursPerDay: 6,
  ...over,
});

const settings = defaultSettings();

describe("sizeBattery", () => {
  it("sizes for a known vector: 372W load, 2h backup → ~101Ah theoretical, 110Ah practical", () => {
    const list = [
      appliance({ id: "fan", name: "Fan", watts: 75, quantity: 3, hoursPerDay: 8, typicalWatts: 75 }),
      appliance({ id: "bulb", name: "Bulb", watts: 9, quantity: 5, hoursPerDay: 6, typicalWatts: 9 }),
      appliance({ id: "tv", name: "TV", watts: 60, quantity: 1, hoursPerDay: 5, typicalWatts: 60 }),
      appliance({ id: "router", name: "Router", watts: 10, quantity: 1, hoursPerDay: 24, typicalWatts: 10 }),
      appliance({ id: "cctv", name: "CCTV", watts: 8, quantity: 4, hoursPerDay: 24, typicalWatts: 8 }),
    ];
    const result = sizeBattery(list, 2, "recommended", settings);
    // 372 × 2 ÷ 0.765 ÷ 0.8 = 1215.69 Wh purchased → ÷12V = 101.3Ah
    expect(result.theoreticalAh).toBeCloseTo(101.3, 0);
    expect(result.systemVoltage).toBe(12);
    expect(result.practical.capacityAh).toBe(110);
    expect(result.practical.label).toBe("12V 110Ah");
    expect(result.practical.estimatedBackupHours).toBeGreaterThan(2);
  });

  it("always rounds up to a practical size, never below the requirement", () => {
    const result = sizeBattery([appliance({ watts: 100, quantity: 1 })], 2, "recommended", settings);
    // theoretical ≈ 27.2Ah → practical 35Ah
    expect(result.theoreticalAh).toBeCloseTo(27.23, 1);
    expect(result.practical.capacityAh).toBe(35);
  });

  it("picks 12V for small systems and 24V when 12V would need >260Ah", () => {
    const small = sizeBattery([appliance({ watts: 300, quantity: 1 })], 4, "recommended", settings);
    // purchased = 300×4 ÷ 0.765 ÷ 0.8 = 1960.8Wh → 163.4Ah @12V → 12V
    expect(small.systemVoltage).toBe(12);

    const big = sizeBattery([appliance({ watts: 600, quantity: 1 })], 6, "recommended", settings);
    // purchased = 600×6 ÷ 0.765 ÷ 0.8 = 5882Wh → 490Ah @12V (>260) → 24V → 245Ah
    expect(big.systemVoltage).toBe(24);
    expect(big.theoreticalAh).toBeCloseTo(245.1, 0);
    expect(big.practical.capacityAh).toBe(250);
    expect(big.practical.label).toBe("24V 250Ah");
  });

  it("moves to 48V for very large systems", () => {
    const huge = sizeBattery([appliance({ watts: 1500, quantity: 1 })], 8, "recommended", settings);
    // purchased = 1500×8 ÷ 0.765 ÷ 0.8 = 19607.8Wh → 1634Ah @12V → 817Ah @24V (>500) → 48V → 408.5Ah
    expect(huge.systemVoltage).toBe(48);
    expect(huge.theoreticalAh).toBeCloseTo(408.5, 0);
    expect(huge.practical.capacityAh).toBeGreaterThanOrEqual(huge.theoreticalAh);
  });

  it("uses parallel strings when no single battery is large enough", () => {
    const result = sizeBattery([appliance({ watts: 800, quantity: 1 })], 6, "recommended", settings);
    // purchased = 800×6 ÷ 0.765 ÷ 0.8 = 7843Wh → 24V → 326.8Ah → needs parallel
    expect(result.systemVoltage).toBe(24);
    expect(result.practical.capacityAh).toBeGreaterThanOrEqual(326.8);
    expect(result.practical.configuration).toMatch(/\d+ × \d+Ah parallel/);
  });

  it("applies tier multipliers: budget < recommended < heavy", () => {
    const list = [appliance({ watts: 100, quantity: 1 })];
    const budget = sizeBattery(list, 2, "budget", settings);
    const recommended = sizeBattery(list, 2, "recommended", settings);
    const heavy = sizeBattery(list, 2, "heavy", settings);
    expect(budget.practical.capacityAh).toBeLessThan(recommended.practical.capacityAh);
    expect(recommended.practical.capacityAh).toBeLessThanOrEqual(heavy.practical.capacityAh);
  });

  it("offers at least one alternative configuration", () => {
    const result = sizeBattery([appliance({ watts: 200, quantity: 1 })], 3, "recommended", settings);
    expect(result.alternatives.length).toBeGreaterThan(0);
  });

  it("returns a sane result with no appliances", () => {
    const result = sizeBattery([], 2, "recommended", settings);
    expect(result.theoreticalAh).toBe(0);
    expect(result.practical.capacityAh).toBeGreaterThanOrEqual(0);
    expect(result.systemVoltage).toBe(12);
  });
});