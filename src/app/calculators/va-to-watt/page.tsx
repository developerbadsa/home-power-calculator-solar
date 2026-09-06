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
  title: "VA to Watts Calculator — What Size IPS Do I Need?",
  description:
    "Convert VA to watts to understand what a 1000VA IPS can actually run. Learn the difference between VA and watts with a power factor of 0.8.",
  alternates: { canonical: "/calculators/va-to-watt" },
  openGraph: {
    title: "VA to Watts Calculator",
    description:
      "A 1000VA IPS delivers about 800W to typical home loads. Convert VA to watts and see what your IPS can really run.",
  },
};

const FAQS = [
  {
    q: "How many watts can a 1000VA IPS run?",
    a: "About 800W of typical home load (1000 × 0.8 power factor). For purely resistive loads like bulbs and heaters it can reach closer to 1000W, but for motor loads like fridges and pumps you should stay under 800W — and still leave surge headroom for the moment they start.",
  },
  {
    q: "What is power factor in simple words?",
    a: "Power factor is the fraction of the electricity drawn that actually does useful work. Fans, fridges and ACs use about 70–90% usefully; bulbs and heaters use all of it. That's why a 1000VA IPS doesn't equal 1000W — the VA number describes the wiring load, not the usable power.",
  },
  {
    q: "Should I buy an IPS by VA or by watts?",
    a: "Use both. Add up the watts of everything you want to run on backup, then choose an IPS whose VA rating is at least your load divided by 0.8. For example, 600W of load needs roughly a 750–800VA IPS; most people then buy the next common size, 1000VA, for comfort and surge headroom.",
  },
  {
    q: "Why is my recommended IPS bigger than my total load?",
    a: "Three reasons: the power factor (the IPS's VA rating is always larger than its usable watts), a safety margin so the IPS isn't running at 100% all the time, and starting surge from fridges, pumps and ACs, which can briefly need 3–4× the running power.",
  },
];

export default function VaToWattPage() {
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
                VA to Watts
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
                  name: "VA to Watts Calculator",
                  item: "/calculators/va-to-watt",
                },
              ],
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            VA to Watts Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Watts = VA × power factor. IPS and inverter sizes are printed in VA
            (e.g. 1000VA), but your appliances consume watts — so a 1000VA IPS
            delivers roughly 800W to a typical home load. Enter the VA rating
            below to see the real power it can supply.
          </p>

          <div className="mt-6">
            <UnitConverterTool mode="vaToWatt" toolTitle="Convert VA to watts" />
          </div>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <QuickTable
              caption="Common IPS sizes and what they run (power factor 0.8)"
              head={["IPS size", "Real power", "Typical load"]}
              rows={[
                ["500VA", "400W", "2 fans + 4 LED bulbs + router"],
                ["650VA", "520W", "3 fans + 5 bulbs + TV + router"],
                ["1000VA", "800W", "3 fans + 5 bulbs + TV + router + 4 CCTV"],
                ["1500VA", "1200W", "Above + refrigerator"],
                ["2000VA", "1600W", "Above + water pump (running)"],
              ]}
              note="Real power = VA × 0.8. These are typical-appliance examples — add your exact list in the IPS calculator. Fridges and pumps need surge headroom on top."
            />
          </section>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Worked example
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              A 650VA IPS delivers about 520W — enough for 3 fans, 5 LED bulbs
              and a TV. A 1500VA IPS delivers about 1200W, which comfortably
              covers a refrigerator running load on top. This is the single
              most useful number to know before buying an IPS.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Common mistakes
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Assuming VA = watts — a 1000VA IPS is not a 1000W IPS for
                typical loads.
              </li>
              <li>
                Buying an IPS that matches the load watts exactly, leaving no
                room for the power factor or starting surge.
              </li>
              <li>
                Ignoring surge: fridges, water pumps and ACs can need 3–4×
                their running power for a moment at startup.
              </li>
            </ul>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators current="/calculators/va-to-watt" />
        </div>
      </main>
      <Footer />
    </>
  );
}