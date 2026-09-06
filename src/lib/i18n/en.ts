/**
 * English dictionary.
 *
 * This file is the single source of truth for the dictionary shape: `bn.ts`
 * must implement the exact same keys. All user-facing copy lives here —
 * never inside components (§35).
 */

export const en = {
  "nav.brand": "Home Power Calculator",
  "nav.tagline": "IPS · Battery · Solar",

  "hero.title": "Find the right IPS, battery and solar size for your home",
  "hero.subtitle":
    "Add what you use, pick a backup time, get the right size — in minutes. No electrical knowledge needed.",
  "hero.cta": "Start Calculation",
  "hero.quick.home": "Calculate Home Load",
  "hero.quick.battery": "Find Battery Size",
  "hero.quick.ips": "Find IPS Size",
  "hero.quick.solar": "Find Solar Size",

  "how.title": "How it works",
  "how.step1.title": "Add your appliances",
  "how.step1.body": "Pick from common devices like fans, lights, TV, fridge, router and CCTV — or add your own.",
  "how.step2.title": "Choose backup time",
  "how.step2.body": "Tell us how long things should run when the electricity goes out.",
  "how.step3.title": "Get your recommendation",
  "how.step3.body": "Instantly see the battery, IPS/inverter and solar size that fits your home.",

  "template.title": "Quick start templates",
  "template.subtitle": "Pick a preset and edit it — faster than adding everything yourself.",
  "template.use": "Use template",
  "template.applied": "Template applied — edit it freely.",

  "faq.title": "Frequently asked questions",
  "faq.q1": "Do I need to know anything about electricity?",
  "faq.a1":
    "No. Add the appliances you use, estimate how long they run, and choose your backup time. The calculator handles all the math.",
  "faq.q2": "Are the results guaranteed?",
  "faq.a2":
    "No — these are estimates. Real usage depends on your appliance ratings, battery condition, inverter quality, temperature and wiring. Treat the recommendation as a starting point.",
  "faq.q3": "Is my data saved or shared?",
  "faq.a3":
    "Nothing is saved on any server. The calculation happens in your browser, and if you share a link, the appliances are encoded inside the link itself.",
  "faq.q4": "Can I use this on my phone?",
  "faq.a4":
    "Yes — this tool is designed for mobile first, and it works offline once you've opened it once.",

  "footer.trust":
    "Estimates depend on appliance usage, battery condition, inverter efficiency, temperature, wiring losses and other real-world conditions. Final installations should be checked against actual appliance ratings and equipment specifications by a qualified professional.",
  "footer.rights": "A free tool. No account needed.",

  // ── Wizard ────────────────────────────────────────────────────────────
  "step.appliances.title": "What do you use at home?",
  "step.appliances.subtitle":
    "Pick your appliances — we'll fill in typical power for each. You can adjust everything later.",
  "step.appliances.searchPlaceholder": "Search appliances (e.g. ceiling fan)",
  "step.appliances.noMatches": "No matches. Try another name or add a custom appliance.",
  "step.appliances.selected": "Your appliances",
  "step.appliances.emptyTitle": "No appliances yet",
  "step.appliances.none": "Add a few appliances above — or use a template to get started faster.",
  "step.appliances.custom": "Add custom appliance",
  "picker.popular": "Popular",
  "picker.seeAll": "See all appliances ({count})",
  "picker.seeLess": "Show less",
  "search.emptyTitle": "No results found",
  "custom.name": "Appliance name",
  "custom.namePlaceholder": "e.g. My Fan",
  "custom.watts": "Power (watts)",
  "custom.hours": "Hours per day",
  "custom.add": "Add appliance",
  "custom.err.name": "Please enter a name.",
  "custom.err.watts": "Please enter a wattage between 1 and {max}.",
  "custom.err.hours": "Hours must be between 0 and 24.",
  "custom.typicalHint": "Typical power: {watts}",

  "row.quantity": "How many?",
  "row.wattsLabel": "Power",
  "row.wattsTypical": "Typical {watts}",
  "row.hoursLabel": "Hours/day",
  "row.remove": "Remove",
  "row.err.quantity": "Quantity must be between 1 and {max}.",
  "row.err.watts": "Enter a wattage between 1 and {max}.",
  "row.err.hours": "Hours must be between 0 and 24.",
  "row.err.blocking": "Fix the highlighted values to continue.",
  "row.summary": "{watts} · {hours}h per day",
  "row.edit": "Edit",
  "row.done": "Done",
  "warn.unusualHigh": "This wattage looks unusually high ({value}W) — please check it.",
  "warn.unusualLow": "This wattage looks unusually low ({value}W) — please check it.",
  "warn.surgeRow": "Starts with extra power — see the note in your result.",

  "step.backup.title": "How long should these run without electricity?",
  "step.backup.subtitle": "Pick a backup time, or choose custom.",
  "backup.custom": "Custom hours",
  "backup.customPlaceholder": "Hours",
  "backup.err": "Backup time must be between 0.5 and 24 hours.",
  "continue": "Continue",
  "back": "Back",
  "edit": "Edit",

  // ── Result ────────────────────────────────────────────────────────────
  "result.title": "Your recommended system",
  "result.subtitle": "A practical starting point for your home.",
  "result.battery": "Recommended battery",
  "result.battery.alt": "Alternative",
  "result.inverter": "Recommended IPS / inverter",
  "result.inverter.surge": "Check surge capacity",
  "result.solar": "Recommended solar panels",
  "result.solar.combos": "Example combinations",
  "result.load": "Total load",
  "result.energy": "Daily energy use",
  "result.backup": "Backup target",
  "result.estimates": "Estimates, not guarantees — based on typical appliance usage and system assumptions.",
  "result.explain":
    "You selected about {load} of load and requested {backup} of backup. Based on the app's default assumptions, a {battery} battery and a {inverter} IPS/inverter are a reasonable starting point. {solarLine}",
  "result.explain.solar": "With about {energy} of daily energy use, around {solar} of solar panels would cover most of your needs on a typical sunny day.",
  "result.editAppliances": "Edit appliances",
  "result.editBackup": "Change backup time",
  "result.how": "How we calculated",
  "result.how.assumptions": "Assumptions used",
  "result.how.load": "Total load = sum of (watts × quantity) for every appliance.",
  "result.how.energy": "Daily energy = sum of (watts × quantity × hours per day).",
  "result.how.battery": "Battery = backup energy ÷ inverter efficiency ÷ battery efficiency, adjusted for depth of discharge, then rounded up to a practical size. Theoretical: {theoretical}.",
  "result.how.inverter": "IPS size = load × safety margin ÷ power factor, rounded up to a standard size.",
  "result.how.solar": "Solar = daily energy ÷ (peak sun hours × system efficiency), and also sized to recharge the battery after an outage.",
  "result.theoretical": "Calculated requirement",
  "result.practical": "Practical recommendation",
  "result.actualBackup": "≈ {hours}h of backup at your load",
  "result.share.title": "Share your result",
  "result.share.whatsapp": "Share on WhatsApp",
  "result.share.copy": "Copy link",
  "result.share.copied": "Link copied!",
  "result.share.text":
    "My home needs:\n{battery} battery\n{inverter} IPS\n{solar} solar\n\nCalculate yours: {link}",
  "result.share.bn.title": "Share your result",
  "result.tier.label": "Backup level",
  "tier.budget": "Budget",
  "tier.budget.desc": "Smaller battery — covers less than the full requested backup",
  "tier.recommended": "Recommended",
  "tier.recommended.desc": "Balanced setup for the requested backup",
  "tier.heavy": "Heavy Backup",
  "tier.heavy.desc": "Larger battery — extra reserve",

  "result.advanced": "Advanced settings",
  "result.advanced.subtitle": "Optional — only if you know what these mean.",
  "advanced.voltage": "System voltage",
  "advanced.voltage.auto": "Auto (recommended)",
  "advanced.dod": "Depth of discharge",
  "advanced.invEff": "Inverter efficiency",
  "advanced.battEff": "Battery efficiency",
  "advanced.margin": "Safety margin",
  "advanced.psh": "Peak sun hours / day",
  "advanced.pf": "Power factor",
  "advanced.solarDerating": "Solar system efficiency",
  "advanced.reset": "Reset to defaults",

  // ── Warnings (§40–41) ─────────────────────────────────────────────────
  "warning.surge.title": "These need extra starting power",
  "warning.surge.body":
    "{names} can need extra power for a moment when they start. Your final IPS/inverter may need to be larger than the basic running-load calculation — check the product's surge rating.",
  "warning.surge.suggest": "Consider an IPS/inverter rated at least {va} with good surge capacity.",
  "warning.large-system.title": "Large system",
  "warning.large-system.body":
    "Your total load is very high. Have the final installation checked against actual appliance ratings by a qualified professional.",
  "warning.very-large-system.title": "Very large battery system",
  "warning.very-large-system.body":
    "This setup would need a much larger battery system than a typical home setup. Review the recommendation below — you may want to reduce the load or the backup time.",
  "warning.unusual-wattage.body": "{name}: this value looks {direction} — please check the wattage.",
  "warning.direction.high": "unusually high",
  "warning.direction.low": "unusually low",
  "warning.note":
    "Final installation should be checked against the actual appliance ratings and equipment specifications by a qualified professional.",

  // ── Live summary ──────────────────────────────────────────────────────
  "summary.totalLoad": "Total load",
  "summary.dailyEnergy": "Daily energy",
  "summary.live": "Updates as you add appliances",

  // ── Footer / calculator links ─────────────────────────────────────────
  "footer.calculators": "Calculators",
  "footer.calc.battery": "Battery Backup Calculator",
  "footer.calc.inverter": "Inverter / IPS Size Calculator",
  "footer.calc.solar": "Solar Calculator Bangladesh",
  "footer.calc.wattToAmp": "Watts to Amps",
  "footer.calc.ampToWatt": "Amps to Watts",
  "footer.calc.vaToWatt": "VA to Watts",
  "footer.guides": "Guides",
  "footer.guide.battery": "How much battery do I need?",
  "footer.guide.1000va": "What can a 1000VA IPS run?",

  // ── Homepage guides section ───────────────────────────────────────────
  "guides.title": "Guides",
  "guides.g1": "How much battery do I need?",
  "guides.g1.desc": "Load-to-battery size table plus a backup-time calculator.",
  "guides.g2": "What can a 1000VA IPS run?",
  "guides.g2.desc": "Appliance combinations that fit an 800W IPS, surge included.",
} as const;

export type MessageKey = keyof typeof en;
/** Loose dictionary shape: values are plain strings (keeps keys exact). */
export type Dict = Record<MessageKey, string>;