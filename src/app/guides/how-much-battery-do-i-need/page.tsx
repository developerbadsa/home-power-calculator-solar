import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackupTimeTool } from "@/components/seo/backup-time-tool";
import { FaqBlock } from "@/components/seo/faq-block";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "How Much Battery Do I Need for Backup? (Bangladesh)",
  description:
    "Battery size = load × backup hours ÷ (voltage × 0.8 discharge × efficiency). A 400W home needing 2 hours of backup needs a 12V 110Ah battery. Use the backup-time calculator.",
  alternates: { canonical: "/guides/how-much-battery-do-i-need" },
  openGraph: {
    title: "How Much Battery Do I Need for Backup?",
    description:
      "Quick table: load → battery size for 2h backup. Plus a calculator showing how long any battery runs your actual load.",
  },
};

const FAQS = [
  {
    q: "How long will a 150Ah battery run my home?",
    a: "A 12V 150Ah battery stores about 1.5kWh of usable energy after discharge limits. At a 400W load that's roughly 2.5–3 hours; at 150W (just a fridge and lights) it can run 6–7 hours. Use the calculator on this page with your actual load for a precise answer.",
  },
  {
    q: "How many watts is a 150Ah battery?",
    a: "A 12V 150Ah battery stores 1800Wh (1.8kWh) of total energy, of which about 1.4–1.5kWh is usable before you should recharge. Watts aren't stored — energy is — so think of it as 1.5kWh of capacity, not a wattage rating.",
  },
  {
    q: "Can a 150Ah battery run a refrigerator?",
    a: "Yes. A fridge runs at about 150W, so a 12V 150Ah battery delivers roughly 7 hours of backup for it. Just make sure the IPS has a good surge rating for the compressor's startup draw.",
  },
  {
    q: "Tubular, flat plate or lithium — which battery should I buy?",
    a: "For frequent, deep backup use in a Bangladeshi home, a tubular lead-acid battery is the usual recommendation — it survives deep discharge cycles best at a reasonable price. Lithium (LiFePO4) costs more but lasts longer and is lighter. The amp-hour size you need is the same either way; the type affects budget and lifespan.",
  },
];

export default function GuideBatteryPage() {
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
                Guides
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
                  name: "How Much Battery Do I Need for Backup?",
                  item: "/guides/how-much-battery-do-i-need",
                },
              ],
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            How Much Battery Do I Need for Backup?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Battery size = your load × backup hours ÷ (voltage × depth of
            discharge × efficiency). A home pulling about 400W that wants 2
            hours of backup needs a <strong>12V 110Ah</strong> battery. Use the
            table below as a starting point, then check your exact appliances
            in the battery calculator.
          </p>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick reference: load → battery size (2 hours of backup)
            </h2>
            <div className="overflow-hidden rounded-[4px] border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Your load
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Example
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Battery
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <BatteryRow load={200} example="2 fans + 4 bulbs + router" battery="12V 55Ah" />
                  <BatteryRow load={400} example="4 fans + 6 bulbs + TV + router + CCTV" battery="12V 110Ah" />
                  <BatteryRow load={600} example="+ refrigerator" battery="12V 165Ah" />
                  <BatteryRow load={800} example="+ refrigerator + pump (running)" battery="12V 220Ah" />
                  <BatteryRow load={1000} example="Large home / small shop" battery="24V 150Ah" />
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">
              Rounded up to commonly available sizes. Larger loads step up to
              24V/48V systems automatically in the calculator — thinner cables,
              same energy.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-lg">
            <BackupTimeTool />
          </section>

          <section className="mx-auto mt-10 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Why 12V, 24V or 48V?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Small home systems (up to about 130Ah at 12V) use 12V — it&apos;s
              the most common battery size in Bangladesh, the cheapest, and the
              easiest to maintain. As the required capacity grows, 24V or 48V
              systems carry the same power with half or a quarter of the
              current, which means thinner cables and smaller losses. You
              don&apos;t need to choose — the calculator picks the most
              practical voltage for your numbers.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Size it for your own home
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Add your appliances and backup hours to the{" "}
              <Link
                href="/calculators/battery"
                className="font-medium text-slate-900 underline-offset-4 hover:underline"
              >
                battery backup calculator
              </Link>{" "}
              — it returns a practical size (not a theoretical number) and an
              alternative, one step bigger, for extra reserve.
            </p>
          </section>

          <FaqBlock title="Frequently asked questions" faqs={FAQS} />
          <RelatedCalculators />
        </div>
      </main>
      <Footer />
    </>
  );
}

function BatteryRow({
  load,
  example,
  battery,
}: {
  load: number;
  example: string;
  battery: string;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
      <td className="px-4 py-3 text-sm font-medium text-slate-900">{load}W</td>
      <td className="px-4 py-3 text-sm text-slate-500">{example}</td>
      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
        {battery}
      </td>
    </tr>
  );
}