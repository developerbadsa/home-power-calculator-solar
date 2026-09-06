import { describe, expect, it } from "vitest";
import {
  hasSurgeAppliances,
  peakLoadW,
  surgeApplianceNames,
  totalLoadW,
} from "@/domain/calculations/load";
import type { ApplianceInput } from "@/domain/calculations/types";

const fan = (over: Partial<ApplianceInput> = {}): ApplianceInput => ({
  id: "ceiling-fan",
  name: "Ceiling Fan",
  watts: 75,
  quantity: 1,
  hoursPerDay: 8,
  typicalWatts: 75,
  ...over,
});

describe("totalLoadW", () => {
  it("is 0 with no appliances", () => {
    expect(totalLoadW([])).toBe(0);
  });

  it("sums watts × quantity for one appliance", () => {
    expect(totalLoadW([fan({ watts: 75, quantity: 3 })])).toBe(225);
  });

  it("sums multiple appliances", () => {
    const list = [
      fan({ watts: 75, quantity: 3 }),
      fan({ id: "led-bulb", name: "LED Bulb", watts: 9, quantity: 5, hoursPerDay: 6, typicalWatts: 9 }),
    ];
    expect(totalLoadW(list)).toBe(225 + 45);
  });

  it("is deterministic", () => {
    const a = [fan(), fan({ id: "tv", name: "TV", watts: 60, quantity: 1, hoursPerDay: 5 })];
    expect(totalLoadW(a)).toBe(totalLoadW([...a].reverse()));
  });
});

describe("surge calculations", () => {
  it("peak load multiplies surge appliances by their surge factor", () => {
    const fridge = fan({
      id: "refrigerator",
      name: "Refrigerator",
      watts: 150,
      quantity: 1,
      surgeCategory: "compressor",
    });
    // compressor default factor = 4
    expect(peakLoadW([fridge])).toBe(600);
  });

  it("honours a per-appliance surge factor override", () => {
    const mixer = fan({
      id: "mixer",
      name: "Mixer",
      watts: 500,
      quantity: 1,
      surgeCategory: "motor",
      surgeFactor: 2,
    });
    expect(peakLoadW([mixer])).toBe(1000);
  });

  it("counts non-surge appliances at running watts in the peak", () => {
    const list = [
      fan({ watts: 75, quantity: 2 }),
      fan({
        id: "pump",
        name: "Pump",
        watts: 400,
        quantity: 1,
        surgeCategory: "motor",
      }),
    ];
    expect(peakLoadW(list)).toBe(75 * 2 + 400 * 3);
  });

  it("detects surge appliances and returns their names", () => {
    const list = [
      fan(),
      fan({ id: "pump", name: "Water Pump", watts: 400, quantity: 1, surgeCategory: "motor" }),
    ];
    expect(hasSurgeAppliances(list)).toBe(true);
    expect(surgeApplianceNames(list)).toEqual(["Water Pump"]);
    expect(hasSurgeAppliances([fan()])).toBe(false);
  });
});