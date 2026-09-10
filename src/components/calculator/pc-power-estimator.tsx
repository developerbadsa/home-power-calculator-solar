"use client";

import { useState } from "react";
import { Cpu, Monitor, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PcEstimate {
  cpu: string;
  gpu: string;
  estimatedWatts: number;
}

// Common PC configurations in Bangladesh
const CPU_OPTIONS = [
  { id: "basic", label: "Basic (Celeron, Pentium, i3)", labelBn: "বেসিক (সেলেরন, পেন্টিয়াম, i3)", watts: 65 },
  { id: "mid", label: "Mid-range (i5, Ryzen 5)", labelBn: "মিড-রেঞ্জ (i5, Ryzen 5)", watts: 95 },
  { id: "high", label: "High-end (i7, i9, Ryzen 7/9)", labelBn: "হাই-এন্ড (i7, i9, Ryzen 7/9)", watts: 150 },
] as const;

const GPU_OPTIONS = [
  { id: "none", label: "No GPU (integrated graphics)", labelBn: "GPU নেই (ইন্টিগ্রেটেড)", watts: 0 },
  { id: "basic", label: "Basic GPU (GT 710, GT 1030)", labelBn: "বেসিক GPU (GT 710, GT 1030)", watts: 50 },
  { id: "mid", label: "Mid GPU (GTX 1650, RX 580)", labelBn: "মিড GPU (GTX 1650, RX 580)", watts: 150 },
  { id: "high", label: "Gaming GPU (RTX 3060+)", labelBn: "গেমিং GPU (RTX 3060+)", watts: 300 },
  { id: "pro", label: "Workstation GPU (RTX 4080+)", labelBn: "ওয়ার্কস্টেশন GPU (RTX 4080+)", watts: 500 },
] as const;

const PSU_OPTIONS = [
  { id: "350", label: "350W PSU", watts: 350 },
  { id: "450", label: "450W PSU", watts: 450 },
  { id: "550", label: "550W PSU", watts: 550 },
  { id: "650", label: "650W PSU", watts: 650 },
  { id: "750", label: "750W PSU", watts: 750 },
  { id: "850", label: "850W+ PSU", watts: 850 },
] as const;

interface Props {
  onSelect: (watts: number) => void;
  onSkip: () => void;
}

export function PcPowerEstimator({ onSelect, onSkip }: Props) {
  const { lang, t } = useI18n();
  const [cpu, setCpu] = useState<string>("mid");
  const [gpu, setGpu] = useState<string>("none");
  const [psu, setPsu] = useState<string | null>(null);

  const cpuWatts = CPU_OPTIONS.find((c) => c.id === cpu)?.watts ?? 95;
  const gpuWatts = GPU_OPTIONS.find((g) => g.id === gpu)?.watts ?? 0;
  const ramAndMisc = 30; // RAM, motherboard, fans, etc.
  const estimatedTotal = cpuWatts + gpuWatts + ramAndMisc;

  const handleApply = () => {
    // If user selected PSU, use that as the actual draw estimate
    // (PSU rating is usually higher than actual draw, but we use 80% as typical)
    if (psu) {
      const psuWatts = PSU_OPTIONS.find((p) => p.id === psu)?.watts ?? estimatedTotal;
      onSelect(Math.round(psuWatts * 0.65)); // ~65% of PSU rating is typical draw
    } else {
      onSelect(estimatedTotal);
    }
  };

  return (
    <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber-600" />
        <p className="text-sm font-medium text-amber-800">
          {t("pcEstimator.title")}
        </p>
      </div>
      <p className="text-xs text-amber-700">
        {t("pcEstimator.subtitle")}
      </p>

      {/* CPU selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Cpu className="h-4 w-4" />
          {t("pcEstimator.cpu")}
        </label>
        <div className="grid gap-1.5">
          {CPU_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCpu(opt.id)}
              className={`flex items-center justify-between rounded-[4px] border px-3 py-2 text-left text-sm transition-colors ${
                cpu === opt.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span>{lang === "bn" ? opt.labelBn : opt.label}</span>
              <span className="text-xs opacity-70">{opt.watts}W</span>
            </button>
          ))}
        </div>
      </div>

      {/* GPU selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Monitor className="h-4 w-4" />
          {t("pcEstimator.gpu")}
        </label>
        <div className="grid gap-1.5">
          {GPU_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setGpu(opt.id)}
              className={`flex items-center justify-between rounded-[4px] border px-3 py-2 text-left text-sm transition-colors ${
                gpu === opt.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span>{lang === "bn" ? opt.labelBn : opt.label}</span>
              <span className="text-xs opacity-70">{opt.watts > 0 ? `+${opt.watts}W` : "—"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional PSU rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          {t("pcEstimator.psuOptional")}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PSU_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPsu(psu === opt.id ? null : opt.id)}
              className={`rounded-[4px] border px-3 py-1.5 text-xs font-medium transition-colors ${
                psu === opt.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result + Actions */}
      <div className="flex items-center justify-between rounded-[4px] border border-slate-200 bg-white p-3">
        <div>
          <p className="text-xs text-slate-500">{t("pcEstimator.estimated")}</p>
          <p className="text-lg font-bold text-slate-900">
            ~{psu
              ? Math.round((PSU_OPTIONS.find((p) => p.id === psu)?.watts ?? estimatedTotal) * 0.65)
              : estimatedTotal}W
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="btn-secondary text-xs"
          >
            {t("pcEstimator.skip")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn-primary text-xs"
          >
            {t("pcEstimator.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
