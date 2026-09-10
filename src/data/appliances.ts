/**
 * Central appliance catalog (§10). Data only — no UI, no formulas.
 * Calibrated for the Bangladesh market (§68): typical wattages and hours
 * reflect what a normal Bangladeshi home or shop actually uses.
 *
 * - `typicalWatts` is the auto-filled value ("typical power", §7).
 * - `minWatts` / `maxWatts` define the sane editable range.
 * - `defaultHoursPerDay` pre-fills "how many hours per day" (§10).
 * - `surgeCategory` marks motors/compressors so the engine can warn (§21).
 */

export type ApplianceCategory =
  | "fan"
  | "light"
  | "entertainment"
  | "kitchen"
  | "cooling"
  | "electronics"
  | "security"
  | "pump"
  | "office"
  | "other";

export interface ApplianceSpec {
  id: string;
  name: string;
  nameBn: string;
  category: ApplianceCategory;
  typicalWatts: number;
  minWatts: number;
  maxWatts: number;
  defaultHoursPerDay: number;
  surgeCategory?: "motor" | "compressor" | "heater";
  surgeFactor?: number;
  note?: string;
  noteBn?: string;
  active: boolean;
}

export const CATEGORY_LABELS: Record<ApplianceCategory, { en: string; bn: string }> = {
  fan: { en: "Fans", bn: "ফ্যান" },
  light: { en: "Lights", bn: "লাইট / বাতি" },
  entertainment: { en: "TV & Entertainment", bn: "টিভি ও বিনোদন" },
  kitchen: { en: "Kitchen", bn: "রান্নাঘর" },
  cooling: { en: "Cooling / AC", bn: "কুলিং / এসি" },
  electronics: { en: "Electronics", bn: "ইলেকট্রনিক্স" },
  security: { en: "Security / CCTV", bn: "নিরাপত্তা / সিসিটিভি" },
  pump: { en: "Motor & Pump", bn: "মোটর ও পাম্প" },
  office: { en: "Office", bn: "অফিস" },
  other: { en: "Other", bn: "অন্যান্য" },
};

export const APPLIANCES: ApplianceSpec[] = [
  // ── Fans ──────────────────────────────────────────────────────────────
  // BD market: big ceiling fans 75–85W, table/small fans 40–55W
  {
    id: "ceiling-fan",
    name: "Ceiling Fan",
    nameBn: "সিলিং ফ্যান",
    category: "fan",
    typicalWatts: 80,
    minWatts: 55,
    maxWatts: 120,
    defaultHoursPerDay: 8,
    active: true,
  },
  {
    id: "stand-fan",
    name: "Stand / Pedestal Fan",
    nameBn: "স্ট্যান্ড ফ্যান",
    category: "fan",
    typicalWatts: 60,
    minWatts: 45,
    maxWatts: 90,
    defaultHoursPerDay: 8,
    active: true,
  },
  {
    id: "wall-fan",
    name: "Wall Fan",
    nameBn: "ওয়াল ফ্যান",
    category: "fan",
    typicalWatts: 55,
    minWatts: 40,
    maxWatts: 75,
    defaultHoursPerDay: 8,
    active: true,
  },
  {
    id: "table-fan",
    name: "Table Fan",
    nameBn: "টেবিল ফ্যান",
    category: "fan",
    typicalWatts: 45,
    minWatts: 30,
    maxWatts: 65,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "exhaust-fan",
    name: "Exhaust Fan",
    nameBn: "এক্সস্ট ফ্যান",
    category: "fan",
    typicalWatts: 100,
    minWatts: 50,
    maxWatts: 150,
    defaultHoursPerDay: 4,
    active: true,
  },

  // ── Lights ────────────────────────────────────────────────────────────
  // BD market: common LED bulbs 12–20W, tubes 18–25W
  {
    id: "led-bulb",
    name: "LED Bulb",
    nameBn: "এলইডি বাল্ব",
    category: "light",
    typicalWatts: 18,
    minWatts: 8,
    maxWatts: 30,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "led-tube",
    name: "LED Tube Light",
    nameBn: "এলইডি টিউব লাইট",
    category: "light",
    typicalWatts: 22,
    minWatts: 15,
    maxWatts: 36,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "led-panel",
    name: "LED Panel Light",
    nameBn: "এলইডি প্যানেল লাইট",
    category: "light",
    typicalWatts: 40,
    minWatts: 24,
    maxWatts: 65,
    defaultHoursPerDay: 8,
    active: true,
  },
  {
    id: "cfl-bulb",
    name: "CFL Bulb",
    nameBn: "সিএফএল বাল্ব",
    category: "light",
    typicalWatts: 20,
    minWatts: 12,
    maxWatts: 32,
    defaultHoursPerDay: 5,
    active: true,
  },
  {
    id: "emergency-light",
    name: "Emergency / Inverter Light",
    nameBn: "ইনভার্টার লাইট / ইমার্জেন্সি লাইট",
    category: "light",
    typicalWatts: 7,
    minWatts: 4,
    maxWatts: 12,
    defaultHoursPerDay: 3,
    active: true,
  },

  // ── TV & Entertainment ────────────────────────────────────────────────
  // BD: 32" TVs very common (40–60W), 43" growing (70–100W)
  {
    id: "led-tv",
    name: "LED TV",
    nameBn: "এলইডি টিভি",
    category: "entertainment",
    typicalWatts: 55,
    minWatts: 35,
    maxWatts: 150,
    defaultHoursPerDay: 5,
    note: "Power varies with screen size — 32\" ≈ 40–60W, 43\" ≈ 70–100W.",
    noteBn: "স্ক্রিন সাইজ অনুযায়ী পাওয়ার ভিন্ন হয় — ৩২\" ≈ ৪০–৬০W, ৪৩\" ≈ ৭০–১০০W।",
    active: true,
  },
  {
    id: "sound-system",
    name: "Sound System / Home Theater",
    nameBn: "সাউন্ড সিস্টেম / হোম থিয়েটার",
    category: "entertainment",
    typicalWatts: 80,
    minWatts: 40,
    maxWatts: 200,
    defaultHoursPerDay: 2,
    active: true,
  },
  {
    id: "dth-box",
    name: "DTH / Cable Box",
    nameBn: "ডিটিএইচ / ক্যাবল বক্স",
    category: "entertainment",
    typicalWatts: 15,
    minWatts: 8,
    maxWatts: 25,
    defaultHoursPerDay: 6,
    active: true,
  },

  // ── Kitchen ───────────────────────────────────────────────────────────
  // BD: fridges 100–200W running, small freezers common
  {
    id: "refrigerator",
    name: "Refrigerator",
    nameBn: "রেফ্রিজারেটর / ফ্রিজ",
    category: "kitchen",
    typicalWatts: 150,
    minWatts: 80,
    maxWatts: 300,
    defaultHoursPerDay: 10,
    surgeCategory: "compressor",
    note: "Compressor cycles on/off. 120W is the running draw; compressor typically runs ~10h/day in BD heat.",
    noteBn: "কম্প্রেসার থেমে থেমে চলে। ১২০W চলমান পাওয়ার; বাংলাদেশের গরমে দিনে ~১০ ঘণ্টা চলে।",
    active: true,
  },
  {
    id: "deep-freezer",
    name: "Deep Freezer",
    nameBn: "ডিপ ফ্রিজার",
    category: "kitchen",
    typicalWatts: 180,
    minWatts: 120,
    maxWatts: 280,
    defaultHoursPerDay: 10,
    surgeCategory: "compressor",
    active: true,
  },
  {
    id: "rice-cooker",
    name: "Rice Cooker",
    nameBn: "রাইস কুকার",
    category: "kitchen",
    typicalWatts: 600,
    minWatts: 350,
    maxWatts: 900,
    defaultHoursPerDay: 1,
    active: true,
  },
  {
    id: "microwave",
    name: "Microwave Oven",
    nameBn: "মাইক্রোওয়েভ ওভেন",
    category: "kitchen",
    typicalWatts: 800,
    minWatts: 600,
    maxWatts: 1200,
    defaultHoursPerDay: 0.5,
    surgeCategory: "heater",
    active: true,
  },
  {
    id: "electric-kettle",
    name: "Electric Kettle",
    nameBn: "ইলেকট্রিক কেটলি",
    category: "kitchen",
    typicalWatts: 1500,
    minWatts: 1000,
    maxWatts: 2200,
    defaultHoursPerDay: 0.5,
    active: true,
  },
  {
    id: "electric-iron",
    name: "Electric Iron",
    nameBn: "ইলেকট্রিক ইস্ত্রি / প্রেস",
    category: "kitchen",
    typicalWatts: 1000,
    minWatts: 700,
    maxWatts: 1500,
    defaultHoursPerDay: 0.5,
    active: true,
  },
  {
    id: "mixer-grinder",
    name: "Mixer Grinder",
    nameBn: "মিক্সার / গ্রাইন্ডার",
    category: "kitchen",
    typicalWatts: 450,
    minWatts: 250,
    maxWatts: 750,
    defaultHoursPerDay: 0.5,
    surgeCategory: "motor",
    surgeFactor: 2,
    active: true,
  },
  {
    id: "water-purifier",
    name: "Water Purifier (RO)",
    nameBn: "ওয়াটার পিউরিফায়ার",
    category: "kitchen",
    typicalWatts: 35,
    minWatts: 25,
    maxWatts: 65,
    defaultHoursPerDay: 10,
    active: true,
  },
  {
    id: "washing-machine",
    name: "Washing Machine",
    nameBn: "ওয়াশিং মেশিন",
    category: "kitchen",
    typicalWatts: 500,
    minWatts: 300,
    maxWatts: 800,
    defaultHoursPerDay: 1,
    surgeCategory: "motor",
    active: true,
  },

  // ── Cooling / AC ──────────────────────────────────────────────────────
  // BD: split ACs very common, 1-ton ~1000–1400W running
  {
    id: "ac-1-ton",
    name: "Split AC (1 Ton, Inverter)",
    nameBn: "স্প্লিট এসি (১ টন, ইনভার্টার)",
    category: "cooling",
    typicalWatts: 1200,
    minWatts: 800,
    maxWatts: 1600,
    defaultHoursPerDay: 8,
    surgeCategory: "compressor",
    note: "1-ton split AC running power ~800–1400W depending on model and inverter tech.",
    noteBn: "১ টন স্প্লিট এসির চলমান পাওয়ার ~৮০০–১৪০০W (মডেল ও ইনভার্টার প্রযুক্তি ভেদে)।",
    active: true,
  },
  {
    id: "ac-1.5-ton",
    name: "Split AC (1.5 Ton, Inverter)",
    nameBn: "স্প্লিট এসি (১.৫ টন, ইনভার্টার)",
    category: "cooling",
    typicalWatts: 1800,
    minWatts: 1200,
    maxWatts: 2500,
    defaultHoursPerDay: 8,
    surgeCategory: "compressor",
    active: true,
  },

  // ── Electronics ───────────────────────────────────────────────────────
  // BD: most common laptops 45–65W chargers, routers 8–15W
  {
    id: "laptop",
    name: "Laptop",
    nameBn: "ল্যাপটপ",
    category: "electronics",
    typicalWatts: 55,
    minWatts: 35,
    maxWatts: 100,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "desktop-computer",
    name: "Desktop Computer",
    nameBn: "ডেস্কটপ কম্পিউটার",
    category: "electronics",
    typicalWatts: 200,
    minWatts: 100,
    maxWatts: 600,
    defaultHoursPerDay: 5,
    active: true,
  },
  {
    id: "wifi-router",
    name: "WiFi Router",
    nameBn: "ওয়াইফাই রাউটার",
    category: "electronics",
    typicalWatts: 20,
    minWatts: 8,
    maxWatts: 40,
    defaultHoursPerDay: 24,
    active: true,
  },
  {
    id: "mobile-charger",
    name: "Mobile Phone Charger",
    nameBn: "মোবাইল চার্জার",
    category: "electronics",
    typicalWatts: 15,
    minWatts: 5,
    maxWatts: 30,
    defaultHoursPerDay: 3,
    active: true,
  },

  // ── Security / CCTV ───────────────────────────────────────────────────
  // BD: analog cameras 5–10W, IP cameras 8–15W, DVRs 15–30W
  {
    id: "cctv-camera",
    name: "CCTV Camera",
    nameBn: "সিসিটিভি ক্যামেরা",
    category: "security",
    typicalWatts: 15,
    minWatts: 5,
    maxWatts: 30,
    defaultHoursPerDay: 24,
    active: true,
  },
  {
    id: "cctv-dvr",
    name: "CCTV DVR / Recorder",
    nameBn: "সিসিটিভি ডিভিআর / রেকর্ডার",
    category: "security",
    typicalWatts: 25,
    minWatts: 15,
    maxWatts: 45,
    defaultHoursPerDay: 24,
    active: true,
  },

  // ── Motor & Pump (§68: by HP) ─────────────────────────────────────────
  // BD: common monoblock pumps, 1HP ≈ 750W input, 0.5HP ≈ 400W
  {
    id: "water-pump-0.5hp",
    name: "Water Pump (0.5 HP)",
    nameBn: "ওয়াটার পাম্প (০.৫ এইচপি)",
    category: "pump",
    typicalWatts: 400,
    minWatts: 300,
    maxWatts: 550,
    defaultHoursPerDay: 1,
    surgeCategory: "motor",
    active: true,
  },
  {
    id: "water-pump-1hp",
    name: "Water Pump (1 HP)",
    nameBn: "ওয়াটার পাম্প (১ এইচপি)",
    category: "pump",
    typicalWatts: 750,
    minWatts: 600,
    maxWatts: 1000,
    defaultHoursPerDay: 1,
    surgeCategory: "motor",
    active: true,
  },
  {
    id: "water-pump-1.5hp",
    name: "Water Pump (1.5 HP)",
    nameBn: "ওয়াটার পাম্প (১.৫ এইচপি)",
    category: "pump",
    typicalWatts: 1100,
    minWatts: 900,
    maxWatts: 1500,
    defaultHoursPerDay: 1,
    surgeCategory: "motor",
    active: true,
  },

  // ── Office ────────────────────────────────────────────────────────────
  // BD: small sewing machines 80–150W, home printers 50–150W
  {
    id: "sewing-machine",
    name: "Sewing Machine (Electric)",
    nameBn: "সেলাই মেশিন (ইলেকট্রিক)",
    category: "office",
    typicalWatts: 100,
    minWatts: 60,
    maxWatts: 200,
    defaultHoursPerDay: 4,
    surgeCategory: "motor",
    surgeFactor: 2,
    active: true,
  },
  {
    id: "photocopier",
    name: "Photocopier",
    nameBn: "ফটোকপিয়ার",
    category: "office",
    typicalWatts: 800,
    minWatts: 500,
    maxWatts: 1200,
    defaultHoursPerDay: 0.5,
    active: true,
  },
  {
    id: "printer",
    name: "Printer",
    nameBn: "প্রিন্টার",
    category: "office",
    typicalWatts: 80,
    minWatts: 40,
    maxWatts: 200,
    defaultHoursPerDay: 0.5,
    active: true,
  },
];

export const ACTIVE_APPLIANCES = APPLIANCES.filter((a) => a.active);

/**
 * The few appliances 90% of users actually own — shown as big tap cards by
 * default so the first screen is instantly understandable (§10 simplicity).
 */
export const POPULAR_APPLIANCE_IDS = [
  "ceiling-fan",
  "led-bulb",
  "led-tv",
  "refrigerator",
  "wifi-router",
  "cctv-camera",
  "water-pump-1hp",
  "ac-1-ton",
  "laptop",
] as const;

export function getAppliance(id: string): ApplianceSpec | undefined {
  return APPLIANCES.find((a) => a.id === id);
}