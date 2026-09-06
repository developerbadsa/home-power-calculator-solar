"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8 text-sm text-slate-500">
        <p>{t("footer.trust")}</p>
        <p className="font-medium text-slate-400">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}