import { describe, expect, it } from "vitest";
import {
  ampsToWatts,
  vaToWatts,
  wattsToAmps,
  wattsToVa,
} from "@/domain/calculations/converters";

describe("wattsToAmps", () => {
  it("1000W at 220V resistive = 4.55A", () => {
    expect(wattsToAmps({ value: 1000, volts: 220, powerFactor: 1 })).toBeCloseTo(4.545, 2);
  });

  it("1500W at 220V with PF 0.8 ≈ 8.52A", () => {
    expect(wattsToAmps({ value: 1500, volts: 220, powerFactor: 0.8 })).toBeCloseTo(8.523, 2);
  });

  it("12V DC: 75W ÷ 12V = 6.25A", () => {
    expect(wattsToAmps({ value: 75, volts: 12, powerFactor: 1 })).toBeCloseTo(6.25, 2);
  });

  it("returns 0 for invalid input", () => {
    expect(wattsToAmps({ value: 0, volts: 220, powerFactor: 1 })).toBe(0);
    expect(wattsToAmps({ value: 100, volts: 0, powerFactor: 1 })).toBe(0);
  });
});

describe("ampsToWatts", () => {
  it("5A at 220V resistive = 1100W", () => {
    expect(ampsToWatts({ value: 5, volts: 220, powerFactor: 1 })).toBeCloseTo(1100, 1);
  });

  it("10A at 12V = 120W", () => {
    expect(ampsToWatts({ value: 10, volts: 12, powerFactor: 1 })).toBe(120);
  });
});

describe("vaToWatts / wattsToVa", () => {
  it("1000VA × 0.8 PF = 800W", () => {
    expect(vaToWatts(1000, 0.8)).toBe(800);
  });

  it("600W ÷ 0.8 = 750VA", () => {
    expect(wattsToVa(600, 0.8)).toBeCloseTo(750, 1);
  });
});