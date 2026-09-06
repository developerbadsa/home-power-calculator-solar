/**
 * Commercially available battery capacities in Ah (12V lead-acid format),
 * reflecting sizes commonly stocked in the Bangladesh market (§68).
 * The engine rounds theoretical requirements up to these (§19, §46).
 */
export const BATTERY_CAPACITIES_AH = [
  7, 9, 12, 18, 20, 26, 35, 40, 45, 55, 60, 65, 75, 80, 85, 100, 110, 120,
  130, 135, 150, 160, 165, 180, 200, 210, 220, 240, 250, 300,
] as const;