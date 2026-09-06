import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CalculatorWizard } from "@/components/calculator/calculator-wizard";
import { FaqBlock } from "@/components/seo/faq-block";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Solar Calculator Bangladesh — How Many Solar Panels Do I Need?",
  description:
    "Size your home solar system for Bangladesh conditions. Add your appliances — get a practical solar panel wattage with example panel combinations. No formulas needed.",
  alternates: { canonical: "/calculators/solar" },
  openGraph: {
    title: "Solar Calculator Bangladesh",
    description:
      "How many solar panels do you need for your home? Add your appliances and get a practical panel size in minutes.",
  },
};

const FAQS = [
  {
    q: "How many solar panels do I need for 3 fans and a TV?",
    a: "About 700W of panels. Three ceiling fans, five LED bulbs and one LED TV use roughly 2.3kWh per day, and at Bangladesh's typical 4.7 peak sun hours that needs around 650–700W of panels — for example three 250W or four 175W panels.",
  },
  {
    q: "Can a 200W solar panel run a refrigerator?",
    a: "Not by itself for a full day. A refrigerator runs at about 150W but cycles on and off, using roughly 1.2kWh per day — which needs about 350W of panels to fully replace in one sunny day. The panel must also be paired with a battery so the fridge keeps running at night.",
  },
  {
    q: "How much solar do I need to charge a 200Ah battery?",
    a: "Roughly 550W. Charging a 12V 200Ah battery back to full (about 1.9kWh of stored energy after discharge limits) takes about 550W of panels in one good sunny day. Less panel means the battery needs more than one day to recharge.",
  },
  {
    q: "Do I need a charge controller with my solar panels?",
    a: "Yes — a charge controller (MPPT or PWM) protects the battery from overcharging and manages the charging current. It is a standard part of every home solar setup, and its efficiency is already included in the calculator's assumptions.",
  },
];

export default function SolarPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-900">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-slate-900">
                Solar Calculator
              </li>
            </ol>
          </nav>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Solar Calculator Bangladesh",
                  item: "/calculators/solar",
                },
              ],
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Solar Calculator Bangladesh",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            Solar Calculator Bangladesh
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Solar panel size = your daily energy ÷ (peak sun hours × system
            efficiency). A typical Bangladesh home using about 3.1kWh per day
            needs roughly 900W of panels. Add your appliances below — peak sun
            hours for Bangladesh and system losses are already handled for you.
          </p>

          {/* The unified calculator (§6 — all pages reuse the same engine) */}
          <div className="mt-6">
            <CalculatorWizard />
          </div>

          <section className="mx-auto mt-12 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Worked example
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              3 ceiling fans, 5 LED bulbs, 1 TV, 1 router and 4 CCTV cameras
              use about 3.1kWh per day. With Bangladesh&apos;s typical 4.7
              hours of peak sun and real-world losses (dust, heat, wiring,
              controller), that works out to about 900W of panels — for
              example 3 × 300W, 2 × 450W or 6 × 150W. The same calculation
              also checks that the panels can recharge your battery after an
              outage.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Common mistakes
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Sizing panels from the load in watts alone — solar must cover
                energy (watts × hours), not just peak power.
              </li>
              <li>
                Forgetting real-world losses: dust, heat, wiring and the charge
                controller typically reduce panel output by 25%.
              </li>
              <li>
                Buying panels without a battery — without storage, solar only
                works while the sun is shining.
              </li>
              <li>
                Ignoring recharge time: a small panel array takes days to
                refill the battery after heavy use.
              </li>
            </ul>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators current="/calculators/solar" />
        </div>
      </main>
      <Footer />
    </>
  );
}