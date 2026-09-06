import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UnitConverterTool } from "@/components/seo/unit-converter-tool";
import { QuickTable } from "@/components/seo/quick-table";
import { FaqBlock } from "@/components/seo/faq-block";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Amps to Watts Calculator — 220V Home Load",
  description:
    "Convert amps to watts at 220V with power factor. See how much power your IPS output or appliance current actually provides — explained for home use.",
  alternates: { canonical: "/calculators/amp-to-watt" },
  openGraph: {
    title: "Amps to Watts Calculator",
    description:
      "How many watts is 5 amps? Convert amps to watts at 220V with power factor — simple home explanation.",
  },
};

const FAQS = [
  {
    q: "Is a 100Ah battery the same as 100 amps?",
    a: "No. Ah (amp-hours) measures battery capacity — how much energy it stores — while A (amps) measures current at a moment in time. A 12V 100Ah battery stores about 1200Wh (1.2kWh) of energy, which is why it can power a 100W bulb for around 10 hours but still 'deliver' far more than 100A for a split second.",
  },
  {
    q: "How many watts can my IPS supply?",
    a: "Check the VA rating on the label and multiply by the power factor (about 0.8 for typical home loads). A 1000VA IPS supplies roughly 800W of real power. Amps on the label are usually the maximum output current at 220V — watts = amps × 220 × power factor.",
  },
  {
    q: "Why does a 5A fan consume less than 1100W?",
    a: "Because fans have a power factor below 1. A fan drawing 5A at 220V with a power factor of 0.7 consumes about 770W of real power, even though 5 × 220 = 1100. The remaining 'apparent' power does no useful work but still flows through the wiring.",
  },
  {
    q: "What's the difference between DC and AC watts?",
    a: "Watts are watts — the formula (volts × amps × power factor) is the same. The difference is that DC (batteries, solar panels) has no power factor, so it's simply volts × amps. That's why a 12V battery system and a 220V home supply need different amp calculations for the same power.",
  },
];

export default function AmpToWattPage() {
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
                Amps to Watts
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
                  name: "Amps to Watts Calculator",
                  item: "/calculators/amp-to-watt",
                },
              ],
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            Amps to Watts Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Watts = amps × volts × power factor. A load drawing 5A at 220V uses
            about 1100W if it&apos;s resistive (bulbs, heaters), or roughly 880W
            for typical home appliances. Enter the current below to find the
            power.
          </p>

          <div className="mt-6">
            <UnitConverterTool mode="ampToWatt" toolTitle="Convert amps to watts" />
          </div>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <QuickTable
              caption="Quick answers at 220V"
              head={["Amps", "Watts (resistive)", "Watts (0.8 PF)"]}
              rows={[
                ["1A", "220W", "176W"],
                ["3A", "660W", "528W"],
                ["5A", "1100W", "880W"],
                ["10A", "2200W", "1760W"],
                ["15A", "3300W", "2640W"],
              ]}
              note="Watts = amps × 220 × power factor. The 0.8 column is what motor and electronics loads actually consume; the resistive column applies to bulbs and heaters."
            />
          </section>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Worked example
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              An IPS that can supply 10A at 220V can run about 1760W of
              resistive load (bulbs, iron) — or about 1400W of typical mixed
              home load at a 0.8 power factor. That tells you straight away
              whether the IPS can handle a 1400W rice cooker, or whether you
              should keep a high-power appliance off the backup line.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Common mistakes
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Treating battery amp-hours (Ah) as if it were output current
                (A) — they are completely different measurements.
              </li>
              <li>
                Using 12V battery amps as if they were 220V mains amps. A 12V
                100Ah battery holds about 1.2kWh, not 100A × 220V = 22kW.
              </li>
              <li>
                Forgetting the power factor on motor loads, which makes real
                watts lower than volts × amps.
              </li>
            </ul>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators current="/calculators/amp-to-watt" />
        </div>
      </main>
      <Footer />
    </>
  );
}