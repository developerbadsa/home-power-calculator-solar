/**
 * Quick-start templates (§26): preset scenarios that populate the appliance
 * list so a user can start without manually adding every item. Each entry is
 * just data — the wizard applies it like a batch of "add appliance" actions.
 */

export interface TemplateAppliance {
  id: string;
  quantity: number;
}

export interface Template {
  id: string;
  name: string;
  nameBn: string;
  appliances: TemplateAppliance[];
}

export const TEMPLATES: Template[] = [
  {
    id: "router-lights-fan",
    name: "Router + Lights + Fan",
    nameBn: "রাউটার + লাইট + ফ্যান",
    appliances: [
      { id: "wifi-router", quantity: 1 },
      { id: "led-bulb", quantity: 3 },
      { id: "ceiling-fan", quantity: 1 },
    ],
  },
  {
    id: "small-home",
    name: "Small Home",
    nameBn: "ছোট বাড়ি",
    appliances: [
      { id: "ceiling-fan", quantity: 2 },
      { id: "led-bulb", quantity: 4 },
      { id: "led-tv", quantity: 1 },
      { id: "wifi-router", quantity: 1 },
      { id: "mobile-charger", quantity: 1 },
    ],
  },
  {
    id: "family-home",
    name: "Family Home",
    nameBn: "পরিবারের বাড়ি",
    appliances: [
      { id: "ceiling-fan", quantity: 3 },
      { id: "led-bulb", quantity: 6 },
      { id: "led-tv", quantity: 1 },
      { id: "refrigerator", quantity: 1 },
      { id: "wifi-router", quantity: 1 },
      { id: "cctv-camera", quantity: 2 },
      { id: "laptop", quantity: 1 },
    ],
  },
  {
    id: "shop",
    name: "Shop",
    nameBn: "দোকান",
    appliances: [
      { id: "stand-fan", quantity: 2 },
      { id: "led-tube", quantity: 4 },
      { id: "refrigerator", quantity: 1 },
      { id: "led-tv", quantity: 1 },
      { id: "wifi-router", quantity: 1 },
    ],
  },
  {
    id: "small-office",
    name: "Small Office",
    nameBn: "ছোট অফিস",
    appliances: [
      { id: "desktop-computer", quantity: 2 },
      { id: "printer", quantity: 1 },
      { id: "led-tube", quantity: 4 },
      { id: "wifi-router", quantity: 1 },
    ],
  },
  {
    id: "cctv-setup",
    name: "CCTV Setup",
    nameBn: "সিসিটিভি সেটআপ",
    appliances: [
      { id: "cctv-camera", quantity: 4 },
      { id: "cctv-dvr", quantity: 1 },
      { id: "wifi-router", quantity: 1 },
    ],
  },
];