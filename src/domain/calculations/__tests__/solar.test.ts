import { describe, expect, it } from "vitest";
import { panelCombinations, sizeSolar } from "@/domain/calculations/solar";
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

describe("sizeSolar", () => {
  it("known vector: 3378Wh/day → ~958W target → 1000W recommendation", () => {
    const list = [
      appliance({ id: "fan", name: "Fan", watts: 75, quantity: 3, hoursPerDay: 8 }),
      appliance({ id: "bulb", name: "Bulb", watts: 9, quantity: 5, hoursPerDay: 6 }),
      appliance({ id: "tv", name: "TV", watts: 60, quantity: 1, hoursPerDay: 5 }),
      appliance({ id: "router", name: "Router", watts: 10, quantity: 1, hoursPerDay: 24 }),
      appliance({ id: "cctv", name: "CCTV", watts: 8, quantity: 4, hoursPerDay: 24 }),
    ];
    const result = sizeSolar(list, 2, settings);
    // daily 3378 ÷ (4.7 × 0.75) ≈ 958.3
    expect(result.targetWatts).toBeCloseTo(958.3, 0);
    expect(result.recommendedWatts).toBe(1000);
    expect(result.combos.length).toBeGreaterThan(0);
    for (const combo of result.combos) {
      expect(combo.totalWatts).toBeGreaterThanOrEqual(result.targetWatts);
    }
  });

  it("covers the battery recharge requirement when it exceeds daily use", () => {
    // Big backup vs small daily use: recharge term should win.
    const list = [appliance({ id: "router", name: "Router", watts: 10, quantity: 1, hoursPerDay: 24 })];
    const result = sizeSolar(list, 24, settings);
    const dailySolar = (10 * 24) / (4.7 * 0.75);
    const rechargeSolar = (10 * 24) / (0.9 * 0.85) / (4.7 * 0.75);
    expect(result.targetWatts).toBeCloseTo(Math.max(dailySolar, rechargeSolar), 0);
  });

  it("returns zero solar for no appliances", () => {
    const result = sizeSolar([], 2, settings);
    expect(result.recommendedWatts).toBe(0);
    expect(result.combos).toEqual([]);
  });
});

describe("panelCombinations", () => {
  it("produces example combinations covering the target (§23)", () => {
    const combos = panelCombinations(600);
    expect(combos.length).toBeGreaterThan(0);
    expect(combos.length).toBeLessThanOrEqual(3);
    for (const c of combos) {
      expect(c.totalWatts).toBeGreaterThanOrEqual(600);
    }
  });

  it("prefers the lowest-waste combination first", () => {
    const combos = panelCombinations(958.3);
    // 3 × 330W = 990W is the least waste
    expect(combos[0]).toMatchObject({ panels: 3, panelWatts: 330 });
  });

  it("is deterministic", () => {
    expect(panelCombinations(1234)).toEqual(panelCombinations(1234));
  });
});