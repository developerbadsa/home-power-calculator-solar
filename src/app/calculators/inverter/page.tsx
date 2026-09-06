import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CalculatorWizard } from "@/components/calculator/calculator-wizard";
import { FaqBlock } from "@/components/seo/faq-block";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Inverter / IPS Size Calculator — What Size IPS Do I Need?",
  description:
    "Find the right IPS or inverter size for your home. Add your appliances and get a practical VA size — surge and power factor handled automatically.",
  alternates: { canonical: "/calculators/inverter" },
  openGraph: {
    title: "Inverter / IPS Size Calculator",
    description:
      "What size IPS do you need? Add your appliances — get a practical VA rating with surge advice, automatically.",
  },
};

const FAQS = [
  {
    q: "How many watts can a 1000VA IPS run?",
    a: "About 800W of typical home load (1000VA × 0.8 power factor). That comfortably covers fans, lights, TV, router and CCTV together — roughly 3 fans, 5 LED bulbs, 1 TV and a router. For resistive loads like bulbs and heaters it can go closer to 1000W.",
  },
  {
    q: "Can a 1000VA IPS run a refrigerator?",
    a: "A fridge alone, yes — most run at 150–250W. But its compressor needs 3–4× that for a moment when it starts, so the IPS must have a good surge rating, and you shouldn't load it with much else at the same time. The calculator flags this automatically when you add a fridge.",
  },
  {
    q: "IPS, inverter or UPS — which one do I need?",
    a: "For keeping fans, lights, TV and a fridge running for hours during load-shedding, you need an IPS or inverter with a battery — that's what this tool sizes. A UPS is for short protection (seconds to minutes) of a computer or router, and is sized separately.",
  },
  {
    q: "Why is the recommended IPS bigger than my total load?",
    a: "Three honest reasons: the power factor (the VA rating is always larger than usable watts), a safety margin so the unit isn't running at its limit all the time, and starting surge from fridges, pumps and ACs. A size that exactly equals your load would struggle in real life.",
  },
];

export default function InverterPage() {
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
                Inverter / IPS Calculator
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
                  name: "Inverter / IPS Size Calculator",
                  item: "/calculators/inverter",
                },
              ],
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Inverter / IPS Size Calculator",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            Inverter / IPS Size Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            IPS size = your load × 1.2 safety margin ÷ 0.8 power factor,
            rounded up to a standard size. A typical home load of about
            500–600W needs a 1000VA IPS. Add your appliances below — surge
            appliances like fridges and pumps are flagged automatically.
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
              A typical family setup — 2 ceiling fans, 4 LED bulbs, 1 TV, 1
              fridge, 1 router and 4 CCTV cameras — runs at about 580W. With
              the safety margin and power factor applied, that needs a 1000VA
              IPS. The fridge&apos;s starting surge means a good surge rating
              matters, which the calculator warns about.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Common mistakes
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Buying an IPS whose VA number equals your load in watts — a
                1000VA IPS is not a 1000W IPS for typical loads.
              </li>
              <li>
                Ignoring surge: fridges, water pumps and ACs draw 3–4× their
                running power for a moment at startup.
              </li>
              <li>
                Forgetting one appliance when adding up the load — routers and
                CCTV cameras run 24 hours and add up quickly.
              </li>
              <li>
                Sizing for everything at once when you only need essentials on
                backup — running the whole house doubles the cost.
              </li>
            </ul>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators current="/calculators/inverter" />
        </div>
      </main>
      <Footer />
    </>
  );
}