"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const STEPS = [
  { key: "how.step1", n: 1 },
  { key: "how.step2", n: 2 },
  { key: "how.step3", n: 3 },
] as const;

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="how-title"
      className="border-t border-slate-200 bg-white/70 backdrop-blur-sm py-10"
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2 id="how-title" className="text-center text-xl font-semibold text-slate-900">
          {t("how.title")}
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {STEPS.map(({ key, n }) => (
            <div key={key} className="rounded-[4px] border border-slate-200 bg-slate-50 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-slate-900 text-sm font-medium text-white">
                {n}
              </span>
              <h3 className="mt-3 text-base font-medium text-slate-900">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{t(`${key}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GUIDES = [
  {
    href: "/guides/how-much-battery-do-i-need",
    titleKey: "guides.g1",
    descKey: "guides.g1.desc",
  },
  {
    href: "/guides/how-many-watts-can-a-1000va-ips-run",
    titleKey: "guides.g2",
    descKey: "guides.g2.desc",
  },
] as const;

export function Guides() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="guides-title"
      className="border-t border-slate-200 bg-white/70 backdrop-blur-sm py-10"
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2 id="guides-title" className="text-center text-xl font-semibold text-slate-900">
          {t("guides.title")}
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="block rounded-[4px] border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-900"
            >
              <h3 className="text-base font-medium text-slate-900">{t(g.titleKey)}</h3>
              <p className="mt-1 text-sm text-slate-500">{t(g.descKey)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 py-10 bg-white/70 backdrop-blur-sm rounded-lg">
      <h2 id="faq-title" className="text-center text-xl font-semibold text-slate-900">
        {t("faq.title")}
      </h2>
      <div className="mt-6 space-y-2">
        {([1, 2, 3, 4] as const).map((n) => (
          <details key={n} className="card">
            <summary className="cursor-pointer text-sm font-medium text-slate-900">
              {t(`faq.q${n}`)}
            </summary>
            <p className="mt-2 text-sm text-slate-600">{t(`faq.a${n}`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}