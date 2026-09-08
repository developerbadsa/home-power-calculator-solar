# 📋 Project Tracker — Home Power Calculator

> Single source of truth for **what is done**, **what is next**, and the **SEO instructions** every future page must follow.
> Anything in this file marked `🔜 NEXT` is a live backlog item — pick the top of the list and start there.
> Spec references (§N) point to the product spec in the project brief (Parts I–III).

**Status snapshot (last updated after commit `bce6605`)**
| Item | State |
|---|---|
| Repo | `github.com/developerbadsa/home-power-calculator-solar` |
| Branch | `main` — pushed to `origin/main`, working tree clean |
| Test suite | 61 tests passing (vitest), 8 test files |
| Build | Production build prerenders every route + `sitemap.xml` + `robots.txt` |
| Live domain | **NOT set yet** — set `NEXT_PUBLIC_SITE_URL` at deploy (see Launch checklist) |

---

## 1. Legend

- ✅ **DONE** — shipped, verified, in `main`
- 🔜 **NEXT** — planned backlog (top = do first)
- ⏸ **PARKED** — later phase, spec exists, don't build before the NEXT items

---

## 2. What's DONE

### 2.1 Phase 1 — core product (shipped in `9a85255`, polished in `bce6605`)

- ✅ Unified calculator flow: pick appliances → backup hours → recommendation (battery / IPS / inverter / solar). No engineering forms, no dropdowns-and-config cards (§2, §6)
- ✅ **Live summary bar** — Total Load (W) + Daily Energy (Wh) updates instantly under the appliance list (competitor-beating feature)
- ✅ ~37 Bangladesh-calibrated appliances with typical watts, Bangla names, defaults, surge category (§10, §68)
- ✅ Search + category filter + **6 quick-start templates** (Router+Lights+Fan, Small Home, Family Home, Shop, Small Office, CCTV) (§26)
- ✅ Custom appliance (name + watts + hours) (§11)
- ✅ Practical catalog rounding — theoretical value kept internally, headline is a real size (§46)
- ✅ Plain-language explanation + collapsed "How we calculated" (§15–16)
- ✅ Warnings for surge devices / large systems / unusual values (§40–41)
- ✅ Budget / Recommended / Heavy Backup tiers (§25)
- ✅ Advanced settings behind an optional disclosure (§9)
- ✅ English + বাংলা (natural Bangla, localStorage toggle, hydration-safe) (§35–36)
- ✅ Shareable results — input snapshot in URL + WhatsApp share with pre-filled text (§28, §67)
- ✅ Offline PWA (service worker, manifest, icons) (§70)
- ✅ Calculation engine fully separate from UI; single assumptions config (§42–45), tests beside code

### 2.2 SEO calculator cluster — Batch 1 + 2 + parts of 3 (shipped in `bce6605`)

Live routes (all verified rendering + interactive):

| Route | Target keyword | Status |
|---|---|---|
| `/calculators/watt-to-amp` | watt to amp calculator (220V/12V) | ✅ + PAA quick-tables |
| `/calculators/amp-to-watt` | amps to watts calculator | ✅ + PAA quick-tables |
| `/calculators/va-to-watt` | VA to watts (IPS sizing) | ✅ + PAA quick-tables |
| `/calculators/battery` | battery backup calculator | ✅ full wizard embedded + BackupTime tool |
| `/calculators/inverter` | inverter size calculator | ✅ full wizard embedded |
| `/calculators/solar` | solar calculator bangladesh | ✅ full wizard + BD-calibrated content |
| `/guides/how-many-watts-can-a-1000va-ips-run` | 1000VA IPS কত লোড | ✅ + appliance-fit table |
| `/guides/how-much-battery-do-i-need` | কত ব্যাটারি লাগবে | ✅ + load→battery reference table |

### 2.3 Technical SEO (shipped in `bce6605`)

- ✅ `src/app/sitemap.ts` (dynamic, all 9 routes), `src/app/robots.ts`, `src/lib/site.ts` (env-based canonical URL)
- ✅ `metadataBase` + site-wide OG metadata in `src/app/layout.tsx`
- ✅ Reusable SEO primitives: `JsonLd`, `FaqBlock` (visible + FAQPage schema), `RelatedCalculators`, `UnitConverterTool`, `QuickTable`, `BackupTimeTool`
- ✅ BreadcrumbList + WebApplication + FAQPage JSON-LD on the SEO pages (§77)
- ✅ Internal-link cluster: related-calculators on every SEO page + footer groups (calculators / guides) + homepage guides section (§34)
- ✅ Research-verified gaps filled: Bangla "150Ah কত ঘণ্টা" / "1000VA কত লোড" queries had **zero interactive tools** on page 1 — our backup-time tool + guides now answer them

---

## 3. What's NEXT (prioritized backlog)

> Order follows §75 content priority: least-competitive, highest-intent first. Each item carries its SEO instructions.

### 🔜 A. Remaining calculator routes from the §31 map

- **`/calculators/ips`** — head term "IPS calculator" (BD-specific, near-zero global competition). Embed the unified wizard like `/calculators/inverter`. Keyword angle: *কত ওয়াটের আইপিএস লাগবে*, *1000VA IPS কত লোড নিতে পারে* → cross-link the existing 1000VA guide.
- **`/calculators/ups`** — "UPS battery backup calculator". MUST disambiguate from the shipping company: use "UPS (uninterruptible power) backup calculator" framing, UPS-vs-IPS comparison block (§72).
- **`/calculators/home-load`** — "home load calculator". This is the wizard itself, packaged as its own page.

### 🔜 B. Remaining guide long-tails (§72–73) — highest-intent, lowest competition

- `/guides/how-to-calculate-home-load` (how to calculate home electricity load)
- `/guides/how-to-size-a-solar-system` (কত ওয়াট সোলার প্যানেল লাগবে)
- `কত ঘণ্টা ব্যাকআপ পেতে কত ব্যাটারি লাগবে` → backup-hours→Ah table (BackupTimeTool reuse)
- `150ah battery diye ki ki chalano jay` (appliance-fit table on 150Ah)
- `water pump koto watt hoy` / `cctv camera koto watt` — appliance-wattage answers linking into the wizard
- `1000va ips ki refrigerator chalabe` — appliance-fit table variant

### 🔜 C. Bangla-indexable versions + hreflang (§35, §77)

Current Bangla is a client-side toggle on one URL — Google only sees English. Real fix:
- Serve `/bn/...` localized copies of the top pages (or a `?lang=bn` set of URLs), each with unique `<title>`/meta in Bangla, and
- `alternate hreflang` pairs between `/` and `/bn/` for each calculator.
- Content must be natural Bangla (§36), never machine translation. Engine stays language-free — only copy differs.

### 🔜 D. Per-page OG images + rich share preview (§28, §67)

Each calculator page needs a distinct OG image showing its recommendation (battery/IPS/solar chips), so WhatsApp/Facebook forwards look native. Can be generated statically (e.g., `opengraph-image.tsx` per route) — no runtime dependency.

### 🔜 E. Analytics events (§52–53)

Wire `calculator_started`, `appliance_added`, `calculation_completed`, `result_shared`, `advanced_settings_opened`, `calculator_abandoned`. Plausible or GA4 snippet; no invasive personal data. KPI: % of users who reach a useful result unaided.

### 🔜 F. Template + wizard polish (after A–E)

- More region templates (Mosque, Restaurant/tea stall, Tailor shop with sewing machine)
- Water-pump sizing by HP (0.5/1/1.5 HP presets) — Bangladesh staple (§68)

### ⏸ G. Phase 3 — parked (§29–30, §47–49)

Accounts, saved homes ("My Home / My Shop"), PDF report, product/affiliate layer in BDT with local brands (Rahimafrooz, Hamko, Navana…), installer-lead form. **Never** block results behind signup or ads (§51).

---

## 4. SEO instruction manual — apply to EVERY new page

### 4.1 On-page template (§32, §74) — order is mandatory

1. **H1** = the exact head keyword, natural Bangla or English per the page's primary language
2. **The interactive calculator above the fold** — no scrolling to start; never bury the tool under an article (§32)
3. **2–3 sentence plain answer** to the page's core question (featured-snippet bait, "People also ask" style)
4. **Worked example** with realistic BD appliances (৩টা ফ্যান, ৫টা লাইট… style) using real engine numbers
5. **Common mistakes** — competitor content is weakest here; ours must not be
6. **FAQ block** (`<details>` + FAQPage JSON-LD) — reuse `FaqBlock`; target §72 long-tails
7. **Related calculators** — `RelatedCalculators` component (exclude current route)

### 4.2 Content rules (§33, §36, §63)

- ❌ NO thin pages that only swap a keyword. Each page genuinely answers a different intent
- ❌ NO formulas in UI components; no scattered constants (engine only, §43)
- ✅ Friendly language: "How many hours of backup do you want?" — never "Required autonomy" (§12)
- ✅ Plain-language result explanations, estimates worded as *recommended/approximately*, with the trust note (§14, §41)
- ✅ Unit labels the way people say them: Watt (W), Volt (V), Ampere (A), VA, kWh — explained simply
- ✅ One H1 per page, semantic heading hierarchy, unique title + meta description per route

### 4.3 Internal linking (§34, §74 step 7)

Cross-link the cluster naturally, every page pointing both to the wizard and sibling calculators:
`Home Load → Battery → IPS → Solar → unit converters`, plus each guide back to the calculator that answers it. New route ⇒ update **all three**: `RelatedCalculators` LINKS, `Footer` arrays, `sitemap.ts` routes, and homepage guides section where relevant.

### 4.4 Structured data (§77)

- FAQPage on every FAQ block — `FaqBlock` does this automatically
- WebApplication on calculator pages; BreadcrumbList on every SEO page
- hreflang once `/bn/` exists (item C)
- Only emit schema that is genuinely valid for the page; no invented data

### 4.5 Verdict for new pages before merge

```text
1. tsc --noEmit clean
2. eslint clean
3. vitest run — all pass (add engine tests for any new math)
4. npm run build — new route appears in output & prerenders static
5. Preview: page renders, tool computes, schema (application/ld+json) present
6. Route added to sitemap.ts + footer + related-calculators
7. Working tree committed & pushed only when the user asks
```

---

## 5. Launch checklist (deploy day)

- [ ] Set `NEXT_PUBLIC_SITE_URL` on the hosting platform (Vercel auto-detects; otherwise sitemap/OG point at localhost)
- [ ] Verify `/sitemap.xml` + `/robots.txt` on the live domain
- [ ] Test WhatsApp/Facebook share preview of a result link (needs per-page OG images, item D, for best result)
- [ ] Submit sitemap in Google Search Console; request indexing for the calculators
- [ ] Start the growth loop from §67 only after the core share flow is proven: FB groups seeding, 30–60s demo video, 1–2 retailer partners
- [ ] Track §53 metrics once analytics (item E) is wired

---

## 6. Housekeeping notes

- **README.md roadmap** is deliberately short and points here for detail.
- `AGENTS.md` / `CLAUDE.md` are Next.js agent-rule files — do not edit the generated block.
- Engine assumptions live ONLY in `src/domain/config/assumptions.ts` and are versioned so old results stay reproducible (§44–45).
- Real catalog products never live in calculation code (§47) — keep the product layer optional and after the result (§48).
