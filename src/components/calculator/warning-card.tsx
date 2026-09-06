"use client";

import { Zap, Building2, BatteryLow, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatNumber, formatVa } from "@/lib/formatting";
import type { Warning } from "@/domain/calculations/types";

interface Props {
  warning: Warning;
}

export function WarningCard({ warning }: Props) {
  const { t } = useI18n();

  if (warning.code === "surge") {
    const names = (warning.applianceNames ?? []).join(", ");
    const suggested = warning.data?.suggestedVA
      ? formatVa(Number(warning.data.suggestedVA))
      : null;
    return (
      <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4" role="note">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-amber-100 text-amber-700">
            <Zap className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="space-y-1 text-sm text-amber-800">
            <p className="font-medium">{t("warning.surge.title")}</p>
            <p>{t("warning.surge.body", { names })}</p>
            {suggested ? (
              <p className="font-medium">
                {t("warning.surge.suggest", { va: suggested })}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (warning.code === "large-system") {
    return (
      <div className="rounded-[4px] border border-rose-200 bg-rose-50 p-4" role="note">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-rose-100 text-rose-700">
            <Building2 className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="space-y-1 text-sm text-rose-700">
            <p className="font-medium">{t("warning.large-system.title")}</p>
            <p>
              {t("warning.large-system.body", {
                load: formatNumber(Number(warning.data?.load ?? 0)),
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (warning.code === "very-large-system") {
    return (
      <div className="rounded-[4px] border border-rose-200 bg-rose-50 p-4" role="note">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-rose-100 text-rose-700">
            <BatteryLow className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="space-y-1 text-sm text-rose-700">
            <p className="font-medium">{t("warning.very-large-system.title")}</p>
            <p>{t("warning.very-large-system.body")}</p>
          </div>
        </div>
      </div>
    );
  }

  // unusual-wattage
  const direction =
    warning.data?.direction === "high"
      ? t("warning.direction.high")
      : t("warning.direction.low");
  return (
    <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4" role="note">
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-amber-100 text-amber-700">
          <Search className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <p className="text-sm text-amber-800">
          {t("warning.unusual-wattage.body", {
            name: (warning.applianceNames ?? [])[0] ?? "",
            direction,
          })}
        </p>
      </div>
    </div>
  );
}