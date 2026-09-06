import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CalculatorWizard } from "@/components/calculator/calculator-wizard";
import { BackupTimeTool } from "@/components/seo/backup-time-tool";
import { FaqBlock } from "@/components/seo/faq-block";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Battery Backup Calculator — How Much Battery Do I Need?",
  description:
    "Find the right battery size for your home's backup need. Add your appliances and backup hours — get a practical 12V/24V battery size in minutes. No formulas needed.",
  alternates: { canonical: "/calculators/battery" },
  openGraph: {
    title: "Battery Backup Calculator",
    description:
      "How many amp-hours of battery do you need? Add your appliances and backup time — get a practical battery size instantly.",
  },
};

const FAQS = [
  {
    q: "How long will a 150Ah battery run my home?",
    a: "It depends entirely on your load. A 150Ah 12V battery stores about 1.5kWh of usable energy (after depth-of-discharge and efficiency limits). At a 400W load that's roughly 3 hours; at 800W, about 1.5 hours. Use the calculator above with your actual appliances to get your number.",
  },
  {
    q: "12V, 24V or 48V — which battery system do I need?",
    a: "Small home setups (roughly up to 130Ah at 12V) work best at 12V — it's the most common, cheapest and easiest to maintain in Bangladesh. As the required capacity grows, 24V or 48V systems become more practical because they carry the same power with less current and thinner cables. This calculator picks the voltage automatically — you don't need to choose.",
  },
  {
    q: "Does adding solar change the battery size I need?",
    a: "No — the battery is sized by your backup requirement (load × hours), and solar panels are sized separately to cover your daily energy and to recharge the battery. Both appear in the result because a complete home system needs both.",
  },
  {
    q: "Tubular, flat plate or lithium — does the type matter?",
    a: "The type affects cost, lifespan and maintenance, not the amp-hour size you should buy. A tubular lead-acid battery handles frequent, deep backup use best for most Bangladeshi homes. If you know what you're buying, the Advanced settings section lets you adjust depth of discharge and efficiency — but the default recommendation is a safe starting point.",
  },
];

export default function BatteryPage() {
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
                Battery Calculator
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
                  name: "Battery Backup Calculator",
                  item: "/calculators/battery",
                },
              ],
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Battery Backup Calculator",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            Battery Backup Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Battery size = your load × backup hours ÷ (voltage × depth of
            discharge × system efficiency). For a typical home — about 400W of
            load with 2 hours of backup — you need roughly a 12V 110Ah battery.
            Add your own appliances below and get a practical size in minutes.
          </p>

          {/* The unified calculator (§6 — all pages reuse the same engine) */}
          <div className="mt-6">
            <CalculatorWizard />
          </div>

          <section className="mx-auto mt-12 max-w-lg">
            <BackupTimeTool />
          </section>

          <section className="mx-auto mt-12 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Worked example
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              3 ceiling fans, 5 LED bulbs, 1 TV, 1 router and 4 CCTV cameras
              add up to about 385W of load and 3.1kWh of daily energy. For 2
              hours of backup, that needs a 12V 110Ah battery — which also
              leaves the depth-of-discharge and efficiency margins that keep
              the battery healthy for years.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Common mistakes
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Buying by the shopkeeper&apos;s &quot;hours&quot; claim without
                adding up your own load — backup time depends on what you run.
              </li>
              <li>
                Forgetting that fridges and water pumps draw extra power at
                startup, so they need headroom, not just running watts.
              </li>
              <li>
                Deeply discharging a battery past its safe limit regularly —
                the recommendation already protects the battery by limiting
                depth of discharge.
              </li>
              <li>
                Sizing the battery from watts alone instead of energy (watts ×
                hours), which is what the amp-hour rating actually stores.
              </li>
            </ul>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators current="/calculators/battery" />
        </div>
      </main>
      <Footer />
    </>
  );
}