"use client";

import { useState } from "react";
import {
  BatteryCharging,
  Plug,
  Sun,
  Pencil,
  Link,
  Check,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { formatAh, formatEnergy, formatHours, formatNumber, formatWatts } from "@/lib/formatting";
import type {
  BackupTier,
  CalculationResult,
  CalculationSettings,
} from "@/domain/calculations/types";
import { WarningCard } from "./warning-card";
import { AdvancedSettings } from "./advanced-settings";

interface Props {
  result: CalculationResult;
  shareUrl: string;
  onEditAppliances: () => void;
  onEditBackup: () => void;
  onTierChange: (tier: BackupTier) => void;
  settings: CalculationSettings;
  onSettingsChange: (patch: Partial<CalculationSettings>) => void;
}

const TIERS: BackupTier[] = ["budget", "recommended", "heavy"];

export function ResultView({
  result,
  shareUrl,
  onEditAppliances,
  onEditBackup,
  onTierChange,
  settings,
  onSettingsChange,
}: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const battery = result.battery.practical;
  const inverter = result.inverter;
  const solar = result.solar;

  const solarLine = t("result.explain.solar", {
    energy: formatEnergy(result.dailyEnergyWh),
    solar: formatWatts(solar.recommendedWatts),
  });
  const explanation = t("result.explain", {
    load: formatWatts(result.totalLoadW),
    backup: formatHours(result.input.backupHours),
    battery: battery.label,
    inverter: inverter.label,
    solarLine,
  });

  const shareText = t("result.share.text", {
    battery: battery.label,
    inverter: inverter.label,
    solar: formatWatts(solar.recommendedWatts),
    link: shareUrl,
  });

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    toast.success(t("result.share.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* ── One dominant recommendation card (5-second read) ────────────── */}
      <div className="rounded-[4px] border border-slate-900 bg-slate-900 p-6 text-white">
        <p className="mb-4 text-center text-sm font-medium text-slate-300">{t("result.youNeed")}</p>
        <div className="grid grid-cols-3 gap-3">
          <BigValue icon={BatteryCharging} value={battery.label} sub={battery.configuration} label={t("result.batteryLabel")} />
          <BigValue icon={Plug} value={inverter.label} label={t("result.ipsLabel")} />
          <BigValue icon={Sun} value={formatWatts(solar.recommendedWatts)} label={t("result.solarLabel")} />
        </div>
        <div className="mt-4 border-t border-slate-700 pt-3 text-center text-sm text-slate-200">
          {t("result.summaryLine", { load: formatWatts(result.totalLoadW), hours: formatHours(result.input.backupHours), energy: formatEnergy(result.dailyEnergyWh) })}
        </div>
      </div>

      {/* ── Share right at the moment of value (§67) ────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="btn h-11 flex-1 bg-[#25D366] px-4 text-white hover:bg-[#1fb857]"
        >
          <WhatsAppIcon /> {t("result.share.whatsapp")}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="btn-secondary flex-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" strokeWidth={1.75} /> {t("result.share.copied")}
            </>
          ) : (
            <>
              <Link className="h-4 w-4" strokeWidth={1.75} /> {t("result.share.copy")}
            </>
          )}
        </button>
      </div>

      {/* Warnings (§21, §40) — visible, not hidden */}
      {result.warnings.length > 0 ? (
        <div className="space-y-2">
          {result.warnings.map((w) => (
            <WarningCard key={w.code} warning={w} />
          ))}
        </div>
      ) : null}

      {/* Why this result (§15) — friendly explanation */}
      <div className="rounded-[4px] border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm leading-relaxed text-blue-800">{explanation}</p>
      </div>

      {/* Backup level (§25) — compact */}
      <div>
        <p className="field-label mb-2">{t("result.tier.label")}</p>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => onTierChange(tier)}
              aria-pressed={result.tier === tier}
              className={`card flex flex-col items-center gap-0.5 py-3 text-center transition-colors ${
                result.tier === tier
                  ? "border-slate-900 ring-1 ring-slate-900"
                  : "hover:border-slate-400"
              }`}
            >
              <span className="text-sm font-medium text-slate-900">{t(`tier.${tier}`)}</span>
              <span className="text-xs leading-tight text-slate-500">
                {t(`tier.${tier}.desc`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Edit */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onEditAppliances} className="btn-secondary">
          <Pencil className="h-4 w-4" strokeWidth={1.75} />
          {t("result.editAppliances")}
        </button>
        <button type="button" onClick={onEditBackup} className="btn-secondary">
          {t("result.editBackup")}
        </button>
      </div>

      {/* How we calculated (§16 — collapsed) */}
      <details className="card group">
        <summary className="flex cursor-pointer items-center text-sm font-medium text-slate-900">
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1.75} />
          {t("result.how")}
        </summary>
        <div className="mt-3 space-y-3 text-sm text-slate-600">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>{t("result.how.load")}</li>
            <li>{t("result.how.energy")}</li>
            <li>
              {t("result.how.battery", {
                theoretical: formatAh(result.battery.theoreticalAh),
              })}
            </li>
            <li>{t("result.how.inverter")}</li>
            <li>{t("result.how.solar")}</li>
          </ul>
          <div>
            <p className="font-medium text-slate-700">{t("result.how.assumptions")}</p>
            <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
              <dt className="text-slate-400">{t("advanced.voltage")}:</dt>
              <dd>{result.usedSettings.systemVoltage ? `${result.usedSettings.systemVoltage}V` : t("advanced.voltage.auto")}</dd>
              <dt className="text-slate-400">{t("advanced.dod")}:</dt>
              <dd>{formatNumber(result.usedSettings.depthOfDischarge, 2)}</dd>
              <dt className="text-slate-400">{t("advanced.invEff")}:</dt>
              <dd>{formatNumber(result.usedSettings.inverterEfficiency, 2)}</dd>
              <dt className="text-slate-400">{t("advanced.battEff")}:</dt>
              <dd>{formatNumber(result.usedSettings.batteryEfficiency, 2)}</dd>
              <dt className="text-slate-400">{t("advanced.margin")}:</dt>
              <dd>{formatNumber(result.usedSettings.safetyMargin, 2)}</dd>
              <dt className="text-slate-400">{t("advanced.psh")}:</dt>
              <dd>{formatNumber(result.usedSettings.peakSunHours, 1)}</dd>
              <dt className="text-slate-400">{t("advanced.pf")}:</dt>
              <dd>{formatNumber(result.usedSettings.powerFactor, 2)}</dd>
              <dt className="text-slate-400">{t("advanced.solarDerating")}:</dt>
              <dd>{formatNumber(result.usedSettings.solarDerating, 2)}</dd>
            </dl>
            <p className="mt-2 text-xs text-slate-400">
              v{result.engineVersion} · assumptions v{result.assumptionsVersion}
            </p>
          </div>
        </div>
      </details>

      {/* Advanced settings (§9) */}
      <details className="card group">
        <summary className="flex cursor-pointer items-center text-sm font-medium text-slate-900">
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1.75} />
          {t("result.advanced")}
        </summary>
        <p className="mt-1 text-xs text-slate-500">{t("result.advanced.subtitle")}</p>
        <div className="mt-3">
          <AdvancedSettings settings={settings} onChange={onSettingsChange} />
        </div>
      </details>

      <p className="text-xs leading-relaxed text-slate-400">
        {t("result.estimates")} {t("warning.note")}
      </p>
    </div>
  );
}

function BigValue({
  icon: Icon,
  value,
  sub,
  label,
}: {
  icon: typeof Plug;
  value: string;
  sub?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-slate-700/70 text-slate-100">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
      {label ? <span className="text-xs font-medium text-slate-400">{label}</span> : null}
      <span className="text-xl font-bold leading-tight">{value}</span>
      {sub ? <span className="text-xs text-slate-300">{sub}</span> : null}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}