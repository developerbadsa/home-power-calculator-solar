import { describe, expect, it } from "vitest";
import { nextVaClass, sizeInverter } from "@/domain/calculations/inverter";
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

describe("nextVaClass", () => {
  it("rounds up to the nearest standard class", () => {
    expect(nextVaClass(0)).toBe(150);
    expect(nextVaClass(149)).toBe(150);
    expect(nextVaClass(150)).toBe(150);
    expect(nextVaClass(151)).toBe(250);
    expect(nextVaClass(558)).toBe(600);
    expect(nextVaClass(750)).toBe(800);
    expect(nextVaClass(975)).toBe(1000);
  });

  it("caps at the largest class", () => {
    expect(nextVaClass(100000)).toBe(10000);
  });
});

describe("sizeInverter", () => {
  it("known vector: 372W load → 558VA running → 600VA recommendation", () => {
    const list = [appliance({ watts: 372, quantity: 1 })];
    const result = sizeInverter(list, settings);
    expect(result.runningVA).toBeCloseTo(558, 0);
    expect(result.recommendedVA).toBe(600);
    expect(result.label).toBe("600VA");
  });

  it("applies the safety margin and power factor", () => {
    // 500W × 1.2 ÷ 0.8 = 750VA → 800VA class
    const result = sizeInverter([appliance({ watts: 500, quantity: 1 })], settings);
    expect(result.runningVA).toBeCloseTo(750, 1);
    expect(result.recommendedVA).toBe(800);
  });

  it("flags surge advisories when starting power exceeds the recommendation", () => {
    const fridge = appliance({
      id: "refrigerator",
      name: "Refrigerator",
      watts: 150,
      quantity: 1,
      surgeCategory: "compressor",
    });
    const result = sizeInverter([fridge], settings);
    // running 225VA → 250VA; peak 600W → 750VA
    expect(result.recommendedVA).toBe(250);
    expect(result.peakVA).toBeCloseTo(750, 0);
    expect(result.surgeAdvised).toBe(true);
    expect(result.surgeSuggestedVA).toBe(800);
  });

  it("does not flag surge when starting power stays within the recommendation", () => {
    const microwave = appliance({
      id: "microwave",
      name: "Microwave",
      watts: 1200,
      quantity: 1,
      surgeCategory: "heater",
    });
    const result = sizeInverter([microwave], settings);
    // running 1800VA → 2000VA class; peak 1560W → 1950VA < 2000VA
    expect(result.recommendedVA).toBe(2000);
    expect(result.surgeAdvised).toBe(false);
  });

  it("returns a sane result with no appliances", () => {
    const result = sizeInverter([], settings);
    expect(result.recommendedVA).toBe(150);
    expect(result.surgeAdvised).toBe(false);
  });
});