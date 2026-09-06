"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useI18n();

  const toggle = (next: Lang) => setLang(next);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-slate-900 text-white">
            <Zap className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-slate-900">{t("nav.brand")}</span>
            <span className="block text-xs text-slate-500">{t("nav.tagline")}</span>
          </span>
        </Link>

        <div
          role="group"
          aria-label="Language"
          className="flex rounded-[4px] border border-slate-200 bg-slate-100 p-0.5"
        >
          {(["en", "bn"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => toggle(l)}
              aria-pressed={lang === l}
              className={`rounded-[4px] px-3 py-1.5 text-sm font-medium transition-colors ${
                lang === l
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {l === "en" ? "EN" : "বাংলা"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}