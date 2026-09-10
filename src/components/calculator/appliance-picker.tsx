"use client";

import { useMemo, useState } from "react";
import {
  Fan,
  Lightbulb,
  Tv,
  Refrigerator,
  Wifi,
  Cctv,
  Droplets,
  Snowflake,
  Laptop,
  Plug,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  ACTIVE_APPLIANCES,
  CATEGORY_LABELS,
  POPULAR_APPLIANCE_IDS,
  type ApplianceCategory,
} from "@/data/appliances";
import { formatWatts } from "@/lib/formatting";
import { ASSUMPTIONS } from "@/domain/config/assumptions";
import { createUid } from "@/lib/uid";
import type { WizardItem } from "./calculator-wizard";

const CATEGORY_ORDER: ApplianceCategory[] = [
  "fan",
  "light",
  "entertainment",
  "kitchen",
  "cooling",
  "electronics",
  "security",
  "pump",
  "office",
  "other",
];

const ICONS: Record<string, typeof Plug> = {
  "ceiling-fan": Fan,
  "led-bulb": Lightbulb,
  "led-tv": Tv,
  refrigerator: Refrigerator,
  "wifi-router": Wifi,
  "cctv-camera": Cctv,
  "water-pump-1hp": Droplets,
  "ac-1-ton": Snowflake,
  laptop: Laptop,
};

interface Props {
  onAdd: (item: WizardItem) => void;
}

export function AppliancePicker({ onAdd }: Props) {
  const { lang, t } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ApplianceCategory | "all">("all");
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState({ name: "", watts: "", hours: "6" });
  const [customError, setCustomError] = useState<string | null>(null);

  const popular = useMemo(
    () =>
      POPULAR_APPLIANCE_IDS.map((id) => getById(id)).filter(
        (s): s is NonNullable<ReturnType<typeof getById>> => Boolean(s),
      ),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ACTIVE_APPLIANCES.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.nameBn.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const addAppliance = (id: string) => {
    const spec = getById(id);
    if (!spec) return;
    onAdd({
      uid: createUid(),
      applianceId: spec.id,
      name: lang === "bn" ? spec.nameBn : spec.name,
      isCustom: false,
      watts: spec.typicalWatts,
      quantity: 1,
      hoursPerDay: spec.defaultHoursPerDay,
      typicalWatts: spec.typicalWatts,
      minWatts: spec.minWatts,
      maxWatts: spec.maxWatts,
      surgeCategory: spec.surgeCategory,
      surgeFactor: spec.surgeFactor,
    });
  };

  const addCustom = () => {
    const name = custom.name.trim();
    const watts = Number(custom.watts);
    const hours = Number(custom.hours);
    if (!name) {
      setCustomError(t("custom.err.name"));
      return;
    }
    if (!Number.isFinite(watts) || watts < 1 || watts > ASSUMPTIONS.maxWatts) {
      setCustomError(t("custom.err.watts", { max: ASSUMPTIONS.maxWatts }));
      return;
    }
    if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
      setCustomError(t("custom.err.hours"));
      return;
    }
    onAdd({
      uid: createUid(),
      applianceId: "custom",
      name,
      isCustom: true,
      watts,
      quantity: 1,
      hoursPerDay: hours,
    });
    setCustom({ name: "", watts: "", hours: "6" });
    setCustomError(null);
    setShowCustom(false);
  };

  return (
    <div id="popular-appliances" className="space-y-4">
      {/* ── Popular: big tap cards (the 5-second path) ─────────────────── */}
      <div>
        <p className="field-label mb-2">{t("picker.popular")}</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {popular.map((a) => {
            const Icon = ICONS[a.id] ?? Plug;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => addAppliance(a.id)}
                  className="flex w-full items-center gap-3 rounded-[4px] border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-900 hover:bg-slate-50 active:scale-[0.98]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-slate-100 text-slate-700">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-base font-medium leading-snug text-slate-900">
                      {lang === "bn" ? a.nameBn : a.name}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Toggle: the full catalog stays out of the way ───────────────── */}
      <button
        type="button"
        onClick={() => setShowAll((s) => !s)}
        aria-expanded={showAll}
        className="btn-ghost w-full"
      >
        {showAll ? (
          <>
            <ChevronUp className="h-4 w-4" strokeWidth={1.75} />
            {t("picker.seeLess")}
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
            {t("picker.seeAll", { count: ACTIVE_APPLIANCES.length })}
          </>
        )}
      </button>

      {showAll ? (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("step.appliances.searchPlaceholder")}
              aria-label={t("step.appliances.searchPlaceholder")}
              className="field-input pl-9"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category">
            <button
              type="button"
              className={`chip ${category === "all" ? "chip-active" : "chip-idle"}`}
              onClick={() => setCategory("all")}
            >
              {lang === "bn" ? "সব" : "All"}
            </button>
            {CATEGORY_ORDER.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${category === c ? "chip-active" : "chip-idle"}`}
                onClick={() => setCategory(c)}
              >
                {lang === "bn" ? CATEGORY_LABELS[c].bn : CATEGORY_LABELS[c].en}
              </button>
            ))}
          </div>

          {/* Appliance grid */}
          {filtered.length > 0 ? (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filtered.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => addAppliance(a.id)}
                    className="flex h-full w-full flex-col items-start gap-1 rounded-[4px] border border-slate-200 bg-white p-3 text-left transition-colors hover:border-slate-900 hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium leading-snug text-slate-900">
                      {lang === "bn" ? a.nameBn : a.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {t("custom.typicalHint", { watts: formatWatts(a.typicalWatts) })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-[4px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
              <div className="mb-3 rounded-[4px] bg-slate-100 p-3">
                <Search className="h-6 w-6 text-slate-400" strokeWidth={1.25} />
              </div>
              <p className="mb-1 text-base font-medium text-slate-900">
                {t("search.emptyTitle")}
              </p>
              <p className="max-w-sm text-sm text-slate-500">
                {t("step.appliances.noMatches")}
              </p>
            </div>
          )}

          {/* Custom appliance */}
          <div className="rounded-[4px] border border-dashed border-slate-300 bg-slate-50 p-3">
            {!showCustom ? (
              <button
                type="button"
                onClick={() => setShowCustom(true)}
                className="btn-ghost w-full"
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                {t("step.appliances.custom")}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="col-span-2 flex flex-col gap-1">
                    <span className="field-label">{t("custom.name")}</span>
                    <input
                      type="text"
                      value={custom.name}
                      onChange={(e) => setCustom({ ...custom, name: e.target.value })}
                      placeholder={t("custom.namePlaceholder")}
                      className="field-input"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="field-label">{t("custom.watts")}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={1}
                      value={custom.watts}
                      onChange={(e) => setCustom({ ...custom, watts: e.target.value })}
                      className="field-input"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="field-label">{t("custom.hours")}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={24}
                      step={0.5}
                      value={custom.hours}
                      onChange={(e) => setCustom({ ...custom, hours: e.target.value })}
                      className="field-input"
                    />
                  </label>
                </div>
                {customError ? (
                  <p className="text-xs text-rose-600" role="alert">
                    {customError}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addCustom}
                    className="btn-primary flex-1"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                    {t("custom.add")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustom(false);
                      setCustomError(null);
                    }}
                    className="btn-secondary"
                    aria-label={t("back")}
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getById(id: string) {
  return ACTIVE_APPLIANCES.find((a) => a.id === id);
}