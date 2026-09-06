import { describe, expect, it } from "vitest";
import { calculate, defaultSettings } from "@/domain/calculations/recommendations";
import type { ApplianceInput, CalculationInput } from "@/domain/calculations/types";

const appliance = (over: Partial<ApplianceInput> = {}): ApplianceInput => ({
  id: "x",
  name: "X",
  watts: 100,
  quantity: 1,
  hoursPerDay: 6,
  ...over,
});

function input(over: Partial<CalculationInput> = {}): CalculationInput {
  return {
    appliances: [],
    backupHours: 2,
    tier: "recommended",
    settings: defaultSettings(),
    ...over,
  };
}

describe("calculate (§56 reference scenario)", () => {
  const scenario = input({
    appliances: [
      appliance({ id: "ceiling-fan", name: "Ceiling Fan", watts: 75, quantity: 3, hoursPerDay: 8, typicalWatts: 75 }),
      appliance({ id: "led-bulb", name: "LED Bulb", watts: 9, quantity: 5, hoursPerDay: 6, typicalWatts: 9 }),
      appliance({ id: "led-tv", name: "LED TV", watts: 60, quantity: 1, hoursPerDay: 5, typicalWatts: 60 }),
      appliance({ id: "wifi-router", name: "WiFi Router", watts: 10, quantity: 1, hoursPerDay: 24, typicalWatts: 10 }),
      appliance({ id: "cctv-camera", name: "CCTV Camera", watts: 8, quantity: 4, hoursPerDay: 24, typicalWatts: 8 }),
    ],
    backupHours: 2,
  });

  it("computes total load, daily energy and backup energy", () => {
    const r = calculate(scenario);
    expect(r.totalLoadW).toBe(372);
    expect(r.dailyEnergyWh).toBe(3378);
    expect(r.backupEnergyWh).toBeCloseTo(972.5, 0); // DC stored energy for 2h backup
  });

  it("recommends 12V 110Ah battery, 600VA IPS, 1000W solar", () => {
    const r = calculate(scenario);
    expect(r.battery.practical.label).toBe("12V 110Ah");
    expect(r.inverter.label).toBe("600VA");
    expect(r.solar.recommendedWatts).toBe(1000);
  });

  it("produces no scary warnings for a normal scenario", () => {
    const r = calculate(scenario);
    expect(r.warnings).toEqual([]);
  });

  it("records engine and assumption versions for auditability (§45)", () => {
    const r = calculate(scenario);
    expect(r.engineVersion).toMatch(/^\d+\.\d+\.\d+$/);
    expect(r.assumptionsVersion).toMatch(/^\d+\.\d+\.\d+$/);
    expect(r.input).toEqual(scenario);
  });
});

describe("calculate — edge cases (§62)", () => {
  it("handles no appliances gracefully", () => {
    const r = calculate(input());
    expect(r.totalLoadW).toBe(0);
    expect(r.dailyEnergyWh).toBe(0);
    expect(r.warnings).toEqual([]);
    expect(r.battery.practical.capacityAh).toBeGreaterThanOrEqual(0);
  });

  it("warns about surge appliances (refrigerator/pump)", () => {
    const r = calculate(
      input({
        appliances: [
          appliance({
            id: "refrigerator",
            name: "Refrigerator",
            watts: 150,
            quantity: 1,
            hoursPerDay: 8,
            typicalWatts: 150,
            surgeCategory: "compressor",
          }),
        ],
      }),
    );
    const surge = r.warnings.find((w) => w.code === "surge");
    expect(surge).toBeDefined();
    expect(surge?.applianceNames).toEqual(["Refrigerator"]);
  });

  it("warns about a very large system", () => {
    const r = calculate(
      input({
        appliances: [
          appliance({ id: "ac", name: "AC", watts: 4000, quantity: 1, hoursPerDay: 8, typicalWatts: 4000 }),
        ],
        backupHours: 12,
      }),
    );
    const codes = r.warnings.map((w) => w.code);
    expect(codes).toContain("very-large-system");
  });

  it("warns about unusually high edited wattage", () => {
    const r = calculate(
      input({
        appliances: [
          appliance({ id: "led-bulb", name: "LED Bulb", watts: 200, quantity: 1, hoursPerDay: 6, typicalWatts: 9 }),
        ],
      }),
    );
    const unusual = r.warnings.find((w) => w.code === "unusual-wattage");
    expect(unusual).toBeDefined();
    expect(unusual?.data?.direction).toBe("high");
  });

  it("sizes differently for different backup durations", () => {
    const withLoad = { appliances: [appliance({ watts: 100, quantity: 1 })] };
    const r2 = calculate(input({ ...withLoad, backupHours: 2 }));
    const r6 = calculate(input({ ...withLoad, backupHours: 6 }));
    expect(r6.battery.practical.capacityAh).toBeGreaterThan(r2.battery.practical.capacityAh);
    expect(r6.inverter.recommendedVA).toBe(r2.inverter.recommendedVA); // load unchanged
  });

  it("honours custom wattage and hours", () => {
    const r = calculate(
      input({
        appliances: [
          appliance({ id: "custom:My Fan", name: "My Fan", watts: 85, quantity: 2, hoursPerDay: 8 }),
        ],
      }),
    );
    expect(r.totalLoadW).toBe(170);
    expect(r.dailyEnergyWh).toBe(1360);
  });

  it("stays deterministic", () => {
    const a = calculate(scenarioForDeterminism());
    const b = calculate(scenarioForDeterminism());
    expect(a).toEqual(b);
  });
});

function scenarioForDeterminism(): CalculationInput {
  return input({
    appliances: [
      appliance({ id: "fan", name: "Fan", watts: 75, quantity: 2, hoursPerDay: 8, typicalWatts: 75 }),
      appliance({ id: "pump", name: "Pump", watts: 750, quantity: 1, hoursPerDay: 1, typicalWatts: 750, surgeCategory: "motor" }),
    ],
    backupHours: 4,
    tier: "heavy",
  });
}