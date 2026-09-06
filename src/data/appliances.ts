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
  {
    id: "ceiling-fan",
    name: "Ceiling Fan",
    nameBn: "সিলিং ফ্যান",
    category: "fan",
    typicalWatts: 75,
    minWatts: 50,
    maxWatts: 100,
    defaultHoursPerDay: 8,
    active: true,
  },
  {
    id: "stand-fan",
    name: "Stand / Pedestal Fan",
    nameBn: "স্ট্যান্ড ফ্যান",
    category: "fan",
    typicalWatts: 65,
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
    typicalWatts: 50,
    minWatts: 35,
    maxWatts: 75,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "exhaust-fan",
    name: "Exhaust Fan",
    nameBn: "এক্সস্ট ফ্যান",
    category: "fan",
    typicalWatts: 30,
    minWatts: 20,
    maxWatts: 45,
    defaultHoursPerDay: 4,
    active: true,
  },

  // ── Lights ────────────────────────────────────────────────────────────
  {
    id: "led-bulb",
    name: "LED Bulb",
    nameBn: "এলইডি বাল্ব",
    category: "light",
    typicalWatts: 9,
    minWatts: 5,
    maxWatts: 18,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "led-tube",
    name: "LED Tube Light",
    nameBn: "এলইডি টিউব লাইট",
    category: "light",
    typicalWatts: 18,
    minWatts: 10,
    maxWatts: 30,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "led-panel",
    name: "LED Panel Light",
    nameBn: "এলইডি প্যানেল লাইট",
    category: "light",
    typicalWatts: 36,
    minWatts: 20,
    maxWatts: 60,
    defaultHoursPerDay: 8,
    active: true,
  },
  {
    id: "cfl-bulb",
    name: "CFL Bulb",
    nameBn: "সিএফএল বাল্ব",
    category: "light",
    typicalWatts: 15,
    minWatts: 9,
    maxWatts: 25,
    defaultHoursPerDay: 5,
    active: true,
  },
  {
    id: "emergency-light",
    name: "Emergency / Inverter Light",
    nameBn: "ইনভার্টার লাইট / ইমার্জেন্সি লাইট",
    category: "light",
    typicalWatts: 5,
    minWatts: 3,
    maxWatts: 10,
    defaultHoursPerDay: 3,
    active: true,
  },

  // ── TV & Entertainment ────────────────────────────────────────────────
  {
    id: "led-tv",
    name: "LED TV",
    nameBn: "এলইডি টিভি",
    category: "entertainment",
    typicalWatts: 60,
    minWatts: 40,
    maxWatts: 150,
    defaultHoursPerDay: 5,
    note: "Power varies a lot with screen size — 32\" ≈ 40–60W, 43\" ≈ 70–90W.",
    noteBn: "স্ক্রিন সাইজ অনুযায়ী পাওয়ার অনেক ভিন্ন হয় — ৩২\" ≈ ৪০–৬০W, ৪৩\" ≈ ৭০–৯০W।",
    active: true,
  },
  {
    id: "sound-system",
    name: "Sound System / Home Theater",
    nameBn: "সাউন্ড সিস্টেম / হোম থিয়েটার",
    category: "entertainment",
    typicalWatts: 60,
    minWatts: 30,
    maxWatts: 150,
    defaultHoursPerDay: 2,
    active: true,
  },
  {
    id: "dth-box",
    name: "DTH / Cable Box",
    nameBn: "ডিটিএইচ / ক্যাবল বক্স",
    category: "entertainment",
    typicalWatts: 12,
    minWatts: 8,
    maxWatts: 20,
    defaultHoursPerDay: 6,
    active: true,
  },

  // ── Kitchen ───────────────────────────────────────────────────────────
  {
    id: "refrigerator",
    name: "Refrigerator",
    nameBn: "রেফ্রিজারেটর / ফ্রিজ",
    category: "kitchen",
    typicalWatts: 150,
    minWatts: 100,
    maxWatts: 250,
    defaultHoursPerDay: 8,
    surgeCategory: "compressor",
    note: "The compressor runs on and off. 150W is the running power; 8h/day is a typical total compressor run time.",
    noteBn: "কম্প্রেসার থেমে থেমে চলে। ১৫০W হলো চলমান পাওয়ার; দিনে ৮ ঘণ্টা কম্প্রেসার চলে বলে ধরা হয়।",
    active: true,
  },
  {
    id: "deep-freezer",
    name: "Deep Freezer",
    nameBn: "ডিপ ফ্রিজার",
    category: "kitchen",
    typicalWatts: 200,
    minWatts: 150,
    maxWatts: 300,
    defaultHoursPerDay: 8,
    surgeCategory: "compressor",
    active: true,
  },
  {
    id: "rice-cooker",
    name: "Rice Cooker",
    nameBn: "রাইস কুকার",
    category: "kitchen",
    typicalWatts: 600,
    minWatts: 400,
    maxWatts: 1000,
    defaultHoursPerDay: 1.5,
    active: true,
  },
  {
    id: "microwave",
    name: "Microwave Oven",
    nameBn: "মাইক্রোওয়েভ ওভেন",
    category: "kitchen",
    typicalWatts: 1200,
    minWatts: 800,
    maxWatts: 1600,
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
    maxWatts: 2000,
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
    typicalWatts: 500,
    minWatts: 300,
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
    typicalWatts: 30,
    minWatts: 20,
    maxWatts: 60,
    defaultHoursPerDay: 10,
    active: true,
  },

  // ── Cooling / AC ──────────────────────────────────────────────────────
  {
    id: "ac-1-ton",
    name: "Air Conditioner (1 Ton)",
    nameBn: "এয়ার কন্ডিশনার (১ টন)",
    category: "cooling",
    typicalWatts: 1200,
    minWatts: 900,
    maxWatts: 1800,
    defaultHoursPerDay: 8,
    surgeCategory: "compressor",
    note: "1-ton split AC running power is typically ~1000–1500W depending on the model and inverter technology.",
    noteBn: "১ টন স্প্লিট এসির চলমান পাওয়ার সাধারণত ~১০০০–১৫০০W (মডেল ও ইনভার্টার প্রযুক্তি ভেদে)।",
    active: true,
  },
  {
    id: "ac-1.5-ton",
    name: "Air Conditioner (1.5 Ton)",
    nameBn: "এয়ার কন্ডিশনার (১.৫ টন)",
    category: "cooling",
    typicalWatts: 1800,
    minWatts: 1300,
    maxWatts: 2500,
    defaultHoursPerDay: 8,
    surgeCategory: "compressor",
    active: true,
  },

  // ── Electronics ───────────────────────────────────────────────────────
  {
    id: "laptop",
    name: "Laptop",
    nameBn: "ল্যাপটপ",
    category: "electronics",
    typicalWatts: 65,
    minWatts: 45,
    maxWatts: 120,
    defaultHoursPerDay: 6,
    active: true,
  },
  {
    id: "desktop-computer",
    name: "Desktop Computer",
    nameBn: "ডেস্কটপ কম্পিউটার",
    category: "electronics",
    typicalWatts: 200,
    minWatts: 120,
    maxWatts: 350,
    defaultHoursPerDay: 5,
    active: true,
  },
  {
    id: "wifi-router",
    name: "WiFi Router",
    nameBn: "ওয়াইফাই রাউটার",
    category: "electronics",
    typicalWatts: 10,
    minWatts: 6,
    maxWatts: 20,
    defaultHoursPerDay: 24,
    active: true,
  },
  {
    id: "mobile-charger",
    name: "Mobile Phone Charger",
    nameBn: "মোবাইল চার্জার",
    category: "electronics",
    typicalWatts: 8,
    minWatts: 5,
    maxWatts: 20,
    defaultHoursPerDay: 3,
    active: true,
  },

  // ── Security / CCTV ───────────────────────────────────────────────────
  {
    id: "cctv-camera",
    name: "CCTV Camera",
    nameBn: "সিসিটিভি ক্যামেরা",
    category: "security",
    typicalWatts: 8,
    minWatts: 5,
    maxWatts: 15,
    defaultHoursPerDay: 24,
    active: true,
  },
  {
    id: "cctv-dvr",
    name: "CCTV DVR / Recorder",
    nameBn: "সিসিটিভি ডিভিআর / রেকর্ডার",
    category: "security",
    typicalWatts: 20,
    minWatts: 10,
    maxWatts: 40,
    defaultHoursPerDay: 24,
    active: true,
  },

  // ── Motor & Pump (§68: by HP) ─────────────────────────────────────────
  {
    id: "water-pump-0.5hp",
    name: "Water Pump (0.5 HP)",
    nameBn: "ওয়াটার পাম্প (০.৫ এইচপি)",
    category: "pump",
    typicalWatts: 400,
    minWatts: 300,
    maxWatts: 600,
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
    minWatts: 550,
    maxWatts: 1100,
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
    minWatts: 800,
    maxWatts: 1600,
    defaultHoursPerDay: 1,
    surgeCategory: "motor",
    active: true,
  },

  // ── Office ────────────────────────────────────────────────────────────
  {
    id: "sewing-machine",
    name: "Sewing Machine (Electric)",
    nameBn: "সেলাই মেশিন (ইলেকট্রিক)",
    category: "office",
    typicalWatts: 120,
    minWatts: 80,
    maxWatts: 300,
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
    typicalWatts: 1000,
    minWatts: 600,
    maxWatts: 1500,
    defaultHoursPerDay: 0.5,
    active: true,
  },
  {
    id: "printer",
    name: "Printer",
    nameBn: "প্রিন্টার",
    category: "office",
    typicalWatts: 100,
    minWatts: 50,
    maxWatts: 300,
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