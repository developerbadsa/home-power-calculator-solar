import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FaqBlock } from "@/components/seo/faq-block";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "How Many Watts Can a 1000VA IPS Run? (Bangladesh)",
  description:
    "A 1000VA IPS runs about 800W of typical home load — 3 fans, 5 LED bulbs, a TV, router and CCTV together. See what fits, what doesn't, and the fridge surge warning.",
  alternates: { canonical: "/guides/how-many-watts-can-a-1000va-ips-run" },
  openGraph: {
    title: "How Many Watts Can a 1000VA IPS Run?",
    description:
      "About 800W of typical home load. See which appliance combinations fit a 1000VA IPS — and the surge warning for fridges and pumps.",
  },
};

const FAQS = [
  {
    q: "Can a 1000VA IPS run a refrigerator?",
    a: "Yes, a fridge alone — most run at 150–250W. But the compressor needs 3–4× that for a moment at startup, so the IPS must have a good surge rating, and it's wise not to run much else at the same time. When the calculator flags surge appliances, treat that as a real constraint, not a suggestion.",
  },
  {
    q: "How many fans can a 1000VA IPS run?",
    a: "By wattage alone, about 8–10 ceiling fans (800W ÷ 75W). In practice you'll also run lights, a TV and a router, so plan the whole list together — roughly 3–4 fans plus lights and TV is a comfortable, realistic load for a 1000VA IPS.",
  },
  {
    q: "What's the difference between 1000VA and 1000W?",
    a: "VA is the 'apparent' power an IPS is rated to handle; watts is the real power your appliances consume. Because of the power factor (about 0.8 for typical home loads), a 1000VA IPS delivers roughly 800W. The VA number is always larger than the usable watts.",
  },
  {
    q: "How long will a 1000VA IPS run my home?",
    a: "That depends on the battery, not the IPS. The IPS only converts power — the battery stores it. A 12V 150Ah battery with a 400W load gives roughly 2.5–3 hours of backup. Use the battery calculator to size both together.",
  },
];

export default function Guide1000vaPage() {
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
                  name: "How Many Watts Can a 1000VA IPS Run?",
                  item: "/guides/how-many-watts-can-a-1000va-ips-run",
                },
              ],
            }}
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            How Many Watts Can a 1000VA IPS Run?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            About <strong>800W</strong> of typical home load. A 1000VA IPS
            delivers roughly 1000 × 0.8 (power factor) watts of real power —
            enough for fans, LED bulbs, a TV, router and CCTV together. It is
            <strong> not</strong> a 1000W machine for motor loads like fridges
            and pumps, which need extra power at startup.
          </p>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              What fits on a 1000VA IPS?
            </h2>
            <div className="overflow-hidden rounded-[4px] border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Load
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Watts
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Fits?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <Row label="3 fans + 5 LED bulbs + TV + router" watts={340} fits />
                  <Row label="+ refrigerator (150W, surge-aware)" watts={490} fits />
                  <Row label="+ 4 CCTV cameras" watts={522} fits />
                  <Row label="+ water pump (750W, starts at 3×)" watts={1272} />
                  <Row label="Air conditioner 1 ton (1200W)" watts={1200} />
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">
              Wattages are typical values; check the actual ratings on your
              appliances. Motor loads (fridge, pump, AC) need surge headroom
              on top of the running watts.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              The surge rule for fridges and pumps
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              A fridge running at 150W can draw 450–600W for a split second
              when its compressor starts. A 750W water pump can briefly pull
              over 2kW. If your IPS cannot supply that moment of extra power,
              it will cut out or refuse to start the appliance — even though
              the running load looks fine. Buy an IPS with a strong surge
              rating and keep one high-surge appliance per circuit.
            </p>
          </section>

          <section className="mx-auto mt-8 max-w-lg space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Find your own number
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Add the exact appliances in your home to the{" "}
              <Link
                href="/calculators/inverter"
                className="font-medium text-slate-900 underline-offset-4 hover:underline"
              >
                inverter / IPS size calculator
              </Link>{" "}
              — it applies the safety margin and power factor for you, and
              flags surge appliances automatically.
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

function Row({
  label,
  watts,
  fits,
}: {
  label: string;
  watts: number;
  fits?: boolean;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
      <td className="px-4 py-3 text-sm text-slate-900">{label}</td>
      <td className="px-4 py-3 text-right text-sm text-slate-900">{watts}W</td>
      <td className="px-4 py-3 text-right">
        <span
          className={`inline-flex rounded-[4px] border px-2 py-0.5 text-xs font-medium ${
            fits
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {fits ? "Fits" : "Too much"}
        </span>
      </td>
    </tr>
  );
}