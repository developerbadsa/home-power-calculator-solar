/**
 * FAQ section for SEO calculator pages (§32 item 6, §77): visible details
 * cards plus FAQPage structured data. Server component.
 */
import { JsonLd } from "./json-ld";

export interface FaqItem {
  q: string;
  a: string;
}

export function FaqBlock({ title, faqs }: { title: string; faqs: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 py-10">
      <h2 id="faq-title" className="text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <div className="mt-6 space-y-2">
        {faqs.map((f) => (
          <details key={f.q} className="card">
            <summary className="cursor-pointer text-sm font-medium text-slate-900">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </section>
  );
}