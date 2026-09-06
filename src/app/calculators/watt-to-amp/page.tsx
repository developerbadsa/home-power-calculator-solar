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
  title: "Watts to Amps Calculator — Home Load Current (220V)",
  description:
    "Convert watts to amps for your home appliances at 220V. Learn how much current your fan, fridge or AC actually draws — with power factor explained simply.",
  alternates: { canonical: "/calculators/watt-to-amp" },
  openGraph: {
    title: "Watts to Amps Calculator",
    description:
      "How many amps does your appliance draw? Convert watts to amps at 220V with power factor — simple home explanation.",
  },
};

const FAQS = [
  {
    q: "How many watts is 1 amp at 220V?",
    a: "At Bangladesh's 220V supply, 1 amp of current carries about 220 watts for resistive loads like bulbs and heaters (1A × 220V = 220W). For motors, fans and refrigerators, it carries less — around 176W — because of their power factor.",
  },
  {
    q: "Why does my refrigerator need more amps when it starts?",
    a: "The compressor inside a fridge draws 3–5 times its running current for the first second or two when it starts. So a fridge that runs at 2A may briefly need 8A. This is why IPS and inverter ratings matter — they must handle the starting surge, not just the running load.",
  },
  {
    q: "What power factor should I use?",
    a: "Use 1.0 for purely resistive loads (electric heaters, electric iron, incandescent and LED bulbs, rice cookers). Use about 0.7–0.9 for loads with motors or electronics (fans, fridge, AC, water pumps). When in doubt, 0.8 is a reasonable home average.",
  },
  {
    q: "Is this calculator for single phase or three phase?",
    a: "This tool calculates single-phase home current, which is what Bangladesh households use. Three-phase supplies divide the load differently and are mainly for factories and large shops — a separate calculation is needed there.",
  },
];

export default function WattToAmpPage() {
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
                Watts to Amps
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
                  name: "Watts to Amps Calculator",
                  item: "/calculators/watt-to-amp",
                },
              ],
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            Watts to Amps Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            At 220V — the standard voltage in Bangladesh homes — amps = watts ÷
            (220 × power factor). A 1000W appliance draws about 4.5A. Enter
            your appliance rating below to find its current draw instantly. For
            a 12V battery system (solar, IPS), set the voltage to 12 and use a
            power factor of 1 — the same formula applies.
          </p>

          <div className="mt-6">
            <UnitConverterTool mode="wattToAmp" toolTitle="Convert watts to amps" />
          </div>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <QuickTable
              caption="Quick answers at 220V"
              head={["Watts", "Amps (resistive)", "Amps (0.8 PF)"]}
              rows={[
                ["200W", "0.91A", "1.14A"],
                ["500W", "2.27A", "2.84A"],
                ["1000W", "4.55A", "5.68A"],
                ["1500W", "6.82A", "8.52A"],
                ["2000W", "9.09A", "11.36A"],
              ]}
              note="Amps = watts ÷ (220 × power factor). Resistive = power factor 1 (bulbs, heaters, iron); 0.8 is typical for fans, fridges and mixed home loads."
            />
          </section>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Worked example
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              A 1000W electric iron at 220V draws about 4.5A. A 1500W air
              conditioner with a power factor of 0.8 draws about 8.5A — and at
              the moment it starts, its compressor may briefly draw far more.
              Knowing the running current tells you whether a socket, circuit
              or IPS can safely feed the appliance.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Common mistakes
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Using 110V instead of 220V — this roughly doubles the calculated
                current and is wrong for Bangladesh.
              </li>
              <li>
                Ignoring power factor for fans, fridges and ACs — their real
                current is higher than watts ÷ 220 suggests.
              </li>
              <li>
                Confusing starting current with running current when sizing an
                IPS or choosing a socket.
              </li>
            </ul>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators current="/calculators/watt-to-amp" />
        </div>
      </main>
      <Footer />
    </>
  );
}