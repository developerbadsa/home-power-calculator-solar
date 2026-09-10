import type { Metadata } from "next";
import { BillAnalysisTool } from "@/components/seo/bill-analysis-tool";
import { FaqBlock, type FaqItem } from "@/components/seo/faq-block";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedCalculators } from "@/components/seo/related-calculators";
import Link from "next/link";

const FAQs: FaqItem[] = [
  {
    q: "How do I find kWh on my electricity bill?",
    a: "Look for 'Unit' or 'kWh' on your monthly electricity bill from DESCO, DPDC, BREB, or your local utility. It's usually near the total amount.",
  },
  {
    q: "Why do I need 3 months of bills?",
    a: "One month's bill can vary (hot months use more AC). Three months gives a more accurate average of your real electricity consumption.",
  },
  {
    q: "Can I use this for a shop or office too?",
    a: "Yes — any electricity customer can use this. Just enter the kWh from the electricity bills for the location.",
  },
  {
    q: "What if my bills are very different each month?",
    a: "That's normal — seasonal changes, guests, or new appliances can cause variation. The calculator averages them out. Add more months for better accuracy.",
  },
  {
    q: "Is the estimate accurate?",
    a: "It's a starting point. Real usage depends on appliance types, battery condition, and other factors. Use this as guidance, then verify with a professional.",
  },
];

export const metadata: Metadata = {
  title: "Electricity Bill Calculator Bangladesh — Find Your Average Load",
  description:
    "Enter your monthly electricity bill kWh to find your average load and get IPS, battery, and solar recommendations. Free tool, works on mobile.",
  openGraph: {
    title: "Electricity Bill Calculator Bangladesh",
    description:
      "Upload your electricity bill units (kWh) and instantly find your average load, recommended battery, IPS and solar panel size.",
    type: "website",
  },
};

export default function BillAnalysisPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Electricity Bill Calculator Bangladesh",
          description:
            "Calculate your average electricity load from bill kWh readings and get IPS, battery, solar recommendations.",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Bill Calculator",
              item: "/calculators/bill-analysis",
            },
          ],
        }}
      />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-600">
            Home
          </Link>{" "}
          / <span className="text-slate-600">Bill Calculator</span>
        </nav>

        <h1 className="text-3xl font-bold text-slate-900">
          Electricity Bill Calculator
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Enter the kWh (units) from your electricity bills to find your average
          load and get the right IPS, battery and solar recommendation.
        </p>

        {/* The tool */}
        <div className="mt-8">
          <BillAnalysisTool />
        </div>

        {/* Worked example */}
        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Worked Example
          </h2>
          <div className="rounded-[4px] border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
            <p>
              If your last 3 bills were <strong>210 kWh</strong>,{" "}
              <strong>250 kWh</strong>, and <strong>190 kWh</strong>:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Average monthly: <strong>217 kWh</strong>
              </li>
              <li>
                Average daily: <strong>7.2 kWh</strong>
              </li>
              <li>
                Average load: <strong>300W</strong> running 24 hours
              </li>
            </ul>
            <p className="mt-2">
              For 2 hours backup: a <strong>12V 110Ah</strong> battery +{" "}
              <strong>500VA</strong> IPS + <strong>600W</strong> solar would cover
              most of your needs.
            </p>
          </div>
        </section>

        {/* Common mistakes */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Common Mistakes
          </h2>
          <div className="space-y-3">
            <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                ❌ Using only one month's bill
              </p>
              <p className="mt-1 text-sm text-amber-800">
                A single summer month with AC running may show 400+ kWh, while
                winter months could be 150 kWh. Always average at least 2–3
                months.
              </p>
            </div>
            <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                ❌ Confusing bill amount with kWh
              </p>
              <p className="mt-1 text-sm text-amber-800">
                The bill total in ৳ is NOT the kWh. Look for the "Unit" or
                "kWh" number — that's what you need to enter.
              </p>
            </div>
            <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                ❌ Forgetting seasonal variation
              </p>
              <p className="mt-1 text-sm text-amber-800">
                If you use AC in summer but not in winter, your average will be
                lower than peak. Consider adding a backup for your highest-use
                month.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FaqBlock title="Frequently Asked Questions" faqs={FAQs} />
          </div>
        </section>

        {/* Related calculators */}
        <section className="mt-12">
          <RelatedCalculators current="/calculators/bill-analysis" />
        </section>
      </div>
    </>
  );
}
