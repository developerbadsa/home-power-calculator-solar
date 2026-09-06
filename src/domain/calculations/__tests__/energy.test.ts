import { describe, expect, it } from "vitest";
import {
  backupEnergyWh,
  batteryEnergyWh,
  dailyEnergyWh,
} from "@/domain/calculations/energy";
import { defaultSettings } from "@/domain/calculations/recommendations";
import type { ApplianceInput } from "@/domain/calculations/types";

const a = (over: Partial<ApplianceInput> = {}): ApplianceInput => ({
  id: "x",
  name: "X",
  watts: 100,
  quantity: 1,
  hoursPerDay: 6,
  ...over,
});

describe("dailyEnergyWh", () => {
  it("is 0 with no appliances", () => {
    expect(dailyEnergyWh([])).toBe(0);
  });

  it("computes watts × quantity × hours", () => {
    expect(dailyEnergyWh([a({ watts: 100, quantity: 2, hoursPerDay: 5 })])).toBe(1000);
  });

  it("sums across appliances (24h router + 6h fan)", () => {
    const list = [
      a({ id: "router", watts: 10, quantity: 1, hoursPerDay: 24 }),
      a({ id: "fan", watts: 75, quantity: 3, hoursPerDay: 8 }),
    ];
    expect(dailyEnergyWh(list)).toBe(240 + 1800);
  });
});

describe("backup / battery energy", () => {
  it("backup energy is load × hours", () => {
    const list = [a({ watts: 500, quantity: 1 })];
    expect(backupEnergyWh(list, 2)).toBe(1000);
  });

  it("battery energy accounts for inverter and battery efficiency", () => {
    const settings = defaultSettings(); // inv 0.9, batt 0.85
    const list = [a({ watts: 372, quantity: 1 })];
    // 372 × 2h ÷ (0.9 × 0.85) = 744 ÷ 0.765 ≈ 972.55
    expect(batteryEnergyWh(list, 2, settings)).toBeCloseTo(972.549, 2);
  });
});