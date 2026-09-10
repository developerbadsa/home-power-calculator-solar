"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const CALC_LINKS = [
  { href: "/calculators/battery", key: "footer.calc.battery" },
  { href: "/calculators/inverter", key: "footer.calc.inverter" },
  { href: "/calculators/solar", key: "footer.calc.solar" },
  { href: "/calculators/watt-to-amp", key: "footer.calc.wattToAmp" },
  { href: "/calculators/amp-to-watt", key: "footer.calc.ampToWatt" },
  { href: "/calculators/va-to-watt", key: "footer.calc.vaToWatt" },
  { href: "/calculators/bill-analysis", key: "footer.calc.billAnalysis" },
] as const;

const GUIDE_LINKS = [
  { href: "/guides/how-much-battery-do-i-need", key: "footer.guide.battery" },
  { href: "/guides/how-many-watts-can-a-1000va-ips-run", key: "footer.guide.1000va" },
] as const;

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 text-sm text-slate-500">
        <nav aria-label={t("footer.calculators")} className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">
            {t("footer.calculators")}
          </p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {CALC_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex py-1 text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("footer.guides")} className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">{t("footer.guides")}</p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {GUIDE_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex py-1 text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>{t("footer.trust")}</p>
        <p className="font-medium text-slate-400">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}