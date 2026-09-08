# Home Power Calculator

A simple, mobile-first web app that helps ordinary people find the right **IPS / UPS, battery, inverter and solar** size for their home — without knowing anything about electricity.

> **Core promise:** Add the things you use at home → tell us roughly how long you use them → tell us how much backup you want → get a simple recommended setup.

Built per the product spec (§1–70): the complexity lives inside the calculation engine; the simplicity lives in the UI.

## What's included (Phase 1 of the roadmap)

- **Unified calculator flow:** appliances → backup time → recommendation (battery / IPS / inverter / solar)
- **~38 Bangladesh-calibrated appliances** with typical wattages, Bangla names, defaults and surge categories (§10, §68)
- **Search + category filters + quick-start templates** (Small Home, Family Home, Shop, Small Office, CCTV, Router+Lights+Fan) (§26)
- **Custom appliance** support (§11)
- **Practical recommendations**: theoretical values are preserved internally, headline answers are real catalog sizes (§19, §46)
- **Plain-language explanations** + collapsed "How we calculated" (§15–16)
- **Warnings** for surge appliances, very large systems, and unusual values (§21, §40)
- **Budget / Recommended / Heavy Backup** tiers (§25)
- **Optional Advanced settings** (§9) — never required
- **English + Bangla** with natural Bangla copy (§35–36)
- **Shareable results**: input snapshot encoded in the URL + WhatsApp share with pre-filled text (§28, §67)
- **Offline PWA**: app shell + assets cached after first visit; the calculator works with no network (§70)
- **Unit-tested calculation engine** (§62)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run test       # vitest — calculation engine + validation tests
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # production build
node scripts/generate-icons.mjs   # regenerate PWA icons (no deps)
```

## Architecture

The calculation engine is fully separated from the UI (§42–45). The UI never contains formulas.

```
src/
  app/                      # Next.js App Router (homepage, layout)
  components/
    header.tsx, hero.tsx, footer.tsx, home-sections.tsx
    calculator/             # wizard + picker + rows + result + warnings
  domain/
    config/assumptions.ts   # ← ALL engineering defaults live here (§44)
    calculations/           # load, energy, battery, inverter, solar, recommendations
  data/
    appliances.ts           # catalog (names, typical watts, surge, defaults)
    batteries.ts            # commercial Ah sizes
    inverters.ts            # VA classes
    solarPanels.ts          # example panel sizes
    templates.ts            # quick-start presets
  lib/
    i18n/                   # en/bn dictionaries + provider
    formatting.ts           # human-friendly units
    validation.ts           # input validation (§39)
    share.ts                # share-link encode/decode (§28)
    uid.ts
  tests live next to the code they test (src/domain/**/__tests__, src/lib/__tests__)
```

Engine flow: `calculate(input)` → load → daily/backup energy → battery → inverter → solar → warnings. Every result records the input snapshot plus engine and assumptions versions (§45).

## Engineering assumptions (configurable in `src/domain/config/assumptions.ts`)

| Parameter | Default | Notes |
|---|---|---|
| Inverter efficiency | 0.90 | DC→AC conversion loss |
| Battery efficiency | 0.85 | round-trip charge/discharge |
| Depth of discharge | 0.80 | usable capacity fraction |
| Safety margin (IPS) | 1.20 | applied to running load |
| Power factor | 0.80 | W → VA conversion |
| Peak sun hours | 4.7 | Bangladesh typical (§68) |
| Solar system efficiency | 0.75 | dust, temperature, wiring, MPPT |
| System voltage | auto | 12V → 24V → 48V as capacity grows |

**These defaults are starting points and must be validated against authoritative engineering sources before production use.** They are versioned so every result stays reproducible.

## Calculation model (summary)

- **Total load** = Σ(watts × quantity)
- **Daily energy** = Σ(watts × quantity × hours/day)
- **Battery**: backup energy ÷ (inverter eff × battery eff) ÷ depth of discharge → practical Ah from the catalog, choosing 12V/24V/48V so the bank stays realistic; parallel strings when no single battery fits (§18–19)
- **IPS/inverter**: load × safety margin ÷ power factor → standard VA class; surge devices trigger a clear advisory rather than silently upsizing (§20–21)
- **Solar**: max(daily energy, battery recharge) ÷ (peak sun hours × system efficiency) → rounded headline + example panel combinations (§22–23)

## Design system

The UI follows the project's design standard: 4px border radius, slate-900 primary, Inter typeface, `lucide-react` icons, slate/semantic status colors, 4px spacing grid, elevation tokens, visible focus rings, reduced-motion support, and kebab-case component files. Icons are `lucide-react` (the WhatsApp share button uses the WhatsApp brand mark).

## Roadmap

Live status, shipped checklist and the prioritized future backlog (with the SEO instruction manual for every new page) live in **[`PROJECT_TRACKER.md`](./PROJECT_TRACKER.md)**.

Quick summary:

- **Phase 1 (shipped):** core calculator, ~37-appliance catalog, EN/BN, mobile-first UI, shareable results + WhatsApp, PWA offline, engine tests.
- **Phase 2 (partly shipped):** SEO calculator cluster — watt/amp/VA converters, battery, inverter, solar pages, and two high-intent Bangla guides; `sitemap.xml` + `robots.txt` + structured data. Remaining: `/calculators/ips`, `/calculators/ups`, `/calculators/home-load`, more long-tail guides, `/bn/` + hreflang, per-page OG images, analytics (§52–53).
- **Phase 3:** accounts, saved homes, PDF reports, product/affiliate layer, installer leads (§29–30, §47–49).

## Safety note

Estimates depend on appliance usage, battery condition, inverter efficiency, temperature, wiring losses and other real-world conditions. Final installations should be checked against actual appliance ratings and equipment specifications by a qualified professional.