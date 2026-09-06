"use client";

import { Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();

  const scrollToCalculator = () => {
    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-10 pt-12 text-center sm:pt-16">
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={scrollToCalculator}
            className="btn-primary w-full max-w-sm"
          >
            <Zap className="h-4 w-4" strokeWidth={2} />
            {t("hero.cta")}
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            {(["home", "battery", "ips", "solar"] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={scrollToCalculator}
                className="chip chip-idle"
              >
                {t(`hero.quick.${q}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}