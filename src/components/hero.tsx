"use client";

import { Zap, ShieldCheck, Smartphone, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();

  const scrollToCalculator = () => {
    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-900/90 to-slate-800/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-14 text-center sm:pt-20">
        {/* Big, bold hero — instant clarity on what this tool does */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
          <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
          {t("hero.stats.appliances", { count: "35" })}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={scrollToCalculator}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-[4px] bg-white px-8 text-lg font-bold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl active:scale-[0.98]"
          >
            <Zap className="h-5 w-5" strokeWidth={2.5} />
            {t("hero.cta")}
          </button>
        </div>
        {/* Trust signals — kills objections instantly */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" strokeWidth={2} />
            {t("hero.trust.1")}
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="h-4 w-4 text-blue-400" strokeWidth={2} />
            {t("hero.trust.2")}
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-rose-400" strokeWidth={2} />
            {t("hero.trust.3")}
          </span>
        </div>
      </div>
    </section>
  );
}